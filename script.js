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
  wireIntro();
  wireNavigation();
  wireBarberPinModal();

  const res = await fetch("config.json");
  CONFIG = await res.json();

  renderStaticContent();
  renderHighlights();
  renderServiceOptions();
  renderProducts();
  renderBarberOptions();
  setupDateInputs();
  updateOpenStatus();
  setInterval(updateOpenStatus, 60 * 1000);
  wireBookingButton();
  wireCancelFlow();
});

/* ---------- Intro ---------- */

function wireIntro() {
  const overlay = document.getElementById("intro-overlay");
  if (!overlay) return;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const alreadySeen = sessionStorage.getItem("ub_intro_seen");

  if (reduceMotion || alreadySeen) {
    overlay.remove();
    return;
  }

  sessionStorage.setItem("ub_intro_seen", "1");
  document.body.classList.add("intro-locked");
  setTimeout(() => {
    overlay.classList.add("intro-hide");
    document.body.classList.remove("intro-locked");
    setTimeout(() => overlay.remove(), 1000);
  }, 1800);
}

/* ---------- Screen router ---------- */

let screenHistory = [];

function showScreen(name) {
  document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
  const target = document.querySelector(`.screen[data-screen="${name}"]`);
  if (!target) return;
  target.classList.add("active");
  window.scrollTo({ top: 0, behavior: "auto" });
  onScreenEnter(name);
}

function goto(name, { reset = false } = {}) {
  const current = document.querySelector(".screen.active")?.dataset.screen;
  if (reset) {
    screenHistory = [];
  } else if (current && current !== name) {
    screenHistory.push(current);
  }
  showScreen(name);
}

function goBack() {
  const prev = screenHistory.pop() || "home";
  showScreen(prev);
}

function wireNavigation() {
  document.querySelectorAll("[data-goto]:not([data-manual])").forEach(el => {
    el.addEventListener("click", () => goto(el.dataset.goto, { reset: el.hasAttribute("data-reset") }));
  });
  document.querySelectorAll("[data-back]").forEach(el => {
    el.addEventListener("click", goBack);
  });

  document.getElementById("services-next").addEventListener("click", () => {
    if (!state.services.length) {
      updateServiceTotal(); // shows the "pick at least one" hint
      return;
    }
    goto("wizard-barber");
  });

  document.getElementById("barber-next").addEventListener("click", () => {
    const err = document.getElementById("barber-error");
    if (!state.barber) {
      err.textContent = "Zgjidh një berber.";
      err.classList.remove("hidden");
      return;
    }
    err.classList.add("hidden");
    goto("wizard-datetime");
  });

  document.getElementById("datetime-next").addEventListener("click", () => {
    const err = document.getElementById("datetime-error");
    if (!state.time) {
      err.textContent = "Zgjidh një orë.";
      err.classList.remove("hidden");
      return;
    }
    err.classList.add("hidden");
    goto("wizard-details");
  });

  document.getElementById("datetime-done").addEventListener("click", () => {
    exitBarberMode();
    goto("about", { reset: true });
  });

  document.getElementById("confirm-home-btn").addEventListener("click", () => {
    resetBookingState();
    goto("home", { reset: true });
  });
}

function onScreenEnter(name) {
  if (name === "wizard-barber") {
    const title = document.getElementById("barber-screen-title");
    const progress = document.getElementById("barber-progress");
    const under10Wrap = document.getElementById("under-10-wrap");
    if (state.barberMode) {
      title.textContent = "Për Cilin Berber?";
      progress.textContent = "Bllokim Ore";
      under10Wrap.classList.add("hidden");
    } else {
      title.textContent = "Zgjidh Berberin";
      progress.textContent = "Hapi 2 nga 4";
      under10Wrap.classList.remove("hidden");
    }
  }

  if (name === "wizard-datetime") {
    const title = document.getElementById("datetime-screen-title");
    const progress = document.getElementById("datetime-progress");
    if (state.barberMode) {
      title.textContent = "Blloko / Zhblloko Orë";
      progress.textContent = "Bllokim Ore";
    } else {
      title.textContent = "Zgjidh Datën & Orën";
      progress.textContent = "Hapi 3 nga 4";
    }
    refreshTimeGrid();
  }

  if (name === "cancel") {
    document.getElementById("cancel-date").min = localDateString(new Date());
  }
}

function resetBookingState() {
  state.services = [];
  state.barber = null;
  state.date = null;
  state.time = null;

  document.querySelectorAll("#service-options .option-btn").forEach(b => b.classList.remove("selected"));
  document.querySelectorAll("#barber-options .option-btn").forEach(b => { b.classList.remove("selected"); b.disabled = false; });
  document.getElementById("under-10-check").checked = false;
  document.getElementById("booking-date").value = "";
  document.getElementById("customer-name").value = "";
  document.getElementById("customer-phone").value = "";
  document.getElementById("customer-notes").value = "";
  updateServiceTotal();
  showFeedback("", "");
}

/* ---------- Render content from CONFIG ---------- */

