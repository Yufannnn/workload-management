// js/app.js
import { MEMBERS, MAX_CONCURRENT } from "./config.js";
import { ensureStatusDoc, listenStatus, txStart, txStop } from "./firebase.js";

const $ = (q) => document.querySelector(q);

const splash   = $("#splash");
const enterBtn = $("#enterBtn");
const appEl    = $("#app");

const whoSel   = $("#who");
const startBtn = $("#start");
const stopBtn  = $("#stop");

const countEl  = $("#count");
const limitEls = [$("#limit"), $("#max")];
const dot      = $("#status-dot");
const list     = $("#active-list");
const msg      = $("#msg");
const toastEl  = $("#toast");

let activeCache = [];
let isBusy = false;
let wasFull = false; // track "full" state to prevent spammy repeats

// ===== Toggle toast popups =====
const TOAST_ENABLED = false;

/* ---------- UI helpers ---------- */
function showConsole(){
  splash.classList.add('hide');
  appEl.classList.add('show');
  document.querySelector('.reveal-child')?.classList.add('show');
  if (whoSel) whoSel.focus({ preventScroll: true });
}

function populateNames(){
  whoSel.innerHTML = MEMBERS.map(n => `<option value="${n}">${n}</option>`).join("");
  limitEls.forEach(el => el.textContent = MAX_CONCURRENT);
}

/* Enhance #who with a custom, accessible dropdown that mirrors the native select */
function enhanceSelect(nativeSel, items){
  // 1) Hide native select visually (keep accessible)
  nativeSel.classList.add('visually-hidden');

  // 2) Build custom control
  const wrapper = document.createElement('div');
  wrapper.className = 'cool-select';
  wrapper.setAttribute('role','combobox');
  wrapper.setAttribute('aria-haspopup','listbox');
  wrapper.setAttribute('aria-expanded','false');

  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'cool-select__button';
  btn.setAttribute('aria-label', 'Choose your name');

  const label = document.createElement('span');
  label.className = 'cool-select__label';
  label.textContent = nativeSel.value || items[0];

  const chev = document.createElement('span');
  chev.className = 'cool-select__chev';

  btn.appendChild(label);
  btn.appendChild(chev);

  const list = document.createElement('ul');
  list.className = 'cool-select__list';
  list.setAttribute('role','listbox');
  list.tabIndex = -1;

  // build options
  items.forEach((n) => {
    const li = document.createElement('li');
    li.className = 'cool-option';
    li.setAttribute('role','option');
    li.tabIndex = -1;
    li.textContent = n;
    li.dataset.value = n;
    li.dataset.selected = String(n === nativeSel.value);
    list.appendChild(li);
  });

  wrapper.appendChild(btn);
  wrapper.appendChild(list);
  nativeSel.parentNode.insertBefore(wrapper, nativeSel.nextSibling);

  // helpers
  function open(){ wrapper.setAttribute('aria-expanded','true'); list.focus(); }
  function close(){ wrapper.setAttribute('aria-expanded','false'); btn.focus(); }
  function selectValue(v){
    nativeSel.value = v;
    label.textContent = v;
    list.querySelectorAll('.cool-option').forEach(li => li.dataset.selected = String(li.dataset.value === v));
    // fire native change so the rest of your app updates
    nativeSel.dispatchEvent(new Event('change', {bubbles:true}));
  }

  // events
  btn.addEventListener('click', () => {
    const expanded = wrapper.getAttribute('aria-expanded') === 'true';
    expanded ? close() : open();
  });

  list.addEventListener('click', (e) => {
    const li = e.target.closest('.cool-option');
    if (!li) return;
    selectValue(li.dataset.value);
    close();
  });

  // keyboard navigation
  list.addEventListener('keydown', (e) => {
    const opts = [...list.querySelectorAll('.cool-option')];
    let idx = opts.findIndex(li => li.dataset.value === nativeSel.value);
    if (e.key === 'ArrowDown'){ e.preventDefault(); idx = Math.min(opts.length-1, idx+1); selectValue(opts[idx].dataset.value); opts[idx].focus(); }
    else if (e.key === 'ArrowUp'){ e.preventDefault(); idx = Math.max(0, idx-1); selectValue(opts[idx].dataset.value); opts[idx].focus(); }
    else if (e.key === 'Enter' || e.key === ' '){ e.preventDefault(); close(); }
    else if (e.key === 'Escape'){ e.preventDefault(); close(); }
  });

  // click outside to close
  document.addEventListener('click', (e) => {
    if (!wrapper.contains(e.target)) wrapper.setAttribute('aria-expanded','false');
  });
}

