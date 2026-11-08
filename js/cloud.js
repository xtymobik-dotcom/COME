/* ═══════════════════════════════════════════════════════════════
   COME — cloud accounts & sync (Supabase)
   The app still works from localStorage; this file mirrors each
   signed-in account to Supabase so it follows the person across
   devices and shows up in the admin dashboard.
   If js/cloud-config.js is not filled in, everything stays local.
   ═══════════════════════════════════════════════════════════════ */

const CLOUD = { client: null, timer: null, chain: null, skip: false, hold: false };

(function initCloud() {
  const ok = typeof SUPABASE_URL === "string" && SUPABASE_URL.startsWith("https://") && !SUPABASE_URL.includes("PASTE") &&
    typeof SUPABASE_ANON_KEY === "string" && SUPABASE_ANON_KEY.length > 20 && !SUPABASE_ANON_KEY.includes("PASTE") &&
    window.supabase && typeof window.supabase.createClient === "function";
  if (!ok) { console.info("COME: cloud sync is off (local-only mode)."); return; }
  CLOUD.client = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: { persistSession: true, autoRefreshToken: true }
  });
})();

/* ── helpers ─────────────────────────────────────────────────── */
function cloudKey(username) { return String(username || "").trim().toLowerCase(); }
function cloudEmail(key) { return key + "@come.example.com"; }
function cloudPass(pin) { return "come-pin-" + String(pin); }
function cloudSnapshot(u) {
  const copy = JSON.parse(JSON.stringify(u));
  delete copy.pin; // the PIN hash never leaves this browser
  return copy;
}
function cloudSaveLocal() {
  try { localStorage.setItem(STORE_KEY, JSON.stringify(DB)); } catch (e) { /* ignore */ }
}
async function cloudSession() {
  if (!CLOUD.client) return null;
  const { data } = await CLOUD.client.auth.getSession();
  return data && data.session ? data.session : null;
}
function cloudSessionKey(session) {
  return session && session.user && session.user.email ? session.user.email.split("@")[0] : "";
}
async function cloudEnsureProfile(uid, key, name) {
  const { error } = await CLOUD.client.from("profiles")
    .upsert({ id: uid, username: key, name: name || key }, { onConflict: "id", ignoreDuplicates: true });
  if (error) console.warn("COME: profile row failed", error.message);
}

/* ── push (local → cloud) ────────────────────────────────────── */
async function cloudPush(u) {
  if (!CLOUD.client || !u || u.username === "demo") return false;
  // snapshot first, before any await, so a sign-out can't change it
  const payload = cloudSnapshot(u);
  const key = u.username;
  const summary = {
    name: u.name,
    cp: u.cp || 0,
    lifetime: u.lifetime || 0,
    streak: u.streak || 0,
    tasks_done: completedCount(u),
    focus_minutes: Math.round(totalFocusMinutes(u))
  };
  try {
    const session = await cloudSession();
    if (!session || cloudSessionKey(session) !== key) return false; // wrong or no account signed in
    const now = new Date().toISOString();
    const up = await CLOUD.client.from("user_data")
      .upsert({ user_id: session.user.id, data: payload, updated_at: now })
      .select("updated_at").single();
    if (up.error) { console.warn("COME: sync failed", up.error.message); return false; }
    await CLOUD.client.from("profiles").update({ ...summary, last_seen: now }).eq("id", session.user.id);
    DB.cloud = DB.cloud || {};
    DB.cloud[key] = up.data.updated_at;
    cloudSaveLocal();
    return true;
  } catch (e) {
    console.warn("COME: sync error", e);
    return false;
  }
}
function cloudFlush() {
  clearTimeout(CLOUD.timer);
  const u = user;
  if (!CLOUD.client || CLOUD.hold || !u || u.username === "demo") return Promise.resolve(false);
  CLOUD.chain = (CLOUD.chain || Promise.resolve()).then(() => cloudPush(u)).catch(() => false);
  return CLOUD.chain;
}
function cloudQueueSync() {
  if (!CLOUD.client || CLOUD.skip || !user || user.username === "demo") return;
  clearTimeout(CLOUD.timer);
  CLOUD.timer = setTimeout(() => { if (!CLOUD.hold) cloudFlush(); }, 1800);
}

/* ── pull (cloud → local) ────────────────────────────────────── */
function cloudAdopt(key, row, pin) {
  const u = row.data;
  u.username = key;
  u.pin = pin ? hashPin(pin) : (DB.users[key] ? DB.users[key].pin : hashPin(""));
  migrateUser(u);
  DB.users[key] = u;
  DB.cloud = DB.cloud || {};
  DB.cloud[key] = row.updated_at;
  return u;
}
function cloudMakeCurrent(key, u) {
  CLOUD.skip = true;
  DB.current = key;
  user = u;
  save();
  CLOUD.skip = false;
}

/* ── sign up ─────────────────────────────────────────────────── */
async function cloudSignup(name, username, pin) {
  if (!CLOUD.client) return signup(name, username, pin);
  const key = cloudKey(username);
  if (key === "demo") return { ok: false, error: "That name is reserved for the demo studio." };
  CLOUD.skip = true;
  const res = signup(name, username, pin); // validates, then creates the local account
  CLOUD.skip = false;
  if (!res.ok) return res;

  const rollback = message => {
    delete DB.users[key];
    DB.current = null;
    user = null;
    cloudSaveLocal();
    return { ok: false, error: message };
  };
  let su;
  try {
    su = await CLOUD.client.auth.signUp({ email: cloudEmail(key), password: cloudPass(pin) });
  } catch (e) {
    return rollback("Couldn’t reach the server. Check your connection and try again.");
  }
  if (su.error) {
    const taken = /registered|already|exists/i.test(su.error.message || "");
    return rollback(taken ? "That username is already keeping time here." : "Couldn’t create the account: " + su.error.message);
  }
  if (!su.data.session) {
    return rollback("Account created, but email confirmation is still on. In Supabase turn off “Confirm email” (Authentication → Sign In / Providers → Email).");
  }
  await cloudEnsureProfile(su.data.user.id, key, res.user.name);
  await cloudPush(res.user);
  return res;
}

