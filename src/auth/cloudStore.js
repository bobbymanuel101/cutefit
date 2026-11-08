import { supabase } from "./supabaseClient.js";

// Saves and loads the whole CuteFit data object for the logged-in user, so it follows
// them to another phone. Needs the table from supabase/schema.sql.

export async function loadUserData(userId) {
  const { data, error } = await supabase.from("user_data").select("data, updated_at").eq("user_id", userId).maybeSingle();
  if (error) throw error;
  return data ? { data: data.data, updatedAt: Date.parse(data.updated_at) || 0 } : null;
}

export async function saveUserData(userId, payload) {
  const { error } = await supabase
    .from("user_data")
    .upsert({ user_id: userId, data: payload, updated_at: new Date().toISOString() });
  if (error) throw error;
}
