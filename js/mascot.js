/* ═══════════════════════════════════════════════════════════════
   COME — PIX, the pixel mascot
   Inline pixel character, video-game coach-mark tour, speech
   bubbles and achievement reactions. All art is local SVG.
   ═══════════════════════════════════════════════════════════════ */

const MASCOT_TIPS = [
  ["Plan it", "Drop a task into the planner. Table, board or calendar — same day, three angles."],
  ["Focus room", "Open the focus room, pick a length and let the timer keep the edges for you."],
  ["Sound on", "Paste any Spotify playlist link in Music. It plays in the official embed — no tricks."],
  ["Streaks", "Finish one thing a day. The streak grows, and streak milestones pay CP."],
  ["CP", "Kept tasks, focus minutes and daily check-ins earn CP. Spend it in the Studio shop."],
  ["Themes", "There are 38 themes in the shop now. Anime, football, labs, vaporwave — pick a whole new room."],
  ["Skins", "PIX has new skins, profile effects and font packs in the shop. The classic look stays free."],
  ["Keyboard", "Press N for a new task, F for the focus room and Ctrl/Cmd + K for anything else."]
];

/* The tour points at real controls. `before` gets the target on screen. */
const MASCOT_TOUR = [
  {
    target: "#sidebarOpen",
    placement: "bottom",
    kicker: "STEP 1 · THE MENU",
    title: "Open the drawer.",
    body: "Everything lives behind this little menu button. Tap it — I’ll wait right here."
  },
  {
    target: '.nav-item[data-view="today"]',
    placement: "right",
    kicker: "STEP 2 · TODAY",
    title: "This is home base.",
    body: "Today shows the day, your streak and your CP. Tap it whenever you need to come back.",
    before: () => openSidebar()
  },
  {
    target: '#view-today .page-head [data-action="new-task"]',
    placement: "bottom",
    kicker: "STEP 3 · CAPTURE",
    title: "Drop a page here.",
    body: "This button adds a task. Try it — or press N anywhere in the studio.",
    before: () => { closeSidebar(); switchView("today"); }
  },
  {
    target: '.nav-item[data-view="music"]',
    placement: "right",
    kicker: "STEP 4 · SOUND",
    title: "Give the room a soundtrack.",
    body: "Music holds your official Spotify players. Paste a link, press play, and the whole playlist is right there.",
    before: () => { if (typeof closeTaskDrawer === "function") closeTaskDrawer(); openSidebar(); }
  },
  {
    target: '.nav-item[data-view="shop"]',
    placement: "right",
    kicker: "STEP 5 · REWARDS",
    title: "Spend what you keep.",
    body: "Kept tasks and focus minutes earn CP. The shop has PIX skins, font packs, animated profile effects, frames, titles and 38 full themes — anime, football, science labs, vaporwave and more.",
    before: () => openSidebar()
  },
  {
    target: null,
    placement: "center",
    kicker: "YOU’RE SET",
    title: "Go keep one small thing.",
    body: "I’ll be down here in the corner. Tap me any time for a tip, or just to say hi.",
    before: () => closeSidebar()
  }
];

const mascotState = {
  queue: [],
  timer: null,
  ready: false,
  idleTimer: null,
  coachOpen: false,
  coachStep: 0
};

/* ── the character ───────────────────────────────────────────── */
/* The verified 32×32 portrait, stored as colour-keyed pixel runs so
   every skin can recolour the same drawing without redrawing it. */