/* ── sign in ─────────────────────────────────────────────────── */
async function cloudMigrateLocal(local, key, pin) {
  // an account that only existed in this browser: create its cloud twin
  let su;
  try {
    su = await CLOUD.client.auth.signUp({ email: cloudEmail(key), password: cloudPass(pin) });
  } catch (e) {
    return login(key, pin);
  }
  if (su.error || !su.data.session) {
    return { ok: false, error: "That username and PIN don’t match. Try once more." };
  }
  migrateUser(local);
  await cloudEnsureProfile(su.data.user.id, key, local.name);
  cloudMakeCurrent(key, local);
  await cloudPush(local);
  return { ok: true, user: local, migrated: true };
}

async function cloudLogin(username, pin) {
  if (!CLOUD.client) return login(username, pin);
  const key = cloudKey(username);
  if (!key || !pin) return { ok: false, error: "No studio found under that name." };

  let res;
  try {
    res = await CLOUD.client.auth.signInWithPassword({ email: cloudEmail(key), password: cloudPass(pin) });
  } catch (e) {
    return login(username, pin); // offline: fall back to this browser's copy
  }

  if (res.error) {
    const invalid = res.error.status === 400 || /invalid login/i.test(res.error.message || "");
    if (!invalid) return login(username, pin); // server/network trouble: fall back to local copy
    const local = DB.users[key];
    if (local && key !== "demo" && local.pin === hashPin(pin)) return cloudMigrateLocal(local, key, pin);
    return { ok: false, error: "That username and PIN don’t match. Try once more." };
  }

  const uid = res.data.user.id;
  const row = await CLOUD.client.from("user_data").select("data, updated_at").eq("user_id", uid).maybeSingle();
  let u;
  if (row.data && row.data.data) {
    u = cloudAdopt(key, row.data, pin);
    cloudMakeCurrent(key, u);
    cloudEnsureProfile(uid, key, u.name);
  } else {
    // signed up in the cloud but no data saved yet
    const prof = await CLOUD.client.from("profiles").select("name").eq("id", uid).maybeSingle();
    u = DB.users[key] || createUser({ name: (prof.data && prof.data.name) || key, username: key, pin });
    cloudMakeCurrent(key, u);
    await cloudEnsureProfile(uid, key, u.name);
    await cloudPush(u);
  }
  await cloudClaimGrant(true);
  return { ok: true, user: u };
}

/* ── admin CP gifts ──────────────────────────────────────────── */
// The admin sets profiles.cp_grant in Supabase. The next time the person's
// app runs, it claims the gift once (atomically) and adds it to their CP.
async function cloudClaimGrant(quiet) {
  if (!CLOUD.client || !user || user.username === "demo") return;
  try {
    const session = await cloudSession();
    if (!session || cloudSessionKey(session) !== user.username) return;
    const r = await CLOUD.client.from("profiles").select("cp_grant").eq("id", session.user.id).maybeSingle();
    const grant = r.data && Number(r.data.cp_grant);
    if (!grant || grant <= 0) return;
    // claim only if the value is still the one we read, so it can't be applied twice
    const c = await CLOUD.client.from("profiles").update({ cp_grant: 0 })
      .eq("id", session.user.id).eq("cp_grant", grant).select("cp_grant");
    if (c.error || !c.data || !c.data.length) return;
    user.cp += grant;
    save();
    if (!quiet) {
      if (typeof renderAll === "function") renderAll();
      if (typeof toast === "function") toast("+" + grant + " CP added to your studio", "good");
    }
  } catch (e) {
    console.warn("COME: gift check failed", e);
  }
}

/* ── boot / sign out ─────────────────────────────────────────── */
async function cloudBootSync() {
  if (!CLOUD.client || !user || user.username === "demo") return;
  CLOUD.hold = true;
  try {
    const session = await cloudSession();
    const key = user.username;
    if (!session || cloudSessionKey(session) !== key) return;
    const row = await CLOUD.client.from("user_data").select("data, updated_at").eq("user_id", session.user.id).maybeSingle();
    if (row.error) return;
    const known = DB.cloud && DB.cloud[key];
    if (!row.data || !known) {
      CLOUD.hold = false;
      await cloudPush(user); // first sync from this browser
      return;
    }
    if (Date.parse(row.data.updated_at) > Date.parse(known)) {
      const u = cloudAdopt(key, row.data, null);
      CLOUD.skip = true;
      user = u;
      save();
      CLOUD.skip = false;
      if (typeof applyLook === "function") applyLook();
      if (typeof renderAll === "function") renderAll();
      if (typeof toast === "function") toast("Synced from your account", "good");
    }
  } catch (e) {
    console.warn("COME: boot sync failed", e);
  } finally {
    CLOUD.hold = false;
    cloudQueueSync();
    cloudClaimGrant();
  }
}
async function cloudSignOut() {
  if (!CLOUD.client) return;
  try { await CLOUD.client.auth.signOut({ scope: "local" }); } catch (e) { /* ignore */ }
}

document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "hidden") cloudFlush();
  else cloudClaimGrant();
});
setInterval(() => { if (document.visibilityState === "visible") cloudClaimGrant(); }, 60000);
window.addEventListener("online", () => cloudFlush());