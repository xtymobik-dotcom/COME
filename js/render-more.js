/* ═══════════════════════════════════════════════════════════════
   COME — rendering: music, shop, profile
   ═══════════════════════════════════════════════════════════════ */

/* ── music ───────────────────────────────────────────────────── */
function renderSpotifyPlayer() {
  const slot = document.getElementById("musicPlayer");
  if (!slot) return;
  const title = document.getElementById("spTitle");
  const open = document.getElementById("spOpen");
  const p = activePlaylist();
  if (!p) {
    slot.innerHTML = `<div class="sp-empty">
      <span class="sp-ic">♪</span>
      <div><strong>No track loaded</strong><span>Pick a playlist below or paste a Spotify link.</span></div>
    </div>`;
    slot.dataset.playlist = "";
    if (title) title.textContent = "Nothing loaded";
    if (open) open.classList.add("hidden");
    return;
  }
  if (title) title.textContent = p.title;
  if (open) {
    open.href = spotifyOpenUrl(p);
    open.classList.remove("hidden");
  }
  if (slot.dataset.playlist !== p.id) {
    slot.innerHTML = `<iframe src="${spotifyEmbedUrl(p)}" width="100%" height="352" frameborder="0" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy" title="Spotify player — ${esc(p.title)}"></iframe>`;
    slot.dataset.playlist = p.id;
  }
}

function renderMusic() {
  if (!user) return;
  renderSpotifyPlayer();
  const grid = document.getElementById("playlistGrid");
  const count = document.getElementById("playlistCount");
  if (count) count.textContent = user.playlists.length
    ? `${user.playlists.length} playlist${user.playlists.length === 1 ? "" : "s"} in rotation`
    : "Nothing yet";

  if (grid) {
    if (!user.playlists.length) {
      grid.innerHTML = `<div class="music-empty"><span>♪</span><strong>The room is quiet</strong><p>Paste a Spotify link above and give the room a soundtrack.</p></div>`;
    } else {
      grid.innerHTML = user.playlists.map(p => {
        const active = user.activePlaylist === p.id;
        return `<article class="playlist-card ${active ? "active" : ""}" data-id="${p.id}">
          <div class="pl-art ${playlistArtClass(p)}">
            <span class="vinyl"></span>
            ${active ? `<span class="pl-live"><i></i>in the room</span>` : ""}
            <span class="pl-type">${esc(p.type)}</span>
          </div>
          <div class="pl-body">
            <div class="pl-title" title="${esc(p.title)}">${esc(p.title)}</div>
            <div class="pl-sub">Spotify · ${p.type}</div>
            <div class="pl-actions">
              <button class="pl-play" data-action="activate-playlist" data-id="${p.id}">
                <svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>${active ? "Open player" : "Play here"}
              </button>
              <button class="pl-del" data-action="delete-playlist" data-id="${p.id}" title="Remove playlist" aria-label="Remove playlist">×</button>
            </div>
          </div>
        </article>`;
      }).join("");
    }
  }

  const nowArt = document.getElementById("nowArt");
  const nowTitle = document.getElementById("nowTitle");
  const nowSub = document.getElementById("nowSub");
  const nowEq = document.getElementById("nowEq");
  if (nowArt) {
    const p = activePlaylist();
    nowArt.className = p ? `now-art ${playlistArtClass(p)}` : "now-art empty";
    nowArt.innerHTML = `<span class="vinyl"></span>`;
    if (nowTitle) nowTitle.textContent = p ? p.title : "Nothing playing";
    if (nowSub) nowSub.textContent = p
      ? `Spotify ${p.type} · wrapped in a quiet frame. Open the player whenever you're ready.`
      : "Activate a playlist and it will wait here, quietly.";
    if (nowEq) nowEq.style.display = p ? "flex" : "none";
  }
}

