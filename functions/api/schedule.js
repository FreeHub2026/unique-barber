import { loadConfig, isValidDate, kvKeyForDate } from "../_shared/config.js";

// POST /api/schedule — PIN-protected: lets a barber see their own day,
// bookings (with customer details) and manual blocks alike.
// body: { date, barber, pin }
export async function onRequestPost({ request, env }) {
  let body;
  try {
    body = await request.json();
  } catch {
    return json({ error: "Kërkesë e pavlefshme." }, 400);
  }

  const { date, barber, pin } = body || {};

  if (!env.BARBER_PIN) return json({ error: "PIN nuk është konfiguruar në server." }, 500);
  if (!pin || pin !== env.BARBER_PIN) return json({ error: "PIN i gabuar." }, 401);

  if (!isValidDate(date)) return json({ error: "Datë e pavlefshme." }, 400);
  const config = await loadConfig(request, env);
  if (!config.barberIds.includes(barber)) return json({ error: "Berber i pavlefshëm." }, 400);

  const key = kvKeyForDate(date);
  const raw = await env.BOOKINGS_KV.get(key);
  const entries = raw ? JSON.parse(raw) : [];

  // Frontend already has config.json loaded (names, durations, i18n) — hand
  // back raw serviceIds rather than resolving/localizing names here.
  const results = entries
    .filter(e => e.barber === barber)
    .map(e => ({
      type: e.type,
      time: e.time,
      customerName: e.type === "booking" ? e.customerName : null,
      customerPhone: e.type === "booking" ? e.customerPhone : null,
      customerNotes: e.type === "booking" ? (e.customerNotes || "") : "",
      serviceIds: e.type === "booking" ? (e.serviceIds || []) : []
    }))
    .sort((a, b) => a.time.localeCompare(b.time));

  return json({ entries: results }, 200);
}

function json(body, status) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" }
  });
}
