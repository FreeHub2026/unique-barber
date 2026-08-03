/* =========================================================================
   UNIQUE BARBER — booking logic
   -------------------------------------------------------------------------
   Everything you (Endri/Aldo) would want to change — phone number, social
   links, services/prices, barbers, opening hours, gallery photos — lives
   in ONE place: config.json, next to this file. Edit that file, save,
   redeploy. Nothing in script.js needs to change for those kinds of edits,
   including adding a new barber or a new service.
   ========================================================================= */

let CONFIG = null;

const state = {
  services: [],
  barber: null,
  date: null,
  time: null,
  barberMode: false,
  pin: sessionStorage.getItem("ub_pin") || null,
  availability: {} // { endri: ["09:00", ...], aldo: [...] }
};

document.addEventListener("DOMContentLoaded", async () => {
  const res = await fetch("config.json");
  CONFIG = await res.json();

  renderStaticContent();
  renderServiceOptions();
  renderProducts();
  renderBarberOptions();
  setupDateInput();
  updateOpenStatus();
  setInterval(updateOpenStatus, 60 * 1000);
  wireBookingButton();
  wireBarberMode();
});

/* ---------- Render content from CONFIG ---------- */

function renderStaticContent() {
  document.getElementById("footer-year").textContent = new Date().getFullYear();
  document.getElementById("footer-address").textContent = CONFIG.address;

  const telHref = `tel:+${CONFIG.phoneIntl}`;
  const phoneLink = document.getElementById("footer-phone");
  phoneLink.href = telHref;
  phoneLink.textContent = CONFIG.phoneDisplay;
  document.getElementById("hero-call").href = telHref;

  if (CONFIG.heroPhoto) {
    document.getElementById("hero-photo").style.backgroundImage = `url("${CONFIG.heroPhoto}")`;
  }

  const socialWrap = document.getElementById("social-links");
  const icons = { instagram: "📷", facebook: "📘", tiktok: "🎵" };
  Object.entries(CONFIG.social).forEach(([key, url]) => {
    if (!url) return;
    const a = document.createElement("a");
    a.href = url;
    a.target = "_blank";
    a.rel = "noopener";
    a.title = key;
    a.textContent = icons[key] || "🔗";
    socialWrap.appendChild(a);
  });

  const galleryGrid = document.getElementById("gallery-grid");
  const galleryNote = document.getElementById("gallery-note");
  if (CONFIG.galleryPhotos.length) {
    galleryNote.classList.add("hidden");
    CONFIG.galleryPhotos.forEach((src, i) => {
      const figure = document.createElement("figure");
      figure.tabIndex = 0;
      figure.setAttribute("role", "button");
      figure.setAttribute("aria-label", `Shiko foton ${i + 1} të madhe`);
      const img = document.createElement("img");
      img.src = src;
      img.alt = CONFIG.shopName;
      img.loading = "lazy";
      figure.appendChild(img);
      figure.addEventListener("click", () => openLightbox(i));
      figure.addEventListener("keydown", e => {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openLightbox(i); }
      });
      galleryGrid.appendChild(figure);
    });
    wireLightbox();
  }

  document.getElementById("services-grid").dataset.rendered = "";
}

let lightboxIndex = 0;

function openLightbox(index) {
  lightboxIndex = index;
  document.getElementById("lightbox-img").src = CONFIG.galleryPhotos[index];
  document.getElementById("lightbox").classList.remove("hidden");
}

function closeLightbox() {
  document.getElementById("lightbox").classList.add("hidden");
}

function stepLightbox(delta) {
  const photos = CONFIG.galleryPhotos;
  lightboxIndex = (lightboxIndex + delta + photos.length) % photos.length;
  document.getElementById("lightbox-img").src = photos[lightboxIndex];
}

function wireLightbox() {
  const lightbox = document.getElementById("lightbox");
  document.getElementById("lightbox-close").addEventListener("click", closeLightbox);
  document.getElementById("lightbox-prev").addEventListener("click", () => stepLightbox(-1));
  document.getElementById("lightbox-next").addEventListener("click", () => stepLightbox(1));
  lightbox.addEventListener("click", e => {
    if (e.target === lightbox) closeLightbox();
  });
  document.addEventListener("keydown", e => {
    if (lightbox.classList.contains("hidden")) return;
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowLeft") stepLightbox(-1);
    if (e.key === "ArrowRight") stepLightbox(1);
  });
}