function renderStaticContent() {
  document.getElementById("footer-year").textContent = new Date().getFullYear();
  document.getElementById("footer-address").textContent = CONFIG.address;

  const telHref = `tel:+${CONFIG.phoneIntl}`;
  const phoneLink = document.getElementById("footer-phone");
  phoneLink.href = telHref;
  phoneLink.textContent = CONFIG.phoneDisplay;
  document.getElementById("header-call").href = telHref;

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

  renderPhotoGrid("gallery-grid", "gallery-note", CONFIG.galleryPhotos);
  renderPhotoGrid("work-grid", "work-note", CONFIG.workPhotos || []);
  wireLightbox();

  if (CONFIG.googleReviewsUrl) {
    const reviewsLink = document.getElementById("google-reviews-link");
    reviewsLink.href = CONFIG.googleReviewsUrl;
    reviewsLink.classList.remove("hidden");
  }
}

function renderPhotoGrid(gridId, noteId, photos) {
  const grid = document.getElementById(gridId);
  const note = document.getElementById(noteId);
  if (!photos.length) return;
  note.classList.add("hidden");
  photos.forEach((src, i) => {
    const figure = document.createElement("figure");
    figure.tabIndex = 0;
    figure.setAttribute("role", "button");
    figure.setAttribute("aria-label", `Shiko foton ${i + 1} të madhe`);
    const img = document.createElement("img");
    img.src = src;
    img.alt = CONFIG.shopName;
    img.loading = "lazy";
    figure.appendChild(img);
    figure.addEventListener("click", () => openLightbox(photos, i));
    figure.addEventListener("keydown", e => {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openLightbox(photos, i); }
    });
    grid.appendChild(figure);
  });
}

let lightboxPhotos = [];
let lightboxIndex = 0;

function openLightbox(photos, index) {
  lightboxPhotos = photos;
  lightboxIndex = index;
  document.getElementById("lightbox-img").src = photos[index];
  document.getElementById("lightbox").classList.remove("hidden");
}

function closeLightbox() {
  document.getElementById("lightbox").classList.add("hidden");
}

function stepLightbox(delta) {
  lightboxIndex = (lightboxIndex + delta + lightboxPhotos.length) % lightboxPhotos.length;
  document.getElementById("lightbox-img").src = lightboxPhotos[lightboxIndex];
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
    });
    grid.appendChild(btn);
  });
}

function parsePriceRange(price) {
  if (typeof price === "number") return [price, price];
  const parts = String(price).split("-").map(Number);
  return parts.length === 2 && !isNaN(parts[1]) ? parts : [parts[0], parts[0]];
}

function updateServiceTotal() {
  const totalEl = document.getElementById("service-total");
  if (!state.services.length) {
    totalEl.textContent = "Zgjidh të paktën një shërbim.";
    totalEl.classList.add("error-text");
    return;
  }
  totalEl.classList.remove("error-text");
  let lo = 0, hi = 0;
  state.services.forEach(svc => {
    const [l, h] = parsePriceRange(svc.price);
    lo += l; hi += h;
  });
  const priceText = lo === hi ? `${lo} Lekë` : `${lo}-${hi} Lekë`;
  totalEl.textContent = `${state.services.length} shërbime të zgjedhura — Totali: ${priceText}`;
}

function renderHighlights() {
  const grid = document.getElementById("highlights-grid");
  (CONFIG.highlights || []).forEach(h => {
    const card = document.createElement("div");
    card.className = "highlight-card";
    card.innerHTML = `
      <div class="highlight-icon">${h.icon}</div>
      <h3>${h.title}</h3>
      <p>${h.text}</p>
    `;
    grid.appendChild(card);
  });
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

/* ---------- Date inputs ---------- */

function localDateString(d) {
  // Local calendar date as YYYY-MM-DD (not UTC — toISOString() would drift
  // by a day near midnight in Albania's UTC+1/+2 timezone).
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function setupDateInputs() {
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
  const nextBtn = document.getElementById("datetime-next");
  const doneBtn = document.getElementById("datetime-done");
  nextBtn.classList.toggle("hidden", state.barberMode);
  doneBtn.classList.toggle("hidden", !state.barberMode);

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
          document.getElementById("datetime-error").classList.add("hidden");
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
  const name = document.getElementById("customer-name").value.trim();
  const phone = document.getElementById("customer-phone").value.trim();
  const notes = document.getElementById("customer-notes").value.trim();

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
        customerPhone: phone,
        customerNotes: notes
      })
    });
    const data = await res.json();

    if (!res.ok) {
      showFeedback(data.error || "Ora u zu ndërkohë, zgjidh një tjetër.", "error");
      goto("wizard-datetime");
      return;
    }

    const barberName = CONFIG.barbers.find(b => b.id === data.barber)?.name || data.barber;
    document.getElementById("confirm-message").textContent =
      `Faleminderit, ${name}! Rezervimi u konfirmua te ${barberName}, më ${state.date} në ${state.time}.`;
    showFeedback("", "");
    goto("wizard-confirm", { reset: true });
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

/* ---------- Barber mode (PIN-protected slot blocking) ---------- */

