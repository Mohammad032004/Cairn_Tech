# 🚀 Cairn Tech — Full Stack Next.js App

## Quick Start

```bash
npm install
npm run dev
# Visit http://localhost:3000
```

## Setup Database (run once)
```
http://localhost:3000/api/admin/auto-setup
```

## Admin Login
```
URL:      /admin/login
Username: xxxx
Password: xxxx
```

---

## 🌍 Deploy to Vercel

### Step 1 — Push to GitHub
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/cairntech.git
git push -u origin main
```

### Step 2 — Deploy on Vercel
1. Go to https://vercel.com/new
2. Import your GitHub repo
3. Add these **Environment Variables** in Vercel dashboard:

| Variable | Value |
|----------|-------|
| `MONGODB_URI` | `` |
| `JWT_SECRET` | `` |

4. Click **Deploy**

### Step 3 — Seed Database (run once after deploy)
Visit: `https://your-app.vercel.app/api/admin/auto-setup`

This creates all default data + admin account.

---

## 🔐 MongoDB Atlas Setup (if needed)

1. Go to https://cloud.mongodb.com
2. **Network Access** → Add IP → `0.0.0.0/0` (allow all — required for Vercel)
3. **Database Access** → Ensure user `Cairn_db_user` has `readWriteAnyDatabase` role

---

## Environment Variables

| Variable | Description |
|----------|-------------|
| `MONGODB_URI` | MongoDB Atlas connection string |
| `JWT_SECRET` | Secret key for JWT tokens (use a long random string) |

