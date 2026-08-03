/* =========================================================================
   UNIQUE BARBER — booking logic
   -------------------------------------------------------------------------
   Everything you (Endri/Aldo) would want to change — phone number, social
   links, services/prices, barbers, opening hours, gallery photos, the
   story text — lives in ONE place: config.json, next to this file. Fields
   ending in "En" (e.g. nameEn, textEn) are the English version — leave
   them blank and the site just shows the Albanian text for everyone.
   ========================================================================= */

const I18N = {
  sq: {
    heroBadge: "Përsosmëri · Stil · Detaje",
    heroTitle: "Stili Fillon<br>Këtu.",
    heroSub: "Lineup të përsosur, trajtime fytyre të kujdesshme dhe produkte premium — nga berberët më me përvojë në Elbasan.",
    bookNow: "Rezervo Tani",
    googleReviews: "★★★★★ Shiko vlerësimet tona në Google",
    whyUsTitle: "Pse Ne?",
    tilePricing: "Çmimorja",
    tileProducts: "Produktet",
    tileWork: "Punët Tona",
    tileAbout: "Rreth Nesh",
    cancelLink: "Anulo një rezervim ekzistues",
    step1of4: "Hapi 1 nga 4",
    step2of4: "Hapi 2 nga 4",
    step3of4: "Hapi 3 nga 4",
    step4of4: "Hapi 4 nga 4",
    chooseServices: "Zgjidh Shërbimet",
    chooseServicesSub: "Zgjidh një ose më shumë.",
    continueBtn: "Vazhdo",
    doneBtn: "Përfundo",
    under10Label: "Klienti është nën 10 vjeç",
    under10Hint: "(caktohet automatikisht te Endri)",
    barberScreenTitleBooking: "Zgjidh Berberin",
    barberScreenTitleBlocking: "Për Cilin Berber?",
    barberProgressBlocking: "Bllokim Ore",
    datetimeScreenTitleBooking: "Zgjidh Datën & Orën",
    datetimeScreenTitleBlocking: "Blloko / Zhblloko Orë",
    pickDateHint: "Zgjidh një datë për të parë orët e lira.",
    pickBarberHint: "Zgjidh një berber për të parë orët e lira.",
    closedWednesdayHint: "Të mërkurën jemi mbyllur — zgjidh një ditë tjetër.",
    loadingHint: "Duke ngarkuar…",
    noSlotsHint: "S'ka orë të lira për këtë shërbim/datë.",
    yourDetails: "Të Dhënat Tuaja",
    placeholderName: "Emri e Mbiemri",
    placeholderPhone: "Numri i telefonit",
    placeholderNotes: "Ka diçka që duhet ta dijë berberi? (p.sh. lëkurë e ndjeshme, nishane, aftësi të kufizuara, etj. — opsionale)",
    confirmBooking: "Konfirmo Rezervimin",
    payNote: "💵 Pagesa bëhet në barbërhanë, kur vjen për termin.",
    bookingConfirmedTitle: "Rezervimi u Konfirmua",
    bookingConfirmedMsg: "Faleminderit, {name}! Rezervimi u konfirmua te {barber}, më {date} në {time}.",
    backHome: "Kthehu në Faqen Kryesore",
    pricingServicesHeader: "Shërbimet",
    pricingProductsHeader: "Produktet",
    productsSub: "Gjenden në barbërhanë — nuk rezervohen online.",
    workPhotosNote: "Foto nga klientët tanë do të shtohen këtu së shpejti.",
    storyTitle: "Historia Jonë",
    shopPhotosNote: "Foto të barbërhanës do të shtohen këtu së shpejti.",
    contactLabel: "Kontakt",
    hoursLabel: "Orari",
    hoursLine1: "E Hënë, Martë, Enjte – Diel: 09:00 – 21:00",
    hoursLine2: "Pushim dreke: 14:00 – 16:00",
    hoursLine3: "E Mërkurë: Mbyllur",
    followUsLabel: "Na Ndiqni",
    barberModeLink: "Jam berber — dua të bllokoj një orë",
    exitBarberModeLink: "Dil nga modaliteti berber",
    cancelTitle: "Anulo Rezervimin",
    cancelSub: "Vendos datën dhe numrin e telefonit që përdore kur rezervove.",
    searchBooking: "Kërko Rezervimin",
    pinPrompt: "Vendos PIN-in për të bllokuar/zhbllokuar orë:",
    placeholderPin: "PIN",
    enterBtn: "Hyr",
    pinWrong: "PIN i gabuar.",
    cancelActionBtn: "Anulo",
    allRightsReserved: "Të gjitha të drejtat e rezervuara.",

    openStatusClosedToday: "Mbyllur sot (E Mërkurë) · Hapim nesër në {open}",
    openStatusLunch: "Pushim dreke deri në {lunchEnd}",
    openStatusOpen: "Hapur tani · Mbyllim në {close}",
    openStatusClosed: "Mbyllur · Hapim në {open}",

    pickAtLeastOneService: "Zgjidh të paktën një shërbim.",
    serviceCountTotal: "{count} shërbime të zgjedhura — Totali: {price}",
    pickBarberError: "Zgjidh një berber.",
    pickDateError: "Zgjidh një datë.",
    pickTimeError: "Zgjidh një orë.",
    writeNameError: "Shkruaj emrin tënd.",
    writePhoneError: "Shkruaj numrin e telefonit.",
    sendingMsg: "Duke dërguar…",
    slotTakenError: "Ora u zu ndërkohë, zgjidh një tjetër.",
    genericError: "Diçka shkoi gabim. Provo përsëri ose na telefono.",
    genericErrorShort: "Diçka shkoi gabim.",
    pickSpecificBarberError: "Zgjidh një berber specifik (jo 'Pa preferencë') për të bllokuar orë.",
    blockActionError: "Nuk u krye dot veprimi.",

    cancelFillFields: "Vendos datën dhe numrin e telefonit.",
    cancelSearching: "Duke kërkuar…",
    cancelNotFound: "S'u gjet asnjë rezervim me këto të dhëna.",
    cancelSuccess: "Rezervimi u anulua.",
    cancelActionFailed: "Nuk u anulua dot rezervimi."
  },
  en: {
    heroBadge: "Excellence · Style · Detail",
    heroTitle: "Style Starts<br>Here.",
    heroSub: "Perfect lineups, careful face treatments, and premium products — from Elbasan's most experienced barbers.",
    bookNow: "Book Now",
    googleReviews: "★★★★★ See our Google reviews",
    whyUsTitle: "Why Us?",
    tilePricing: "Price List",
    tileProducts: "Products",
    tileWork: "Our Work",
    tileAbout: "About Us",
    cancelLink: "Cancel an existing booking",
    step1of4: "Step 1 of 4",
    step2of4: "Step 2 of 4",
    step3of4: "Step 3 of 4",
    step4of4: "Step 4 of 4",
    chooseServices: "Choose Your Services",
    chooseServicesSub: "Pick one or more.",
    continueBtn: "Continue",
    doneBtn: "Done",
    under10Label: "Customer is under 10 years old",
    under10Hint: "(automatically assigned to Endri)",
    barberScreenTitleBooking: "Choose Your Barber",
    barberScreenTitleBlocking: "Which Barber?",
    barberProgressBlocking: "Blocking Time",
    datetimeScreenTitleBooking: "Choose Date & Time",
    datetimeScreenTitleBlocking: "Block / Unblock Time",
    pickDateHint: "Pick a date to see available times.",
    pickBarberHint: "Pick a barber to see available times.",
    closedWednesdayHint: "We're closed on Wednesdays — pick another day.",
    loadingHint: "Loading…",
    noSlotsHint: "No available times for this service/date.",
    yourDetails: "Your Details",
    placeholderName: "Full Name",
    placeholderPhone: "Phone Number",
    placeholderNotes: "Anything the barber should know? (e.g. sensitive skin, moles, accessibility needs, etc. — optional)",
    confirmBooking: "Confirm Booking",
    payNote: "💵 Payment is made at the shop, when you arrive.",
    bookingConfirmedTitle: "Booking Confirmed",
    bookingConfirmedMsg: "Thank you, {name}! Your booking with {barber} is confirmed for {date} at {time}.",
    backHome: "Back to Home",
    pricingServicesHeader: "Services",
    pricingProductsHeader: "Products",
    productsSub: "Available in-store — not booked online.",
    workPhotosNote: "Photos of our clients' cuts coming soon.",
    storyTitle: "Our Story",
    shopPhotosNote: "Photos of the shop coming soon.",
    contactLabel: "Contact",
    hoursLabel: "Hours",
    hoursLine1: "Mon, Tue, Thu – Sun: 9:00 AM – 9:00 PM",
    hoursLine2: "Lunch break: 2:00 PM – 4:00 PM",
    hoursLine3: "Wednesday: Closed",
    followUsLabel: "Follow Us",
    barberModeLink: "I'm a barber — I want to block a time",
    exitBarberModeLink: "Exit barber mode",
    cancelTitle: "Cancel Booking",
    cancelSub: "Enter the date and phone number you used to book.",
    searchBooking: "Find Booking",
    pinPrompt: "Enter your PIN to block/unblock a time:",
    placeholderPin: "PIN",
    enterBtn: "Enter",
    pinWrong: "Wrong PIN.",
    cancelActionBtn: "Cancel",
    allRightsReserved: "All rights reserved.",

    openStatusClosedToday: "Closed today (Wednesday) · Opens tomorrow at {open}",
    openStatusLunch: "Lunch break until {lunchEnd}",
    openStatusOpen: "Open now · Closes at {close}",
    openStatusClosed: "Closed · Opens at {open}",

    pickAtLeastOneService: "Pick at least one service.",
    serviceCountTotal: "{count} services selected — Total: {price}",
    pickBarberError: "Pick a barber.",
    pickDateError: "Pick a date.",
    pickTimeError: "Pick a time.",
    writeNameError: "Enter your name.",
    writePhoneError: "Enter your phone number.",
    sendingMsg: "Sending…",
    slotTakenError: "That time was just taken — pick another.",
    genericError: "Something went wrong. Try again or call us.",
    genericErrorShort: "Something went wrong.",
    pickSpecificBarberError: "Pick a specific barber (not 'No preference') to block a time.",
    blockActionError: "Couldn't complete that action.",

    cancelFillFields: "Enter the date and phone number.",
    cancelSearching: "Searching…",
    cancelNotFound: "No booking found with those details.",
    cancelSuccess: "Booking cancelled.",
    cancelActionFailed: "Couldn't cancel that booking."
  }
};

