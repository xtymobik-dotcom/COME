/* ═══════════════════════════════════════════════════════════════
   COME — store, accounts, rewards, streak, tasks, shop
   ═══════════════════════════════════════════════════════════════ */

const STORE_KEY = "cotime.v1";
let DB = loadDB();
let user = null;

const ui = {
  view: "today",
  dbView: "table",
  shopTab: "all",
  search: "",
  category: "all",
  sort: "date",
  calDate: new Date(),
  editingId: null,
  dockOpen: false,
  commandIndex: 0
};

/* ── tiny utils ──────────────────────────────────────────────── */
function uid() {
  return "id" + Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}
function esc(value) {
  return String(value ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}
function clamp(n, min, max) { return Math.min(max, Math.max(min, n)); }
function hashStr(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = ((h << 5) - h + str.charCodeAt(i)) | 0;
  return Math.abs(h);
}
function dateKey(d = new Date()) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
function todayKey() { return dateKey(new Date()); }
function keyOffset(days) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return dateKey(d);
}
function parseKey(key) {
  const [y, m, d] = key.split("-").map(Number);
  return new Date(y, m - 1, d);
}
function fmtMinutes(mins) {
  const m = Math.round(mins || 0);
  if (m < 60) return m + "m";
  const h = Math.floor(m / 60);
  const rest = m % 60;
  return rest ? `${h}h ${rest}m` : `${h}h`;
}
function fmtDate(key) {
  const d = parseKey(key);
  return new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short" }).format(d);
}
function isTyping() {
  const el = document.activeElement;
  return !!el && (el.tagName === "INPUT" || el.tagName === "TEXTAREA" || el.tagName === "SELECT" || el.isContentEditable);
}

/* ── persistence ─────────────────────────────────────────────── */
function loadDB() {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && parsed.users) return parsed;
    }
  } catch (e) { /* private mode or corrupt data */ }
  return { v: 1, users: {}, current: null };
}
function save() {
  try { localStorage.setItem(STORE_KEY, JSON.stringify(DB)); } catch (e) { /* ignore */ }
}
function hashPin(pin) {
  let h = 5381;
  const s = String(pin);
  for (let i = 0; i < s.length; i++) h = ((h << 5) + h) ^ s.charCodeAt(i);
  return (h >>> 0).toString(36);
}