const PIX_ART = {
  hair: [
    [15,0,1,1],[10,1,2,1],[15,1,2,1],[20,1,2,1],[8,2,1,1],[10,2,14,1],[6,3,1,1],[8,3,18,1],
    [5,4,1,1],[7,4,20,1],[6,5,21,1],[5,6,23,1],[4,7,24,1],[4,8,24,1],[4,9,3,1],[10,9,2,1],
    [16,9,2,1],[21,9,2,1],[25,9,3,1],[4,10,2,1],[11,10,1,1],[21,10,1,1],[25,10,3,1],
    [25,11,3,1],[25,12,3,1],[25,13,3,1],[25,14,3,1],[25,15,3,1],[5,16,2,1],[25,16,3,1],
    [5,17,2,1],[25,17,3,1]
  ],
  hairHi: [[9,2,1,1],[7,3,1,1],[6,4,1,1],[5,5,1,1],[4,6,1,1]],
  rim: [
    [9,10,2,1],[12,10,4,1],[17,10,4,1],[22,10,2,1],[8,11,2,1],[15,11,3,1],[23,11,1,1],
    [8,12,2,1],[15,12,1,1],[17,12,1,1],[23,12,1,1],[8,13,2,1],[15,13,1,1],[17,13,1,1],
    [23,13,1,1],[6,14,1,1],[9,14,7,1],[17,14,7,1],[6,15,1,1],[4,16,1,1],[4,17,1,1],
    [4,18,1,1],[4,19,1,1],[4,20,1,1],[4,21,1,1],[4,22,1,1]
  ],
  skin: [
    [7,9,3,1],[12,9,4,1],[18,9,3,1],[23,9,2,1],[6,10,1,1],[8,10,1,1],[16,10,1,1],[24,10,1,1],
    [4,11,2,1],[7,11,1,1],[24,11,1,1],[4,12,2,1],[7,12,1,1],[16,12,1,1],[24,12,1,1],
    [4,13,2,1],[7,13,1,1],[16,13,1,1],[24,13,1,1],[3,14,1,1],[5,14,1,1],[7,14,2,1],
    [16,14,1,1],[24,14,1,1],[2,15,4,1],[7,15,9,1],[17,15,8,1],[1,16,3,1],[7,16,8,1],
    [18,16,7,1],[1,17,3,1],[8,17,7,1],[17,17,7,1],[1,18,3,1],[13,18,6,1],[1,19,3,1],
    [1,20,3,1],[2,21,2,1],[1,22,3,1]
  ],
  skinShade: [
    [7,10,1,1],[6,11,1,1],[6,12,1,1],[6,13,1,1],[4,14,1,1],[16,15,1,1],[7,17,1,1],
    [15,17,2,1],[24,17,1,1]
  ],
  lens: [
    [11,11,4,1],[19,11,4,1],[10,12,5,1],[18,12,5,1],[10,13,2,1],[18,13,2,1]
  ],
  glint: [[10,11,1,1],[18,11,1,1]],
  lensShade: [[12,13,3,1],[20,13,3,1]],
  mouth: [[15,16,3,1]],
  shirt: [
    [5,18,7,1],[20,18,6,1],[5,19,8,1],[19,19,7,1],[5,20,21,1],[5,21,21,1],[5,22,22,1],
    [0,23,5,1],[7,23,17,1],[0,24,5,1],[7,24,2,1],[10,24,12,1],[23,24,1,1],[0,25,9,1],
    [10,25,12,1],[23,25,5,1],[0,26,9,1],[10,26,12,1],[23,26,5,1],[1,27,8,1],[10,27,12,1],
    [23,27,4,1],[2,28,7,1],[10,28,11,1],[22,28,4,1],[3,29,7,1],[11,29,9,1],[21,29,4,1],
    [4,30,3,1],[21,30,3,1],[4,31,2,1],[22,31,2,1]
  ],
  shirtShade: [
    [12,18,1,1],[19,18,1,1],[13,19,6,1],[5,23,2,1],[24,23,3,1],[5,24,2,1],[9,24,1,1],
    [22,24,1,1],[24,24,3,1],[9,25,1,1],[22,25,1,1],[9,26,1,1],[22,26,1,1],[9,27,1,1],
    [22,27,1,1],[9,28,1,1],[21,28,1,1],[10,29,1,1],[20,29,1,1],[7,30,14,1],[6,31,16,1]
  ]
};

function pixSkinById(id) {
  const list = typeof PIX_SKINS !== "undefined" ? PIX_SKINS : [];
  return list.find(s => s.id === id) || list[0] || null;
}

