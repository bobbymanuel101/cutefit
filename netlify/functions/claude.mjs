// Forwards the app's AI requests to Anthropic, adding the API key on the server
// so it never reaches the phone. Model and length are fixed here so the endpoint
// can't be used for anything else.
export default async (req) => {
  if (req.method !== "POST") return new Response("Method not allowed", { status: 405 });
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) return Response.json({ error: "ANTHROPIC_API_KEY is not set in Netlify" }, { status: 500 });

  let body;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Bad request" }, { status: 400 });
  }
  if (!Array.isArray(body.messages) || body.messages.length !== 1 || typeof body.system !== "string") {
    return Response.json({ error: "Bad request" }, { status: 400 });
  }

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": key,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-6",
      max_tokens: 1000,
      system: body.system.slice(0, 4000),
      messages: body.messages,
    }),
  });
  return new Response(await res.text(), { status: res.status, headers: { "content-type": "application/json" } });
};

export const config = { path: "/api/claude" };
