# 🚀 Public Deployment Guide

This document maps out the official, high-performance production deployment blueprint for launching **UltraDrive** globally.

---

## 🗺️ Production Architecture

```txt
       [ Customer / Staff Browser ]
                    │
         ┌──────────┴──────────┐
         ▼                     ▼
 🖥️ Frontend (Vercel)  ⚙️ Backend (Railway / VPS)
         │                     │
         │                     ├───► 🔋 Redis Cache (Upstash)
         │                     ├───► 🗄️ Database (Supabase Postgres)
         └──────────┬──────────┘
                    ▼
         🖼️ CDN Assets (Cloudinary)
```

---

## 🔋 Step 1: Database Provisioning (Supabase)

1. Sign up on [Supabase.com](https://supabase.com) and create a new project.
2. Under **Project Settings** -> **Database**, copy your **Connection String** (`URI` mode).
3. Append your password to the string and configure it as your production `DATABASE_URL`.
4. Ensure your string includes a connection pooler or append transaction mode flags (`?pgbouncer=true`) if deploying serverless.

---

## 🖥️ Step 2: Frontend Hosting (Vercel)

Vercel is the ultimate native home for our Next.js App Router workspace.

1. Install Vercel CLI or link your repository directly via the **Vercel Dashboard**.
2. Select `/Frontend` as your **Root Directory**.
3. Configure the following build variables under project settings:
   * **Framework Preset:** `Next.js`
   * **Build Command:** `npm run build`
   * **Install Command:** `npm install`
4. Add your Production Environment Variable:
   * `NEXT_PUBLIC_API_URL` = `https://your-backend-url.railway.app/api`
5. Deploy! Vercel handles asset optimization, route caching, and edge distribution automatically.

---

## ⚙️ Step 3: Backend Deployment (Railway)

Railway is excellent for running persistent Node.js Express APIs.

1. Set up a project on [Railway.app](https://railway.app).
2. Connect your GitHub repository.
3. Under service settings, select the `/backend` folder as your subdirectory build target.
4. Railway will automatically detect the `package.json` file and compile the TypeScript compiler `npm run build` upon commit.
5. In the **Variables** tab, input these production values:
   * `PORT` = `8080` (Railway automatically binds this)
   * `NODE_ENV` = `production`
   * `DATABASE_URL` = `[Your_Supabase_Connection_String]`
   * `JWT_ACCESS_SECRET` = `[Random_Cryptographic_Access_Key_64_Char]`
   * `JWT_REFRESH_SECRET` = `[Random_Cryptographic_Refresh_Key_64_Char]`
   * `SMTP_HOST` / `SMTP_PORT` / `SMTP_USER` / `SMTP_PASS` = `[Your_Production_SMTP_Host_E.g._SendGrid_or_Resend]`

---

## 🖼️ Step 4: Asset Storage (Cloudinary)

For uploading high-resolution showroom images/videos:

1. Create an account on [Cloudinary.com](https://cloudinary.com).
2. Retrieve your **Cloud Name**, **API Key**, and **API Secret** from the main dashboard.
3. Add these credentials into your Railway environment configurations:
   * `CLOUDINARY_CLOUD_NAME` = `[Your_Cloud_Name]`
   * `CLOUDINARY_API_KEY` = `[Your_API_Key]`
   * `CLOUDINARY_API_SECRET` = `[Your_API_Secret]`
4. The media module automatically scales, crops, and processes WebP dynamic image conversions on the fly.

---

## 💾 Step 5: Caching & Rate Limiting (Upstash Redis)

To protect administrative routes from scraping and optimize inventory loads:

1. Set up a serverless Redis database on [Upstash.com](https://upstash.com).
2. Copy your **Redis URL** (`rediss://...`).
3. Add it to your Railway environment dashboard:
   * `REDIS_URL` = `[Your_Upstash_Redis_URL]`
4. Backend API rate-limiters will automatically cache listings and track request bounds across concurrent showroom visits.
