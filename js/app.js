// js/app.js
import { MEMBERS, MAX_CONCURRENT } from "./config.js?v=20251013a";
import { ensureStatusDoc, listenStatus, txStart, txStop } from "./firebase.js?v=20251013a";
import { initI18n, t, setLocale } from "./i18n.js?v=20251013a";


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

/* ================================ STATE ================================ */
let activeCache = [];
let wasFull     = false;
let isBusy      = false;
let lastMsg     = { key: null, vars: {}, isError: false }; // keep last i18n message

const TOAST_ENABLED = false;

/* =============================== UI HELPERS =========================== */
function showConsole() {
  document.body.classList.remove("splash-on");
  splash.classList.add("hide");
  appEl.classList.add("show");
  document.querySelector(".reveal-child")?.classList.add("show");
  whoSel?.focus({ preventScroll: true });
}
function populateNames() {
  whoSel.innerHTML = MEMBERS.map(n => `<option value="${n}">${n}</option>`).join("");
  limitEls.forEach(el => el && (el.textContent = MAX_CONCURRENT));
}

/* ------------------------------ Banner -------------------------------- */
function showBanner(text, kind = "start", holdMs = 1400) {
  if (!bannerEl) return;
  bannerEl.textContent = text;
  bannerEl.classList.remove("start", "stop", "show");
  void bannerEl.offsetWidth;
  bannerEl.classList.add(kind, "show");
  setTimeout(() => bannerEl.classList.remove("show"), holdMs);
}

/* --------------------------- Inline message --------------------------- */
function setMsg(text, isError = false, holdMs = 1500) {
  if (!msgEl) return;
  msgEl.textContent = text || "";
  msgEl.classList.toggle("err", !!isError);
  msgEl.classList.toggle("show", !!text);
  clearTimeout(setMsg._timer);
  if (text) setMsg._timer = setTimeout(() => msgEl.classList.remove("show"), Math.max(holdMs, 1));
}

/** i18n-aware inline message that survives locale changes */
function setI18nMsg(key, vars = {}, isError = false, holdMs = 1500) {
  if (!msgEl) return;

  if (!key) {
    // Hide only; preserve last key/vars so we can re-translate later
    msgEl.classList.remove("show", "err");
    clearTimeout(setMsg._timer);
    return;
  }

  lastMsg = { key, vars, isError };
  msgEl.dataset.i18n = key;
  msgEl.dataset.i18nVars = JSON.stringify(vars || {});
  setMsg(t(key, vars), isError, holdMs);
}