function pixSVG(skin, extraClass = "") {
  const s = skin || pixSkinById("pix-original");
  if (!s) return "";
  const pal = Object.assign({}, (typeof PIX_BASE_PALETTE !== "undefined" ? PIX_BASE_PALETTE : {}), s.palette || {});
  const run = (r, color) => `<rect x="${r[0]}" y="${r[1]}" width="${r[2]}" height="${r[3]}" fill="${color}"/>`;
  const layers = ["hair", "hairHi", "rim", "skin", "skinShade", "lens", "glint", "lensShade", "mouth", "shirt", "shirtShade"];
  let body = layers.map(key => (PIX_ART[key] || []).map(r => run(r, pal[key] || "#000")).join("")).join("");
  (s.acc || []).forEach(a => { body += run(a, a[4]); });
  return `<svg class="pix-svg ${extraClass}" viewBox="0 0 32 32" shape-rendering="crispEdges" role="img" aria-label="PIX, the COME mascot">${body}</svg>`;
}

function mascotSVG(extraClass = "") {
  const id = (typeof user !== "undefined" && user && user.equipped) ? user.equipped.pix : "pix-original";
  return pixSVG(pixSkinById(id), extraClass);
}

function refreshMascotArt() {
  const btn = document.getElementById("mascotBtn");
  if (btn) {
    const old = btn.querySelector(".pix-svg");
    if (old) old.outerHTML = mascotSVG();
    else btn.insertAdjacentHTML("afterbegin", mascotSVG());
  }
  const coach = document.getElementById("coachPix");
  if (coach) coach.innerHTML = mascotSVG();
  const focus = document.getElementById("focusPixArt");
  if (focus) focus.innerHTML = mascotSVG("focus-pix-svg");
}


/* ── build the UI once ───────────────────────────────────────── */
function initMascot() {
  if (mascotState.ready || document.getElementById("mascotRoot")) return;

  const root = document.createElement("div");
  root.className = "mascot-root hidden";
  root.id = "mascotRoot";
  root.innerHTML = `
    <button class="mascot-avatar" id="mascotBtn" type="button" aria-label="Talk to PIX">
      ${mascotSVG()}
      <span class="mascot-badge hidden" id="mascotBadge">1</span>
    </button>
    <div class="mascot-bubble hidden" id="mascotBubble" role="status" aria-live="polite">
      <button class="mascot-bubble-close" id="mascotBubbleClose" type="button" aria-label="Close message">×</button>
      <strong id="mascotBubbleTitle">PIX</strong>
      <p id="mascotBubbleText"></p>
    </div>`;
  document.body.appendChild(root);

  const coach = document.createElement("div");
  coach.className = "coach-root hidden";
  coach.id = "coachRoot";
  coach.innerHTML = `
    <div class="coach-spot" id="coachSpot"></div>
    <div class="coach-card" id="coachCard" role="dialog" aria-label="COME tutorial">
      <div class="coach-pix" id="coachPix">${mascotSVG()}</div>
      <div class="coach-copy">
        <span class="mono" id="coachKicker"></span>
        <strong id="coachTitle"></strong>
        <p id="coachText"></p>
      </div>
      <div class="coach-actions">
        <span class="coach-step" id="coachStep"></span>
        <span class="coach-spacer"></span>
        <button class="text-btn" id="coachSkip" type="button">Skip tour</button>
        <button class="btn btn-primary btn-sm" id="coachNext" type="button">Next</button>
      </div>
    </div>`;
  document.body.appendChild(coach);

  document.getElementById("mascotBtn")?.addEventListener("click", () => {
    const bubble = document.getElementById("mascotBubble");
    if (bubble && !bubble.classList.contains("hidden")) {
      hideMascotBubble();
      return;
    }
    const tip = MASCOT_TIPS[Math.floor(Math.random() * MASCOT_TIPS.length)];
    mascotSay(tip[0], tip[1], { force: true });
    mascotCheer("wave");
  });
  document.getElementById("mascotBubbleClose")?.addEventListener("click", hideMascotBubble);
  document.getElementById("coachNext")?.addEventListener("click", coachNext);
  document.getElementById("coachSkip")?.addEventListener("click", () => finishTutorial(true));

  const focusArt = document.getElementById("focusPixArt");
  if (focusArt && !focusArt.firstChild) focusArt.innerHTML = mascotSVG("focus-pix-svg");

  mascotState.ready = true;
}

