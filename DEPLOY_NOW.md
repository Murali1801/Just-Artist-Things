# ✅ Deployment Checklist - Complete These Steps

## Step 1: Go to Vercel
Visit: https://vercel.com/new

## Step 2: Import Your Repository
1. Click "Import Git Repository"
2. Select: `AtharvC023/Just_Artist_Things`
3. Click "Import"

## Step 3: Configure Project Settings
```
Project Name: just-artist-things
Framework: Next.js (auto-detected)
Root Directory: art-things-brochure  ← IMPORTANT!
Build Command: npm run build
Output Directory: .next
Install Command: npm install
```

## Step 4: Deploy
Click "Deploy" button and wait 2-3 minutes

## Step 5: Verify
Your site will be live at:
https://just-artist-things.vercel.app

Test these URLs:
- https://just-artist-things.vercel.app (redirects to /landing)
- https://just-artist-things.vercel.app/landing
- https://just-artist-things.vercel.app/home

## ✅ Done!
Every time you push to GitHub, Vercel will auto-deploy.

---

## Quick Commands (if using CLI)
```bash
npm i -g vercel
cd art-things-brochure
vercel login
vercel --prod
```