function renderServiceOptions() {
  const grid = document.getElementById("service-options");
  const displayGrid = document.getElementById("services-grid");
  CONFIG.services.forEach(svc => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "option-btn";
    btn.dataset.serviceId = svc.id;
    btn.innerHTML = `${svc.name}<span class="opt-price">${svc.price} Lekë</span>`;
    btn.addEventListener("click", () => {
      const idx = state.services.findIndex(s => s.id === svc.id);
      if (idx === -1) {
        state.services.push(svc);
        btn.classList.add("selected");
      } else {
        state.services.splice(idx, 1);
        btn.classList.remove("selected");
      }
      updateServiceTotal();
      refreshTimeGrid();
    });
    grid.appendChild(btn);

    const card = document.createElement("div");
    card.className = "service-card";
    card.innerHTML = `<h3>${svc.name}</h3><div class="service-price">${svc.price}<span> Lekë</span></div>`;
    displayGrid.appendChild(card);
  });
}

function parsePriceRange(price) {
  if (typeof price === "number") return [price, price];
  const parts = String(price).split("-").map(Number);
  return parts.length === 2 && !isNaN(parts[1]) ? parts : [parts[0], parts[0]];
}

function updateServiceTotal() {
  const totalEl = document.getElementById("service-total");
  if (!state.services.length) { totalEl.textContent = ""; return; }
  let lo = 0, hi = 0;
  state.services.forEach(svc => {
    const [l, h] = parsePriceRange(svc.price);
    lo += l; hi += h;
  });
  const priceText = lo === hi ? `${lo} Lekë` : `${lo}-${hi} Lekë`;
  totalEl.textContent = `${state.services.length} shërbime të zgjedhura — Totali: ${priceText}`;
}

function renderProducts() {
  const grid = document.getElementById("products-grid");
  (CONFIG.products || []).forEach(product => {
    const card = document.createElement("div");
    card.className = "service-card";
    card.innerHTML = `<h3>${product.name}</h3><div class="service-price">${product.price}<span> Lekë</span></div>`;
    grid.appendChild(card);
  });
}

function renderBarberOptions() {
  const grid = document.getElementById("barber-options");
  const displayGrid = document.getElementById("barbers-grid");

  const options = [...CONFIG.barbers, { id: "any", name: "Pa preferencë" }];
  options.forEach(b => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "option-btn";
    btn.dataset.barberId = b.id;
    btn.textContent = b.name;
    btn.addEventListener("click", () => {
      state.barber = b.id;
      [...grid.children].forEach(c => c.classList.remove("selected"));
      btn.classList.add("selected");
      refreshTimeGrid();
    });
    grid.appendChild(btn);
  });

  CONFIG.barbers.forEach(b => {
    const card = document.createElement("div");
    card.className = "barber-card";
    card.innerHTML = `
      <div class="barber-avatar">${b.name[0]}</div>
      <h3>${b.name}</h3>
      <p>Berber</p>
      ${b.phone ? `<a class="barber-call" href="tel:+${b.phone}">📞 Telefono ${b.name.split(" ")[0]}</a>` : ""}
    `;
    displayGrid.appendChild(card);
  });

  wireUnder10Check(grid);
}

function wireUnder10Check(grid) {
  const checkbox = document.getElementById("under-10-check");
  checkbox.addEventListener("change", () => {
    const buttons = [...grid.children];
    if (checkbox.checked) {
      const endriBtn = buttons.find(b => b.dataset.barberId === "endri");
      endriBtn?.click();
      buttons.forEach(b => {
        if (b.dataset.barberId !== "endri") b.disabled = true;
      });
    } else {
      buttons.forEach(b => { b.disabled = false; });
    }
  });
}

/* ---------- Opening hours ---------- */

function timeToMinutes(t) {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
}
function minutesToTime(min) {
  const h = String(Math.floor(min / 60)).padStart(2, "0");
  const m = String(min % 60).padStart(2, "0");
  return `${h}:${m}`;
}

function generateSlots() {
  const { open, close, lunchStart, lunchEnd, slotMinutes, closedWeekday } = CONFIG.hours;
  if (state.date) {
    const weekday = new Date(`${state.date}T00:00:00`).getDay();
    if (weekday === closedWeekday) return [];
  }
  const slots = [];
  const openMin = timeToMinutes(open);
  const closeMin = timeToMinutes(close);
  const lunchStartMin = timeToMinutes(lunchStart);
  const lunchEndMin = timeToMinutes(lunchEnd);
  const totalDuration = state.services.length
    ? state.services.reduce((sum, s) => sum + s.duration, 0)
    : slotMinutes;

  for (let t = openMin; t + totalDuration <= closeMin; t += slotMinutes) {
    const slotEnd = t + totalDuration;
    const overlapsLunch = t < lunchEndMin && slotEnd > lunchStartMin;
    if (overlapsLunch) continue;
    slots.push(minutesToTime(t));
  }
  return slots;
}

