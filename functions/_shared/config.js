// Single source of truth for shop content (services, barbers, hours, etc.)
// is config.json at the project root — edit that file only. This module
// just loads it (same-origin static asset, safe to fetch from a Function)
// and provides small pure helpers used to validate bookings.

export async function loadConfig(request, env) {
  const configUrl = new URL("/config.json", request.url);
  const res = await env.ASSETS.fetch(configUrl.toString());
  const config = await res.json();

  return {
    ...config,
    barberIds: config.barbers.map(b => b.id),
    serviceDurations: Object.fromEntries(config.services.map(s => [s.id, s.duration])),
    servicesById: Object.fromEntries(config.services.map(s => [s.id, { name: s.name, price: s.price }])),
    defaultDuration: config.hours.slotMinutes
  };
}

export function timeToMinutes(t) {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
}

export function minutesToTime(min) {
  const h = String(Math.floor(min / 60)).padStart(2, "0");
  const m = String(min % 60).padStart(2, "0");
  return `${h}:${m}`;
}

export function generateSlots(hours, durationMinutes) {
  const duration = durationMinutes || hours.slotMinutes;
  const openMin = timeToMinutes(hours.open);
  const closeMin = timeToMinutes(hours.close);
  const lunchStartMin = timeToMinutes(hours.lunchStart);
  const lunchEndMin = timeToMinutes(hours.lunchEnd);
  const slots = [];
  for (let t = openMin; t + duration <= closeMin; t += hours.slotMinutes) {
    const slotEnd = t + duration;
    const overlapsLunch = t < lunchEndMin && slotEnd > lunchStartMin;
    if (overlapsLunch) continue;
    slots.push(minutesToTime(t));
  }
  return slots;
}

export function isValidDate(dateStr) {
  return /^\d{4}-\d{2}-\d{2}$/.test(dateStr) && !isNaN(new Date(dateStr + "T00:00:00").getTime());
}

export function isValidTime(timeStr) {
  return /^([01]\d|2[0-3]):[0-5]\d$/.test(timeStr);
}

// Two entries overlap if their [start, start+duration) ranges intersect.
export function slotsOverlap(timeA, durationA, timeB, durationB) {
  const startA = timeToMinutes(timeA);
  const endA = startA + durationA;
  const startB = timeToMinutes(timeB);
  const endB = startB + durationB;
  return startA < endB && startB < endA;
}

export function kvKeyForDate(date) {
  return `bookings:${date}`;
}

// Weekday (0-6, Sunday=0) for a YYYY-MM-DD date string, as a plain calendar
// date with no timezone involved — safe to use directly server-side.
export function weekdayOf(dateStr) {
  const [y, m, d] = dateStr.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d)).getUTCDay();
}
