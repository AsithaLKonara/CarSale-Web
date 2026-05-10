# 🔑 Environment Variables Directory

To ensure maximum security and operational reliability, keep your production secrets hidden. This document specifies all variables required for both workspaces.

---

## ⚙️ Backend Settings (`/backend/.env`)

These credentials manage database connectivity, user session cryptography, media endpoints, and messaging triggers.

| Variable Name | Type | Recommended Value / Details |
| :--- | :--- | :--- |
| `PORT` | `number` | Port on which the API listens (e.g. `5001` local, `8080` production). |
| `NODE_ENV` | `string` | Set to `production` or `development`. |
| `DATABASE_URL` | `string` | Postgres connection string (e.g. Supabase transaction connection string). |
| `JWT_ACCESS_SECRET` | `string` | Secure randomized string (min 32 chars) for signing access tokens. |
| `JWT_REFRESH_SECRET`| `string` | Secure randomized string for signing refresh tokens. |
| `SMTP_HOST` | `string` | Production SMTP hostname (e.g. `smtp.resend.com` or `smtp.sendgrid.net`). |
| `SMTP_PORT` | `number` | SMTP Port number (typically `587` or `465`). |
| `SMTP_USER` | `string` | Username for authenticating against the mailer server. |
| `SMTP_PASS` | `string` | Password or API Key for authenticating against the mailer. |
| `CLOUDINARY_CLOUD_NAME` | `string` | Cloud name retrieved from Cloudinary portal. |
| `CLOUDINARY_API_KEY` | `string` | API Key used for media uploads. |
| `CLOUDINARY_API_SECRET`| `string` | Secure API Secret used for media signatures. |
| `REDIS_URL` | `string` | Redis connection URL (e.g. Upstash database endpoint). |

---

## 🖥️ Frontend Settings (`/Frontend/.env.local`)

These values configure user-facing APIs and tracking metrics in client browsers.

| Variable Name | Type | Recommended Value / Details |
| :--- | :--- | :--- |
| `NEXT_PUBLIC_API_URL` | `string` | Full public URL of your Express backend API (e.g. `https://api.ultradrive.com/api`). |

---

## 🛡️ Production Security Best Practices

1. **Rotate Session Secrets:** Regularly change `JWT_ACCESS_SECRET` and `JWT_REFRESH_SECRET` to invalidate old sessions safely.
2. **Never Commit Env Files:** Ensure that `.env` and `.env.local` are explicitly added to your `.gitignore` rules in all workspaces.
3. **Least Privilege Database Roles:** If using Supabase, limit the database credentials used by Prisma to avoid accidental table structures modifications by non-admin scripts.
