import { loadConfig, isValidDate, isValidTime, slotsOverlap, kvKeyForDate, weekdayOf } from "../_shared/config.js";

// POST /api/block — PIN-protected: lets a barber mark a slot as taken
// (booked in person) or clear a block they made earlier.
// body: { date, time, barber, pin, action: "block" | "unblock" }
export async function onRequestPost({ request, env }) {
  let body;
  try {
    body = await request.json();
  } catch {
    return json({ error: "Kërkesë e pavlefshme." }, 400);
  }

  const { date, time, barber, pin, action } = body || {};

  if (!env.BARBER_PIN) {
    return json({ error: "PIN nuk është konfiguruar në server." }, 500);
  }
  if (!pin || pin !== env.BARBER_PIN) {
    return json({ error: "PIN i gabuar." }, 401);
  }

  const config = await loadConfig(request, env);

  if (!isValidDate(date)) return json({ error: "Datë e pavlefshme." }, 400);
  if (!isValidTime(time)) return json({ error: "Orë e pavlefshme." }, 400);
  if (!config.barberIds.includes(barber)) return json({ error: "Berber i pavlefshëm." }, 400);
  if (action !== "block" && action !== "unblock") return json({ error: "Veprim i pavlefshëm." }, 400);
  if (action === "block" && weekdayOf(date) === config.hours.closedWeekday) {
    return json({ error: "Atë ditë jemi mbyllur." }, 400);
  }

  const key = kvKeyForDate(date);
  const raw = await env.BOOKINGS_KV.get(key);
  let entries = raw ? JSON.parse(raw) : [];

  if (action === "unblock") {
    entries = entries.filter(e => !(e.type === "block" && e.barber === barber && e.time === time));
    await env.BOOKINGS_KV.put(key, JSON.stringify(entries));
    return json({ ok: true }, 200);
  }

  const conflict = entries.some(e =>
    e.barber === barber && slotsOverlap(e.time, config.defaultDuration, time, config.defaultDuration)
  );
  if (conflict) {
    return json({ error: "Kjo orë është zënë tashmë." }, 409);
  }

  entries.push({
    id: crypto.randomUUID(),
    type: "block",
    barber,
    time,
    createdAt: new Date().toISOString()
  });
  await env.BOOKINGS_KV.put(key, JSON.stringify(entries));

  return json({ ok: true }, 200);
}

function json(body, status) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" }
  });
}