function wireBarberPinModal() {
  const toggleBtn = document.getElementById("barber-mode-btn");
  const gate = document.getElementById("barber-pin-gate");
  const pinInput = document.getElementById("barber-pin-input");
  const pinSubmit = document.getElementById("barber-pin-submit");
  const pinCancel = document.getElementById("barber-pin-cancel");
  const pinError = document.getElementById("barber-pin-error");

  toggleBtn.addEventListener("click", () => {
    if (state.barberMode) {
      exitBarberMode();
      return;
    }
    if (state.pin) {
      enterBarberMode();
      return;
    }
    pinInput.value = "";
    pinError.classList.add("hidden");
    gate.classList.remove("hidden");
    pinInput.focus();
  });

  pinCancel.addEventListener("click", () => gate.classList.add("hidden"));

  pinSubmit.addEventListener("click", () => {
    const pin = pinInput.value.trim();
    if (!pin) return;
    state.pin = pin;
    sessionStorage.setItem("ub_pin", pin);
    gate.classList.add("hidden");
    pinError.classList.add("hidden");
    enterBarberMode();
  });
}

function enterBarberMode() {
  state.barberMode = true;
  document.getElementById("barber-mode-btn").textContent = "Dil nga modaliteti berber";
  if (!state.barber) {
    const firstBarberBtn = document.querySelector("#barber-options .option-btn");
    firstBarberBtn?.click();
  }
  goto("wizard-barber");
}

function exitBarberMode() {
  state.barberMode = false;
  state.pin = null;
  sessionStorage.removeItem("ub_pin");
  document.getElementById("barber-mode-btn").textContent = "Jam berber — dua të bllokoj një orë";
}

async function handleBlockToggle(time, isCurrentlyBlocked) {
  if (!state.date || !state.barber || state.barber === "any") {
    document.getElementById("datetime-error").textContent = "Zgjidh një berber specifik (jo 'Pa preferencë') për të bllokuar orë.";
    document.getElementById("datetime-error").classList.remove("hidden");
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
      exitBarberMode();
      document.getElementById("barber-pin-error").classList.remove("hidden");
      document.getElementById("barber-pin-gate").classList.remove("hidden");
      refreshTimeGrid();
      return;
    }
    const data = await res.json();
    if (!res.ok) {
      document.getElementById("datetime-error").textContent = data.error || "Nuk u krye dot veprimi.";
      document.getElementById("datetime-error").classList.remove("hidden");
      return;
    }
    document.getElementById("datetime-error").classList.add("hidden");
    refreshTimeGrid();
  } catch (e) {
    console.error(e);
    document.getElementById("datetime-error").textContent = "Diçka shkoi gabim.";
    document.getElementById("datetime-error").classList.remove("hidden");
  }
}

/* ---------- Cancel an existing booking ---------- */

function wireCancelFlow() {
  document.getElementById("cancel-search-btn").addEventListener("click", searchCancelBooking);
}

async function searchCancelBooking() {
  const date = document.getElementById("cancel-date").value;
  const phone = document.getElementById("cancel-phone").value.trim();
  const results = document.getElementById("cancel-results");

  if (!date || !phone) {
    results.innerHTML = `<p class="hint-text">Vendos datën dhe numrin e telefonit.</p>`;
    return;
  }

  results.innerHTML = `<p class="hint-text">Duke kërkuar…</p>`;

  try {
    const res = await fetch("/api/cancel", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ date, phone, action: "find" })
    });
    const data = await res.json();

    if (!res.ok) {
      results.innerHTML = `<p class="hint-text">${data.error || "Diçka shkoi gabim."}</p>`;
      return;
    }
    if (!data.bookings.length) {
      results.innerHTML = `<p class="hint-text">S'u gjet asnjë rezervim me këto të dhëna.</p>`;
      return;
    }

    results.innerHTML = "";
    data.bookings.forEach(b => {
      const item = document.createElement("div");
      item.className = "cancel-item";
      item.innerHTML = `
        <div class="cancel-item-info">
          <p class="cancel-item-time">${b.time}</p>
          <p class="cancel-item-detail">${b.barberName} · ${b.services.join(", ")}</p>
        </div>
        <button type="button" class="cancel-item-cancel-btn">Anulo</button>
      `;
      item.querySelector(".cancel-item-cancel-btn").addEventListener("click", () =>
        confirmCancelBooking(date, phone, b.time, b.barber, item)
      );
      results.appendChild(item);
    });
  } catch (e) {
    console.error(e);
    results.innerHTML = `<p class="hint-text">Diçka shkoi gabim. Provo përsëri ose na telefono.</p>`;
  }
}

async function confirmCancelBooking(date, phone, time, barber, itemEl) {
  try {
    const res = await fetch("/api/cancel", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ date, phone, time, barber, action: "cancel" })
    });
    const data = await res.json();
    if (!res.ok) {
      alert(data.error || "Nuk u anulua dot rezervimi.");
      return;
    }
    itemEl.innerHTML = `<p class="hint-text">Rezervimi u anulua.</p>`;
  } catch (e) {
    console.error(e);
    alert("Diçka shkoi gabim. Provo përsëri ose na telefono.");
  }
}
