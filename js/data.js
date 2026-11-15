/* ═══════════════════════════════════════════════════════════════
   COME — data catalogue
   ═══════════════════════════════════════════════════════════════ */

const CATEGORIES = {
  study:    { label: "Study",    color: "#6f9dff" },
  gaming:   { label: "Gaming",   color: "#ff6b7a" },
  work:     { label: "Work",     color: "#38d6a4" },
  creative: { label: "Creative", color: "#e8a06d" },
  life:     { label: "Life",     color: "#f3e8d0" }
};

const STATUSES = { todo: "To do", doing: "In focus", done: "Done" };

const PRIORITIES = {
  low:    { label: "Low",    bonus: 3,  dot: "low" },
  medium: { label: "Medium", bonus: 5,  dot: "medium" },
  high:   { label: "High",   bonus: 8,  dot: "high" }
};

const STREAK_MILESTONES = [
  { days: 3,   cp: 25 },
  { days: 7,   cp: 60 },
  { days: 14,  cp: 120 },
  { days: 30,  cp: 250 },
  { days: 60,  cp: 450 },
  { days: 100, cp: 750 }
];

const LEVEL_NAMES = ["Curator", "Keeper", "Archivist", "Editor", "Director", "Patron", "Maestro", "Luminary"];

/* ── themes ──────────────────────────────────────────────────────
   Every theme is a full token set applied to <html> when equipped.
   Add a theme here and it immediately appears in the shop.        */
