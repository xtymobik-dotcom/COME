# COME - the activity studio

A local-first activity and time planner with a Notion-style database, focus room, Spotify embeds, streaks, CP rewards and a cosmetics shop. Built as a static site with vanilla HTML, CSS and JavaScript - no build step. The look is a pixel-art skin in midnight navy, cream, red and teal, with PIX the mascot running a short first-run tour.

## Accounts

- **Explore the demo** enters Mira's demo studio immediately.
- Demo sign-in after creating it: username `demo`, PIN `1234`.
- New accounts start with 60 CP, four starter pages and the included Default look.
- Everything is stored in `localStorage` under `cotime.v1` on this browser.
- Profile photos and cover photos are uploaded locally, resized in-browser and stored as data URLs in the same record.
- Optional Supabase accounts and sync live in `js/cloud.js` and `js/cloud-config.js`. The publishable key is public; never put a secret or `service_role` key in the client.

## What is inside

- **Today** - greeting, progress, streak check-in, CP balance, focus chart, 10-week heat map and rituals.
- **Planner** - table, board and calendar views; inline edits; search, category filter and sort; task drawer; drag-and-drop board.
- **Focus room** - 5/25/50 minute timer, optional task linking, logged minutes, CP rewards and the active Spotify embed.
- **Music** - paste a Spotify playlist, album or track URL; the official player loads inline in Music and the quiet dock; newly added playlists are selected automatically.
- **Studio shop** - PIX skins, frames, themes, profile effects, font packs, titles and banners. A theme repaints every token on the page - background, cards, accents, buttons, borders and the focus room.
- **Profile** - editable name, avatar letter, uploadable profile photo and cover photo, level, streak, totals, badges and collection. Animated frames also paint the profile banner and a soft aura behind the avatar.
- **PIX** - the pixel mascot runs a video-game coach-mark tour on first sign-in: a spotlight lands on the real control, a speech bubble explains it, and clicking the control (or Next) advances. PIX reacts to kept tasks, purchases, playlists and streak awards, and keeps watch from the focus room.

## Shop

- **PIX skins (11)** - Classic PIX is free and stays the default. Sakura, Neon, Gamer, Scholar, Astro, Striker, Samurai, Wizard, Sleepy and Punk reuse the same verified portrait with palette swaps and small pixel accessories.
- **Frames (21)** - the original frames plus 10 animated scenes:
  - Anime: Shadow Crown, Dungeon Gate, Blossom Storm, Thunder Breath, Cursed Energy.
  - Gaming: Player One, Boss Raid, Mecha Core.
  - Study: Deep Study, Library Dust.
  - All 16 animated frames wear a Discord-style fire ring that hugs a rounded-square avatar in the frame's own palette, with animated flame tongues. The 10 anime/gaming/study frames also wear a gold crown above the picture. The fire and crown show on the topbar, sidebar, profile avatar and shop previews; the profile banner also picks up the frame scene. Cover photos stay in front of the scene.
- **Themes (38)** - Default, Peach Shift, Red Inferno, Terminal, Sakura, Neo Tokyo, Shonen, Mecha, Magical Girl, Cyberpunk, Quantum Lab, Chemistry, Biology, Astronomy, Mathematics, Computer Science, Robotics, Coffee House, Deep Forest, Sunset Drive, Deep Ocean, Monochrome, Vaporwave, Arcade, Lavender Haze, Firewatch, Nordic Frost, Blood Moon, Matcha, Dusk Bloom, Matchday, RGB Arena, Anime Club, Physics Lab, Med School, Blueprint, Law School and Art Studio.
- **Profile FX (12)** - Clean Slate, Monarch Aura, Blossom Drift, Thunder Step, Flame Focus, Stadium Lights, Derby Day, RGB Setup, Data Rain, Star Field, Heartbeat and Frostbite. They animate the avatar aura and the banner.
- **Font packs (10)** - Pixel Classic (free), Modern Studio, Editorial Serif, Typewriter, Handwritten, Tech Deck, Anime Dub, Academic Press, Arcade Cabinet and Street Poster. A pack overrides the serif, sans and mono families on the whole site.
- **Titles (4)** and **Banners (10)** - including Matchday, RGB Grid, Blueprint, Monarch and Starfield.

## Rewards

- Finish a page: +3 / +5 / +8 CP by priority.
- Focus: +1 CP per 4 logged minutes (minimum 1 CP per session).
- Daily check-in: +2 CP, rising by 1 per streak day up to +12.
- Streak milestones at 3, 7, 14, 30, 60 and 100 days pay 25 / 60 / 120 / 250 / 450 / 750 CP.
- Levels use a 500 CP curve, so the shop is a long-term goal rather than a quick unlock.
- CP buys cosmetics; nothing in the shop affects planning limits.

## Notes and limits

- Spotify playback is handled by Spotify's official embed. Signed in, Spotify plays full tracks (Premium stays ad-free); signed out, the embed plays 30-second previews. "Open in Spotify" always links to the full playlist. The app never bypasses Spotify or its licensing.
- Accounts and data are per-browser and per-origin. Clearing site data removes the studio.
- PINs are lightly hashed for local convenience, not for security against someone with access to this browser.
- The site imports Google Fonts; offline use falls back to local serif/sans/mono fonts.
- Motion respects `prefers-reduced-motion`.
- Local CSS and JS links carry a `?v=` query. Bump that version after changing assets so browsers do not serve a stale mix of old and new files. A hard refresh (Ctrl/Cmd + Shift + R) also clears a stale cache.

## Files

```
index.html        Landing page, app shell, modals and focus room
css/base.css      Design tokens, type, buttons, hero, reveals
css/landing.css   Landing sections, auth, commands, footer
css/app.css       App shell, Today, planner table/board/calendar
css/overlays.css  Music, shop, profile, drawer, focus room, responsive rules
css/pixel.css     Pixel-art skin, theme surfaces, animated frames and effects, coach marks, mascot, uploads
js/data.js        Categories, priorities, 38 theme token sets, PIX skins, font packs, profile effects, shop catalogue
js/store.js       localStorage accounts, theme/font tokens, streak, CP, tasks, shop
js/cloud.js       Optional Supabase accounts and sync
js/cloud-config.js Supabase URL and publishable key
js/ui.js          Shell, Today, charts, heat map, planner, avatar photos
js/render-more.js Music, shop previews and profile/cover rendering
js/features.js    Focus timer, music dock, command palette, toasts, confetti
js/mascot.js      PIX art and skins, coach-mark tour, speech bubbles and reactions
js/app.js         Boot, auth, navigation, uploads, drawer and landing gestures
serve.ps1         Small local static server used for this build
```
