import { useState, useEffect } from "react";
import {
  MW_NAME, MW_TAGLINE, MW_TRACKS, MW_GROUPS, MW_AREAS, MW_URGENT, MW_SOON, MW_SYMPTOMS, MW_SYMPTOM_GROUPS,
  MW_STOP, MW_TRACK_SAFETY, MW_RESULT, MW_EXERCISES,
} from "./moveWellContent.js";

/*
  Props
    data        saved state for this section ({} the first time)
    onData      called with the whole new state object whenever something changes (save it)
    onClose     called when the person leaves the section
    showDrafts  true = also show exercises that are not approved yet (preview only, never for real users)
*/

const MWC = {
  bg: "var(--bg, #f8f1fb)",
  card: "var(--card, #ffffff)",
  ink: "var(--ink, #1e0a2e)",
  muted: "var(--muted, #6b5a80)",
  line: "var(--line, #e9dbf2)",
  pine: "var(--pine, #3c0f54)",
  btn: "var(--btn-grad, #3c0f54)",
  mint: "var(--mint, #f9ddf0)",
  over: "var(--over, #d64545)",
  tintC: "var(--tint-c, #ffe6f3)",
};
const MW_FONT = "ui-rounded, 'SF Pro Rounded', Nunito, system-ui, -apple-system, 'Segoe UI', sans-serif";
const mwCard = { background: MWC.card, border: `1px solid ${MWC.line}`, borderRadius: 24, padding: 20, boxShadow: "var(--card-shadow, none)" };
const mwPrimary = { width: "100%", padding: "16px 0", border: "none", borderRadius: 18, background: MWC.btn, color: "#fff", fontWeight: 700, fontSize: 17, cursor: "pointer" };
const mwGhost = { width: "100%", padding: "14px 0", borderRadius: 18, border: `1.5px solid ${MWC.line}`, background: "transparent", color: MWC.ink, fontWeight: 700, fontSize: 16, cursor: "pointer" };
const MW_PLACEHOLDER = "[Physiotherapist to add this]";

const mwToday = () => new Date().toLocaleDateString("en-CA");

// Works out which tracks to suggest. A starting point, never a diagnosis.
function mwRoute(areas, ids) {
  const has = (g) => MW_SYMPTOMS.some((s) => s.group === g && ids.includes(s.id));
  const tracks = [];
  const notes = [];
  areas.forEach((a) => {
    if (a === "pelvic") {
      const tight = has("tight");
      const weak = has("weak");
      if (tight) tracks.push("relax");
      else if (weak) tracks.push("strengthen");
      else tracks.push("relax", "strengthen");
      if (tight && weak) notes.push("mixed");
      if (!tight && !weak) notes.push("pelvicBoth");
      if (ids.includes("bulge") || ids.includes("heaviness")) notes.push("prolapse");
    } else {
      tracks.push(a);
    }
  });
  if (areas.length) notes.push("physio");
  if (areas.includes("periods") && ids.includes("pcos")) notes.push("pcos");
  if (areas.includes("ms")) ["ms-heat", "ms-fatigue", "ms-balance", "ms-aid"].forEach((n) => ids.includes(n) && notes.push(n));
  if (areas.includes("back") && ids.includes("back-leg")) notes.push("sciatica");
  return { tracks: [...new Set(tracks)], notes: [...new Set(notes)] };
}

function MwTop({ title, onBack, onHelp }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
      <button onClick={onBack} aria-label="Back" style={{ border: "none", background: "transparent", color: MWC.pine, fontWeight: 700, fontSize: 16, cursor: "pointer", padding: "8px 4px" }}>
        Back
      </button>
      <h1 style={{ flex: 1, margin: 0, fontSize: 22, fontWeight: 700, textAlign: "center", color: MWC.ink }}>{title}</h1>
      <button onClick={onHelp} style={{ border: `1.5px solid ${MWC.line}`, background: "transparent", color: MWC.ink, fontWeight: 700, fontSize: 13, borderRadius: 12, padding: "8px 10px", cursor: "pointer" }}>
        Get help
      </button>
    </div>
  );
}

function MwCheckRow({ checked, onChange, children }) {
  return (
    <label style={{ display: "flex", gap: 12, alignItems: "flex-start", padding: "12px 0", borderTop: `1px solid ${MWC.line}`, cursor: "pointer", color: MWC.ink, fontSize: 15 }}>
      <input type="checkbox" checked={checked} onChange={onChange} style={{ width: 22, height: 22, marginTop: 1, flexShrink: 0 }} />
      <span>{children}</span>
    </label>
  );
}