/* ── show / hide ─────────────────────────────────────────────── */
function mascotEnter(opts = {}) {
  if (!user) return;
  initMascot();
  const root = document.getElementById("mascotRoot");
  if (root) root.classList.remove("hidden");
  startMascotIdle();
  if (!user.tutorialSeen) {
    setTimeout(() => showMascotTutorial(), 850);
  } else if (opts.newUser) {
    setTimeout(() => mascotSay("New room", "Welcome in. Tap me any time you want a tip."), 900);
  }
}

function mascotLeave() {
  const root = document.getElementById("mascotRoot");
  if (root) root.classList.add("hidden");
  hideMascotBubble();
  closeMascotTutorial();
  stopMascotIdle();
  mascotState.queue = [];
}

function startMascotIdle() {
  stopMascotIdle();
  mascotState.idleTimer = setInterval(() => {
    if (!user || mascotState.coachOpen) return;
    mascotCheer(Math.random() < 0.5 ? "wave" : "hop");
  }, 14000);
}
function stopMascotIdle() {
  if (mascotState.idleTimer) clearInterval(mascotState.idleTimer);
  mascotState.idleTimer = null;
}
function mascotCheer(kind = "hop") {
  const avatar = document.getElementById("mascotBtn");
  if (!avatar) return;
  avatar.classList.remove("mascot-wave", "mascot-hop");
  void avatar.offsetWidth;
  avatar.classList.add(kind === "wave" ? "mascot-wave" : "mascot-hop");
  setTimeout(() => avatar.classList.remove("mascot-wave", "mascot-hop"), 1800);
}

/* ── focus-room companion ────────────────────────────────────── */
function mascotFocusLine(text) {
  const el = document.getElementById("focusPixLine");
  if (el) el.textContent = text;
}

/* ── speech bubble ───────────────────────────────────────────── */
function mascotSay(title, text, opts = {}) {
  if (!user || !mascotState.ready) return;
  if (mascotState.coachOpen) return;
  if (opts.force) mascotState.queue = [];
  mascotState.queue.push({ title, text });
  if (mascotState.queue.length > 4) mascotState.queue.shift();
  updateMascotBadge();
  pumpMascot();
}

function updateMascotBadge() {
  const badge = document.getElementById("mascotBadge");
  if (!badge) return;
  const count = mascotState.queue.length;
  badge.textContent = String(count);
  badge.classList.toggle("hidden", count === 0);
}

function pumpMascot() {
  const bubble = document.getElementById("mascotBubble");
  if (!bubble || mascotState.coachOpen) return;
  if (!bubble.classList.contains("hidden")) return;
  const next = mascotState.queue.shift();
  updateMascotBadge();
  if (!next) return;
  const title = document.getElementById("mascotBubbleTitle");
  const text = document.getElementById("mascotBubbleText");
  if (title) title.textContent = next.title;
  if (text) text.textContent = next.text;
  bubble.classList.remove("hidden");
  clearTimeout(mascotState.timer);
  mascotState.timer = setTimeout(() => {
    hideMascotBubble();
    setTimeout(pumpMascot, 240);
  }, 6400);
}

function hideMascotBubble() {
  clearTimeout(mascotState.timer);
  mascotState.timer = null;
  const bubble = document.getElementById("mascotBubble");
  if (bubble) bubble.classList.add("hidden");
  updateMascotBadge();
}

