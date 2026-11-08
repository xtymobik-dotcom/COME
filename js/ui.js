/* ═══════════════════════════════════════════════════════════════
   COME — rendering: shell, today, planner database
   ═══════════════════════════════════════════════════════════════ */

function renderAll() {
  if (!user) return;
  applyLook();
  renderIdentity();
  renderToday();
  renderPlanner();
  renderMusic();
  renderShop();
  renderProfile();
  updateMoneyUI();
}

function renderIdentity() {
  const u = user;
  if (!u) return;
  const frame = equippedItem("frame");
  const title = equippedItem("title");
  const level = levelInfo(u);

  document.querySelectorAll(".avatar").forEach(el => {
    el.dataset.frame = frame ? frame.id : "frame-classic";
    const letter = el.querySelector(".avatar-letter");
    if (letter) letter.textContent = (u.avatarLetter || u.name.charAt(0) || "A").toUpperCase();
    let img = el.querySelector(".avatar-img");
    if (!img) {
      img = document.createElement("img");
      img.className = "avatar-img";
      img.alt = "";
      el.prepend(img);
    }
    if (u.avatarImage) {
      img.src = u.avatarImage;
      img.classList.remove("hidden");
      if (letter) letter.classList.add("hidden");
    } else {
      img.removeAttribute("src");
      img.classList.add("hidden");
      if (letter) letter.classList.remove("hidden");
    }
  });

  const sideName = document.getElementById("sideName");
  if (sideName) sideName.textContent = u.name;
  const sideTitle = document.getElementById("sideTitle");
  if (sideTitle) sideTitle.textContent = title ? title.value : level.name;
  const sideStreak = document.getElementById("sideStreak");
  if (sideStreak) sideStreak.textContent = u.streak;
  const navCount = document.getElementById("navTaskCount");
  if (navCount) navCount.textContent = u.tasks.filter(t => t.status !== "done").length;

  updateMoneyUI();
}

function updateMoneyUI() {
  if (!user) return;
  const level = levelInfo(user);
  const ids = {
    topCP: user.cp.toLocaleString("en-US"),
    sideCP: user.cp.toLocaleString("en-US"),
    cpBig: user.cp.toLocaleString("en-US"),
    shopCP: user.cp.toLocaleString("en-US"),
    profileCP: user.cp.toLocaleString("en-US"),
    topStreak: user.streak,
    sideStreak: user.streak,
    levelNum: level.level,
    profileLevel: level.level,
    levelName: level.name,
    levelNext: `${level.toNext.toLocaleString("en-US")} CP to level ${level.level + 1}`
  };
  Object.entries(ids).forEach(([id, value]) => {
    const el = document.getElementById(id);
    if (el) el.textContent = value;
  });
  const bar = document.getElementById("levelBar");
  if (bar) bar.style.width = Math.round(level.progress * 100) + "%";
}

/* ── today ───────────────────────────────────────────────────── */
function renderToday() {
  const u = user;
  if (!u) return;

  const now = new Date();
  const firstName = (u.name || "friend").split(" ")[0];
  const hour = now.getHours();
  const greeting = hour < 5 ? "Still up" : hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
  const dateLabel = new Intl.DateTimeFormat("en-GB", { weekday: "long", day: "numeric", month: "long" }).format(now);
  const eyebrow = document.getElementById("todayEyebrow");
  if (eyebrow) eyebrow.textContent = dateLabel.toUpperCase().replace(/,/g, " ·");
  const greetEl = document.getElementById("greeting");
  if (greetEl) greetEl.innerHTML = `${greeting}, <em>${esc(firstName)}</em>.`;

  const todays = u.tasks.filter(t => t.date === todayKey());
  const kept = todays.filter(t => t.status === "done").length;
  const total = todays.length;
  const open = total - kept;
  const pct = total ? Math.round((kept / total) * 100) : 0;

  const line = document.getElementById("todayLine");
  if (line) {
    line.textContent = total
      ? `${total} page${total === 1 ? "" : "s"} on today’s table · ${open ? open + " still open" : "all kept. Beautifully done."}`
      : "A clear table. Add something gentle to begin.";
  }
  const ritualKept = document.getElementById("ritualKept");
  if (ritualKept) ritualKept.textContent = `${kept} of ${total}`;
  const ritualLine = document.getElementById("ritualLine");
  if (ritualLine) {
    ritualLine.textContent = total === 0
      ? "Small steps, kept softly. Add the first one."
      : kept === total
        ? "A perfect little day. Let it be enough."
        : kept === 0
          ? "The first page is always the quietest. Start there."
          : `${open} small thing${open === 1 ? "" : "s"} left. No hurry.`;
  }
  const percentEl = document.getElementById("todayPercent");
  if (percentEl) percentEl.textContent = pct + "%";
  const ring = document.getElementById("todayRing");
  if (ring) {
    const circumference = 2 * Math.PI * 52;
    ring.style.strokeDashoffset = String(circumference * (1 - pct / 100));
  }

  renderTodayTasks(todays);
  renderWeekChart();
  renderStreak();
  renderHeatmap();
  renderMusicMini();

  const navCount = document.getElementById("navTaskCount");
  if (navCount) navCount.textContent = u.tasks.filter(t => t.status !== "done").length;
}

