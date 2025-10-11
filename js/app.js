// js/app.js
import { MEMBERS, MAX_CONCURRENT } from "./config.js";
import { ensureStatusDoc, listenStatus, txStart, txStop } from "./firebase.js";
import { initI18n, t } from "./i18n.js";

/* ============================= DOM SHORTCUT ============================= */
const $ = (q) => document.querySelector(q);

/* ================================ NODES ================================ */
const splash    = $("#splash");
const enterBtn  = $("#enterBtn");
const appEl     = $("#app");

const langSel   = $("#lang");
const whoSel    = $("#who");
const startBtn  = $("#start");
const stopBtn   = $("#stop");

const countEl   = $("#count");
const limitEls  = [$("#limit"), $("#max")];
const dot       = $("#status-dot");
const listEl    = $("#active-list");
const msgEl     = $("#msg");
const toastEl   = $("#toast");
const bannerEl  = $("#banner");
const themeBtn  = $("#themeToggle");

/* ================================ STATE ================================ */
let activeCache = [];
let wasFull     = false;
let isBusy      = false;

// flip to true if you want the little bottom toast popups
const TOAST_ENABLED = false;

/* ============================ THEME HELPERS ============================ */
function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  try { localStorage.setItem("wm.theme", theme); } catch {}
  if (!themeBtn) return;

  // show “what will happen if you click”
  if (theme === "dark") {
    themeBtn.textContent = "☀️";
    themeBtn.setAttribute("aria-pressed", "false");
  } else {
    themeBtn.textContent = "🌙";
    themeBtn.setAttribute("aria-pressed", "true");
  }
}
function initTheme() {
  let stored = null;
  try { stored = localStorage.getItem("wm.theme"); } catch {}
  const prefersDark = window.matchMedia?.("(prefers-color-scheme: dark)")?.matches;
  applyTheme(stored || (prefersDark ? "dark" : "light"));
}

/* ============================== UI HELPERS ============================= */
function showConsole() {
  document.body.classList.remove("splash-on");   // re-enable header controls
  splash.classList.add("hide");
  appEl.classList.add("show");
  document.querySelector(".reveal-child")?.classList.add("show");
  whoSel?.focus({ preventScroll: true });
}

function populateNames() {
  whoSel.innerHTML = MEMBERS.map(n => `<option value="${n}">${n}</option>`).join("");
  limitEls.forEach(el => el && (el.textContent = MAX_CONCURRENT));
}

/* ---------- Localized banner (top-right) ---------- */
function showBanner(text, kind = "start", holdMs = 1400) {
  if (!bannerEl) return;
  bannerEl.textContent = text;
  bannerEl.classList.remove("start", "stop", "show");
  // retrigger transition
  void bannerEl.offsetWidth;
  bannerEl.classList.add(kind, "show");
  setTimeout(() => bannerEl.classList.remove("show"), holdMs);
}

