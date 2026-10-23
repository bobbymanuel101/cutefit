import { useState, useEffect, useRef } from "react";
import { ScanBarcode, PencilLine, Camera, Plus, Minus, Trash2, Dumbbell, Utensils, Sparkles, Check, Loader2, X, User, RotateCcw, Droplets, Cog, Timer, Play, Square, ExternalLink, ChevronRight, Activity as ActivityIcon } from "lucide-react";
import { BarcodeScanner, PortionPicker, LookupSpinner, lookupBarcode, findBarcodeInImage } from "./Barcode.jsx";

/* ---------- theme ---------- */
const PINE = "var(--pine)";
const INK = "var(--ink)";
const MUTED = "var(--muted)";
const LINE = "var(--line)";
const BG = "var(--bg)";
const PROTEIN = "var(--protein)";
const CAL = "var(--cal)";
const OVER = "var(--over)";
const MINT = "var(--mint)";
const WATER = "var(--water)";
const STEPS = "var(--steps)";
const ACTIVE = "var(--active)";
const FONT = "ui-rounded, 'SF Pro Rounded', 'Nunito', system-ui, -apple-system, 'Segoe UI', sans-serif";

const CARD = "var(--card)";
const PANEL = "var(--panel)";
const TROUGH = "var(--trough)";
const TROUGH2 = "var(--trough2)";
const SEGBG = "var(--segbg)";
const BTNBG = "var(--btnbg)";
const TINT_P = "var(--tint-p)";
const TINT_C = "var(--tint-c)";
const TINT_W = "var(--tint-w)";
const TINT_S = "var(--tint-s)";
const WATERTXT = "var(--water-text)";
const ICON = "var(--icon)";
const ONPINE = "var(--on-pine)";
const BTNG = "var(--btn-grad)";
const BTNP = "var(--btn-alt)";

const THEMES = {
  light: {
    "--btn-grad": "#3c0f54", "--btn-alt": "#a52bfa", "--pine": "#3c0f54", "--ink": "#1e0a2e", "--muted": "#6b5a80", "--line": "#e9dbf2", "--bg": "#f8f1fb",
    "--card": "#ffffff", "--panel": "#f8f1fb", "--protein": "#a52bfa", "--cal": "#e0329a", "--over": "#d64545",
    "--mint": "#f9ddf0", "--water": "#2a9dd8", "--steps": "#5b2a86", "--active": "#d99a00",
    "--trough": "#ebddf3", "--trough2": "#d9c6ea", "--segbg": "#f0e4f6", "--btnbg": "#f3e8f9",
    "--tint-p": "#f1e4ff", "--tint-c": "#ffe6f3", "--tint-w": "#ddf0fa", "--tint-s": "#eadcf7",
    "--water-text": "#17678f", "--icon": "#a18eb7", "--on-pine": "#e6c8f5",
    "--art-frame": "#bdaed0", "--art-pad": "#8574a3", "--art-plate": "#ddd0ea", "--art-head": "#8e3fb8",
    "--card-shadow": "none", "--nav-shadow": "none", "--seg-shadow": "0 1px 3px rgba(60,15,84,0.18)",
    "--hdr-bg": "#140a22", "--hdr-border": "#5b2a86", "--hdr-glow": "0 0 18px rgba(165,43,250,0.25)",
  },
  neon: {
    "--btn-grad": "#9b3df0", "--btn-alt": "#b04dff", "--pine": "#9b3df0", "--ink": "#f6ecff", "--muted": "#b8a4d4", "--line": "#3b2358", "--bg": "#0d0618",
    "--card": "#170c27", "--panel": "#21123a", "--protein": "#b04dff", "--cal": "#ff5cbd", "--over": "#ff6b81",
    "--mint": "#3a1a56", "--water": "#4cc3ff", "--steps": "#d7b4ff", "--active": "#ffc233",
    "--trough": "#33204f", "--trough2": "#4b3270", "--segbg": "#241440", "--btnbg": "#2d1a4a",
    "--tint-p": "#2c1752", "--tint-c": "#3b1736", "--tint-w": "#123049", "--tint-s": "#2c1b4c",
    "--water-text": "#8fd8ff", "--icon": "#8f7bb0", "--on-pine": "#f3e1ff",
    "--art-frame": "#5b4580", "--art-pad": "#8e75b8", "--art-plate": "#33205a", "--art-head": "#ff8de0",
    "--seg-shadow": "0 0 8px rgba(176,60,255,0.35)", "--card-shadow": "0 0 20px rgba(176,60,255,0.18)", "--nav-shadow": "0 -4px 24px rgba(176,60,255,0.22)",
    "--hdr-bg": "#140a22", "--hdr-border": "#5b2a86", "--hdr-glow": "0 0 18px rgba(165,43,250,0.25)",
  },
  dark: {
    "--btn-grad": "linear-gradient(135deg, #3f83f8 0%, #7b5cf6 55%, #c64fdc 100%)", "--btn-alt": "linear-gradient(135deg, #c64fdc 0%, #7b5cf6 45%, #3f83f8 100%)", "--pine": "#7c8cff", "--ink": "#f1f3f7", "--muted": "#9aa4b5", "--line": "#2b313c", "--bg": "#0e1014",
    "--card": "#161a20", "--panel": "#1f242c", "--protein": "#a78bfa", "--cal": "#ffcf4a", "--over": "#ff5d6c",
    "--mint": "#1f2a44", "--water": "#38bdf8", "--steps": "#4ade80", "--active": "#f472b6",
    "--trough": "#2a303b", "--trough2": "#3a4252", "--segbg": "#1b2029", "--btnbg": "#262c37",
    "--tint-p": "#241f45", "--tint-c": "#3a3115", "--tint-w": "#12304a", "--tint-s": "#14301f",
    "--water-text": "#8fd8ff", "--icon": "#7d8799", "--on-pine": "#e6e9ff",
    "--art-frame": "#4a5465", "--art-pad": "#7a869a", "--art-plate": "#2a313d", "--art-head": "#7fb0ff",
    "--seg-shadow": "0 1px 3px rgba(0,0,0,0.5)", "--card-shadow": "0 6px 20px rgba(0,0,0,0.35)", "--nav-shadow": "0 -6px 20px rgba(0,0,0,0.35)",
    "--hdr-bg": "#101318", "--hdr-border": "#2b313c", "--hdr-glow": "none",
  },
};


/* ---------- constants ---------- */
const LOGO_SRC = "data:image/jpeg;base64,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";
const KEY = "lift-and-fuel:v1";
const PHOTO_KEY = "lift-and-fuel:photo:";

const GOALS = {
  lose: { label: "Lose weight", short: "Cutting", perKg: 2.0, water: 250 },
  maintain: { label: "Maintain", short: "Maintaining", perKg: 1.6, water: 0 },
  build: { label: "Build muscle", short: "Building", perKg: 1.8, water: 300 },
};

const MUSCLES = [
  { id: "Chest", hint: "Press and fly machines" },
  { id: "Back", hint: "Pulldowns and rows" },
  { id: "Legs", hint: "Leg press, curls, extensions" },
  { id: "Shoulders", hint: "Presses and raises" },
  { id: "Arms", hint: "Biceps and triceps" },
  { id: "Core", hint: "Abs and obliques" },
  { id: "Full body", hint: "A bit of everything" },
];
const LEVELS = ["Beginner", "Intermediate", "Advanced"];

const ACTIVITY = {
  sedentary: { label: "Mostly sitting", hint: "Desk job, little exercise", factor: 1.2, water: 0 },
  light: { label: "Lightly active", hint: "Workouts 1-3 days a week", factor: 1.375, water: 250 },
  moderate: { label: "Moderately active", hint: "Workouts 3-5 days a week", factor: 1.55, water: 500 },
  very: { label: "Very active", hint: "Hard training 6-7 days a week", factor: 1.725, water: 750 },
};

// Used if the AI request fails: [exercise, machine, sets x reps]
const FALLBACK = {
  Chest: [["Chest press", "Chest press machine", "3 x 10-12"], ["Pec fly", "Pec deck machine", "3 x 12-15"], ["Incline press", "Smith machine or incline bench", "3 x 8-10"]],
  Back: [["Lat pulldown", "Lat pulldown machine", "3 x 10-12"], ["Seated row", "Seated cable row", "3 x 10-12"], ["Assisted pull-up", "Assisted pull-up machine", "3 x 6-8"]],
  Legs: [["Leg press", "Leg press machine", "3 x 10-12"], ["Leg curl", "Seated leg curl machine", "3 x 12"], ["Leg extension", "Leg extension machine", "3 x 12-15"]],
  Shoulders: [["Shoulder press", "Shoulder press machine", "3 x 10"], ["Lateral raise", "Cable or dumbbells", "3 x 12-15"], ["Rear delt fly", "Reverse pec deck", "3 x 12-15"]],
  Arms: [["Biceps curl", "Cable or preacher curl machine", "3 x 10-12"], ["Triceps pushdown", "Cable station", "3 x 10-12"], ["Dip", "Assisted dip machine", "3 x 8"]],
  Core: [["Crunch", "Ab crunch machine", "3 x 15"], ["Cable woodchop", "Cable station", "3 x 12 per side"], ["Plank", "Mat", "3 x 40 sec"]],
  "Full body": [["Leg press", "Leg press machine", "3 x 10"], ["Chest press", "Chest press machine", "3 x 10"], ["Lat pulldown", "Lat pulldown machine", "3 x 10"], ["Shoulder press", "Shoulder press machine", "2 x 12"]],
};

const ACT_TYPES = {
  walk: { label: "Walk", met: [2.8, 3.8, 5.0], stepKm: 1300, stepMin: 100 },
  run: { label: "Run", met: [7.0, 9.8, 11.8], stepKm: 1100, stepMin: 160 },
  cycle: { label: "Cycle", met: [5.8, 8.0, 10.0], stepKm: 0, stepMin: 0 },
  treadmill: { label: "Treadmill", met: [4.0, 7.0, 10.0], stepKm: 1200, stepMin: 120 },
  cross: { label: "Cross trainer", met: [4.6, 5.5, 7.0], stepKm: 0, stepMin: 0 },
  rower: { label: "Rowing machine", met: [4.8, 7.0, 8.5], stepKm: 0, stepMin: 0 },
  stairs: { label: "Stair climber", met: [5.0, 7.5, 9.0], stepKm: 0, stepMin: 0 },
};
const ACT_LEVELS = ["Easy", "Moderate", "Hard"];

// Extra calories beyond resting (MET - 1), and rough steps for walking-type activities
function calcAct(type, mins, km, lvl, weight) {
  const t = ACT_TYPES[type];
  const kcal = Math.round(Math.max(0, t.met[lvl] - 1) * weight * (mins / 60));
  const steps = t.stepKm || t.stepMin ? Math.round(km > 0 ? km * t.stepKm : mins * t.stepMin) : 0;
  return { kcal, steps };
}

const MEAL_TYPES = ["Breakfast", "Snack", "Lunch", "Dinner"];
// Rough share of the day's food each meal usually takes
const SHARE = { Breakfast: 0.25, Snack: 0.1, Lunch: 0.3, Dinner: 0.35 };

const DEFAULT_STORE = {
  profile: {
    goal: "lose",
    sex: null,
    age: 30,
    height: 170,
    weight: 75,
    targetWeight: 70,
    activity: "light",
    calTarget: 1900,
    proTarget: 150,
    waterTarget: 2500,
    stepTarget: 10000,
    activeTarget: 45,
    trainDays: 3,
    calAdjust: 0,
  },
  setupDone: false,
  days: {},
  recent: [],
  water: {},
  gym: {},
  videos: {},
  act: {},
  steps: {},
  weights: {},
  look: "light",
};

/* ---------- helpers ---------- */
const todayKey = () => new Date().toLocaleDateString("en-CA");
const nowTime = () => new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
const inferType = () => {
  const h = new Date().getHours();
  if (h < 11) return "Breakfast";
  if (h < 15) return "Lunch";
  if (h < 17) return "Snack";
  if (h < 21) return "Dinner";
  return "Snack";
};
const uid = () => Math.random().toString(36).slice(2, 9);
const num = (v) => (Number.isFinite(Number(v)) ? Math.round(Number(v)) : 0);

// Mifflin-St Jeor resting energy, scaled by activity, then adjusted for the goal.
function calcPlan(p) {
  const { weight, height, age, sex, activity, goal } = p;
  if (!weight || !height || !age) return null;
  const bmi = weight / Math.pow(height / 100, 2);
  const bmr = 10 * weight + 6.25 * height - 5 * age + (sex === "male" ? 5 : sex === "female" ? -161 : -78);
  const maintain = bmr * ACTIVITY[activity].factor;
  const floor = sex === "male" ? 1500 : sex === "female" ? 1200 : 1350;
  let target = maintain;
  let floorHit = false;
  let holdBack = false;
  if (goal === "lose") {
    if (bmi < 18.5) {
      holdBack = true;
    } else {
      target = maintain * 0.8;
      if (target < floor) {
        target = floor;
        floorHit = true;
      }
    }
  }
  if (goal === "build") target = maintain * 1.1;
  if (p.calAdjust) target = Math.max(floor, target + p.calAdjust);
  const r = (v, step) => Math.round(v / step) * step;
  const goalWeight = p.targetWeight || weight;
  const diffKg = Math.round((goalWeight - weight) * 10) / 10;
  const kgPerWeek = (Math.abs(maintain - target) * 7) / 7700;
  const directionOk = (goal === "lose" && diffKg < 0) || (goal === "build" && diffKg > 0);
  const weeks = directionOk && kgPerWeek > 0 ? Math.ceil(Math.abs(diffKg) / kgPerWeek) : null;
  return {
    goalWeight,
    diffKg,
    kgPerWeek,
    weeks,
    targetBmi: goalWeight / Math.pow(height / 100, 2),
    bmi,
    bmr: r(bmr, 10),
    maintain: r(maintain, 10),
    calories: r(target, 10),
    protein: Math.round(weight * GOALS[goal].perKg),
    water: r(weight * 33 + ACTIVITY[activity].water + GOALS[goal].water, 50),
    floor,
    floorHit,
    holdBack,
    provisional: !sex,
    adjust: p.calAdjust || 0,
    steps: { lose: 10000, maintain: 8000, build: 7000 }[goal],
    active: { lose: 45, maintain: 30, build: 30 }[goal],
  };
}

const PLAN_KEYS = ["goal", "sex", "age", "height", "weight", "targetWeight", "activity", "calAdjust"];

// Lose if the target is lower, build if it is higher, otherwise maintain
const goalFor = (weight, targetWeight) => {
  const diff = (targetWeight || weight) - weight;
  if (diff <= -1) return "lose";
  if (diff >= 1) return "build";
  return "maintain";
};

const WEEK_DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const CARDIO_COUNT = {
  lose: { Beginner: 2, Intermediate: 3, Advanced: 3 },
  build: { Beginner: 1, Intermediate: 1, Advanced: 2 },
  maintain: { Beginner: 1, Intermediate: 2, Advanced: 2 },
};
const STRENGTH_SLOTS = { 2: [0, 3], 3: [0, 2, 4], 4: [0, 1, 3, 4], 5: [0, 1, 2, 4, 5] };
const STRENGTH_NOTE = {
  lose: "3 sets of 10-15 reps with 45-60 seconds' rest. Keep the weights challenging so you hold on to muscle.",
  build: "3-4 sets of 8-12 reps with about 90 seconds' rest. Add a little weight when the last reps feel easy.",
  maintain: "3 sets of 8-12 reps with 60-90 seconds' rest.",
};
const CARDIO_NOTE = {
  lose: "30-40 minutes of brisk incline walking, cycling or the cross trainer, at a pace where you can still talk.",
  build: "An easy 20-30 minute walk or bike ride to help recovery. Don't overdo it.",
  maintain: "30 minutes of cardio you enjoy.",
};

function focusFor(goal, level, days) {
  const full = (n) => Array(n).fill("Full body");
  if (level === "Beginner" && days <= 4) return full(days);
  if (goal === "lose") {
    if (days <= 3) return full(days);
    if (days === 4) return ["Full body", "Legs", "Full body", "Core"];
    return ["Full body", "Legs", "Chest", "Back", "Core"];
  }
  const split = {
    2: ["Full body", "Full body"],
    3: ["Chest", "Back", "Legs"],
    4: ["Chest", "Back", "Legs", "Shoulders"],
    5: ["Chest", "Back", "Legs", "Shoulders", "Arms"],
  };
  return split[days];
}

function weeklyPlan(goal, level, days = 3) {
  const focus = focusFor(goal, level, Math.min(5, Math.max(2, days)));
  const slots = STRENGTH_SLOTS[focus.length];
  const cardioN = Math.min(CARDIO_COUNT[goal][level], 6 - focus.length);
  const cardioSlots = [5, 1, 3, 6, 2, 4, 0].filter((d) => !slots.includes(d)).slice(0, cardioN);
  return WEEK_DAYS.map((day, i) => {
    const si = slots.indexOf(i);
    if (si >= 0) {
      const f = focus[si];
      return { day, kind: "strength", focus: f, title: f === "Full body" ? "Full body strength" : `${f} strength`, detail: STRENGTH_NOTE[goal] };
    }
    if (cardioSlots.includes(i)) return { day, kind: "cardio", title: "Cardio", detail: CARDIO_NOTE[goal] };
    return { day, kind: "rest", title: "Rest", detail: "Rest, or a gentle walk and some stretching." };
  });
}

function bmiLabel(b) {
  if (b < 18.5) return "underweight range";
  if (b < 25) return "healthy weight range";
  if (b < 30) return "overweight range";
  return "obesity range";
}

async function prepImage(file) {
  const url = URL.createObjectURL(file);
  const img = await new Promise((res, rej) => {
    const i = new Image();
    i.onload = () => res(i);
    i.onerror = rej;
    i.src = url;
  });
  const s = Math.min(1, 1024 / Math.max(img.width, img.height));
  const c = document.createElement("canvas");
  c.width = Math.round(img.width * s);
  c.height = Math.round(img.height * s);
  c.getContext("2d").drawImage(img, 0, 0, c.width, c.height);
  const dataUrl = c.toDataURL("image/jpeg", 0.8);
  URL.revokeObjectURL(url);
  return { preview: dataUrl, data: dataUrl.split(",")[1] };
}

// One place that talks to /api/claude. Throws an Error whose message is a
// plain reason the user can act on (missing key, no credit, timeout, offline).
async function callClaude(system, content) {
  let response;
  try {
    response = await fetch("/api/claude", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ system, messages: [{ role: "user", content }] }),
    });
  } catch {
    throw new Error("You seem to be offline. Check your connection and try again.");
  }
  const raw = await response.text();
  let data = null;
  try {
    data = JSON.parse(raw);
  } catch {}
  if (!response.ok || !data) {
    const reason =
      (data && (typeof data.error === "string" ? data.error : data.error?.message)) ||
      (response.status === 404 ? "The AI service isn't deployed. Check the Netlify functions setup." : "") ||
      (response.status === 502 || response.status === 504 ? "The AI took too long to answer. Try again." : "") ||
      `The AI service returned an error (${response.status}).`;
    throw new Error(reason);
  }
  const text = (data.content || []).map((b) => (b.type === "text" ? b.text : "")).join("").trim();
  if (!text) throw new Error("The AI sent back an empty answer. Try again.");
  return text;
}

async function askClaude(system, content) {
  const text = await callClaude(system, content);
  const cleaned = text.replace(/```json|```/g, "").trim();
  try {
    return JSON.parse(cleaned);
  } catch {}
  // Pull the first JSON object or array out of any surrounding words
  const m = cleaned.match(/[\[{][\s\S]*[\]}]/);
  if (m) {
    try {
      return JSON.parse(m[0]);
    } catch {}
  }
  throw new Error("The AI's answer couldn't be read. Try again, or add a short description.");
}

async function askClaudeText(system, content) {
  return callClaude(system, content);
}

