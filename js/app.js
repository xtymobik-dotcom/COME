/* ═══════════════════════════════════════════════════════════════
   COME — app controller, auth, navigation, interactions
   ═══════════════════════════════════════════════════════════════ */

/* ── boot ────────────────────────────────────────────────────── */
function init() {
  bindAuth();
  bindNavigation();
  bindTaskDrawer();
  bindProfile();
  bindImageUploads();
  bindMusic();
  bindFocus();
  bindPlanner();
  bindCommand();
  bindGlobal();
  setupReveals();
  setupLandingFx();
  setupCounters();
  initMascot();

  if (restoreSession()) {
    enterApp({ restored: true });
    if (typeof cloudBootSync === "function") cloudBootSync();
  } else {
    document.documentElement.dataset.theme = "gallery";
    showLanding();
  }
}

/* ── landing / app transitions ───────────────────────────────── */
function showLanding() {
  const landing = document.getElementById("landing");
  const app = document.getElementById("app");
  if (landing) landing.classList.remove("hidden");
  if (app) app.classList.add("hidden");
  document.body.classList.remove("no-scroll");
  document.documentElement.dataset.theme = "gallery";
  if (typeof clearThemeTokens === "function") clearThemeTokens();
  document.title = "COME — the activity studio";
  closeDock();
  closeSidebar();
  mascotLeave();
  setTimeout(setupReveals, 50);
}

function enterApp(opts = {}) {
  const landing = document.getElementById("landing");
  const app = document.getElementById("app");
  if (landing) landing.classList.add("hidden");
  if (app) app.classList.remove("hidden");
  document.body.classList.remove("no-scroll");
  closeAuth();
  closeProfileModal();
  closeSidebar();
  const wasNew = opts.newUser;
  const streak = touchStreak();
  ui.dockVisible = false;
  ui.dockOpen = false;
  ui.calDate = new Date();
  renderAll();
  switchView("today", false);
  window.scrollTo(0, 0);
  if (streak.newDay) {
    setTimeout(() => {
      toast(`Day ${streak.streak} kept · +${streak.daily} CP`, "good");
      if (user && user.tutorialSeen) {
        mascotSay("Day kept", `Day ${streak.streak} in the room. +${streak.daily} CP just for showing up.`);
      }
      if (streak.milestone) {
        setTimeout(() => {
          toast(`Streak milestone · +${streak.milestone.cp} CP`, "coin");
          confetti(140);
          if (user && user.tutorialSeen) mascotSay("Milestone", `${streak.streak} days in a row. +${streak.milestone.cp} bonus CP. That’s a real streak.`);
        }, 550);
      }
    }, 700);
  }
  if (wasNew) {
    setTimeout(() => confetti(100), 350);
  }
  mascotEnter({ newUser: wasNew });
}

