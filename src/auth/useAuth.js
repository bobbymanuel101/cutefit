import { useEffect, useState, useCallback } from "react";
import { supabase } from "./supabaseClient.js";

export function useAuth() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(Boolean(supabase));
  const [recovering, setRecovering] = useState(false); // true after someone opens a password-reset link

  useEffect(() => {
    if (!supabase) return;
    let alive = true;
    supabase.auth
      .getSession()
      .then(({ data }) => {
        if (!alive) return;
        setSession(data.session);
        setLoading(false);
      })
      .catch(() => alive && setLoading(false));
    const { data } = supabase.auth.onAuthStateChange((event, next) => {
      setSession(next);
      if (event === "PASSWORD_RECOVERY") setRecovering(true);
    });
    return () => {
      alive = false;
      data.subscription.unsubscribe();
    };
  }, []);

  const signUp = useCallback(
    (email, password, name, consentAt) =>
      supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: name, health_consent_at: consentAt }, emailRedirectTo: window.location.origin },
      }),
    []
  );
  const signIn = useCallback((email, password) => supabase.auth.signInWithPassword({ email, password }), []);
  const signOut = useCallback(() => supabase.auth.signOut(), []);
  const resetPassword = useCallback(
    (email) => supabase.auth.resetPasswordForEmail(email, { redirectTo: window.location.origin }),
    []
  );
  const updatePassword = useCallback((password) => supabase.auth.updateUser({ password }), []);
  const signInWithGoogle = useCallback(
    () => supabase.auth.signInWithOAuth({ provider: "google", options: { redirectTo: window.location.origin } }),
    []
  );
  const finishRecovery = useCallback(() => setRecovering(false), []);

  // Deletes the account and everything stored with it. Throws an Error with a plain reason.
  const deleteAccount = useCallback(async () => {
    const { data } = await supabase.auth.getSession();
    const token = data.session && data.session.access_token;
    if (!token) throw new Error("Please log in again, then try once more.");
    let res;
    try {
      res = await fetch("/api/delete-account", { method: "POST", headers: { Authorization: `Bearer ${token}` } });
    } catch {
      throw new Error("You seem to be offline. Check your connection and try again.");
    }
    const body = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(body.error || "Your account couldn't be deleted. Please try again.");
    await supabase.auth.signOut({ scope: "local" }).catch(() => {});
  }, []);

  return {
    session,
    user: session ? session.user : null,
    loading,
    recovering,
    signUp,
    signIn,
    signOut,
    resetPassword,
    updatePassword,
    signInWithGoogle,
    finishRecovery,
    deleteAccount,
  };
}