/* ---------- small UI pieces ---------- */
function BottomSheet({ title, icon, onClose, children }) {
  return (
    <div className="fixed inset-0 flex items-end justify-center" style={{ background: "rgba(20,6,34,0.55)", zIndex: 50 }} onClick={onClose}>
      <div
        role="dialog"
        aria-label={title}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md p-5 flex flex-col gap-4 overflow-y-auto"
        style={{
          background: "var(--card)",
          borderTopLeftRadius: 28,
          borderTopRightRadius: 28,
          maxHeight: "92dvh",
          overscrollBehavior: "contain",
          paddingBottom: "calc(20px + env(safe-area-inset-bottom))",
        }}
      >
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold flex items-center gap-2" style={{ color: "var(--pine)" }}>
            {icon}
            {title}
          </h2>
          <button onClick={onClose} aria-label="Close" style={{ padding: 8, color: "var(--muted)" }}>
            <X size={22} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

const card = { background: CARD, border: `1px solid ${LINE}`, borderRadius: 24, boxShadow: "var(--card-shadow)" };
const inputStyle = { background: CARD, border: `1.5px solid ${LINE}`, color: INK, borderRadius: 14 };

function Ring({ value, target, color, size = 196 }) {
  const r = 80;
  const circ = 2 * Math.PI * r;
  const pct = target ? Math.min(1, value / target) : 0;
  return (
    <svg width={size} height={size} viewBox="0 0 200 200" role="img" aria-label={`${value} of ${target} grams of protein`}>
      <circle cx="100" cy="100" r={r} fill="none" strokeWidth="16" style={{ stroke: TROUGH }} />
      <circle
        cx="100"
        cy="100"
        r={r}
        fill="none"
        strokeWidth="16"
        strokeLinecap="round"
        strokeDasharray={circ}
        strokeDashoffset={circ * (1 - pct)}
        transform="rotate(-90 100 100)"
        style={{ stroke: color, transition: "stroke-dashoffset 600ms ease" }}
      />
    </svg>
  );
}

function Seg({ options, value, onChange, label }) {
  return (
    <div className="flex p-1 gap-1" role="group" aria-label={label} style={{ background: SEGBG, borderRadius: 16 }}>
      {options.map((o) => {
        const active = value === o.value;
        return (
          <button
            key={o.value}
            onClick={() => onChange(o.value)}
            aria-pressed={active}
            className="flex-1 py-2 font-semibold text-sm"
            style={{
              borderRadius: 12,
              background: active ? CARD : "transparent",
              color: active ? PINE : MUTED,
              boxShadow: active ? "var(--seg-shadow)" : "none",
            }}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

function Stepper({ label, value, step, unit, onChange, color, min = 0, max = 100000 }) {
  const decimals = step % 1 !== 0 ? 1 : 0;
  const factor = Math.pow(10, decimals);
  const clamp = (v) => Math.min(max, Math.max(min, Math.round(v * factor) / factor));
  const [draft, setDraft] = useState(null);

  const commit = () => {
    if (draft === null) return;
    const n = parseFloat(String(draft).replace(",", "."));
    if (Number.isFinite(n) && clamp(n) !== value) onChange(clamp(n));
    setDraft(null);
  };

  const btn = { width: 44, height: 44, borderRadius: 14, background: BTNBG, color: PINE };
  return (
    <div className="flex items-center justify-between gap-2 py-3">
      <div className="min-w-0">
        <div className="font-semibold">{label}</div>
        <div className="text-sm" style={{ color: MUTED }}>{unit}</div>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <button style={btn} onClick={() => onChange(clamp(value - step))} aria-label={`Decrease ${label}`} className="flex items-center justify-center">
          <Minus size={18} />
        </button>
        <input
          type="text"
          inputMode={decimals ? "decimal" : "numeric"}
          value={draft ?? String(value)}
          onFocus={(e) => {
            setDraft(String(value));
            e.target.select();
          }}
          onChange={(e) => setDraft(e.target.value.replace(/[^0-9.,]/g, ""))}
          onBlur={commit}
          onKeyDown={(e) => {
            if (e.key === "Enter") e.currentTarget.blur();
          }}
          aria-label={`${label} (${unit}). Type a number or use the plus and minus buttons`}
          className="text-2xl font-bold text-center outline-none"
          style={{ width: 84, height: 44, color, background: PANEL, border: `1.5px solid ${LINE}`, borderRadius: 12 }}
        />
        <button style={btn} onClick={() => onChange(clamp(value + step))} aria-label={`Increase ${label}`} className="flex items-center justify-center">
          <Plus size={18} />
        </button>
      </div>
    </div>
  );
}

/* ---------- gym machine library ---------- */
const MUSCLE_LABEL = {
  chest: "Chest", shoulders: "Shoulders", back: "Back", biceps: "Biceps", triceps: "Triceps",
  abs: "Abs", glutes: "Glutes", quads: "Quads", hamstrings: "Hamstrings", calves: "Calves",
};
const GROUP_OF = {
  chest: "Chest", shoulders: "Shoulders", back: "Back", biceps: "Arms", triceps: "Arms",
  abs: "Core", glutes: "Glutes", quads: "Legs", hamstrings: "Legs", calves: "Legs",
};
const MACHINE_FILTERS = ["All", "Lower body", "Upper body", "Core", "Glutes", "Legs", "Chest", "Back", "Shoulders", "Arms"];

const MACHINES = [
  {
    id: "leg-press", name: "Leg press machine", body: "Lower body", primary: ["quads", "glutes"], secondary: ["hamstrings"],
    does: "Builds strong thighs and glutes while your back is supported, so you can load the legs heavily and safely.",
    steps: ["Sit back with your back and hips flat against the pad.", "Place your feet shoulder-width apart, mid-height on the platform.", "Release the safety handles and lower the platform until your knees reach about 90 degrees.", "Press through your heels until your legs are almost straight, without locking your knees."],
    setsMin: 3, setsMax: 4, repsMin: 8, repsMax: 12, rest: 90,
    tip: "Keep your hips on the seat and your knees pointing the same way as your toes.",
  },
  {
    id: "leg-extension", name: "Leg extension machine", body: "Lower body", primary: ["quads"], secondary: [],
    does: "Isolates the front of the thigh to build quad size and support the knees.",
    steps: ["Adjust the seat so your knees line up with the machine's pivot point.", "Hook your ankles under the pad and hold the side handles.", "Extend your legs until almost straight and squeeze your quads for a second.", "Lower slowly over about 3 seconds."],
    setsMin: 3, setsMax: 4, repsMin: 10, repsMax: 15, rest: 60,
    tip: "Line your knees up with the pivot, keep the weight light enough that your knees stay comfortable, and control the lowering phase instead of dropping the weight.",
  },
  {
    id: "leg-curl", name: "Seated leg curl machine", body: "Lower body", primary: ["hamstrings"], secondary: ["calves"],
    does: "Strengthens the back of the thigh, which balances your quads and helps protect your knees.",
    steps: ["Adjust the back pad so your knees line up with the pivot.", "Set the thigh pad snugly on top of your legs, with the ankle pad just above your heels.", "Curl your heels down and back toward you.", "Return slowly until your legs are almost straight."],
    setsMin: 3, setsMax: 4, repsMin: 10, repsMax: 15, rest: 60,
    tip: "Keep your hips pressed into the seat the whole time.",
  },
  {
    id: "hip-thrust", name: "Glute drive (hip thrust) machine", body: "Lower body", primary: ["glutes"], secondary: ["hamstrings"],
    does: "One of the most direct ways to build and shape the glutes, and it improves hip power for running and lifting.",
    steps: ["Sit on the floor with your upper back against the pad and the belt across your hips.", "Place your feet flat, about shoulder-width apart.", "Drive your hips up until your body forms a straight line from shoulders to knees.", "Squeeze your glutes for a second, then lower with control."],
    setsMin: 3, setsMax: 4, repsMin: 8, repsMax: 12, rest: 90,
    tip: "Tuck your chin and keep your ribs down so the work stays in your glutes, not your lower back.",
  },
  {
    id: "hip-abduction", name: "Hip abduction machine", body: "Lower body", primary: ["glutes"], secondary: [],
    does: "Targets the outer glutes and hips for stability, and adds shape to the sides of the glutes.",
    steps: ["Sit upright with the pads on the outside of your knees.", "Push your legs apart smoothly, as wide as is comfortable.", "Pause for a second at the widest point.", "Bring your legs back slowly without letting the weights touch down."],
    setsMin: 2, setsMax: 3, repsMin: 12, repsMax: 20, rest: 45,
    tip: "Leaning slightly forward from the hips helps you feel it more in the glutes.",
  },
  {
    id: "calf-raise", name: "Calf raise machine", body: "Lower body", primary: ["calves"], secondary: [],
    does: "Builds the calves for stronger ankles, better balance and more power when you walk, run or jump.",
    steps: ["Stand with the balls of your feet on the platform and your shoulders under the pads.", "Lower your heels as far as is comfortable for a good stretch.", "Rise as high as you can on your toes.", "Pause at the top, then lower slowly."],
    setsMin: 3, setsMax: 4, repsMin: 12, repsMax: 20, rest: 45,
    tip: "Use the full range of motion. Short bounces do very little.",
  },
  {
    id: "chest-press", name: "Chest press machine", body: "Upper body", primary: ["chest"], secondary: ["shoulders", "triceps"],
    does: "Builds the chest, front shoulders and triceps with a guided pushing motion. A great starting point for beginners.",
    steps: ["Adjust the seat so the handles sit at mid-chest height.", "Sit tall with your back flat on the pad and your feet on the floor.", "Push the handles forward until your arms are almost straight.", "Return slowly until you feel a stretch across your chest."],
    setsMin: 3, setsMax: 4, repsMin: 8, repsMax: 12, rest: 90,
    tip: "Keep your shoulder blades pulled back against the pad.",
  },
  {
    id: "pec-deck", name: "Pec deck (chest fly) machine", body: "Upper body", primary: ["chest"], secondary: ["shoulders"],
    does: "Isolates the chest by bringing the arms together, which adds width and definition.",
    steps: ["Set the seat so the handles are at chest height.", "Sit with your back flat and a slight bend in your elbows.", "Bring the handles together in front of your chest and squeeze.", "Open slowly, only as far as a comfortable chest stretch."],
    setsMin: 3, setsMax: 3, repsMin: 12, repsMax: 15, rest: 60,
    tip: "Move your arms like a hug. Don't let your shoulders roll forward.",
  },
  {
    id: "shoulder-press", name: "Shoulder press machine", body: "Upper body", primary: ["shoulders"], secondary: ["triceps"],
    does: "Builds rounded, strong shoulders and helps with every pushing and overhead movement.",
    steps: ["Adjust the seat so the handles start at about shoulder height.", "Sit tall with your back against the pad.", "Press the handles overhead until your arms are almost straight.", "Lower slowly back to shoulder height."],
    setsMin: 3, setsMax: 4, repsMin: 8, repsMax: 12, rest: 90,
    tip: "Don't arch your lower back as you press.",
  },
  {
    id: "lat-pulldown", name: "Lat pulldown machine", body: "Upper body", primary: ["back"], secondary: ["biceps"],
    does: "Widens the back and builds pulling strength. It's a good stepping stone toward pull-ups.",
    steps: ["Adjust the thigh pad so your legs are held firmly in place.", "Grip the bar a little wider than your shoulders.", "Lean back slightly and pull the bar to your upper chest by driving your elbows down.", "Let the bar rise slowly until your arms are straight."],
    setsMin: 3, setsMax: 4, repsMin: 8, repsMax: 12, rest: 90,
    tip: "Don't swing your body or pull the bar behind your neck.",
  },
  {
    id: "seated-row", name: "Seated cable row", body: "Upper body", primary: ["back"], secondary: ["biceps", "shoulders"],
    does: "Builds the middle back and improves posture by strengthening the muscles between your shoulder blades.",
    steps: ["Sit with your feet on the plates and your knees slightly bent.", "Sit tall and take hold of the handle.", "Pull the handle to your lower ribs and squeeze your shoulder blades together.", "Return slowly until your arms are straight."],
    setsMin: 3, setsMax: 4, repsMin: 10, repsMax: 12, rest: 75,
    tip: "Keep your chest up and avoid rocking back and forth.",
  },
  {
    id: "assisted-pullup", name: "Assisted pull-up machine", body: "Upper body", primary: ["back"], secondary: ["biceps"],
    does: "Lets you build up to full pull-ups by taking some of your body weight off.",
    steps: ["Choose the assistance weight. More weight makes it easier.", "Kneel or stand on the platform and grip the bars.", "Pull your chest toward the bar.", "Lower yourself slowly until your arms are straight."],
    setsMin: 3, setsMax: 3, repsMin: 6, repsMax: 10, rest: 90,
    tip: "Lower the assistance gradually as you get stronger.",
  },
  {
    id: "biceps-curl", name: "Biceps curl machine", body: "Upper body", primary: ["biceps"], secondary: [],
    does: "Builds the front of the upper arm for stronger pulling and carrying.",
    steps: ["Adjust the seat so your upper arms rest flat on the pad.", "Grip the handles with your palms facing up.", "Curl up and squeeze at the top.", "Lower slowly until your arms are almost straight."],
    setsMin: 3, setsMax: 3, repsMin: 10, repsMax: 15, rest: 60,
    tip: "Keep your elbows on the pad and don't lean back.",
  },
  {
    id: "triceps-pushdown", name: "Triceps pushdown (cable)", body: "Upper body", primary: ["triceps"], secondary: [],
    does: "Builds the back of the upper arm, which helps with every pushing movement.",
    steps: ["Face the cable with the bar at chest height and your elbows tucked at your sides.", "Push the bar down until your arms are straight.", "Squeeze your triceps for a second.", "Let the bar rise until your forearms are just past 90 degrees."],
    setsMin: 3, setsMax: 3, repsMin: 10, repsMax: 15, rest: 60,
    tip: "Keep your elbows pinned to your sides and don't lean over the bar.",
  },
  {
    id: "ab-crunch", name: "Ab crunch machine", body: "Core", primary: ["abs"], secondary: [],
    does: "Strengthens the abdominal muscles for a stronger core and better posture.",
    steps: ["Adjust the seat so the machine's pivot lines up with your waist.", "Hold the handles close to your chest.", "Curl your torso forward by bringing your ribs toward your hips.", "Return slowly without letting the weights rest."],
    setsMin: 3, setsMax: 3, repsMin: 12, repsMax: 20, rest: 45,
    tip: "Exhale as you crunch and don't pull with your arms.",
  },
  {
    id: "cable-woodchop", name: "Cable woodchop", body: "Core", primary: ["abs"], secondary: ["shoulders"],
    does: "Builds rotational core strength, which helps with sport, daily movement and a stable spine.",
    steps: ["Set the cable high and stand side-on to the machine.", "Hold the handle with both hands and arms mostly straight.", "Rotate and pull diagonally down across your body, turning hips and shoulders together.", "Return with control, then repeat on the other side."],
    setsMin: 3, setsMax: 3, repsMin: 10, repsMax: 12, rest: 45,
    tip: "Rotate from your torso, not your arms. Reps are per side.",
  },
];

// Shapes that light up on the body map, per view
const SHAPES = {
  front: {
    chest: [["e", 43, 42, 8, 7], ["e", 57, 42, 8, 7]],
    shoulders: [["e", 28, 34, 6, 7], ["e", 72, 34, 6, 7]],
    biceps: [["r", 22, 38, 8, 18, 4], ["r", 70, 38, 8, 18, 4]],
    abs: [["r", 43, 54, 14, 24, 5]],
    quads: [["r", 35, 88, 13, 46, 6], ["r", 52, 88, 13, 46, 6]],
  },
  back: {
    back: [["r", 37, 33, 26, 32, 10]],
    shoulders: [["e", 28, 34, 6, 7], ["e", 72, 34, 6, 7]],
    triceps: [["r", 22, 38, 8, 18, 4], ["r", 70, 38, 8, 18, 4]],
    glutes: [["e", 43, 88, 8, 8], ["e", 57, 88, 8, 8]],
    hamstrings: [["r", 35, 98, 13, 40, 6], ["r", 52, 98, 13, 40, 6]],
    calves: [["r", 36, 146, 11, 34, 5], ["r", 53, 146, 11, 34, 5]],
  },
};

function BodyMap({ primary, secondary }) {
  const base = LINE;
  const fig = (view, dx) => (
    <g transform={`translate(${dx},0)`}>
      <circle cx="50" cy="14" r="9" style={{ fill: base }} />
      <rect x="46" y="22" width="8" height="6" style={{ fill: base }} />
      <rect x="33" y="28" width="34" height="56" rx="12" style={{ fill: base }} />
      <rect x="21" y="32" width="10" height="32" rx="5" style={{ fill: base }} />
      <rect x="69" y="32" width="10" height="32" rx="5" style={{ fill: base }} />
      <rect x="22" y="64" width="8" height="30" rx="4" style={{ fill: base }} />
      <rect x="70" y="64" width="8" height="30" rx="4" style={{ fill: base }} />
      <rect x="34" y="84" width="15" height="56" rx="7" style={{ fill: base }} />
      <rect x="51" y="84" width="15" height="56" rx="7" style={{ fill: base }} />
      <rect x="35" y="142" width="12" height="50" rx="6" style={{ fill: base }} />
      <rect x="53" y="142" width="12" height="50" rx="6" style={{ fill: base }} />
      {Object.entries(SHAPES[view]).map(([muscle, shapes]) => {
        const isP = primary.includes(muscle);
        const isS = secondary.includes(muscle);
        if (!isP && !isS) return null;
        return shapes.map((sh, i) =>
          sh[0] === "e" ? (
            <ellipse key={muscle + i} cx={sh[1]} cy={sh[2]} rx={sh[3]} ry={sh[4]} opacity={isP ? 0.95 : 0.35} style={{ fill: PROTEIN }} />
          ) : (
            <rect key={muscle + i} x={sh[1]} y={sh[2]} width={sh[3]} height={sh[4]} rx={sh[5]} opacity={isP ? 0.95 : 0.35} style={{ fill: PROTEIN }} />
          )
        );
      })}
    </g>
  );
  return (
    <svg viewBox="0 0 200 208" role="img" aria-label="Body map of the muscles this machine works" style={{ width: "100%", maxWidth: 240 }}>
      {fig("front", 0)}
      {fig("back", 100)}
      <text x="50" y="205" textAnchor="middle" fontSize="9" style={{ fill: MUTED }}>Front</text>
      <text x="150" y="205" textAnchor="middle" fontSize="9" style={{ fill: MUTED }}>Back</text>
    </svg>
  );
}

const fmt = (sec) => {
  const t = Math.max(0, Math.round(sec));
  return `${Math.floor(t / 60)}:${String(t % 60).padStart(2, "0")}`;
};
const videoUrl = (name) => `https://www.youtube.com/results?search_query=${encodeURIComponent(name + " how to use proper form")}`;

/* ---------- machine illustrations ---------- */
const ART_FRAME = "var(--art-frame)";
const ART_PAD = "var(--art-pad)";
const ART_PLATE = "var(--art-plate)";
const ART_HEAD = "var(--art-head)";
const GROUND = 168;
const SEG = { torso: 40, thigh: 34, shin: 33, ua: 23, fa: 22 };
const rad = (d) => (d * Math.PI) / 180;
const lerp = (a, b, p) => a + (b - a) * p;
const along = (o, len, deg) => [o[0] + len * Math.cos(rad(deg)), o[1] + len * Math.sin(rad(deg))];

// Side-view machines. Angles are degrees, 0 = right, 90 = down, -90 = up.
// t torso, th thigh, sn shin, ua upper arm, fa forearm, ft foot. A = start pose, B = end of the lift.
const SIDE = {
  "leg-press": {
    hip: [70, 118], seat: true, back: true,
    A: { t: -110, th: -60, sn: 55, ua: 70, fa: 20, ft: -80 },
    B: { th: -8, sn: -5 },
    pads: [{ at: "ankle", dx: 9, dy: -4, w: 6, h: 46, r: 3, drop: 152 }],
    statics: [["L", 96, 152, 175, 152, 4, ART_FRAME]],
  },
  "leg-extension": {
    hip: [90, 128], seat: true, back: true,
    A: { t: -95, th: 0, sn: 90, ua: 80, fa: 10, ft: 0 },
    B: { sn: -8, ft: -55 },
    stack: { x: 22, y: 70, h: 90, travel: 22 },
    links: [{ from: [118, 148], to: "ankle" }],
    pads: [{ at: "ankle", dx: 0, dy: -6, w: 12, h: 9, r: 4 }],
  },
  "leg-curl": {
    hip: [90, 126], seat: true, back: true,
    A: { t: -100, th: 0, sn: -6, ua: 80, fa: 10, ft: -50 },
    B: { sn: 95, ft: 0 },
    stack: { x: 22, y: 70, h: 90, travel: 22 },
    links: [{ from: [122, 150], to: "ankle" }],
    pads: [{ at: "ankle", dx: 0, dy: 6, w: 12, h: 9, r: 4 }],
    statics: [["L", 98, 118, 126, 118, 7, ART_PAD]],
  },
  "hip-thrust": {
    hip: [100, 150],
    A: { hx: 100, hy: 150, t: 211, th: -30, sn: 85, ua: 30, fa: 0, ft: 0 },
    B: { hx: 100, hy: 125, t: 172, th: 14 },
    pads: [{ at: "hip", dx: 0, dy: -7, w: 20, h: 7, r: 3 }],
    statics: [["R", 40, 128, 26, 14, 6, ART_PAD], ["L", 53, 142, 53, GROUND, 6, ART_FRAME], ["L", 160, 168, 160, 120, 5, ART_FRAME]],
  },
  "calf-raise": {
    hip: [110, 93],
    A: { hx: 110, hy: 93, t: -90, th: 90, sn: 90, ua: 90, fa: 95, ft: 0 },
    B: { hx: 112.5, hy: 85, ft: 35 },
    links: [{ from: [136, 42], to: "sho" }],
    pads: [{ at: "sho", dx: 0, dy: -5, w: 22, h: 8, r: 4 }],
    statics: [["R", 96, 161, 46, 7, 3, ART_PAD], ["L", 136, GROUND, 136, 30, 6, ART_FRAME]],
  },
  "chest-press": {
    hip: [92, 128], seat: true, back: true,
    A: { t: -92, th: 0, sn: 90, ua: 110, fa: -12 },
    B: { ua: -8, fa: -6 },
    stack: { x: 22, y: 70, h: 90, travel: 22 },
    links: [{ from: [156, 134], to: "wrist" }],
    handles: ["wrist"],
  },
  "shoulder-press": {
    hip: [92, 128], seat: true, back: true,
    A: { t: -92, th: 0, sn: 90, ua: 110, fa: -80 },
    B: { ua: -80, fa: -85 },
    stack: { x: 22, y: 70, h: 90, travel: 22 },
    links: [{ from: [130, 104], to: "wrist" }],
    handles: ["wrist"],
  },
  "lat-pulldown": {
    hip: [92, 128], seat: true, back: true,
    A: { t: -100, th: -8, sn: 95, ua: -70, fa: -75 },
    B: { ua: 95, fa: -60 },
    stack: { x: 22, y: 70, h: 90, travel: 22 },
    links: [{ from: [112, 16], to: "wrist" }],
    handles: ["wrist"],
    statics: [["L", 150, GROUND, 150, 10, 6, ART_FRAME], ["L", 150, 10, 112, 10, 5, ART_FRAME], ["L", 112, 128, 134, 120, 7, ART_PAD], ["L", 115, 120, 138, 112, 7, ART_PAD]],
  },
  "seated-row": {
    hip: [78, 130], seat: true,
    A: { t: -76, th: -20, sn: 15, ua: 8, fa: 5, ft: -60 },
    B: { t: -96, ua: 112, fa: 3 },
    stack: { x: 200, y: 70, h: 90, travel: 22 },
    links: [{ from: [190, 112], to: "wrist" }],
    handles: ["wrist"],
    statics: [["L", 62, 140, 160, 140, 6, ART_FRAME], ["L", 152, 100, 152, 142, 6, ART_PAD]],
  },
  "assisted-pullup": {
    hip: [106, 125],
    A: { hx: 106.4, hy: 125, t: -92, th: 88, sn: 178, ua: -90, fa: -90, ft: 180 },
    B: { hx: 106.4, hy: 102, ua: -148, fa: -27 },
    pads: [{ at: "knee", dx: 2, dy: 5, w: 28, h: 6, r: 3, drop: GROUND }],
    handles: ["wrist"],
    statics: [["L", 150, GROUND, 150, 28, 6, ART_FRAME], ["L", 150, 30, 98, 30, 5, ART_FRAME], ["L", 105, 30, 105, 40, 3, ART_FRAME]],
  },
  "biceps-curl": {
    hip: [85, 130], seat: true,
    A: { t: -80, th: 0, sn: 90, ua: 55, fa: 45 },
    B: { fa: -95 },
    stack: { x: 22, y: 70, h: 90, travel: 22 },
    links: [{ from: [130, 128], to: "wrist" }],
    handles: ["wrist"],
    statics: [["L", 88, 94, 112, 124, 8, ART_PAD], ["L", 112, 124, 124, GROUND, 6, ART_FRAME]],
  },
  "triceps-pushdown": {
    hip: [100, 100],
    A: { t: -85, th: 88, sn: 92, ua: 95, fa: -35, ft: 0 },
    B: { fa: 60 },
    links: [{ from: [128, 24], to: "wrist" }],
    handles: ["wrist"],
    statics: [["L", 146, GROUND, 146, 16, 6, ART_FRAME], ["L", 146, 16, 122, 16, 5, ART_FRAME]],
  },
  "ab-crunch": {
    hip: [95, 128], seat: true, back: true,
    A: { t: -92, th: -5, sn: 90, ua: 60, fa: -100 },
    B: { t: -55 },
    stack: { x: 22, y: 70, h: 90, travel: 22 },
    links: [{ from: [118, 152], to: "sho" }],
    pads: [{ at: "sho", dx: 12, dy: 6, w: 9, h: 28, r: 4 }],
  },
};

function buildSide(spec, p) {
  const A = spec.A, B = spec.B;
  const v = (k, d) => lerp(A[k] ?? B[k] ?? d, B[k] ?? A[k] ?? d, p);
  const hip = [lerp(A.hx ?? spec.hip[0], B.hx ?? spec.hip[0], p), lerp(A.hy ?? spec.hip[1], B.hy ?? spec.hip[1], p)];
  const t = v("t", -90);
  const sho = along(hip, SEG.torso, t);
  const knee = along(hip, SEG.thigh, v("th", 0));
  const ankle = along(knee, SEG.shin, v("sn", 90));
  const elbow = along(sho, SEG.ua, v("ua", 90));
  const wrist = along(elbow, SEG.fa, v("fa", 90));
  const toe = along(ankle, 13, v("ft", 0));
  const head = along(sho, 18, t);
  const J = { hip, sho, knee, ankle, elbow, wrist, toe, head };

  const moving = [];
  (spec.links || []).forEach((l) => moving.push(["L", l.from[0], l.from[1], J[l.to][0], J[l.to][1], 4, PROTEIN]));
  moving.push(["L", hip[0], hip[1], sho[0], sho[1], 15, PINE]);
  moving.push(["L", hip[0], hip[1], knee[0], knee[1], 11, PINE]);
  moving.push(["L", knee[0], knee[1], ankle[0], ankle[1], 9, PINE]);
  moving.push(["L", ankle[0], ankle[1], toe[0], toe[1], 7, PINE]);
  moving.push(["L", sho[0], sho[1], elbow[0], elbow[1], 8, PINE]);
  moving.push(["L", elbow[0], elbow[1], wrist[0], wrist[1], 7, PINE]);
  moving.push(["C", head[0], head[1], 9, ART_HEAD]);
  (spec.pads || []).forEach((q) => {
    const c = [J[q.at][0] + (q.dx || 0), J[q.at][1] + (q.dy || 0)];
    if (q.drop) moving.push(["L", c[0], c[1], c[0], q.drop, 4, ART_FRAME]);
    moving.push(["R", c[0] - q.w / 2, c[1] - q.h / 2, q.w, q.h, q.r, PROTEIN]);
  });
  (spec.handles || []).forEach((h) => moving.push(["C", J[h][0], J[h][1], 4.5, PROTEIN]));
  if (spec.stack) {
    const s = spec.stack;
    moving.push(["R", s.x - 1, s.y + s.h - 12 - s.travel * p, 18, 8, 2, PROTEIN]);
  }

  const statics = [["L", 14, GROUND, 226, GROUND, 3, ART_FRAME]];
  if (spec.stack) {
    const s = spec.stack;
    statics.push(["R", s.x, s.y, 16, s.h, 3, ART_PLATE]);
    for (let i = 1; i < s.h / 9; i++) statics.push(["L", s.x + 1, s.y + 9 * i, s.x + 15, s.y + 9 * i, 1, ART_FRAME]);
  }
  const hipA = [A.hx ?? spec.hip[0], A.hy ?? spec.hip[1]];
  if (spec.seat) {
    statics.push(["L", hipA[0] - 17, hipA[1] + 9, hipA[0] + 15, hipA[1] + 9, 7, ART_PAD]);
    statics.push(["L", hipA[0] - 1, hipA[1] + 12, hipA[0] - 1, GROUND, 5, ART_FRAME]);
  }
  if (spec.back) {
    const tA = A.t ?? -90;
    const u = [Math.cos(rad(tA)), Math.sin(rad(tA))];
    const n = [Math.sin(rad(tA)), -Math.cos(rad(tA))];
    const a = [hipA[0] + n[0] * 10 + u[0] * 4, hipA[1] + n[1] * 10 + u[1] * 4];
    const b = [hipA[0] + n[0] * 10 + u[0] * 40, hipA[1] + n[1] * 10 + u[1] * 40];
    statics.push(["L", a[0], a[1], b[0], b[1], 7, ART_PAD]);
    statics.push(["L", a[0], a[1], a[0] - 4, GROUND, 5, ART_FRAME]);
  }
  (spec.links || []).forEach((l) => statics.push(["C", l.from[0], l.from[1], 4, ART_FRAME]));
  (spec.statics || []).forEach((q) => statics.push(q));
  return { statics, moving };
}

// Front-view machines
const FRONT = {
  "hip-abduction": (p) => {
    const cx = 120, hy = 122, sy = 80, k = lerp(18, 40, p);
    const statics = [["L", 40, GROUND, 200, GROUND, 3, ART_FRAME], ["R", cx - 26, hy + 6, 52, 10, 4, ART_PAD], ["L", cx, hy + 16, cx, GROUND, 6, ART_FRAME], ["R", cx - 13, sy - 8, 26, 54, 6, ART_PAD]];
    const m = [];
    [-1, 1].forEach((s) => {
      m.push(["L", cx + s * 7, hy, cx + s * k, hy + 8, 9, PINE]);
      m.push(["L", cx + s * k, hy + 8, cx + s * (k + 3), hy + 44, 8, PINE]);
      m.push(["L", cx + s * (k + 3), hy + 44, cx + s * (k + 12), hy + 46, 6, PINE]);
      m.push(["L", cx + s * 14, sy, cx + s * 21, sy + 24, 6, PINE]);
      m.push(["L", cx + s * 21, sy + 24, cx + s * 23, hy - 2, 6, PINE]);
    });
    m.push(["L", cx, hy, cx, sy, 18, PINE], ["L", cx - 14, sy, cx + 14, sy, 8, PINE], ["C", cx, sy - 16, 9, ART_HEAD]);
    [-1, 1].forEach((s) => m.push(["R", cx + s * (k + 7) - 4, hy - 4, 8, 28, 4, PROTEIN]));
    return { statics, moving: m };
  },
  "pec-deck": (p) => {
    const cx = 120, hy = 126, sy = 82, e = lerp(44, 14, p);
    const statics = [["L", 40, GROUND, 200, GROUND, 3, ART_FRAME], ["R", cx - 26, hy + 6, 52, 10, 4, ART_PAD], ["L", cx, hy + 16, cx, GROUND, 6, ART_FRAME], ["R", cx - 15, sy - 8, 30, 58, 6, ART_PAD]];
    const m = [];
    [-1, 1].forEach((s) => {
      m.push(["L", cx + s * 7, hy, cx + s * 16, hy + 8, 9, PINE]);
      m.push(["L", cx + s * 16, hy + 8, cx + s * 17, hy + 40, 8, PINE]);
      m.push(["L", cx + s * 17, hy + 40, cx + s * 26, hy + 42, 6, PINE]);
      m.push(["L", cx + s * 14, sy, cx + s * e, sy + 4, 7, PINE]);
      m.push(["L", cx + s * e, sy + 4, cx + s * e, sy - 20, 6, PINE]);
    });
    m.push(["L", cx, hy, cx, sy, 18, PINE], ["L", cx - 14, sy, cx + 14, sy, 8, PINE], ["C", cx, sy - 17, 9, ART_HEAD]);
    [-1, 1].forEach((s) => m.push(["R", cx + s * e - 4, sy - 28, 8, 40, 4, PROTEIN]));
    return { statics, moving: m };
  },
  "cable-woodchop": (p) => {
    const cx = 130, hy = 104, sy = 62;
    const tilt = lerp(-5, 5, p);
    const w = [lerp(cx - 32, cx + 26, p), lerp(30, 104, p)];
    const pulley = [cx - 62, 24];
    const statics = [["L", 40, GROUND, 210, GROUND, 3, ART_FRAME], ["L", cx - 72, GROUND, cx - 72, 18, 6, ART_FRAME], ["L", cx - 72, 20, pulley[0], 20, 5, ART_FRAME], ["C", pulley[0], pulley[1], 5, ART_FRAME]];
    const m = [["L", pulley[0], pulley[1], w[0], w[1], 3, PROTEIN]];
    [-1, 1].forEach((s) => {
      m.push(["L", cx + s * 7, hy, cx + s * 13, hy + 32, 9, PINE]);
      m.push(["L", cx + s * 13, hy + 32, cx + s * 15, GROUND - 4, 8, PINE]);
      m.push(["L", cx + s * 15, GROUND - 4, cx + s * 24, GROUND - 4, 6, PINE]);
    });
    m.push(["L", cx, hy, cx + tilt, sy, 20, PINE], ["C", cx + tilt, sy - 17, 9, ART_HEAD]);
    [-1, 1].forEach((s) => m.push(["L", cx + tilt + s * 14, sy + 2, w[0], w[1], 6, PINE]));
    m.push(["C", w[0], w[1], 5, PROTEIN]);
    return { statics, moving: m };
  },
};

function artPrims(id, p) {
  if (FRONT[id]) return FRONT[id](p);
  return buildSide(SIDE[id], p);
}

function ArtPrims({ prims, opacity = 1 }) {
  return (
    <g opacity={opacity}>
      {prims.map((q, i) => {
        if (q[0] === "L") return <line key={i} x1={q[1]} y1={q[2]} x2={q[3]} y2={q[4]} strokeWidth={q[5]} strokeLinecap="round" style={{ stroke: q[6] }} />;
        if (q[0] === "R") return <rect key={i} x={q[1]} y={q[2]} width={q[3]} height={q[4]} rx={q[5]} style={{ fill: q[6] }} />;
        return <circle key={i} cx={q[1]} cy={q[2]} r={q[3]} style={{ fill: q[4] }} />;
      })}
    </g>
  );
}

// mode: "static" (end pose with a faint start pose), "thumb" (end pose only),
// "play" (looping 2s lift, 1s hold, 3s lower), "sync" (follows the form-check phases)
function MachineArt({ id, name, mode = "static", sync }) {
  const [raw, setRaw] = useState(0);
  useEffect(() => {
    if (mode !== "play" && mode !== "sync") return;
    let raf;
    const t0 = performance.now();
    const tick = () => {
      let v = 0;
      if (mode === "play") {
        const t = ((performance.now() - t0) / 1000) % 6;
        v = t < 2 ? t / 2 : t < 3 ? 1 : 1 - (t - 3) / 3;
      } else if (sync) {
        const rem = Math.max(0, (sync.phaseEnd - Date.now()) / 1000);
        v = sync.phase === "up" ? 1 - rem / 2 : sync.phase === "hold" ? 1 : sync.phase === "down" ? rem / 3 : 0;
      }
      setRaw(v);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [mode, sync?.phase, sync?.phaseEnd]);

  const animated = mode === "play" || mode === "sync";
  const clamped = Math.min(1, Math.max(0, raw));
  const p = animated ? 0.5 - 0.5 * Math.cos(Math.PI * clamped) : 1;
  const pose = artPrims(id, p);
  const ghost = mode === "static" ? artPrims(id, 0).moving : null;
  return (
    <svg viewBox="0 0 240 180" role="img" aria-label={`Illustration of the ${name}`} style={{ width: "100%", display: "block" }}>
      <ArtPrims prims={pose.statics} />
      {ghost && <ArtPrims prims={ghost} opacity={0.22} />}
      <ArtPrims prims={pose.moving} />
    </svg>
  );
}

/* ---------- main app ---------- */
export default function CuteFit() {
  const [store, setStore] = useState(DEFAULT_STORE);
  const [loaded, setLoaded] = useState(false);
  const [tab, setTab] = useState("food");

  // log sheet
  const [showLog, setShowLog] = useState(false);
  const [text, setText] = useState("");
  const [image, setImage] = useState(null);
  const [estimating, setEstimating] = useState(false);
  const [draft, setDraft] = useState(null);
  const [mealError, setMealError] = useState("");
  const fileRef = useRef(null);
  const [scanning, setScanning] = useState(false);
  const [showMeals, setShowMeals] = useState(false);
  const [showIdeas, setShowIdeas] = useState(false);
  const [focusDescribe, setFocusDescribe] = useState(false);
  const quickPhotoRef = useRef(null);
  const openLog = (describe = false) => {
    setLogType(inferType());
    setFocusDescribe(describe);
    setShowLog(true);
  };
  const [product, setProduct] = useState(null);
  const [lookingUp, setLookingUp] = useState(false);

  // ideas
  const [ideaCat, setIdeaCat] = useState(inferType());
  const [ideasByCat, setIdeasByCat] = useState({});
  const [ideasLoading, setIdeasLoading] = useState(null);
  const [ideasError, setIdeasError] = useState("");
  const [logType, setLogType] = useState(inferType());

  // machines
  const [machFilter, setMachFilter] = useState("All");
  const [selMachine, setSelMachine] = useState(null);
  const [logReps, setLogReps] = useState(10);
  const [logWeight, setLogWeight] = useState(0);
  const [timer, setTimer] = useState(null);
  const [now, setNow] = useState(Date.now());
  const [pendingSecs, setPendingSecs] = useState(0);
  const [showHistory, setShowHistory] = useState(false);
  const [coachQ, setCoachQ] = useState("");
  const [coachImage, setCoachImage] = useState(null);
  const [coachLoading, setCoachLoading] = useState(false);
  const [coachAnswer, setCoachAnswer] = useState("");
  const [coachError, setCoachError] = useState("");
  const coachFileRef = useRef(null);
  const machPhotoRef = useRef(null);
  const planRef = useRef(null);
  const scrollRef = useRef(null);
  // iPhone Safari can leave the page shifted after the keyboard closes; put it back
  useEffect(() => {
    const reset = () => setTimeout(() => {
      if (!document.activeElement || !/^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement.tagName)) window.scrollTo(0, 0);
    }, 60);
    document.addEventListener("focusout", reset);
    return () => document.removeEventListener("focusout", reset);
  }, []);
  const [ciWeight, setCiWeight] = useState(75);
  const [actType, setActType] = useState("walk");
  const [actMins, setActMins] = useState(30);
  const [actKm, setActKm] = useState(0);
  const [actLevel, setActLevel] = useState(1);
  const [actLive, setActLive] = useState(null);
  const [stepInput, setStepInput] = useState("");
  const [buildingDay, setBuildingDay] = useState(null); // day whose button was pressed
  const [planDay, setPlanDay] = useState(null); // day the shown workout was built for
  const [machPhoto, setMachPhoto] = useState(null);
  const [videoDraft, setVideoDraft] = useState("");
  const [videoError, setVideoError] = useState("");
  const [fc, setFc] = useState(null); // guided form check
  const [artPlay, setArtPlay] = useState(
    () => !(typeof window !== "undefined" && window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches)
  );

  // workout
  const [muscle, setMuscle] = useState("Chest");
  const [level, setLevel] = useState("Beginner");
  const [plan, setPlan] = useState(null);
  const [planLoading, setPlanLoading] = useState(false);
  const [planNote, setPlanNote] = useState("");
  const [checked, setChecked] = useState({});

  useEffect(() => {
    (async () => {
      try {
        const res = await window.storage.get(KEY, false);
        if (res && res.value) {
          const saved = JSON.parse(res.value);
          setStore({ ...DEFAULT_STORE, ...saved, profile: { ...DEFAULT_STORE.profile, ...saved.profile } });
        }
      } catch (e) {
        /* first visit */
      }
      setLoaded(true);
    })();
  }, []);

  useEffect(() => {
    if (!loaded) return;
    (async () => {
      try {
        await window.storage.set(KEY, JSON.stringify(store), false);
      } catch (e) {
        console.error("Save failed", e);
      }
    })();
  }, [store, loaded]);

  const { profile } = store;
  const today = todayKey();
  const meals = store.days[today] || [];
  const totals = meals.reduce((a, m) => ({ cal: a.cal + m.calories, pro: a.pro + m.protein }), { cal: 0, pro: 0 });
  const calLeft = profile.calTarget - totals.cal;
  const proLeft = Math.max(0, profile.proTarget - totals.pro);
  const proHit = proLeft === 0;

  useEffect(() => {
    setIdeasByCat({});
  }, [meals.length]);

  /* ----- machines: log + timer ----- */
  const gymDays = store.gym || {};
  const todaySets = gymDays[today] || [];
  const groupSets = (sets) => {
    const map = new Map();
    sets.forEach((x) => {
      if (!map.has(x.mid)) map.set(x.mid, { mid: x.mid, name: x.name, sets: [] });
      map.get(x.mid).sets.push(x);
    });
    return [...map.values()];
  };
  const todayGroups = groupSets(todaySets);
  const pastDays = Object.keys(gymDays).filter((d) => d !== today && gymDays[d].length).sort().reverse().slice(0, 7);
  const sel = MACHINES.find((m) => m.id === selMachine);

  useEffect(() => {
    const locked = showLog || showMeals || showIdeas || !!selMachine || !!fc;
    document.documentElement.classList.toggle("cf-lock", locked);
    return () => document.documentElement.classList.remove("cf-lock");
  }, [showLog, showMeals, showIdeas, selMachine, fc]);

  useEffect(() => {
    if (!timer || timer.done) return;
    const iv = setInterval(() => setNow(Date.now()), 250);
    return () => clearInterval(iv);
  }, [timer]);

  useEffect(() => {
    if (timer && timer.mode === "rest" && !timer.done && now >= timer.endAt) {
      setTimer({ ...timer, done: true });
      try {
        if (navigator.vibrate) navigator.vibrate([200, 100, 200]);
      } catch (e) {
        /* vibration not supported */
      }
    }
  }, [now, timer]);

  // Load the saved photo of this machine
  useEffect(() => {
    if (!selMachine) {
      setMachPhoto(null);
      return;
    }
    let alive = true;
    (async () => {
      try {
        const r = await window.storage.get(PHOTO_KEY + selMachine, false);
        if (alive) setMachPhoto(r && r.value ? r.value : null);
      } catch (e) {
        if (alive) setMachPhoto(null);
      }
    })();
    return () => {
      alive = false;
    };
  }, [selMachine]);

  const onPickMachPhoto = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file || !selMachine) return;
    try {
      const img = await prepImage(file);
      setMachPhoto(img.preview);
      await window.storage.set(PHOTO_KEY + selMachine, img.preview, false);
    } catch (err) {
      console.error("Could not save photo", err);
    }
  };

  const removeMachPhoto = async () => {
    setMachPhoto(null);
    try {
      await window.storage.delete(PHOTO_KEY + selMachine, false);
    } catch (e) {
      /* nothing saved */
    }
  };

  const saveVideo = (url) => {
    const clean = url.trim();
    if (clean) {
      try {
        const u = new URL(clean);
        if (!["http:", "https:"].includes(u.protocol)) throw new Error("bad protocol");
      } catch (err) {
        setVideoError("That doesn't look like a web link. Paste the full address, starting with https://");
        return;
      }
    }
    setVideoError("");
    setVideoDraft("");
    setStore((st) => ({ ...st, videos: { ...(st.videos || {}), [selMachine]: clean } }));
  };

  /* ----- guided form check ----- */
  const startFormCheck = (n) => {
    setNow(Date.now());
    setFc({ phase: "ready", rep: 1, reps: n, phaseEnd: Date.now() + 5000, phaseMs: 5000, startedAt: null });
  };

  useEffect(() => {
    if (!fc || fc.phase === "done") return;
    const iv = setInterval(() => setNow(Date.now()), 150);
    return () => clearInterval(iv);
  }, [fc]);

  useEffect(() => {
    if (!fc || fc.phase === "done" || now < fc.phaseEnd) return;
    const t = Date.now();
    const buzz = (pattern) => {
      try {
        if (navigator.vibrate) navigator.vibrate(pattern);
      } catch (e) {
        /* vibration not supported */
      }
    };
    const next = { ready: ["up", 2000], up: ["hold", 1000], hold: ["down", 3000] };
    if (fc.phase === "down") {
      if (fc.rep >= fc.reps) {
        setPendingSecs(fc.startedAt ? Math.round((t - fc.startedAt) / 1000) : 0);
        setFc({ ...fc, phase: "done" });
        buzz([200, 100, 200]);
      } else {
        setFc({ ...fc, phase: "up", rep: fc.rep + 1, phaseEnd: t + 2000, phaseMs: 2000 });
        buzz(40);
      }
    } else {
      const [phase, ms] = next[fc.phase];
      setFc({ ...fc, phase, phaseEnd: t + ms, phaseMs: ms, startedAt: fc.phase === "ready" ? t : fc.startedAt });
      buzz(40);
    }
  }, [now, fc]);

  /* ----- activity tracker ----- */
  const dateKey = (daysAgo) => new Date(Date.now() - daysAgo * 86400000).toLocaleDateString("en-CA");
  const dayStats = (d) => {
    const list = (store.act || {})[d] || [];
    const manual = (store.steps || {})[d] || 0;
    const fromAct = list.reduce((a, x) => a + x.steps, 0);
    return { list, manual, fromAct, steps: manual + fromAct, mins: list.reduce((a, x) => a + x.mins, 0), kcal: list.reduce((a, x) => a + x.kcal, 0) };
  };
  const todayStats = dayStats(today);
  const preview = calcAct(actType, actMins, actKm, actLevel, profile.weight);

  useEffect(() => {
    if (!actLive) return;
    const iv = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(iv);
  }, [actLive]);

  const startLive = () => {
    setNow(Date.now());
    setActLive({ startAt: Date.now(), type: actType });
  };
  const stopLive = () => {
    if (actLive) setActMins(Math.min(600, Math.max(1, Math.round((Date.now() - actLive.startAt) / 60000))));
    setActLive(null);
  };
  const logActivity = () => {
    if (actMins <= 0) return;
    const r = calcAct(actType, actMins, actKm, actLevel, profile.weight);
    setStore((st) => ({
      ...st,
      act: {
        ...(st.act || {}),
        [today]: [...((st.act || {})[today] || []), { id: uid(), type: actType, mins: actMins, km: actKm, lvl: actLevel, kcal: r.kcal, steps: r.steps, time: nowTime() }],
      },
    }));
    setActKm(0);
  };
  const deleteActivity = (id) =>
    setStore((st) => ({ ...st, act: { ...(st.act || {}), [today]: ((st.act || {})[today] || []).filter((x) => x.id !== id) } }));
  const addSteps = (n) =>
    setStore((st) => ({ ...st, steps: { ...(st.steps || {}), [today]: Math.max(0, ((st.steps || {})[today] || 0) + n) } }));
  const setStepsFromDevice = () => {
    const n = parseInt(stepInput.replace(/[^0-9]/g, ""), 10);
    if (!Number.isFinite(n)) return;
    setStore((st) => ({ ...st, steps: { ...(st.steps || {}), [today]: Math.max(0, n - todayStats.fromAct) } }));
    setStepInput("");
  };

  /* ----- weekly weight check-in ----- */
  useEffect(() => {
    setCiWeight(profile.weight);
  }, [profile.weight]);

  const saveCheckin = () => {
    setStore((st) => ({ ...st, weights: { ...(st.weights || {}), [today]: ciWeight } }));
    setProfile({ weight: ciWeight });
  };
  const deleteWeighIn = (d) =>
    setStore((st) => {
      const w = { ...(st.weights || {}) };
      delete w[d];
      return { ...st, weights: w };
    });
  const applyAdjust = (delta) => setProfile({ calAdjust: Math.max(-500, Math.min(500, (profile.calAdjust || 0) + delta)) });

  /* ----- appearance ----- */
  const [systemDark, setSystemDark] = useState(true);
  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    setSystemDark(mq.matches);
    const onChange = (e) => setSystemDark(e.matches);
    if (mq.addEventListener) mq.addEventListener("change", onChange);
    return () => {
      if (mq.removeEventListener) mq.removeEventListener("change", onChange);
    };
  }, []);
  const look = store.look || "light";
  const dark = look === "dark" || look === "neon" || (look === "auto" && systemDark);
  const themeVars = look === "neon" ? THEMES.neon : dark ? THEMES.dark : THEMES.light;
  // Match the page behind the app (status bar area, edges) to the current theme
  useEffect(() => {
    const bg = themeVars["--bg"];
    if (bg) {
      document.documentElement.style.background = bg;
      document.body.style.background = bg;
    }
  }, [themeVars]);

  const lastWeight = (mid) => {
    const days = Object.keys(gymDays).sort().reverse();
    for (const d of days) {
      const hit = [...gymDays[d]].reverse().find((x) => x.mid === mid);
      if (hit) return hit.weight || 0;
    }
    return 0;
  };

  const openMachine = (m) => {
    setSelMachine(m.id);
    setLogReps(Math.round((m.repsMin + m.repsMax) / 2));
    setLogWeight(lastWeight(m.id));
    setCoachQ("");
    setCoachImage(null);
    setCoachAnswer("");
    setCoachError("");
    setVideoDraft("");
    setVideoError("");
  };

  const onPickCoachImage = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setCoachImage(await prepImage(file));
      setCoachError("");
    } catch (err) {
      setCoachError("That photo couldn't be read. Try a JPG or PNG.");
    }
    e.target.value = "";
  };

  const askCoach = async (question) => {
    if (!sel) return;
    const q = (question ?? coachQ).trim();
    if (!q && !coachImage) {
      setCoachError("Type a question or add a photo of your setup.");
      return;
    }
    setCoachLoading(true);
    setCoachError("");
    setCoachAnswer("");
    try {
      const content = [];
      if (coachImage) content.push({ type: "image", source: { type: "base64", media_type: "image/jpeg", data: coachImage.data } });
      content.push({ type: "text", text: q || "Please check my setup on this machine." });
      const text = await askClaudeText(
        `You are a careful, friendly gym coach helping someone use the "${sel.name}". It mainly works: ${sel.primary.map((x) => MUSCLE_LABEL[x]).join(", ")}. Standard steps: ${sel.steps.join(" ")} Typical range: ${sel.setsMin}-${sel.setsMax} sets of ${sel.repsMin}-${sel.repsMax} reps with ${sel.rest} seconds of rest. The person's goal is: ${GOALS[profile.goal].label}. Answer in plain sentences, under 130 words, with no markdown or bullet symbols. If a photo is included, comment only on what you can see, such as seat position, pad placement and body alignment, and say that one photo can't show how the movement looks. If anything looks unsafe, tell them to stop and ask gym staff. Don't diagnose injuries; if they mention pain, advise stopping and seeing a doctor or physiotherapist.`,
        content
      );
      setCoachAnswer(text);
    } catch (err) {
      setCoachError(`Couldn't reach the coach. ${err.message}`);
    }
    setCoachLoading(false);
  };

  const startWatch = (label) => {
    setNow(Date.now());
    setTimer({ mode: "watch", label, startAt: Date.now() });
  };
  const stopWatch = () => {
    if (timer && timer.mode === "watch") setPendingSecs(Math.round((Date.now() - timer.startAt) / 1000));
    setTimer(null);
  };

  const logSet = (m, repsOverride) => {
    let secs = pendingSecs;
    if (timer && timer.mode === "watch") secs = Math.round((Date.now() - timer.startAt) / 1000);
    setStore((s) => ({
      ...s,
      gym: {
        ...(s.gym || {}),
        [today]: [...((s.gym || {})[today] || []), { id: uid(), mid: m.id, name: m.name, reps: repsOverride ?? logReps, weight: logWeight, secs, time: nowTime() }],
      },
    }));
    setPendingSecs(0);
    setNow(Date.now());
    setTimer({ mode: "rest", label: m.name, endAt: Date.now() + m.rest * 1000 });
  };

  const deleteSet = (id) =>
    setStore((s) => ({ ...s, gym: { ...(s.gym || {}), [today]: ((s.gym || {})[today] || []).filter((x) => x.id !== id) } }));

  const matchesFilter = (m) =>
    machFilter === "All" ||
    (["Lower body", "Upper body", "Core"].includes(machFilter) ? m.body === machFilter : m.primary.some((p) => GROUP_OF[p] === machFilter));

  const setProfile = (patch) =>
    setStore((s) => {
      const next = { ...s.profile, ...patch };
      if (("weight" in patch || "targetWeight" in patch) && !("goal" in patch)) {
        next.goal = goalFor(next.weight, next.targetWeight);
      }
      if (PLAN_KEYS.some((k) => k in patch)) {
        const c = calcPlan(next);
        if (c) {
          next.calTarget = c.calories;
          next.proTarget = c.protein;
          next.waterTarget = c.water;
          next.stepTarget = c.steps;
          next.activeTarget = c.active;
        }
      }
      return { ...s, setupDone: s.setupDone || PLAN_KEYS.some((k) => k in patch), profile: next };
    });

  const calc = calcPlan(profile);
  const waterMl = (store.water || {})[today] || 0;
  const addWater = (ml) =>
    setStore((s) => ({
      ...s,
      water: { ...(s.water || {}), [today]: Math.max(0, ((s.water || {})[today] || 0) + ml) },
    }));

  const addMeal = (m) =>
    setStore((s) => ({
      ...s,
      days: { ...s.days, [today]: [...(s.days[today] || []), { id: uid(), time: nowTime(), ...m }] },
      recent: [
        { name: m.name, calories: m.calories, protein: m.protein, carbs: m.carbs || 0, fat: m.fat || 0 },
        ...(s.recent || []).filter((r) => r.name !== m.name),
      ].slice(0, 6),
    }));

  const deleteMeal = (id) =>
    setStore((s) => ({ ...s, days: { ...s.days, [today]: (s.days[today] || []).filter((m) => m.id !== id) } }));

  /* ----- meal actions ----- */
  const closeLog = () => {
    setShowLog(false);
    setDraft(null);
    setText("");
    setImage(null);
    setMealError("");
    setScanning(false);
    setProduct(null);
    setLookingUp(false);
  };

  const findProduct = async (code) => {
    setScanning(false);
    setLookingUp(true);
    setMealError("");
    try {
      setProduct(await lookupBarcode(code));
    } catch (err) {
      setMealError(err.message);
    }
    setLookingUp(false);
  };

  const onPickImage = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const prepared = await prepImage(file);
      setImage(prepared);
      // If the photo shows a barcode, use the exact label numbers instead of guessing
      findBarcodeInImage(prepared.preview).then((code) => code && findProduct(code));
      setMealError("");
    } catch (err) {
      setMealError("That photo couldn't be read. Try a JPG or PNG.");
    }
    e.target.value = "";
  };

  const estimate = async () => {
    if (!text.trim() && !image) {
      setMealError("Add a photo or describe what you're eating.");
      return;
    }
    setEstimating(true);
    setMealError("");
    setDraft(null);
    try {
      const content = [];
      if (image) content.push({ type: "image", source: { type: "base64", media_type: "image/jpeg", data: image.data } });
      content.push({ type: "text", text: `Food or drink: ${text.trim() || "(see photo)"}. Estimate the total for the whole portion.` });
      const r = await askClaude(
        'You are a nutrition estimator. Respond ONLY with JSON, no other text: {"name": string, "calories": number, "protein_g": number, "carbs_g": number, "fat_g": number, "note": string}. The note is one short sentence naming the portion size you assumed.',
        content
      );
      setDraft({
        name: r.name || text || "Meal",
        calories: num(r.calories),
        protein: num(r.protein_g),
        carbs: num(r.carbs_g),
        fat: num(r.fat_g),
        note: r.note || "",
      });
    } catch (err) {
      setMealError(`Couldn't estimate that. ${err.message}`);
    }
    setEstimating(false);
  };

  const confirmDraft = () => {
    if (!draft) return;
    addMeal({ ...draft, type: logType });
    closeLog();
  };

  // Split what's left for the day across meals not eaten yet
  const budgetFor = (cat) => {
    const eaten = new Set(meals.map((m) => m.type));
    const pending = MEAL_TYPES.filter((t) => !eaten.has(t));
    const sum = pending.reduce((acc, t) => acc + SHARE[t], 0);
    const f = SHARE[cat] / (sum + (pending.includes(cat) ? 0 : SHARE[cat]));
    return {
      cal: Math.max(0, Math.round((calLeft * f) / 10) * 10),
      pro: Math.round(proLeft * f),
    };
  };

  const getIdeas = async (cat) => {
    setIdeasLoading(cat);
    setIdeasError("");
    const b = budgetFor(cat);
    try {
      const r = await askClaude(
        `You suggest practical ${cat.toLowerCase()} foods. Respond ONLY with a JSON array of exactly 4 varied objects: [{"name": string, "calories": number, "protein_g": number, "why": string}]. Vary the main ingredients and effort, with some quick options and some cooked ones. Keep each "why" under 10 words. Stay near the calorie budget and aim for the protein budget.`,
        `Meal: ${cat}. Goal: ${GOALS[profile.goal].label}. Budget for this meal: about ${b.cal} kcal and ${b.pro} g protein. Left for the whole day: ${Math.max(0, calLeft)} kcal and ${proLeft} g protein. Already eaten today: ${meals.map((m) => m.name).join(", ") || "nothing"}.`
      );
      setIdeasByCat((prev) => ({ ...prev, [cat]: r }));
    } catch (err) {
      setIdeasError(`Couldn't load ideas. ${err.message}`);
    }
    setIdeasLoading(null);
  };

  const logIdea = (i, cat) =>
    addMeal({ name: i.name, calories: num(i.calories), protein: num(i.protein_g), carbs: 0, fat: 0, type: cat });

  /* ----- workout ----- */
  const buildPlan = async (focus = muscle) => {
    setPlanLoading(true);
    setPlanNote("");
    setChecked({});
    try {
      const r = await askClaude(
        'You are a gym coach. Respond ONLY with a JSON array of 5 or 6 objects: [{"exercise": string, "machine": string, "sets_reps": string, "tip": string}]. Prefer common commercial-gym machines and cables. The "machine" field names exactly what to look for on the gym floor. The tip is one short form cue.',
        `Muscle focus: ${focus}. Level: ${level}. Goal: ${GOALS[profile.goal].label}. Current weight ${profile.weight} kg, target weight ${profile.targetWeight} kg, so pick exercises that suit that goal.`
      );
      setPlan(r);
    } catch (err) {
      setPlan(FALLBACK[focus].map(([exercise, machine, sets_reps]) => ({ exercise, machine, sets_reps, tip: "" })));
      setPlanNote(`The coach couldn't be reached (${err.message}), so this is a basic routine.`);
    }
    setPlanLoading(false);
    setTimeout(() => planRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 150);
  };

  const doneCount = Object.values(checked).filter(Boolean).length;
  const allDone = plan && plan.length > 0 && doneCount === plan.length;

  /* ----- derived copy ----- */
  const density = calLeft > 0 ? Math.round((proLeft / calLeft) * 100) : 0;
  let tip;
  if (proHit && calLeft >= 0) tip = `Protein target hit, with ${calLeft} kcal of room left.`;
  else if (calLeft <= 0 && !proHit) tip = `You're at your calorie limit but ${proLeft} g short on protein. A protein shake (about 120 kcal for 25 g) fits best.`;
  else if (calLeft <= 0) tip = `You're ${Math.abs(calLeft)} kcal over today. One day won't undo your progress.`;
  else tip = `Aim for about ${density} g protein per 100 kcal. Lean meat, fish, eggs, Greek yogurt or a shake all work.`;

  const catIdeas = ideasByCat[ideaCat];
  const budget = budgetFor(ideaCat);

  const glance = [
    { label: "Steps", raw: todayStats.steps, rawTarget: profile.stepTarget, value: todayStats.steps.toLocaleString(), target: profile.stepTarget.toLocaleString(), unit: "", color: STEPS },
    { label: "Active minutes", raw: todayStats.mins, rawTarget: profile.activeTarget, value: todayStats.mins, target: profile.activeTarget, unit: "min", color: ACTIVE },
    { label: "Protein", raw: totals.pro, rawTarget: profile.proTarget, value: totals.pro, target: profile.proTarget, unit: "g", color: PROTEIN },
    { label: "Calories eaten", raw: totals.cal, rawTarget: profile.calTarget, value: totals.cal, target: profile.calTarget, unit: "kcal", color: CAL },
    { label: "Water", raw: waterMl, rawTarget: profile.waterTarget, value: (waterMl / 1000).toFixed(2), target: (profile.waterTarget / 1000).toFixed(1), unit: "L", color: WATER },
  ];
  const weekDays = [6, 5, 4, 3, 2, 1, 0].map((o) => {
    const k = dateKey(o);
    const st = dayStats(k);
    return { key: k, label: new Date(k + "T00:00:00").toLocaleDateString(undefined, { weekday: "short" }), steps: st.steps, mins: st.mins, today: o === 0 };
  });
  const maxSteps = Math.max(profile.stepTarget * 1.25, ...weekDays.map((d) => d.steps));
  const daysHit = weekDays.filter((d) => d.steps >= profile.stepTarget).length;
  const weekMins = weekDays.reduce((a, d) => a + d.mins, 0);

  const weighIns = Object.keys(store.weights || {}).sort();
  const lastWeighIn = weighIns[weighIns.length - 1];
  const dayMs = 86400000;
  const daysSinceWeigh = lastWeighIn ? Math.floor((Date.now() - new Date(lastWeighIn + "T00:00:00").getTime()) / dayMs) : null;
  const checkinDue = daysSinceWeigh !== null && daysSinceWeigh >= 7;
  const checkin = (() => {
    if (weighIns.length < 2 || !calc) return null;
    const recent = weighIns.filter((k) => (Date.now() - new Date(k + "T00:00:00").getTime()) / dayMs <= 28);
    const use = recent.length >= 2 ? recent : weighIns.slice(-2);
    const first = use[0];
    const last = use[use.length - 1];
    const span = (new Date(last + "T00:00:00").getTime() - new Date(first + "T00:00:00").getTime()) / dayMs;
    if (span < 7) return { tooSoon: true };
    const w = store.weights;
    const rate = (w[last] - w[first]) / (span / 7);
    const bw = w[last];
    const planned = calc.kgPerWeek;
    let status = "ok";
    let delta = 0;
    if (profile.goal === "lose") {
      const loss = -rate;
      if (loss > 0.01 * bw) { status = "fast"; delta = 150; }
      else if (loss < 0.5 * planned) { status = "slow"; delta = -100; }
    } else if (profile.goal === "build") {
      if (rate > 0.005 * bw) { status = "fast"; delta = -150; }
      else if (rate < 0.5 * planned) { status = "slow"; delta = 150; }
    } else if (rate > 0.25) { status = "up"; delta = -100; }
    else if (rate < -0.25) { status = "down"; delta = 100; }
    const blocked = delta < 0 && calc.calories + delta < calc.floor;
    return { rate, status, delta, blocked, days: Math.round(span), planned };
  })();
  const ciText = checkin && !checkin.tooSoon ? ({
    ok: "You're on track. Keep going, no changes needed.",
    fast: profile.goal === "lose"
      ? "That's quicker than the usual 0.5 to 1 percent of body weight a week. Eating a little more helps protect muscle, energy and mood."
      : "That's quicker than needed for lean gain, so some of it may be fat. A slightly lower calorie target keeps gains lean.",
    slow: profile.goal === "lose"
      ? `Your plan aims for about ${checkin.planned.toFixed(2)} kg a week. Weight moves up and down day to day, so give it another week or two. If it stays slow, a small calorie cut or more steps can help.`
      : "A little more food should help you move toward your target weight.",
    up: "Your weight is drifting up. A small calorie cut will bring you back to steady.",
    down: "Your weight is drifting down. A little more food will bring you back to steady.",
  }[checkin.status]) : "";

  const week = weeklyPlan(profile.goal, level, profile.trainDays);
  const weekIntro = {
    lose: "To lose weight, lift to keep your muscle, add steady cardio, and keep your protein high.",
    build: "To gain weight, lift progressively, keep cardio light, and eat enough to fuel your training.",
    maintain: "To stay where you are, mix regular strength work with some cardio.",
  }[profile.goal];
  const FILTER_FOR = { Chest: "Chest", Back: "Back", Legs: "Legs", Shoulders: "Shoulders", Arms: "Arms", Core: "Core", "Full body": "All" };

  const dateLabel = new Date().toLocaleDateString(undefined, { weekday: "long", day: "numeric", month: "long" });

  /* ---------- render ---------- */
  const navBtn = (id, Icon, label) => {
    const active = tab === id;
    return (
      <button
        key={id}
        onClick={() => {
          setTab(id);
          scrollRef.current?.scrollTo({ top: 0 });
        }}
        aria-current={active ? "page" : undefined}
        className="flex-1 flex flex-col items-center gap-1 py-2"
        style={{ color: active ? PINE : ICON }}
      >
        <span
          className="flex items-center justify-center"
          style={{ width: 48, height: 32, borderRadius: 16, background: active ? MINT : "transparent" }}
        >
          <Icon size={22} strokeWidth={active ? 2.5 : 2} />
        </span>
        <span className="text-xs font-semibold">{label}</span>
      </button>
    );
  };

  return (
    <div
      className="w-full cutefit flex flex-col"
      style={{ ...themeVars, position: "fixed", inset: 0, colorScheme: dark ? "dark" : "light", background: BG, color: INK, fontFamily: FONT }}
    >
      <style>{`.cutefit input::placeholder, .cutefit textarea::placeholder { color: var(--icon); opacity: 1; }`}</style>
      <main
        ref={scrollRef}
        className="flex-1 min-h-0 flex flex-col"
        style={{ overflowY: "auto", overflowX: "hidden", overscrollBehavior: "contain", WebkitOverflowScrolling: "touch" }}
      >
      <div
        className="w-full max-w-md mx-auto px-4 flex flex-col"
        style={{ flex: "1 0 auto", paddingBottom: tab === "food" ? 14 : 28 }}
      >
        <header
          className="mb-3 -mx-4 px-4 pb-2"
          style={{ position: "sticky", top: 0, zIndex: 40, background: BG, paddingTop: "calc(env(safe-area-inset-top) + 12px)" }}
        >
          <div
          className="flex items-center gap-3 p-1.5 mb-2"
          role="img"
          aria-label="CuteFit"
          style={{ background: "var(--hdr-bg)", borderRadius: 22, border: "1px solid var(--hdr-border)", boxShadow: "var(--hdr-glow)" }}
        >
          <img src={LOGO_SRC} alt="" width={38} height={38} style={{ borderRadius: 12, display: "block" }} />
          <span className="text-xl font-bold" style={{ color: "#FFFFFF", letterSpacing: "-0.02em" }}>
            Cute<span style={{ color: "#FF6FD0" }}>Fit</span>
          </span>
        </div>
          <div className="flex items-baseline justify-between gap-3">
            <h1 className="text-2xl font-bold" style={{ color: PINE }}>
              {{ food: "Today", lift: "Workout", mach: "Gym machines", act: "Activity", me: "My goals" }[tab]}
            </h1>
            <p className="text-sm truncate" style={{ color: MUTED }}>{dateLabel}</p>
          </div>
        </header>

        {/* ===== FOOD ===== */}
        {tab === "food" && (
          <div className="flex-1 flex flex-col gap-3">
            {!store.setupDone && (
              <button onClick={() => setTab("me")} className="text-left p-4 flex items-center gap-3" style={{ ...card, background: MINT, border: "none" }}>
                <Sparkles size={22} style={{ color: PINE }} />
                <span>
                  <span className="font-bold block">Set your targets first</span>
                  <span className="text-sm" style={{ color: MUTED }}>The numbers below are placeholders until you do.</span>
                </span>
              </button>
            )}

            {checkinDue && (
              <button onClick={() => setTab("me")} className="text-left p-4 flex items-center gap-3" style={{ ...card, background: MINT, border: "none" }}>
                <ActivityIcon size={22} style={{ color: PINE }} />
                <span>
                  <span className="font-bold block">Weekly weight check-in is due</span>
                  <span className="text-sm" style={{ color: MUTED }}>It's been {daysSinceWeigh} days. Tap to log your weight.</span>
                </span>
              </button>
            )}

            <section className="p-4 flex items-center gap-4" style={card}>
              <div className="relative shrink-0" style={{ width: 128, height: 128 }}>
                <Ring value={totals.pro} target={profile.proTarget} color={PROTEIN} size={128} />
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  {proHit ? (
                    <>
                      <Check size={28} style={{ color: PROTEIN }} strokeWidth={3} />
                      <span className="font-bold text-sm mt-1">Protein done</span>
                      <span className="text-xs" style={{ color: MUTED }}>{totals.pro} g eaten</span>
                    </>
                  ) : (
                    <>
                      <span className="text-3xl font-bold leading-none" style={{ color: PROTEIN }}>{proLeft}</span>
                      <span className="text-xs font-semibold mt-1" style={{ color: MUTED }}>g protein<br />to go</span>
                    </>
                  )}
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex flex-col mb-2">
                  <span className="font-semibold text-sm" style={{ color: MUTED }}>Calories</span>
                  <span style={{ color: calLeft < 0 ? OVER : MUTED }}>
                    <span className="font-bold text-2xl" style={{ color: calLeft < 0 ? OVER : INK }}>
                      {Math.abs(calLeft)}
                    </span>{" "}
                    kcal {calLeft < 0 ? "over" : "left"}
                  </span>
                </div>
                <div className="overflow-hidden" style={{ height: 12, borderRadius: 6, background: TROUGH }}>
                  <div
                    style={{
                      width: `${Math.min(100, profile.calTarget ? (totals.cal / profile.calTarget) * 100 : 0)}%`,
                      height: "100%",
                      background: calLeft < 0 ? OVER : CAL,
                      borderRadius: 6,
                      transition: "width 500ms ease",
                    }}
                  />
                </div>
                <p className="text-sm mt-1" style={{ color: MUTED }}>
                  {totals.cal} of {profile.calTarget} kcal eaten
                </p>
              </div>
            </section>

            {/* Water */}
            <section className="p-4" style={card}>
              <div className="flex items-baseline justify-between mb-2">
                <h2 className="font-bold text-lg flex items-center gap-2">
                  <Droplets size={20} style={{ color: WATER }} /> Water
                </h2>
                <span style={{ color: MUTED }}>
                  <span className="font-bold text-lg" style={{ color: WATER }}>{(waterMl / 1000).toFixed(2)}</span> / {(profile.waterTarget / 1000).toFixed(1)} L
                </span>
              </div>
              <div className="overflow-hidden mb-3" style={{ height: 10, borderRadius: 5, background: TROUGH }}>
                <div
                  style={{
                    width: `${Math.min(100, profile.waterTarget ? (waterMl / profile.waterTarget) * 100 : 0)}%`,
                    height: "100%",
                    background: WATER,
                    borderRadius: 6,
                    transition: "width 400ms ease",
                  }}
                />
              </div>
              <div className="flex gap-2">
                <button onClick={() => addWater(250)} className="flex-1 py-2.5 font-bold" style={{ borderRadius: 14, background: TINT_W, color: WATERTXT }}>
                  + 250 ml
                </button>
                <button onClick={() => addWater(500)} className="flex-1 py-2.5 font-bold" style={{ borderRadius: 14, background: TINT_W, color: WATERTXT }}>
                  + 500 ml
                </button>
                <button onClick={() => addWater(-250)} aria-label="Undo 250 ml" className="px-4 py-2.5 font-bold" style={{ borderRadius: 14, background: PANEL, color: MUTED }}>
                  <Minus size={18} />
                </button>
              </div>
              {waterMl >= profile.waterTarget && (
                <p className="text-sm mt-2" style={{ color: MUTED }}>Water target reached.</p>
              )}
            </section>

            {/* Shortcuts: meal list and AI ideas open in sheets so the page stays one screen */}
            <div className="grid grid-cols-2 gap-3">
              <button onClick={() => setShowMeals(true)} className="p-4 text-left flex flex-col gap-1" style={card}>
                <span className="flex items-center justify-between w-full">
                  <Utensils size={20} style={{ color: PINE }} />
                  <ChevronRight size={18} style={{ color: ICON }} />
                </span>
                <span className="font-bold mt-1">Meals today</span>
                <span className="text-sm" style={{ color: MUTED }}>
                  {meals.length === 0 ? "None yet" : `${meals.length} logged · ${totals.cal} kcal`}
                </span>
              </button>
              <button onClick={() => setShowIdeas(true)} className="p-4 text-left flex flex-col gap-1" style={{ ...card, background: MINT, border: "none" }}>
                <span className="flex items-center justify-between w-full">
                  <Sparkles size={20} style={{ color: PINE }} />
                  <ChevronRight size={18} style={{ color: PINE }} />
                </span>
                <span className="font-bold mt-1" style={{ color: PINE }}>Meal ideas</span>
                <span className="text-sm" style={{ color: MUTED }}>AI picks for what's left</span>
              </button>
            </div>

            {/* Log food panel: fills the rest of the screen with three quick ways in */}
            <section
              className="flex-1 flex flex-col gap-3 p-4 text-white relative overflow-hidden"
              style={{ minHeight: 168, borderRadius: 26, background: BTNG, boxShadow: "0 10px 26px rgba(60,15,84,0.32)" }}
            >
              <div aria-hidden="true" style={{ position: "absolute", width: 180, height: 180, right: -50, top: -70, borderRadius: "50%", background: "rgba(255,255,255,0.10)" }} />
              <div aria-hidden="true" style={{ position: "absolute", width: 110, height: 110, left: -30, bottom: -40, borderRadius: "50%", background: "rgba(255,111,208,0.18)" }} />
              <button onClick={() => openLog()} className="relative flex items-center gap-3 text-left">
                <span className="flex items-center justify-center shrink-0" style={{ width: 44, height: 44, borderRadius: 14, background: "rgba(255,255,255,0.18)" }}>
                  <Plus size={26} strokeWidth={3} />
                </span>
                <span className="min-w-0">
                  <span className="block text-xl font-bold leading-tight">Log food</span>
                  <span className="block text-sm" style={{ opacity: 0.85 }}>{inferType()} time. What are you having?</span>
                </span>
              </button>
              <input ref={quickPhotoRef} type="file" accept="image/*" className="hidden" onChange={(e) => { openLog(); onPickImage(e); }} />
              <div className="relative flex-1 grid grid-cols-3 gap-2">
                {[
                  { icon: ScanBarcode, label: "Scan", sub: "barcode", go: () => { openLog(); setScanning(true); } },
                  { icon: Camera, label: "Photo", sub: "of your plate", go: () => quickPhotoRef.current?.click() },
                  { icon: PencilLine, label: "Describe", sub: "in words", go: () => openLog(true) },
                ].map(({ icon: I, label, sub, go }) => (
                  <button
                    key={label}
                    onClick={go}
                    className="flex flex-col items-center justify-center gap-1 py-3 font-bold"
                    style={{ borderRadius: 18, background: "rgba(255,255,255,0.14)", border: "1px solid rgba(255,255,255,0.22)", minHeight: 84 }}
                  >
                    <I size={26} />
                    <span className="text-sm leading-tight">{label}</span>
                    <span className="text-xs font-medium leading-tight" style={{ opacity: 0.8 }}>{sub}</span>
                  </button>
                ))}
              </div>
            </section>
          </div>
        )}

        {/* ===== WORKOUT ===== */}
        {tab === "lift" && (
          <div className="flex flex-col gap-4">
            <section className="p-5" style={card}>
              <h2 className="font-bold text-lg">Your weekly plan</h2>
              <p className="text-sm mb-1" style={{ color: MUTED }}>
                {weekIntro} It matches your level and training days.
              </p>
              <div className="my-3">
                <Seg
                  label="Training days a week"
                  value={profile.trainDays}
                  onChange={(v) => setProfile({ trainDays: v })}
                  options={[2, 3, 4, 5].map((n) => ({ value: n, label: `${n} days` }))}
                />
              </div>
              {calc && calc.diffKg !== 0 && (
                <p className="text-sm font-semibold mb-3" style={{ color: PINE }}>
                  Goal: {calc.diffKg < 0 ? "lose" : "gain"} {Math.abs(calc.diffKg)} kg ({profile.weight} to {calc.goalWeight} kg)
                </p>
              )}
              <ul className="flex flex-col gap-2 mt-2">
                {week.map((d) => (
                  <li
                    key={d.day}
                    className="p-3 flex items-start gap-3"
                    style={{ background: d.kind === "rest" ? PANEL : d.kind === "cardio" ? TINT_C : TINT_P, borderRadius: 14 }}
                  >
                    <span className="font-bold shrink-0" style={{ width: 38 }}>{d.day}</span>
                    <span className="flex-1">
                      <span className="font-bold block">{d.title}</span>
                      <span className="text-sm block" style={{ color: MUTED }}>{d.detail}</span>
                      {d.kind === "strength" && (
                        <span className="flex flex-wrap gap-2 mt-2">
                          <button
                            onClick={async () => {
                              setMuscle(d.focus);
                              setPlanDay(d.day);
                              setBuildingDay(d.day);
                              await buildPlan(d.focus);
                              setBuildingDay(null);
                            }}
                            disabled={planLoading}
                            className="px-3 py-2 text-sm font-bold text-white"
                            style={{ borderRadius: 12, background: BTNP, opacity: buildingDay === d.day ? 0.7 : planLoading ? 0.5 : 1 }}
                          >
                            {buildingDay === d.day ? "Building..." : "Build this workout"}
                          </button>
                          <button
                            onClick={() => {
                              setMachFilter(FILTER_FOR[d.focus]);
                              setTab("mach");
                            }}
                            className="px-3 py-2 text-sm font-bold"
                            style={{ borderRadius: 12, background: CARD, color: PINE, border: `1px solid ${LINE}` }}
                          >
                            See machines
                          </button>
                        </span>
                      )}
                    </span>
                  </li>
                ))}
              </ul>
              <p className="text-xs mt-3" style={{ color: MUTED }}>
                General guidance, not medical advice. Start lighter than you think, and ask gym staff if you're unsure about a machine.
              </p>
            </section>

            <section className="p-5 flex flex-col gap-4" style={card}>
              <div>
                <h2 className="font-bold text-lg mb-3">What are you training today?</h2>
                <div className="grid grid-cols-2 gap-2">
                  {MUSCLES.map((m, idx) => {
                    const active = muscle === m.id;
                    return (
                      <button
                        key={m.id}
                        onClick={() => setMuscle(m.id)}
                        aria-pressed={active}
                        className={`text-left p-3 ${idx === MUSCLES.length - 1 ? "col-span-2" : ""}`}
                        style={{
                          borderRadius: 16,
                          background: active ? BTNG : PANEL,
                          color: active ? "#fff" : INK,
                        }}
                      >
                        <span className="font-bold block">{m.id}</span>
                        <span className="text-xs" style={{ color: active ? ONPINE : MUTED }}>{m.hint}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <h2 className="font-bold text-lg mb-3">Your level</h2>
                <Seg
                  label="Experience level"
                  value={level}
                  onChange={setLevel}
                  options={LEVELS.map((l) => ({ value: l, label: l }))}
                />
              </div>

              <button
                onClick={() => {
                  setPlanDay(null);
                  buildPlan();
                }}
                disabled={planLoading}
                className="flex items-center justify-center gap-2 py-4 font-bold text-white"
                style={{ borderRadius: 18, background: BTNP, opacity: planLoading ? 0.7 : 1 }}
              >
                {planLoading && !buildingDay ? <Loader2 size={20} className="animate-spin" /> : <Dumbbell size={20} />}
                {planLoading && !buildingDay ? "Building your workout..." : "Build my workout"}
              </button>
            </section>

            {plan && (
              <section ref={planRef} className="p-5" style={card}>
                <div className="flex items-baseline justify-between mb-2">
                  <h2 className="font-bold text-lg">{planDay ? `${planDay}: ` : ""}{muscle} workout</h2>
                  <span className="text-sm font-semibold" style={{ color: MUTED }}>{doneCount} of {plan.length} done</span>
                </div>
                <div className="overflow-hidden mb-3" style={{ height: 8, borderRadius: 4, background: TROUGH }}>
                  <div style={{ width: `${(doneCount / plan.length) * 100}%`, height: "100%", background: PROTEIN, transition: "width 300ms ease" }} />
                </div>
                {planNote && <p className="text-sm mb-2" style={{ color: MUTED }}>{planNote}</p>}

                <ul className="flex flex-col gap-2">
                  {plan.map((p, idx) => {
                    const done = !!checked[idx];
                    return (
                      <li key={idx}>
                        <button
                          onClick={() => setChecked({ ...checked, [idx]: !done })}
                          aria-pressed={done}
                          className="w-full flex items-start gap-3 p-3 text-left"
                          style={{ background: done ? MINT : PANEL, borderRadius: 16 }}
                        >
                          <span
                            className="flex items-center justify-center shrink-0 mt-1"
                            style={{
                              width: 28,
                              height: 28,
                              borderRadius: 14,
                              border: `2px solid ${done ? PINE : PROTEIN}`,
                              background: done ? BTNG : "transparent",
                              color: "#fff",
                            }}
                          >
                            {done && <Check size={16} strokeWidth={3} />}
                          </span>
                          <span className="flex-1" style={{ opacity: done ? 0.65 : 1 }}>
                            <span className="font-bold block">{p.exercise}</span>
                            <span className="text-sm font-semibold" style={{ color: PROTEIN }}>{p.sets_reps}</span>
                            <span className="text-sm block mt-1" style={{ color: MUTED }}>Find: {p.machine}</span>
                            {p.tip && <span className="text-sm block">{p.tip}</span>}
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ul>

                {allDone && (
                  <div className="mt-4 p-4" style={{ background: MINT, borderRadius: 16 }}>
                    <p className="font-bold">Workout done.</p>
                    <p className="text-sm">
                      {proHit
                        ? "You've already hit your protein target today."
                        : `You still need ${proLeft} g protein today. A meal or shake within a couple of hours helps recovery.`}
                    </p>
                  </div>
                )}
                {!allDone && profile.goal === "lose" && (
                  <p className="text-sm mt-3" style={{ color: MUTED }}>
                    Cutting? Keep the weights challenging. Lifting helps you hold on to muscle while you lose fat.
                  </p>
                )}
              </section>
            )}
          </div>
        )}

        {/* ===== MACHINES ===== */}
        {tab === "mach" && (
          <div className="flex flex-col gap-4">
            <section className="p-5" style={card}>
              <div className="flex items-baseline justify-between mb-2">
                <h2 className="font-bold text-lg">Used today</h2>
                <span className="text-sm font-semibold" style={{ color: MUTED }}>
                  {todaySets.length} {todaySets.length === 1 ? "set" : "sets"}
                </span>
              </div>
              {todayGroups.length === 0 ? (
                <p style={{ color: MUTED }}>No machines yet. Open one below and log your first set.</p>
              ) : (
                <ul>
                  {todayGroups.map((g, idx) => {
                    const top = Math.max(...g.sets.map((x) => x.weight || 0));
                    return (
                      <li key={g.mid} className="py-3" style={{ borderTop: idx ? `1px solid ${LINE}` : "none" }}>
                        <div className="font-semibold">{g.name}</div>
                        <div className="text-sm" style={{ color: MUTED }}>
                          {g.sets.length} {g.sets.length === 1 ? "set" : "sets"} · reps {g.sets.map((x) => x.reps).join(", ")}
                          {top > 0 ? ` · up to ${top} kg` : ""}
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
              {pastDays.length > 0 && (
                <>
                  <button onClick={() => setShowHistory(!showHistory)} className="text-sm font-semibold underline mt-2" style={{ color: MUTED }}>
                    {showHistory ? "Hide previous days" : "Show previous days"}
                  </button>
                  {showHistory && (
                    <ul className="mt-2">
                      {pastDays.map((d) => (
                        <li key={d} className="py-2" style={{ borderTop: `1px solid ${LINE}` }}>
                          <div className="font-semibold text-sm">
                            {new Date(d + "T00:00:00").toLocaleDateString(undefined, { weekday: "short", day: "numeric", month: "short" })}
                          </div>
                          <div className="text-sm" style={{ color: MUTED }}>
                            {groupSets(gymDays[d]).map((g) => `${g.name} (${g.sets.length})`).join(", ")}
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </>
              )}
            </section>

            <p className="text-sm" style={{ color: MUTED }}>
              Strength machines are tracked here. Cardio machines (treadmill, bike, cross trainer, rower, stair climber) are logged in the Activity tab.{" "}
              <button onClick={() => setTab("act")} className="font-semibold underline" style={{ color: PINE }}>
                Open Activity
              </button>
            </p>


            <div className="flex flex-wrap gap-2">
              {MACHINE_FILTERS.map((f) => {
                const active = machFilter === f;
                return (
                  <button
                    key={f}
                    onClick={() => setMachFilter(f)}
                    aria-pressed={active}
                    className="px-4 py-2 text-sm font-semibold"
                    style={{ borderRadius: 20, background: active ? BTNG : CARD, color: active ? "#fff" : INK, border: `1px solid ${active ? PINE : LINE}` }}
                  >
                    {f}
                  </button>
                );
              })}
            </div>

            <ul className="flex flex-col gap-2">
              {MACHINES.filter(matchesFilter).map((m) => {
                const used = todaySets.filter((x) => x.mid === m.id).length;
                return (
                  <li key={m.id}>
                    <button onClick={() => openMachine(m)} className="w-full text-left p-4 flex items-center gap-3" style={card}>
                      <span className="shrink-0" style={{ width: 84, background: PANEL, borderRadius: 12 }}>
                        <MachineArt id={m.id} name={m.name} mode="thumb" />
                      </span>
                      <span className="flex-1">
                        <span className="font-bold block">{m.name}</span>
                        <span className="text-sm block" style={{ color: PROTEIN, fontWeight: 600 }}>
                          {m.primary.map((x) => MUSCLE_LABEL[x]).join(", ")}
                        </span>
                        <span className="text-sm block" style={{ color: MUTED }}>
                          {m.body} · {m.setsMin === m.setsMax ? m.setsMin : `${m.setsMin}-${m.setsMax}`} sets of {m.repsMin}-{m.repsMax}
                        </span>
                      </span>
                      {used > 0 && (
                        <span className="text-xs font-bold px-2 py-1" style={{ background: MINT, color: PINE, borderRadius: 10 }}>
                          {used} today
                        </span>
                      )}
                      <ChevronRight size={20} style={{ color: MUTED }} />
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        )}

        {/* ===== ACTIVITY ===== */}
        {tab === "act" && (
          <div className="flex flex-col gap-4">
            <section className="p-5 flex flex-col gap-3" style={card}>
              <h2 className="font-bold text-lg">Today at a glance</h2>
              {glance.map((g) => (
                <div key={g.label}>
                  <div className="flex items-baseline justify-between mb-1">
                    <span className="font-semibold text-sm">{g.label}</span>
                    <span className="text-sm" style={{ color: MUTED }}>
                      <span className="font-bold" style={{ color: g.color }}>{g.value}</span> / {g.target} {g.unit}
                    </span>
                  </div>
                  <div className="overflow-hidden" style={{ height: 10, borderRadius: 5, background: TROUGH }}>
                    <div style={{ width: `${Math.min(100, g.rawTarget ? (g.raw / g.rawTarget) * 100 : 0)}%`, height: "100%", background: g.color, borderRadius: 5, transition: "width 400ms ease" }} />
                  </div>
                </div>
              ))}
              <p className="text-sm font-semibold">Estimated extra calories burned today: about {todayStats.kcal} kcal</p>
              <p className="text-xs" style={{ color: MUTED }}>These are rough estimates and aren't added to your calorie target.</p>
            </section>

            <section className="p-5" style={card}>
              <div className="flex items-baseline justify-between mb-2">
                <h2 className="font-bold text-lg">Steps</h2>
                <span style={{ color: MUTED }}>
                  <span className="text-2xl font-bold" style={{ color: STEPS }}>{todayStats.steps.toLocaleString()}</span> / {profile.stepTarget.toLocaleString()}
                </span>
              </div>
              <div className="overflow-hidden mb-2" style={{ height: 12, borderRadius: 6, background: TROUGH }}>
                <div style={{ width: `${Math.min(100, (todayStats.steps / profile.stepTarget) * 100)}%`, height: "100%", background: STEPS, borderRadius: 6, transition: "width 400ms ease" }} />
              </div>
              {todayStats.fromAct > 0 && (
                <p className="text-sm mb-2" style={{ color: MUTED }}>
                  Includes about {todayStats.fromAct.toLocaleString()} steps estimated from the walks, runs and treadmill sessions you logged.
                </p>
              )}
              <div className="flex gap-2">
                {[500, 1000, 2000].map((n) => (
                  <button key={n} onClick={() => addSteps(n)} className="flex-1 py-3 font-bold" style={{ borderRadius: 14, background: TINT_S, color: STEPS }}>
                    + {n.toLocaleString()}
                  </button>
                ))}
                <button onClick={() => addSteps(-500)} aria-label="Take off 500 steps" className="px-4 py-3 font-bold" style={{ borderRadius: 14, background: PANEL, color: MUTED }}>
                  <Minus size={18} />
                </button>
              </div>
              <div className="flex gap-2 mt-3">
                <input
                  value={stepInput}
                  onChange={(e) => setStepInput(e.target.value.replace(/[^0-9]/g, ""))}
                  onKeyDown={(e) => e.key === "Enter" && setStepsFromDevice()}
                  inputMode="numeric"
                  placeholder="What does your phone or watch say?"
                  aria-label="Steps total from your phone or watch"
                  className="flex-1 px-4 py-3 outline-none"
                  style={inputStyle}
                />
                <button onClick={setStepsFromDevice} className="px-5 py-3 font-bold text-white" style={{ borderRadius: 14, background: BTNG }}>
                  Set total
                </button>
              </div>
            </section>

            <section className="p-5 flex flex-col gap-3" style={card}>
              <h2 className="font-bold text-lg">Log an activity</h2>
              <div className="flex flex-wrap gap-2">
                {Object.entries(ACT_TYPES).map(([k, t]) => {
                  const active = actType === k;
                  return (
                    <button
                      key={k}
                      onClick={() => setActType(k)}
                      aria-pressed={active}
                      className="px-4 py-2 text-sm font-semibold"
                      style={{ borderRadius: 20, background: active ? BTNG : PANEL, color: active ? "#fff" : INK }}
                    >
                      {t.label}
                    </button>
                  );
                })}
              </div>

              {actLive ? (
                <div className="p-4 flex items-center justify-between text-white" style={{ background: BTNG, borderRadius: 18 }}>
                  <span>
                    <span className="text-xs block" style={{ opacity: 0.8 }}>Recording · {ACT_TYPES[actLive.type].label}</span>
                    <span className="text-3xl font-bold">{fmt((now - actLive.startAt) / 1000)}</span>
                  </span>
                  <button onClick={stopLive} className="px-5 py-3 font-bold" style={{ background: "#fff", color: "#3c0f54", borderRadius: 14 }}>
                    Finish
                  </button>
                </div>
              ) : (
                <button onClick={startLive} className="flex items-center justify-center gap-2 py-4 font-bold text-white" style={{ borderRadius: 18, background: BTNG }}>
                  <Play size={18} /> Start timing a {ACT_TYPES[actType].label.toLowerCase()}
                </button>
              )}
              <p className="text-xs" style={{ color: MUTED }}>
                This app can't use GPS, so time your session here and add the distance yourself. Or skip the timer and just enter the details.
              </p>

              <div>
                <Stepper label="Duration" unit="minutes" step={5} min={1} max={600} value={actMins} onChange={setActMins} color={ACTIVE} />
                <div style={{ borderTop: `1px solid ${LINE}` }} />
                <Stepper label="Distance" unit="km (0 to skip)" step={0.5} min={0} max={200} value={actKm} onChange={setActKm} color={STEPS} />
              </div>
              <Seg label="How hard was it" value={actLevel} onChange={setActLevel} options={ACT_LEVELS.map((l, i) => ({ value: i, label: l }))} />
              <p className="text-sm">
                About <span className="font-bold">{preview.kcal} kcal</span>
                {preview.steps > 0 ? <> and <span className="font-bold">{preview.steps.toLocaleString()} steps</span></> : null} for this session.
              </p>
              <button onClick={logActivity} className="flex items-center justify-center gap-2 py-4 font-bold text-white" style={{ borderRadius: 18, background: BTNP }}>
                <Plus size={20} /> Save activity
              </button>
            </section>

            <section className="p-5" style={card}>
              <h2 className="font-bold text-lg mb-2">Today's activities</h2>
              {todayStats.list.length === 0 ? (
                <p style={{ color: MUTED }}>Nothing logged yet.</p>
              ) : (
                <ul>
                  {todayStats.list.map((a, idx) => (
                    <li key={a.id} className="flex items-center gap-3 py-3" style={{ borderTop: idx ? `1px solid ${LINE}` : "none" }}>
                      <div className="flex-1">
                        <div className="font-semibold">
                          {ACT_TYPES[a.type].label} · {a.mins} min{a.km > 0 ? ` · ${a.km} km` : ""}
                        </div>
                        <div className="text-sm" style={{ color: MUTED }}>
                          {ACT_LEVELS[a.lvl]} · about {a.kcal} kcal{a.steps > 0 ? ` · about ${a.steps.toLocaleString()} steps` : ""} · {a.time}
                        </div>
                      </div>
                      <button onClick={() => deleteActivity(a.id)} aria-label={`Delete ${ACT_TYPES[a.type].label}`} style={{ color: ICON, padding: 8 }}>
                        <Trash2 size={18} />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </section>

            <section className="p-5" style={card}>
              <h2 className="font-bold text-lg">This week</h2>
              <p className="text-sm mb-3" style={{ color: MUTED }}>
                Step goal hit on {daysHit} of 7 days. Active minutes: {weekMins} this week.
              </p>
              <div className="relative" style={{ height: 120 }}>
                <div className="absolute inset-x-0" style={{ bottom: `${(profile.stepTarget / maxSteps) * 100}%`, borderTop: `2px dashed ${MUTED}`, opacity: 0.5 }} />
                <div className="absolute inset-0 flex items-end gap-2">
                  {weekDays.map((d) => (
                    <div
                      key={d.key}
                      title={`${d.steps.toLocaleString()} steps`}
                      style={{
                        flex: 1,
                        height: `${(d.steps / maxSteps) * 100}%`,
                        minHeight: d.steps > 0 ? 4 : 0,
                        borderRadius: 8,
                        background: d.steps >= profile.stepTarget ? STEPS : TROUGH2,
                        outline: d.today ? `2px solid ${PINE}` : "none",
                      }}
                    />
                  ))}
                </div>
              </div>
              <div className="flex gap-2 mt-2">
                {weekDays.map((d) => (
                  <div key={d.key} className="flex-1 text-center">
                    <div className="text-xs font-semibold" style={{ color: d.today ? PINE : MUTED }}>{d.label}</div>
                    <div className="text-xs" style={{ color: MUTED }}>{d.steps > 0 ? `${(d.steps / 1000).toFixed(1)}k` : "-"}</div>
                  </div>
                ))}
              </div>
              <p className="text-xs mt-3" style={{ color: MUTED }}>The dashed line is your daily step goal. Filled bars hit it.</p>
            </section>
          </div>
        )}

        {/* ===== ME ===== */}
        {tab === "me" && (
          <div className="flex flex-col gap-4">
            <section className="p-5 flex flex-col gap-3" style={card}>
              <div>
                <h2 className="font-bold text-lg">Weight check-in</h2>
                <p className="text-sm" style={{ color: MUTED }}>
                  Weigh yourself once a week, at the same time of day, and log it here.
                  {lastWeighIn ? ` Last check-in: ${new Date(lastWeighIn + "T00:00:00").toLocaleDateString(undefined, { day: "numeric", month: "short" })}.` : ""}
                </p>
              </div>
              {checkinDue && (
                <p className="text-sm font-semibold" style={{ color: PINE }}>It's been {daysSinceWeigh} days. Time for your weekly check-in.</p>
              )}
              <Stepper label="Today's weight" unit="kg" step={0.5} min={30} max={300} value={ciWeight} onChange={setCiWeight} color={INK} />
              <button onClick={saveCheckin} className="py-3 font-bold text-white" style={{ borderRadius: 16, background: BTNG }}>
                Save check-in
              </button>

              {weighIns.length >= 2 && (() => {
                const pts = weighIns.slice(-10).map((k) => ({ k, v: store.weights[k] }));
                const vals = pts.map((x) => x.v).concat(profile.targetWeight);
                const lo = Math.min(...vals) - 1;
                const hi = Math.max(...vals) + 1;
                const X = (i) => 14 + (pts.length === 1 ? 0 : (i * 262) / (pts.length - 1));
                const Y = (v) => 8 + (1 - (v - lo) / (hi - lo)) * 60;
                return (
                  <svg viewBox="0 0 300 84" role="img" aria-label="Your weigh-ins over time" style={{ width: "100%" }}>
                    <line x1="0" x2="300" y1={Y(profile.targetWeight)} y2={Y(profile.targetWeight)} style={{ stroke: MUTED }} strokeDasharray="4 4" strokeWidth="1" opacity="0.6" />
                    <polyline points={pts.map((x, i) => `${X(i)},${Y(x.v)}`).join(" ")} fill="none" style={{ stroke: PROTEIN }} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                    {pts.map((x, i) => (
                      <circle key={x.k} cx={X(i)} cy={Y(x.v)} r="3.5" style={{ fill: PROTEIN }} />
                    ))}
                    <text x="296" y={Y(profile.targetWeight) - 4} textAnchor="end" fontSize="10" style={{ fill: MUTED }}>
                      target {profile.targetWeight} kg
                    </text>
                  </svg>
                );
              })()}

              {checkin && checkin.tooSoon && (
                <p className="text-sm" style={{ color: MUTED }}>Log another weigh-in at least a week after your first to see how your plan is going.</p>
              )}
              {checkin && !checkin.tooSoon && (
                <div className="p-4 flex flex-col gap-2" style={{ background: MINT, borderRadius: 16 }}>
                  <p className="font-bold">
                    {Math.abs(checkin.rate) < 0.05
                      ? `Your weight has been steady over the last ${checkin.days} days.`
                      : `You're ${checkin.rate < 0 ? "losing" : "gaining"} about ${Math.abs(checkin.rate).toFixed(2)} kg a week (over ${checkin.days} days).`}
                  </p>
                  <p className="text-sm">{ciText}</p>
                  {checkin.delta !== 0 && !checkin.blocked && (
                    <button onClick={() => applyAdjust(checkin.delta)} className="py-3 font-bold text-white" style={{ borderRadius: 14, background: BTNG }}>
                      {checkin.delta > 0 ? `Add ${checkin.delta} kcal a day` : `Cut ${-checkin.delta} kcal a day`}
                    </button>
                  )}
                  {checkin.blocked && (
                    <p className="text-sm font-semibold">Your calories are already near the lowest suggested level, so try more steps instead of eating less.</p>
                  )}
                  <p className="text-xs" style={{ color: MUTED }}>
                    Weigh-ins vary from day to day, so look at the trend. If you're losing weight quickly without trying, or feel unwell, please talk to a doctor.
                  </p>
                </div>
              )}
              {profile.calAdjust !== 0 && (
                <p className="text-sm">
                  Your calorie target includes a check-in adjustment of {profile.calAdjust > 0 ? "+" : ""}{profile.calAdjust} kcal.{" "}
                  <button onClick={() => setProfile({ calAdjust: 0 })} className="font-semibold underline" style={{ color: PINE }}>Reset</button>
                </p>
              )}

              {weighIns.length > 0 && (
                <ul>
                  {[...weighIns].reverse().slice(0, 5).map((d, idx) => (
                    <li key={d} className="flex items-center justify-between py-2" style={{ borderTop: idx ? `1px solid ${LINE}` : "none" }}>
                      <span className="text-sm">{new Date(d + "T00:00:00").toLocaleDateString(undefined, { weekday: "short", day: "numeric", month: "short" })}</span>
                      <span className="flex items-center gap-3">
                        <span className="font-bold">{store.weights[d]} kg</span>
                        <button onClick={() => deleteWeighIn(d)} aria-label={`Delete weigh-in from ${d}`} style={{ color: ICON, padding: 4 }}>
                          <Trash2 size={16} />
                        </button>
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </section>

            <section className="p-5" style={card}>
              <h2 className="font-bold text-lg mb-1">About you</h2>
              <p className="text-sm mb-3" style={{ color: MUTED }}>Tap + or -, or tap a number to type it.</p>
              <p className="text-sm mb-2" style={{ color: MUTED }}>Sex (only used in the calorie formula)</p>
              <Seg
                label="Sex"
                value={profile.sex}
                onChange={(v) => setProfile({ sex: v })}
                options={[{ value: "female", label: "Female" }, { value: "male", label: "Male" }]}
              />
              <Stepper label="Age" unit="years" step={1} min={10} max={100} value={profile.age} onChange={(v) => setProfile({ age: v })} color={INK} />
              <div style={{ borderTop: `1px solid ${LINE}` }} />
              <Stepper label="Height" unit="cm" step={1} min={100} max={250} value={profile.height} onChange={(v) => setProfile({ height: v })} color={INK} />
              <div style={{ borderTop: `1px solid ${LINE}` }} />
              <Stepper label="Current weight" unit="kg" step={0.5} min={30} max={300} value={profile.weight} onChange={(v) => setProfile({ weight: v })} color={INK} />
              <div style={{ borderTop: `1px solid ${LINE}` }} />
              <Stepper label="Target weight" unit="kg (your goal)" step={0.5} min={30} max={300} value={profile.targetWeight} onChange={(v) => setProfile({ targetWeight: v })} color={PINE} />
              <h3 className="font-semibold mt-3 mb-2">How active are you?</h3>
              <div className="flex flex-col gap-2">
                {Object.entries(ACTIVITY).map(([k, a]) => {
                  const active = profile.activity === k;
                  return (
                    <button
                      key={k}
                      onClick={() => setProfile({ activity: k })}
                      aria-pressed={active}
                      className="text-left p-3"
                      style={{ borderRadius: 14, background: active ? BTNG : PANEL, color: active ? "#fff" : INK }}
                    >
                      <span className="font-bold block">{a.label}</span>
                      <span className="text-xs" style={{ color: active ? ONPINE : MUTED }}>{a.hint}</span>
                    </button>
                  );
                })}
              </div>
            </section>

            <section className="p-5" style={card}>
              <h2 className="font-bold text-lg mb-3">What's your goal?</h2>
              <Seg
                label="Goal"
                value={profile.goal}
                onChange={(g) => setProfile({ goal: g })}
                options={Object.entries(GOALS).map(([k, g]) => ({ value: k, label: g.label }))}
              />
            </section>

            <section className="p-5 flex flex-col gap-3" style={card}>
              <h2 className="font-bold text-lg">Suggested for you</h2>
              {!calc ? (
                <p style={{ color: MUTED }}>Choose your sex and check your age, height and weight above to see suggested targets.</p>
              ) : (
                <>
                  <div className="p-4" style={{ background: MINT, borderRadius: 16 }}>
                    <p className="font-bold">
                      {profile.goal === "maintain" || calc.diffKg === 0
                        ? `Stay around ${profile.weight} kg`
                        : calc.diffKg < 0
                        ? `Lose ${Math.abs(calc.diffKg)} kg`
                        : `Gain ${calc.diffKg} kg`}
                      <span className="font-normal"> ({profile.weight} kg to {calc.goalWeight} kg)</span>
                    </p>
                    {calc.weeks ? (
                      <p className="text-sm">
                        At about {calc.kgPerWeek.toFixed(2)} kg a week, that's roughly {calc.weeks} weeks (about {Math.max(1, Math.round(calc.weeks / 4.3))} months). Real progress varies.
                      </p>
                    ) : null}
                    {((profile.goal === "lose" && calc.diffKg >= 0) ||
                      (profile.goal === "build" && calc.diffKg <= 0) ||
                      (profile.goal === "maintain" && Math.abs(calc.diffKg) >= 1)) && (
                      <p className="text-sm font-semibold" style={{ color: OVER }}>
                        Your goal doesn't match your target weight. Change the goal or the target weight so they agree.
                      </p>
                    )}
                    {calc.targetBmi < 18.5 && (
                      <p className="text-sm font-semibold" style={{ color: OVER }}>
                        A target of {calc.goalWeight} kg would put your BMI in the underweight range. Please talk to a doctor or dietitian before aiming for it.
                      </p>
                    )}
                  </div>
                  <div className="p-3 text-sm" style={{ background: PANEL, borderRadius: 14 }}>
                    <span className="font-bold">BMI {calc.bmi.toFixed(1)}</span>, in the {bmiLabel(calc.bmi)}. BMI is a rough screen only. It can't tell muscle from fat, so it doesn't set your targets.
                  </div>
                  <p className="text-sm" style={{ color: MUTED }}>
                    You burn about {calc.maintain} kcal a day at your activity level ({calc.bmr} kcal at rest).
                  </p>
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="p-3" style={{ background: TINT_C, borderRadius: 14 }}>
                      <div className="text-xl font-bold" style={{ color: CAL }}>{calc.calories}</div>
                      <div className="text-xs" style={{ color: MUTED }}>kcal a day</div>
                    </div>
                    <div className="p-3" style={{ background: TINT_P, borderRadius: 14 }}>
                      <div className="text-xl font-bold" style={{ color: PROTEIN }}>{calc.protein}</div>
                      <div className="text-xs" style={{ color: MUTED }}>g protein</div>
                    </div>
                    <div className="p-3" style={{ background: TINT_W, borderRadius: 14 }}>
                      <div className="text-xl font-bold" style={{ color: WATERTXT }}>{(calc.water / 1000).toFixed(2)}</div>
                      <div className="text-xs" style={{ color: MUTED }}>litres water</div>
                    </div>
                  </div>
                  <p className="text-sm">
                    {profile.goal === "lose" && !calc.holdBack && `A gentle deficit of about ${calc.maintain - calc.calories} kcal a day, which is roughly 0.3 to 0.5 kg of loss a week.`}
                    {profile.goal === "maintain" && "This matches what you burn, so your weight should stay steady."}
                    {profile.goal === "build" && `A small surplus of about ${calc.calories - calc.maintain} kcal a day to support muscle gain.`}
                    {profile.goal === "lose" && calc.holdBack && "Your BMI is in the underweight range, so no calorie deficit is suggested. Please talk to a doctor or dietitian before cutting calories."}
                  </p>
                  {calc.floorHit && (
                    <p className="text-sm" style={{ color: MUTED }}>
                      The deficit was limited so you stay at or above {calc.floor} kcal, a common minimum without medical supervision.
                    </p>
                  )}
                  <p className="text-sm" style={{ color: MUTED }}>
                    Your daily water, calories and protein update automatically when you change your goal or details. You can still fine-tune them below.
                  </p>
                  {calc.provisional && (
                    <p className="text-sm font-semibold" style={{ color: PINE }}>
                      Pick your sex above for a more accurate estimate. These numbers are a middle-of-the-road guess until then.
                    </p>
                  )}
                  <button
                    onClick={() => setProfile({ calTarget: calc.calories, proTarget: calc.protein, waterTarget: calc.water, stepTarget: calc.steps, activeTarget: calc.active })}
                    className="py-4 font-bold text-white"
                    style={{ borderRadius: 18, background: BTNG }}
                  >
                    Reset to suggested targets
                  </button>
                  <p className="text-xs" style={{ color: MUTED }}>
                    Calories use the Mifflin-St Jeor formula. Water is about 33 ml per kg plus extra for exercise, and a little more when cutting or building. You'll need more in hot weather. These are general estimates, not medical advice.
                  </p>
                </>
              )}
            </section>

            <section className="p-5" style={card}>
              <Stepper label="Daily water" unit="ml" step={250} min={500} max={8000} value={profile.waterTarget} onChange={(v) => setProfile({ waterTarget: v })} color={WATER} />
              <div style={{ borderTop: `1px solid ${LINE}` }} />
              <Stepper label="Daily calories" unit="kcal" step={50} min={800} max={6000} value={profile.calTarget} onChange={(v) => setProfile({ calTarget: v })} color={CAL} />
              <div style={{ borderTop: `1px solid ${LINE}` }} />
              <Stepper label="Daily protein" unit="grams" step={5} min={20} max={400} value={profile.proTarget} onChange={(v) => setProfile({ proTarget: v })} color={PROTEIN} />
              <div style={{ borderTop: `1px solid ${LINE}` }} />
              <Stepper label="Daily steps" unit="steps" step={500} min={1000} max={40000} value={profile.stepTarget} onChange={(v) => setProfile({ stepTarget: v })} color={STEPS} />
              <div style={{ borderTop: `1px solid ${LINE}` }} />
              <Stepper label="Active minutes" unit="minutes a day" step={5} min={5} max={300} value={profile.activeTarget} onChange={(v) => setProfile({ activeTarget: v })} color={ACTIVE} />
              <div style={{ borderTop: `1px solid ${LINE}` }} />
              <Stepper label="Training days" unit="strength sessions a week" step={1} min={2} max={5} value={profile.trainDays} onChange={(v) => setProfile({ trainDays: v })} color={PINE} />
              <button
                onClick={() => setProfile({ proTarget: Math.round(profile.weight * GOALS[profile.goal].perKg) })}
                className="w-full mt-3 py-3 font-bold"
                style={{ borderRadius: 16, background: MINT, color: PINE }}
              >
                Set protein from my weight and goal
              </button>
              <p className="text-xs mt-3" style={{ color: MUTED }}>
                These are general estimates, not medical advice. A dietitian or doctor can set numbers that fit you.
              </p>
            </section>

            <section className="p-5 flex flex-col gap-3" style={card}>
              <h2 className="font-bold text-lg">Appearance</h2>
              <Seg
                label="Appearance"
                value={look}
                onChange={(v) => setStore((st) => ({ ...st, look: v }))}
                options={[{ value: "light", label: "Light" }, { value: "dark", label: "Dark" }, { value: "neon", label: "Neon" }, { value: "auto", label: "Auto" }]}
              />
              <p className="text-sm" style={{ color: MUTED }}>Dark is a neutral charcoal look. Neon is the purple glow. Auto switches between Light and Dark with your phone's setting.</p>
            </section>
          </div>
        )}

        {tab !== "food" && (
          <p className="text-xs mt-6 text-center" style={{ color: MUTED }}>
            Photo and text estimates are approximate.
          </p>
        )}
      </div>
      </main>

      {/* Bottom nav */}
      <nav
        className="shrink-0 w-full flex justify-center"
        style={{ background: CARD, boxShadow: "var(--nav-shadow)", borderTop: `1px solid ${LINE}`, paddingBottom: "env(safe-area-inset-bottom)" }}
        aria-label="Main"
      >
        <div className="w-full max-w-md flex px-2">
          {navBtn("food", Utensils, "Food")}
          {navBtn("lift", Dumbbell, "Workout")}
          {navBtn("mach", Cog, "Machines")}
          {navBtn("act", ActivityIcon, "Activity")}
          {navBtn("me", User, "Goals")}
        </div>
      </nav>

      {/* Timer pill */}
      {timer && (
        <div className="fixed inset-x-0 flex justify-center pointer-events-none" style={{ top: "calc(env(safe-area-inset-top) + 8px)", zIndex: 60 }}>
          <div
            className="pointer-events-auto flex items-center gap-3 px-4 py-3 text-white"
            style={{ borderRadius: 24, background: timer.done ? BTNP : BTNG, boxShadow: "0 8px 20px rgba(60,15,84,0.35)" }}
            role="timer"
          >
            <Timer size={20} />
            {timer.mode === "watch" && (
              <>
                <span>
                  <span className="text-xs block" style={{ opacity: 0.8 }}>Timing set · {timer.label}</span>
                  <span className="text-xl font-bold">{fmt((now - timer.startAt) / 1000)}</span>
                </span>
                <button onClick={stopWatch} className="px-3 py-2 text-sm font-bold" style={{ background: "#fff", color: "#3c0f54", borderRadius: 12 }}>
                  Stop
                </button>
              </>
            )}
            {timer.mode === "rest" && !timer.done && (
              <>
                <span>
                  <span className="text-xs block" style={{ opacity: 0.8 }}>Rest · {timer.label}</span>
                  <span className="text-xl font-bold">{fmt(Math.ceil((timer.endAt - now) / 1000))}</span>
                </span>
                <button onClick={() => setTimer({ ...timer, endAt: timer.endAt + 15000 })} className="px-3 py-2 text-sm font-bold" style={{ background: "rgba(255,255,255,0.2)", borderRadius: 12 }}>
                  +15s
                </button>
                <button onClick={() => setTimer(null)} className="px-3 py-2 text-sm font-bold" style={{ background: "#fff", color: "#3c0f54", borderRadius: 12 }}>
                  Skip
                </button>
              </>
            )}
            {timer.mode === "rest" && timer.done && (
              <>
                <span className="font-bold">Rest over. Next set!</span>
                <button onClick={() => setTimer(null)} className="px-3 py-2 text-sm font-bold" style={{ background: "#fff", color: "#3c0f54", borderRadius: 12 }}>
                  Dismiss
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Machine detail sheet */}
      {sel && (
        <div className="fixed inset-0 flex items-end justify-center" style={{ background: "rgba(20,6,34,0.55)", zIndex: 50 }} onClick={() => setSelMachine(null)}>
          <div
            role="dialog"
            aria-label={sel.name}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md p-5 flex flex-col gap-4 overflow-y-auto"
            style={{ background: CARD, borderTopLeftRadius: 28, borderTopRightRadius: 28, maxHeight: "92dvh", overscrollBehavior: "contain", paddingBottom: "calc(20px + env(safe-area-inset-bottom))" }}
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <h2 className="text-xl font-bold" style={{ color: PINE }}>{sel.name}</h2>
                <span className="text-sm" style={{ color: MUTED }}>{sel.body}</span>
              </div>
              <button onClick={() => setSelMachine(null)} aria-label="Close" style={{ padding: 8, color: MUTED }}>
                <X size={22} />
              </button>
            </div>

            <div className="p-3" style={{ background: PANEL, borderRadius: 18 }}>
              <MachineArt id={sel.id} name={sel.name} mode={artPlay ? "play" : "static"} />
              <div className="flex items-center justify-between gap-2 mt-1">
                <p className="text-xs" style={{ color: MUTED }}>
                  {artPlay ? "Lift 2s, squeeze 1s, lower 3s" : "Faint figure = starting position"}
                </p>
                <button
                  onClick={() => setArtPlay(!artPlay)}
                  className="flex items-center gap-1 px-3 py-2 text-sm font-bold shrink-0"
                  style={{ borderRadius: 12, background: CARD, color: PINE, border: `1px solid ${LINE}` }}
                >
                  {artPlay ? <Square size={14} /> : <Play size={14} />} {artPlay ? "Pause" : "Play movement"}
                </button>
              </div>
            </div>

            <div className="flex flex-col items-center p-3" style={{ background: PANEL, borderRadius: 18 }}>
              <BodyMap primary={sel.primary} secondary={sel.secondary} />
              <p className="text-sm mt-1 text-center">
                <span className="font-bold" style={{ color: PROTEIN }}>Main target:</span> {sel.primary.map((x) => MUSCLE_LABEL[x]).join(", ")}
                {sel.secondary.length > 0 && (
                  <>
                    <br />
                    <span style={{ color: MUTED }}>Also works: {sel.secondary.map((x) => MUSCLE_LABEL[x]).join(", ")}</span>
                  </>
                )}
              </p>
            </div>

            <div className="p-3" style={{ background: PANEL, borderRadius: 18 }}>
              <h3 className="font-bold mb-2">Your gym's machine</h3>
              <input ref={machPhotoRef} type="file" accept="image/*" onChange={onPickMachPhoto} className="hidden" />
              {machPhoto ? (
                <>
                  <img src={machPhoto} alt={`Your photo of the ${sel.name}`} style={{ width: "100%", maxHeight: 220, objectFit: "cover", borderRadius: 14 }} />
                  <div className="flex gap-4 mt-2">
                    <button onClick={() => machPhotoRef.current?.click()} className="text-sm font-semibold underline" style={{ color: MUTED }}>
                      Change photo
                    </button>
                    <button onClick={removeMachPhoto} className="text-sm font-semibold underline" style={{ color: MUTED }}>
                      Remove
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <p className="text-sm mb-2" style={{ color: MUTED }}>
                    Snap a photo of this machine at your gym so you can spot it quickly next time.
                  </p>
                  <button
                    onClick={() => machPhotoRef.current?.click()}
                    className="flex items-center gap-2 px-4 py-3 font-bold"
                    style={{ borderRadius: 16, background: MINT, color: PINE }}
                  >
                    <Camera size={18} /> Add a photo
                  </button>
                </>
              )}
            </div>

            <div>
              <h3 className="font-bold mb-1">What it helps with</h3>
              <p>{sel.does}</p>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="p-3" style={{ background: TINT_P, borderRadius: 14 }}>
                <div className="font-bold" style={{ color: PROTEIN }}>{sel.setsMin === sel.setsMax ? sel.setsMin : `${sel.setsMin}-${sel.setsMax}`}</div>
                <div className="text-xs" style={{ color: MUTED }}>sets</div>
              </div>
              <div className="p-3" style={{ background: TINT_P, borderRadius: 14 }}>
                <div className="font-bold" style={{ color: PROTEIN }}>{sel.repsMin}-{sel.repsMax}</div>
                <div className="text-xs" style={{ color: MUTED }}>reps</div>
              </div>
              <div className="p-3" style={{ background: TINT_P, borderRadius: 14 }}>
                <div className="font-bold" style={{ color: PROTEIN }}>{sel.rest}s</div>
                <div className="text-xs" style={{ color: MUTED }}>rest</div>
              </div>
            </div>

            {/* Log */}
            <div className="p-4" style={{ border: `1.5px solid ${LINE}`, borderRadius: 20 }}>
              <div className="flex items-baseline justify-between">
                <h3 className="font-bold">Log your sets</h3>
                <span className="text-sm font-semibold" style={{ color: MUTED }}>
                  {todaySets.filter((x) => x.mid === sel.id).length} done today
                </span>
              </div>
              <Stepper label="Reps" unit={`aim for ${sel.repsMin}-${sel.repsMax}`} step={1} min={1} max={100} value={logReps} onChange={setLogReps} color={PROTEIN} />
              <div style={{ borderTop: `1px solid ${LINE}` }} />
              <Stepper label="Weight" unit="kg (0 for bodyweight)" step={2.5} min={0} max={500} value={logWeight} onChange={setLogWeight} color={INK} />
              <div className="flex gap-2 mt-2">
                {timer && timer.mode === "watch" ? (
                  <button onClick={stopWatch} className="flex items-center justify-center gap-2 px-4 py-4 font-bold" style={{ borderRadius: 18, background: MINT, color: PINE }}>
                    <Square size={18} /> Stop timer
                  </button>
                ) : (
                  <button onClick={() => startWatch(sel.name)} className="flex items-center justify-center gap-2 px-4 py-4 font-bold" style={{ borderRadius: 18, background: MINT, color: PINE }}>
                    <Play size={18} /> Time my set
                  </button>
                )}
                <button onClick={() => logSet(sel)} className="flex-1 flex items-center justify-center gap-2 py-4 font-bold text-white" style={{ borderRadius: 18, background: BTNP }}>
                  <Plus size={20} /> Log set
                </button>
              </div>
              <p className="text-xs mt-2" style={{ color: MUTED }}>Logging a set starts a {sel.rest}-second rest timer automatically.</p>
              <button
                onClick={() => startFormCheck(logReps)}
                className="w-full flex items-center justify-center gap-2 py-3 mt-3 font-bold"
                style={{ borderRadius: 16, border: `1.5px solid ${PINE}`, color: PINE }}
              >
                <Timer size={18} /> Guided form check ({logReps} reps)
              </button>

              {todaySets.filter((x) => x.mid === sel.id).length >= sel.setsMax && (
                <p className="text-sm mt-2 font-semibold" style={{ color: PINE }}>
                  You've reached the top of the recommended sets for this machine today.
                </p>
              )}

              <ul className="mt-2">
                {todaySets
                  .filter((x) => x.mid === sel.id)
                  .map((x, idx) => (
                    <li key={x.id} className="flex items-center gap-2 py-2" style={{ borderTop: `1px solid ${LINE}` }}>
                      <span className="flex-1 text-sm">
                        <span className="font-bold">Set {idx + 1}</span>: {x.reps} reps{x.weight > 0 ? ` × ${x.weight} kg` : ""}
                        {x.secs > 0 ? ` · ${fmt(x.secs)}` : ""}
                        <span style={{ color: MUTED }}> · {x.time}</span>
                      </span>
                      <button onClick={() => deleteSet(x.id)} aria-label={`Delete set ${idx + 1}`} style={{ color: ICON, padding: 6 }}>
                        <Trash2 size={16} />
                      </button>
                    </li>
                  ))}
              </ul>
            </div>

            <div>
              <h3 className="font-bold mb-2">How to use it</h3>
              <ol className="flex flex-col gap-2">
                {sel.steps.map((st, i) => (
                  <li key={i} className="flex gap-3">
                    <span className="flex items-center justify-center shrink-0 text-sm font-bold text-white" style={{ width: 26, height: 26, borderRadius: 13, background: BTNG }}>
                      {i + 1}
                    </span>
                    <span>{st}</span>
                  </li>
                ))}
              </ol>
            </div>

            <p className="p-3 text-sm" style={{ background: TINT_C, borderRadius: 14 }}>
              <span className="font-bold">Watch out:</span> {sel.tip}
            </p>

            <div className="p-4 flex flex-col gap-3" style={{ border: `1.5px solid ${LINE}`, borderRadius: 20 }}>
              <div>
                <h3 className="font-bold flex items-center gap-2">
                  <Sparkles size={18} style={{ color: PROTEIN }} /> Ask the AI coach
                </h3>
                <p className="text-sm" style={{ color: MUTED }}>
                  Ask anything about this machine, or add a photo of your setup to get feedback on seat position and alignment.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                {["How heavy should I start?", "How do I know I'm doing it right?", "What mistakes should I avoid?"].map((q) => (
                  <button
                    key={q}
                    onClick={() => {
                      setCoachQ(q);
                      askCoach(q);
                    }}
                    disabled={coachLoading}
                    className="px-3 py-2 text-sm font-semibold"
                    style={{ borderRadius: 14, background: PANEL, color: INK }}
                  >
                    {q}
                  </button>
                ))}
              </div>
              <textarea
                value={coachQ}
                onChange={(e) => setCoachQ(e.target.value)}
                rows={2}
                placeholder="Or type your own question"
                aria-label="Question for the AI coach"
                className="px-4 py-3 outline-none"
                style={inputStyle}
              />
              {coachImage && (
                <div className="relative self-start">
                  <img src={coachImage.preview} alt="Your setup" style={{ maxHeight: 140, borderRadius: 14 }} />
                  <button onClick={() => setCoachImage(null)} aria-label="Remove photo" className="absolute top-2 right-2 p-1" style={{ background: CARD, color: PINE, border: `1px solid ${LINE}`, borderRadius: 12 }}>
                    <X size={14} />
                  </button>
                </div>
              )}
              <input ref={coachFileRef} type="file" accept="image/*" onChange={onPickCoachImage} className="hidden" />
              <div className="flex gap-2">
                <button onClick={() => coachFileRef.current?.click()} className="flex items-center gap-2 px-4 py-3 font-bold" style={{ borderRadius: 16, background: MINT, color: PINE }}>
                  <Camera size={18} /> {coachImage ? "Change" : "Photo"}
                </button>
                <button
                  onClick={() => askCoach()}
                  disabled={coachLoading}
                  className="flex-1 flex items-center justify-center gap-2 py-3 font-bold text-white"
                  style={{ borderRadius: 16, background: BTNG, opacity: coachLoading ? 0.7 : 1 }}
                >
                  {coachLoading ? <Loader2 size={18} className="animate-spin" /> : <Sparkles size={18} />}
                  {coachLoading ? "Thinking..." : "Ask coach"}
                </button>
              </div>
              {coachError && <p className="text-sm" style={{ color: OVER }}>{coachError}</p>}
              {coachAnswer && (
                <p className="p-3" style={{ background: TINT_P, borderRadius: 14 }}>{coachAnswer}</p>
              )}
            </div>

            <div className="p-4 flex flex-col gap-3" style={{ border: `1.5px solid ${LINE}`, borderRadius: 20 }}>
              <h3 className="font-bold">My video</h3>
              {(store.videos || {})[sel.id] ? (
                <>
                  <a
                    href={store.videos[sel.id]}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 py-4 font-bold text-white"
                    style={{ borderRadius: 18, background: BTNP }}
                  >
                    <Play size={18} /> Watch my saved video
                  </a>
                  <p className="text-xs break-all" style={{ color: MUTED }}>{store.videos[sel.id]}</p>
                  <button onClick={() => saveVideo("")} className="text-sm font-semibold underline self-start" style={{ color: MUTED }}>
                    Remove video
                  </button>
                </>
              ) : (
                <>
                  <p className="text-sm" style={{ color: MUTED }}>
                    Found a video you like? Paste its link and it will be saved for this machine.
                  </p>
                  <div className="flex gap-2">
                    <input
                      value={videoDraft}
                      onChange={(e) => setVideoDraft(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && saveVideo(videoDraft)}
                      placeholder="https://..."
                      inputMode="url"
                      aria-label="Video link"
                      className="flex-1 px-4 py-3 outline-none"
                      style={inputStyle}
                    />
                    <button onClick={() => saveVideo(videoDraft)} className="px-5 py-3 font-bold text-white" style={{ borderRadius: 14, background: BTNG }}>
                      Save
                    </button>
                  </div>
                  {videoError && <p className="text-sm" style={{ color: OVER }}>{videoError}</p>}
                </>
              )}
            </div>

            <a
              href={videoUrl(sel.name)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 py-4 font-bold"
              style={{ borderRadius: 18, background: MINT, color: PINE }}
            >
              <ExternalLink size={18} /> Watch a video demo
            </a>
            <p className="text-xs text-center" style={{ color: MUTED }}>
              Start light and ask gym staff to check your form. Stop if anything hurts.
            </p>
          </div>
        </div>
      )}

      {/* Guided form check */}
      {fc && sel && (() => {
        const remaining = Math.max(0, (fc.phaseEnd - now) / 1000);
        const pct = fc.phaseMs ? Math.min(100, (1 - remaining / (fc.phaseMs / 1000)) * 100) : 0;
        const muscle = MUSCLE_LABEL[sel.primary[0]].toLowerCase();
        const cues = [sel.tip, "Breathe out as you lift and in as you lower.", `Feel it in your ${muscle}, not your joints.`, "Keep it smooth. No swinging or bouncing."];
        const label = { ready: "Get set", up: "Lift", hold: "Squeeze", down: "Lower", done: "Set complete" }[fc.phase];
        const sub = {
          ready: sel.steps[0],
          up: "Smooth and controlled",
          hold: `Squeeze your ${muscle}`,
          down: "Slowly, take your time",
          done: `${fc.reps} reps done. Nice work.`,
        }[fc.phase];
        return (
          <div
            role="dialog"
            aria-label="Guided form check"
            className="fixed inset-0 flex flex-col items-center justify-between p-6 text-white text-center"
            style={{ background: fc.phase === "hold" ? BTNP : BTNG, zIndex: 55, transition: "background 200ms" }}
          >
            <div className="w-full max-w-md flex items-center justify-between">
              <span className="font-semibold">{sel.name}</span>
              <button onClick={() => setFc(null)} aria-label="Cancel form check" style={{ padding: 8 }}>
                <X size={24} />
              </button>
            </div>

            <div className="flex flex-col items-center gap-3 max-w-md" aria-live="polite">
              <div className="p-2" style={{ background: CARD, borderRadius: 18, width: 200 }}>
                <MachineArt id={sel.id} name={sel.name} mode="sync" sync={fc} />
              </div>
              <div className="text-5xl font-bold">{label}</div>
              <div className="text-lg" style={{ opacity: 0.9 }}>{sub}</div>
              {fc.phase !== "done" && <div className="font-bold" style={{ fontSize: 72, lineHeight: 1 }}>{Math.ceil(remaining)}</div>}
              {fc.phase !== "done" && (
                <div className="overflow-hidden" style={{ width: 220, height: 8, borderRadius: 4, background: "rgba(255,255,255,0.25)" }}>
                  <div style={{ width: `${pct}%`, height: "100%", background: "#fff" }} />
                </div>
              )}
            </div>

            <div className="w-full max-w-md flex flex-col gap-3">
              {fc.phase !== "done" ? (
                <>
                  <p className="p-3 text-sm" style={{ background: "rgba(255,255,255,0.15)", borderRadius: 14 }}>
                    {cues[(fc.rep - 1) % cues.length]}
                  </p>
                  <p className="font-bold text-lg">
                    {fc.phase === "ready" ? `${fc.reps} reps coming up` : `Rep ${fc.rep} of ${fc.reps}`}
                  </p>
                </>
              ) : (
                <>
                  <button
                    onClick={() => {
                      setLogReps(fc.reps);
                      logSet(sel, fc.reps);
                      setFc(null);
                    }}
                    className="py-4 font-bold"
                    style={{ borderRadius: 18, background: "#fff", color: "#3c0f54" }}
                  >
                    Log {fc.reps} reps
                  </button>
                  <button onClick={() => startFormCheck(fc.reps)} className="py-3 font-bold" style={{ borderRadius: 18, background: "rgba(255,255,255,0.2)" }}>
                    Do it again
                  </button>
                  <button onClick={() => setFc(null)} className="py-2 font-semibold" style={{ opacity: 0.85 }}>
                    Close without logging
                  </button>
                </>
              )}
            </div>
          </div>
        );
      })()}



      {/* Meals today sheet */}
      {showMeals && (
        <BottomSheet title="Meals today" onClose={() => setShowMeals(false)}>
          <p className="text-sm -mt-2" style={{ color: MUTED }}>
            {totals.cal} kcal · <span style={{ color: PROTEIN, fontWeight: 600 }}>{totals.pro} g protein</span>
          </p>
              {meals.length === 0 ? (
                <p style={{ color: MUTED }}>Nothing logged yet today.</p>
              ) : (
                <ul>
                  {meals.map((m, idx) => (
                    <li key={m.id} className="flex items-center gap-3 py-3" style={{ borderTop: idx ? `1px solid ${LINE}` : "none" }}>
                      <div className="flex-1">
                        <div className="font-semibold">{m.name}</div>
                        <div className="text-sm" style={{ color: MUTED }}>
                          {m.type ? `${m.type} · ` : ""}{m.time} · <span style={{ color: PROTEIN, fontWeight: 600 }}>{m.protein} g protein</span> · {m.calories} kcal
                        </div>
                      </div>
                      <button onClick={() => deleteMeal(m.id)} aria-label={`Delete ${m.name}`} style={{ color: ICON, padding: 8 }}>
                        <Trash2 size={18} />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
          <button
            onClick={() => {
              setShowMeals(false);
              setLogType(inferType());
              setShowLog(true);
            }}
            className="flex items-center justify-center gap-2 py-3 font-bold"
            style={{ borderRadius: 16, background: MINT, color: PINE }}
          >
            <Plus size={18} /> Log food
          </button>
        </BottomSheet>
      )}

      {/* Meal ideas sheet */}
      {showIdeas && (
        <BottomSheet title="Meal ideas" icon={<Sparkles size={20} style={{ color: PINE }} />} onClose={() => setShowIdeas(false)}>
          <p className="text-sm -mt-2" style={{ color: MUTED }}>Ideas sized to what you have left today.</p>
              <Seg label="Meal" value={ideaCat} onChange={setIdeaCat} options={MEAL_TYPES.map((t) => ({ value: t, label: t }))} />
              <p className="text-sm font-semibold">
                {budget.cal > 0
                  ? `About ${budget.cal} kcal and ${budget.pro} g protein for ${ideaCat.toLowerCase()}`
                  : `You're at your calorie limit, so ${ideaCat.toLowerCase()} ideas will be very light.`}
              </p>

              {!catIdeas && (
                <button
                  onClick={() => getIdeas(ideaCat)}
                  disabled={!!ideasLoading}
                  className="flex items-center justify-center gap-2 py-3 font-bold"
                  style={{ borderRadius: 16, background: MINT, color: PINE, opacity: ideasLoading ? 0.7 : 1 }}
                >
                  {ideasLoading === ideaCat ? <Loader2 size={18} className="animate-spin" /> : <Sparkles size={18} />}
                  {ideasLoading === ideaCat ? "Finding ideas..." : `Suggest ${ideaCat.toLowerCase()} ideas`}
                </button>
              )}
              {ideasError && <p className="text-sm" style={{ color: OVER }}>{ideasError}</p>}

              {catIdeas && (
                <>
                  <ul className="flex flex-col gap-2">
                    {catIdeas.map((i, idx) => (
                      <li key={idx} className="p-3 flex items-center gap-3" style={{ background: PANEL, borderRadius: 16 }}>
                        <div className="flex-1">
                          <div className="font-semibold">{i.name}</div>
                          <div className="text-sm" style={{ color: MUTED }}>
                            <span style={{ color: PROTEIN, fontWeight: 600 }}>{num(i.protein_g)} g protein</span> · {num(i.calories)} kcal
                          </div>
                          <div className="text-sm">{i.why}</div>
                        </div>
                        <button onClick={() => logIdea(i, ideaCat)} className="px-4 py-2 text-sm font-bold text-white" style={{ background: BTNG, borderRadius: 12 }}>
                          Log
                        </button>
                      </li>
                    ))}
                  </ul>
                  <button
                    onClick={() => getIdeas(ideaCat)}
                    disabled={!!ideasLoading}
                    className="flex items-center justify-center gap-2 text-sm font-semibold"
                    style={{ color: MUTED }}
                  >
                    {ideasLoading === ideaCat ? <Loader2 size={14} className="animate-spin" /> : <RotateCcw size={14} />}
                    Show different ideas
                  </button>
                </>
              )}
          <p className="p-3 text-sm" style={{ background: PANEL, borderRadius: 14 }}>{tip}</p>
        </BottomSheet>
      )}

      {/* Log sheet */}
      {showLog && (
        <div className="fixed inset-0 flex items-end justify-center" style={{ background: "rgba(20,6,34,0.55)", zIndex: 50 }} onClick={closeLog}>
          <div
            role="dialog"
            aria-label="Log food"
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md p-5 flex flex-col gap-4 overflow-y-auto"
            style={{ background: CARD, borderTopLeftRadius: 28, borderTopRightRadius: 28, maxHeight: "92dvh", overscrollBehavior: "contain", paddingBottom: "calc(20px + env(safe-area-inset-bottom))" }}
          >
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold" style={{ color: PINE }}>Log food or drink</h2>
              <button onClick={closeLog} aria-label="Close" style={{ padding: 8, color: MUTED }}>
                <X size={22} />
              </button>
            </div>

            {!draft && product && (
              <PortionPicker
                product={product}
                onUse={(d) => {
                  setDraft({ ...d });
                  setProduct(null);
                }}
                onBack={() => setProduct(null)}
              />
            )}

            {!draft && !product && (
              <>
                <div>
                  <p className="text-sm font-semibold mb-2" style={{ color: MUTED }}>Which meal is this?</p>
                  <Seg label="Meal type" value={logType} onChange={setLogType} options={MEAL_TYPES.map((t) => ({ value: t, label: t }))} />
                </div>

                {store.recent?.length > 0 && (
                  <div>
                    <p className="text-sm font-semibold mb-2" style={{ color: MUTED }}>Eat it again</p>
                    <div className="flex flex-wrap gap-2">
                      {store.recent.map((r) => (
                        <button
                          key={r.name}
                          onClick={() => {
                            addMeal({ ...r, type: logType });
                            closeLog();
                          }}
                          className="px-3 py-2 text-sm font-semibold text-left"
                          style={{ background: PANEL, borderRadius: 14 }}
                        >
                          {r.name}
                          <span className="block text-xs font-normal" style={{ color: MUTED }}>{r.protein} g · {r.calories} kcal</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <button
                  onClick={() => {
                    setMealError("");
                    setScanning(true);
                  }}
                  disabled={lookingUp}
                  className="flex items-center justify-center gap-2 py-4 font-bold"
                  style={{ borderRadius: 18, background: PANEL, color: PINE, border: `1.5px solid ${LINE}` }}
                >
                  <ScanBarcode size={22} /> Scan a barcode
                  <span className="text-sm font-semibold" style={{ color: MUTED }}>· exact label numbers</span>
                </button>
                {lookingUp && <LookupSpinner />}

                <input
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && estimate()}
                  placeholder="Describe it: 2 eggs, toast, flat white"
                  autoFocus={focusDescribe}
                  className="px-4 py-4 outline-none"
                  style={inputStyle}
                  aria-label="Describe your meal"
                />

                {image && (
                  <div className="relative self-start">
                    <img src={image.preview} alt="Meal to analyze" style={{ maxHeight: 160, borderRadius: 16 }} />
                    <button onClick={() => setImage(null)} aria-label="Remove photo" className="absolute top-2 right-2 p-1" style={{ background: CARD, color: PINE, border: `1px solid ${LINE}`, borderRadius: 12 }}>
                      <X size={14} />
                    </button>
                  </div>
                )}

                <input ref={fileRef} type="file" accept="image/*" onChange={onPickImage} className="hidden" />
                <div className="flex gap-2">
                  <button
                    onClick={() => fileRef.current?.click()}
                    className="flex items-center gap-2 px-5 py-4 font-bold"
                    style={{ borderRadius: 18, background: MINT, color: PINE }}
                  >
                    <Camera size={20} /> {image ? "Change photo" : "Photo"}
                  </button>
                  <button
                    onClick={estimate}
                    disabled={estimating}
                    className="flex-1 flex items-center justify-center gap-2 py-4 font-bold text-white"
                    style={{ borderRadius: 18, background: BTNG, opacity: estimating ? 0.7 : 1 }}
                  >
                    {estimating ? <Loader2 size={20} className="animate-spin" /> : <Sparkles size={20} />}
                    {estimating ? "Estimating..." : "Estimate"}
                  </button>
                </div>
                {mealError && <p className="text-sm" style={{ color: OVER }}>{mealError}</p>}
                <p className="text-xs text-center" style={{ color: MUTED }}>Photo and text estimates are approximate. Barcode numbers come from the label.</p>
              </>
            )}

            {draft && (
              <div className="flex flex-col gap-3">
                <input
                  value={draft.name}
                  onChange={(e) => setDraft({ ...draft, name: e.target.value })}
                  className="text-xl font-bold outline-none px-1"
                  aria-label="Meal name"
                  style={{ color: INK }}
                />
                <div className="grid grid-cols-2 gap-3">
                  <label className="flex flex-col gap-1 text-sm font-semibold" style={{ color: PROTEIN }}>
                    Protein (g)
                    <input type="number" value={draft.protein} onChange={(e) => setDraft({ ...draft, protein: num(e.target.value) })} className="px-3 py-3 text-xl font-bold" style={inputStyle} />
                  </label>
                  <label className="flex flex-col gap-1 text-sm font-semibold" style={{ color: CAL }}>
                    Calories (kcal)
                    <input type="number" value={draft.calories} onChange={(e) => setDraft({ ...draft, calories: num(e.target.value) })} className="px-3 py-3 text-xl font-bold" style={inputStyle} />
                  </label>
                </div>
                <p className="text-sm" style={{ color: MUTED }}>
                  {draft.note} Roughly {draft.carbs} g carbs and {draft.fat} g fat. Change the numbers if they look off.
                </p>
                <button onClick={confirmDraft} className="flex items-center justify-center gap-2 py-4 font-bold text-white" style={{ borderRadius: 18, background: BTNP }}>
                  <Plus size={20} /> Add to today
                </button>
                <button onClick={() => setDraft(null)} className="py-2 font-semibold" style={{ color: MUTED }}>
                  Try again
                </button>
              </div>
            )}
          </div>
          {scanning && <BarcodeScanner onCode={findProduct} onClose={() => setScanning(false)} />}
        </div>
      )}
    </div>
  );
}