/* ── auth ────────────────────────────────────────────────────── */
function openAuth(tab = "login") {
  const modal = document.getElementById("authModal");
  if (!modal) return;
  modal.classList.remove("hidden");
  document.body.classList.add("no-scroll");
  switchAuthTab(tab);
  const input = document.querySelector(`#${tab === "login" ? "loginUsername" : "signupName"}`);
  if (input) setTimeout(() => input.focus(), 120);
}
function closeAuth() {
  const modal = document.getElementById("authModal");
  if (modal) modal.classList.add("hidden");
  if (!document.querySelector(".drawer-backdrop:not(.hidden), .focus-overlay:not(.hidden), .command-backdrop:not(.hidden), #profileModal:not(.hidden)")) {
    document.body.classList.remove("no-scroll");
  }
}
function switchAuthTab(tab) {
  document.querySelectorAll(".auth-tab").forEach(t => t.classList.toggle("active", t.dataset.authTab === tab));
  document.getElementById("loginForm").classList.toggle("hidden", tab !== "login");
  document.getElementById("signupForm").classList.toggle("hidden", tab !== "signup");
  const title = document.getElementById("authTitle");
  const sub = document.getElementById("authSub");
  if (tab === "signup") {
    if (title) title.textContent = "Make a little room.";
    if (sub) sub.textContent = "A studio for your days, your sound and your streaks.";
  } else {
    if (title) title.textContent = "Welcome back.";
    if (sub) sub.textContent = "Your days have been waiting, patiently.";
  }
}
function formError(id, message) {
  const el = document.getElementById(id);
  if (!el) return;
  el.textContent = message;
  el.classList.remove("shake");
  void el.offsetWidth;
  el.classList.add("shake");
}
function authBusy(form, on, label) {
  const btn = form.querySelector('button[type="submit"]');
  if (!btn) return;
  if (on) {
    btn.dataset.label = btn.textContent;
    btn.textContent = label;
    btn.disabled = true;
  } else {
    btn.textContent = btn.dataset.label || btn.textContent;
    btn.disabled = false;
  }
}
function bindAuth() {
  document.querySelectorAll("[data-auth]").forEach(btn => {
    btn.addEventListener("click", () => openAuth(btn.dataset.auth));
  });
  document.querySelectorAll("[data-auth-tab]").forEach(btn => {
    btn.addEventListener("click", () => switchAuthTab(btn.dataset.authTab));
  });
  document.querySelectorAll("[data-auth-close]").forEach(btn => btn.addEventListener("click", closeAuth));
  const modal = document.getElementById("authModal");
  if (modal) modal.addEventListener("click", e => { if (e.target === modal) closeAuth(); });

  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
    loginForm.addEventListener("submit", async e => {
      e.preventDefault();
      const username = document.getElementById("loginUsername").value;
      const pin = document.getElementById("loginPin").value;
      authBusy(loginForm, true, "Signing in…");
      const res = await cloudLogin(username, pin);
      authBusy(loginForm, false);
      if (!res.ok) { formError("loginError", res.error); return; }
      formError("loginError", "");
      document.getElementById("loginPin").value = "";
      enterApp();
    });
  }

  const signupForm = document.getElementById("signupForm");
  if (signupForm) {
    signupForm.addEventListener("submit", async e => {
      e.preventDefault();
      const name = document.getElementById("signupName").value;
      const username = document.getElementById("signupUsername").value;
      const pin = document.getElementById("signupPin").value;
      authBusy(signupForm, true, "Creating…");
      const res = await cloudSignup(name, username, pin);
      authBusy(signupForm, false);
      if (!res.ok) { formError("signupError", res.error); return; }
      formError("signupError", "");
      document.getElementById("signupPin").value = "";
      const first = res.user.name.split(" ")[0];
      enterApp({ newUser: true });
      setTimeout(() => toast(`Welcome, ${first}. Your studio is ready · +120 CP`, "coin"), 260);
    });
  }
}

/* ── navigation ──────────────────────────────────────────────── */
const VIEW_LABELS = { today: "Today", planner: "Planner", music: "Music", shop: "Studio shop", profile: "Profile" };

function switchView(view, scroll = true) {
  if (!VIEW_LABELS[view]) return;
  ui.view = view;
  document.querySelectorAll(".view").forEach(v => v.classList.toggle("active", v.dataset.view === view));
  document.querySelectorAll(".nav-item").forEach(n => n.classList.toggle("active", n.dataset.view === view));
  const crumb = document.getElementById("viewCrumb");
  if (crumb) crumb.textContent = VIEW_LABELS[view];
  if (user) {
    if (view === "today") renderToday();
    if (view === "planner") renderPlanner();
    if (view === "music") renderMusic();
    if (view === "shop") renderShop();
    if (view === "profile") renderProfile();
    updateMoneyUI();
  }
  closeSidebar();
  if (scroll) window.scrollTo({ top: 0, behavior: "smooth" });
}
function setDbView(view) {
  ui.dbView = view;
  document.querySelectorAll("[data-dbview]").forEach(btn => btn.classList.toggle("active", btn.dataset.dbview === view));
  const panels = { table: "plannerTable", board: "plannerBoard", calendar: "plannerCalendar" };
  Object.entries(panels).forEach(([key, id]) => {
    const el = document.getElementById(id);
    if (el) el.classList.toggle("active", key === view);
  });
  if (user) renderPlanner();
}
function requestLogout() {
  if (!window.confirm("Sign out of COME? Your studio stays saved to your account.")) return;
  const flushed = typeof cloudFlush === "function" ? cloudFlush() : Promise.resolve();
  logout();
  closeFocus();
  closeDock();
  showLanding();
  toast("Signed out. Your days are safe here.", "good");
  Promise.resolve(flushed).then(() => { if (typeof cloudSignOut === "function") cloudSignOut(); });
}
function openSidebar() {
  const sidebar = document.getElementById("sidebar");
  if (!sidebar) return;
  sidebar.classList.add("open");
  document.getElementById("sidebarScrim")?.classList.add("open");
  document.body.classList.add("sidebar-open");
  document.getElementById("sidebarOpen")?.setAttribute("aria-expanded", "true");
}
function closeSidebar() {
  document.getElementById("sidebar")?.classList.remove("open");
  document.getElementById("sidebarScrim")?.classList.remove("open");
  document.body.classList.remove("sidebar-open");
  document.getElementById("sidebarOpen")?.setAttribute("aria-expanded", "false");
}
function bindNavigation() {
  document.getElementById("sidebarOpen")?.addEventListener("click", openSidebar);
  document.getElementById("sidebarClose")?.addEventListener("click", closeSidebar);
  document.getElementById("sidebarScrim")?.addEventListener("click", closeSidebar);
}