function updateOpenStatus() {
  const now = new Date();
  const nowMin = now.getHours() * 60 + now.getMinutes();
  const { open, close, lunchStart, lunchEnd, closedWeekday } = CONFIG.hours;
  const openMin = timeToMinutes(open);
  const closeMin = timeToMinutes(close);
  const lunchStartMin = timeToMinutes(lunchStart);
  const lunchEndMin = timeToMinutes(lunchEnd);

  const statusEl = document.getElementById("open-status");
  const dotEl = document.querySelector(".dot");

  if (now.getDay() === closedWeekday) {
    statusEl.textContent = "Mbyllur sot (E Mërkurë) · Hapim nesër në " + open;
    dotEl.classList.add("closed");
    return;
  }

  let isOpen = nowMin >= openMin && nowMin < closeMin && !(nowMin >= lunchStartMin && nowMin < lunchEndMin);

  if (nowMin >= lunchStartMin && nowMin < lunchEndMin) {
    statusEl.textContent = `Pushim dreke deri në ${lunchEnd}`;
  } else if (isOpen) {
    statusEl.textContent = `Hapur tani · Mbyllim në ${close}`;
  } else {
    statusEl.textContent = `Mbyllur · Hapim në ${open}`;
  }
  dotEl.classList.toggle("closed", !isOpen);
}

/* ---------- Date input ---------- */

function localDateString(d) {
  // Local calendar date as YYYY-MM-DD (not UTC — toISOString() would drift
  // by a day near midnight in Albania's UTC+1/+2 timezone).
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function setupDateInput() {
  const input = document.getElementById("booking-date");
  input.min = localDateString(new Date());
  input.addEventListener("change", () => {
    state.date = input.value;
    state.time = null;
    refreshTimeGrid();
  });
}

/* ---------- Availability + time grid ---------- */

async function fetchAvailability(date) {
  try {
    const res = await fetch(`/api/availability?date=${encodeURIComponent(date)}`);
    if (!res.ok) throw new Error("bad response");
    return await res.json();
  } catch (e) {
    console.error("Availability fetch failed", e);
    return { endri: [], aldo: [] };
  }
}

async function refreshTimeGrid() {
  const wrap = document.getElementById("time-slots");

  if (!state.date) {
    wrap.innerHTML = `<p class="hint-text">Zgjidh një datë për të parë orët e lira.</p>`;
    return;
  }
  if (!state.barberMode && !state.barber) {
    wrap.innerHTML = `<p class="hint-text">Zgjidh një berber për të parë orët e lira.</p>`;
    return;
  }
  if (new Date(`${state.date}T00:00:00`).getDay() === CONFIG.hours.closedWeekday) {
    wrap.innerHTML = `<p class="hint-text">Të mërkurën jemi mbyllur — zgjidh një ditë tjetër.</p>`;
    return;
  }

  wrap.innerHTML = `<p class="hint-text">Duke ngarkuar…</p>`;
  const availability = await fetchAvailability(state.date);
  state.availability = availability;

  const slots = generateSlots();
  wrap.innerHTML = "";

  const barbersToCheck = state.barberMode
    ? CONFIG.barbers.map(b => b.id)
    : (state.barber === "any" ? CONFIG.barbers.map(b => b.id) : [state.barber]);

  slots.forEach(slot => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "time-slot";
    btn.textContent = slot;
    btn.dataset.time = slot;

    if (state.barberMode) {
      btn.classList.add("blocked-mode");
    }

    const takenFor = barbersToCheck.filter(bid => (availability[bid] || []).includes(slot));
    const fullyTaken = barbersToCheck.length > 0 && takenFor.length === barbersToCheck.length;

    if (state.barberMode) {
      const isBlocked = (availability[state.barber] || []).includes(slot);
      if (isBlocked) btn.classList.add("blocked-slot");
      btn.addEventListener("click", () => handleBlockToggle(slot, isBlocked));
    } else {
      if (fullyTaken) {
        btn.classList.add("taken");
        btn.disabled = true;
      } else {
        btn.addEventListener("click", () => {
          state.time = slot;
          [...wrap.children].forEach(c => c.classList.remove("selected"));
          btn.classList.add("selected");
        });
      }
    }
    wrap.appendChild(btn);
  });

  if (!slots.length) {
    wrap.innerHTML = `<p class="hint-text">S'ka orë të lira për këtë shërbim/datë.</p>`;
  }
}

/* ---------- Booking submission ---------- */

function wireBookingButton() {
  document.getElementById("submit-booking").addEventListener("click", submitBooking);
}

