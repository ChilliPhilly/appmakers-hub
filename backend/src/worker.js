// QA hub sync backend — Cloudflare Worker + KV.
// Stores per-session RESULT state (the ticks/bugs) so the hub is no longer
// browser-only. Plans still live in the GitHub repo; this stores results.
//
// Routes (all JSON):
//   GET  /state/:pid/:sid   -> stored state object, or null
//   PUT  /state/:pid/:sid   -> body is the state JSON; stores it
//   GET  /index/:pid        -> array of sids that have stored state
//   GET  /health            -> {ok:true}
//
// Auth: every request must send  X-QA-Token: <token>  matching the QA_TOKEN
// secret. CORS is open to the caller's Origin so the GitHub Pages hub can call it.
// KV binding required: QA_STATE.

const cors = (origin) => ({
  "Access-Control-Allow-Origin": origin || "*",
  "Access-Control-Allow-Methods": "GET,PUT,DELETE,OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type,X-QA-Token",
  "Access-Control-Max-Age": "86400",
  "Vary": "Origin",
});

export default {
  async fetch(req, env) {
    const origin = req.headers.get("Origin") || "*";
    const headers = { ...cors(origin), "Content-Type": "application/json" };
    const json = (obj, status = 200) => new Response(JSON.stringify(obj), { status, headers });

    if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: cors(origin) });

    const url = new URL(req.url);
    const parts = url.pathname.split("/").filter(Boolean);

    if (parts[0] === "health") return json({ ok: true });

    // Auth gate (constant-time-ish compare is overkill for a pilot token).
    if (!env.QA_TOKEN || req.headers.get("X-QA-Token") !== env.QA_TOKEN) {
      return json({ error: "unauthorized" }, 401);
    }

    try {
      if (parts[0] === "index" && parts[1]) {
        const cur = await env.QA_STATE.get("idx:" + parts[1]);
        return json(cur ? JSON.parse(cur) : []);
      }

      if (parts[0] === "state" && parts[1] && parts[2]) {
        const key = "st:" + parts[1] + ":" + parts[2];
        if (req.method === "GET") {
          const v = await env.QA_STATE.get(key);
          return json(v ? JSON.parse(v) : null);
        }
        if (req.method === "PUT") {
          const body = await req.text();
          try { JSON.parse(body); } catch (e) { return json({ error: "body is not valid JSON" }, 400); }
          await env.QA_STATE.put(key, body);
          const ik = "idx:" + parts[1];
          let idx = [];
          const cur = await env.QA_STATE.get(ik);
          if (cur) { try { idx = JSON.parse(cur); } catch (e) {} }
          if (!idx.includes(parts[2])) { idx.push(parts[2]); await env.QA_STATE.put(ik, JSON.stringify(idx)); }
          return json({ ok: true });
        }
        if (req.method === "DELETE") {
          await env.QA_STATE.delete(key);
          const ik = "idx:" + parts[1];
          const cur = await env.QA_STATE.get(ik);
          if (cur) { try { const idx = JSON.parse(cur).filter(s => s !== parts[2]); await env.QA_STATE.put(ik, JSON.stringify(idx)); } catch (e) {} }
          return json({ ok: true });
        }
      }

      return json({ error: "not found" }, 404);
    } catch (e) {
      return json({ error: String(e) }, 500);
    }
  },
};