/* ── task drawer ─────────────────────────────────────────────── */
function openTaskDrawer(id = null, preset = {}) {
  if (!user) return;
  const drawer = document.getElementById("taskDrawer");
  if (!drawer) return;
  ui.editingId = id || null;
  const task = id ? findTask(id) : null;
  document.getElementById("taskTitle").value = task ? task.title : "";
  document.getElementById("taskStatus").value = task ? task.status : (preset.status || "todo");
  document.getElementById("taskCategory").value = task ? task.category : (preset.category || "study");
  document.getElementById("taskPriority").value = task ? task.priority : (preset.priority || "medium");
  document.getElementById("taskDate").value = task ? task.date : (preset.date || todayKey());
  document.getElementById("taskNotes").value = task ? (task.notes || "") : "";
  const kicker = document.getElementById("drawerKicker");
  if (kicker) kicker.textContent = task ? "PAGE" : "NEW PAGE";
  const del = document.getElementById("taskDelete");
  if (del) del.style.display = task ? "grid" : "none";
  const meta = document.getElementById("taskMeta");
  if (meta) {
    if (task) {
      meta.innerHTML = `<span>created ${fmtDate(dateKey(new Date(task.createdAt)))}</span><span>${fmtMinutes(task.minutes)} focused</span><span>${task.cpEarned ? "CP kept" : "no CP yet"}</span><span>${STATUSES[task.status]}</span>`;
    } else {
      meta.innerHTML = `<span>a new page</span><span>${fmtDate(preset.date || todayKey())}</span><span>status · ${STATUSES[preset.status || "todo"]}</span>`;
    }
  }
  drawer.classList.remove("hidden");
  document.body.classList.add("no-scroll");
  setTimeout(() => {
    const title = document.getElementById("taskTitle");
    if (title) title.focus();
    if (title && task) title.select();
  }, 160);
}
function closeTaskDrawer() {
  const drawer = document.getElementById("taskDrawer");
  if (drawer) drawer.classList.add("hidden");
  ui.editingId = null;
  if (!document.querySelector(".modal-backdrop:not(.hidden), .focus-overlay:not(.hidden), .command-backdrop:not(.hidden), .drawer-backdrop:not(.hidden)")) {
    document.body.classList.remove("no-scroll");
  }
}
function bindTaskDrawer() {
  const backdrop = document.getElementById("taskDrawer");
  if (backdrop) backdrop.addEventListener("click", e => { if (e.target === backdrop) closeTaskDrawer(); });
  const form = document.getElementById("taskForm");
  if (form) {
    form.addEventListener("submit", e => {
      e.preventDefault();
      if (!user) return;
      const title = document.getElementById("taskTitle").value.trim() || "Untitled page";
      const status = document.getElementById("taskStatus").value;
      const category = document.getElementById("taskCategory").value;
      const priority = document.getElementById("taskPriority").value;
      const date = document.getElementById("taskDate").value || todayKey();
      const notes = document.getElementById("taskNotes").value;
      if (ui.editingId) {
        const task = findTask(ui.editingId);
        if (task) {
          task.title = title;
          task.category = category;
          task.priority = priority;
          task.date = date;
          task.notes = notes;
          if (task.status !== status) setTaskStatus(task, status);
          else save();
        }
      } else {
        const task = createTask({ title, status, category, priority, date, notes });
        if (task && status === "done") { task.completedAt = new Date().toISOString(); task.cpEarned = true; save(); }
      }
      closeTaskDrawer();
      renderAll();
      toast("Page saved", "good");
    });
  }
  const del = document.getElementById("taskDelete");
  if (del) {
    del.addEventListener("click", () => {
      if (!ui.editingId) return;
      const task = findTask(ui.editingId);
      if (!task) return;
      if (!window.confirm(`Let “${task.title}” go?`)) return;
      const id = ui.editingId;
      closeTaskDrawer();
      deleteTask(id);
    });
  }
}