/* ----------------------------- Cool select ---------------------------- */
function enhanceSelect(nativeSel, items) {
  if (!nativeSel) return;
  let PORTAL = document.getElementById("wm-portal");
  if (!PORTAL) {
    PORTAL = document.createElement("div");
    PORTAL.id = "wm-portal";
    Object.assign(PORTAL.style, { position:"fixed", inset:"0", zIndex:"2147483647", pointerEvents:"none" });
    document.body.appendChild(PORTAL);
  }

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

  wrapper.append(btn);
  nativeSel.parentNode.insertBefore(wrapper, nativeSel.nextSibling);

  const placeList = () => {
    const r = btn.getBoundingClientRect();
    const vv = window.visualViewport;
    const offX = vv ? vv.offsetLeft : 0;
    const offY = vv ? vv.offsetTop  : 0;
    const vh   = vv ? vv.height     : window.innerHeight;

    Object.assign(list.style, {
      position: "fixed",
      left: `${Math.round(offX + r.left)}px`,
      top:  `${Math.round(offY + r.bottom + 6)}px`,
      width:`${Math.round(r.width)}px`,
      maxHeight: `${Math.max(160, Math.min(320, vh - (r.bottom + 6) - 12))}px`,
      zIndex: "2147483647",
      transform: "translateZ(0)",
      WebkitTransform: "translateZ(0)",
      pointerEvents: "auto",
      opacity: "1"
    });
  };

  const open  = () => {
    if (wrapper.getAttribute("aria-expanded") === "true") return;
    wrapper.setAttribute("aria-expanded", "true");
    document.getElementById("wm-portal").appendChild(list);
    placeList();
    window.addEventListener("resize", placeList);
    window.addEventListener("scroll", placeList, true);
    window.visualViewport?.addEventListener("resize", placeList);
    window.visualViewport?.addEventListener("scroll", placeList);
    list.focus();
  };

  const close = (returnFocus = true) => {
    if (wrapper.getAttribute("aria-expanded") !== "true") return;
    wrapper.setAttribute("aria-expanded", "false");
    list.removeAttribute("style");
    wrapper.appendChild(list);
    window.removeEventListener("resize", placeList);
    window.removeEventListener("scroll", placeList, true);
    window.visualViewport?.removeEventListener("resize", placeList);
    window.visualViewport?.removeEventListener("scroll", placeList);
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

  const onOutside = (e) => {
    if (wrapper.getAttribute("aria-expanded") !== "true") return;
    if (wrapper.contains(e.target) || document.getElementById("wm-portal")?.contains(e.target)) return;
    close(false);
  };
  document.addEventListener("pointerdown", onOutside, true);
  document.addEventListener("click", onOutside, true);

  window.addEventListener("wm:localechange", () => {
    btn.setAttribute("aria-label", t("your_name"));
  });
}

/* =============================== VISUALS =============================== */
function setUsageVisuals(count) {
  const ratio = count / MAX_CONCURRENT;
  document.documentElement.style.setProperty("--usage", String(ratio));
  const state = count >= MAX_CONCURRENT ? 3 : count === 2 ? 2 : count === 1 ? 1 : 0;
  dot.classList.remove("state-0","state-1","state-2","state-3");
  dot.classList.add(`state-${state}`);
}
function renderActiveList(active) {
  const me = whoSel.value;
  listEl.innerHTML = active.length
    ? active.map(n => `<li class="name ${n === me ? "on" : ""}" data-name="${n}" tabindex="0">${n}</li>`).join("")
    : `<li class="muted">${t("nobody")}</li>`;
}
function updateButtons(active) {
  const me = whoSel.value;
  const iAmUsing = active.includes(me);
  startBtn.disabled = iAmUsing || active.length >= MAX_CONCURRENT;
  stopBtn.disabled  = !iAmUsing;
}

/* ================================ TOAST ================================ */
function showToast(text, kind = "ok", holdMs = 1000) {
  if (!TOAST_ENABLED || !toastEl) return;
  toastEl.textContent = text;
  toastEl.classList.remove("ok", "err");
  toastEl.classList.add("show", kind);
  clearTimeout(showToast._timer);
  showToast._timer = setTimeout(() => toastEl.classList.remove("show"), Math.max(holdMs, 1));
}

/* ================================= FX ================================= */
function confettiBurst(x = window.innerWidth / 2, y = appEl.getBoundingClientRect().top + 60) {
  if (window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches) return;
  const n = 22, base = 900;
  for (let i = 0; i < n; i++) {
    const p = document.createElement("div");
    p.style.position = "fixed";
    p.style.left = `${x}px`; p.style.top  = `${y}px`;
    p.style.width = "6px"; p.style.height = "10px";
    p.style.borderRadius = "2px";
    p.style.background = `hsl(${Math.random() * 360}, 90%, 65%)`;
    p.style.pointerEvents = "none"; p.style.zIndex = 9999;
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
    p.style.left = `${x}px`; p.style.top  = `${y}px`;
    p.style.width = "8px"; p.style.height = "8px";
    p.style.borderRadius = "50%";
    p.style.background = `hsl(${Math.random() * 360}, 85%, 75%)`;
    p.style.pointerEvents = "none"; p.style.zIndex = 9999;
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

/* =============================== ACTIONS ============================== */
async function startUsing() {
  const me = whoSel.value;
  if (isBusy) return;
  isBusy = true;
  startBtn.disabled = true;

  try {
    if (activeCache.includes(me)) { setI18nMsg("already_using", {}, false, 1200); return; }
    if (activeCache.length >= MAX_CONCURRENT) {
      setI18nMsg("full_now", { count: activeCache.length, max: MAX_CONCURRENT }, true, 3000);
      return;
    }
    const key = activeCache.length === MAX_CONCURRENT - 1 ? "last_slot" : "reserving";
    setI18nMsg(key, {}, false, 1000);

    await txStart(me, MAX_CONCURRENT);
    setI18nMsg("now_using", {}, false, 1200);
    showBanner(t("banner_start"), "start");
    confettiBurst();
  } catch (e) {
    if (e?.message === "FULL") {
      setI18nMsg("full_now", { count: activeCache.length, max: MAX_CONCURRENT }, true, 3000);
    } else {
      console.error(e);
      setI18nMsg("error_generic", {}, true, 1400);
    }
  } finally {
    isBusy = false;
  }
}
async function stopUsing() {
  const me = whoSel.value;
  try {
    await txStop(me);
    setI18nMsg("now_not_using", {}, false, 1200);
    showBanner(t("banner_stop"), "stop");
    stopPoof();
  } catch (e) {
    console.error(e);
    setI18nMsg("error_generic", {}, true, 1400);
  }
}

/* =========================== ACTIVE CHIP UX =========================== */
function initActiveChipHandlers() {
  if (!listEl) return;

  listEl.addEventListener("click", (e) => {
    const tgt = e.target instanceof Element ? e.target : e.target?.parentElement;
    const li  = tgt?.closest?.(".name");
    if (!li) return;
    const me   = whoSel.value;
    const name = li.dataset.name || li.textContent.trim();
    if (li.classList.contains("on") && name === me) stopUsing();
  });

  listEl.addEventListener("keydown", (e) => {
    if (e.key !== "Enter" && e.key !== " ") return;
    const tgt = e.target instanceof Element ? e.target : e.target?.parentElement;
    const li  = tgt?.closest?.(".name.on");
    if (!li) return;
    const me   = whoSel.value;
    const name = li.dataset.name || li.textContent.trim();
    if (name === me) { e.preventDefault(); stopUsing(); }
  });
}

/* ================================= BOOT ============================== */
export function startApp() {
  document.body.classList.add("splash-on");

  if (langSel) {
    initI18n(langSel);

    // Cross-tab locale sync
    window.addEventListener("storage", (e) => {
      if (e.key === "wm.locale" && e.newValue) setLocale(e.newValue);
    });

    const rerender = () => {
      renderActiveList(activeCache);
      startBtn.textContent = t("start");
      stopBtn.textContent  = t("stop");
      // re-translate the last message (if any)
      if (lastMsg.key) setI18nMsg(lastMsg.key, lastMsg.vars, lastMsg.isError, 3000);
    };
    window.addEventListener("wm:localechange", rerender);
    langSel.addEventListener("change", rerender);
  }

  splash.addEventListener("click", showConsole);
  enterBtn.addEventListener("click", (e) => { e.stopPropagation(); showConsole(); });
  splash.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") { e.preventDefault(); showConsole(); }
  });

  populateNames();
  enhanceSelect(whoSel, MEMBERS);
  limitEls.forEach(el => el && (el.textContent = MAX_CONCURRENT));

  ensureStatusDoc().then(() => {
    listenStatus((active) => {
      const prev = parseInt(countEl.textContent || "0", 10);
      countEl.textContent = active.length;
      if (active.length !== prev) {
        countEl.classList.remove("bump"); void countEl.offsetWidth; countEl.classList.add("bump");
      }

      activeCache = active;
      setUsageVisuals(active.length);
      renderActiveList(active);
      updateButtons(active);

      const me = whoSel.value;
      const iAmUsing = active.includes(me);
      const isFull = active.length >= MAX_CONCURRENT;

      if (isFull && !iAmUsing && !wasFull) {
        setI18nMsg("full_now", { count: active.length, max: MAX_CONCURRENT }, true, 3000);
      } else if (!isFull && wasFull) {
        setI18nMsg("slot_opened", {}, false, 2000);
      } else {
        setI18nMsg(null); // hides but keeps lastMsg for future re-translate
      }
      wasFull = isFull;
    });
  });

  whoSel.addEventListener("change", () => {
    const me = whoSel.value;
    const iAmUsing = activeCache.includes(me);
    startBtn.disabled = iAmUsing || activeCache.length >= MAX_CONCURRENT;
    stopBtn.disabled  = !iAmUsing;
    renderActiveList(activeCache);
    setI18nMsg(null);
  });

  initActiveChipHandlers();
  startBtn.addEventListener("click", startUsing);
  stopBtn.addEventListener("click", stopUsing);

  window.addEventListener("beforeunload", () => { try { txStop(whoSel.value); } catch {} });
}
