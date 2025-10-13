// i18n.js

export const LOCALES = [
  { code: 'en',       label: 'English' },   // 1) pinned
  { code: 'zh',       label: '中文' },       // 2) pinned

  // Alphabetical by native label
  { code: 'de',       label: 'Deutsch' },
  { code: 'es',       label: 'Español' },
  { code: 'fr',       label: 'Français' },
  { code: 'ja',       label: '日本語' },
  { code: 'ko',       label: '한국어' },
  { code: 'ru',       label: 'Русский' },
  { code: 'qya',      label: 'Quenya' },
  { code: 'sjn',      label: 'Sindarin' },
  { code: 'tlh',      label: 'tlhIngan Hol' },

  // Fun novelty languages last
  { code: 'x-pirate', label: '🏴‍☠️' },
  { code: 'x-emoji',  label: '😀' },
];


// code -> label map for building the <select> (optional helper)
const LABELS = Object.fromEntries(LOCALES.map(l => [l.code, l.label]));

export const DICTS = {
  en: {
    title: "Workload Management",
    splash_help: "Click anywhere to open the console.",
    open_console: "Open console",
    intro: "Up to <span class=\"accent\"><strong id=\"max\">3</strong></span> people can use the server at once. Pick your name, then press <em>Start</em> / <em>Stop</em>.",
    your_name: "Your name",
    start: "Start",
    stop: "Stop",
    using_now: "using now",
    updates: "Updates in real time for everyone.",
    banner_start: "Ready up — focus time!",
    banner_stop: "Wrap up — break time!",
    already_using: "You are already marked as USING.",
    cannot_start_full: "Cannot start: server is full ({count}/{max}).", 
    full_now: "Server is full ({count}/{max}). Please try again later.",
    last_slot: "Heads-up: last slot — checking…",
    reserving: "Reserving a slot…",
    now_using: "You are now marked as USING. ✅",
    now_not_using: "You are now marked as NOT USING. ✋",
    error_generic: "Something went wrong. Please try again.",
    slot_opened: "A slot just opened. 🎉",
    nobody: "Nobody is using the server.",
    footer_built: "Built with GitHub Pages + Firebase.",
    footer_copyright: "© {year} {owner}",
  },
  zh: {
    title: "好学的美猪-负载管理",
    splash_help: "点击任意位置打开控制台。",
    open_console: "打开控制台",
    intro: "同时最多允许 <span class=\"accent\"><strong id=\"max\">3</strong></span> 人使用服务器。选择你的名字，然后点击 <em>开始</em> / <em>停止</em>。",
    your_name: "你的名字",
    start: "开始",
    stop: "停止",
    using_now: "正在狠狠卷",
    updates: "所有人的状态都会实时更新。",
    banner_start: "准备准备 ，研究时间到！",
    banner_stop: "准备准备，休息时间到！",
    already_using: "你已经处于“使用中”。",
    cannot_start_full: "无法开始：服务器已满（{count}/{max}）。",
    full_now: "服务器已满（{count}/{max}）。请稍后再试。",
    last_slot: "提醒：最后一个名额——正在确认…",
    reserving: "正在占用名额…",
    now_using: "你现在已标记为“使用中”。✅",
    now_not_using: "你现在已标记为“未使用”。✋",
    error_generic: "出错了，请重试。",
    slot_opened: "新空位出现啦。🎉",
    nobody: "目前没有人在使用服务器。",
    footer_built: "由 GitHub Pages 与 Firebase 搭建。",
    footer_copyright: "© {year} {owner}",
  },
  es: {
    title: "Gestión de carga",
    splash_help: "Haz clic en cualquier parte para abrir la consola.",
    open_console: "Abrir consola",
    intro: "Hasta <span class=\"accent\"><strong id=\"max\">3</strong></span> personas pueden usar el servidor a la vez. Elige tu nombre y pulsa <em>Iniciar</em> / <em>Detener</em>.",
    your_name: "Tu nombre",
    start: "Iniciar",
    stop: "Detener",
    using_now: "usando ahora",
    updates: "Se actualiza en tiempo real para todos.",
    banner_start: "¡Listo! Hora de concentrarse.",
    banner_stop: "¡Hecho! Hora de descansar.",
    already_using: "Ya estás marcado como EN USO.",
    cannot_start_full: "No se puede iniciar: el servidor está lleno ({count}/{max}).",
    full_now: "El servidor está lleno ({count}/{max}). Por favor, inténtalo más tarde.",
    last_slot: "Atento: último cupo — comprobando…",
    reserving: "Reservando un cupo…",
    now_using: "Ahora estás marcado como EN USO. ✅",
    now_not_using: "Ahora estás marcado como SIN USO. ✋",
    error_generic: "Algo salió mal. Inténtalo de nuevo.",
    slot_opened: "Se liberó un cupo. 🎉",
    nobody: "Nadie está usando el servidor.",
    footer_built: "Creado con GitHub Pages y Firebase.",
    footer_copyright: "© {year} {owner}",
  },
  ru: {
    title: "Управление загрузкой",
    splash_help: "Нажмите в любом месте, чтобы открыть консоль.",
    open_console: "Открыть консоль",
    intro: "Одновременно сервером могут пользоваться до <span class=\"accent\"><strong id=\"max\">3</strong></span> человек. Выберите имя и нажмите <em>Старт</em> / <em>Стоп</em>.",
    your_name: "Ваше имя",
    start: "Старт",
    stop: "Стоп",
    using_now: "сейчас используют",
    updates: "Обновления в реальном времени для всех.",
    banner_start: "Готовимся — время работать!",
    banner_stop: "Пауза — время отдохнуть!",
    already_using: "Вы уже отмечены как ИСПОЛЬЗУЕТЕ.",
    cannot_start_full: "Не могу начать: сервер заполнен ({count}/{max}).",
    full_now: "Сервер заполнен ({count}/{max}). Пожалуйста, попробуйте позже.",
    last_slot: "Внимание: последний слот — проверяем…",
    reserving: "Резервируем слот…",
    now_using: "Теперь вы отмечены как ИСПОЛЬЗУЕТЕ. ✅",
    now_not_using: "Теперь вы отмечены как НЕ ИСПОЛЬЗУЕТЕ. ✋",
    error_generic: "Что-то пошло не так. Попробуйте ещё раз.",
    slot_opened: "Освободился слот. 🎉",
    nobody: "Никто не использует сервер.",
    footer_built: "Сделано на GitHub Pages и Firebase.",
    footer_copyright: "© {year} {owner}",
  },
  fr: {
    title: "Gestion de charge",
    splash_help: "Cliquez n’importe où pour ouvrir la console.",
    open_console: "Ouvrir la console",
    intro: "Jusqu’à <span class=\"accent\"><strong id=\"max\">3</strong></span> personnes peuvent utiliser le serveur en même temps. Choisissez votre nom puis cliquez <em>Démarrer</em> / <em>Arrêter</em>.",
    your_name: "Votre nom",
    start: "Démarrer",
    stop: "Arrêter",
    using_now: "en cours d’utilisation",
    updates: "Mises à jour en temps réel pour tous.",
    banner_start: "En place — c’est l’heure de se concentrer !",
    banner_stop: "C’est bon — petite pause !",
    already_using: "Vous êtes déjà marqué comme EN UTILISATION.",
    cannot_start_full: "Impossible de démarrer : le serveur est plein ({count}/{max}).",
    full_now: "Le serveur est plein ({count}/{max}). Réessayez plus tard.",
    last_slot: "Attention : dernier créneau — vérification…",
    reserving: "Réservation du créneau…",
    now_using: "Vous êtes maintenant EN UTILISATION. ✅",
    now_not_using: "Vous n’êtes plus EN UTILISATION. ✋",
    error_generic: "Un problème est survenu. Réessayez.",
    slot_opened: "Un créneau vient de se libérer. 🎉",
    nobody: "Personne n’utilise le serveur.",
    footer_built: "Réalisé avec GitHub Pages et Firebase.",
    footer_copyright: "© {year} {owner}",
  },
  de: {
    title: "Auslastungsverwaltung",
    splash_help: "Klicken Sie irgendwo, um die Konsole zu öffnen.",
    open_console: "Konsole öffnen",
    intro: "Bis zu <span class=\"accent\"><strong id=\"max\">3</strong></span> Personen können den Server gleichzeitig nutzen. Wähle deinen Namen und klicke <em>Start</em> / <em>Stopp</em>.",
    your_name: "Dein Name",
    start: "Start",
    stop: "Stopp",
    using_now: "nutzen gerade",
    updates: "Aktualisiert sich in Echtzeit für alle.",
    banner_start: "Bereit — Fokuszeit!",
    banner_stop: "Geschafft — kurze Pause!",
    already_using: "Du bist bereits als IN BENUTZUNG markiert.",
    cannot_start_full: "Starten nicht möglich: Server ist voll ({count}/{max}).",
    full_now: "Server ist voll ({count}/{max}). Bitte später erneut versuchen.",
    last_slot: "Achtung: letzter Platz — prüfe…",
    reserving: "Platz wird reserviert…",
    now_using: "Du bist jetzt IN BENUTZUNG. ✅",
    now_not_using: "Du bist jetzt NICHT IN BENUTZUNG. ✋",
    error_generic: "Etwas ist schiefgelaufen. Bitte erneut versuchen.",
    slot_opened: "Ein Platz ist frei geworden. 🎉",
    nobody: "Niemand nutzt den Server.",
    footer_built: "Erstellt mit GitHub Pages und Firebase.",
    footer_copyright: "© {year} {owner}",
  },
  ko: {
    title: "작업 부하 관리",
    splash_help: "아무 곳이나 클릭하면 콘솔이 열립니다.",
    open_console: "콘솔 열기",
    intro: "한 번에 최대 <span class=\"accent\"><strong id=\"max\">3</strong></span>명이 서버를 사용할 수 있어요. 이름을 고르고 <em>시작</em> / <em>중지</em>를 누르세요.",
    your_name: "이름",
    start: "시작",
    stop: "중지",
    using_now: "사용 중",
    updates: "모두에게 실시간으로 업데이트됩니다.",
    banner_start: "준비 완료 — 집중 시간!",
    banner_stop: "정지 — 쉬는 시간!",
    already_using: "이미 ‘사용 중’으로 표시되어 있어요.",
    cannot_start_full: "시작할 수 없음: 서버가 가득 찼어요 ({count}/{max}).",
    full_now: "서버가 가득 찼어요 ({count}/{max}). 나중에 다시 시도해 주세요.",
    last_slot: "주의: 마지막 슬롯 — 확인 중…",
    reserving: "슬롯 예약 중…",
    now_using: "이제 ‘사용 중’으로 표시됐어요. ✅",
    now_not_using: "이제 ‘미사용’으로 표시됐어요. ✋",
    error_generic: "문제가 발생했어요. 다시 시도해 주세요.",
    slot_opened: "자리가 났어요. 🎉",
    nobody: "현재 서버를 사용하는 사람이 없어요.",
    footer_built: "GitHub Pages와 Firebase로 제작.",
    footer_copyright: "© {year} {owner}",
  },
  ja: {
    title: "ワークロード管理",
    splash_help: "どこでもクリックするとコンソールが開きます。",
    open_console: "コンソールを開く",
    intro: "同時に使えるのは最大 <span class=\"accent\"><strong id=\"max\">3</strong></span> 人です。名前を選んで、<em>開始</em> / <em>停止</em> を押してください。",
    your_name: "あなたの名前",
    start: "開始",
    stop: "停止",
    using_now: "使用中",
    updates: "全員にリアルタイムで反映されます。",
    banner_start: "準備OK — 集中タイム！",
    banner_stop: "おつかれ — 休憩タイム！",
    already_using: "すでに「使用中」です。",
    cannot_start_full: "開始できません：サーバーが満員です（{count}/{max}）。",
    full_now: "サーバーが満員です（{count}/{max}）。後でもう一度お試しください。",
    last_slot: "注意：残り1枠 — 確認中…",
    reserving: "枠を確保しています…",
    now_using: "「使用中」に設定しました。✅",
    now_not_using: "「未使用」に設定しました。✋",
    error_generic: "問題が発生しました。もう一度お試しください。",
    slot_opened: "空きが出ました。🎉",
    nobody: "現在、使用している人はいません。",
    footer_built: "GitHub Pages と Firebase で構築。",
    footer_copyright: "© {year} {owner}",
  },

  // Klingon (playful approximations)
  tlh: {
    title: "Qu’ SeH",
    splash_help: "Doch naQDaq yIngaQ—console yIpoSmoH.",
    open_console: "console yIpoSmoH",
    intro: "wa’logh <span class=\"accent\"><strong id=\"max\">3</strong></span> nuvpu’ neH QapmeH. ponglIj yIwIv, ghIq <em>tagh</em> / <em>mev</em> yIngaQ.",
    your_name: "ponglIj",
    start: "tagh",
    stop: "mev",
    using_now: "lo’taH",
    updates: "HochvaD poH naQDaq chu’choH.",
    banner_start: "Suqeq—qapmeH poH!",
    banner_stop: "mev—leSmeH poH!",
    already_using: "bIperlaw’ ‘e’ ‘oH lo’taH.",
    cannot_start_full: "taghbe’: QapwI’ ghoS ‘e’ neH ({count}/{max}).",
    full_now: "QapwI’ ghoS ‘e’ neH ({count}/{max}). reH Qapla’!",
    last_slot: "ghIlaS: rarwI’ Qav—ma’bej…",
    reserving: "rarwI’ wInobtaH…",
    now_using: "DaH bIlo’taH. ✅",
    now_not_using: "DaH bIlo’be’. ✋",
    error_generic: "Doch qatlh. yInIDqa’.",
    slot_opened: "rarwI’ chu’ chenmoHlu’. 🎉",
    nobody: "pagh lo’taH De’wI’.",
    footer_built: "GitHub Pages je Firebase lo’ta’lu’.",
    footer_copyright: "© {year} {owner}",
  },

  // Quenya (fun/approximate)
  qya: {
    title: "Curo i Nauco",
    splash_help: "Á tamma maquetassë — panta i consola.",
    open_console: "Panta consola",
    intro: "A quain <span class=\"accent\"><strong id=\"max\">3</strong></span> eldar órenyallo hlarë. Ápelya essë, támë <em>Yesta</em> / <em>Pusta</em>.",
    your_name: "Esselya",
    start: "Yesta",
    stop: "Pusta",
    using_now: "yúanë sí",
    updates: "Quettar etelyar teni ilyë.",
    banner_start: "Varya—lehta ná!",
    banner_stop: "Á hosta—lárë ná!",
    already_using: "Á ná quetina ve ‘YÚSANWA’.",
    cannot_start_full: "Á yesta: i nóre ná corma ({count}/{max}).",
    full_now: "I nóre ná corma ({count}/{max}). Á enta alassë.",
    last_slot: "Nótima: corma tella — cansë…",
    reserving: "Corma amarta…",
    now_using: "Sinyë ná ‘YÚSANWA’. ✅",
    now_not_using: "Sinyë ná ‘ÚSANWA’. ✋",
    error_generic: "Rúcina natë. Á enta.",
    slot_opened: "Corma pánuva. 🎉",
    nobody: "Nemo lá yúsa i nóre.",
    footer_built: "Nácina mi GitHub Pages ar Firebase.",
    footer_copyright: "© {year} {owner}",
  },

  // Sindarin (fun/approximate)
  sjn: {
    title: "Harthad na Maethor",
    splash_help: "Teitha ned i thîw—edregi i console.",
    open_console: "Edregi i console",
    intro: "Na <span class=\"accent\"><strong id=\"max\">3</strong></span> gwedyr han aphadar. Eneth lín edregi, a gogi <em>Pered</em> / <em>Dar</em>.",
    your_name: "Eneth lín",
    start: "Pered",
    stop: "Dar",
    using_now: "ediad no",
    updates: "Nathad ned anann na bain.",
    banner_start: "Prestannen—am manadh!",
    banner_stop: "Dollen—lû dholl!",
    already_using: "Cin ven ‘EDiAD’ alassen.",
    cannot_start_full: "Ú-cheni: i edraith na cened ({count}/{max}).",
    full_now: "I edraith na cened ({count}/{max}). Aníron aníron.",
    last_slot: "Teithad: sad vedui — tiro…",
    reserving: "Sad edrannen…",
    now_using: "Sî cin na ‘EDiAD’. ✅",
    now_not_using: "Sî cin ú-ediad. ✋",
    error_generic: "Roch benn. Enni ad.",
    slot_opened: "Sad edui padannen. 🎉",
    nobody: "Ú-nen nador e-han.",
    footer_built: "Nawad hen na GitHub Pages a Firebase.",
    footer_copyright: "© {year} {owner}",
  },

  // Pirate (novelty)
  "x-pirate": {
    title: "Cap’n o’ Workloads",
    splash_help: "Click any bilge spot t’ open th’ console, matey.",
    open_console: "Open th’ console",
    intro: "Up t’ <span class=\"accent\"><strong id=\"max\">3</strong></span> hands be usin’ th’ server at once. Pick yer name, then hit <em>Hoist</em> / <em>Belay</em>.",
    your_name: "Yer name",
    start: "Hoist",
    stop: "Belay",
    using_now: "sailin’ now",
    updates: "Be refreshin’ fer all hands in real time.",
    banner_start: "All hands—to work!",
    banner_stop: "Belay that—rum time!",
    already_using: "Ye be marked as A-USIN’ already.",
    cannot_start_full: "Can’t hoist: th’ server be full ({count}/{max}).",
    full_now: "Th’ server be full ({count}/{max}). Try again later, matey.",
    last_slot: "Heads-up: last berth—checkin’…",
    reserving: "Reserving yer berth…",
    now_using: "Ye be marked A-USIN’. ✅",
    now_not_using: "Ye be marked NOT USIN’. ✋",
    error_generic: "Arrr, somethin’ went overboard. Try again.",
    slot_opened: "A berth just opened! 🎉",
    nobody: "No soul be usin’ the server.",
    footer_built: "Made with GitHub Pages ‘n Firebase.",
    footer_copyright: "© {year} {owner}",
  },

  // Emoji (novelty)
  "x-emoji": {
    title: "🧠⚙️",
    splash_help: "👆✨🖥️🔓",
    open_console: "🖥️🔓",
    intro: "👥 <span class=\"accent\"><strong id=\"max\">3</strong></span> 🖥️ • 🧑‍💻👉 <em>▶️</em>/<em>⏹️</em>",
    your_name: "🏷️",
    start: "▶️",
    stop: "⏹️",
    using_now: "🟣⏳",
    updates: "🔄⏱️👥",
    banner_start: "🚀🧠",
    banner_stop: "☕🛑",
    already_using: "✅🟣",
    cannot_start_full: "⛔🔒 ({count}/{max})",
    full_now: "🚫🔒 ({count}/{max})",
    last_slot: "⚠️🪑🔚",
    reserving: "📌⏳",
    now_using: "✅🟣",
    now_not_using: "✋⬜️",
    error_generic: "💥🔁",
    slot_opened: "🎉🪑🆓",
    nobody: "👻🚫🖥️",
    footer_built: "🧰🌐🔥",
    footer_copyright: "© {year} {owner}",
  },
};