const mwSmallBtn = { width: 40, height: 40, borderRadius: 12, border: "none", background: "var(--btnbg, #f3e8f9)", color: MWC.pine, fontSize: 20, fontWeight: 700, cursor: "pointer" };

function MwStep({ label, value, suffix = "", min = 1, max = 10, onChange }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "6px 0" }}>
      <span style={{ fontWeight: 600 }}>{label}</span>
      <span style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <button style={mwSmallBtn} aria-label={`Less ${label}`} onClick={() => onChange(Math.max(min, value - 1))}>-</button>
        <span style={{ minWidth: 48, textAlign: "center", fontWeight: 700, fontSize: 18 }}>{value}{suffix}</span>
        <button style={mwSmallBtn} aria-label={`More ${label}`} onClick={() => onChange(Math.min(max, value + 1))}>+</button>
      </span>
    </div>
  );
}

// Counts the person through rounds of hold/rest (or breathe in/out).
function MwGuidedTimer({ plan, onFinish }) {
  const maxSecs = plan.maxSecs || 10;
  const [phases, setPhases] = useState(plan.phases.map((p) => ({ ...p })));
  const [reps, setReps] = useState(plan.reps);
  const [run, setRun] = useState(null); // { rep, idx, endAt }
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    if (!run) return;
    const iv = setInterval(() => setNow(Date.now()), 200);
    return () => clearInterval(iv);
  }, [run]);

  useEffect(() => {
    if (!run || now < run.endAt) return;
    const t = Date.now();
    const buzz = (p) => {
      try {
        if (navigator.vibrate) navigator.vibrate(p);
      } catch (e) {
        /* not supported */
      }
    };
    const nextIdx = run.idx + 1;
    if (nextIdx < phases.length) {
      setRun({ ...run, idx: nextIdx, endAt: t + phases[nextIdx].secs * 1000 });
      buzz(40);
    } else if (run.rep < reps) {
      setRun({ rep: run.rep + 1, idx: 0, endAt: t + phases[0].secs * 1000 });
      buzz(40);
    } else {
      setRun(null);
      buzz([200, 100, 200]);
      onFinish(reps);
    }
  }, [now, run]);

  const start = () => {
    setNow(Date.now());
    setRun({ rep: 1, idx: 0, endAt: Date.now() + phases[0].secs * 1000 });
  };

  if (run) {
    const left = Math.max(0, Math.ceil((run.endAt - now) / 1000));
    return (
      <div style={{ textAlign: "center", padding: "8px 0" }} aria-live="polite">
        <div style={{ fontSize: 34, fontWeight: 700, color: MWC.pine }}>{phases[run.idx].label}</div>
        <div style={{ fontSize: 80, fontWeight: 700, lineHeight: 1.1 }}>{left}</div>
        <div style={{ color: MWC.muted, marginBottom: 12 }}>Round {run.rep} of {reps}. Breathe normally.</div>
        <button onClick={() => setRun(null)} style={mwGhost}>Stop</button>
      </div>
    );
  }

  return (
    <div>
      {phases.map((p, i) => (
        <MwStep key={p.label + i} label={p.label} value={p.secs} suffix="s" max={maxSecs} onChange={(v) => setPhases(phases.map((q, j) => (j === i ? { ...q, secs: v } : q)))} />
      ))}
      <div style={{ paddingBottom: 12 }}>
        <MwStep label="Rounds" value={reps} max={15} onChange={setReps} />
      </div>
      <button onClick={start} style={mwPrimary}>Start</button>
    </div>
  );
}