/* ── shop ────────────────────────────────────────────────────── */
function renderShop() {
  if (!user) return;
  const grid = document.getElementById("shopGrid");
  if (!grid) return;
  const balance = document.getElementById("shopCP");
  if (balance) balance.textContent = user.cp.toLocaleString("en-US");

  document.querySelectorAll(".shop-tab").forEach(tab => {
    tab.classList.toggle("active", tab.dataset.shop === ui.shopTab);
  });

  const items = SHOP_ITEMS.filter(item => ui.shopTab === "all" || item.type === ui.shopTab);
  const initial = esc(String(user.avatarLetter || (user.name || "A").charAt(0) || "A").toUpperCase());

  const cards = items.map(item => {
    try {
      const owned = Array.isArray(user.owned) && user.owned.includes(item.id);
      const equipped = user.equipped && user.equipped[item.type] === item.id;
      let preview = "";
      if (item.type === "pix") {
        const art = typeof pixSVG === "function"
          ? pixSVG(typeof pixSkinById === "function" ? pixSkinById(item.value) : null, "pv-pix-svg")
          : `<span class="pv-fallback">${initial}</span>`;
        preview = `<div class="pv-pix">${art || `<span class="pv-fallback">${initial}</span>`}</div>`;
      } else if (item.type === "frame") {
        const css = esc(item.css || "classic");
        const deco = `${item.animated ? " pvf-fire" : ""}${item.crown ? " pvf-crown" : ""}`;
        preview = `<div class="pv-frame-scene pvfs-${css}">
          <span class="pv-frame-haze" aria-hidden="true"></span>
          <span class="pv-frame-spark" aria-hidden="true"></span>
          <div class="pv-avatar pvf-${css}${deco}">${initial}</div>
        </div>`;
      } else if (item.type === "theme") {
        const theme = (typeof THEMES !== "undefined" && THEMES[item.value]) || null;
        const colors = item.colors || (theme && theme.colors) || ["#0a1228", "#c14a55", "#38d6a4"];
        preview = `<div class="pv-theme pv-theme-${esc(item.value)}">${colors.map(c => `<span style="background:${esc(c)}"></span>`).join("")}</div>`;
      } else if (item.type === "title") {
        preview = `<div class="pv-title">${esc(item.value)}</div>`;
      } else if (item.type === "banner") {
        preview = `<div class="pv-banner ${esc(item.value)}"></div>`;
      } else if (item.type === "effect") {
        preview = `<div class="pv-effect" data-effect="${esc(item.value)}">
          <span class="pv-effect-ava">${initial}</span>
          <span class="profile-fx" aria-hidden="true"></span>
        </div>`;
      } else if (item.type === "font") {
        preview = `<div class="pv-font" data-font="${esc(item.value)}">
          <span class="pv-font-big">Aa</span>
          <span class="pv-font-small">Study · Focus · Keep</span>
        </div>`;
      }
      return `<article class="shop-item ${owned ? "owned" : ""}" data-id="${esc(item.id)}">
        <div class="si-preview">
          <span class="si-type">${esc(item.type)}</span>
          ${owned ? `<span class="si-owned-tag">owned</span>` : ""}
          ${item.animated ? `<span class="si-animated">✦ animated</span>` : ""}
          ${preview}
        </div>
        <div class="si-body">
          <div class="si-name">${esc(item.name)}</div>
          <div class="si-desc">${esc(item.desc)}</div>
          <div class="si-foot">
            <span class="si-price ${item.price === 0 ? "free" : ""}">${item.price === 0 ? "Included" : `<svg viewBox="0 0 24 24" class="coin"><path d="M12 2l2.9 6.1 6.7.9-4.9 4.6 1.2 6.6L12 17.1 6.1 20.2l1.2-6.6L2.4 9l6.7-.9z"/></svg>${item.price}`}</span>
            <button class="si-buy ${equipped ? "equipped" : owned ? "equip" : ""}" data-action="shop-item" data-id="${esc(item.id)}">${equipped ? "Wearing" : owned ? "Equip" : "Buy"}</button>
          </div>
        </div>
      </article>`;
    } catch (err) {
      console.warn("Shop item failed to render", item && item.id, err);
      return "";
    }
  }).filter(Boolean);

  grid.innerHTML = cards.length
    ? cards.join("")
    : `<div class="shop-empty">
        <span class="mono">Nothing here yet</span>
        <p>No items in this tab. If you just updated, hard-refresh the page (Ctrl/Cmd + Shift + R) so the newest shop files load.</p>
      </div>`;
}