/* ── profile edit ────────────────────────────────────────────── */
function openProfileModal() {
  if (!user) return;
  document.getElementById("editName").value = user.name;
  document.getElementById("editLetter").value = user.avatarLetter || "";
  const error = document.getElementById("profileError");
  if (error) error.textContent = "";
  document.getElementById("profileModal").classList.remove("hidden");
  document.body.classList.add("no-scroll");
  setTimeout(() => document.getElementById("editName").focus(), 120);
}
function closeProfileModal() {
  const modal = document.getElementById("profileModal");
  if (modal) modal.classList.add("hidden");
  if (!document.querySelector(".modal-backdrop:not(.hidden), .focus-overlay:not(.hidden), .command-backdrop:not(.hidden), .drawer-backdrop:not(.hidden)")) {
    document.body.classList.remove("no-scroll");
  }
}
function bindProfile() {
  const modal = document.getElementById("profileModal");
  if (modal) modal.addEventListener("click", e => { if (e.target === modal) closeProfileModal(); });
  document.querySelectorAll("[data-profile-close]").forEach(btn => btn.addEventListener("click", closeProfileModal));
  const form = document.getElementById("profileForm");
  if (form) {
    form.addEventListener("submit", e => {
      e.preventDefault();
      if (!user) return;
      const name = document.getElementById("editName").value.trim();
      if (name.length < 2) { formError("profileError", "A name of at least two letters, please."); return; }
      const letter = document.getElementById("editLetter").value.trim().charAt(0).toUpperCase();
      user.name = name;
      user.avatarLetter = letter || name.charAt(0).toUpperCase();
      save();
      closeProfileModal();
      renderAll();
      toast("A little more you", "good");
    });
  }
}