/* ---------- Custom <select> enhancer (accessible) ---------- */
function enhanceSelect(nativeSel, items) {
  if (!nativeSel) return;

  nativeSel.classList.add("visually-hidden");

  const wrapper = document.createElement("div");
  wrapper.className = "cool-select";
  wrapper.setAttribute("role", "combobox");
  wrapper.setAttribute("aria-haspopup", "listbox");
  wrapper.setAttribute("aria-expanded", "false");

  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = "cool-select__button";
  btn.setAttribute("aria-label", t("your_name"));

  const label = document.createElement("span");
  label.className = "cool-select__label";
  label.textContent = nativeSel.value || items[0];

  const chev = document.createElement("span");
  chev.className = "cool-select__chev";
  btn.append(label, chev);

  const list = document.createElement("ul");
  list.className = "cool-select__list";
  list.setAttribute("role", "listbox");
  list.tabIndex = -1;

  items.forEach((n) => {
    const li = document.createElement("li");
    li.className = "cool-option";
    li.setAttribute("role", "option");
    li.tabIndex = -1;
    li.textContent = n;
    li.dataset.value = n;
    li.dataset.selected = String(n === nativeSel.value);
    list.appendChild(li);
  });

  // Start with just the button in-flow
  wrapper.append(btn);
  nativeSel.parentNode.insertBefore(wrapper, nativeSel.nextSibling);

  // ---- floating/portal helpers ----
  let placed = false;
  const placeList = () => {
    const r = btn.getBoundingClientRect();
    list.style.position = "fixed";
    list.style.left = `${Math.round(r.left)}px`;
    list.style.top  = `${Math.round(r.bottom + 6)}px`;
    list.style.width = `${Math.round(r.width)}px`;
    const spaceBelow = window.innerHeight - (r.bottom + 6);
    list.style.maxHeight = `${Math.max(160, Math.min(260, spaceBelow - 12))}px`;
    list.style.zIndex = "10000";
  };
  const attachFloat = () => {
    if (placed) return;
    document.body.appendChild(list);
    placeList();
    window.addEventListener("resize", placeList);
    window.addEventListener("scroll", placeList, true); // capture nested scrolls
    placed = true;
  };
  const detachFloat = () => {
    if (!placed) return;
    list.classList.remove("is-open");
    list.style.cssText = ""; // clear inline positions/visibility
    wrapper.appendChild(list);
    window.removeEventListener("resize", placeList);
    window.removeEventListener("scroll", placeList, true);
    placed = false;
  };

  const showList = () => {
    // since we portal, the descendant CSS no longer applies — force visible:
    list.classList.add("is-open");
    list.style.opacity = "1";
    list.style.transform = "none";
    list.style.pointerEvents = "auto";
  };
  const hideList = () => {
    list.classList.remove("is-open");
    list.style.opacity = "";
    list.style.transform = "";
    list.style.pointerEvents = "";
  };

  const open  = () => {
    wrapper.setAttribute("aria-expanded", "true");
    attachFloat();
    showList();
    list.focus();
  };
  const close = (returnFocus = true) => {
    wrapper.setAttribute("aria-expanded", "false");
    hideList();
    detachFloat();
    if (returnFocus) btn.focus();
  };

  function selectValue(v) {
    nativeSel.value = v;
    label.textContent = v;
    list.querySelectorAll(".cool-option").forEach(li => {
      li.dataset.selected = String(li.dataset.value === v);
    });
    nativeSel.dispatchEvent(new Event("change", { bubbles: true }));
  }

  btn.addEventListener("click", () => {
    const expanded = wrapper.getAttribute("aria-expanded") === "true";
    expanded ? close() : open();
  });

  list.addEventListener("click", (e) => {
    const li = e.target.closest(".cool-option");
    if (!li) return;
    selectValue(li.dataset.value);
    close();
  });

  list.addEventListener("keydown", (e) => {
    const opts = [...list.querySelectorAll(".cool-option")];
    let idx = Math.max(0, opts.findIndex(li => li.dataset.value === nativeSel.value));
    if (e.key === "ArrowDown") { e.preventDefault(); idx = Math.min(opts.length - 1, idx + 1); selectValue(opts[idx].dataset.value); opts[idx].focus(); }
    else if (e.key === "ArrowUp") { e.preventDefault(); idx = Math.max(0, idx - 1); selectValue(opts[idx].dataset.value); opts[idx].focus(); }
    else if (e.key === "Enter" || e.key === " ") { e.preventDefault(); close(); }
    else if (e.key === "Escape") { e.preventDefault(); close(); }
  });

  // Close on outside click — only when open; do not refocus button
  const onOutside = (e) => {
    if (wrapper.getAttribute("aria-expanded") !== "true") return;
    if (wrapper.contains(e.target) || list.contains(e.target)) return;
    close(false);
  };
  document.addEventListener("pointerdown", onOutside, true);
  document.addEventListener("click", onOutside, true);

  // keep aria-label localized
  window.addEventListener("wm:localechange", () => {
    btn.setAttribute("aria-label", t("your_name"));
  });
}

/* ---------- Visuals for usage meter & dot ---------- */
function setUsageVisuals(count) {
  const ratio = count / MAX_CONCURRENT;
  document.documentElement.style.setProperty("--usage", String(ratio));
  const state = count >= MAX_CONCURRENT ? 3 : count === 2 ? 2 : count === 1 ? 1 : 0;
  dot.classList.remove("state-0","state-1","state-2","state-3");
  dot.classList.add(`state-${state}`);
}

