// js/i18n.js
// -------------------------------------------------------
// Simple i18n with fallback to English and ordered picker
// -------------------------------------------------------

/** Order of languages in the <select> */
const DISPLAY_ORDER = ["en", "zh", "es", "ru", "fr", "de", "ja", "ko"];

export const LANGS = {
  en: "English",
  zh: "中文",
  es: "Español",
  ru: "Русский",
  fr: "Français",
  de: "Deutsch",
  ja: "日本語",
  ko: "한국어",
};

const STRINGS = {
  /* ------------ English (fallback) ------------ */
  en: {
    title: "Workload Management",
    splash_help: "Click anywhere to open the console.",
    open_console: "Open console",
    intro:
      "Up to {max} people can use the server at once. Pick your name, then press Start / Stop.",
    your_name: "Your name",
    start: "Start",
    stop: "Stop",
    using_now: "using now",
    updates: "Updates in real time for everyone.",
    nobody: "Nobody is using the server.",
    already_using: "You are already marked as USING.",
    reserving: "Reserving a slot…",
    last_slot: "Heads-up: last slot — checking…",
    now_using: "You are now marked as USING. ✅",
    now_not_using: "You are now marked as NOT USING. ✋",
    full_now: "Server is full ({count}/{max}).",
    cannot_start_full: "Cannot start: server is full ({count}/{max}).",
    slot_opened: "A slot just opened. 🎉",
    error_generic: "Something went wrong. Please try again.",
  },

  /* ------------ Chinese ------------ */
  zh: {
    title: "工作负载管理",
    splash_help: "点击任意位置打开控制台。",
    open_console: "打开控制台",
    intro:
      "最多 {max} 人可同时使用服务器。选择你的名字，然后点击“开始 / 停止”。",
    your_name: "你的名字",
    start: "开始",
    stop: "停止",
    using_now: "正在使用",
    updates: "所有人实时同步更新。",
    nobody: "当前无人使用服务器。",
    already_using: "你已被标记为正在使用。",
    reserving: "正在为你占位…",
    last_slot: "注意：最后一个名额—正在确认…",
    now_using: "你已被标记为正在使用 ✅",
    now_not_using: "你已被标记为停止使用 ✋",
    full_now: "服务器已满（{count}/{max}）。",
    cannot_start_full: "无法开始：服务器已满（{count}/{max}）。",
    slot_opened: "有空位啦 🎉",
    error_generic: "出错了，请重试。",
  },

  /* ------------ Spanish ------------ */
  es: {
    title: "Gestión de Carga",
    splash_help: "Haz clic en cualquier parte para abrir la consola.",
    open_console: "Abrir consola",
    intro:
      "Hasta {max} personas pueden usar el servidor a la vez. Elige tu nombre y pulsa Iniciar / Detener.",
    your_name: "Tu nombre",
    start: "Iniciar",
    stop: "Detener",
    using_now: "en uso",
    updates: "Actualizaciones en tiempo real para todos.",
    nobody: "Nadie está usando el servidor.",
    already_using: "Ya estás marcado como USANDO.",
    reserving: "Reservando un lugar…",
    last_slot: "Atento: último cupo — comprobando…",
    now_using: "Ahora estás marcado como USANDO. ✅",
    now_not_using: "Ahora estás marcado como NO USANDO. ✋",
    full_now: "El servidor está lleno ({count}/{max}).",
    cannot_start_full: "No se puede iniciar: servidor lleno ({count}/{max}).",
    slot_opened: "Se liberó un cupo. 🎉",
    error_generic: "Algo salió mal. Inténtalo de nuevo.",
  },

  /* ------------ Russian ------------ */
  ru: {
    title: "Управление Нагрузкой",
    splash_help: "Нажмите в любом месте, чтобы открыть консоль.",
    open_console: "Открыть консоль",
    intro:
      "Одновременно сервером могут пользоваться до {max} человек. Выберите имя и нажмите Старт / Стоп.",
    your_name: "Ваше имя",
    start: "Старт",
    stop: "Стоп",
    using_now: "сейчас используют",
    updates: "Обновления в реальном времени для всех.",
    nobody: "Никто не использует сервер.",
    already_using: "Вы уже отмечены как ИСПОЛЬЗУЮЩИЙ.",
    reserving: "Бронируем слот…",
    last_slot: "Внимание: последний слот — проверяем…",
    now_using: "Теперь вы отмечены как ИСПОЛЬЗУЮЩИЙ. ✅",
    now_not_using: "Теперь вы отмечены как НЕ ИСПОЛЬЗУЮЩИЙ. ✋",
    full_now: "Сервер заполнен ({count}/{max}).",
    cannot_start_full: "Нельзя начать: сервер заполнен ({count}/{max}).",
    slot_opened: "Освободился слот. 🎉",
    error_generic: "Что-то пошло не так. Повторите попытку.",
  },

  /* ------------ French ------------ */
  fr: {
    title: "Gestion de charge",
    splash_help: "Cliquez n’importe où pour ouvrir la console.",
    open_console: "Ouvrir la console",
    intro:
      "Jusqu’à {max} personnes peuvent utiliser le serveur en même temps. Choisissez votre nom puis appuyez sur Démarrer / Arrêter.",
    your_name: "Votre nom",
    start: "Démarrer",
    stop: "Arrêter",
    using_now: "en cours",
    updates: "Mises à jour en temps réel pour tous.",
    nobody: "Personne n’utilise le serveur.",
    already_using: "Vous êtes déjà marqué comme EN COURS d’utilisation.",
    reserving: "Réservation d’un créneau…",
    last_slot: "Attention : dernier créneau — vérification…",
    now_using: "Vous êtes maintenant marqué comme EN COURS. ✅",
    now_not_using: "Vous n’utilisez plus le serveur. ✋",
    full_now: "Le serveur est plein ({count}/{max}).",
    cannot_start_full: "Impossible de démarrer : serveur plein ({count}/{max}).",
    slot_opened: "Un créneau vient de se libérer. 🎉",
    error_generic: "Une erreur s’est produite. Veuillez réessayer.",
  },

  /* ------------ German ------------ */
  de: {
    title: "Auslastungsverwaltung",
    splash_help: "Zum Öffnen der Konsole irgendwo klicken.",
    open_console: "Konsole öffnen",
    intro:
      "Bis zu {max} Personen können den Server gleichzeitig verwenden. Wähle deinen Namen und drücke Start / Stopp.",
    your_name: "Dein Name",
    start: "Start",
    stop: "Stopp",
    using_now: "in Benutzung",
    updates: "Aktualisierungen in Echtzeit für alle.",
    nobody: "Niemand benutzt den Server.",
    already_using: "Du bist bereits als IN BENUTZUNG markiert.",
    reserving: "Slot wird reserviert…",
    last_slot: "Achtung: letzter Slot — wird geprüft…",
    now_using: "Du bist jetzt als IN BENUTZUNG markiert. ✅",
    now_not_using: "Du bist jetzt als NICHT IN BENUTZUNG markiert. ✋",
    full_now: "Server ist voll ({count}/{max}).",
    cannot_start_full: "Start nicht möglich: Server voll ({count}/{max}).",
    slot_opened: "Ein Slot ist frei geworden. 🎉",
    error_generic: "Etwas ist schiefgelaufen. Bitte versuche es erneut.",
  },

  /* ------------ Japanese ------------ */
  ja: {
    title: "ワークロード管理",
    splash_help: "クリックしてコンソールを開きます。",
    open_console: "コンソールを開く",
    intro:
      "同時に最大 {max} 人までサーバーを使用できます。名前を選んで、開始 / 停止 を押してください。",
    your_name: "あなたの名前",
    start: "開始",
    stop: "停止",
    using_now: "使用中",
    updates: "すべての人にリアルタイムで反映されます。",
    nobody: "現在サーバーを使用している人はいません。",
    already_using: "すでに「使用中」としてマークされています。",
    reserving: "スロットを確保しています…",
    last_slot: "注意：最後の空き枠 — 確認中…",
    now_using: "「使用中」に設定しました。✅",
    now_not_using: "「未使用」に設定しました。✋",
    full_now: "サーバーは満員です（{count}/{max}）。",
    cannot_start_full: "開始できません：サーバーは満員です（{count}/{max}）。",
    slot_opened: "空き枠ができました。🎉",
    error_generic: "エラーが発生しました。もう一度お試しください。",
  },

  /* ------------ Korean ------------ */
  ko: {
    title: "작업 부하 관리",
    splash_help: "아무 곳이나 클릭하여 콘솔을 엽니다.",
    open_console: "콘솔 열기",
    intro:
      "최대 {max}명이 동시에 서버를 사용할 수 있습니다. 이름을 선택한 후 시작 / 중지를 누르세요.",
    your_name: "이름",
    start: "시작",
    stop: "중지",
    using_now: "사용 중",
    updates: "모두에게 실시간으로 업데이트됩니다.",
    nobody: "현재 서버를 사용하는 사람이 없습니다.",
    already_using: "이미 사용 중으로 표시되어 있습니다.",
    reserving: "슬롯을 예약하는 중…",
    last_slot: "알림: 마지막 슬롯 — 확인 중…",
    now_using: "이제 사용 중으로 표시되었습니다. ✅",
    now_not_using: "이제 사용 중이 아님으로 표시되었습니다. ✋",
    full_now: "서버가 가득 찼습니다 ({count}/{max}).",
    cannot_start_full: "시작할 수 없습니다: 서버가 가득 찼습니다 ({count}/{max}).",
    slot_opened: "슬롯이 하나 비었습니다. 🎉",
    error_generic: "문제가 발생했습니다. 다시 시도해 주세요.",
  },
};

