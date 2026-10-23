// Forwards the app's AI requests to Anthropic, adding the API key on the server
// so it never reaches the phone. Model and length are fixed here so the endpoint
// can't be used for anything else.
//
// Every failure comes back as { error: "<plain reason>" } so the app can show
// the real cause instead of a generic "check your connection".

// Haiku is fast enough to finish well inside Netlify's function time limit,
// even with a photo. Set ANTHROPIC_MODEL in Netlify to use a different model.
const MODEL = process.env.ANTHROPIC_MODEL || "claude-haiku-4-5";
const TIME_LIMIT_MS = 24000;

const fail = (status, error) => Response.json({ error }, { status });

export default async (req) => {
  if (req.method !== "POST") return fail(405, "Method not allowed");
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) return fail(500, "AI isn't set up yet: add ANTHROPIC_API_KEY in Netlify, then redeploy.");

  let body;
  try {
    body = await req.json();
  } catch {
    return fail(400, "Bad request (the photo may be too large).");
  }
  if (!Array.isArray(body.messages) || body.messages.length !== 1 || typeof body.system !== "string") {
    return fail(400, "Bad request");
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIME_LIMIT_MS);
  let res;
  try {
    res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      signal: controller.signal,
      headers: {
        "content-type": "application/json",
        "x-api-key": key,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 1000,
        system: body.system.slice(0, 4000),
        messages: body.messages,
      }),
    });
  } catch (e) {
    return fail(504, e.name === "AbortError" ? "The AI took too long to answer. Try again." : "Couldn't reach the AI service.");
  } finally {
    clearTimeout(timer);
  }

  const text = await res.text();
  if (!res.ok) {
    let msg = "";
    try {
      msg = JSON.parse(text)?.error?.message || "";
    } catch {}
    const reason =
      res.status === 401 ? "The API key in Netlify isn't valid. Check ANTHROPIC_API_KEY and redeploy."
      : /credit balance/i.test(msg) ? "Your Anthropic account is out of credit. Add credit at console.anthropic.com."
      : res.status === 404 ? `The AI model "${MODEL}" wasn't found. Set ANTHROPIC_MODEL in Netlify to a current model.`
      : res.status === 429 ? "Too many AI requests right now. Wait a moment and try again."
      : res.status === 529 ? "The AI service is busy. Try again in a minute."
      : msg || `AI service error (${res.status}).`;
    return fail(res.status, reason);
  }
  return new Response(text, { status: 200, headers: { "content-type": "application/json" } });
};

export const config = { path: "/api/claude" };
