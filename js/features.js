/* ═══════════════════════════════════════════════════════════════
   COME — focus room, music player, command palette, delight
   ═══════════════════════════════════════════════════════════════ */

/* ── toasts ──────────────────────────────────────────────────── */
function bumpCP() {
  document.querySelectorAll(".chip-cp").forEach(chip => {
    chip.classList.remove("bump");
    void chip.offsetWidth;
    chip.classList.add("bump");
  });
}

function toast(message, type = "good") {
  const stack = document.getElementById("toastStack");
  if (!stack) return;
  while (stack.children.length >= 3) stack.firstElementChild.remove();
  const el = document.createElement("div");
  el.className = "toast";
  const icons = { good: "✓", coin: "✦", bad: "!" };
  el.innerHTML = `<span class="t-icon ${type}">${icons[type] || "✦"}</span><span class="t-msg"></span>`;
  el.querySelector(".t-msg").textContent = message;
  stack.appendChild(el);
  setTimeout(() => {
    el.classList.add("leaving");
    setTimeout(() => el.remove(), 320);
  }, 3400);
}

/* ── confetti ────────────────────────────────────────────────── */
let confettiRaf = null;
function confetti(count = 80) {
  if (!count) return;
  const canvas = document.getElementById("confetti");
  if (!canvas) return;
  if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  const dpr = Math.min(2, window.devicePixelRatio || 1);
  const w = window.innerWidth;
  const h = window.innerHeight;
  canvas.width = w * dpr;
  canvas.height = h * dpr;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  const colors = ["#c14a55", "#38d6a4", "#e8a06d", "#f3e8d0", "#6f9dff", "#ff6b7a", "#122048"];
  const total = Math.min(count, 170);
  const cx = w / 2;
  const cy = h * 0.42;
  const parts = Array.from({ length: total }, () => {
    const angle = (-Math.PI / 2) + (Math.random() - 0.5) * Math.PI * 1.5;
    const speed = 4 + Math.random() * 11;
    return {
      x: cx + (Math.random() - 0.5) * 100,
      y: cy + (Math.random() - 0.5) * 50,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 3,
      size: 3 + Math.random() * 6,
      color: colors[Math.floor(Math.random() * colors.length)],
      rot: Math.random() * Math.PI,
      vr: (Math.random() - 0.5) * 0.28,
      round: Math.random() > 0.7
    };
  });
  const start = performance.now();
  if (confettiRaf) cancelAnimationFrame(confettiRaf);
  function frame(now) {
    const elapsed = now - start;
    ctx.clearRect(0, 0, w, h);
    parts.forEach(p => {
      p.vy += 0.28;
      p.vx *= 0.994;
      p.x += p.vx;
      p.y += p.vy;
      p.rot += p.vr;
      const alpha = clamp(1 - elapsed / 2400, 0, 1);
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.fillStyle = p.color;
      if (p.round) {
        ctx.beginPath();
        ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.62);
      }
      ctx.restore();
    });
    if (elapsed < 2400) confettiRaf = requestAnimationFrame(frame);
    else ctx.clearRect(0, 0, w, h);
  }
  confettiRaf = requestAnimationFrame(frame);
}

/* ── focus room ──────────────────────────────────────────────── */
const focusState = {
  total: 25 * 60,
  left: 25 * 60,
  running: false,
  interval: null,
  taskId: "",
  label: "ready when you are"
};

function populateFocusTasks() {
  const select = document.getElementById("focusTask");
  if (!select) return;
  const openTasks = user ? user.tasks.filter(t => t.status !== "done") : [];
  select.innerHTML = `<option value="">No particular task</option>` + openTasks.map(t =>
    `<option value="${t.id}" ${focusState.taskId === t.id ? "selected" : ""}>${esc(t.title)}</option>`
  ).join("");
}

function renderFocus() {
  const timeEl = document.getElementById("focusTime");
  if (!timeEl) return;
  const mins = Math.floor(focusState.left / 60);
  const secs = focusState.left % 60;
  timeEl.textContent = `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  const stateEl = document.getElementById("focusState");
  if (stateEl) {
    stateEl.textContent = focusState.running
      ? "in the quiet"
      : focusState.left < focusState.total
        ? "paused · still yours"
        : focusState.label;
  }
  const ring = document.getElementById("focusRing");
  if (ring) {
    const circumference = 2 * Math.PI * 146;
    const progress = focusState.left / focusState.total;
    ring.style.strokeDashoffset = String(circumference * (1 - progress));
  }
  const start = document.getElementById("focusStart");
  if (start) start.textContent = focusState.running ? "Pause" : focusState.left < focusState.total ? "Resume" : "Begin focus";
  document.querySelectorAll("#focusLengths button").forEach(btn => {
    btn.classList.toggle("active", Number(btn.dataset.min) * 60 === focusState.total);
    btn.disabled = focusState.running;
    btn.style.opacity = focusState.running ? ".5" : "1";
  });
  if (focusState.running) {
    document.title = `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")} · COME`;
  } else {
    document.title = "COME — the activity studio";
  }
}