let current = "en";

/* ---------- helpers ---------- */
function interpolate(s, vars) {
  return s.replace(/\{(\w+)\}/g, (_, k) => (vars?.[k] ?? ""));
}

export function t(key, vars = {}) {
  const dict = DICTS[current] || DICTS.en;
  const s = dict[key] ?? DICTS.en[key] ?? key;
  return interpolate(s, vars);
}

export function getLocale() { return current; }

export function setLocale(code) {
  current = DICTS[code] ? code : "en";
  document.documentElement.lang = current;
  localStorage.setItem("wm.locale", current);
  applyTranslations();
  window.dispatchEvent(new Event("wm:localechange"));
}

export function detectLocale() {
  const saved = localStorage.getItem("wm.locale");
  if (saved && DICTS[saved]) return saved;
  const nav = (navigator.language || "en").toLowerCase();
  if (nav.startsWith("zh")) return "zh";
  if (nav.startsWith("es")) return "es";
  if (nav.startsWith("ru")) return "ru";
  if (nav.startsWith("fr")) return "fr";
  if (nav.startsWith("de")) return "de";
  if (nav.startsWith("ja")) return "ja";
  if (nav.startsWith("ko")) return "ko";
  if (nav.startsWith("tlh")) return "tlh";
  if (nav.startsWith("qya")) return "qya";
  if (nav.startsWith("sjn")) return "sjn";
  return "en";
}

export function applyTranslations() {
  const maxEl = document.getElementById("max");
  const max = maxEl ? maxEl.textContent : "3";
  const year = String(new Date().getFullYear());

  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.dataset.i18n;
    const owner = el.dataset.owner || "Yufannnn";
    let extra = {};
    if (el.dataset.i18nVars) {
      try { extra = JSON.parse(el.dataset.i18nVars); } catch {}
    }
    const raw = t(key, { max, year, owner, ...extra });

    if (/[<>&]/.test(raw)) el.innerHTML = raw;
    else el.textContent = raw;
  });
}

export function initI18n(selectEl) {
  // Build options in the LOCALES order
  selectEl.innerHTML = LOCALES
    .map(({ code, label }) => `<option value="${code}">${label}</option>`)
    .join("");

  const initial = detectLocale();
  selectEl.value = initial;
  setLocale(initial);

  selectEl.addEventListener("change", () => setLocale(selectEl.value));

  // Expose a tiny API for places using window.i18n.t(...)
  window.i18n = { t, setLocale, getLocale };
}
