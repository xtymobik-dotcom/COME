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
  ["Themes", "There are 30 themes in the shop now. Anime, study labs, vaporwave — pick a whole new room."],
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
    body: "Kept tasks and focus minutes earn CP. The shop has frames, titles and 30 full themes — anime, science labs, vaporwave and more.",
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
function mascotSVG(extraClass = "") {
  return `<svg class="pix-svg ${extraClass}" viewBox="0 0 32 32" shape-rendering="crispEdges" role="img" aria-label="PIX, the COME mascot">
    <!-- hair spikes and crown -->
    <rect x="11" y="1" width="3" height="2" fill="#101d3f"/>
    <rect x="16" y="0" width="3" height="3" fill="#101d3f"/>
    <rect x="20" y="2" width="2" height="2" fill="#101d3f"/>
    <rect x="7" y="4" width="2" height="3" fill="#101d3f"/>
    <rect x="23" y="4" width="2" height="3" fill="#101d3f"/>
    <rect x="8" y="3" width="16" height="3" fill="#101d3f"/>
    <rect x="12" y="2" width="2" height="1" fill="#24406e"/>
    <rect x="19" y="4" width="2" height="1" fill="#24406e"/>
    <!-- face -->
    <rect x="10" y="6" width="12" height="10" fill="#e8a06d"/>
    <rect x="9" y="10" width="1" height="3" fill="#e8a06d"/>
    <rect x="22" y="10" width="1" height="3" fill="#e8a06d"/>
    <rect x="10" y="12" width="1" height="3" fill="#c97f52"/>
    <rect x="21" y="12" width="1" height="3" fill="#c97f52"/>
    <rect x="12" y="15" width="8" height="1" fill="#e8a06d"/>
    <rect x="13" y="16" width="6" height="1" fill="#c97f52"/>
    <!-- hair sides and bangs -->
    <rect x="8" y="5" width="2" height="8" fill="#101d3f"/>
    <rect x="22" y="5" width="2" height="8" fill="#101d3f"/>
    <rect x="10" y="5" width="5" height="2" fill="#101d3f"/>
    <rect x="18" y="5" width="4" height="2" fill="#101d3f"/>
    <rect x="15" y="6" width="1" height="2" fill="#101d3f"/>
    <rect x="21" y="6" width="1" height="2" fill="#101d3f"/>
    <!-- eyes, brows, nose, mouth, blush -->
    <rect x="12" y="8" width="2" height="1" fill="#101d3f"/>
    <rect x="18" y="8" width="2" height="1" fill="#101d3f"/>
    <rect x="12" y="9" width="2" height="3" fill="#070d20"/>
    <rect x="18" y="9" width="2" height="3" fill="#070d20"/>
    <rect x="12" y="9" width="1" height="1" fill="#f3e8d0"/>
    <rect x="18" y="9" width="1" height="1" fill="#f3e8d0"/>
    <rect x="13" y="11" width="1" height="1" fill="#38d6a4"/>
    <rect x="19" y="11" width="1" height="1" fill="#38d6a4"/>
    <rect x="15" y="11" width="2" height="1" fill="#c97f52"/>
    <rect x="16" y="12" width="1" height="1" fill="#c97f52"/>
    <rect x="14" y="13" width="4" height="1" fill="#6e1f2c"/>
    <rect x="15" y="14" width="2" height="1" fill="#6e1f2c"/>
    <rect x="11" y="12" width="1" height="1" fill="#d97a6a"/>
    <rect x="20" y="12" width="1" height="1" fill="#d97a6a"/>
    <!-- neck and cream shirt -->
    <rect x="14" y="16" width="4" height="1" fill="#c97f52"/>
    <rect x="8" y="17" width="16" height="9" fill="#f3e8d0"/>
    <rect x="7" y="18" width="2" height="5" fill="#f3e8d0"/>
    <rect x="23" y="18" width="2" height="5" fill="#f3e8d0"/>
    <rect x="8" y="25" width="16" height="1" fill="#d9c9a8"/>
    <rect x="13" y="17" width="6" height="1" fill="#c14a55"/>
    <rect x="12" y="18" width="1" height="1" fill="#c14a55"/>
    <rect x="19" y="18" width="1" height="1" fill="#c14a55"/>
    <!-- sleeves and cuffs -->
    <rect x="6" y="19" width="2" height="4" fill="#f3e8d0"/>
    <rect x="24" y="19" width="2" height="4" fill="#f3e8d0"/>
    <rect x="6" y="23" width="2" height="1" fill="#d9c9a8"/>
    <rect x="24" y="23" width="2" height="1" fill="#d9c9a8"/>
    <!-- the handheld console, with the one teal light -->
    <rect x="9" y="19" width="14" height="6" fill="#070d20"/>
    <rect x="10" y="20" width="12" height="4" fill="#c14a55"/>
    <rect x="12" y="20" width="8" height="3" fill="#38d6a4"/>
    <rect x="12" y="20" width="2" height="1" fill="#9ff5d8"/>
    <rect x="10" y="21" width="1" height="1" fill="#f3e8d0"/>
    <rect x="21" y="21" width="1" height="1" fill="#f3e8d0"/>
    <rect x="10" y="23" width="1" height="1" fill="#6e1f2c"/>
    <rect x="12" y="23" width="1" height="1" fill="#6e1f2c"/>
    <rect x="14" y="23" width="1" height="1" fill="#6e1f2c"/>
    <!-- hands over the console edges -->
    <rect x="8" y="21" width="2" height="2" fill="#e8a06d"/>
    <rect x="22" y="21" width="2" height="2" fill="#e8a06d"/>
    <!-- belt and trousers -->
    <rect x="8" y="26" width="16" height="1" fill="#070d20"/>
    <rect x="15" y="26" width="2" height="1" fill="#c14a55"/>
    <rect x="9" y="27" width="6" height="3" fill="#101d3f"/>
    <rect x="17" y="27" width="6" height="3" fill="#101d3f"/>
    <rect x="15" y="27" width="2" height="3" fill="#070d20"/>
    <rect x="10" y="28" width="1" height="1" fill="#24406e"/>
    <rect x="18" y="28" width="1" height="1" fill="#24406e"/>
    <!-- red sneakers -->
    <rect x="8" y="30" width="7" height="2" fill="#c14a55"/>
    <rect x="17" y="30" width="7" height="2" fill="#c14a55"/>
    <rect x="8" y="31" width="7" height="1" fill="#f3e8d0"/>
    <rect x="17" y="31" width="7" height="1" fill="#f3e8d0"/>
    <rect x="10" y="30" width="2" height="1" fill="#d9c9a8"/>
    <rect x="19" y="30" width="2" height="1" fill="#d9c9a8"/>
  </svg>`;
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