const THEME_BASE = {
  bone: "#0a1228", "bone-2": "#0d1836", paper: "#101d3f", "paper-2": "#0c1732", card: "#122048",
  ink: "#f3e8d0", "ink-soft": "#c9d2e6", muted: "#95a4c4",
  navy: "#101d3f", "navy-deep": "#070d20", oxblood: "#6e1f2c", red: "#a63a46", brass: "#e8a06d",
  accent: "#c14a55", "accent-2": "#38d6a4",
  line: "rgba(243,232,208,.14)", "line-2": "rgba(243,232,208,.28)",
  "btn-bg": "#c14a55", "btn-fg": "#fff4de",
  shadow: "8px 8px 0 rgba(3,7,18,.55)", "shadow-soft": "4px 4px 0 rgba(3,7,18,.45)",
  "grid-line": "rgba(243,232,208,.035)",
  "glow-a": "rgba(193,74,85,.18)", "glow-b": "rgba(56,214,164,.10)"
};
function makeTheme(colors, overrides = {}) {
  return { colors, tokens: Object.assign({}, THEME_BASE, overrides) };
}
const THEMES = {
  gallery: makeTheme(["#0a1228", "#f3e8d0", "#c14a55"]),
  sand: makeTheme(["#0b1530", "#e8a06d", "#f3e8d0"], {
    bone: "#0b1530", "bone-2": "#0e1a39", paper: "#132044", "paper-2": "#0e1936", card: "#17254c",
    navy: "#132044", red: "#c47748", brass: "#f3c9a0",
    accent: "#e8a06d", "accent-2": "#f3e8d0", "btn-bg": "#e8a06d", "btn-fg": "#1a1020",
    "ink-soft": "#d8dcc9", muted: "#a6b0c9",
    "glow-a": "rgba(232,160,109,.20)", "glow-b": "rgba(243,232,208,.08)"
  }),
  inferno: makeTheme(["#160a12", "#ff5c6a", "#e8a06d"], {
    bone: "#160a12", "bone-2": "#1d0c17", paper: "#220d1b", "paper-2": "#190a14", card: "#2a1020",
    navy: "#2a1020", "navy-deep": "#12060c", oxblood: "#4a0d18", red: "#c14a55", brass: "#e8a06d",
    ink: "#ffe8e2", "ink-soft": "#f0c8c4", muted: "#b98d92",
    accent: "#ff5c6a", "accent-2": "#e8a06d", "btn-bg": "#ff5c6a", "btn-fg": "#1b0710",
    line: "rgba(255,220,210,.14)", "line-2": "rgba(255,220,210,.28)",
    "glow-a": "rgba(255,92,106,.22)", "glow-b": "rgba(232,160,109,.12)"
  }),
  night: makeTheme(["#050a16", "#38d6a4", "#e8a06d"], {
    bone: "#050a16", "bone-2": "#070d20", paper: "#0a1228", "paper-2": "#081022", card: "#0c1730",
    navy: "#0a1228", "navy-deep": "#03060e", oxblood: "#1f4a3e", red: "#1f9d78", brass: "#e8a06d",
    ink: "#eafff7", "ink-soft": "#b9d8cc", muted: "#7f9c93",
    accent: "#38d6a4", "accent-2": "#e8a06d", "btn-bg": "#38d6a4", "btn-fg": "#04120d",
    line: "rgba(234,255,247,.12)", "line-2": "rgba(234,255,247,.24)",
    shadow: "8px 8px 0 rgba(0,0,0,.7)", "shadow-soft": "4px 4px 0 rgba(0,0,0,.6)",
    "glow-a": "rgba(56,214,164,.18)", "glow-b": "rgba(232,160,109,.08)"
  }),
  sakura: makeTheme(["#1a0f1f", "#ff5c8a", "#ffd6a5"], {
    bone: "#1a0f1f", "bone-2": "#211326", paper: "#2a1830", "paper-2": "#22142a", card: "#2e1a36",
    navy: "#2a1830", "navy-deep": "#140a18", oxblood: "#6b1f3a", red: "#c2406b", brass: "#ffc2a8",
    ink: "#ffe9f2", "ink-soft": "#e8c9d8", muted: "#b995a8",
    accent: "#ff5c8a", "accent-2": "#ffd6a5", "btn-bg": "#ff5c8a", "btn-fg": "#2a0a18",
    line: "rgba(255,233,242,.14)", "line-2": "rgba(255,233,242,.28)",
    "grid-line": "rgba(255,233,242,.04)",
    "glow-a": "rgba(255,92,138,.22)", "glow-b": "rgba(255,214,165,.14)"
  }),
  "neo-tokyo": makeTheme(["#07101f", "#ff2e88", "#00e5ff"], {
    bone: "#07101f", "bone-2": "#0a1428", paper: "#0d1a33", "paper-2": "#0a1528", card: "#102040",
    navy: "#0d1a33", "navy-deep": "#040a14", oxblood: "#3a1050", red: "#b02a7a", brass: "#ffd166",
    ink: "#e8f6ff", "ink-soft": "#b8d4e8", muted: "#7f9ab5",
    accent: "#ff2e88", "accent-2": "#00e5ff", "btn-bg": "#ff2e88", "btn-fg": "#0a0618",
    line: "rgba(232,246,255,.14)", "line-2": "rgba(232,246,255,.28)",
    "glow-a": "rgba(255,46,136,.22)", "glow-b": "rgba(0,229,255,.16)"
  }),
  shonen: makeTheme(["#140d08", "#ff7a1a", "#ffd166"], {
    bone: "#140d08", "bone-2": "#1b120b", paper: "#24180f", "paper-2": "#1b110a", card: "#2a1c12",
    navy: "#2a1c12", "navy-deep": "#0d0704", oxblood: "#5a1c0c", red: "#c2410c", brass: "#ffb347",
    ink: "#fff1dc", "ink-soft": "#e8cfb2", muted: "#b09477",
    accent: "#ff7a1a", "accent-2": "#ffd166", "btn-bg": "#ff7a1a", "btn-fg": "#1a0a02",
    line: "rgba(255,241,220,.14)", "line-2": "rgba(255,241,220,.28)",
    "glow-a": "rgba(255,122,26,.22)", "glow-b": "rgba(255,209,102,.12)"
  }),
  mecha: makeTheme(["#0b0f14", "#e03a3a", "#9fd6ff"], {
    bone: "#0b0f14", "bone-2": "#10161d", paper: "#151d26", "paper-2": "#101720", card: "#1a2430",
    navy: "#151d26", "navy-deep": "#05080c", oxblood: "#5a1414", red: "#c42b2b", brass: "#d9a441",
    ink: "#e6edf5", "ink-soft": "#b8c4d2", muted: "#7f8fa3",
    accent: "#e03a3a", "accent-2": "#9fd6ff", "btn-bg": "#e03a3a", "btn-fg": "#0a0c10",
    line: "rgba(230,237,245,.14)", "line-2": "rgba(230,237,245,.28)",
    "glow-a": "rgba(224,58,58,.18)", "glow-b": "rgba(159,214,255,.12)"
  }),
  magical: makeTheme(["#150f24", "#c86bff", "#ffb3d9"], {
    bone: "#150f24", "bone-2": "#1b1430", paper: "#221a3c", "paper-2": "#1a1430", card: "#281f46",
    navy: "#221a3c", "navy-deep": "#0d0818", oxblood: "#4a1d5c", red: "#a03a8a", brass: "#ffd1e8",
    ink: "#f6eaff", "ink-soft": "#d8c4ef", muted: "#a891c4",
    accent: "#c86bff", "accent-2": "#ffb3d9", "btn-bg": "#c86bff", "btn-fg": "#1a0a26",
    line: "rgba(246,234,255,.14)", "line-2": "rgba(246,234,255,.28)",
    "glow-a": "rgba(200,107,255,.20)", "glow-b": "rgba(255,179,217,.14)"
  }),
  cyberpunk: makeTheme(["#0a0d08", "#f5e642", "#00ffc8"], {
    bone: "#0a0d08", "bone-2": "#10140c", paper: "#151a10", "paper-2": "#10140c", card: "#1a2114",
    navy: "#151a10", "navy-deep": "#050704", oxblood: "#4a3a05", red: "#b38f00", brass: "#f5e642",
    ink: "#f2ffd9", "ink-soft": "#cfe3a8", muted: "#93a878",
    accent: "#f5e642", "accent-2": "#00ffc8", "btn-bg": "#f5e642", "btn-fg": "#101400",
    line: "rgba(242,255,217,.14)", "line-2": "rgba(242,255,217,.28)",
    "glow-a": "rgba(245,230,66,.18)", "glow-b": "rgba(0,255,200,.14)"
  }),
  quantum: makeTheme(["#061024", "#4d8dff", "#6ff0ff"], {
    bone: "#061024", "bone-2": "#081630", paper: "#0b1d3f", "paper-2": "#081630", card: "#0e2448",
    navy: "#0b1d3f", "navy-deep": "#030814", oxblood: "#123a6b", red: "#2b6bd6", brass: "#7fd4ff",
    ink: "#e6f2ff", "ink-soft": "#b8d0ee", muted: "#7f9ac0",
    accent: "#4d8dff", "accent-2": "#6ff0ff", "btn-bg": "#4d8dff", "btn-fg": "#041020",
    line: "rgba(230,242,255,.14)", "line-2": "rgba(230,242,255,.28)",
    "glow-a": "rgba(77,141,255,.22)", "glow-b": "rgba(111,240,255,.14)"
  }),
  chemistry: makeTheme(["#07120d", "#38d67a", "#b6ff7a"], {
    bone: "#07120d", "bone-2": "#0a1812", paper: "#0d2018", "paper-2": "#0a1812", card: "#10281e",
    navy: "#0d2018", "navy-deep": "#030a06", oxblood: "#145a3a", red: "#1f9d62", brass: "#b6ff7a",
    ink: "#e8fff2", "ink-soft": "#b8e8cc", muted: "#7fae93",
    accent: "#38d67a", "accent-2": "#b6ff7a", "btn-bg": "#38d67a", "btn-fg": "#04140a",
    line: "rgba(232,255,242,.14)", "line-2": "rgba(232,255,242,.28)",
    "glow-a": "rgba(56,214,122,.20)", "glow-b": "rgba(182,255,122,.12)"
  }),
  biology: makeTheme(["#081410", "#3fbf7f", "#ffd9a0"], {
    bone: "#081410", "bone-2": "#0c1c16", paper: "#10261e", "paper-2": "#0c1c16", card: "#143026",
    navy: "#10261e", "navy-deep": "#040c08", oxblood: "#145a3e", red: "#2b8a5e", brass: "#ffd9a0",
    ink: "#f0fff6", "ink-soft": "#c4e8d4", muted: "#8bb59d",
    accent: "#3fbf7f", "accent-2": "#ffd9a0", "btn-bg": "#3fbf7f", "btn-fg": "#04120a",
    line: "rgba(240,255,246,.14)", "line-2": "rgba(240,255,246,.28)",
    "glow-a": "rgba(63,191,127,.20)", "glow-b": "rgba(255,217,160,.12)"
  }),
  astronomy: makeTheme(["#070818", "#8b6bff", "#ffd166"], {
    bone: "#070818", "bone-2": "#0a0c22", paper: "#0e1130", "paper-2": "#0a0c22", card: "#12163c",
    navy: "#0e1130", "navy-deep": "#030412", oxblood: "#2a1a5c", red: "#6b4ad6", brass: "#ffd166",
    ink: "#f4f0ff", "ink-soft": "#cfc8ee", muted: "#928ab8",
    accent: "#8b6bff", "accent-2": "#ffd166", "btn-bg": "#8b6bff", "btn-fg": "#08041a",
    line: "rgba(244,240,255,.14)", "line-2": "rgba(244,240,255,.28)",
    "glow-a": "rgba(139,107,255,.22)", "glow-b": "rgba(255,209,102,.12)"
  }),
  mathematics: makeTheme(["#0a1512", "#63c9a0", "#f2e6c9"], {
    bone: "#0a1512", "bone-2": "#0d1b17", paper: "#10231d", "paper-2": "#0d1b17", card: "#142a23",
    navy: "#10231d", "navy-deep": "#040c09", oxblood: "#1d4a3a", red: "#2f7a5e", brass: "#f2e6c9",
    ink: "#eafff4", "ink-soft": "#bfe0d0", muted: "#84a898",
    accent: "#63c9a0", "accent-2": "#f2e6c9", "btn-bg": "#63c9a0", "btn-fg": "#04140e",
    line: "rgba(234,255,244,.14)", "line-2": "rgba(234,255,244,.28)",
    "glow-a": "rgba(99,201,160,.18)", "glow-b": "rgba(242,230,201,.10)"
  }),
  compsci: makeTheme(["#050b08", "#2bff88", "#9dffb0"], {
    bone: "#050b08", "bone-2": "#07110c", paper: "#0a1810", "paper-2": "#07110c", card: "#0c2014",
    navy: "#0a1810", "navy-deep": "#020604", oxblood: "#0f3a24", red: "#1f7a4a", brass: "#9dffb0",
    ink: "#d8ffe8", "ink-soft": "#a8e8c0", muted: "#6fae88",
    accent: "#2bff88", "accent-2": "#9dffb0", "btn-bg": "#2bff88", "btn-fg": "#02140a",
    line: "rgba(216,255,232,.14)", "line-2": "rgba(216,255,232,.28)",
    "glow-a": "rgba(43,255,136,.18)", "glow-b": "rgba(157,255,176,.10)"
  }),
  robotics: makeTheme(["#0c0e12", "#e08a2b", "#ffb347"], {
    bone: "#0c0e12", "bone-2": "#11141a", paper: "#161a22", "paper-2": "#11141a", card: "#1b202a",
    navy: "#161a22", "navy-deep": "#05070a", oxblood: "#4a2a10", red: "#b06a1f", brass: "#ffb347",
    ink: "#eef2f8", "ink-soft": "#c2cad6", muted: "#8590a0",
    accent: "#e08a2b", "accent-2": "#ffb347", "btn-bg": "#e08a2b", "btn-fg": "#120a02",
    line: "rgba(238,242,248,.14)", "line-2": "rgba(238,242,248,.28)",
    "glow-a": "rgba(224,138,43,.20)", "glow-b": "rgba(255,179,71,.12)"
  }),
  coffee: makeTheme(["#140e0a", "#c47a45", "#f3d9b8"], {
    bone: "#140e0a", "bone-2": "#1a120d", paper: "#221710", "paper-2": "#1a120d", card: "#281c14",
    navy: "#221710", "navy-deep": "#0a0604", oxblood: "#4a2414", red: "#8a4a2a", brass: "#d9a066",
    ink: "#f6e9d8", "ink-soft": "#d8c2a8", muted: "#a88f78",
    accent: "#c47a45", "accent-2": "#f3d9b8", "btn-bg": "#c47a45", "btn-fg": "#1a0e06",
    line: "rgba(246,233,216,.14)", "line-2": "rgba(246,233,216,.28)",
    "glow-a": "rgba(196,122,69,.20)", "glow-b": "rgba(243,217,184,.10)"
  }),
  forest: makeTheme(["#08120c", "#5cbf6a", "#d9c47a"], {
    bone: "#08120c", "bone-2": "#0c180f", paper: "#102014", "paper-2": "#0c180f", card: "#14281a",
    navy: "#102014", "navy-deep": "#030a05", oxblood: "#1d4a24", red: "#3f7a3a", brass: "#d9c47a",
    ink: "#e8f5e4", "ink-soft": "#bcd8b8", muted: "#82a37e",
    accent: "#5cbf6a", "accent-2": "#d9c47a", "btn-bg": "#5cbf6a", "btn-fg": "#04120a",
    line: "rgba(232,245,228,.14)", "line-2": "rgba(232,245,228,.28)",
    "glow-a": "rgba(92,191,106,.20)", "glow-b": "rgba(217,196,122,.10)"
  }),
  sunset: makeTheme(["#160d16", "#ff6b4a", "#ffb347"], {
    bone: "#160d16", "bone-2": "#1d101d", paper: "#261526", "paper-2": "#1d101d", card: "#2c192c",
    navy: "#261526", "navy-deep": "#0d060d", oxblood: "#5c1d3a", red: "#b03a5a", brass: "#ffb347",
    ink: "#ffece8", "ink-soft": "#e8c4c8", muted: "#b08a9a",
    accent: "#ff6b4a", "accent-2": "#ffb347", "btn-bg": "#ff6b4a", "btn-fg": "#1a0808",
    line: "rgba(255,236,232,.14)", "line-2": "rgba(255,236,232,.28)",
    "glow-a": "rgba(255,107,74,.22)", "glow-b": "rgba(255,179,71,.12)"
  }),
  ocean: makeTheme(["#061218", "#2bb3d6", "#7ff0d4"], {
    bone: "#061218", "bone-2": "#081a22", paper: "#0b2430", "paper-2": "#081a22", card: "#0e2c3a",
    navy: "#0b2430", "navy-deep": "#020a0e", oxblood: "#0f4a5c", red: "#1f7a9d", brass: "#ffd166",
    ink: "#e6f9ff", "ink-soft": "#b8e0ee", muted: "#7fa8b8",
    accent: "#2bb3d6", "accent-2": "#7ff0d4", "btn-bg": "#2bb3d6", "btn-fg": "#02141a",
    line: "rgba(230,249,255,.14)", "line-2": "rgba(230,249,255,.28)",
    "glow-a": "rgba(43,179,214,.22)", "glow-b": "rgba(127,240,212,.12)"
  }),
  monochrome: makeTheme(["#0a0a0a", "#e8e8e8", "#9a9a9a"], {
    bone: "#0a0a0a", "bone-2": "#101010", paper: "#151515", "paper-2": "#101010", card: "#1a1a1a",
    navy: "#151515", "navy-deep": "#050505", oxblood: "#3a3a3a", red: "#6a6a6a", brass: "#d4d4d4",
    ink: "#f2f2f2", "ink-soft": "#c8c8c8", muted: "#8a8a8a",
    accent: "#e8e8e8", "accent-2": "#9a9a9a", "btn-bg": "#e8e8e8", "btn-fg": "#0a0a0a",
    line: "rgba(242,242,242,.14)", "line-2": "rgba(242,242,242,.28)",
    "glow-a": "rgba(255,255,255,.08)", "glow-b": "rgba(255,255,255,.05)"
  }),
  vaporwave: makeTheme(["#120a1e", "#ff6bd6", "#7ff0ff"], {
    bone: "#120a1e", "bone-2": "#180d28", paper: "#201034", "paper-2": "#180d28", card: "#26143e",
    navy: "#201034", "navy-deep": "#08040e", oxblood: "#4a1d6b", red: "#a03ab0", brass: "#7ff0ff",
    ink: "#ffe9ff", "ink-soft": "#e0c4f0", muted: "#a888c0",
    accent: "#ff6bd6", "accent-2": "#7ff0ff", "btn-bg": "#ff6bd6", "btn-fg": "#1a0620",
    line: "rgba(255,233,255,.14)", "line-2": "rgba(255,233,255,.28)",
    "glow-a": "rgba(255,107,214,.22)", "glow-b": "rgba(127,240,255,.14)"
  }),
  arcade: makeTheme(["#0c0816", "#b06bff", "#ffe14d"], {
    bone: "#0c0816", "bone-2": "#120c1e", paper: "#181028", "paper-2": "#120c1e", card: "#1e1432",
    navy: "#181028", "navy-deep": "#05030a", oxblood: "#3a1d5c", red: "#7a3ab0", brass: "#ffe14d",
    ink: "#fff6d8", "ink-soft": "#e0d0a8", muted: "#a89878",
    accent: "#b06bff", "accent-2": "#ffe14d", "btn-bg": "#b06bff", "btn-fg": "#0a0414",
    line: "rgba(255,246,216,.14)", "line-2": "rgba(255,246,216,.28)",
    "glow-a": "rgba(176,107,255,.22)", "glow-b": "rgba(255,225,77,.12)"
  }),
  lavender: makeTheme(["#12101f", "#9b8cff", "#ffd9c2"], {
    bone: "#12101f", "bone-2": "#171427", paper: "#1d1932", "paper-2": "#171427", card: "#231e3c",
    navy: "#1d1932", "navy-deep": "#08060f", oxblood: "#3a2a5c", red: "#6b5aa0", brass: "#ffd9c2",
    ink: "#f4efff", "ink-soft": "#d4c8ee", muted: "#a498c0",
    accent: "#9b8cff", "accent-2": "#ffd9c2", "btn-bg": "#9b8cff", "btn-fg": "#0d0a1a",
    line: "rgba(244,239,255,.14)", "line-2": "rgba(244,239,255,.28)",
    "glow-a": "rgba(155,140,255,.20)", "glow-b": "rgba(255,217,194,.10)"
  }),
  firewatch: makeTheme(["#101812", "#ff7a3a", "#5ce0b0"], {
    bone: "#101812", "bone-2": "#14201a", paper: "#192a22", "paper-2": "#14201a", card: "#1e3328",
    navy: "#192a22", "navy-deep": "#060c08", oxblood: "#5c2a14", red: "#b05a2a", brass: "#ffb347",
    ink: "#fff0d8", "ink-soft": "#d8d0b0", muted: "#9aa88a",
    accent: "#ff7a3a", "accent-2": "#5ce0b0", "btn-bg": "#ff7a3a", "btn-fg": "#140a02",
    line: "rgba(255,240,216,.14)", "line-2": "rgba(255,240,216,.28)",
    "glow-a": "rgba(255,122,58,.20)", "glow-b": "rgba(92,224,176,.10)"
  }),
  nordic: makeTheme(["#0a1118", "#6bb3d9", "#b8e8ff"], {
    bone: "#0a1118", "bone-2": "#0d1820", paper: "#102028", "paper-2": "#0d1820", card: "#142830",
    navy: "#102028", "navy-deep": "#03080c", oxblood: "#1d4a5c", red: "#2b7a9d", brass: "#d9e8ff",
    ink: "#eaf6ff", "ink-soft": "#c0d8e8", muted: "#88a4b8",
    accent: "#6bb3d9", "accent-2": "#b8e8ff", "btn-bg": "#6bb3d9", "btn-fg": "#041018",
    line: "rgba(234,246,255,.14)", "line-2": "rgba(234,246,255,.28)",
    "glow-a": "rgba(107,179,217,.20)", "glow-b": "rgba(184,232,255,.10)"
  }),
  bloodmoon: makeTheme(["#120608", "#ff3b4a", "#ff9a7a"], {
    bone: "#120608", "bone-2": "#18080c", paper: "#200b10", "paper-2": "#18080c", card: "#260d14",
    navy: "#200b10", "navy-deep": "#070203", oxblood: "#4a0a14", red: "#8a1a2a", brass: "#ff9a7a",
    ink: "#ffe4e4", "ink-soft": "#e8b8b8", muted: "#b08080",
    accent: "#ff3b4a", "accent-2": "#ff9a7a", "btn-bg": "#ff3b4a", "btn-fg": "#140204",
    line: "rgba(255,228,228,.14)", "line-2": "rgba(255,228,228,.28)",
    "glow-a": "rgba(255,59,74,.24)", "glow-b": "rgba(255,154,122,.10)"
  }),
  matcha: makeTheme(["#0e1410", "#8fbf5a", "#e8d9a0"], {
    bone: "#0e1410", "bone-2": "#121a14", paper: "#17221a", "paper-2": "#121a14", card: "#1c2a20",
    navy: "#17221a", "navy-deep": "#050a06", oxblood: "#2a4a2a", red: "#4a7a3a", brass: "#e8d9a0",
    ink: "#f2f7e8", "ink-soft": "#ccdcc0", muted: "#94a888",
    accent: "#8fbf5a", "accent-2": "#e8d9a0", "btn-bg": "#8fbf5a", "btn-fg": "#0a1406",
    line: "rgba(242,247,232,.14)", "line-2": "rgba(242,247,232,.28)",
    "glow-a": "rgba(143,191,90,.20)", "glow-b": "rgba(232,217,160,.10)"
  }),
  dusk: makeTheme(["#100b18", "#b06bd6", "#ffc2a8"], {
    bone: "#100b18", "bone-2": "#161020", paper: "#1c1428", "paper-2": "#161020", card: "#221a30",
    navy: "#1c1428", "navy-deep": "#07040c", oxblood: "#3a1d4a", red: "#6b3a7a", brass: "#ffc2a8",
    ink: "#f8ecff", "ink-soft": "#d8c8e8", muted: "#a898b8",
    accent: "#b06bd6", "accent-2": "#ffc2a8", "btn-bg": "#b06bd6", "btn-fg": "#0d0614",
    line: "rgba(248,236,255,.14)", "line-2": "rgba(248,236,255,.28)",
    "glow-a": "rgba(176,107,214,.22)", "glow-b": "rgba(255,194,168,.12)"
  }),

  /* ── student-type themes ─────────────────────────────────────── */
  football: makeTheme(["#07140d", "#38d67a", "#f3e8d0"], {
    bone: "#07140d", "bone-2": "#0a1a11", paper: "#0d2217", "paper-2": "#0a1a11", card: "#10291c",
    navy: "#0d2217", "navy-deep": "#030a06", oxblood: "#123a24", red: "#c14a55", brass: "#f3e8d0",
    ink: "#f0fff4", "ink-soft": "#c4e8d0", muted: "#8bb89a",
    accent: "#38d67a", "accent-2": "#f3e8d0", "btn-bg": "#38d67a", "btn-fg": "#04140a",
    line: "rgba(240,255,244,.14)", "line-2": "rgba(240,255,244,.28)",
    "glow-a": "rgba(56,214,122,.20)", "glow-b": "rgba(243,232,208,.10)"
  }),
  gamer: makeTheme(["#08060f", "#b06bff", "#2bff88"], {
    bone: "#08060f", "bone-2": "#0c0916", paper: "#110d1f", "paper-2": "#0c0916", card: "#171128",
    navy: "#110d1f", "navy-deep": "#030206", oxblood: "#2a0f3a", red: "#7a2ab0", brass: "#ffe14d",
    ink: "#f6f0ff", "ink-soft": "#d0c4e8", muted: "#9a8ab8",
    accent: "#b06bff", "accent-2": "#2bff88", "btn-bg": "#b06bff", "btn-fg": "#0a0414",
    line: "rgba(246,240,255,.14)", "line-2": "rgba(246,240,255,.28)",
    "glow-a": "rgba(176,107,255,.22)", "glow-b": "rgba(43,255,136,.14)"
  }),
  anime: makeTheme(["#0e0a1c", "#ff5c8a", "#6ff0ff"], {
    bone: "#0e0a1c", "bone-2": "#130e24", paper: "#1a1330", "paper-2": "#130e24", card: "#21183c",
    navy: "#1a1330", "navy-deep": "#06040e", oxblood: "#3a1d5c", red: "#7a3ab0", brass: "#ffd166",
    ink: "#f4efff", "ink-soft": "#d4c8ee", muted: "#a498c0",
    accent: "#ff5c8a", "accent-2": "#6ff0ff", "btn-bg": "#ff5c8a", "btn-fg": "#1a0612",
    line: "rgba(244,239,255,.14)", "line-2": "rgba(244,239,255,.28)",
    "glow-a": "rgba(255,92,138,.22)", "glow-b": "rgba(111,240,255,.14)"
  }),
  physics: makeTheme(["#050b18", "#4d8dff", "#ffd166"], {
    bone: "#050b18", "bone-2": "#071022", paper: "#0a1830", "paper-2": "#071022", card: "#0d2040",
    navy: "#0a1830", "navy-deep": "#020610", oxblood: "#123a6b", red: "#2b6bd6", brass: "#ffd166",
    ink: "#eaf4ff", "ink-soft": "#c0d8ee", muted: "#88a4c0",
    accent: "#4d8dff", "accent-2": "#ffd166", "btn-bg": "#4d8dff", "btn-fg": "#041020",
    line: "rgba(234,244,255,.14)", "line-2": "rgba(234,244,255,.28)",
    "glow-a": "rgba(77,141,255,.22)", "glow-b": "rgba(255,209,102,.12)"
  }),
  medical: makeTheme(["#061414", "#2bd6c4", "#ff8f98"], {
    bone: "#061414", "bone-2": "#081c1c", paper: "#0b2626", "paper-2": "#081c1c", card: "#0e3030",
    navy: "#0b2626", "navy-deep": "#020a0a", oxblood: "#0f4a4a", red: "#1f8a8a", brass: "#f3e8d0",
    ink: "#eaffff", "ink-soft": "#b8e8e8", muted: "#7faeae",
    accent: "#2bd6c4", "accent-2": "#ff8f98", "btn-bg": "#2bd6c4", "btn-fg": "#02140f",
    line: "rgba(234,255,255,.14)", "line-2": "rgba(234,255,255,.28)",
    "glow-a": "rgba(43,214,196,.20)", "glow-b": "rgba(255,143,152,.12)"
  }),
  engineering: makeTheme(["#061020", "#ffb347", "#6fd4ff"], {
    bone: "#061020", "bone-2": "#08162a", paper: "#0b1e38", "paper-2": "#08162a", card: "#0e2646",
    navy: "#0b1e38", "navy-deep": "#020812", oxblood: "#123a5c", red: "#2b6b9d", brass: "#ffb347",
    ink: "#e8f2ff", "ink-soft": "#bcd0e8", muted: "#8298b8",
    accent: "#ffb347", "accent-2": "#6fd4ff", "btn-bg": "#ffb347", "btn-fg": "#1a0e02",
    line: "rgba(232,242,255,.14)", "line-2": "rgba(232,242,255,.28)",
    "glow-a": "rgba(255,179,71,.20)", "glow-b": "rgba(111,212,255,.12)"
  }),
  law: makeTheme(["#140c0c", "#c9a15d", "#f3e8d0"], {
    bone: "#140c0c", "bone-2": "#1a1010", paper: "#221414", "paper-2": "#1a1010", card: "#2a1a1a",
    navy: "#221414", "navy-deep": "#0a0404", oxblood: "#4a1d1d", red: "#8a2a2a", brass: "#d9b26b",
    ink: "#f6ece0", "ink-soft": "#d8c4b0", muted: "#a88f80",
    accent: "#c9a15d", "accent-2": "#f3e8d0", "btn-bg": "#c9a15d", "btn-fg": "#1a0e06",
    line: "rgba(246,236,224,.14)", "line-2": "rgba(246,236,224,.28)",
    "glow-a": "rgba(201,161,93,.20)", "glow-b": "rgba(243,232,208,.10)"
  }),
  art: makeTheme(["#121016", "#ff5c8a", "#6fb8ff"], {
    bone: "#121016", "bone-2": "#18141c", paper: "#201a26", "paper-2": "#18141c", card: "#281f30",
    navy: "#201a26", "navy-deep": "#08060a", oxblood: "#3a1d3a", red: "#8a2a5a", brass: "#ffd166",
    ink: "#fff4f0", "ink-soft": "#e8d0d8", muted: "#b89aa8",
    accent: "#ff5c8a", "accent-2": "#6fb8ff", "btn-bg": "#ff5c8a", "btn-fg": "#1a0610",
    line: "rgba(255,244,240,.14)", "line-2": "rgba(255,244,240,.28)",
    "glow-a": "rgba(255,92,138,.22)", "glow-b": "rgba(111,184,255,.14)"
  })
};

