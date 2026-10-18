# Aditya Chitoshiya — Portfolio

React + Vite + GSAP/Lenis site with a secure `/admin` editor.

## Run locally

```bash
npm install
cp .env.example .env.local   # set ADMIN_PASSWORD and ADMIN_SECRET
npm run dev                  # site: http://localhost:5173  admin: /admin
```

Without `MONGODB_URI`, local edits save to `.data/content.json` (git-ignored).

## How content works

- The site loads content from `GET /api/content`. If the API is slow or
  empty, it falls back to the bundled defaults in `src/data.js`.
- `/admin` signs in with `ADMIN_PASSWORD` and saves via `PUT /api/content`.
  Every save is re-validated server-side (`api/_lib/schema.js`).
- Content is stored in MongoDB collection `site_content`, document `v2` —
  separate from the old site's data, which is never touched.
- Image/video uploads go straight to Cloudinary (folder `portfolio_v2`)
  with a short-lived signature from `/api/upload-signature` (admin only).

## Deploy on Vercel

Add these in Vercel → Project → Settings → Environment Variables:

| Variable | Value |
| --- | --- |
| `ADMIN_PASSWORD` | A new password, 12+ characters |
| `ADMIN_SECRET` | 32+ random characters (`openssl rand -hex 32`) |
| `MONGODB_URI` | Same as the current adityachitoshiya.in project |
| `CLOUDINARY_CLOUD_NAME` / `_API_KEY` / `_API_SECRET` | Same as the current project |
| `WEBAUTHN_RP_ID` | Your domain without `https://`, e.g. `adityachitoshiya.in` (passkeys only work on this domain and its subdomains) |
| `WEBAUTHN_ORIGINS` | Comma-separated site URLs, e.g. `https://www.adityachitoshiya.in,https://adityachitoshiya.in` |
| `DISABLE_PASSWORD_LOGIN` | Optional. Set to `1` once a passkey works to turn the password off |

The admin refuses to log in until `ADMIN_PASSWORD` and `ADMIN_SECRET` are set.
Changing `ADMIN_SECRET` signs everyone out.

## Passkey login (Touch ID)

1. Sign in with the password, open **Security**, click **Add passkey on this device**, and confirm with Touch ID.
2. From then on, the login page offers **Sign in with Touch ID / passkey**.
3. Passkeys can only be added by someone who is already signed in. The server stores public keys only.
4. Passkeys are tied to the domain: one made on `localhost` does not work on the live site, so add one on each.
5. Keep the password login on until you've confirmed the passkey works on the live site; if you set
   `DISABLE_PASSWORD_LOGIN=1` and lose every passkey, you'd have to change the setting in Vercel to get back in.