function setUsageVisuals(count){
  const ratio = count / MAX_CONCURRENT;
  document.documentElement.style.setProperty('--usage', String(ratio));

  // 0 -> green, 1 -> yellow, 2 -> orange, 3+ -> red
  const state =
    count >= MAX_CONCURRENT ? 3 :
    count === 2              ? 2 :
    count === 1              ? 1 : 0;

  dot.classList.remove('state-0','state-1','state-2','state-3');
  dot.classList.add(`state-${state}`);
}


function renderActiveList(active){
  const me = whoSel.value;
  list.innerHTML = active.length
    ? active.map(n => `<li class="name ${n===me ? 'on' : ''}">${n}</li>`).join("")
    : '<li class="muted">Nobody is using the server.</li>';
}

function updateButtons(active){
  const me = whoSel.value;
  const iAmUsing = active.includes(me);
  startBtn.disabled = iAmUsing || active.length >= MAX_CONCURRENT;
  stopBtn.disabled  = !iAmUsing;
}

/* ---------- Toast & inline message with hold + fade ---------- */
let toastTimer;
let msgTimer;

/** showToast: NO-OP when TOAST_ENABLED = false */
function showToast(text, kind='ok', holdMs=1000){
  if (!TOAST_ENABLED) return;      // <- disable bottom toast entirely
  if (!toastEl) return;
  toastEl.textContent = text;
  toastEl.classList.remove('ok','err');
  toastEl.classList.add('show', kind);
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { toastEl.classList.remove('show'); }, Math.max(holdMs, 1));
}

/**
 * setMsg: sets inline message and fades it out after holdMs.
 * - If text != "", shows for holdMs then fades out (~260ms) and clears.
 * - If text == "", lets any current message linger for holdMs, then fades/clears.
 */
function setMsg(text, isErr=false, holdMs=1000){
  clearTimeout(msgTimer);

  if (text){
    msg.classList.remove('is-hiding');
    msg.textContent = text;
    msg.className = 'hint ' + (isErr ? 'err' : 'ok');
    showToast(text, isErr ? 'err' : 'ok', holdMs);  // safe: no-op if disabled
    msgTimer = setTimeout(() => {
      msg.classList.add('is-hiding');
      setTimeout(() => { msg.textContent = ''; msg.classList.remove('is-hiding'); }, 260);
      // don't touch toast; it's disabled anyway
    }, holdMs);
  } else if (msg.textContent){
    msgTimer = setTimeout(() => {
      msg.classList.add('is-hiding');
      setTimeout(() => { msg.textContent = ''; msg.classList.remove('is-hiding'); }, 260);
    }, holdMs);
  }
}