/* ── PIX skins ───────────────────────────────────────────────────
   Every skin recolours the same verified portrait and can add a
   small pixel accessory. The original is free and stays default. */
const PIX_BASE_PALETTE = {
  hair: "#14131a", hairHi: "#26242e", rim: "#0f1118",
  skin: "#f0b98f", skinShade: "#d99a70",
  lens: "#fbf8ee", lensShade: "#e5e0d2", glint: "#ffffff",
  shirt: "#f7eeda", shirtShade: "#e3d3b6", mouth: "#b06a60"
};

const PIX_SKINS = [
  {
    id: "pix-original", name: "Classic PIX", price: 0, value: "pix-original",
    desc: "The original: black hair, round glasses, cream tee. Always included.",
    palette: {}, acc: []
  },
  {
    id: "pix-sakura", name: "Sakura PIX", price: 260, value: "pix-sakura",
    desc: "Blossom-pink hair, a soft tee and two tiny flower clips.",
    palette: { hair: "#5a2340", hairHi: "#7a3058", rim: "#2a0f1f", skin: "#f4c2a0", skinShade: "#d99a70", lens: "#fff2f8", lensShade: "#f0c8dc", shirt: "#ffd6e6", shirtShade: "#f0b8ce", mouth: "#c2406b" },
    acc: [
      [4,1,1,1,"#ff8fb3"],[6,1,1,1,"#ff8fb3"],[5,0,1,1,"#ffd6e6"],[5,2,1,1,"#ffd6e6"],[5,1,1,1,"#fff0f6"],
      [27,4,1,1,"#ff8fb3"],[26,5,1,1,"#ffd6e6"],[28,5,1,1,"#ffd6e6"],[27,6,1,1,"#ff8fb3"]
    ]
  },
  {
    id: "pix-neon", name: "Neon PIX", price: 420, value: "pix-neon",
    desc: "A magenta visor and electric cyan edges. Very after-hours.",
    palette: { hair: "#0a2a3a", hairHi: "#0f4a5c", rim: "#04121a", lens: "#d8ffff", lensShade: "#9ff5ff", shirt: "#101d3f", shirtShade: "#0a1228" },
    acc: [
      [6,8,20,1,"#ff2e88"],[6,9,20,1,"#7a1a5c"],[5,8,1,2,"#00e5ff"],[26,8,1,2,"#00e5ff"],
      [9,8,2,1,"#ff9ad0"],[19,8,2,1,"#ff9ad0"]
    ]
  },
  {
    id: "pix-gamer", name: "Gamer PIX", price: 520, value: "pix-gamer",
    desc: "Purple headset, mint mic light and a hoodie-dark tee.",
    palette: { hair: "#2a1a3e", hairHi: "#3d2857", rim: "#120a1c", lens: "#e8d8ff", lensShade: "#c4a8ee", shirt: "#1a2430", shirtShade: "#101720" },
    acc: [
      [8,1,16,1,"#7a4dff"],[6,2,2,1,"#7a4dff"],[24,2,2,1,"#7a4dff"],[5,3,1,2,"#7a4dff"],[26,3,1,2,"#7a4dff"],
      [0,9,2,4,"#7a4dff"],[30,9,2,4,"#7a4dff"],[0,12,2,1,"#38d6a4"],[30,12,2,1,"#38d6a4"],
      [3,17,1,3,"#7a4dff"],[3,20,1,1,"#38d6a4"]
    ]
  },
  {
    id: "pix-scholar", name: "Scholar PIX", price: 380, value: "pix-scholar",
    desc: "A forest-green cardigan and a warm tie. Library approved.",
    palette: { hair: "#4a2e1a", hairHi: "#6b4528", rim: "#241408", lens: "#f7f0dc", lensShade: "#ddd0b0", shirt: "#2f5d46", shirtShade: "#234838", mouth: "#a05a50" },
    acc: [
      [9,18,1,5,"#234838"],[22,18,1,5,"#234838"],[13,18,6,1,"#f7eeda"],[15,19,2,4,"#e8a06d"],[14,23,4,1,"#e8a06d"]
    ]
  },
  {
    id: "pix-astro", name: "Astro PIX", price: 640, value: "pix-astro",
    desc: "Silver hair, a clear helmet ring and one red antenna.",
    palette: { hair: "#cfd8e8", hairHi: "#eef2f8", rim: "#8fa8c0", skin: "#e8b48c", skinShade: "#c98f68", lens: "#e6f6ff", lensShade: "#b8d8ee", shirt: "#1a2a4a", shirtShade: "#122040" },
    acc: [
      [4,0,24,1,"#9fd6ff"],[2,1,2,1,"#9fd6ff"],[28,1,2,1,"#9fd6ff"],[1,2,1,3,"#9fd6ff"],[30,2,1,3,"#9fd6ff"],
      [0,5,1,16,"#9fd6ff"],[31,5,1,16,"#9fd6ff"],[1,21,2,1,"#9fd6ff"],[29,21,2,1,"#9fd6ff"],
      [15,0,1,1,"#ff5c6a"],[15,1,1,1,"#ffd166"],[14,21,4,1,"#9fd6ff"]
    ]
  },
  {
    id: "pix-striker", name: "Striker PIX", price: 480, value: "pix-striker",
    desc: "Matchday headband, red jersey and a chalk-white collar.",
    palette: { hair: "#2a1810", hairHi: "#3d2418", rim: "#140a04", lens: "#f7eeda", lensShade: "#e3d3b6", shirt: "#c14a55", shirtShade: "#8e2a34", mouth: "#8e2a34" },
    acc: [
      [5,7,22,1,"#f3e8d0"],[5,8,22,1,"#c14a55"],[27,8,1,5,"#f3e8d0"],[27,13,1,3,"#c14a55"],
      [10,18,2,5,"#8e2a34"],[20,18,2,5,"#8e2a34"],[13,18,6,1,"#f3e8d0"],[15,20,2,3,"#f3e8d0"]
    ]
  },
  {
    id: "pix-samurai", name: "Samurai PIX", price: 560, value: "pix-samurai",
    desc: "Orange hair, a trailing hachimaki and a dark gi collar.",
    palette: { hair: "#ff7a1a", hairHi: "#ffb347", rim: "#8e3a0a", lens: "#fff1dc", lensShade: "#e8cfb2", shirt: "#24180f", shirtShade: "#1b110a", mouth: "#8e2a1d" },
    acc: [
      [5,7,22,1,"#f3e8d0"],[5,8,22,1,"#c14a55"],[26,9,1,6,"#f3e8d0"],[27,13,1,4,"#c14a55"],
      [11,18,1,5,"#0f1118"],[20,18,1,5,"#0f1118"],[12,19,8,1,"#0f1118"],[15,20,2,1,"#c14a55"]
    ]
  },
  {
    id: "pix-wizard", name: "Wizard PIX", price: 700, value: "pix-wizard",
    desc: "White hair, a star hat and a deep-violet robe collar.",
    palette: { hair: "#e8e8f0", hairHi: "#ffffff", rim: "#a8a8c0", lens: "#f4f0ff", lensShade: "#d4c8ee", shirt: "#3a1d5c", shirtShade: "#2a1444" },
    acc: [
      [2,3,28,1,"#6b3ab0"],[6,2,20,1,"#6b3ab0"],[9,1,14,1,"#6b3ab0"],[12,0,8,1,"#6b3ab0"],
      [15,1,1,1,"#ffd166"],[13,2,1,1,"#ffd166"],[17,2,1,1,"#ffd166"],
      [11,18,1,5,"#2a1444"],[20,18,1,5,"#2a1444"],[13,19,6,1,"#2a1444"]
    ]
  },
  {
    id: "pix-sleepy", name: "Sleepy PIX", price: 300, value: "pix-sleepy",
    desc: "Mint hair, a nightcap with a peach pom and soft pyjamas.",
    palette: { hair: "#7fbfa8", hairHi: "#a8dcc8", rim: "#4a8a70", skin: "#f4c8a8", skinShade: "#d9a080", lens: "#f0f8ff", lensShade: "#d0e0f0", shirt: "#d8e8ff", shirtShade: "#b8ccee" },
    acc: [
      [4,2,24,1,"#7a8cff"],[6,1,20,1,"#7a8cff"],[8,0,16,1,"#7a8cff"],[4,0,2,2,"#ffd6a5"],
      [5,3,22,1,"#ffd6a5"],[13,18,6,1,"#b8ccee"],[15,19,2,3,"#b8ccee"]
    ]
  },
  {
    id: "pix-punk", name: "Punk PIX", price: 440, value: "pix-punk",
    desc: "A yellow mohawk, one earring and a black jacket collar.",
    palette: { hair: "#ff5c6a", hairHi: "#ff8f98", rim: "#8e1a2a", lens: "#f2f2f2", lensShade: "#c8c8c8", shirt: "#0a0a0a", shirtShade: "#000000", mouth: "#6e1f2c" },
    acc: [
      [14,0,4,1,"#ffe14d"],[13,1,6,1,"#ffe14d"],[14,2,4,1,"#ffe14d"],[15,3,2,1,"#ffe14d"],
      [27,13,1,2,"#ffe14d"],[26,15,1,1,"#ffe14d"],[11,18,1,5,"#1a1a1a"],[20,18,1,5,"#1a1a1a"],[12,19,8,1,"#1a1a1a"]
    ]
  }
];

