# 🚀 Cambridge Montessori Preschool, Billawar
## Complete Production Deployment & Cloudflare Setup Guide

This guide gives you the exact, step-by-step blueprint to deploy **Cambridge Montessori Preschool, Mandli, Billawar** to **Cloudflare Pages** for **100% FREE** with a **Hostinger Domain**, **Cloudflare D1 Serverless SQL Database**, and a **Production-Ready Admin Dashboard** (without any demo/seed data).

---

## 🏗️ Architecture Overview

| Component | Technology | Cost | Description |
| :--- | :--- | :--- | :--- |
| **Frontend** | HTML5, CSS3, JavaScript | **$0 / Free** | Lightning-fast website with dynamic gallery, 3-row pagination & responsive UI. |
| **Hosting & CDN** | Cloudflare Pages | **$0 / Free** | Global edge network with unlimited bandwidth, DDoS protection & automated SSL. |
| **Backend API** | Cloudflare Functions | **$0 / Free** | Serverless endpoints (`/api/enquiries` & `/api/gallery`) that **never sleep or pause**. |
| **Database** | Cloudflare D1 (SQL) | **$0 / Free** | 5 Million reads/month & 100k writes/month free — 100% native serverless SQLite. |
| **Admin Portal** | `admin.html` | **$0 / Free** | Admissions lead manager, WhatsApp direct connect, category manager & gallery uploader. |

---

## 📦 Step 1: Push Project to GitHub

1. Open your terminal in this project folder (`cmpsbillawar`):
   ```bash
   git init
   git add .
   git commit -m "Production release of CMPS Billawar website and admin dashboard"
   ```