/* ── coach-mark tour ─────────────────────────────────────────── */
function showMascotTutorial() {
  if (!user || user.tutorialSeen || mascotState.coachOpen) return;
  initMascot();
  mascotState.coachOpen = true;
  mascotState.coachStep = 0;
  hideMascotBubble();
  document.documentElement.classList.add("coach-tour");
  const root = document.getElementById("coachRoot");
  if (root) root.classList.remove("hidden");
  renderCoach();
}

function renderCoach() {
  if (!mascotState.coachOpen) return;
  const step = MASCOT_TOUR[mascotState.coachStep];
  if (!step) { finishTutorial(); return; }
  if (typeof step.before === "function") {
    try { step.before(); } catch (e) { /* keep the tour moving */ }
  }
  const kicker = document.getElementById("coachKicker");
  const title = document.getElementById("coachTitle");
  const text = document.getElementById("coachText");
  const next = document.getElementById("coachNext");
  const counter = document.getElementById("coachStep");
  if (kicker) kicker.textContent = step.kicker;
  if (title) title.textContent = step.title;
  if (text) text.textContent = step.body;
  if (next) next.textContent = step.target ? "Next" : "Finish";
  if (counter) counter.textContent = `${mascotState.coachStep + 1} / ${MASCOT_TOUR.length}`;
  scheduleCoachPosition(step);
}

/* The sidebar slides for 500ms, so keep re-measuring while it moves. */
let coachTimers = [];
function scheduleCoachPosition(step) {
  coachTimers.forEach(clearTimeout);
  coachTimers = [];
  requestAnimationFrame(() => positionCoach(step));
  [120, 320, 600, 900].forEach(ms => {
    coachTimers.push(setTimeout(() => positionCoach(step), ms));
  });
}
function clearCoachTimers() {
  coachTimers.forEach(clearTimeout);
  coachTimers = [];
}

function positionCoach(step) {
  const spot = document.getElementById("coachSpot");
  const card = document.getElementById("coachCard");
  if (!spot || !card || !mascotState.coachOpen) return;
  const target = step.target ? document.querySelector(step.target) : null;
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  if (!target) {
    spot.style.display = "none";
    card.style.left = Math.max(12, Math.round((vw - card.offsetWidth) / 2)) + "px";
    card.style.top = Math.max(12, Math.round((vh - card.offsetHeight) / 2)) + "px";
    return;
  }
  const r = target.getBoundingClientRect();
  const pad = 7;
  spot.style.display = "block";
  spot.style.left = Math.max(4, Math.round(r.left - pad)) + "px";
  spot.style.top = Math.max(4, Math.round(r.top - pad)) + "px";
  spot.style.width = Math.min(vw - 8, Math.round(r.width + pad * 2)) + "px";
  spot.style.height = Math.min(vh - 8, Math.round(r.height + pad * 2)) + "px";

  const cw = card.offsetWidth;
  const ch = card.offsetHeight;
  let x, y;
  const place = step.placement || "right";
  if (place === "right") {
    x = r.right + 18;
    y = r.top + r.height / 2 - ch / 2;
  } else if (place === "left") {
    x = r.left - cw - 18;
    y = r.top + r.height / 2 - ch / 2;
  } else if (place === "top") {
    x = r.left + r.width / 2 - cw / 2;
    y = r.top - ch - 18;
  } else {
    x = r.left + r.width / 2 - cw / 2;
    y = r.bottom + 18;
  }
  if (place === "right" && x + cw > vw - 12) x = r.left - cw - 18;
  if (y + ch > vh - 12) y = r.top - ch - 18;
  x = clamp(x, 12, Math.max(12, vw - cw - 12));
  y = clamp(y, 12, Math.max(12, vh - ch - 12));

  /* never let the card sit on top of the control it points at */
  const overlaps = x < r.right && x + cw > r.left && y < r.bottom && y + ch > r.top;
  if (overlaps) {
    if (r.top > ch + 24) {
      y = r.top - ch - 18;
      x = r.left + r.width / 2 - cw / 2;
    } else if (r.bottom + ch + 24 < vh) {
      y = r.bottom + 18;
      x = r.left + r.width / 2 - cw / 2;
    } else {
      x = 12;
      y = vh - ch - 12;
    }
    x = clamp(x, 12, Math.max(12, vw - cw - 12));
    y = clamp(y, 12, Math.max(12, vh - ch - 12));
  }

  card.style.left = Math.round(x) + "px";
  card.style.top = Math.round(y) + "px";
}