/* ── font packs ──────────────────────────────────────────────────
   Equipping one overrides --serif / --sans / --mono on <html>. */
const FONT_PACKS = [
  {
    id: "font-classic", name: "Pixel Classic", price: 0, value: "font-classic",
    desc: "The original Silkscreen and Pixelify pairing. Always included.",
    serif: '"Silkscreen", "Courier New", monospace',
    sans: '"Pixelify Sans", "Manrope", sans-serif',
    mono: '"Silkscreen", "DM Mono", monospace'
  },
  {
    id: "font-modern", name: "Modern Studio", price: 260, value: "font-modern",
    desc: "Clean grotesk headings and a calm reading face.",
    serif: '"Space Grotesk", "Inter", sans-serif',
    sans: '"Inter", system-ui, sans-serif',
    mono: '"JetBrains Mono", "DM Mono", monospace'
  },
  {
    id: "font-serif", name: "Editorial Serif", price: 300, value: "font-serif",
    desc: "Playfair headlines with a bookish body and quiet mono labels.",
    serif: '"Playfair Display", Georgia, serif',
    sans: '"Source Serif 4", Georgia, serif',
    mono: '"IBM Plex Mono", monospace'
  },
  {
    id: "font-typewriter", name: "Typewriter", price: 240, value: "font-typewriter",
    desc: "Ink, paper and a machine that only knows one speed.",
    serif: '"Special Elite", "Courier Prime", monospace',
    sans: '"Courier Prime", "Courier New", monospace',
    mono: '"Courier Prime", monospace'
  },
  {
    id: "font-hand", name: "Handwritten", price: 280, value: "font-hand",
    desc: "Notes in the margin, headings in a quick pen.",
    serif: '"Caveat", cursive',
    sans: '"Patrick Hand", cursive',
    mono: '"Courier Prime", monospace'
  },
  {
    id: "font-tech", name: "Tech Deck", price: 360, value: "font-tech",
    desc: "Orbitron headings, Rajdhani body and terminal labels.",
    serif: '"Orbitron", sans-serif',
    sans: '"Rajdhani", sans-serif',
    mono: '"Share Tech Mono", monospace'
  },
  {
    id: "font-anime", name: "Anime Dub", price: 340, value: "font-anime",
    desc: "Bangers titles, rounded body text and a dot-matrix label.",
    serif: '"Bangers", cursive',
    sans: '"M PLUS Rounded 1c", sans-serif',
    mono: '"DotGothic16", monospace'
  },
  {
    id: "font-academic", name: "Academic Press", price: 320, value: "font-academic",
    desc: "Cormorant, Lora and Plex Mono. For the long argument.",
    serif: '"Cormorant Garamond", Georgia, serif',
    sans: '"Lora", Georgia, serif',
    mono: '"IBM Plex Mono", monospace'
  },
  {
    id: "font-arcade", name: "Arcade Cabinet", price: 400, value: "font-arcade",
    desc: "Press Start headings and VT323 everything else.",
    serif: '"Press Start 2P", monospace',
    sans: '"VT323", monospace',
    mono: '"VT323", monospace'
  },
  {
    id: "font-street", name: "Street Poster", price: 300, value: "font-street",
    desc: "Bebas headlines, Oswald body and Space Mono labels.",
    serif: '"Bebas Neue", sans-serif',
    sans: '"Oswald", sans-serif',
    mono: '"Space Mono", monospace'
  }
];

