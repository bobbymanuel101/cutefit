// Forwards the app's AI requests to an AI provider, adding the API key on the
// server so it never reaches the phone.
//
// Provider: Google Gemini when GEMINI_API_KEY is set (free tier), otherwise
// Anthropic when ANTHROPIC_API_KEY is set. The app always sends and receives
// the same shape, so switching providers needs no app changes.
//
// Every failure comes back as { error: "<plain reason>" } so the app can show
// the real cause instead of a generic "check your connection".

const TIME_LIMIT_MS = 24000;

// Tried in order; if a model isn't available to this key (or its free daily
// quota is used up) the next one is tried. Set GEMINI_MODEL to pin one model.
const GEMINI_MODELS = process.env.GEMINI_MODEL
  ? [process.env.GEMINI_MODEL]
  : ["gemini-3.6-flash", "gemini-3.8-flash", "gemini-3.5-flash-lite", "gemini-3.1-flash-lite", "gemini-2.5-flash"];
const ANTHROPIC_MODEL = process.env.ANTHROPIC_MODEL || "claude-haiku-4-5";

const fail = (status, error) => Response.json({ error }, { status });
const answer = (text) => Response.json({ content: [{ type: "text", text }] });

async function timedFetch(url, init, deadline) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), Math.max(1000, deadline - Date.now()));
  try {
    return await fetch(url, { ...init, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

/* ---------- Gemini ---------- */
function toGeminiParts(content) {
  if (typeof content === "string") return [{ text: content }];
  return content.map((b) =>
    b.type === "image"
      ? { inlineData: { mimeType: b.source?.media_type || "image/jpeg", data: b.source?.data || "" } }
      : { text: String(b.text || "") }
  );
}

async function askGemini(key, system, content, deadline) {
  const baseBody = {
    systemInstruction: { parts: [{ text: system }] },
    contents: [{ role: "user", parts: toGeminiParts(content) }],
    generationConfig: { maxOutputTokens: 2048, temperature: 0.4 },
  };
  let lastReason = "The AI service couldn't answer. Try again.";
  let lastStatus = 502;

  for (const model of GEMINI_MODELS) {
    // Keep thinking short so answers arrive quickly; retry without it if a model doesn't accept it
    for (const thinking of [{ thinkingLevel: "low" }, null]) {
      const body = thinking ? { ...baseBody, generationConfig: { ...baseBody.generationConfig, thinkingConfig: thinking } } : baseBody;
      const res = await timedFetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
        { method: "POST", headers: { "content-type": "application/json", "x-goog-api-key": key }, body: JSON.stringify(body) },
        deadline
      );
      const raw = await res.text();
      let data = {};
      try {
        data = JSON.parse(raw);
      } catch {}

      if (res.ok) {
        const cand = data.candidates?.[0];
        const text = (cand?.content?.parts || []).filter((p) => !p.thought).map((p) => p.text || "").join("").trim();
        if (text) return answer(text);
        if (data.promptFeedback?.blockReason || cand?.finishReason === "SAFETY") {
          return fail(422, "The AI couldn't help with that one. Try a different photo or description.");
        }
        lastReason = "The AI sent back an empty answer. Try again.";
        break; // try the next model
      }

      const msg = data.error?.message || "";
      const reason = data.error?.details?.find?.((d) => d.reason)?.reason || "";
      if (thinking && res.status === 400 && /thinking/i.test(msg)) continue; // retry this model without thinking
      if (res.status === 400 && /API key not valid|API_KEY_INVALID/i.test(msg + reason)) {
        return fail(401, "The Gemini key in Netlify isn't valid. Check GEMINI_API_KEY and redeploy.");
      }
      if (res.status === 403) {
        return fail(403, "The Gemini key isn't allowed to use the API. Create a new key at aistudio.google.com.");
      }
      if (res.status === 404 || res.status === 429) {
        lastStatus = res.status;
        lastReason =
          res.status === 429
            ? "Today's free AI limit is used up. Try again later (it resets daily)."
            : "No available Gemini model was found for this key.";
        break; // try the next model
      }
      if (res.status === 503 || res.status === 500) {
        lastStatus = 503;
        lastReason = "The AI service is busy. Try again in a minute.";
        break;
      }
      return fail(res.status, msg || `AI service error (${res.status}).`);
    }
    if (Date.now() > deadline - 2000) break;
  }
  return fail(lastStatus, lastReason);
}

/* ---------- Anthropic (backup) ---------- */
async function askAnthropic(key, system, messages, deadline) {
  const res = await timedFetch(
    "https://api.anthropic.com/v1/messages",
    {
      method: "POST",
      headers: { "content-type": "application/json", "x-api-key": key, "anthropic-version": "2023-06-01" },
      body: JSON.stringify({ model: ANTHROPIC_MODEL, max_tokens: 1000, system, messages }),
    },
    deadline
  );
  const text = await res.text();
  if (res.ok) return new Response(text, { status: 200, headers: { "content-type": "application/json" } });

  let msg = "";
  try {
    msg = JSON.parse(text)?.error?.message || "";
  } catch {}
  const reason =
    res.status === 401 ? "The API key in Netlify isn't valid. Check ANTHROPIC_API_KEY and redeploy."
    : /credit balance/i.test(msg) ? "Your Anthropic account is out of credit. Add credit at console.anthropic.com."
    : res.status === 404 ? `The AI model "${ANTHROPIC_MODEL}" wasn't found. Set ANTHROPIC_MODEL in Netlify to a current model.`
    : res.status === 429 ? "Too many AI requests right now. Wait a moment and try again."
    : res.status === 529 ? "The AI service is busy. Try again in a minute."
    : msg || `AI service error (${res.status}).`;
  return fail(res.status, reason);
}

export default async (req) => {
  if (req.method !== "POST") return fail(405, "Method not allowed");
  const geminiKey = (process.env.GEMINI_API_KEY || "").trim().replace(/^["']|["']$/g, "");
  const anthropicKey = process.env.ANTHROPIC_API_KEY;
  if (!geminiKey && !anthropicKey) {
    return fail(500, "AI isn't set up yet: add GEMINI_API_KEY in Netlify, then redeploy.");
  }

  let body;
  try {
    body = await req.json();
  } catch {
    return fail(400, "Bad request (the photo may be too large).");
  }
  if (!Array.isArray(body.messages) || body.messages.length !== 1 || typeof body.system !== "string") {
    return fail(400, "Bad request");
  }
  const system = body.system.slice(0, 4000);
  const deadline = Date.now() + TIME_LIMIT_MS;

  try {
    if (geminiKey) return await askGemini(geminiKey, system, body.messages[0].content, deadline);
    return await askAnthropic(anthropicKey, system, body.messages, deadline);
  } catch (e) {
    return fail(504, e.name === "AbortError" ? "The AI took too long to answer. Try again." : "Couldn't reach the AI service.");
  }
};

export const config = { path: "/api/claude" };
