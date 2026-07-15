# QA hub sync backend

A tiny Cloudflare Worker + KV store so the hub's **test results** (ticks, bugs)
are saved server-side and sync across browsers/devices, instead of living only
in one browser's local storage.

- Plans (flows, cases) stay in the GitHub repo — unchanged.
- This stores **results** only, keyed `pid:sid`.
- Free tier is far more than enough (KV: 100k reads/day, 1k writes/day).

## Deploy (one-time, ~5 minutes) — this is Phill's step

Requires a Cloudflare account (free). Run from this `backend/` folder:

```bash
npm install -g wrangler        # if not already installed
wrangler login                 # <-- the interactive browser login Claude can't do

# create the KV namespace; copy the printed id into wrangler.toml (id = "…")
wrangler kv namespace create QA_STATE

# set the shared write token (pick any long random string; you'll paste the
# same value into the hub's Sync settings later)
wrangler secret put QA_TOKEN

wrangler deploy
```

`wrangler deploy` prints the Worker URL, e.g.
`https://qa-hub-sync.<your-subdomain>.workers.dev`.

## Verify it's live

```bash
curl https://qa-hub-sync.<sub>.workers.dev/health          # -> {"ok":true}
curl -H "X-QA-Token: <token>" https://qa-hub-sync.<sub>.workers.dev/index/box-and-ring
```

Then send the URL + token to Claude. Claude wires the hub to it, tests the
round trip (write on one browser, read on another) **before** you rely on it,
and confirms your existing results upload safely.

## Security note (pilot-acceptable, know the tradeoff)

The token is entered per-browser in the hub's Sync settings and kept in that
browser's local storage — it is **not** committed to the public repo or baked
into the page source. It's a shared write token, so treat it like a team
password and rotate it (`wrangler secret put QA_TOKEN` again) if it leaks. The
clean long-term hardening is putting the hub itself behind login; fine to defer
for a pilot.
