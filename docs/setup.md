# 💻 UltraDrive Local Engineering Setup Guide

This guide describes how to set up, run, and develop the **UltraDrive Showroom and CRM Platform** locally.

---

## 🏗️ Prerequisites
Before starting, ensure your workstation has:
1. **Node.js**: `v18.x` or `v20.x` (LTS is highly recommended)
2. **Package Manager**: `npm` (packaged with Node) or `yarn` / `pnpm`
3. **Database**: PostgreSQL (v14 or higher) running locally or remotely (e.g., Supabase / Neon)
4. **Caching**: Redis instance (optional, fallback supported)

---

## 📂 Project Structure
UltraDrive is configured as a dual-workspace monorepo containing:
```txt
/CarSale
  ├── /Frontend        # Next.js 16 App Router (Showroom + CRM Admin UI)
  ├── /backend         # Express TypeScript REST API with Prisma ORM
  ├── /docs            # Product and operational guides
  ├── docker-compose.yml
  └── README.md
```

---

## 🔌 Part 1: Backend Setup

### 1. Install Dependencies
Navigate into the backend folder and install the production/dev node packages:
```bash
cd backend
npm install
```

### 2. Configure Environment Variables
Copy the env template or create a `.env` file in the root of the `/backend` folder:
```bash
cp .env.example .env
```
Ensure your `.env` contains valid credentials:
```env
PORT=5001
NODE_ENV=development

# Database Configuration (Postgres)
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/ultradrive?schema=public"

# Token Secret Keys
JWT_ACCESS_SECRET="ultradrive_access_key_secret_2026"
JWT_REFRESH_SECRET="ultradrive_refresh_key_secret_2026"

# Email SMTP Credentials (Optional - Falls back to simulation mode)
SMTP_HOST="smtp.mailtrap.io"
SMTP_PORT=2525
SMTP_USER="smtp_mock_user"
SMTP_PASS="smtp_mock_pass"
```

### 3. Initialize the Prisma Schema
Run these commands to sync your PostgreSQL schemas and generate local typings:
```bash
# Generate localized Prisma clients
npm run db:generate

# Execute migrations to align local databases
npm run db:migrate
```

### 4. Start Dev Server
Launch nodemon watching file modifications under TypeScript compilation:
```bash
npm run dev
```
The API is now active at **`http://localhost:5001`**.

---

## 🖥️ Part 2: Frontend Setup

### 1. Install Dependencies
Open a separate terminal window, navigate into the Frontend folder, and install its client-side packages:
```bash
cd Frontend
npm install
```

### 2. Set Up Environment Variables
Create a `.env.local` file inside the root of the `/Frontend` folder:
```env
NEXT_PUBLIC_API_URL="http://localhost:5001/api"
```

### 3. Start Next.js Dev Server
Launch Next.js App Router inside development mode:
```bash
npm run dev
```
The client showroom portal is now accessible at **`http://localhost:3000`**.

---

## 🧪 Verification Checklists

Ensure your local setup is fully functional by verifying these routes:
* **Showroom Feed:** Browse `http://localhost:3000/inventory` and test active search text input.
* **Lead Registration:** Submit the booking/inquiry forms on individual vehicle pages and check the terminal logs for simulated email alerts.
* **Administrative Login:** Access the onboarding portal at `http://localhost:3000/dashboard/login` and inspect the JWT handshakes.
