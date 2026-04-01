# 🚀 Cairn Tech — Full Stack Next.js Application

> **Code. Create. Scale.**
> A modern full-stack web application built with performance, scalability, and clean architecture in mind.

---

## ✨ Features

* ⚡ Next.js App Router (Latest)
* 🎨 Tailwind CSS (Modern UI)
* 🔐 JWT Authentication (Secure)
* 🗄️ MongoDB + Mongoose
* 🧑‍💼 Admin Dashboard
* 🚀 Vercel Ready Deployment
* 🧠 Scalable Backend Architecture

---

## 🛠️ Tech Stack

| Layer          | Technology              |
| -------------- | ----------------------- |
| Frontend       | Next.js 15              |
| Styling        | Tailwind CSS            |
| Backend        | Next.js API Routes      |
| Database       | MongoDB + Mongoose      |
| Authentication | JWT (HTTP-only cookies) |

---

## ⚡ Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

👉 Open: **[http://localhost:3000](http://localhost:3000)**

---

## 🗄️ Setup Database (Run Once)

```
http://localhost:3000/api/admin/auto-setup
```

✔️ This will:

* Create default database structure
* Seed initial data
* Create admin account

---

## 🔐 Admin Login

```
URL:      /admin/login
Username: xxxx
Password: xxxx
```

---

## 🌍 Deployment (Vercel)

### 📌 Step 1 — Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/cairntech.git
git push -u origin main
```

---

### 📌 Step 2 — Deploy on Vercel

1. Go to: [https://vercel.com/new](https://vercel.com/new)
2. Import your GitHub repository
3. Add Environment Variables:

| Variable      | Value                   |
| ------------- | ----------------------- |
| `MONGODB_URI` | your_mongodb_connection |
| `JWT_SECRET`  | your_secret_key         |

4. Click **Deploy**

---

### 📌 Step 3 — Seed Database

After deployment, visit:

```
https://your-app.vercel.app/api/admin/auto-setup
```

✔️ This initializes your production database

---

## 🍃 MongoDB Atlas Setup

1. Go to: [https://cloud.mongodb.com](https://cloud.mongodb.com)

2. **Network Access → Add IP**

   ```
   0.0.0.0/0
   ```

   (Required for Vercel access)

3. **Database Access → Create User**

   * Username: `Cairn_db_user`
   * Role: `readWriteAnyDatabase`

---

## 🔑 Environment Variables

| Variable      | Description                   |
| ------------- | ----------------------------- |
| `MONGODB_URI` | MongoDB connection string     |
| `JWT_SECRET`  | Secret key for authentication |

---

## 📁 Project Structure

```
/app
/api
/components
/lib
/models
/styles
```

---

## 🚀 Vision

Cairn Tech aims to build **AI-powered web solutions** that help businesses scale digitally with modern, efficient, and reliable systems.

---

## 🤝 Contributing

Contributions are welcome!
Feel free to fork the repo and submit a pull request.

---

## 📄 License

This project is licensed under the **MIT License**

---

## 👨‍💻 Author

**Mohammad Irfan**
Founder — Cairn Tech