/* ---------- Fun bits ---------- */
function confettiBurst(x=window.innerWidth/2, y=appEl.getBoundingClientRect().top + 60){
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const n = 22, base = 900;
  for(let i=0;i<n;i++){
    const p = document.createElement('div');
    p.style.position='fixed';
    p.style.left = x+'px';
    p.style.top  = y+'px';
    p.style.width='6px'; p.style.height='10px';
    p.style.borderRadius='2px';
    p.style.background = `hsl(${Math.random()*360}, 90%, 65%)`;
    p.style.pointerEvents='none';
    p.style.zIndex=9999;
    document.body.appendChild(p);
    const angle = Math.random()*Math.PI*2;
    const speed = 6 + Math.random()*7;
    const vx = Math.cos(angle)*speed;
    const vy = Math.sin(angle)*speed - 6; // upward bias
    const rot = (Math.random()*720-360);
    p.animate([
      { transform:`translate(0,0) rotate(0deg)`, opacity:1 },
      { transform:`translate(${vx*14}px, ${vy*14}px) rotate(${rot}deg)`, opacity:0 }
    ], { duration: base + Math.random()*400, easing:'cubic-bezier(.2,.7,0,1)' })
    .onfinish = () => p.remove();
  }
}

(function parallaxTilt(el){
  if (!el) return;
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  let rAF;
  function onMove(e){
    const rect = el.getBoundingClientRect();
    const mx = (e.clientX - rect.left)/rect.width - .5;
    const my = (e.clientY - rect.top)/rect.height - .5;
    cancelAnimationFrame(rAF);
    rAF = requestAnimationFrame(()=>{
      el.style.transform = `rotateX(${(-my*2)}deg) rotateY(${mx*3}deg)`;
    });
  }
  function reset(){ el.style.transform=''; }
  el.addEventListener('mousemove', onMove);
  el.addEventListener('mouseleave', reset);
})(appEl);

/* ---------- Actions ---------- */
async function startUsing(){
  const me = whoSel.value;
  if (isBusy) return;
  isBusy = true;
  startBtn.disabled = true;
  try {
    if (activeCache.includes(me)) { setMsg('You are already marked as USING.', false, 1200); return; }
    if (activeCache.length >= MAX_CONCURRENT) {
      setMsg(`Cannot start: server is full (${activeCache.length}/${MAX_CONCURRENT}).`, true, 1200);
      alert(`Server is full (${activeCache.length}/${MAX_CONCURRENT}). Please try again later.`);
      return;
    }
    setMsg(activeCache.length === MAX_CONCURRENT - 1 ? 'Heads-up: last slot — checking…' : 'Reserving a slot…', false, 1000);
    await txStart(me, MAX_CONCURRENT);
    setMsg('You are now marked as USING. ✅', false, 1200);
    confettiBurst();
  } catch (e) {
    if (e.message === 'FULL') {
      setMsg(`Someone else grabbed the last slot. Server is full (${activeCache.length}/${MAX_CONCURRENT}).`, true, 1400);
      alert('Server just became full. Please try again later.');
    } else {
      console.error(e);
      setMsg('Something went wrong. Please try again.', true, 1400);
    }
  } finally {
    isBusy = false;
  }
}

/* ---------- Stop effect: ripple + soft dust ---------- */
function ringRipple(x, y, color='rgba(139,92,246,.45)'){
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const r = document.createElement('div');
  Object.assign(r.style, {
    position: 'fixed',
    left: `${x}px`,
    top: `${y}px`,
    width: '6px',
    height: '6px',
    borderRadius: '999px',
    border: `2px solid ${color}`,
    boxShadow: `0 0 14px ${color}`,
    pointerEvents: 'none',
    zIndex: 9999,
    transform: 'translate(-50%, -50%)'
  });
  document.body.appendChild(r);

  r.animate(
    [
      { transform: 'translate(-50%, -50%) scale(1)', opacity: 0.8 },
      { transform: 'translate(-50%, -50%) scale(18)', opacity: 0 }
    ],
    { duration: 650, easing: 'cubic-bezier(.2,.7,0,1)' }
  ).onfinish = () => r.remove();
}