/* ---------- Active list rendering ---------- */
function renderActiveList(active) {
  const me = whoSel.value;
  listEl.innerHTML = active.length
    ? active.map(n => `<li class="name ${n === me ? "on" : ""}" data-name="${n}" tabindex="0">${n}</li>`).join("")
    : `<li class="muted">${t("nobody")}</li>`;
}

/* ---------- Buttons enable/disable ---------- */
function updateButtons(active) {
  const me = whoSel.value;
  const iAmUsing = active.includes(me);
  startBtn.disabled = iAmUsing || active.length >= MAX_CONCURRENT;
  stopBtn.disabled  = !iAmUsing;
}

/* ---------- Toast & inline message ---------- */
let toastTimer;
let msgTimer;

function showToast(text, kind = "ok", holdMs = 1000) {
  if (!TOAST_ENABLED || !toastEl) return;
  toastEl.textContent = text;
  toastEl.classList.remove("ok", "err");
  toastEl.classList.add("show", kind);
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toastEl.classList.remove("show"), Math.max(holdMs, 1));
}

function setMsg(text, isError = false, holdMs = 1500) {
  if (!msgEl) return;
  msgEl.textContent = text || "";
  msgEl.classList.toggle("err", !!isError);
  msgEl.classList.toggle("show", !!text);

  clearTimeout(msgTimer);
  if (text) msgTimer = setTimeout(() => msgEl.classList.remove("show"), Math.max(holdMs, 1));
}

/* =============================== FUN BITS ============================== */
function confettiBurst(x = window.innerWidth / 2, y = appEl.getBoundingClientRect().top + 60) {
  if (window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches) return;
  const n = 22, base = 900;
  for (let i = 0; i < n; i++) {
    const p = document.createElement("div");
    p.style.position = "fixed";
    p.style.left = `${x}px`;
    p.style.top  = `${y}px`;
    p.style.width = "6px"; p.style.height = "10px";
    p.style.borderRadius = "2px";
    p.style.background = `hsl(${Math.random() * 360}, 90%, 65%)`;
    p.style.pointerEvents = "none";
    p.style.zIndex = 9999;
    document.body.appendChild(p);

    const angle = Math.random() * Math.PI * 2;
    const speed = 6 + Math.random() * 7;
    const vx = Math.cos(angle) * speed;
    const vy = Math.sin(angle) * speed - 6;
    const rot = (Math.random() * 720 - 360);

    p.animate(
      [{ transform: `translate(0,0) rotate(0deg)`, opacity: 1 },
       { transform: `translate(${vx * 14}px, ${vy * 14}px) rotate(${rot}deg)`, opacity: 0 }],
      { duration: base + Math.random() * 400, easing: "cubic-bezier(.2,.7,0,1)" }
    ).onfinish = () => p.remove();
  }
}

function stopPoof(x = window.innerWidth / 2, y = appEl.getBoundingClientRect().top + 60) {
  if (window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches) return;
  const n = 12, base = 700;
  for (let i = 0; i < n; i++) {
    const p = document.createElement("div");
    p.style.position = "fixed";
    p.style.left = `${x}px`;
    p.style.top  = `${y}px`;
    p.style.width = "8px"; p.style.height = "8px";
    p.style.borderRadius = "50%";
    p.style.background = `hsl(${Math.random() * 360}, 85%, 75%)`;
    p.style.pointerEvents = "none";
    p.style.zIndex = 9999;
    document.body.appendChild(p);

    const angle = (Math.random() * Math.PI) + Math.PI;
    const speed = 2 + Math.random() * 3;
    const vx = Math.cos(angle) * speed;
    const vy = Math.sin(angle) * speed + 1.5;
    const scaleEnd = 0.4 + Math.random() * 0.4;

    p.animate(
      [{ transform: "translate(0,0) scale(1)", opacity: 0.9 },
       { transform: `translate(${vx * 30}px, ${vy * 36}px) scale(${scaleEnd})`, opacity: 0 }],
      { duration: base + Math.random() * 200, easing: "cubic-bezier(.2,.7,0,1)" }
    ).onfinish = () => p.remove();
  }
}