function renderTodayTasks(todays) {
  const wrap = document.getElementById("todayTasks");
  if (!wrap) return;
  const order = { doing: 0, todo: 1, done: 2 };
  const sorted = [...todays].sort((a, b) => (order[a.status] - order[b.status]) || a.createdAt - b.createdAt);
  if (!sorted.length) {
    wrap.innerHTML = `<div class="empty-tasks"><span class="empty-mark">✦</span>Nothing on today’s table yet.<br/>The day is still yours.</div>
      <button class="add-row" data-action="new-task"><span>＋</span> Add a page for today</button>`;
    return;
  }
  wrap.innerHTML = sorted.map(t => {
    const done = t.status === "done";
    const cat = CATEGORIES[t.category] || CATEGORIES.study;
    const bonus = (PRIORITIES[t.priority] || PRIORITIES.medium).bonus;
    return `<div class="task-row ${done ? "done" : ""}" data-id="${t.id}">
      <button class="check" data-action="toggle-task" data-id="${t.id}" aria-label="${done ? "Reopen" : "Complete"} ${esc(t.title)}"></button>
      <div class="task-row-main" data-action="open-task" data-id="${t.id}" role="button" tabindex="0">
        <span class="task-row-title">${esc(t.title)}</span>
        <span class="task-row-meta">
          <span class="cat-tag"><i class="cat-${t.category}"></i>${cat.label}</span>
          ${t.minutes ? `<span>·</span><span>${fmtMinutes(t.minutes)}</span>` : ""}
          ${t.status === "doing" ? `<span>·</span><span>in focus</span>` : ""}
        </span>
      </div>
      <span class="row-cp">+${bonus} CP</span>
      <button class="row-open" data-action="open-task" data-id="${t.id}" aria-label="Open ${esc(t.title)}">
        <svg viewBox="0 0 24 24"><path d="M7 17L17 7M9 7h8v8"/></svg>
      </button>
    </div>`;
  }).join("") + `<button class="add-row" data-action="new-task"><span>＋</span> Add a page</button>`;
}

function minutesForDate(key, u = user) {
  if (!u) return { mins: 0, category: null };
  const sessions = u.sessions.filter(s => s.date === key);
  let mins = sessions.reduce((sum, s) => sum + (s.minutes || 0), 0);
  const byCat = {};
  sessions.forEach(s => { byCat[s.category] = (byCat[s.category] || 0) + s.minutes; });
  if (!mins) {
    const done = u.tasks.filter(t => t.status === "done" && t.date === key);
    if (done.length) {
      mins = done.length * 20;
      done.forEach(t => { byCat[t.category] = (byCat[t.category] || 0) + 20; });
    }
  }
  let category = null;
  let max = 0;
  Object.entries(byCat).forEach(([c, value]) => { if (value > max) { max = value; category = c; } });
  return { mins, category };
}

function renderWeekChart() {
  const wrap = document.getElementById("weekChart");
  if (!wrap) return;
  const days = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = dateKey(d);
    const info = minutesForDate(key);
    days.push({
      key,
      label: new Intl.DateTimeFormat("en-GB", { weekday: "short" }).format(d),
      mins: info.mins,
      category: info.category,
      isToday: i === 0
    });
  }
  const max = Math.max(...days.map(d => d.mins), 1);
  wrap.innerHTML = days.map((d, i) => {
    const h = d.mins ? Math.max(8, Math.round((d.mins / max) * 100)) : 3;
    return `<div class="wc-col ${d.category || ""} ${d.isToday ? "today" : ""}" title="${esc(d.label)} · ${fmtMinutes(d.mins)}">
      <div class="wc-bar-wrap"><div class="wc-bar" style="height:${h}%;--i:${i}"></div></div>
      <span class="wc-day">${esc(d.label)}</span>
    </div>`;
  }).join("");
  const total = days.reduce((sum, d) => sum + d.mins, 0);
  const totalEl = document.getElementById("weekMinutes");
  if (totalEl) totalEl.textContent = fmtMinutes(total);
}

