import { useEffect, useState } from "react";
import AuthScreen from "./AuthScreen.jsx";
import { useAuth } from "./useAuth.js";
import { authEnabled } from "./supabaseClient.js";
import { setStorageUser } from "../storage.js";
import { THEMES } from "../themes.js";

// The app saves its chosen look here, so the login screen can match it before anyone logs in.
function savedThemeVars() {
  let look = "light";
  try {
    look = localStorage.getItem("cutefit:look") || "light";
  } catch {}
  const systemDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  if (look === "neon") return THEMES.neon;
  if (look === "dark" || (look === "auto" && systemDark)) return THEMES.dark;
  return THEMES.light;
}

// Wraps the app. Logged-out visitors see the login and sign-up screen; logged-in users see
// the app, which gets the user plus signOut and deleteAccount. If login isn't set up yet
// (no Supabase settings), the app simply runs as before.
export default function AuthGate({ children, logoSrc, termsUrl, privacyUrl, googleEnabled = false }) {
  const auth = useAuth();
  const userId = auth.user ? auth.user.id : null;
  const [storageFor, setStorageFor] = useState(undefined);

  // Point saved data at the right person before the app reads any of it
  useEffect(() => {
    if (auth.loading) return;
    let alive = true;
    setStorageFor(undefined);
    setStorageUser(userId).then(() => alive && setStorageFor(userId));
    return () => {
      alive = false;
    };
  }, [auth.loading, userId]);

  if (!authEnabled) {
    if (storageFor === undefined) return null;
    return children({ user: null });
  }

  const vars = savedThemeVars();
  const wrap = (content) => <div style={{ ...vars, minHeight: "100vh", background: "var(--bg)" }}>{content}</div>;

  if (auth.loading || (auth.session && !auth.recovering && storageFor !== userId)) {
    return wrap(
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--muted)", fontFamily: "ui-rounded, system-ui, sans-serif" }}>
        Loading...
      </div>
    );
  }

  if (!auth.session || auth.recovering) {
    return wrap(<AuthScreen auth={auth} logoSrc={logoSrc} termsUrl={termsUrl} privacyUrl={privacyUrl} googleEnabled={googleEnabled} />);
  }

  return children({ user: auth.user, signOut: auth.signOut, deleteAccount: auth.deleteAccount });
}
