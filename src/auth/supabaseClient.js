import { createClient } from "@supabase/supabase-js";

// Login only switches on once both settings exist in Netlify (Site configuration >
// Environment variables): VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.
// Without them the app runs as before, with data saved on the phone only.
const url = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// The anon key is designed to be public. Data stays private because of the
// Row Level Security rules in supabase/schema.sql, so never skip those.
export const supabase = url && anonKey ? createClient(url, anonKey) : null;
export const authEnabled = Boolean(supabase);