/* ── accounts ────────────────────────────────────────────────── */
function makeDefaultLook() {
  return {
    theme: "theme-gallery",
    frame: "frame-classic",
    title: "title-curator",
    banner: "banner-bone"
  };
}
function starterTasks() {
  return STARTER_TASKS.map((t, i) => ({
    id: uid(),
    title: t.title,
    category: t.category,
    priority: t.priority,
    status: t.status,
    date: keyOffset(t.offset),
    notes: t.notes,
    minutes: t.minutes,
    cpEarned: t.status === "done",
    createdAt: Date.now() + i,
    completedAt: t.status === "done" ? new Date().toISOString() : null
  }));
}
function createUser({ name, username, pin }) {
  const key = username.toLowerCase().replace(/\s+/g, "-");
  const u = {
    username: key,
    name: name.trim(),
    pin: hashPin(pin),
    avatarLetter: name.trim().charAt(0).toUpperCase() || "A",
    createdAt: new Date().toISOString(),
    cp: 60,
    lifetime: 60,
    streak: 0,
    bestStreak: 0,
    lastActive: null,
    tasks: starterTasks(),
    sessions: [],
    playlists: [],
    owned: ["frame-classic", "theme-gallery", "title-curator", "banner-bone"],
    equipped: makeDefaultLook(),
    activePlaylist: null,
    tutorialSeen: false
  };
  DB.users[key] = u;
  DB.current = key;
  save();
  user = u;
  return u;
}
function signup(name, username, pin) {
  const key = String(username || "").trim().toLowerCase();
  if (!name || name.trim().length < 2) return { ok: false, error: "Give your studio a name — at least two letters." };
  if (!/^[a-z0-9_-]{2,20}$/.test(key)) return { ok: false, error: "Usernames use 2–20 letters, numbers, - or _." };
  if (DB.users[key]) return { ok: false, error: "That username is already keeping time here." };
  if (!/^\d{4,8}$/.test(String(pin || ""))) return { ok: false, error: "Your PIN should be 4–8 numbers." };
  const u = createUser({ name, username: key, pin });
  return { ok: true, user: u };
}
function login(username, pin) {
  const key = String(username || "").trim().toLowerCase();
  const u = DB.users[key];
  if (!u) return { ok: false, error: "No studio found under that name." };
  if (u.pin !== hashPin(pin)) return { ok: false, error: "That PIN doesn’t match. Try once more." };
  migrateUser(u);
  DB.current = key;
  save();
  user = u;
  return { ok: true, user: u };
}
function makeDemoUser() {
  const u = {
    username: "demo",
    name: "Mira",
    pin: hashPin("1234"),
    avatarLetter: "M",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 42).toISOString(),
    cp: 380,
    lifetime: 1420,
    streak: 6,
    bestStreak: 12,
    lastActive: todayKey(),
    tasks: DEMO_TASKS.map((t, i) => ({
      id: uid(),
      title: t.title,
      category: t.category,
      priority: t.priority,
      status: t.status,
      date: keyOffset(t.offset),
      notes: t.notes,
      minutes: t.minutes,
      cpEarned: t.status === "done",
      createdAt: Date.now() - (10 - i) * 86400000,
      completedAt: t.status === "done" ? new Date().toISOString() : null
    })),
    sessions: DEMO_SESSIONS.map(s => ({
      id: uid(),
      date: keyOffset(s.offset),
      minutes: s.minutes,
      category: s.category,
      taskId: null
    })),
    playlists: DEMO_PLAYLISTS.map((p, i) => ({
      id: uid() + i,
      title: p.title,
      type: p.type,
      spotifyId: p.spotifyId,
      art: p.art,
      addedAt: Date.now() - i * 100000
    })),
    owned: [
      "frame-classic", "frame-gold", "theme-gallery", "title-curator", "title-deep", "banner-bone", "banner-navy"
    ],
    equipped: { theme: "theme-gallery", frame: "frame-gold", title: "title-deep", banner: "banner-bone" },
    activePlaylist: null,
    tutorialSeen: false
  };
  u.activePlaylist = u.playlists[0] ? u.playlists[0].id : null;
  DB.users.demo = u;
  DB.current = "demo";
  save();
  user = u;
  return u;
}
function demoLogin() {
  const u = DB.users.demo || makeDemoUser();
  migrateUser(u);
  DB.current = "demo";
  save();
  user = u;
  return u;
}
function logout() {
  DB.current = null;
  save();
  user = null;
  document.documentElement.dataset.theme = "gallery";
  clearThemeTokens();
}

/* ── streak & rewards ────────────────────────────────────────── */
function touchStreak() {
  if (!user) return { newDay: false };
  const today = todayKey();
  if (user.lastActive === today) return { newDay: false };
  const yesterday = keyOffset(-1);
  const continued = user.lastActive === yesterday;
  user.streak = continued ? user.streak + 1 : 1;
  user.bestStreak = Math.max(user.bestStreak || 0, user.streak);
  user.lastActive = today;
  const daily = 2 + Math.min(user.streak, 10);
  user.cp += daily;
  user.lifetime += daily;
  const milestone = STREAK_MILESTONES.find(m => m.days === user.streak);
  if (milestone) {
    user.cp += milestone.cp;
    user.lifetime += milestone.cp;
  }
  save();
  return { newDay: true, continued, daily, milestone, streak: user.streak };
}
function nextMilestone(streak) {
  return STREAK_MILESTONES.find(m => m.days > streak) || null;
}
function award(amount, reason, opts = {}) {
  if (!user || !amount) return;
  user.cp += amount;
  user.lifetime += Math.max(0, amount);
  save();
  if (typeof updateMoneyUI === "function") updateMoneyUI();
  if (typeof bumpCP === "function") bumpCP();
  if (!opts.silent) {
    if (typeof toast === "function") toast(`+${amount} CP · ${reason}`, "coin");
    if ((opts.celebrate || amount >= 50) && typeof confetti === "function") confetti(amount >= 120 ? 120 : 70);
    if (typeof mascotOnAward === "function") mascotOnAward(amount, reason, opts);
  }
}
function levelInfo(u = user) {
  const lifetime = Math.max(0, u ? u.lifetime : 0);
  const level = Math.floor(Math.sqrt(lifetime / 500)) + 1;
  const base = 500 * Math.pow(level - 1, 2);
  const next = 500 * Math.pow(level, 2);
  const into = lifetime - base;
  const need = next - base;
  return {
    level,
    name: LEVEL_NAMES[Math.min(level - 1, LEVEL_NAMES.length - 1)],
    progress: clamp(into / need, 0, 1),
    toNext: Math.max(0, next - lifetime)
  };
}
function totalFocusMinutes(u = user) {
  if (!u) return 0;
  return (u.sessions || []).reduce((sum, s) => sum + (s.minutes || 0), 0);
}
function completedCount(u = user) {
  return u ? u.tasks.filter(t => t.status === "done").length : 0;
}

