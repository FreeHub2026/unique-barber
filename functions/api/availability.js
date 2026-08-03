import { loadConfig, timeToMinutes, minutesToTime, isValidDate, kvKeyForDate } from "../_shared/config.js";

// GET /api/availability?date=YYYY-MM-DD
// Returns { endri: ["09:00", "09:30", ...], aldo: [...] } — every slotMinutes-
// granularity start time that's already occupied (booking or barber block)
// for that barber on that date, expanded across each entry's duration.
export async function onRequestGet({ request, env }) {
  const url = new URL(request.url);
  const date = url.searchParams.get("date");

  if (!isValidDate(date)) {
    return json({ error: "Datë e pavlefshme." }, 400);
  }

  const config = await loadConfig(request);
  const raw = await env.BOOKINGS_KV.get(kvKeyForDate(date));
  const entries = raw ? JSON.parse(raw) : [];

  const result = {};
  for (const barberId of config.barberIds) {
    const taken = new Set();
    for (const entry of entries) {
      if (entry.barber !== barberId) continue;
      const duration = config.serviceDurations[entry.serviceId] || config.defaultDuration;
      const start = timeToMinutes(entry.time);
      for (let t = start; t < start + duration; t += config.hours.slotMinutes) {
        taken.add(minutesToTime(t));
      }
    }
    result[barberId] = [...taken].sort();
  }

  return json(result, 200);
}

function json(body, status) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" }
  });
}