function renderStreak() {
  const u = user;
  if (!u) return;
  const num = document.getElementById("streakNum");
  if (num) num.textContent = u.streak;
  const msg = document.getElementById("streakMsg");
  if (msg) {
    msg.textContent = u.streak === 0
      ? "Show up today to light it."
      : u.streak === 1
        ? "One day kept. The thread begins."
        : u.streak < 3
          ? "The thread is warm. Keep it."
          : u.streak < 7
            ? "A quiet rhythm is forming."
            : "This is becoming a ritual.";
  }
  const dots = document.getElementById("streakDots");
  if (dots) {
    dots.innerHTML = Array.from({ length: 7 }, (_, i) => {
      const daysAgo = 6 - i;
      const on = daysAgo < u.streak;
      return `<i class="${on ? "on" : ""} ${i === 6 ? "today" : ""}" title="${daysAgo === 0 ? "Today" : daysAgo + " days ago"}"></i>`;
    }).join("");
  }
  const next = nextMilestone(u.streak);
  const nextEl = document.getElementById("streakNext");
  if (nextEl) nextEl.textContent = next ? `+${next.cp} CP at ${next.days} days` : "All milestones kept ✦";
}

function renderHeatmap() {
  const wrap = document.getElementById("heatmap");
  if (!wrap) return;
  const cells = [];
  let active = 0;
  let total = 0;
  for (let i = 69; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = dateKey(d);
    const info = minutesForDate(key);
    let level = 0;
    if (info.mins > 0) {
      active++;
      total += info.mins;
      level = info.mins < 30 ? 1 : info.mins < 60 ? 2 : info.mins < 120 ? 3 : 4;
    }
    const title = `${new Intl.DateTimeFormat("en-GB", { weekday: "short", day: "numeric", month: "short" }).format(d)} · ${info.mins ? fmtMinutes(info.mins) : "quiet"}`;
    cells.push(`<span class="heat-cell ${level ? "l" + level : ""}" title="${esc(title)}"></span>`);
  }
  wrap.innerHTML = cells.join("");
  const foot = document.getElementById("heatFoot");
  if (foot) foot.textContent = active ? `${active} active days · ${fmtMinutes(total)} focused in ten weeks` : "Your rhythm will appear here.";
}

function renderMusicMini() {
  const wrap = document.getElementById("musicMini");
  if (!wrap) return;
  const p = activePlaylist();
  if (!p) {
    wrap.innerHTML = `<div class="mm-head"><span class="mono">ON ROTATION</span><span class="eq"><i></i><i></i><i></i><i></i></span></div>
      <div class="mm-empty">
        <div class="mm-empty-art">♪</div>
        <div class="mm-empty-copy"><strong>Keep a playlist here</strong><span>One link, no feed.</span></div>
        <button class="text-btn" data-view="music">Add →</button>
      </div>`;
    return;
  }
  wrap.innerHTML = `<div class="mm-head"><span class="mono">ON ROTATION</span><span class="eq"><i></i><i></i><i></i><i></i></span></div>
    <div class="mm-body">
      <div class="mm-card-art ${playlistArtClass(p)}"><span class="vinyl"></span></div>
      <div class="mm-card-copy"><strong>${esc(p.title)}</strong><i>Spotify · ${esc(p.type)}</i></div>
      <button class="mm-play" data-action="activate-playlist" data-id="${p.id}" aria-label="Play ${esc(p.title)}">
        <svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
      </button>
    </div>`;
}