/* ── tasks ───────────────────────────────────────────────────── */
function findTask(id) { return user ? user.tasks.find(t => t.id === id) : null; }
function createTask(data = {}) {
  if (!user) return null;
  const t = {
    id: uid(),
    title: (data.title || "Untitled page").trim(),
    status: data.status || "todo",
    category: data.category || "study",
    priority: data.priority || "medium",
    date: data.date || todayKey(),
    notes: data.notes || "",
    minutes: 0,
    cpEarned: false,
    createdAt: Date.now(),
    completedAt: null
  };
  if (t.status === "done") { t.completedAt = new Date().toISOString(); t.cpEarned = true; }
  user.tasks.unshift(t);
  save();
  return t;
}
function setTaskStatus(task, status, opts = {}) {
  if (!task) return;
  const was = task.status;
  task.status = status;
  if (status === "done") {
    if (!task.completedAt) task.completedAt = new Date().toISOString();
    if (!task.cpEarned) {
      task.cpEarned = true;
      const bonus = (PRIORITIES[task.priority] || PRIORITIES.medium).bonus;
      award(bonus, `“${task.title.slice(0, 34)}” kept`, opts);
      if (was !== "done" && typeof mascotOnTask === "function") mascotOnTask(task);
    }
  } else {
    task.completedAt = null;
  }
  save();
  return was;
}
function toggleTask(id) {
  const t = findTask(id);
  if (!t) return;
  setTaskStatus(t, t.status === "done" ? "todo" : "done");
  if (typeof renderAll === "function") renderAll();
}
function deleteTask(id) {
  if (!user) return;
  const task = findTask(id);
  user.tasks = user.tasks.filter(t => t.id !== id);
  save();
  if (typeof toast === "function") toast(`“${(task ? task.title : "Page").slice(0, 34)}” let go`, "good");
  if (typeof renderAll === "function") renderAll();
}

/* ── focus sessions ──────────────────────────────────────────── */
function logFocus(minutes, taskId, category) {
  if (!user) return;
  const mins = Math.max(1, Math.round(minutes));
  const task = taskId ? findTask(taskId) : null;
  user.sessions.push({
    id: uid(),
    date: todayKey(),
    minutes: mins,
    category: category || (task ? task.category : "study"),
    taskId: taskId || null
  });
  if (task) {
    task.minutes = (task.minutes || 0) + mins;
    if (task.status === "todo") task.status = "doing";
  }
  save();
  const focusCP = Math.max(1, Math.round(mins / 4));
  award(focusCP, `${mins} focused minute${mins === 1 ? "" : "s"}`, { celebrate: mins >= 25 });
  return mins;
}

