# Website Launch and Maintenance Guide

This document outlines how to launch the website publicly and update it easily and frequently without downtime.

## Prerequisite: GitHub Account

1.  If you don’t have one, sign up at [github.com](https://github.com/).
2.  Create a **New Repository**. Name it `zidansh-nykaa`.
3.  Push your code to GitHub:
    ```bash
    git init
    git add .
    git commit -m "Initial commit"
    git branch -M main
    git remote add origin https://github.com/YOUR_USERNAME/zidansh-nykaa.git
    git push -u origin main
    ```

---

## 🚀 Launching Publicly (Using Vercel)

Vercel is ideal because it automatically deploys your code whenever you push changes to GitHub.

### 1. Connect to Vercel
1.  Go to [vercel.com](https://vercel.com/) and sign up with your **GitHub account**.
2.  Click **"Add New..."** -> **"Project"**.
3.  Import your `zidansh-nykaa` repository.

### 2. Configure Project Settings
In the **Configure Project** step:
1.  **Framework Preset**: Select `Vite`.
2.  **Root Directory**: Keep as `./`.
3.  **Environment Variables**: expand this section and add the keys from your local `.env` file (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `VITE_PAYU_KEY`, `VITE_PAYU_SALT`, etc.).
    *   **Crucial**: Set `VITE_FRONTEND_URL` to the URL Vercel gives you (e.g., `https://zidansh-nykaa.vercel.app`).
    *   Set `VITE_BACKEND_URL` to the *same* URL (e.g., `https://zidansh-nykaa.vercel.app`) because we unified the backend logic.

### 3. Deploy
Click **Deploy**. Vercel will build your site and launch it live in about 1-2 minutes.

---

## 🌐 Domain Name (Optional but Recommended)

**Do you need to buy a domain?**
*   **No, for testing:** Vercel gives you a free URL like `https://zidansh-nykaa.vercel.app`. This works perfectly fine for sharing with friends or testing.
*   **Yes, for branding:** If you want a professional link like `www.zidansh.com`, you should purchase a domain.

### How to Connect a Custom Domain (e.g., zidansh.com)
1.  **Buy a Domain**: Use registrars like GoDaddy, Namecheap, or even buy directly through Vercel.
2.  **In Vercel**:
    *   Go to your project settings -> **Domains**.
    *   Enter your domain (e.g., `zidansh.com`).
    *   Vercel will give you DNS records (A record & CNAME) to add to your domain registrar's settings.
3.  **Wait**: It usually takes a few minutes to an hour for the new domain to work globally.

---

## 🔄 Making Architecture Changes

Whenever you want to change the website layout, add features, or fix bugs:

1.  **Make changes locally** in VS Code.
2.  **Test locally** (`npm run dev`).
3.  **Push to GitHub**:
    ```bash
    git add .
    git commit -m "Added new feature X"
    git push
    ```
4.  **Automatic Update**: Vercel will detect the push, rebuild the site, and update the live URL automatically without any downtime.

---

## 📦 Updating Stocks Frequently

Your inventory is managed in **Supabase** (Database), so you DON'T need to redeploy the website to update stocks! The website fetches live data.

### Option A: Edit CSV and Run Script (Recommended for Bulk Updates)
1.  Edit `featured_products_inventory.csv` locally with new stock levels.
2.  Run the sync script:
    ```bash
    npm run sync-inventory
    ```
3.  The script updates Supabase directly. **The live website updates instantly** (refresh the page to see changes). No GitHub push needed!

### Option B: Manual Database Edit
1.  Log in to your [Supabase Dashboard](https://supabase.com/dashboard).
2.  Go to **Table Editor** -> `product_variations`.
3.  Edit the `stock` column directly. Changes are live immediately.

---

## 🛡️ Zero Downtime
Because Vercel builds the new version in the background and only swaps it when ready, your users will never see a "Maintenance" or broken page during updates.