export default function MoveWell({ data = {}, onData, onClose, showDrafts = false }) {
  const d = { ack: false, result: null, blocked: null, sessions: [], ...data };
  const save = (patch) => onData && onData({ ...d, ...patch });

  const [view, setView] = useState(d.ack ? (d.result || d.blocked ? "home" : "urgent") : "intro");
  const [stack, setStack] = useState([]);
  const [urgent, setUrgent] = useState([]);
  const [soon, setSoon] = useState([]);
  const [special, setSpecial] = useState(null); // null | "yes" | "no"
  const [areas, setAreas] = useState([]);
  const [picked, setPicked] = useState([]);
  const [trackId, setTrackId] = useState("back");
  const [exId, setExId] = useState(null);
  const [finished, setFinished] = useState(null); // rounds just completed, waiting for "how did it feel"

  const go = (v) => {
    setStack((s) => [...s, view]);
    setView(v);
  };
  const back = () => {
    if (!stack.length) return onClose && onClose();
    setView(stack[stack.length - 1]);
    setStack((s) => s.slice(0, -1));
  };
  const toggle = (list, setList, id) => setList(list.includes(id) ? list.filter((x) => x !== id) : [...list, id]);
  const home = () => {
    setStack([]);
    setView("home");
  };

  const visibleExercises = (track) => MW_EXERCISES.filter((e) => e.track === track && (e.approved || showDrafts));
  const lastTwoHurt = d.sessions.length >= 2 && d.sessions.slice(-2).every((s) => s.feel === "hurt");
  const weekAgo = new Date(Date.now() - 7 * 86400000).toLocaleDateString("en-CA");
  const weekCount = d.sessions.filter((s) => s.date >= weekAgo).length;

  const draftBanner = showDrafts && (
    <p style={{ margin: "0 0 14px", padding: "10px 12px", borderRadius: 12, background: MWC.tintC, color: MWC.ink, fontSize: 13, fontWeight: 600 }}>
      Trial version: these are general example exercises. A physiotherapist hasn't checked them yet, so go gently and stop if anything hurts.
    </p>
  );
  const footer = (
    <p style={{ margin: "18px 0 0", fontSize: 12, color: MWC.muted, textAlign: "center" }}>
      General information only. It can't diagnose anything or replace your doctor or physiotherapist.
    </p>
  );
  const shell = (title, children, onBack = back) => (
    <div style={{ minHeight: "100%", background: MWC.bg, color: MWC.ink, fontFamily: MW_FONT, padding: "20px 16px 40px" }}>
      <div style={{ maxWidth: 440, margin: "0 auto" }}>
        <MwTop title={title} onBack={onBack} onHelp={() => go("help")} />
        {draftBanner}
        {children}
        {footer}
      </div>
    </div>
  );
  const trackById = (id) => MW_TRACKS.find((t) => t.id === id);
  // A warning sign (or no clearance after pregnancy or surgery) clears earlier suggestions and
  // keeps the exercises closed until the check is taken again.
  const block = (next) => {
    save({ result: null, blocked: mwToday() });
    go(next);
  };

  const finishCheck = () => {
    const r = mwRoute(areas, picked);
    save({ result: { tracks: r.tracks, notes: r.notes, ids: picked, areas, date: mwToday() }, blocked: null });
    go("result");
  };

  /* ---------- screens ---------- */

  if (view === "intro") {
    return shell(
      MW_NAME,
      <div style={mwCard}>
        <p style={{ marginTop: 0 }}>{MW_TAGLINE}. First a short safety check, then exercises that fit where you are right now.</p>
        <p style={{ color: MWC.muted, fontSize: 14 }}>
          This is general information. It can't diagnose anything or replace your doctor or physiotherapist. Exercises that help one person can make things worse for another, which is why we start with a few questions.
        </p>
        <MwCheckRow checked={d.ack} onChange={(e) => save({ ack: e.target.checked })}>
          I understand this is general information and not medical advice.
        </MwCheckRow>
        <button disabled={!d.ack} onClick={() => go("urgent")} style={{ ...mwPrimary, marginTop: 14, opacity: d.ack ? 1 : 0.5 }}>
          Continue
        </button>
      </div>,
      () => onClose && onClose()
    );
  }

  if (view === "urgent") {
    return shell(
      "Safety check",
      <div style={mwCard}>
        <h2 style={{ margin: "0 0 4px", fontSize: 18 }}>Do any of these apply right now?</h2>
        <p style={{ margin: "0 0 8px", color: MWC.muted, fontSize: 14 }}>Tick anything that does.</p>
        {MW_URGENT.map((t) => (
          <MwCheckRow key={t} checked={urgent.includes(t)} onChange={() => toggle(urgent, setUrgent, t)}>{t}</MwCheckRow>
        ))}
        <button onClick={() => (urgent.length ? block("stop") : go("soon"))} style={{ ...mwPrimary, marginTop: 14 }}>
          {urgent.length ? "Continue" : "None of these apply"}
        </button>
      </div>
    );
  }

  if (view === "stop") {
    return shell(
      "Please get help",
      <div style={{ ...mwCard, borderColor: MWC.over }}>
        <h2 style={{ margin: "0 0 8px", fontSize: 20, color: MWC.over }}>Please speak to a doctor now</h2>
        <p style={{ margin: "0 0 8px" }}>What you ticked can be a sign of something that needs medical attention. Please don't do the exercises until you've been checked.</p>
        <p style={{ margin: "0 0 14px" }}>If it is severe or sudden, call your local emergency number (112 in the EU) or go to urgent care.</p>
        <button onClick={back} style={mwGhost}>Go back</button>
      </div>
    );
  }

  if (view === "soon") {
    return shell(
      "A few more checks",
      <div style={mwCard}>
        <h2 style={{ margin: "0 0 4px", fontSize: 18 }}>Do any of these apply?</h2>
        <p style={{ margin: "0 0 8px", color: MWC.muted, fontSize: 14 }}>Tick anything that does.</p>
        {MW_SOON.map((t) => (
          <MwCheckRow key={t} checked={soon.includes(t)} onChange={() => toggle(soon, setSoon, t)}>{t}</MwCheckRow>
        ))}
        <button onClick={() => (soon.length ? block("soonStop") : go("context"))} style={{ ...mwPrimary, marginTop: 14 }}>
          {soon.length ? "Continue" : "None of these apply"}
        </button>
      </div>
    );
  }

  if (view === "soonStop") {
    return shell(
      "See a doctor first",
      <div style={mwCard}>
        <h2 style={{ margin: "0 0 8px", fontSize: 20 }}>Please see a doctor before you start</h2>
        <p style={{ margin: "0 0 14px" }}>What you ticked should be checked first. It isn't always serious, but exercise shouldn't be the first step. Once you've been seen, come back and we'll start from there.</p>
        <button onClick={() => onClose && onClose()} style={mwPrimary}>Close</button>
      </div>
    );
  }

  if (view === "context") {
    return shell(
      "A few questions",
      <div style={mwCard}>
        <h2 style={{ margin: "0 0 12px", fontSize: 18 }}>Are you pregnant, within 6 weeks of giving birth, or recovering from surgery, a fracture or a joint replacement?</h2>
        <div style={{ display: "flex", gap: 8 }}>
          {["yes", "no"].map((v) => (
            <button key={v} onClick={() => setSpecial(v)} aria-pressed={special === v} style={{ flex: 1, padding: "14px 0", borderRadius: 16, border: `1.5px solid ${special === v ? MWC.pine : MWC.line}`, background: special === v ? MWC.mint : "transparent", color: MWC.ink, fontWeight: 700, fontSize: 16, cursor: "pointer" }}>
              {v === "yes" ? "Yes" : "No"}
            </button>
          ))}
        </div>
        {special === "yes" && (
          <>
            <h3 style={{ margin: "18px 0 10px", fontSize: 16 }}>Has your doctor, midwife or physiotherapist said gentle exercise is OK for you?</h3>
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={() => go("areas")} style={{ ...mwGhost, flex: 1, width: "auto" }}>Yes</button>
              <button onClick={() => block("pause")} style={{ ...mwGhost, flex: 1, width: "auto" }}>No or not sure</button>
            </div>
          </>
        )}
        {special === "no" && <button onClick={() => go("areas")} style={{ ...mwPrimary, marginTop: 16 }}>Continue</button>}
      </div>
    );
  }

  if (view === "pause") {
    return shell(
      "Check first",
      <div style={mwCard}>
        <h2 style={{ margin: "0 0 8px", fontSize: 20 }}>Please check with them first</h2>
        <p style={{ margin: "0 0 14px" }}>After pregnancy, birth, surgery, a fracture or a joint replacement, the right exercises depend on your own recovery. Ask your doctor, midwife or physiotherapist what is safe for you, then come back.</p>
        <button onClick={() => onClose && onClose()} style={mwPrimary}>Close</button>
      </div>
    );
  }

  if (view === "areas") {
    const needsDetails = areas.some((a) => ["pelvic", "ms", "back", "periods"].includes(a));
    return shell(
      "Your focus",
      <div style={mwCard}>
        <h2 style={{ margin: "0 0 4px", fontSize: 18 }}>What would you like help with?</h2>
        <p style={{ margin: "0 0 8px", color: MWC.muted, fontSize: 14 }}>Tick as many as you like.</p>
        {MW_AREAS.map((a) => (
          <MwCheckRow key={a.id} checked={areas.includes(a.id)} onChange={() => toggle(areas, setAreas, a.id)}>{a.text}</MwCheckRow>
        ))}
        <button
          disabled={!areas.length}
          onClick={() => (needsDetails ? go("details") : finishCheck())}
          style={{ ...mwPrimary, marginTop: 14, opacity: areas.length ? 1 : 0.5 }}
        >
          Continue
        </button>
        <button onClick={() => { save({ result: null, blocked: null }); home(); }} style={{ ...mwGhost, marginTop: 8 }}>I'm not sure, show me everything</button>
      </div>
    );
  }

  if (view === "details") {
    const sections = MW_SYMPTOM_GROUPS.filter((g) => areas.includes(g.area));
    return shell(
      "A little more detail",
      <div style={mwCard}>
        <h2 style={{ margin: "0 0 4px", fontSize: 18 }}>Do any of these sound like you?</h2>
        <p style={{ margin: "0 0 8px", color: MWC.muted, fontSize: 14 }}>Tick all that apply, or none.</p>
        {sections.map((g) => (
          <div key={g.group} style={{ marginTop: 14 }}>
            <div style={{ fontWeight: 700, color: MWC.pine }}>{g.label}</div>
            {MW_SYMPTOMS.filter((s) => s.group === g.group).map((s) => (
              <MwCheckRow key={s.id} checked={picked.includes(s.id)} onChange={() => toggle(picked, setPicked, s.id)}>{s.text}</MwCheckRow>
            ))}
          </div>
        ))}
        <button onClick={finishCheck} style={{ ...mwPrimary, marginTop: 18 }}>See my starting points</button>
      </div>
    );
  }

  if (view === "result" && d.result) {
    const r = d.result;
    return shell(
      "Your starting points",
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {r.tracks.map((id) => {
          const copy = MW_RESULT.tracks[id];
          return (
            <div key={id} style={mwCard}>
              <h2 style={{ margin: "0 0 8px", fontSize: 18 }}>{copy.title}</h2>
              <p style={{ margin: "0 0 12px" }}>{copy.body}</p>
              <button onClick={() => { setTrackId(id); go("track"); }} style={{ ...mwPrimary, padding: "12px 0", fontSize: 15 }}>Open this track</button>
            </div>
          );
        })}
        {r.notes.length > 0 && (
          <div style={{ ...mwCard, background: MWC.mint }}>
            {r.notes.map((n) => (
              <p key={n} style={{ margin: "0 0 8px", fontSize: 14 }}>{MW_RESULT.notes[n]}</p>
            ))}
          </div>
        )}
        <button onClick={home} style={mwGhost}>See everything</button>
      </div>,
      home
    );
  }

  if (view === "track") {
    const track = trackById(trackId);
    const list = visibleExercises(trackId);
    const r = d.result;
    const relaxFirst = trackId === "strengthen" && r && ((r.tracks || []).includes("relax") && !(r.tracks || []).includes("strengthen") || (r.ids || []).includes("kegel-worse"));
    return shell(
      track.title,
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {relaxFirst && (
          <p style={{ margin: 0, padding: "12px 14px", borderRadius: 14, background: MWC.tintC, fontSize: 14, fontWeight: 600 }}>
            Your check suggested relaxing first. Squeezing exercises may not suit you. Please talk to a pelvic health physiotherapist before starting these.
          </p>
        )}
        {MW_TRACK_SAFETY[trackId] && (
          <p style={{ margin: 0, padding: "12px 14px", borderRadius: 14, background: MWC.mint, fontSize: 14 }}>{MW_TRACK_SAFETY[trackId]}</p>
        )}
        {list.length === 0 && (
          <div style={mwCard}>Exercises for this track are being prepared with a physiotherapist. Please check back soon.</div>
        )}
        {list.map((e) => (
          <button key={e.id} onClick={() => { setExId(e.id); setFinished(null); go("exercise"); }} style={{ ...mwCard, textAlign: "left", cursor: "pointer", color: MWC.ink }}>
            <span style={{ fontWeight: 700, fontSize: 17, display: "block" }}>{e.title}</span>
            {!e.approved && <span style={{ fontSize: 12, fontWeight: 700, color: MWC.over }}>Trial: not yet checked by a physio</span>}
          </button>
        ))}
      </div>
    );
  }

  if (view === "exercise") {
    const e = MW_EXERCISES.find((x) => x.id === exId);
    if (!e) return shell("Exercise", <div style={mwCard}>Exercise not found.</div>);
    const timerPlan = e.timer || (showDrafts ? e.draftTimer : null);
    const stops = [...e.stopIf, ...MW_STOP];
    const feel = (value) => {
      save({ sessions: [...d.sessions, { id: Math.random().toString(36).slice(2, 9), date: mwToday(), exId: e.id, track: e.track, feel: value, rounds: finished || null }].slice(-200) });
      setFinished(null);
    };
    return shell(
      e.title,
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {!e.approved && <p style={{ margin: 0, fontWeight: 700, color: MWC.over, fontSize: 13 }}>Trial: not yet checked by a physio</p>}
        <div style={mwCard}>
          <p style={{ margin: 0 }}>{e.summary || (showDrafts ? MW_PLACEHOLDER : "")}</p>
        </div>
        <div style={mwCard}>
          <h2 style={{ margin: "0 0 8px", fontSize: 17 }}>How to do it</h2>
          {e.steps.length ? (
            <ol style={{ margin: 0, paddingLeft: 20, listStyle: "decimal" }}>{e.steps.map((s, i) => <li key={i} style={{ marginBottom: 6 }}>{s}</li>)}</ol>
          ) : (
            <p style={{ margin: 0, color: MWC.muted }}>{MW_PLACEHOLDER}</p>
          )}
          {e.cues.length > 0 && (
            <ul style={{ margin: "12px 0 0", paddingLeft: 20, color: MWC.muted, listStyle: "disc" }}>{e.cues.map((c, i) => <li key={i}>{c}</li>)}</ul>
          )}
        </div>
        {timerPlan && (
          <div style={mwCard}>
            <h2 style={{ margin: "0 0 8px", fontSize: 17 }}>Guided timer</h2>
            {finished ? (
              <div>
                <p style={{ margin: "0 0 10px", fontWeight: 700 }}>Well done. How did that feel?</p>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  <button onClick={() => feel("fine")} style={mwGhost}>Felt fine</button>
                  <button onClick={() => feel("tired")} style={mwGhost}>A bit tired or sore</button>
                  <button onClick={() => feel("hurt")} style={{ ...mwGhost, borderColor: MWC.over, color: MWC.over }}>It hurt</button>
                </div>
              </div>
            ) : (
              <MwGuidedTimer key={e.id} plan={timerPlan} onFinish={(n) => setFinished(n)} />
            )}
          </div>
        )}
        {!timerPlan && (
          <div style={mwCard}>
            {finished !== null ? (
              <div>
                <p style={{ margin: "0 0 10px", fontWeight: 700 }}>Well done. How did that feel?</p>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  <button onClick={() => feel("fine")} style={mwGhost}>Felt fine</button>
                  <button onClick={() => feel("tired")} style={mwGhost}>A bit tired or sore</button>
                  <button onClick={() => feel("hurt")} style={{ ...mwGhost, borderColor: MWC.over, color: MWC.over }}>It hurt</button>
                </div>
              </div>
            ) : (
              <button onClick={() => setFinished(0)} style={mwPrimary}>Mark as done</button>
            )}
          </div>
        )}
        {d.sessions.length > 0 && d.sessions[d.sessions.length - 1].feel === "hurt" && (
          <p style={{ margin: 0, padding: "12px 14px", borderRadius: 14, background: MWC.tintC, fontSize: 14, fontWeight: 600 }}>
            You logged pain last time. Please pause and speak to a doctor or physiotherapist before continuing.
          </p>
        )}
        <div style={{ ...mwCard, borderColor: MWC.over }}>
          <h2 style={{ margin: "0 0 8px", fontSize: 17, color: MWC.over }}>Stop and get advice if</h2>
          <ul style={{ margin: 0, paddingLeft: 20 }}>{stops.map((s, i) => <li key={i} style={{ marginBottom: 4 }}>{s}</li>)}</ul>
        </div>
      </div>
    );
  }

  if (view === "help") {
    return shell(
      "Getting help",
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <div style={{ ...mwCard, borderColor: MWC.over }}>
          <h2 style={{ margin: "0 0 8px", fontSize: 17, color: MWC.over }}>Get urgent help if</h2>
          <ul style={{ margin: 0, paddingLeft: 20 }}>{MW_URGENT.map((t) => <li key={t} style={{ marginBottom: 4 }}>{t}</li>)}</ul>
          <p style={{ margin: "10px 0 0", fontSize: 14 }}>Call your local emergency number (112 in the EU) or go to urgent care.</p>
        </div>
        <div style={mwCard}>
          <h2 style={{ margin: "0 0 8px", fontSize: 17 }}>See a doctor soon if</h2>
          <ul style={{ margin: 0, paddingLeft: 20 }}>{MW_SOON.map((t) => <li key={t} style={{ marginBottom: 4 }}>{t}</li>)}</ul>
        </div>
        <div style={mwCard}>
          <h2 style={{ margin: "0 0 8px", fontSize: 17 }}>A physiotherapist can help if</h2>
          <ul style={{ margin: 0, paddingLeft: 20 }}>
            <li>Pain, stiffness, leaking or heaviness is new, getting worse or affecting daily life</li>
            <li>You aren't sure how to do an exercise</li>
            <li>You live with a condition such as MS and want a plan that fits you</li>
          </ul>
        </div>
      </div>
    );
  }

  /* ---------- home ---------- */
  const r = d.result;
  const suggested = ((r && r.tracks) || []).filter((id) => trackById(id));
  return shell(
    MW_NAME,
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      {lastTwoHurt && (
        <p style={{ margin: 0, padding: "12px 14px", borderRadius: 14, background: MWC.tintC, fontSize: 14, fontWeight: 600 }}>
          You've logged pain twice in a row. Please pause the exercises and speak to a doctor or physiotherapist.
        </p>
      )}
      <div style={{ ...mwCard, background: MWC.mint }}>
        {r ? (
          <>
            <div style={{ fontSize: 13, color: MWC.muted }}>Your starting points (checked {r.date})</div>
            <div style={{ fontWeight: 700, fontSize: 16, margin: "2px 0 10px" }}>{suggested.map((id) => trackById(id).title).join(", ")}</div>
          </>
        ) : d.blocked ? null : (
          <div style={{ marginBottom: 10 }}>Take the short check to find where to start.</div>
        )}
        {d.blocked && !r && (
          <div style={{ marginBottom: 10 }}>
            <div style={{ fontWeight: 700, fontSize: 16, color: MWC.over }}>Please get checked first</div>
            <div style={{ fontSize: 14, marginTop: 4 }}>
              On {new Date(d.blocked + "T12:00").toLocaleDateString(undefined, { day: "numeric", month: "long" })} your answers showed something a doctor should look at before you exercise. Once you've been checked, take the check again.
            </div>
          </div>
        )}
        <button onClick={() => { setUrgent([]); setSoon([]); setSpecial(null); setAreas([]); setPicked([]); go("urgent"); }} style={{ ...mwGhost, padding: "10px 0", fontSize: 14 }}>
          {r || d.blocked ? "Retake the check" : "Start the check"}
        </button>
      </div>
      {!d.blocked && MW_GROUPS.map((g) => (
        <div key={g.title}>
          <div style={{ fontWeight: 700, color: MWC.pine, margin: "4px 0 8px" }}>{g.title}</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {g.tracks.map((id) => {
              const t = trackById(id);
              const on = suggested.includes(id);
              return (
                <button key={id} onClick={() => { setTrackId(id); go("track"); }} style={{ ...mwCard, textAlign: "left", cursor: "pointer", color: MWC.ink, borderColor: on ? MWC.pine : MWC.line }}>
                  <span style={{ fontWeight: 700, fontSize: 17, display: "block" }}>{t.title}</span>
                  <span style={{ color: MWC.muted, fontSize: 14 }}>{t.blurb}</span>
                  {on && <span style={{ display: "block", marginTop: 4, fontSize: 12, fontWeight: 700, color: MWC.pine }}>Suggested for you</span>}
                </button>
              );
            })}
          </div>
        </div>
      ))}
      <div style={mwCard}>
        <div style={{ fontWeight: 700 }}>This week</div>
        <div style={{ color: MWC.muted, fontSize: 14 }}>{weekCount === 0 ? "No sessions logged yet." : `${weekCount} ${weekCount === 1 ? "session" : "sessions"} logged.`}</div>
      </div>
    </div>,
    () => onClose && onClose()
  );
}