function stopPoof(x = window.innerWidth/2, y = document.getElementById('app').getBoundingClientRect().top + 60){
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  // 1) ripple
  ringRipple(x, y, 'rgba(96,165,250,.45)');

  // 2) soft dust (fewer, drifting down)
  const n = 14, base = 800;
  for (let i = 0; i < n; i++){
    const p = document.createElement('div');
    p.style.position = 'fixed';
    p.style.left = x + 'px';
    p.style.top  = y + 'px';
    p.style.width = '5px';
    p.style.height = '5px';
    p.style.borderRadius = '50%';
    // cooler, calmer palette
    p.style.background = `hsl(${200 + Math.random()*40}, 80%, ${60 + Math.random()*10}%)`;
    p.style.pointerEvents = 'none';
    p.style.zIndex = 9999;
    document.body.appendChild(p);

    const angle = (Math.random() * Math.PI) + Math.PI; // mostly downward semicircle
    const speed = 2 + Math.random()*3;
    const vx = Math.cos(angle) * speed;
    const vy = Math.sin(angle) * speed + 1.5; // downward bias
    const scaleEnd = 0.4 + Math.random()*0.4;

    p.animate(
      [
        { transform: 'translate(0,0) scale(1)', opacity: 0.9 },
        { transform: `translate(${vx*30}px, ${vy*36}px) scale(${scaleEnd})`, opacity: 0 }
      ],
      { duration: base + Math.random()*400, easing: 'cubic-bezier(.2,.7,0,1)' }
    ).onfinish = () => p.remove();
  }
}


async function stopUsing(){
  const me = whoSel.value;
  try {
    await txStop(me);
    setMsg('You are now marked as NOT USING. ✋', false, 1200);
    stopPoof();              // <-- add this line
  } catch (e) {
    console.error(e);
    setMsg('Something went wrong. Please try again.', true, 1400);
  }
}

/* ---------- Boot ---------- */
export function startApp(){
  // splash interactions
  splash.addEventListener('click', showConsole);
  enterBtn.addEventListener('click', (e)=>{ e.stopPropagation(); showConsole(); });
  splash.addEventListener('keydown', (e)=>{ if(e.key === 'Enter' || e.key === ' '){ e.preventDefault(); showConsole(); }});

  // initial UI
  populateNames();
  enhanceSelect(whoSel, MEMBERS);
  limitEls.forEach(el => el.textContent = MAX_CONCURRENT);

  // Firestore bootstrap + subscription
  ensureStatusDoc().then(() => {
    listenStatus((active) => {
      const prev = parseInt(countEl.textContent || '0', 10);
      countEl.textContent = active.length;
      if (active.length !== prev){
        countEl.classList.remove('bump');
        void countEl.offsetWidth;
        countEl.classList.add('bump');
      }

      activeCache = active;
      setUsageVisuals(active.length);
      renderActiveList(active);
      updateButtons(active);

      const me = whoSel.value;
      const iAmUsing = active.includes(me);
      const isFull = active.length >= MAX_CONCURRENT;

      // Only announce "full" when it flips to full, and "slot opened" when leaving full
      if (isFull && !iAmUsing && !wasFull) {
        setMsg(`Server is full (${active.length}/${MAX_CONCURRENT}).`, true, 3000);
      } else if (!isFull && wasFull) {
        setMsg('A slot just opened. 🎉', false, 2000);
      } else {
        // gentle clear: keep whatever message is there for a bit (your 3s)
        setMsg('', false, 3000);
      }

      wasFull = isFull;
    });
  });

  // controls
  whoSel.addEventListener('change', () => {
    const me = whoSel.value;
    const iAmUsing = activeCache.includes(me);
    startBtn.disabled = iAmUsing || activeCache.length >= MAX_CONCURRENT;
    stopBtn.disabled = !iAmUsing;
    renderActiveList(activeCache);
    setMsg('', false, 1000); // don't nuke instantly
  });

  startBtn.addEventListener('click', startUsing);
  stopBtn.addEventListener('click', stopUsing);
  window.addEventListener('beforeunload', () => { try { txStop(whoSel.value); } catch (_) {} });
}