function renderFocusMusic() {
  const wrap = document.getElementById("focusMusic");
  if (!wrap) return;
  const p = activePlaylist();
  if (!p) {
    wrap.innerHTML = `<div class="focus-music-empty">
      <span class="fm-ic">♪</span>
      <div><strong>The room is quiet</strong><span>Add a Spotify playlist to bring sound in.</span></div>
      <button data-action="focus-to-music">Add sound</button>
    </div>`;
    return;
  }
  wrap.innerHTML = `<div class="focus-music-head"><strong>${esc(p.title)}</strong><span class="mono">SPOTIFY · ${esc(p.type)}</span></div>
    <iframe src="${spotifyEmbedUrl(p)}" width="100%" height="152" frameborder="0" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy" title="Spotify playlist"></iframe>`;
}

function openFocus() {
  if (!user) return;
  const overlay = document.getElementById("focusOverlay");
  if (!overlay) return;
  overlay.classList.remove("hidden");
  document.body.classList.add("no-scroll");
  populateFocusTasks();
  renderFocusMusic();
  renderFocus();
  if (typeof mascotFocusLine === "function") mascotFocusLine("I’ll keep watch while you work.");
}

function closeFocus() {
  const overlay = document.getElementById("focusOverlay");
  if (!overlay) return;
  if (focusState.running) pauseFocus();
  overlay.classList.add("hidden");
  document.body.classList.remove("no-scroll");
}

function pauseFocus() {
  focusState.running = false;
  if (focusState.interval) clearInterval(focusState.interval);
  focusState.interval = null;
  renderFocus();
  if (typeof mascotFocusLine === "function") mascotFocusLine("Paused. Stretch your hands.");
}

function focusTick() {
  if (!focusState.running) return;
  focusState.left = Math.max(0, focusState.left - 1);
  if (focusState.left <= 0) {
    completeFocus();
    return;
  }
  renderFocus();
}

function startPauseFocus() {
  if (!user) return;
  if (focusState.running) {
    pauseFocus();
    return;
  }
  if (focusState.left <= 0) focusState.left = focusState.total;
  focusState.running = true;
  focusState.label = "in the quiet";
  if (focusState.interval) clearInterval(focusState.interval);
  focusState.interval = setInterval(focusTick, 1000);
  renderFocus();
  if (typeof mascotFocusLine === "function") mascotFocusLine("Head down. I’ve got the door.");
}

function resetFocus() {
  pauseFocus();
  focusState.left = focusState.total;
  focusState.label = "ready when you are";
  renderFocus();
  if (typeof mascotFocusLine === "function") mascotFocusLine("Ready when you are.");
}

function setFocusLength(minutes) {
  if (focusState.running) return;
  focusState.total = minutes * 60;
  focusState.left = focusState.total;
  focusState.label = "ready when you are";
  renderFocus();
}

function completeFocus() {
  pauseFocus();
  const minutes = Math.round(focusState.total / 60);
  const task = focusState.taskId ? findTask(focusState.taskId) : null;
  logFocus(minutes, focusState.taskId, task ? task.category : "study");
  focusState.left = focusState.total;
  focusState.label = "beautifully kept";
  focusState.running = false;
  if (focusState.interval) clearInterval(focusState.interval);
  focusState.interval = null;
  if (typeof mascotFocusLine === "function") mascotFocusLine(`That’s ${minutes} minutes kept.`);
  renderFocus();
  renderFocusMusic();
  focusState.label = "ready when you are";
  setTimeout(() => {
    const stateEl = document.getElementById("focusState");
    if (stateEl && !focusState.running) stateEl.textContent = "beautifully kept";
  }, 30);
  renderAll();
}

/* ── music + dock ────────────────────────────────────────────── */
function renderDock(playlist, force = false) {
  const dock = document.getElementById("playerDock");
  if (!dock) return;
  const p = playlist || activePlaylist();
  document.body.classList.toggle("dock-open", !!(ui.dockVisible && p && ui.dockOpen));
  if (!ui.dockVisible || !p) {
    dock.classList.add("hidden");
    return;
  }
  dock.classList.remove("hidden");
  dock.classList.toggle("open", !!ui.dockOpen);
  const title = document.getElementById("dockTitle");
  const sub = document.getElementById("dockSub");
  const art = document.getElementById("dockArt");
  if (title) title.textContent = p.title;
  if (sub) sub.textContent = `Spotify · ${p.type}`;
  if (art) art.className = "dock-art " + playlistArtClass(p);
  const slot = document.getElementById("dockEmbedSlot");
  if (slot && (force || dock.dataset.playlist !== p.id)) {
    slot.innerHTML = `<iframe src="${spotifyEmbedUrl(p)}" width="100%" height="152" frameborder="0" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy" title="Spotify player"></iframe>`;
    dock.dataset.playlist = p.id;
  }
}

function activatePlaylist(id, opts = {}) {
  const p = setActivePlaylist(id);
  if (!p) return;
  ui.dockVisible = true;
  ui.dockOpen = true;
  renderDock(p, true);
  renderMusic();
  renderFocusMusic();
  if (opts.openFocus) {
    openFocus();
  } else {
    toast(`“${p.title}” is in the room`, "good");
  }
}