/* ── photo uploads ───────────────────────────────────────────── */
function readImageAsDataURL(file, maxW, maxH) {
  return new Promise((resolve, reject) => {
    if (!file || !/^image\//.test(file.type)) { reject(new Error("type")); return; }
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("read"));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error("decode"));
      img.onload = () => {
        const ratio = Math.min(1, maxW / img.width, maxH / img.height);
        const w = Math.max(1, Math.round(img.width * ratio));
        const h = Math.max(1, Math.round(img.height * ratio));
        const canvas = document.createElement("canvas");
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext("2d");
        if (!ctx) { reject(new Error("canvas")); return; }
        ctx.drawImage(img, 0, 0, w, h);
        resolve(canvas.toDataURL("image/jpeg", 0.82));
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}
function bindImageUploads() {
  const jobs = [
    { id: "avatarFileInput", kind: "avatar", maxW: 320, maxH: 320, label: "profile photo" },
    { id: "coverFileInput", kind: "cover", maxW: 1400, maxH: 560, label: "cover photo" }
  ];
  jobs.forEach(job => {
    const input = document.getElementById(job.id);
    if (!input) return;
    input.addEventListener("change", async () => {
      const file = input.files && input.files[0];
      input.value = "";
      if (!file || !user) return;
      try {
        const data = await readImageAsDataURL(file, job.maxW, job.maxH);
        if (job.kind === "avatar") user.avatarImage = data;
        else user.coverImage = data;
        save();
        renderAll();
        toast(`New ${job.label}`, "good");
      } catch (e) {
        toast("That image could not be read. Try a JPG or PNG.", "bad");
      }
    });
  });
  document.querySelectorAll("[data-upload]").forEach(btn => {
    btn.addEventListener("click", () => {
      const kind = btn.dataset.upload;
      document.getElementById(kind === "avatar" ? "avatarFileInput" : "coverFileInput")?.click();
    });
  });
  document.querySelectorAll("[data-remove]").forEach(btn => {
    btn.addEventListener("click", () => {
      if (!user) return;
      const kind = btn.dataset.remove;
      if (kind === "avatar") user.avatarImage = "";
      else user.coverImage = "";
      save();
      renderAll();
      toast(kind === "avatar" ? "Profile photo removed" : "Cover photo removed", "good");
    });
  });
}

/* ── music bindings ──────────────────────────────────────────── */
function bindMusic() {
  const form = document.getElementById("playlistForm");
  if (form) form.addEventListener("submit", handlePlaylistSubmit);
  document.getElementById("focusTask")?.addEventListener("change", e => { focusState.taskId = e.target.value; });
}

/* ── focus bindings ──────────────────────────────────────────── */
function bindFocus() {
  document.getElementById("focusStart")?.addEventListener("click", startPauseFocus);
  document.getElementById("focusReset")?.addEventListener("click", resetFocus);
  document.getElementById("focusLengths")?.addEventListener("click", e => {
    const btn = e.target.closest("[data-min]");
    if (btn) setFocusLength(Number(btn.dataset.min));
  });
}

/* ── planner bindings ────────────────────────────────────────── */
function bindPlanner() {
  let searchTimer = null;
  const search = document.getElementById("plannerSearch");
  if (search) {
    search.addEventListener("input", e => {
      ui.search = e.target.value;
      clearTimeout(searchTimer);
      searchTimer = setTimeout(() => renderPlanner(), 140);
    });
  }
  const category = document.getElementById("plannerCategory");
  if (category) category.addEventListener("change", e => { ui.category = e.target.value; renderPlanner(); });
  const sort = document.getElementById("plannerSort");
  if (sort) sort.addEventListener("change", e => { ui.sort = e.target.value; renderPlanner(); });

  document.addEventListener("change", e => {
    const field = e.target.dataset.field;
    if (!field) return;
    const row = e.target.closest(".db-row[data-id]");
    if (!row) return;
    const task = findTask(row.dataset.id);
    if (!task) return;
    if (field === "status") {
      setTaskStatus(task, e.target.value);
      toast(e.target.value === "done" ? "Kept. Beautifully." : `Moved to ${STATUSES[e.target.value]}`, "good");
    } else {
      task[field] = field === "date" ? (e.target.value || todayKey()) : e.target.value;
      save();
    }
    renderAll();
  });

  document.addEventListener("input", e => {
    if (e.target.dataset && e.target.dataset.field === "title") {
      const row = e.target.closest(".db-row[data-id]");
      const task = row ? findTask(row.dataset.id) : null;
      if (task) { task.title = e.target.value; save(); }
    }
  });

  /* drag & drop board */
  let draggingId = null;
  document.addEventListener("dragstart", e => {
    const card = e.target.closest(".board-card");
    if (!card) return;
    draggingId = card.dataset.id;
    card.classList.add("dragging");
    if (e.dataTransfer) e.dataTransfer.effectAllowed = "move";
  });
  document.addEventListener("dragend", e => {
    const card = e.target.closest(".board-card");
    if (card) card.classList.remove("dragging");
    document.querySelectorAll(".board-col").forEach(c => c.classList.remove("drag-over"));
    setTimeout(() => { draggingId = null; }, 50);
  });
  document.addEventListener("dragover", e => {
    const col = e.target.closest(".board-col");
    if (!col || !draggingId) return;
    e.preventDefault();
    document.querySelectorAll(".board-col").forEach(c => c.classList.toggle("drag-over", c === col));
  });
  document.addEventListener("drop", e => {
    const col = e.target.closest(".board-col");
    if (!col || !draggingId) return;
    e.preventDefault();
    const task = findTask(draggingId);
    if (task && task.status !== col.dataset.status) {
      setTaskStatus(task, col.dataset.status);
      renderAll();
      toast(`Moved to ${STATUSES[col.dataset.status]}`, "good");
    }
    document.querySelectorAll(".board-col").forEach(c => c.classList.remove("drag-over"));
    draggingId = null;
  });
}

/* ── command palette bindings ────────────────────────────────── */
function bindCommand() {
  const input = document.getElementById("commandInput");
  const backdrop = document.getElementById("commandPalette");
  if (backdrop) backdrop.addEventListener("click", e => { if (e.target === backdrop) closeCommand(); });
  if (input) {
    input.addEventListener("input", () => { ui.commandIndex = 0; renderCommand(input.value); });
    input.addEventListener("keydown", e => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        ui.commandIndex = Math.min(ui.commandIndex + 1, visibleCommands.length - 1);
        renderCommand(input.value);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        ui.commandIndex = Math.max(ui.commandIndex - 1, 0);
        renderCommand(input.value);
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (visibleCommands[ui.commandIndex]) runCommand(visibleCommands[ui.commandIndex].id);
      } else if (e.key === "Escape") {
        closeCommand();
      }
    });
  }
}