/* ================================ ACTIONS ============================== */
async function startUsing() {
  const me = whoSel.value;
  if (isBusy) return;
  isBusy = true;
  startBtn.disabled = true;

  try {
    if (activeCache.includes(me)) { setMsg(t("already_using"), false, 1200); return; }
    if (activeCache.length >= MAX_CONCURRENT) {
      setMsg(t("cannot_start_full", { count: activeCache.length, max: MAX_CONCURRENT }), true, 1400);
      alert(t("full_now", { count: activeCache.length, max: MAX_CONCURRENT }));
      return;
    }

    setMsg(activeCache.length === MAX_CONCURRENT - 1 ? t("last_slot") : t("reserving"), false, 1000);

    await txStart(me, MAX_CONCURRENT);
    setMsg(t("now_using"), false, 1200);
    showBanner(t("banner_start"), "start");
    confettiBurst();
  } catch (e) {
    if (e?.message === "FULL") {
      setMsg(t("full_now", { count: activeCache.length, max: MAX_CONCURRENT }), true, 1400);
      alert(t("full_now", { count: activeCache.length, max: MAX_CONCURRENT }));
    } else {
      console.error(e);
      setMsg(t("error_generic"), true, 1400);
    }
  } finally {
    isBusy = false;
  }
}

async function stopUsing() {
  const me = whoSel.value;
  try {
    await txStop(me);
    setMsg(t("now_not_using"), false, 1200);
    showBanner(t("banner_stop"), "stop");
    stopPoof();
  } catch (e) {
    console.error(e);
    setMsg(t("error_generic"), true, 1400);
  }
}

/* ================================== BOOT =============================== */
export function startApp() {
  // While splash is visible, mute header controls (CSS keys off this flag)
  document.body.classList.add("splash-on");

  // Theme first
  initTheme();
  themeBtn?.addEventListener("click", () => {
    const cur = document.documentElement.getAttribute("data-theme") || "dark";
    applyTheme(cur === "dark" ? "light" : "dark");
  });

  // i18n next
  if (langSel) {
    initI18n(langSel);
    // Sync translations across tabs
    window.addEventListener("storage", (e) => {
      if (e.key === "wm.locale") window.dispatchEvent(new Event("wm:localechange"));
    });
    const rerender = () => {
      renderActiveList(activeCache);
      startBtn.textContent = t("start");
      stopBtn.textContent  = t("stop");
      window.dispatchEvent(new Event("wm:localechange"));
    };
    window.addEventListener("wm:localechange", rerender);
  }

  // Splash
  splash.addEventListener("click", showConsole);
  enterBtn.addEventListener("click", (e) => { e.stopPropagation(); showConsole(); });
  splash.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") { e.preventDefault(); showConsole(); }
  });

  // Initial UI
  populateNames();
  enhanceSelect(whoSel, MEMBERS);
  limitEls.forEach(el => el && (el.textContent = MAX_CONCURRENT));

  // Firestore bootstrap + subscription
  ensureStatusDoc().then(() => {
    listenStatus((active) => {
      const prev = parseInt(countEl.textContent || "0", 10);
      countEl.textContent = active.length;
      if (active.length !== prev) {
        countEl.classList.remove("bump");
        void countEl.offsetWidth; // reflow to restart animation
        countEl.classList.add("bump");
      }

      activeCache = active;
      setUsageVisuals(active.length);
      renderActiveList(active);
      updateButtons(active);

      const me = whoSel.value;
      const iAmUsing = active.includes(me);
      const isFull = active.length >= MAX_CONCURRENT;

      if (isFull && !iAmUsing && !wasFull) {
        setMsg(t("full_now", { count: active.length, max: MAX_CONCURRENT }), true, 3000);
      } else if (!isFull && wasFull) {
        setMsg(t("slot_opened"), false, 2000);
      } else {
        setMsg("", false, 1000);
      }
      wasFull = isFull;
    });
  });

  // Controls
  whoSel.addEventListener("change", () => {
    const me = whoSel.value;
    const iAmUsing = activeCache.includes(me);
    startBtn.disabled = iAmUsing || activeCache.length >= MAX_CONCURRENT;
    stopBtn.disabled  = !iAmUsing;
    renderActiveList(activeCache); // refresh “on” highlight
    setMsg("", false, 1000);
  });

  // (Removed) — chips no longer stop your session on click or keypress

  startBtn.addEventListener("click", startUsing);
  stopBtn.addEventListener("click", stopUsing);

  // Best-effort relinquish on tab close
  window.addEventListener("beforeunload", () => { try { txStop(whoSel.value); } catch {} });
}