/* ── music ───────────────────────────────────────────────────── */
function parseSpotify(input) {
  if (!input) return null;
  const raw = String(input).trim();
  let m = raw.match(/spotify:(playlist|album|track|artist):([A-Za-z0-9]+)/i);
  if (!m) m = raw.match(/open\.spotify\.com\/(?:intl-[a-z-]+\/)?(?:embed\/)?(playlist|album|track|artist)\/([A-Za-z0-9]+)/i);
  if (!m) m = raw.match(/^(?:https?:\/\/)?(?:open\.)?spotify\.com\/(?:intl-[a-z-]+\/)?(?:embed\/)?(playlist|album|track|artist)\/([A-Za-z0-9]+)/i);
  if (!m) m = raw.match(/^(playlist|album|track|artist)[\/:]([A-Za-z0-9]{8,})$/i);
  if (!m) return null;
  return { type: m[1].toLowerCase(), id: m[2] };
}
function spotifyEmbedUrl(p) {
  return `https://open.spotify.com/embed/${p.type}/${p.spotifyId}?utm_source=generator&theme=0`;
}
function spotifyOpenUrl(p) {
  return `https://open.spotify.com/${p.type}/${p.spotifyId}`;
}
function addPlaylist(url, title) {
  if (!user) return { ok: false, error: "Sign in first." };
  const parsed = parseSpotify(url);
  if (!parsed) return { ok: false, error: "That doesn’t look like a Spotify link. Try a playlist, album or track URL." };
  if (parsed.type === "artist") return { ok: false, error: "Artist pages can’t be played here — try a playlist, album or track." };
  const p = {
    id: uid(),
    title: (title || "").trim() || "Untitled rotation",
    type: parsed.type,
    spotifyId: parsed.id,
    art: hashStr(parsed.id) % 4,
    addedAt: Date.now()
  };
  user.playlists.unshift(p);
  user.activePlaylist = p.id;
  save();
  return { ok: true, playlist: p };
}
function removePlaylist(id) {
  if (!user) return;
  user.playlists = user.playlists.filter(p => p.id !== id);
  if (user.activePlaylist === id) user.activePlaylist = null;
  save();
}
function activePlaylist() {
  if (!user || !user.activePlaylist) return null;
  return user.playlists.find(p => p.id === user.activePlaylist) || null;
}
function setActivePlaylist(id) {
  if (!user) return null;
  const p = user.playlists.find(x => x.id === id);
  if (!p) return null;
  user.activePlaylist = id;
  save();
  return p;
}
function playlistArtClass(p) {
  return `art-${((p.art ?? hashStr(p.spotifyId)) % 4 + 4) % 4}`;
}

/* ── shop ────────────────────────────────────────────────────── */
function itemById(id) { return SHOP_ITEMS.find(i => i.id === id); }
function isFreeItem(id) { const it = itemById(id); return !it || it.price === 0; }
function equippedItem(type) {
  if (!user) return null;
  const id = user.equipped[type];
  return itemById(id) || SHOP_ITEMS.find(i => i.type === type && i.price === 0) || null;
}
function buyItem(id) {
  const it = itemById(id);
  if (!user || !it) return { ok: false };
  const owned = user.owned.includes(id);
  if (!owned) {
    if (user.cp < it.price) {
      if (typeof toast === "function") toast(`Need ${it.price - user.cp} more CP for ${it.name}`, "bad");
      if (typeof confetti === "function") confetti(0);
      return { ok: false, reason: "cp" };
    }
    user.cp -= it.price;
    user.owned.push(id);
  }
  user.equipped[it.type] = id;
  save();
  applyLook();
  if (typeof renderAll === "function") renderAll();
  if (!owned) {
    if (typeof toast === "function") toast(`${it.name} is yours — and worn.`, "good");
    if (typeof confetti === "function") confetti(80);
    if (typeof mascotOnPurchase === "function") mascotOnPurchase(it);
  } else {
    if (typeof toast === "function") toast(`${it.name} equipped`, "good");
  }
  return { ok: true, bought: !owned };
}
function applyLook() {
  if (!user) {
    document.documentElement.dataset.theme = "gallery";
    clearThemeTokens();
    return;
  }
  const theme = itemById(user.equipped.theme);
  const value = theme && theme.value ? theme.value : "gallery";
  document.documentElement.dataset.theme = value;
  applyThemeTokens(value);
}
function clearThemeTokens() {
  const root = document.documentElement;
  Object.keys(THEME_BASE).forEach(key => root.style.removeProperty("--" + key));
}
function applyThemeTokens(name) {
  clearThemeTokens();
  const theme = THEMES[name];
  if (!theme) return;
  Object.entries(theme.tokens).forEach(([key, value]) => {
    document.documentElement.style.setProperty("--" + key, value);
  });
}

/* ── session bootstrap ───────────────────────────────────────── */
function migrateUser(u) {
  if (!u || !Array.isArray(u.playlists)) return;
  u.playlists.forEach(p => {
    if (p.spotifyId === "37i9dQZF1DWWQRwui0ExPn" && p.title === "Slow Focus") p.title = "Lofi Beats";
  });
}
function restoreSession() {
  if (!DB.current) return false;
  const u = DB.users[DB.current];
  if (!u) return false;
  migrateUser(u);
  user = u;
  save();
  applyLook();
  return true;
}