/* ── profile ─────────────────────────────────────────────────── */
function renderProfile() {
  if (!user) return;
  const frame = equippedItem("frame");
  const title = equippedItem("title");
  const banner = equippedItem("banner");
  const effect = equippedItem("effect");
  const level = levelInfo(user);
  const face = document.getElementById("profileAvatar");
  if (face) {
    face.dataset.frame = frame ? frame.id : "frame-classic";
    face.classList.toggle("avatar-fire", !!(frame && frame.animated));
    face.classList.toggle("avatar-crown", !!(frame && frame.crown));
  }
  const wrap = document.querySelector(".profile-avatar-wrap");
  if (wrap) {
    wrap.dataset.effect = effect ? effect.value : "effect-none";
    wrap.dataset.frame = frame ? frame.id : "frame-classic";
  }
  const bannerEl = document.getElementById("profileBanner");
  if (bannerEl) {
    bannerEl.dataset.banner = banner ? banner.value : "banner-bone";
    bannerEl.dataset.effect = effect ? effect.value : "effect-none";
    bannerEl.dataset.frame = frame ? frame.id : "frame-classic";
    bannerEl.classList.toggle("has-cover", !!user.coverImage);
  }
  const coverImg = document.getElementById("profileCoverImg");
  if (coverImg) {
    if (user.coverImage) {
      coverImg.src = user.coverImage;
      coverImg.classList.remove("hidden");
    } else {
      coverImg.removeAttribute("src");
      coverImg.classList.add("hidden");
    }
  }
  const nameEl = document.getElementById("profileName");
  if (nameEl) nameEl.textContent = user.name;
  const titleEl = document.getElementById("profileTitle");
  if (titleEl) titleEl.textContent = title ? title.value : level.name;
  const meta = document.getElementById("profileMeta");
  if (meta) {
    const year = new Date(user.createdAt).getFullYear();
    meta.textContent = `Keeping the thread since ${year} · ${user.username}`;
  }
  const cpEl = document.getElementById("profileCP");
  if (cpEl) cpEl.textContent = user.cp.toLocaleString("en-US");
  const levelEl = document.getElementById("profileLevel");
  if (levelEl) levelEl.textContent = level.level;

  const stats = document.getElementById("profileStats");
  if (stats) {
    const cells = [
      { label: "TASKS KEPT", value: completedCount(user), sub: "pages completed" },
      { label: "FOCUS TIME", value: fmtMinutes(totalFocusMinutes(user)), sub: "quiet minutes" },
      { label: "STREAK", value: user.streak + "d", sub: `best ${user.bestStreak}d` },
      { label: "LIFETIME CP", value: user.lifetime.toLocaleString("en-US"), sub: "earned, not spent" }
    ];
    stats.innerHTML = cells.map(c => `<div class="pstat"><span class="mono">${c.label}</span><strong>${c.value}</strong><span>${c.sub}</span></div>`).join("");
  }

  const badgeGrid = document.getElementById("badgeGrid");
  if (badgeGrid) {
    let earned = 0;
    badgeGrid.innerHTML = BADGES.map(b => {
      let got = false;
      try { got = !!b.test(user); } catch (e) { got = false; }
      if (got) earned++;
      return `<div class="badge-item ${got ? "" : "locked"}" title="${esc(b.desc)}">
        <div class="b-ic">${b.icon}</div>
        <strong>${esc(b.name)}</strong>
        <span>${esc(b.desc)}</span>
      </div>`;
    }).join("");
    const badgeCount = document.getElementById("badgeCount");
    if (badgeCount) badgeCount.textContent = `${earned} / ${BADGES.length} earned`;
  }

  const collection = document.getElementById("profileCollection");
  if (collection) {
    collection.innerHTML = user.owned.map(id => {
      const it = itemById(id);
      if (!it) return "";
      const worn = user.equipped[it.type] === id;
      return `<span class="coll-chip ${worn ? "worn" : ""}" title="${esc(it.name)}"><i></i>${esc(it.name)}</span>`;
    }).join("");
  }

  const wearing = document.getElementById("profileWearing");
  if (wearing) {
    const themeItem = equippedItem("theme");
    const themeColors = (themeItem && themeItem.colors) || THEMES.gallery.colors;
    const pixItem = equippedItem("pix");
    const effectItem = equippedItem("effect");
    const fontItem = equippedItem("font");
    const skin = pixSkinById(pixItem ? pixItem.value : "pix-original");
    const pixPal = Object.assign({}, PIX_BASE_PALETTE, (skin && skin.palette) || {});
    const swatches = {
      pix: `linear-gradient(135deg, ${pixPal.hair}, ${pixPal.skin}, ${pixPal.shirt})`,
      frame: frame && frame.css === "gold" ? "linear-gradient(135deg,#f3c9a0,#c47748)" :
        frame && frame.css === "inferno" ? "linear-gradient(135deg,#ff5c6a,#6e1f2c)" :
        frame && frame.css === "orbit" ? "radial-gradient(circle,#122048 35%,#38d6a4 36%)" :
        frame && frame.css === "starlit" ? "linear-gradient(135deg,#38d6a4,#0a1228)" :
        frame && frame.css === "neon" ? "linear-gradient(135deg,#ff2e88,#00e5ff)" :
        frame && frame.css === "holo" ? "linear-gradient(135deg,#ff2e88,#ffd166,#2bff88,#6fd4ff)" :
        frame && frame.css === "flame" ? "linear-gradient(135deg,#ff7a1a,#c14a55)" :
        frame && frame.css === "frost" ? "linear-gradient(135deg,#b8e8ff,#6bb3d9)" :
        frame && frame.css === "anime" ? "linear-gradient(135deg,#ff5c8a,#ffd166)" :
        frame && frame.css === "football" ? "linear-gradient(135deg,#38d67a,#f3e8d0)" : "#122048",
      effect: (effectItem && effectItem.swatch) || "linear-gradient(135deg,#122048,#1a2e4d)",
      font: "linear-gradient(135deg, var(--ink), var(--accent))",
      theme: `linear-gradient(135deg, ${themeColors[0]} 0 33%, ${themeColors[1]} 33% 66%, ${themeColors[2]} 66%)`,
      title: "linear-gradient(135deg,#e8a06d,#c14a55)",
      banner: banner && banner.value === "banner-navy" ? "linear-gradient(135deg,#0a1228,#2d4a88)" :
        banner && banner.value === "banner-oxblood" ? "linear-gradient(135deg,#6e1f2c,#c14a55)" :
        banner && banner.value === "banner-sunset" ? "linear-gradient(135deg,#c14a55,#e8a06d,#f3e8d0)" :
        banner && banner.value === "banner-anime" ? "linear-gradient(135deg,#2a1830,#ff5c8a,#6ff0ff)" :
        banner && banner.value === "banner-football" ? "linear-gradient(135deg,#07140d,#38d67a,#f3e8d0)" :
        banner && banner.value === "banner-gamer" ? "linear-gradient(135deg,#08060f,#b06bff,#2bff88)" :
        banner && banner.value === "banner-science" ? "linear-gradient(135deg,#061020,#4d8dff,#6fd4ff)" :
        banner && banner.value === "banner-solo" ? "linear-gradient(135deg,#120a24,#6b4ad6,#9fd6ff)" :
        banner && banner.value === "banner-stars" ? "linear-gradient(135deg,#05060f,#8b6bff,#ffd166)" : "linear-gradient(135deg,#0a1228,#122048)"
    };
    const rows = [
      { label: "PIX", key: "pix", item: pixItem },
      { label: "FRAME", key: "frame", item: frame },
      { label: "PROFILE FX", key: "effect", item: effectItem },
      { label: "FONT", key: "font", item: fontItem },
      { label: "THEME", key: "theme", item: themeItem },
      { label: "TITLE", key: "title", item: title },
      { label: "BANNER", key: "banner", item: banner }
    ];
    wearing.innerHTML = rows.map(r => `<div class="wear-row">
      <span class="mono">${r.label}</span>
      <span class="wear-swatch" style="background:${swatches[r.key] || swatches.frame}"></span>
      <strong>${esc(r.item ? r.item.name : "—")}</strong>
      <button class="text-btn" data-view="shop">change →</button>
    </div>`).join("");
  }

  const collectionCount = document.getElementById("profileCollectionCount");
  if (collectionCount) collectionCount.textContent = `${user.owned.length} pieces`;
}