function coachNext() {
  if (!mascotState.coachOpen) return;
  mascotState.coachStep += 1;
  if (mascotState.coachStep >= MASCOT_TOUR.length) {
    finishTutorial();
    return;
  }
  renderCoach();
}

function closeMascotTutorial() {
  const root = document.getElementById("coachRoot");
  if (root) root.classList.add("hidden");
  document.documentElement.classList.remove("coach-tour");
  clearCoachTimers();
  mascotState.coachOpen = false;
  mascotState.coachStep = 0;
}

function finishTutorial(skipped = false) {
  if (user) {
    user.tutorialSeen = true;
    save();
  }
  closeMascotTutorial();
  if (skipped) {
    mascotSay("No problem", "Tap me whenever you want the short version.");
  } else {
    confetti(70);
    mascotSay("You’re set", "That’s the whole room. Go keep one small thing today.");
  }
  setTimeout(pumpMascot, 260);
}

/* ── reactions ───────────────────────────────────────────────── */
function mascotOnTask(task) {
  if (!task) return;
  const title = task.title.length > 38 ? task.title.slice(0, 38) + "…" : task.title;
  const lines = [
    `“${title}” is kept. That’s the whole trick — small, finished things.`,
    `Done and paid. “${title}” won’t be haunting tomorrow.`,
    `That’s one more page closed. I’m adding it to the good pile.`
  ];
  mascotSay("Task kept", lines[Math.floor(Math.random() * lines.length)]);
  mascotCheer("hop");
}

function mascotOnAward(amount, reason, opts = {}) {
  if (!amount || amount < 8) return;
  const text = String(reason || "");
  if (text.includes("kept")) return;
  if (/focused minute/i.test(text)) {
    mascotSay("Focus logged", `+${amount} CP for ${text}. The quiet minutes add up.`);
    return;
  }
  if (/streak/i.test(text)) {
    mascotSay("Streak kept", `${text}. +${amount} CP. Showing up is the whole game.`);
    return;
  }
  if (opts.celebrate) {
    mascotSay("Nice work", `+${amount} CP · ${text}. I saw that.`);
    mascotCheer("hop");
  }
}

function mascotOnPurchase(item) {
  if (!item) return;
  mascotSay("New gear", `“${item.name}” is yours and already worn. Looking sharp.`);
  mascotCheer("hop");
}

function mascotOnPlaylist(playlist) {
  if (!playlist) return;
  mascotSay("Sound on", `“${playlist.title}” is loaded in the official Spotify player. Press play when you’re ready.`);
}

/* ── global hooks ────────────────────────────────────────────── */
document.addEventListener("click", event => {
  if (!mascotState.coachOpen) return;
  const step = MASCOT_TOUR[mascotState.coachStep];
  if (!step || !step.target) return;
  const target = document.querySelector(step.target);
  if (!target) return;
  if (target === event.target || target.contains(event.target)) {
    setTimeout(() => {
      if (mascotState.coachOpen) coachNext();
    }, 320);
  }
}, true);

document.addEventListener("keydown", event => {
  if (event.key !== "Escape") return;
  if (mascotState.coachOpen) {
    event.preventDefault();
    finishTutorial(true);
  }
});

window.addEventListener("resize", () => {
  if (mascotState.coachOpen) positionCoach(MASCOT_TOUR[mascotState.coachStep]);
});
window.addEventListener("scroll", () => {
  if (mascotState.coachOpen) positionCoach(MASCOT_TOUR[mascotState.coachStep]);
}, true);