async function submitBooking() {
  const feedback = document.getElementById("booking-feedback");
  const name = document.getElementById("customer-name").value.trim();
  const phone = document.getElementById("customer-phone").value.trim();

  if (!state.services.length) return showFeedback("Zgjidh të paktën një shërbim.", "error");
  if (!state.barber) return showFeedback("Zgjidh një berber.", "error");
  if (!state.date) return showFeedback("Zgjidh një datë.", "error");
  if (!state.time) return showFeedback("Zgjidh një orë.", "error");
  if (!name) return showFeedback("Shkruaj emrin tënd.", "error");
  if (!phone) return showFeedback("Shkruaj numrin e telefonit.", "error");

  const btn = document.getElementById("submit-booking");
  btn.disabled = true;
  showFeedback("Duke dërguar…", "");

  try {
    const res = await fetch("/api/book", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        date: state.date,
        time: state.time,
        barber: state.barber,
        serviceIds: state.services.map(s => s.id),
        customerName: name,
        customerPhone: phone
      })
    });
    const data = await res.json();

    if (!res.ok) {
      showFeedback(data.error || "Ora u zu ndërkohë, zgjidh një tjetër.", "error");
      refreshTimeGrid();
      return;
    }

    const barberName = CONFIG.barbers.find(b => b.id === data.barber)?.name || data.barber;
    showFeedback(`Faleminderit, ${name}! Rezervimi u konfirmua te ${barberName}, më ${state.date} në ${state.time}.`, "success");
    resetBookingForm();
  } catch (e) {
    console.error(e);
    showFeedback("Diçka shkoi gabim. Provo përsëri ose na telefono.", "error");
  } finally {
    btn.disabled = false;
  }
}

function showFeedback(msg, type) {
  const feedback = document.getElementById("booking-feedback");
  feedback.textContent = msg;
  feedback.className = "booking-feedback" + (type ? " " + type : "");
}

function resetBookingForm() {
  state.time = null;
  document.getElementById("customer-name").value = "";
  document.getElementById("customer-phone").value = "";
  refreshTimeGrid();
}

/* ---------- Barber mode (PIN-protected slot blocking) ---------- */

function wireBarberMode() {
  const toggleBtn = document.getElementById("barber-mode-btn");
  const gate = document.getElementById("barber-pin-gate");
  const pinInput = document.getElementById("barber-pin-input");
  const pinSubmit = document.getElementById("barber-pin-submit");
  const pinError = document.getElementById("barber-pin-error");

  toggleBtn.addEventListener("click", () => {
    if (state.barberMode) {
      state.barberMode = false;
      state.pin = null;
      sessionStorage.removeItem("ub_pin");
      toggleBtn.textContent = "Jam berber — dua të bllokoj një orë";
      gate.classList.add("hidden");
      refreshTimeGrid();
      return;
    }
    if (state.pin) {
      state.barberMode = true;
      toggleBtn.textContent = "Dil nga modaliteti berber";
      refreshTimeGrid();
      return;
    }
    gate.classList.remove("hidden");
  });

  pinSubmit.addEventListener("click", () => {
    const pin = pinInput.value.trim();
    if (!pin) return;
    state.pin = pin;
    state.barberMode = true;
    sessionStorage.setItem("ub_pin", pin);
    gate.classList.add("hidden");
    pinError.classList.add("hidden");
    toggleBtn.textContent = "Dil nga modaliteti berber";
    if (!state.barber) {
      // In barber mode we need a specific barber selected (not "any") to block their slots.
      const firstBarberBtn = document.querySelector("#barber-options .option-btn");
      firstBarberBtn?.click();
    }
    refreshTimeGrid();
  });
}

async function handleBlockToggle(time, isCurrentlyBlocked) {
  if (!state.date || !state.barber || state.barber === "any") {
    showFeedback("Zgjidh një berber specifik (jo 'Pa preferencë') për të bllokuar orë.", "error");
    return;
  }
  try {
    const res = await fetch("/api/block", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        date: state.date,
        time,
        barber: state.barber,
        pin: state.pin,
        action: isCurrentlyBlocked ? "unblock" : "block"
      })
    });
    if (res.status === 401) {
      document.getElementById("barber-pin-error").classList.remove("hidden");
      state.pin = null;
      sessionStorage.removeItem("ub_pin");
      state.barberMode = false;
      document.getElementById("barber-mode-btn").textContent = "Jam berber — dua të bllokoj një orë";
      document.getElementById("barber-pin-gate").classList.remove("hidden");
      refreshTimeGrid();
      return;
    }
    const data = await res.json();
    if (!res.ok) {
      showFeedback(data.error || "Nuk u krye dot veprimi.", "error");
      return;
    }
    refreshTimeGrid();
  } catch (e) {
    console.error(e);
    showFeedback("Diçka shkoi gabim.", "error");
  }
}
