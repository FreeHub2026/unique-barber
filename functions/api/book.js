import { loadConfig, isValidDate, isValidTime, slotsOverlap, kvKeyForDate, weekdayOf, totalDuration, entryDuration } from "../_shared/config.js";

// POST /api/book
// body: { date, time, barber ("endri"|"aldo"|"any"), serviceIds: [...], customerName, customerPhone }
export async function onRequestPost({ request, env }) {
  let body;
  try {
    body = await request.json();
  } catch {
    return json({ error: "Kërkesë e pavlefshme." }, 400);
  }

  const { date, time, barber, serviceIds, customerName, customerPhone } = body || {};
  const config = await loadConfig(request, env);

  if (!isValidDate(date)) return json({ error: "Datë e pavlefshme." }, 400);
  if (!isValidTime(time)) return json({ error: "Orë e pavlefshme." }, 400);
  if (!barber || (barber !== "any" && !config.barberIds.includes(barber))) {
    return json({ error: "Berber i pavlefshëm." }, 400);
  }
  if (!Array.isArray(serviceIds) || serviceIds.length === 0 || !serviceIds.every(id => config.servicesById[id])) {
    return json({ error: "Shërbim i pavlefshëm." }, 400);
  }
  if (!customerName || !String(customerName).trim()) {
    return json({ error: "Emri mungon." }, 400);
  }
  if (!customerPhone || !String(customerPhone).trim()) {
    return json({ error: "Numri i telefonit mungon." }, 400);
  }

  if (isInThePast(date, time)) {
    return json({ error: "Nuk mund të rezervosh një orë që ka kaluar." }, 400);
  }
  if (weekdayOf(date) === config.hours.closedWeekday) {
    return json({ error: "Atë ditë jemi mbyllur." }, 400);
  }

  const duration = totalDuration(config, serviceIds);
  const key = kvKeyForDate(date);
  const raw = await env.BOOKINGS_KV.get(key);
  const entries = raw ? JSON.parse(raw) : [];

  const candidates = barber === "any" ? config.barberIds : [barber];
  let assignedBarber = null;

  for (const candidate of candidates) {
    const conflict = entries.some(e =>
      e.barber === candidate &&
      slotsOverlap(e.time, entryDuration(config, e), time, duration)
    );
    if (!conflict) {
      assignedBarber = candidate;
      break;
    }
  }

  if (!assignedBarber) {
    return json({ error: "Kjo orë u zu ndërkohë. Zgjidh një orë tjetër." }, 409);
  }

  const entry = {
    id: crypto.randomUUID(),
    type: "booking",
    barber: assignedBarber,
    serviceIds,
    time,
    customerName: String(customerName).trim(),
    customerPhone: String(customerPhone).trim(),
    createdAt: new Date().toISOString()
  };
  entries.push(entry);
  await env.BOOKINGS_KV.put(key, JSON.stringify(entries));

  await notifyTelegram(env, config, entry, date, assignedBarber);

  return json({ ok: true, barber: assignedBarber }, 200);
}

// Compares against "now" in Europe/Tirane (not server/UTC time — Workers
// run in UTC, which would be off by Albania's +1/+2 offset otherwise).
function isInThePast(date, time) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Tirane",
    year: "numeric", month: "2-digit", day: "2-digit",
    hour: "2-digit", minute: "2-digit", hourCycle: "h23"
  }).formatToParts(new Date());
  const get = (type) => parts.find(p => p.type === type).value;
  const todayStr = `${get("year")}-${get("month")}-${get("day")}`;
  const nowMinutes = Number(get("hour")) * 60 + Number(get("minute"));

  if (date > todayStr) return false;
  if (date < todayStr) return true;
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m < nowMinutes - 5;
}

async function notifyTelegram(env, config, entry, date, barberId) {
  const token = env.TELEGRAM_BOT_TOKEN;
  const chatId = env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) {
    console.error("Telegram not configured — set TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID.");
    return;
  }
  const services = entry.serviceIds.map(id => config.servicesById[id]);
  const serviceLines = services.map(s => `${s.name} (${s.price} Lekë)`).join(", ");
  const barberName = config.barbers.find(b => b.id === barberId)?.name || barberId;
  const text =
    `✂️ Rezervim i ri!\n` +
    `Berberi: ${barberName}\n` +
    `Shërbimet: ${serviceLines}\n` +
    `Data: ${date} ora ${entry.time}\n` +
    `Klienti: ${entry.customerName}\n` +
    `Telefoni: ${entry.customerPhone}`;

  try {
    await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text })
    });
  } catch (e) {
    console.error("Telegram notify failed", e);
  }
}

function json(body, status) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" }
  });
}