/* ── animated profile effects ────────────────────────────────────
   Applied to the avatar wrapper and the profile banner. Pure CSS. */
const PROFILE_EFFECTS = [
  { id: "effect-none", name: "Clean Slate", price: 0, value: "effect-none", desc: "No extra motion. Just you and your frame.", swatch: "linear-gradient(135deg,#122048,#1a2e4d)" },
  { id: "effect-solo", name: "Monarch Aura", price: 900, value: "effect-solo", desc: "Solo Leveling energy — violet shadow light and rising sparks.", swatch: "linear-gradient(135deg,#2a1a5c,#6b4ad6,#9fd6ff)" },
  { id: "effect-sakura", name: "Blossom Drift", price: 420, value: "effect-sakura", desc: "Petals crossing the frame, forever in spring.", swatch: "linear-gradient(135deg,#ff5c8a,#ffd6e6)" },
  { id: "effect-lightning", name: "Thunder Step", price: 520, value: "effect-lightning", desc: "Anime lightning cracks around your avatar.", swatch: "linear-gradient(135deg,#f5e642,#ffd166)" },
  { id: "effect-fire", name: "Flame Focus", price: 560, value: "effect-fire", desc: "Embers and heat haze for the ones on a run.", swatch: "linear-gradient(135deg,#ff7a1a,#c14a55)" },
  { id: "effect-football", name: "Stadium Lights", price: 480, value: "effect-football", desc: "Pitch-green light sweeping like a night match.", swatch: "linear-gradient(135deg,#38d67a,#f3e8d0)" },
  { id: "effect-derby", name: "Derby Day", price: 540, value: "effect-derby", desc: "Scarf red, chalk white and matchday confetti.", swatch: "linear-gradient(135deg,#c14a55,#f3e8d0)" },
  { id: "effect-gamer", name: "RGB Setup", price: 460, value: "effect-gamer", desc: "A slow rainbow cycle around the frame.", swatch: "linear-gradient(135deg,#ff2e88,#b06bff,#2bff88)" },
  { id: "effect-matrix", name: "Data Rain", price: 580, value: "effect-matrix", desc: "Green code falling behind the glass.", swatch: "linear-gradient(135deg,#07120d,#2bff88)" },
  { id: "effect-cosmos", name: "Star Field", price: 500, value: "effect-cosmos", desc: "A quiet orbit of stars and dust.", swatch: "linear-gradient(135deg,#070818,#8b6bff,#ffd166)" },
  { id: "effect-heart", name: "Heartbeat", price: 380, value: "effect-heart", desc: "Soft pink pulse rings, twice a second.", swatch: "linear-gradient(135deg,#ff5c8a,#ffb3d9)" },
  { id: "effect-frost", name: "Frostbite", price: 420, value: "effect-frost", desc: "Ice-blue shimmer and crystal dust.", swatch: "linear-gradient(135deg,#6bb3d9,#b8e8ff)" }
];