/* ── global clicks & shortcuts ───────────────────────────────── */
function handleAction(el) {
  const action = el.dataset.action;
  closeSidebar();
  switch (action) {
    case "demo": {
      demoLogin();
      enterApp();
      toast("Wandering as Mira · the demo studio", "good");
      break;
    }
    case "new-task": openTaskDrawer(null, { status: el.dataset.status, date: el.dataset.date }); break;
    case "open-task": openTaskDrawer(el.dataset.id); break;
    case "toggle-task": toggleTask(el.dataset.id); break;
    case "open-focus": openFocus(); break;
    case "close-focus": closeFocus(); break;
    case "focus-to-music": closeFocus(); switchView("music"); setTimeout(() => document.getElementById("playlistUrl")?.focus(), 350); break;
    case "open-command": openCommand(); break;
    case "home": switchView("today"); break;
    case "go-planner": switchView("planner"); break;
    case "logout": requestLogout(); break;
    case "edit-profile": openProfileModal(); break;
    case "upload-avatar": document.getElementById("avatarFileInput")?.click(); break;
    case "upload-cover": document.getElementById("coverFileInput")?.click(); break;
    case "close-drawer": closeTaskDrawer(); break;
    case "profile": switchView("profile"); break;
    case "cal-prev": {
      const d = ui.calDate;
      ui.calDate = new Date(d.getFullYear(), d.getMonth() - 1, 1);
      renderCalendar();
      break;
    }
    case "cal-next": {
      const d = ui.calDate;
      ui.calDate = new Date(d.getFullYear(), d.getMonth() + 1, 1);
      renderCalendar();
      break;
    }
    case "cal-now": ui.calDate = new Date(); renderCalendar(); break;
    case "cal-add":
    case "cal-day": openTaskDrawer(null, { date: el.dataset.date }); break;
    case "shop-item": {
      const result = buyItem(el.dataset.id);
      if (result.ok) {
        renderIdentity();
        renderShop();
        renderProfile();
        updateMoneyUI();
      }
      break;
    }
    case "activate-playlist": activatePlaylist(el.dataset.id); break;
    case "delete-playlist": deletePlaylistFlow(el.dataset.id); break;
    case "dock-toggle": toggleDock(); break;
    case "dock-close": closeDock(); break;
    case "dock-focus": {
      if (activePlaylist()) openFocus();
      else switchView("music");
      break;
    }
    case "command-run": runCommand(el.dataset.command); break;
    default: break;
  }
}

function bindGlobal() {
  document.addEventListener("click", e => {
    const authClose = e.target.closest("[data-auth-close]");
    if (authClose) { closeAuth(); return; }
    const profileClose = e.target.closest("[data-profile-close]");
    if (profileClose) { closeProfileModal(); return; }

    const dbView = e.target.closest("[data-dbview]");
    if (dbView) { setDbView(dbView.dataset.dbview); return; }

    const shopTab = e.target.closest("[data-shop]");
    if (shopTab) { ui.shopTab = shopTab.dataset.shop; renderShop(); return; }

    const viewEl = e.target.closest("[data-view]");
    if (viewEl && !viewEl.classList.contains("view")) {
      e.preventDefault();
      switchView(viewEl.dataset.view);
      return;
    }

    const actionEl = e.target.closest("[data-action]");
    if (actionEl) {
      e.preventDefault();
      handleAction(actionEl);
      return;
    }

    const boardCard = e.target.closest(".board-card");
    if (boardCard) {
      openTaskDrawer(boardCard.dataset.id);
      return;
    }
  });

  document.addEventListener("keydown", e => {
    const key = e.key.toLowerCase();
    if ((e.metaKey || e.ctrlKey) && key === "k") {
      e.preventDefault();
      if (user) openCommand();
      return;
    }
    if (e.key === "Escape") {
      if (!document.getElementById("commandPalette").classList.contains("hidden")) { closeCommand(); return; }
      if (!document.getElementById("focusOverlay").classList.contains("hidden")) { closeFocus(); return; }
      if (!document.getElementById("taskDrawer").classList.contains("hidden")) { closeTaskDrawer(); return; }
      if (!document.getElementById("profileModal").classList.contains("hidden")) { closeProfileModal(); return; }
      if (!document.getElementById("authModal").classList.contains("hidden")) { closeAuth(); return; }
      if (document.getElementById("sidebar")?.classList.contains("open")) { closeSidebar(); return; }
      return;
    }
    if (!user || isTyping()) return;
    if (key === "n") { e.preventDefault(); openTaskDrawer(null); }
    if (key === "f") { e.preventDefault(); openFocus(); }
    if (key === "/") { e.preventDefault(); openCommand(); }
  });

  window.addEventListener("scroll", () => {
    const nav = document.getElementById("landingNav");
    if (nav) nav.classList.toggle("scrolled", window.scrollY > 28);
  }, { passive: true });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 1080) closeSidebar();
  });
}