let currentLang = localStorage.getItem("ub_lang") || "sq";

function t(key, vars) {
  let str = (I18N[currentLang] && I18N[currentLang][key]) || I18N.sq[key] || key;
  if (vars) {
    Object.entries(vars).forEach(([k, v]) => { str = str.replace(`{${k}}`, v); });
  }
  return str;
}

function localized(obj, field) {
  const enField = field + "En";
  if (currentLang === "en" && obj[enField]) return obj[enField];
  return obj[field];
}

function applyStaticTranslations() {
  document.documentElement.lang = currentLang;
  document.querySelectorAll("[data-i18n]").forEach(el => { el.textContent = t(el.dataset.i18n); });
  document.querySelectorAll("[data-i18n-html]").forEach(el => { el.innerHTML = t(el.dataset.i18nHtml); });
  document.querySelectorAll("[data-i18n-placeholder]").forEach(el => { el.placeholder = t(el.dataset.i18nPlaceholder); });
  document.getElementById("lang-toggle").textContent = currentLang === "sq" ? "EN" : "SQ";
}

function setLanguage(lang) {
  currentLang = lang;
  localStorage.setItem("ub_lang", lang);
  applyStaticTranslations();
  if (CONFIG) {
    renderHighlights();
    renderServiceOptions();
    renderProducts();
    renderBarberOptions();
    renderPricingList();
    renderStory();
    updateServiceTotal();
    updateOpenStatus();
    refreshTimeGrid();
  }
}

