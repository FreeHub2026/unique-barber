# Unique Barber — Elbasan

Booking website for Unique Barber. Customers pick a service, a barber
(Endri, Aldo, or no preference), a date and time, and submit a booking —
payment happens in person at the shop, not online.

- Endri/Aldo get a **Telegram message** the moment someone books.
- Either barber can flip on **"Jam berber"** mode on the site (PIN-protected)
  to block/unblock a time slot themselves, for walk-ins or in-person
  bookings, so the online calendar stays accurate.

## What to edit for day-to-day changes

Everything you'd want to change — services, prices, barbers, phone, social
links, hours, gallery photos — lives in **one file**: `config.json`, at
the top level of the project. Nothing else needs to change. That's the
only file Endri or Aldo should ever need to touch.

You don't need to install anything to edit it — on GitHub, open
`config.json` in the repo, click the pencil (✏️) icon top-right, edit
the text, then click **Commit changes** at the bottom. Cloudflare Pages
automatically rebuilds the live site within a minute or two of every commit.

```json
{
  "phoneDisplay": "069 849 1714",     // shown on the site, national format
  "phoneIntl": "355698491714",        // used for the tel: link — country code, no +, no spaces

  "social": {
    "instagram": "",                  // e.g. "https://instagram.com/unique.barber" — leave "" to hide
    "facebook": "",
    "tiktok": ""
  },

  "barbers": [
    { "id": "endri", "name": "Endri", "phone": "355xxxxxxxxx" },
    { "id": "aldo",  "name": "Aldo",  "phone": "" }
  ],

  "services": [
    { "id": "qethje", "name": "Qethje", "price": 400, "duration": 30 }
  ],

  "hours": { "open": "09:00", "close": "21:00", "lunchStart": "14:00", "lunchEnd": "16:00", "closedWeekday": 3 }
}
```

Notes:
- **Adding a barber**: add a new `{ "id": ..., "name": ..., "phone": "" }`
  entry to `barbers`. The `id` must be lowercase, no spaces (e.g. `"gentian"`)
  — it's used internally to track bookings for that barber, never shown to
  customers. No other file needs to change.
- **`phone` on a barber is optional** — leave `""` to hide it. If set, use
  the same format as `phoneIntl` (country code, digits only, no `+` or
  spaces) and a "📞 Call [name]" link appears on their card.
- **Adding a service**: same idea — add a new
  `{ "id": ..., "name": ..., "price": ..., "duration": 30 }` entry.
  `duration` is in minutes; it decides how many time slots the booking blocks.
- **`closedWeekday`**: `0`=Sunday, `1`=Monday, `2`=Tuesday, `3`=Wednesday
  (current setting — closed Wednesdays), `4`=Thursday, `5`=Friday, `6`=Saturday.
- This file is **plain JSON** — every value except numbers needs quotes
  `"like this"`, and every entry except the last one in a list needs a
  trailing comma. If the site breaks after an edit, this is the first
  thing to check (GitHub will also show a red X / error if the JSON is
  invalid before you can even commit).

The **barber PIN** (for blocking time slots) is intentionally *not* in
this file — see step 3 below for why and how to set it.

## How booking data is stored

There's no traditional database — bookings and blocked slots are stored in
a **Cloudflare KV** namespace, one JSON list per date (key `bookings:2026-08-10`,
for example). Each entry is either:

```json
{ "type": "booking", "barber": "endri", "time": "10:30", "serviceId": "qethje", "customerName": "...", "customerPhone": "..." }
{ "type": "block",   "barber": "aldo",  "time": "16:00" }
```

## One-time setup before this can go live

### 1. Deploy to Cloudflare Pages

1. Push this folder to a GitHub repo.
2. In the Cloudflare dashboard: **Workers & Pages → Create → Pages → Connect to Git**, pick the repo.
3. Build settings: no build command needed, output directory `/` (this is a static site with Functions).

### 2. Create the KV namespace (where bookings are stored)

1. **Workers & Pages → KV → Create namespace**, name it e.g. `unique-barber-bookings`.
2. On the Pages project: **Settings → Functions → KV namespace bindings → Add binding**.
   - Variable name: `BOOKINGS_KV` (must match exactly — the code refers to `env.BOOKINGS_KV`)
   - KV namespace: the one you just created

### 3. Set the barber PIN

**Settings → Environment variables → Add variable** (mark it **Encrypt**):
- `BARBER_PIN` = a 4–6 digit code you choose, e.g. `2580`. Give this only to Endri and Aldo.

### 4. Set up the Telegram bot for notifications

1. In Telegram, message **@BotFather** → `/newbot` → follow the prompts → it gives you a **bot token** (looks like `123456:ABC-...`).
2. Decide who should get notified:
   - Just you/one person: open a chat with your new bot and send it any message (e.g. "hi").
   - Both Endri and Aldo: create a Telegram **group**, add the bot to it, send any message in the group.
3. Get the **chat id**: open this URL in a browser (replace `<TOKEN>`):
   `https://api.telegram.org/bot<TOKEN>/getUpdates`
   Send another message first if you see an empty result, then refresh. Look for `"chat":{"id": ...}` — that number (can be negative for groups) is your chat id.
4. Back in Cloudflare Pages **Settings → Environment variables**, add:
   - `TELEGRAM_BOT_TOKEN` = the token from step 1 (mark **Encrypt**)
   - `TELEGRAM_CHAT_ID` = the id from step 3

Once these 4 things are set (KV binding, `BARBER_PIN`, `TELEGRAM_BOT_TOKEN`,
`TELEGRAM_CHAT_ID`), redeploy and bookings will start working end-to-end.

### Can a regular customer fake being a barber and block times?

No. Clicking "Jam berber" only opens a PIN prompt — nothing happens until
the correct PIN is entered, and the PIN is checked **on the server**
(`functions/api/block.js`), not in the browser. Someone without the PIN
can guess all day and every attempt is rejected with "PIN i gabuar." The
only people who can actually block/unblock a slot are whoever you've
given the `BARBER_PIN` to.

## Testing locally

```
npx wrangler pages dev . --kv BOOKINGS_KV
```

This serves the site and functions locally with a local KV store. Set
`BARBER_PIN`, `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID` via a `.dev.vars`
file in this folder (one `KEY=value` per line) if you want to test
notifications locally too — `.dev.vars` should **not** be committed to git.

## Adding real store photos later

Put image files in a `gallery/` folder next to `index.html`, then list
their paths in `config.json`, e.g.:

```json
"galleryPhotos": ["gallery/1.jpg", "gallery/2.jpg", "gallery/3.jpg"],
"heroPhoto": "gallery/storefront.jpg"
```

The gallery section and hero background will pick them up automatically —
no other changes needed. The current look (black/gold barber theme) was
designed to hold up well even before real photos are added.

If it's easier, you can also upload photos straight from GitHub's web UI:
open the `gallery` folder in the repo (create it if it doesn't exist yet
by adding a file inside a new path like `gallery/1.jpg`) → **Add file →
Upload files** → drag the photos in → commit. Then add their filenames to
`galleryPhotos` as above.