/* ── landing delight ─────────────────────────────────────────── */
let revealObserver = null;
function setupReveals() {
  if (revealObserver) revealObserver.disconnect();
  const items = document.querySelectorAll(".reveal:not(.in)");
  if (!("IntersectionObserver" in window)) {
    items.forEach(el => el.classList.add("in"));
    return;
  }
  revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("in");
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });
  items.forEach(el => revealObserver.observe(el));
  // make sure the first screen is never left invisible while the observer warms up
  requestAnimationFrame(() => {
    items.forEach(el => {
      const r = el.getBoundingClientRect();
      if (r.top < window.innerHeight * 0.94 && r.bottom > 0) el.classList.add("in");
    });
  });
}

function setupCounters() {
  const stats = document.querySelectorAll("[data-count]");
  if (!stats.length || !("IntersectionObserver" in window)) return;
  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      io.unobserve(el);
      const target = Number(el.dataset.count) || 0;
      const start = performance.now();
      const duration = 950;
      function tick(now) {
        const p = Math.min(1, (now - start) / duration);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = String(Math.round(target * eased));
        if (p < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    });
  }, { threshold: 0.5 });
  stats.forEach(el => io.observe(el));
}

function setupLandingFx() {
  const landing = document.getElementById("landing");
  const glow = document.getElementById("cursorGlow");
  if (landing && glow) {
    landing.addEventListener("pointermove", e => {
      glow.classList.add("on");
      glow.style.left = e.clientX + "px";
      glow.style.top = e.clientY + "px";
    });
    landing.addEventListener("pointerleave", () => glow.classList.remove("on"));
  }

  const stage = document.getElementById("heroStage");
  if (stage) {
    stage.addEventListener("pointermove", e => {
      const r = stage.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      stage.style.setProperty("--rx", `${(1.5 - y * 5).toFixed(2)}deg`);
      stage.style.setProperty("--ry", `${(-5 + x * 8).toFixed(2)}deg`);
    });
    stage.addEventListener("pointerleave", () => {
      stage.style.setProperty("--rx", "1.5deg");
      stage.style.setProperty("--ry", "-5deg");
    });
  }

  document.querySelectorAll(".tilt").forEach(card => {
    card.addEventListener("pointermove", e => {
      if (e.pointerType === "touch") return;
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      card.style.setProperty("--tx", `${(x * 7).toFixed(2)}deg`);
      card.style.setProperty("--ty", `${(-y * 7).toFixed(2)}deg`);
    });
    card.addEventListener("pointerleave", () => {
      card.style.setProperty("--tx", "0deg");
      card.style.setProperty("--ty", "0deg");
    });
  });

  document.querySelectorAll(".magnetic").forEach(btn => {
    btn.addEventListener("pointermove", e => {
      if (e.pointerType === "touch") return;
      const r = btn.getBoundingClientRect();
      const x = e.clientX - r.left - r.width / 2;
      const y = e.clientY - r.top - r.height / 2;
      btn.style.transform = `translate(${x * 0.08}px, ${y * 0.14 - 2}px)`;
    });
    btn.addEventListener("pointerleave", () => { btn.style.transform = ""; });
  });
}

/* ── start ───────────────────────────────────────────────────── */
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}