const SHOP_ITEMS = [
  ...PIX_SKINS.map(s => ({ id: s.id, type: "pix", name: s.name, price: s.price, value: s.id, desc: s.desc })),

  { id: "frame-classic", type: "frame",  name: "Starter Frame",  price: 0,   value: "frame-classic", css: "classic", desc: "A clean cream edge. The default." },
  { id: "frame-gold",    type: "frame",  name: "Peach Halo",     price: 220, value: "frame-gold",    css: "gold",    desc: "Warm peach light around your avatar." },
  { id: "frame-orbit",   type: "frame",  name: "Teal Orbit",     price: 280, value: "frame-orbit",   css: "orbit",   desc: "A slow teal ring, going nowhere." },
  { id: "frame-inferno", type: "frame",  name: "Red Alert Ring", price: 320, value: "frame-inferno", css: "inferno", desc: "Inferno red, for the focused ones." },
  { id: "frame-starlit", type: "frame",  name: "Midnight Halo",  price: 560, value: "frame-starlit", css: "starlit", desc: "A little midnight sky, worn close." },
  { id: "frame-neon",    type: "frame",  name: "Neon Pulse",     price: 460, value: "frame-neon",    css: "neon",    desc: "A magenta-cyan ring that never sits still." },
  { id: "frame-holo",    type: "frame",  name: "Holo Shift",     price: 620, value: "frame-holo",    css: "holo",    desc: "A slow rainbow border. Slightly illegal." },
  { id: "frame-flame",   type: "frame",  name: "Ember Ring",     price: 520, value: "frame-flame",   css: "flame",   desc: "Orange heat that flickers at the edges." },
  { id: "frame-frost",   type: "frame",  name: "Frost Ring",     price: 480, value: "frame-frost",   css: "frost",   desc: "Ice-blue shimmer with a winter bite." },
  { id: "frame-anime",   type: "frame",  name: "Manga Burst",    price: 580, value: "frame-anime",   css: "anime",   desc: "Speed lines and a hero sparkle." },
  { id: "frame-football",type: "frame",  name: "Pitch Ring",     price: 500, value: "frame-football",css: "football",desc: "Green chalk and a matchday glow." },

  /* ── animated anime / gaming / study frames ─────────────────── */
  { id: "frame-monarch", type: "frame", name: "Shadow Crown",  price: 1100, value: "frame-monarch", css: "monarch", animated: true, desc: "Anime · violet shadow flame and a crown that never falls." },
  { id: "frame-gate",    type: "frame", name: "Dungeon Gate",  price: 920,  value: "frame-gate",    css: "gate",    animated: true, desc: "Anime · a blue portal ring spinning behind your avatar." },
  { id: "frame-blossom", type: "frame", name: "Blossom Storm", price: 760,  value: "frame-blossom", css: "blossom", animated: true, desc: "Anime · a petal storm circling the frame, forever spring." },
  { id: "frame-thunder", type: "frame", name: "Thunder Breath",price: 940,  value: "frame-thunder", css: "thunder", animated: true, desc: "Anime · electric arcs and a lightning flash on the edge." },
  { id: "frame-curse",   type: "frame", name: "Cursed Energy", price: 1000, value: "frame-curse",   css: "curse",   animated: true, desc: "Anime · black-red smoke leaking out of the frame." },
  { id: "frame-player",  type: "frame", name: "Player One",    price: 820,  value: "frame-player",  css: "player",  animated: true, desc: "Gaming · RGB corners, scanlines and a ready-up pulse." },
  { id: "frame-boss",    type: "frame", name: "Boss Raid",     price: 880,  value: "frame-boss",    css: "boss",    animated: true, desc: "Gaming · red warning ticks and a health-bar sweep." },
  { id: "frame-mecha",   type: "frame", name: "Mecha Core",    price: 980,  value: "frame-mecha",   css: "mecha",   animated: true, desc: "Gaming · a cyan reactor ring with rotating HUD ticks." },
  { id: "frame-study",   type: "frame", name: "Deep Study",    price: 680,  value: "frame-study",   css: "study",   animated: true, desc: "Study · warm lamp light and drifting formulas." },
  { id: "frame-library", type: "frame", name: "Library Dust",  price: 640,  value: "frame-library", css: "library", animated: true, desc: "Study · gold dust and slow pages in the lamplight." },

  { id: "theme-gallery", type: "theme",  name: "Default",        price: 0,    value: "gallery",    colors: THEMES.gallery.colors,    desc: "Midnight navy, cream and red ink. The original." },
  { id: "theme-sand",    type: "theme",  name: "Peach Shift",    price: 180,  value: "sand",       colors: THEMES.sand.colors,       desc: "Warm peach light on a deep navy studio." },
  { id: "theme-inferno", type: "theme",  name: "Red Inferno",    price: 260,  value: "inferno",    colors: THEMES.inferno.colors,    desc: "A hotter red across the whole studio." },
  { id: "theme-night",   type: "theme",  name: "Terminal",       price: 420,  value: "night",      colors: THEMES.night.colors,      desc: "Teal phosphor on the darkest screen." },

  { id: "theme-sakura",  type: "theme",  name: "Sakura",         price: 380,  value: "sakura",     colors: THEMES.sakura.colors,     desc: "Anime pink, blossom cream and soft plum. Very shojo." },
  { id: "theme-neo-tokyo", type: "theme", name: "Neo Tokyo",     price: 560,  value: "neo-tokyo",  colors: THEMES["neo-tokyo"].colors, desc: "Magenta neon and electric cyan over midnight streets." },
  { id: "theme-shonen",  type: "theme",  name: "Shonen",         price: 480,  value: "shonen",     colors: THEMES.shonen.colors,     desc: "Hot orange, ink black and a training-arc sunset." },
  { id: "theme-mecha",   type: "theme",  name: "Mecha",          price: 620,  value: "mecha",      colors: THEMES.mecha.colors,      desc: "Gunmetal plating with a red alert and cockpit blue." },
  { id: "theme-magical", type: "theme",  name: "Magical Girl",   price: 500,  value: "magical",    colors: THEMES.magical.colors,    desc: "Lilac moonlight, transformation pink and stardust." },
  { id: "theme-cyberpunk", type: "theme", name: "Cyberpunk",     price: 680,  value: "cyberpunk",  colors: THEMES.cyberpunk.colors,  desc: "Acid yellow and toxic mint. Chrome optional." },

  { id: "theme-quantum", type: "theme",  name: "Quantum Lab",    price: 520,  value: "quantum",    colors: THEMES.quantum.colors,    desc: "Study theme · deep-space blue and particle cyan." },
  { id: "theme-chemistry", type: "theme", name: "Chemistry",    price: 460,  value: "chemistry",  colors: THEMES.chemistry.colors,  desc: "Study theme · lab green, beaker lime and black glass." },
  { id: "theme-biology", type: "theme",  name: "Biology",        price: 440,  value: "biology",    colors: THEMES.biology.colors,    desc: "Study theme · emerald cells and warm specimen cream." },
  { id: "theme-astronomy", type: "theme", name: "Astronomy",    price: 720,  value: "astronomy",  colors: THEMES.astronomy.colors,  desc: "Study theme · indigo observatory and gold starlight." },
  { id: "theme-mathematics", type: "theme", name: "Mathematics", price: 480, value: "mathematics", colors: THEMES.mathematics.colors, desc: "Study theme · chalkboard green and chalk-white ink." },
  { id: "theme-compsci", type: "theme",  name: "Computer Science", price: 540, value: "compsci",  colors: THEMES.compsci.colors,    desc: "Study theme · terminal green, black glass, pure syntax." },
  { id: "theme-robotics", type: "theme", name: "Robotics",      price: 600,  value: "robotics",   colors: THEMES.robotics.colors,   desc: "Study theme · steel plate, servo amber and workshop dust." },

  { id: "theme-coffee",  type: "theme",  name: "Coffee House",   price: 320,  value: "coffee",     colors: THEMES.coffee.colors,     desc: "Espresso brown, steamed milk and a slow morning." },
  { id: "theme-forest",  type: "theme",  name: "Deep Forest",    price: 420,  value: "forest",     colors: THEMES.forest.colors,     desc: "Moss, pine and lantern gold. Breathe out." },
  { id: "theme-sunset",  type: "theme",  name: "Sunset Drive",   price: 500,  value: "sunset",     colors: THEMES.sunset.colors,     desc: "Burnt orange, dusk purple and the last light." },
  { id: "theme-ocean",   type: "theme",  name: "Deep Ocean",     price: 460,  value: "ocean",      colors: THEMES.ocean.colors,      desc: "Teal current, abyss blue and bioluminescent mint." },
  { id: "theme-monochrome", type: "theme", name: "Monochrome",   price: 280,  value: "monochrome", colors: THEMES.monochrome.colors, desc: "Ink, paper and nothing else. Strictly no colour." },
  { id: "theme-vaporwave", type: "theme", name: "Vaporwave",    price: 640,  value: "vaporwave",  colors: THEMES.vaporwave.colors,  desc: "Sunset pink, VHS cyan and a mall that never closed." },
  { id: "theme-arcade",  type: "theme",  name: "Arcade",         price: 580,  value: "arcade",     colors: THEMES.arcade.colors,     desc: "Purple cabinet, neon yellow and one more credit." },
  { id: "theme-lavender", type: "theme", name: "Lavender Haze",  price: 360,  value: "lavender",   colors: THEMES.lavender.colors,   desc: "Soft violet, linen and a very calm afternoon." },
  { id: "theme-firewatch", type: "theme", name: "Firewatch",     price: 540,  value: "firewatch",  colors: THEMES.firewatch.colors,  desc: "Pine green, lookout orange and a teal horizon." },
  { id: "theme-nordic",  type: "theme",  name: "Nordic Frost",   price: 480,  value: "nordic",     colors: THEMES.nordic.colors,     desc: "Ice blue, fjord slate and pale winter light." },
  { id: "theme-bloodmoon", type: "theme", name: "Blood Moon",    price: 700,  value: "bloodmoon",  colors: THEMES.bloodmoon.colors,  desc: "Oxblood, ember and a sky that turned red." },
  { id: "theme-matcha",  type: "theme",  name: "Matcha",         price: 400,  value: "matcha",     colors: THEMES.matcha.colors,     desc: "Whisked green, rice paper and a quiet tea room." },
  { id: "theme-dusk",    type: "theme",  name: "Dusk Bloom",     price: 520,  value: "dusk",       colors: THEMES.dusk.colors,       desc: "Orchid purple, peach light and the end of the day." },

  { id: "theme-football", type: "theme", name: "Matchday",       price: 560,  value: "football",    colors: THEMES.football.colors,    desc: "Football student · pitch green, chalk white and stadium red." },
  { id: "theme-gamer",    type: "theme", name: "RGB Arena",      price: 540,  value: "gamer",       colors: THEMES.gamer.colors,       desc: "Gamer · violet cabinet, neon mint and one more run." },
  { id: "theme-anime",    type: "theme", name: "Anime Club",     price: 500,  value: "anime",       colors: THEMES.anime.colors,       desc: "Anime lover · hot pink, sky cyan and midnight ink." },
  { id: "theme-physics",  type: "theme", name: "Physics Lab",    price: 500,  value: "physics",     colors: THEMES.physics.colors,     desc: "Science student · deep-space blue and particle gold." },
  { id: "theme-medical",  type: "theme", name: "Med School",     price: 520,  value: "medical",     colors: THEMES.medical.colors,     desc: "Med student · scrub teal, anatomy pink and clean light." },
  { id: "theme-engineering", type: "theme", name: "Blueprint",   price: 500,  value: "engineering", colors: THEMES.engineering.colors, desc: "Engineering · blueprint blue and safety orange." },
  { id: "theme-law",      type: "theme", name: "Law School",     price: 560,  value: "law",         colors: THEMES.law.colors,         desc: "Law student · burgundy leather, parchment and gold." },
  { id: "theme-art",      type: "theme", name: "Art Studio",     price: 460,  value: "art",         colors: THEMES.art.colors,         desc: "Art student · paint pink, cobalt and canvas light." },

  ...PROFILE_EFFECTS.map(e => ({ id: e.id, type: "effect", name: e.name, price: e.price, value: e.value, desc: e.desc, swatch: e.swatch })),
  ...FONT_PACKS.map(f => ({ id: f.id, type: "font", name: f.name, price: f.price, value: f.value, desc: f.desc })),

  { id: "title-curator", type: "title",  name: "Curator",        price: 0,   value: "Curator",      desc: "Of days, of small things." },
  { id: "title-deep",    type: "title",  name: "Deep Worker",    price: 150, value: "Deep Worker",  desc: "For the 90-minute kind of mornings." },
  { id: "title-owl",     type: "title",  name: "Night Owl",      price: 240, value: "Night Owl",    desc: "Best ideas arrive after midnight." },
  { id: "title-keeper",  type: "title",  name: "Streak Keeper",  price: 320, value: "Streak Keeper",desc: "You keep showing up. It shows." },

  { id: "banner-bone",   type: "banner", name: "Cream",          price: 0,   value: "banner-bone",   desc: "Clean, warm, endlessly quiet." },
  { id: "banner-navy",   type: "banner", name: "Navy Wash",      price: 160, value: "banner-navy",   desc: "A deep blue horizon." },
  { id: "banner-oxblood",type: "banner", name: "Red Haze",       price: 220, value: "banner-oxblood",desc: "Red inferno at the edges." },
  { id: "banner-sunset", type: "banner", name: "Peach Dusk",     price: 380, value: "banner-sunset", desc: "A sky that decided to be bold." },
  { id: "banner-anime",  type: "banner", name: "Sakura Sky",     price: 340, value: "banner-anime",  desc: "Pink petals drifting over a midnight sky." },
  { id: "banner-football", type: "banner", name: "Matchday",     price: 360, value: "banner-football", desc: "Pitch stripes and stadium floodlight." },
  { id: "banner-gamer",  type: "banner", name: "RGB Grid",       price: 320, value: "banner-gamer",  desc: "A dark grid with a rainbow edge." },
  { id: "banner-science",type: "banner", name: "Blueprint",      price: 300, value: "banner-science",desc: "Graph paper, cold light and clean lines." },
  { id: "banner-solo",   type: "banner", name: "Monarch",        price: 480, value: "banner-solo",   desc: "Violet shadow light, rising from the floor." },
  { id: "banner-stars",  type: "banner", name: "Starfield",      price: 420, value: "banner-stars",  desc: "A quiet field of stars and dust." }
];