function wireLanguageToggle() {
  document.getElementById("lang-toggle").addEventListener("click", () => {
    setLanguage(currentLang === "sq" ? "en" : "sq");
  });
}

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
  applyStaticTranslations();
  wireLanguageToggle();
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
  renderPricingList();
  renderStory();
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
      err.textContent = t("pickBarberError");
      err.classList.remove("hidden");
      return;
    }
    err.classList.add("hidden");
    goto("wizard-datetime");
  });

  document.getElementById("datetime-next").addEventListener("click", () => {
    const err = document.getElementById("datetime-error");
    if (!state.time) {
      err.textContent = t("pickTimeError");
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
      title.textContent = t("barberScreenTitleBlocking");
      progress.textContent = t("barberProgressBlocking");
      under10Wrap.classList.add("hidden");
    } else {
      title.textContent = t("barberScreenTitleBooking");
      progress.textContent = t("step2of4");
      under10Wrap.classList.remove("hidden");
    }
  }

  if (name === "wizard-datetime") {
    const title = document.getElementById("datetime-screen-title");
    const progress = document.getElementById("datetime-progress");
    if (state.barberMode) {
      title.textContent = t("datetimeScreenTitleBlocking");
      progress.textContent = t("barberProgressBlocking");
    } else {
      title.textContent = t("datetimeScreenTitleBooking");
      progress.textContent = t("step3of4");
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

function renderStory() {
  const el = document.getElementById("story-text");
  if (!CONFIG.story) { el.textContent = ""; return; }
  el.textContent = currentLang === "en" && CONFIG.story.en ? CONFIG.story.en : CONFIG.story.sq;
}

function renderPhotoGrid(gridId, noteId, photos) {
  const grid = document.getElementById(gridId);
  const note = document.getElementById(noteId);
  grid.innerHTML = "";
  if (!photos.length) return;
  note.classList.add("hidden");
  photos.forEach((src, i) => {
    const figure = document.createElement("figure");
    figure.tabIndex = 0;
    figure.setAttribute("role", "button");
    figure.setAttribute("aria-label", `${i + 1}`);
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

function renderHighlights() {
  const grid = document.getElementById("highlights-grid");
  grid.innerHTML = "";
  (CONFIG.highlights || []).forEach(h => {
    const card = document.createElement("div");
    card.className = "highlight-card";
    card.innerHTML = `
      <div class="highlight-icon">${h.icon}</div>
      <h3>${localized(h, "title")}</h3>
      <p>${localized(h, "text")}</p>
    `;
    grid.appendChild(card);
  });
}

function renderServiceOptions() {
  const grid = document.getElementById("service-options");
  grid.innerHTML = "";
  CONFIG.services.forEach(svc => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "option-btn";
    btn.dataset.serviceId = svc.id;
    if (state.services.some(s => s.id === svc.id)) btn.classList.add("selected");
    btn.innerHTML = `${localized(svc, "name")}<span class="opt-price">${svc.price} Lekë</span>`;
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
    totalEl.textContent = t("pickAtLeastOneService");
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
  totalEl.textContent = t("serviceCountTotal", { count: state.services.length, price: priceText });
}

function renderProducts() {
  const grid = document.getElementById("products-grid");
  grid.innerHTML = "";
  (CONFIG.products || []).forEach(product => {
    const card = document.createElement("div");
    card.className = "service-card";
    card.innerHTML = `<h3>${localized(product, "name")}</h3><div class="service-price">${product.price}<span> Lekë</span></div>`;
    grid.appendChild(card);
  });
}

function renderPricingList() {
  const servicesList = document.getElementById("pricing-services-list");
  const productsList = document.getElementById("pricing-products-list");
  servicesList.innerHTML = "";
  productsList.innerHTML = "";

  CONFIG.services.forEach(svc => {
    const row = document.createElement("div");
    row.className = "price-row";
    row.innerHTML = `<span class="price-row-name">${localized(svc, "name")}</span><span class="price-row-value">${svc.price} Lekë</span>`;
    servicesList.appendChild(row);
  });

  (CONFIG.products || []).forEach(p => {
    const row = document.createElement("div");
    row.className = "price-row";
    row.innerHTML = `<span class="price-row-name">${localized(p, "name")}</span><span class="price-row-value">${p.price} Lekë</span>`;
    productsList.appendChild(row);
  });
}

function renderBarberOptions() {
  const grid = document.getElementById("barber-options");
  const displayGrid = document.getElementById("barbers-grid");
  grid.innerHTML = "";
  displayGrid.innerHTML = "";

  const options = [...CONFIG.barbers, { id: "any", name: currentLang === "en" ? "No preference" : "Pa preferencë" }];
  options.forEach(b => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "option-btn";
    btn.dataset.barberId = b.id;
    btn.textContent = b.name;
    if (state.barber === b.id) btn.classList.add("selected");
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
      ${b.phone ? `<a class="barber-call" href="tel:+${b.phone}">📞 ${b.name.split(" ")[0]}</a>` : ""}
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
    statusEl.textContent = t("openStatusClosedToday", { open });
    dotEl.classList.add("closed");
    return;
  }

  let isOpen = nowMin >= openMin && nowMin < closeMin && !(nowMin >= lunchStartMin && nowMin < lunchEndMin);

  if (nowMin >= lunchStartMin && nowMin < lunchEndMin) {
    statusEl.textContent = t("openStatusLunch", { lunchEnd });
  } else if (isOpen) {
    statusEl.textContent = t("openStatusOpen", { close });
  } else {
    statusEl.textContent = t("openStatusClosed", { open });
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
    wrap.innerHTML = `<p class="hint-text">${t("pickDateHint")}</p>`;
    return;
  }
  if (!state.barberMode && !state.barber) {
    wrap.innerHTML = `<p class="hint-text">${t("pickBarberHint")}</p>`;
    return;
  }
  if (new Date(`${state.date}T00:00:00`).getDay() === CONFIG.hours.closedWeekday) {
    wrap.innerHTML = `<p class="hint-text">${t("closedWednesdayHint")}</p>`;
    return;
  }

  wrap.innerHTML = `<p class="hint-text">${t("loadingHint")}</p>`;
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
        if (state.time === slot) btn.classList.add("selected");
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
    wrap.innerHTML = `<p class="hint-text">${t("noSlotsHint")}</p>`;
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

  if (!state.services.length) return showFeedback(t("pickAtLeastOneService"), "error");
  if (!state.barber) return showFeedback(t("pickBarberError"), "error");
  if (!state.date) return showFeedback(t("pickDateError"), "error");
  if (!state.time) return showFeedback(t("pickTimeError"), "error");
  if (!name) return showFeedback(t("writeNameError"), "error");
  if (!phone) return showFeedback(t("writePhoneError"), "error");

  const btn = document.getElementById("submit-booking");
  btn.disabled = true;
  showFeedback(t("sendingMsg"), "");

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
      showFeedback(data.error || t("slotTakenError"), "error");
      goto("wizard-datetime");
      return;
    }

    const barberName = CONFIG.barbers.find(b => b.id === data.barber)?.name || data.barber;
    document.getElementById("confirm-message").textContent =
      t("bookingConfirmedMsg", { name, barber: barberName, date: state.date, time: state.time });
    showFeedback("", "");
    goto("wizard-confirm", { reset: true });
  } catch (e) {
    console.error(e);
    showFeedback(t("genericError"), "error");
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
  document.getElementById("barber-mode-btn").textContent = t("exitBarberModeLink");
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
  document.getElementById("barber-mode-btn").textContent = t("barberModeLink");
}

async function handleBlockToggle(time, isCurrentlyBlocked) {
  if (!state.date || !state.barber || state.barber === "any") {
    document.getElementById("datetime-error").textContent = t("pickSpecificBarberError");
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
      document.getElementById("datetime-error").textContent = data.error || t("blockActionError");
      document.getElementById("datetime-error").classList.remove("hidden");
      return;
    }
    document.getElementById("datetime-error").classList.add("hidden");
    refreshTimeGrid();
  } catch (e) {
    console.error(e);
    document.getElementById("datetime-error").textContent = t("genericErrorShort");
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
    results.innerHTML = `<p class="hint-text">${t("cancelFillFields")}</p>`;
    return;
  }

  results.innerHTML = `<p class="hint-text">${t("cancelSearching")}</p>`;

  try {
    const res = await fetch("/api/cancel", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ date, phone, action: "find" })
    });
    const data = await res.json();

    if (!res.ok) {
      results.innerHTML = `<p class="hint-text">${data.error || t("genericError")}</p>`;
      return;
    }
    if (!data.bookings.length) {
      results.innerHTML = `<p class="hint-text">${t("cancelNotFound")}</p>`;
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
        <button type="button" class="cancel-item-cancel-btn">${t("cancelActionBtn")}</button>
      `;
      item.querySelector(".cancel-item-cancel-btn").addEventListener("click", () =>
        confirmCancelBooking(date, phone, b.time, b.barber, item)
      );
      results.appendChild(item);
    });
  } catch (e) {
    console.error(e);
    results.innerHTML = `<p class="hint-text">${t("genericError")}</p>`;
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
      alert(data.error || t("cancelActionFailed"));
      return;
    }
    itemEl.innerHTML = `<p class="hint-text">${t("cancelSuccess")}</p>`;
  } catch (e) {
    console.error(e);
    alert(t("genericError"));
  }
}
