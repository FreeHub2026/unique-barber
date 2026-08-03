import { loadConfig, isValidDate, kvKeyForDate } from "../_shared/config.js";

// POST /api/cancel
// Two-step, no login required — a customer proves ownership of a booking by
// knowing the date + phone number they booked with (not a security-sensitive
// enough scenario to need accounts for a small local barbershop).
// body: { date, phone, action: "find" }
//    -> { bookings: [{ time, barber, barberName, services }] }
// body: { date, phone, time, barber, action: "cancel" }
//    -> { ok: true } — removes that specific booking entry
export async function onRequestPost({ request, env }) {
  let body;
  try {
    body = await request.json();
  } catch {
    return json({ error: "Kërkesë e pavlefshme." }, 400);
  }

  const { date, phone, action, time, barber } = body || {};

  if (!isValidDate(date)) return json({ error: "Datë e pavlefshme." }, 400);
  if (!phone || !String(phone).trim()) return json({ error: "Numri i telefonit mungon." }, 400);

  const config = await loadConfig(request, env);
  const key = kvKeyForDate(date);
  const raw = await env.BOOKINGS_KV.get(key);
  const entries = raw ? JSON.parse(raw) : [];
  const phoneNorm = String(phone).trim();

  if (action === "find") {
    const matches = entries
      .filter(e => e.type === "booking" && e.customerPhone === phoneNorm)
      .map(e => ({
        time: e.time,
        barber: e.barber,
        barberName: config.barbers.find(b => b.id === e.barber)?.name || e.barber,
        services: (e.serviceIds || []).map(id => config.servicesById[id]?.name).filter(Boolean)
      }));
    return json({ bookings: matches }, 200);
  }

  if (action === "cancel") {
    const idx = entries.findIndex(e =>
      e.type === "booking" && e.customerPhone === phoneNorm && e.time === time && e.barber === barber
    );
    if (idx === -1) return json({ error: "Nuk u gjet rezervimi." }, 404);
    entries.splice(idx, 1);
    await env.BOOKINGS_KV.put(key, JSON.stringify(entries));
    return json({ ok: true }, 200);
  }

  return json({ error: "Veprim i pavlefshëm." }, 400);
}

function json(body, status) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" }
  });
}