const BADGES = [
  { id: "first",     icon: "✦", name: "First Kept",   desc: "Complete one task",        test: u => u.tasks.some(t => t.status === "done") },
  { id: "ten",       icon: "▦", name: "Tenfold",      desc: "Complete ten tasks",       test: u => u.tasks.filter(t => t.status === "done").length >= 10 },
  { id: "focus5",    icon: "◷", name: "Deep Diver",   desc: "Log five focus hours",     test: u => totalFocusMinutes(u) >= 300 },
  { id: "streak7",   icon: "▲", name: "Seven Suns",   desc: "Keep a 7-day streak",      test: u => u.bestStreak >= 7 },
  { id: "collector", icon: "◈", name: "Collector",    desc: "Own three cosmetics",      test: u => u.owned.filter(id => !isFreeItem(id)).length >= 3 },
  { id: "night",     icon: "☾", name: "After Hours",  desc: "Wear the Terminal theme",  test: u => u.equipped.theme === "theme-night" }
];

const STARTER_TASKS = [
  { title: "Plan the week ahead", category: "life", priority: "medium", status: "done", offset: 0, minutes: 15, notes: "A gentle look at what matters this week." },
  { title: "Deep work — 90 minutes", category: "study", priority: "high", status: "doing", offset: 0, minutes: 0, notes: "Phone away. One tab. One thing." },
  { title: "Play something, guilt-free", category: "gaming", priority: "low", status: "todo", offset: 0, minutes: 0, notes: "Rest is part of the rhythm." },
  { title: "Read 20 pages", category: "study", priority: "medium", status: "todo", offset: 1, minutes: 0, notes: "" }
];

