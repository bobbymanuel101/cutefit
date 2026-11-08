import { useState } from "react";

// Uses the same theme variables as the app (so it follows light, dark and neon),
// with fallbacks so it also looks right on its own.
const C = {
  bg: "var(--bg, #f8f1fb)",
  card: "var(--card, #ffffff)",
  ink: "var(--ink, #1e0a2e)",
  muted: "var(--muted, #6b5a80)",
  line: "var(--line, #e9dbf2)",
  panel: "var(--panel, #f8f1fb)",
  pine: "var(--pine, #3c0f54)",
  btn: "var(--btn-grad, #3c0f54)",
  over: "var(--over, #d64545)",
  mint: "var(--mint, #f9ddf0)",
};
const FONT = "ui-rounded, 'SF Pro Rounded', Nunito, system-ui, -apple-system, 'Segoe UI', sans-serif";

const input = {
  width: "100%",
  boxSizing: "border-box",
  padding: "14px 16px",
  fontSize: 16, // 16px stops iPhones zooming in when a field is tapped
  borderRadius: 14,
  border: `1.5px solid ${C.line}`,
  background: C.card,
  color: C.ink,
  outline: "none",
  fontFamily: FONT,
};
const label = { display: "block", fontSize: 14, fontWeight: 600, margin: "14px 0 6px", color: C.ink };

const validEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());

function friendly(err) {
  const m = ((err && err.message) || "").toLowerCase();
  if (m.includes("invalid login")) return "That email and password don't match. Check them and try again.";
  if (m.includes("email not confirmed")) return "Please confirm your email first. Check your inbox for our message.";
  if (m.includes("already registered") || m.includes("already been registered")) return "An account with this email already exists. Try logging in instead.";
  if (m.includes("password") && m.includes("least")) return "Your password needs at least 8 characters.";
  if (m.includes("rate limit") || m.includes("security purposes") || m.includes("too many")) return "Too many attempts. Please wait a minute and try again.";
  if (m.includes("failed to fetch") || m.includes("network")) return "Can't reach the server. Check your connection and try again.";
  return "Something went wrong. Please try again.";
}