/* ── planner ─────────────────────────────────────────────────── */
function filteredTasks() {
  if (!user) return [];
  let list = [...user.tasks];
  const search = ui.search.trim().toLowerCase();
  if (search) list = list.filter(t => (t.title + " " + t.notes + " " + t.category).toLowerCase().includes(search));
  if (ui.category !== "all") list = list.filter(t => t.category === ui.category);
  const prioRank = { high: 0, medium: 1, low: 2 };
  const doneRank = t => t.status === "done" ? 1 : 0;
  if (ui.sort === "date") list.sort((a, b) => a.date.localeCompare(b.date) || doneRank(a) - doneRank(b) || b.createdAt - a.createdAt);
  else if (ui.sort === "created") list.sort((a, b) => b.createdAt - a.createdAt);
  else if (ui.sort === "priority") list.sort((a, b) => (prioRank[a.priority] ?? 1) - (prioRank[b.priority] ?? 1) || doneRank(a) - doneRank(b));
  else if (ui.sort === "title") list.sort((a, b) => a.title.localeCompare(b.title));
  return list;
}

function renderPlanner() {
  if (!user) return;
  const list = filteredTasks();
  const all = user.tasks;
  const done = all.filter(t => t.status === "done").length;
  const open = all.length - done;
  const focus = all.reduce((sum, t) => sum + (t.minutes || 0), 0);
  const sub = document.getElementById("plannerSub");
  if (sub) sub.textContent = `${open} open · ${done} kept · ${all.length} pages in your database.`;
  const dbCount = document.getElementById("dbCount");
  if (dbCount) dbCount.textContent = `${list.length} page${list.length === 1 ? "" : "s"}`;
  const dbFocus = document.getElementById("dbFocus");
  if (dbFocus) dbFocus.textContent = `${fmtMinutes(focus)} focused`;

  renderTable(list);
  renderBoard(list);
  renderCalendar();
}

function renderTable(list) {
  const wrap = document.getElementById("plannerTable");
  if (!wrap) return;
  if (!list.length) {
    wrap.innerHTML = `<div class="table-shell"><div class="table-empty"><span class="empty-mark">▦</span><strong>No pages here yet</strong><p>Change the filters, or add the first task of this view.</p><button class="btn btn-primary btn-sm" data-action="new-task" style="margin-top:14px">＋ New task</button></div></div>`;
    return;
  }
  const rows = list.map(t => {
    const cat = CATEGORIES[t.category] || CATEGORIES.study;
    const bonus = (PRIORITIES[t.priority] || PRIORITIES.medium).bonus;
    const statusOptions = Object.entries(STATUSES).map(([value, label]) => `<option value="${value}" ${t.status === value ? "selected" : ""}>${label}</option>`).join("");
    const catOptions = Object.entries(CATEGORIES).map(([value, c]) => `<option value="${value}" ${t.category === value ? "selected" : ""}>${c.label}</option>`).join("");
    const prioOptions = Object.entries(PRIORITIES).map(([value, p]) => `<option value="${value}" ${t.priority === value ? "selected" : ""}>${p.label}</option>`).join("");
    return `<div class="db-row ${t.status === "done" ? "is-done" : ""}" data-id="${t.id}">
      <span class="db-cell"><button class="db-check" data-action="toggle-task" data-id="${t.id}" aria-label="Toggle task"></button></span>
      <span class="db-cell db-title-cell"><input class="db-title-input" data-field="title" value="${esc(t.title)}" aria-label="Task title" /></span>
      <span class="db-cell"><select class="cell-select status-${t.status}" data-field="status" aria-label="Status">${statusOptions}</select></span>
      <span class="db-cell cat-cell" style="--cat:${cat.color}"><select class="cell-select" data-field="category" aria-label="Category">${catOptions}</select></span>
      <span class="db-cell"><select class="cell-select prio-${t.priority}" data-field="priority" aria-label="Priority">${prioOptions}</select></span>
      <span class="db-cell date-cell"><input type="date" data-field="date" value="${t.date}" aria-label="Date" /></span>
      <span class="db-cell focus-cell"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="8"/><path d="M12 8v4l2.5 1.5"/></svg>${t.minutes ? fmtMinutes(t.minutes) : "—"}</span>
      <span class="db-cell"><button class="row-open-btn" data-action="open-task" data-id="${t.id}" aria-label="Open page"><svg viewBox="0 0 24 24"><path d="M7 17L17 7M9 7h8v8"/></svg></button></span>
    </div>`;
  }).join("");
  wrap.innerHTML = `<div class="table-shell"><div class="table-scroll"><div class="db-table">
    <div class="db-row head">
      <span class="db-cell"></span><span class="db-cell">Task</span><span class="db-cell">Status</span><span class="db-cell">Category</span><span class="db-cell">Priority</span><span class="db-cell">Date</span><span class="db-cell">Focus</span><span class="db-cell"></span>
    </div>${rows}</div></div>
    <button class="table-add" data-action="new-task">＋ New page</button></div>`;
}

