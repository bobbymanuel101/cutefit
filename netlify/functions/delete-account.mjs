// Deletes the logged-in person's account. Their saved data (the user_data row) is removed
// with it automatically. Needs SUPABASE_SERVICE_ROLE_KEY in Netlify's environment variables:
// that key can do anything in your database, so it must only ever live here, never in the app.
export default async (req) => {
  if (req.method !== "POST") return new Response("Method not allowed", { status: 405 });
  const url = (process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || "").replace(/\/$/, "");
  const service = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !service) {
    return Response.json({ error: "Account deletion isn't set up yet. Please contact us and we'll delete your account." }, { status: 500 });
  }
  const token = (req.headers.get("authorization") || "").replace(/^Bearer\s+/i, "");
  if (!token) return Response.json({ error: "Please log in again, then try once more." }, { status: 401 });

  // New-style secret keys go in the apikey header only; older service_role keys also as a bearer token
  const adminHeaders = service.startsWith("sb_secret_") ? { apikey: service } : { apikey: service, Authorization: `Bearer ${service}` };

  // Ask Supabase who this login token belongs to, so people can only delete themselves
  const who = await fetch(`${url}/auth/v1/user`, { headers: { apikey: service, Authorization: `Bearer ${token}` } });
  if (!who.ok) return Response.json({ error: "Please log in again, then try once more." }, { status: 401 });
  const { id } = await who.json();
  if (!id) return Response.json({ error: "Please log in again, then try once more." }, { status: 401 });

  const del = await fetch(`${url}/auth/v1/admin/users/${id}`, { method: "DELETE", headers: adminHeaders });
  if (!del.ok) return Response.json({ error: "Your account couldn't be deleted. Please try again." }, { status: 502 });
  return Response.json({ deleted: true });
};

export const config = { path: "/api/delete-account" };