function closeDock() {
  ui.dockVisible = false;
  ui.dockOpen = false;
  document.body.classList.remove("dock-open");
  const dock = document.getElementById("playerDock");
  if (dock) dock.classList.add("hidden");
}

function toggleDock() {
  const p = activePlaylist();
  if (!p) { switchView("music"); return; }
  ui.dockVisible = true;
  ui.dockOpen = !ui.dockOpen;
  renderDock(p);
}

function handlePlaylistSubmit(event) {
  event.preventDefault();
  const urlEl = document.getElementById("playlistUrl");
  const nameEl = document.getElementById("playlistName");
  const errorEl = document.getElementById("playlistError");
  if (!urlEl) return;
  const result = addPlaylist(urlEl.value, nameEl ? nameEl.value : "");
  if (!result.ok) {
    if (errorEl) {
      errorEl.textContent = result.error;
      errorEl.classList.add("shake");
      setTimeout(() => errorEl.classList.remove("shake"), 500);
    }
    return;
  }
  if (errorEl) errorEl.textContent = "";
  urlEl.value = "";
  if (nameEl) nameEl.value = "";
  renderAll();
  renderDock(result.playlist, true);
  toast(`“${result.playlist.title}” added and loaded`, "good");
  confetti(40);
  if (typeof mascotOnPlaylist === "function") mascotOnPlaylist(result.playlist);
}

function deletePlaylistFlow(id) {
  const p = user.playlists.find(x => x.id === id);
  if (!p) return;
  if (!window.confirm(`Remove “${p.title}” from your rotation?`)) return;
  const wasActive = user.activePlaylist === id;
  removePlaylist(id);
  if (wasActive) closeDock();
  renderAll();
  toast(`“${p.title}” left the room`, "good");
}

/* ── command palette ─────────────────────────────────────────── */
function commandItems() {
  return [
    { id: "today", label: "Go to Today", icon: "◷", hint: "Today", run: () => switchView("today") },
    { id: "planner", label: "Open the planner database", icon: "▦", hint: "Planner", run: () => switchView("planner") },
    { id: "new-task", label: "Create a new task", icon: "＋", hint: "N", run: () => openTaskDrawer(null) },
    { id: "focus", label: "Enter the focus room", icon: "◷", hint: "F", run: () => openFocus() },
    { id: "music", label: "Open your music", icon: "♪", hint: "Music", run: () => switchView("music") },
    { id: "shop", label: "Visit the studio shop", icon: "◈", hint: "Shop", run: () => switchView("shop") },
    { id: "profile", label: "View your profile", icon: "✦", hint: "Profile", run: () => switchView("profile") },
    { id: "add-playlist", label: "Add a Spotify playlist", icon: "♪", hint: "Music", run: () => { switchView("music"); setTimeout(() => { const el = document.getElementById("playlistUrl"); if (el) el.focus(); }, 350); } },
    { id: "board", label: "Switch planner to Board", icon: "▥", hint: "View", run: () => { switchView("planner"); setDbView("board"); } },
    { id: "calendar", label: "Switch planner to Calendar", icon: "▦", hint: "View", run: () => { switchView("planner"); setDbView("calendar"); } },
    { id: "signout", label: "Sign out of the studio", icon: "⏻", hint: "Logout", run: () => requestLogout() }
  ];
}
let visibleCommands = [];

function renderCommand(query = "") {
  const list = document.getElementById("commandList");
  if (!list) return;
  const q = query.trim().toLowerCase();
  visibleCommands = commandItems().filter(c => !q || c.label.toLowerCase().includes(q) || c.id.includes(q));
  ui.commandIndex = clamp(ui.commandIndex, 0, Math.max(0, visibleCommands.length - 1));
  if (!visibleCommands.length) {
    list.innerHTML = `<div class="command-empty">No command found. Try “focus” or “new task”.</div>`;
    return;
  }
  list.innerHTML = visibleCommands.map((c, i) => `<div class="command-item ${i === ui.commandIndex ? "active" : ""}" data-action="command-run" data-command="${c.id}">
    <span class="ci-ic">${c.icon}</span><span class="ci-label">${esc(c.label)}</span><span>${esc(c.hint)}</span>
  </div>`).join("");
}

function openCommand() {
  const palette = document.getElementById("commandPalette");
  if (!palette) return;
  palette.classList.remove("hidden");
  document.body.classList.add("no-scroll");
  const input = document.getElementById("commandInput");
  if (input) { input.value = ""; setTimeout(() => input.focus(), 40); }
  ui.commandIndex = 0;
  renderCommand("");
}

function closeCommand() {
  const palette = document.getElementById("commandPalette");
  if (!palette) return;
  palette.classList.add("hidden");
  document.body.classList.remove("no-scroll");
}

function runCommand(id) {
  const cmd = commandItems().find(c => c.id === id);
  closeCommand();
  if (cmd) setTimeout(() => cmd.run(), 60);
}