const DEMO_TASKS = [
  { title: "Morning pages — three pages", category: "life", priority: "medium", status: "done", offset: 0, minutes: 20, notes: "Longhand, before the phone." },
  { title: "Deep work: thesis chapter two", category: "study", priority: "high", status: "doing", offset: 0, minutes: 0, notes: "The argument about quiet cities." },
  { title: "Play Hades, guilt-free", category: "gaming", priority: "low", status: "todo", offset: 0, minutes: 0, notes: "One proper run. No timers." },
  { title: "Sketch the COME poster", category: "creative", priority: "medium", status: "todo", offset: 0, minutes: 0, notes: "Navy, cream, red, teal. Keep it pixel-simple." },
  { title: "Read 20 pages of The Creative Act", category: "study", priority: "low", status: "done", offset: -1, minutes: 20, notes: "" },
  { title: "Plan the week", category: "life", priority: "medium", status: "todo", offset: 1, minutes: 0, notes: "Three anchors only." },
  { title: "Edit the launch reel", category: "work", priority: "high", status: "todo", offset: 2, minutes: 0, notes: "Cut it to 18 seconds." },
  { title: "Sketchbook hour", category: "creative", priority: "low", status: "done", offset: -2, minutes: 60, notes: "" }
];

const DEMO_PLAYLISTS = [
  { title: "Lofi Beats", type: "playlist", spotifyId: "37i9dQZF1DWWQRwui0ExPn", art: 0 },
  { title: "Deep Focus", type: "playlist", spotifyId: "37i9dQZF1DWZeKCadgRdKQ", art: 1 }
];

const DEMO_SESSIONS = [
  { offset: -1, minutes: 95, category: "study" },
  { offset: -2, minutes: 140, category: "gaming" },
  { offset: -3, minutes: 60, category: "study" },
  { offset: -4, minutes: 120, category: "work" },
  { offset: -5, minutes: 45, category: "creative" },
  { offset: -6, minutes: 90, category: "study" },
  { offset: -7, minutes: 35, category: "life" },
  { offset: -9, minutes: 75, category: "study" },
  { offset: -11, minutes: 50, category: "gaming" },
  { offset: -13, minutes: 110, category: "work" },
  { offset: -16, minutes: 40, category: "creative" },
  { offset: -18, minutes: 85, category: "study" },
  { offset: -22, minutes: 65, category: "study" },
  { offset: -25, minutes: 30, category: "life" },
  { offset: -29, minutes: 55, category: "work" }
];