let current = "en";

/* ---------- helpers ---------- */
function interpolate(s, vars) {
  return s.replace(/\{(\w+)\}/g, (_, k) => (vars?.[k] ?? ""));
}

export function t(key, vars = {}) {
  const s = (STRINGS[current] && STRINGS[current][key]) || STRINGS.en[key] || key;
  return interpolate(s, vars);
}

export function getLocale() { return current; }

export function setLocale(code) {
  current = LANGS[code] ? code : "en";
  document.documentElement.lang = current;
  localStorage.setItem("wm.locale", current);
  applyTranslations();
  // let components (select, aria labels…) refresh
  window.dispatchEvent(new Event("wm:localechange"));
}

export function detectLocale() {
  const saved = localStorage.getItem("wm.locale");
  if (saved && LANGS[saved]) return saved;
  const nav = (navigator.language || "en").toLowerCase();
  if (nav.startsWith("zh")) return "zh";
  if (nav.startsWith("es")) return "es";
  if (nav.startsWith("ru")) return "ru";
  if (nav.startsWith("fr")) return "fr";
  if (nav.startsWith("de")) return "de";
  if (nav.startsWith("ja")) return "ja";
  if (nav.startsWith("ko")) return "ko";
  return "en";
}

export function applyTranslations() {
  const maxEl = document.getElementById("max");
  const max = maxEl ? maxEl.textContent : "3";
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.dataset.i18n;
    el.textContent = t(key, { max });
  });
}

export function initI18n(selectEl) {
  // build options in the desired order
  selectEl.innerHTML = DISPLAY_ORDER
    .filter((code) => LANGS[code])
    .map((code) => `<option value="${code}">${LANGS[code]}</option>`)
    .join("");

  const initial = detectLocale();
  selectEl.value = initial;
  setLocale(initial);

  selectEl.addEventListener("change", () => setLocale(selectEl.value));
}