2. Create a new repository on [GitHub](https://github.com/new) (e.g. `cmps-billawar`).
3. Push your code:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/cmps-billawar.git
   git branch -M main
   git push -u origin main
   ```

*(Alternatively, you can drag and drop your project folder or `.zip` directly into Cloudflare Pages using Direct Upload).*

---

## 🗄️ Step 2: Create Cloudflare D1 Database (Persistent SQL Storage)

1. Log in to your [Cloudflare Dashboard](https://dash.cloudflare.com/).
2. On the left sidebar, click **Storage & Databases** &rarr; **D1 SQL Database**.
3. Click **Create Database**:
   - **Database Name**: `cmps-db`
   - Click **Create**.
4. In the database overview, click the **Console** tab.
5. Open [schema.sql](file:///c:/Users/aftab/Downloads/cmpsbillawar/schema.sql), copy all lines, paste them into the Console box, and click **Execute**:
   ```sql
   CREATE TABLE IF NOT EXISTS enquiries (
     id TEXT PRIMARY KEY,
     parent_name TEXT NOT NULL,
     child_name TEXT,
     phone TEXT NOT NULL,
     program TEXT,
     message TEXT,
     status TEXT DEFAULT 'new',
     created_at TEXT NOT NULL
   );

   CREATE TABLE IF NOT EXISTS gallery (
     id TEXT PRIMARY KEY,
     title TEXT NOT NULL,
     description TEXT,
     category TEXT NOT NULL,
     tag TEXT,
     image_url TEXT NOT NULL,
     created_at TEXT NOT NULL
   );

   CREATE INDEX IF NOT EXISTS idx_enquiries_status ON enquiries(status);
   CREATE INDEX IF NOT EXISTS idx_gallery_cat ON gallery(category);
   ```
   > [!NOTE]
   > This database is 100% clean and production-ready. No dummy or demo test data is seeded.

---

## ⚡ Step 3: Deploy Project to Cloudflare Pages

1. In the Cloudflare Dashboard, navigate to **Compute (Workers & Pages)** &rarr; **Create application** &rarr; **Pages** &rarr; **Connect to Git**.
2. Select your GitHub repository (`cmps-billawar`).
3. In **Build Settings**:
   - **Framework preset**: `None`
   - **Build command**: *(Leave empty)*
   - **Build output directory**: *(Leave empty or `. /`)*
   - **Root directory**: `/`
4. Click **Save and Deploy**.
5. Once initial deployment is complete, go to:
   - **Settings** (tab of your Pages project) &rarr; **Functions** (left menu) &rarr; Scroll down to **D1 Database Bindings**.
   - Click **Add binding**:
     - **Variable name**: `DB` *(Must be uppercase `DB`)*
     - **D1 Database**: Select `cmps-db`
   - Click **Save**.
6. Go to **Deployments** tab &rarr; Click **Create new deployment** (or trigger a push on GitHub) so Functions can access the `DB` binding.

---

## 🌐 Step 4: Connect Your Hostinger Domain to Cloudflare

1. In Cloudflare Dashboard, click **Add a Domain** (or **Websites** &rarr; **Add Site**):
   - Enter your domain (e.g. `cmpsbillawar.com`).
   - Choose the **Free Plan ($0)** and click **Continue**.
2. Cloudflare will scan your existing DNS and present **2 Nameservers**:
   - Example: `adam.ns.cloudflare.com` and `eve.ns.cloudflare.com`.
3. Log in to your **Hostinger Dashboard**:
   - Go to **Domains** &rarr; Click your domain.
   - Click **DNS / Nameservers** on the left menu.
   - Click **Change Nameservers** &rarr; Select **Use Custom Nameservers**.
   - Paste the 2 Cloudflare Nameservers into Nameserver 1 and Nameserver 2.
   - Click **Save**. *(Nameserver update propagates in 10–30 minutes)*.
4. Back in Cloudflare, open your **Pages project**:
   - Click the **Custom Domains** tab &rarr; **Set up a custom domain**.
   - Enter your domain: `cmpsbillawar.com` and click **Continue** &rarr; **Activate domain**.
   - Add `www.cmpsbillawar.com` as well.
5. Cloudflare will automatically provision a **Free Wildcard SSL (HTTPS) Certificate** with zero configuration!

---

## 🔒 Step 5: Security & HTTPS Rules (Recommended)

In your domain's Cloudflare Dashboard:
1. Go to **SSL/TLS** &rarr; Set encryption mode to **Full (strict)**.
2. Go to **SSL/TLS** &rarr; **Edge Certificates** &rarr; Turn **ON**:
   - **Always Use HTTPS**
   - **Automatic HTTPS Rewrites**
   - **Opportunistic Encryption**

---

## 📱 Step 6: Admin Dashboard Operation & First Login

1. Open your live website's admin portal:
   `https://yourdomain.com/admin.html` (or click **Admin Portal** in the website footer).
2. **Initial Passcode**: `cmps2026`
   - Click the **Eye icon** on the login field to show or hide the password as you type.
3. **Change to Client Passcode**:
   - Once logged in, click **⚙️ Settings** in the left sidebar.
   - Enter the client's new desired secure password and click **Save Password**.
4. **Managing Admissions Leads**:
   - Real enquiries submitted through the website appear instantly in the **Admissions Leads** tab.
   - Filter by **All Active**, **New Leads**, **Contacted**, **Enrolled**, or **Trash**.
   - On mobile, leads display as clean, touch-friendly cards showing Parent Name, Child Name, and a `👁️ View Details` button.
   - Click `💬 WhatsApp` to start a pre-filled chat with the parent, or `📞 Call` to dial their phone number directly.
   - Click **📥 Export Filtered CSV** to download an Excel-compatible spreadsheet.
5. **Managing Gallery Categories & Uploading Photos**:
   - Click **📸 School Gallery** &rarr; **`🏷️ Manage Categories`** to Add, Rename, or Delete categories.
   - When a category is added or edited, both the Admin Portal and the live website filter tabs update dynamically!
   - Upload new photos with live preview, select category, enter title, and click **Upload Photo to Gallery**.
   - The public website gallery displays photos in **exact 3 rows (12 items per page)** with instant client-side pagination (no page reload).

---

## 🛠️ Verification Checklist

- [x] Website loads on `https://yourdomain.com` with green padlock (SSL).
- [x] Enquiry form on website records lead into Cloudflare D1 and opens WhatsApp.
- [x] Admin login at `/admin.html` works with passcode and eye toggle.
- [x] Photo uploaded in admin appears immediately in School Gallery under its category.
- [x] 3-Row pagination works smoothly with `← Prev`, circle page buttons, and `Next →`.
- [x] Official Social Media links (YouTube, Instagram, Facebook, WhatsApp) route to the correct channels.
- [x] Mobile responsive layout tested for leads, gallery, and navigation.