export default function AuthScreen({ auth, logoSrc, termsUrl = "/terms", privacyUrl = "/privacy", googleEnabled = false }) {
  const [mode, setMode] = useState("login"); // login | signup | reset
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [agree, setAgree] = useState(false);
  const [healthOk, setHealthOk] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  // After someone opens the link in a password-reset email
  const view = auth.recovering ? "newpass" : mode;

  const switchTo = (next) => {
    setMode(next);
    setAgree(false);
    setHealthOk(false);
    setError("");
    setNotice("");
    setPassword("");
  };

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    setNotice("");

    if (view !== "newpass" && !validEmail(email)) return setError("Enter a valid email address.");
    if (view !== "reset" && password.length < 8) return setError("Your password needs at least 8 characters.");
    if (view === "signup") {
      if (!name.trim()) return setError("Please tell us your first name.");
      if (!agree) return setError("Please agree to the Terms and Privacy Policy to create your account.");
      if (!healthOk) return setError("CuteFit needs your permission to store health information to give you a plan. Tick the second box to continue.");
    }

    setBusy(true);
    try {
      if (view === "login") {
        const { error: err } = await auth.signIn(email.trim(), password);
        if (err) throw err;
      } else if (view === "signup") {
        const { data, error: err } = await auth.signUp(email.trim(), password, name.trim(), new Date().toISOString());
        if (err) throw err;
        // Supabase doesn't report an existing email when "Confirm email" is on; it returns a user with no identities
        const exists = data.user && Array.isArray(data.user.identities) && data.user.identities.length === 0;
        if (exists) setError("An account with this email already exists. Log in instead, or use \"Forgot your password?\" if you can't remember it.");
        else if (!data.session) setNotice("Almost there! We've sent a confirmation link to your email. Open it, then come back and log in.");
      } else if (view === "reset") {
        const { error: err } = await auth.resetPassword(email.trim());
        if (err) throw err;
        setNotice("If an account exists for that email, a reset link is on its way. It can take a few minutes.");
      } else if (view === "newpass") {
        const { error: err } = await auth.updatePassword(password);
        if (err) throw err;
        auth.finishRecovery();
      }
    } catch (err) {
      setError(friendly(err));
    }
    setBusy(false);
  }

  async function onGoogle() {
    setError("");
    const { error: err } = await auth.signInWithGoogle();
    if (err) setError(friendly(err));
  }

  const title = { login: "Welcome back", signup: "Create your account", reset: "Reset your password", newpass: "Choose a new password" }[view];
  const sub = {
    login: "Log in to see your plan and progress.",
    signup: "Track food, workouts and progress in one place.",
    reset: "Enter your email and we'll send you a reset link.",
    newpass: "Pick a new password for your account.",
  }[view];
  const cta = { login: "Log in", signup: "Create account", reset: "Send reset link", newpass: "Save new password" }[view];

  return (
    <div style={{ minHeight: "100vh", background: C.bg, color: C.ink, fontFamily: FONT, display: "flex", justifyContent: "center", padding: "24px 16px" }}>
      <div style={{ width: "100%", maxWidth: 420 }}>
        {/* Brand */}
        <div
          role="img"
          aria-label="CuteFit"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            padding: 8,
            marginBottom: 20,
            borderRadius: 22,
            background: "var(--hdr-bg, #140a22)",
            border: "1px solid var(--hdr-border, #5b2a86)",
            boxShadow: "var(--hdr-glow, 0 0 18px rgba(165,43,250,0.25))",
          }}
        >
          {logoSrc && <img src={logoSrc} alt="" width={44} height={44} style={{ borderRadius: 14, display: "block" }} />}
          <span style={{ fontSize: 24, fontWeight: 700, color: "#fff", letterSpacing: "-0.02em" }}>
            Cute<span style={{ color: "#ff6fd0" }}>Fit</span>
          </span>
        </div>

        <div style={{ background: C.card, border: `1px solid ${C.line}`, borderRadius: 24, padding: 22, boxShadow: "var(--card-shadow, none)" }}>
          {/* Log in / Sign up switch */}
          {(view === "login" || view === "signup") && (
            <div role="tablist" aria-label="Account" style={{ display: "flex", gap: 4, padding: 4, borderRadius: 16, background: "var(--segbg, #f0e4f6)", marginBottom: 18 }}>
              {[
                ["login", "Log in"],
                ["signup", "Sign up"],
              ].map(([id, text]) => (
                <button
                  key={id}
                  type="button"
                  role="tab"
                  aria-selected={view === id}
                  onClick={() => switchTo(id)}
                  style={{
                    flex: 1,
                    padding: "10px 0",
                    border: "none",
                    borderRadius: 12,
                    fontWeight: 700,
                    fontSize: 15,
                    cursor: "pointer",
                    background: view === id ? C.card : "transparent",
                    color: view === id ? C.pine : C.muted,
                    boxShadow: view === id ? "var(--seg-shadow, 0 1px 3px rgba(60,15,84,0.18))" : "none",
                  }}
                >
                  {text}
                </button>
              ))}
            </div>
          )}

          <h1 style={{ fontSize: 24, fontWeight: 700, margin: 0 }}>{title}</h1>
          <p style={{ margin: "6px 0 0", color: C.muted, fontSize: 15 }}>{sub}</p>

          <form onSubmit={onSubmit} noValidate>
            {view === "signup" && (
              <>
                <label htmlFor="cf-name" style={label}>First name</label>
                <input id="cf-name" style={input} value={name} onChange={(e) => setName(e.target.value)} autoComplete="given-name" />
              </>
            )}

            {view !== "newpass" && (
              <>
                <label htmlFor="cf-email" style={label}>Email</label>
                <input
                  id="cf-email"
                  style={input}
                  type="email"
                  inputMode="email"
                  autoCapitalize="none"
                  autoCorrect="off"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                />
              </>
            )}

            {view !== "reset" && (
              <>
                <label htmlFor="cf-password" style={label}>{view === "newpass" ? "New password" : "Password"}</label>
                <div style={{ position: "relative" }}>
                  <input
                    id="cf-password"
                    style={{ ...input, paddingRight: 72 }}
                    type={show ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete={view === "login" ? "current-password" : "new-password"}
                  />
                  <button
                    type="button"
                    onClick={() => setShow(!show)}
                    aria-label={show ? "Hide password" : "Show password"}
                    style={{ position: "absolute", right: 8, top: 8, bottom: 8, padding: "0 12px", border: "none", borderRadius: 10, background: "transparent", color: C.pine, fontWeight: 700, cursor: "pointer" }}
                  >
                    {show ? "Hide" : "Show"}
                  </button>
                </div>
                {(view === "signup" || view === "newpass") && (
                  <p style={{ margin: "6px 0 0", fontSize: 13, color: C.muted }}>At least 8 characters. A longer phrase is stronger.</p>
                )}
              </>
            )}

            {view === "login" && (
              <button type="button" onClick={() => switchTo("reset")} style={{ marginTop: 10, padding: 0, border: "none", background: "transparent", color: C.pine, fontWeight: 600, fontSize: 14, cursor: "pointer", textDecoration: "underline" }}>
                Forgot your password?
              </button>
            )}

            {view === "signup" && (
              <label style={{ display: "flex", gap: 10, alignItems: "flex-start", marginTop: 16, fontSize: 14, color: C.ink, cursor: "pointer" }}>
                <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} style={{ width: 20, height: 20, marginTop: 1, flexShrink: 0 }} />
                <span>
                  I agree to the{" "}
                  <a href={termsUrl} target="_blank" rel="noopener noreferrer" style={{ color: C.pine, fontWeight: 600 }}>Terms</a> and{" "}
                  <a href={privacyUrl} target="_blank" rel="noopener noreferrer" style={{ color: C.pine, fontWeight: 600 }}>Privacy Policy</a>.
                </span>
              </label>
            )}
            {view === "signup" && (
              <label style={{ display: "flex", gap: 10, alignItems: "flex-start", marginTop: 12, fontSize: 14, color: C.ink, cursor: "pointer" }}>
                <input type="checkbox" checked={healthOk} onChange={(e) => setHealthOk(e.target.checked)} style={{ width: 20, height: 20, marginTop: 1, flexShrink: 0 }} />
                <span>
                  I agree that CuteFit stores my health information (such as weight, meals, workouts and Move well answers) to give me my plan. I can withdraw this by deleting my account at any time.
                </span>
              </label>
            )}

            {error && (
              <p role="alert" style={{ margin: "14px 0 0", padding: "10px 12px", borderRadius: 12, background: "var(--tint-c, #ffe6f3)", color: C.over, fontSize: 14, fontWeight: 600 }}>
                {error}
              </p>
            )}
            {notice && (
              <p role="status" style={{ margin: "14px 0 0", padding: "10px 12px", borderRadius: 12, background: C.mint, color: C.ink, fontSize: 14 }}>
                {notice}
              </p>
            )}

            <button
              type="submit"
              disabled={busy}
              style={{ width: "100%", marginTop: 18, padding: "16px 0", border: "none", borderRadius: 18, background: C.btn, color: "#fff", fontWeight: 700, fontSize: 17, cursor: busy ? "default" : "pointer", opacity: busy ? 0.7 : 1 }}
            >
              {busy ? "Please wait..." : cta}
            </button>
          </form>

          {googleEnabled && (view === "login" || view === "signup") && (
            <>
              <div style={{ display: "flex", alignItems: "center", gap: 10, margin: "18px 0", color: C.muted, fontSize: 13 }}>
                <span style={{ flex: 1, height: 1, background: C.line }} /> or <span style={{ flex: 1, height: 1, background: C.line }} />
              </div>
              <button
                type="button"
                onClick={onGoogle}
                style={{ width: "100%", padding: "14px 0", borderRadius: 18, border: `1.5px solid ${C.line}`, background: "transparent", color: C.ink, fontWeight: 700, fontSize: 16, cursor: "pointer" }}
              >
                Continue with Google
              </button>
            </>
          )}

          {view === "reset" && (
            <button type="button" onClick={() => switchTo("login")} style={{ marginTop: 16, padding: 0, border: "none", background: "transparent", color: C.pine, fontWeight: 600, fontSize: 14, cursor: "pointer", textDecoration: "underline" }}>
              Back to log in
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