function renderBoard(list) {
  const wrap = document.getElementById("plannerBoard");
  if (!wrap) return;
  const columns = [
    { key: "todo", label: "To do", color: "var(--muted)" },
    { key: "doing", label: "In focus", color: "var(--accent-2)" },
    { key: "done", label: "Done", color: "var(--ink)" }
  ];
  wrap.innerHTML = `<div class="board">${columns.map(col => {
    const items = list.filter(t => t.status === col.key);
    const cards = items.map(t => {
      const cat = CATEGORIES[t.category] || CATEGORIES.study;
      return `<article class="board-card ${t.status === "done" ? "done" : ""}" draggable="true" data-id="${t.id}" style="--cat:${cat.color}">
        <div class="board-card-title">${esc(t.title)}</div>
        <div class="board-card-meta">
          <span class="b-prio prio-dot-${t.priority}"></span>
          <span>${cat.label}</span>
          <span>${t.date === todayKey() ? "Today" : fmtDate(t.date)}</span>
          <span class="b-cp">+${(PRIORITIES[t.priority] || PRIORITIES.medium).bonus}</span>
        </div>
      </article>`;
    }).join("");
    return `<div class="board-col" data-status="${col.key}">
      <div class="board-head"><span class="bh-dot" style="background:${col.color}"></span><strong>${col.label}</strong><span class="bh-count">${items.length}</span></div>
      <div class="board-list">${cards || `<div class="board-empty">Drop a page here</div>`}</div>
      <button class="board-add" data-action="new-task" data-status="${col.key}">＋ Add</button>
    </div>`;
  }).join("")}</div>`;
}

function renderCalendar() {
  const wrap = document.getElementById("plannerCalendar");
  if (!wrap || !user) return;
  const ref = ui.calDate;
  const year = ref.getFullYear();
  const month = ref.getMonth();
  const monthName = new Intl.DateTimeFormat("en-GB", { month: "long" }).format(ref);
  const first = new Date(year, month, 1);
  const startOffset = (first.getDay() + 6) % 7;
  const start = new Date(year, month, 1 - startOffset);
  const monthTasks = user.tasks.filter(t => {
    const d = parseKey(t.date);
    return d.getMonth() === month && d.getFullYear() === year;
  }).length;
  let cells = "";
  for (let i = 0; i < 42; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    const key = dateKey(d);
    const out = d.getMonth() !== month;
    const isToday = key === todayKey();
    const tasks = user.tasks
      .filter(t => t.date === key)
      .sort((a, b) => (a.status === "done" ? 1 : 0) - (b.status === "done" ? 1 : 0));
    const chips = tasks.slice(0, 3).map(t => `<div class="cal-chip ${t.status === "done" ? "done" : ""}" style="--cat:${(CATEGORIES[t.category] || CATEGORIES.study).color}" data-action="open-task" data-id="${t.id}" title="${esc(t.title)}">${esc(t.title)}</div>`).join("");
    const more = tasks.length > 3 ? `<div class="cal-more">+${tasks.length - 3} more</div>` : "";
    cells += `<div class="cal-day ${out ? "out" : ""} ${isToday ? "today" : ""}" data-action="cal-day" data-date="${key}">
      <span class="cal-date">${d.getDate()}</span>
      <button class="cal-add" data-action="cal-add" data-date="${key}" aria-label="Add task on ${key}">＋</button>
      ${chips}${more}
    </div>`;
  }
  wrap.innerHTML = `<div class="cal-shell">
    <div class="cal-head">
      <div class="cal-title"><strong>${monthName} ${year}</strong><span>${monthTasks} page${monthTasks === 1 ? "" : "s"}</span></div>
      <div class="cal-nav">
        <button data-action="cal-prev" aria-label="Previous month"><svg viewBox="0 0 24 24"><path d="M14 6l-6 6 6 6"/></svg></button>
        <button class="cal-today-btn" data-action="cal-now">Today</button>
        <button data-action="cal-next" aria-label="Next month"><svg viewBox="0 0 24 24"><path d="M10 6l6 6-6 6"/></svg></button>
      </div>
    </div>
    <div class="cal-weekdays"><span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span></div>
    <div class="cal-grid">${cells}</div>
  </div>`;
}
