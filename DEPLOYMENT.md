# Vercel Deployment Guide

## Quick Deploy Steps

### Option 1: Deploy via Vercel Dashboard (Easiest)

1. **Go to Vercel Dashboard**
   - Visit: https://vercel.com/dashboard
   - Login with your account

2. **Import Git Repository**
   - Click "Add New..." → "Project"
   - Select "Import Git Repository"
   - Choose your GitHub repository
   - Click "Import"

3. **Configure Project**
   - Project Name: `just-artist-things` (already set)
   - Framework Preset: Next.js (auto-detected)
   - Root Directory: `art-things-brochure`
   - Build Command: `npm run build` (auto-detected)
   - Output Directory: `.next` (auto-detected)
   - Install Command: `npm install` (auto-detected)

4. **Deploy**
   - Click "Deploy"
   - Wait 2-3 minutes for build to complete
   - Your site will be live at: https://just-artist-things.vercel.app

### Option 2: Deploy via Vercel CLI

```bash
# Install Vercel CLI globally
npm i -g vercel

# Navigate to project
cd art-things-brochure

# Login to Vercel
vercel login

# Deploy
vercel --prod
```

## Important Settings

### Root Directory
If your repository structure is:
```
Just_Art_Things/
  └── art-things-brochure/  ← Your Next.js app is here
```

Set Root Directory in Vercel to: `art-things-brochure`

### Environment Variables
No environment variables needed for basic deployment.

## After Deployment

1. **Custom Domain** (Optional)
   - Go to Project Settings → Domains
   - Add your custom domain if you have one

2. **Automatic Deployments**
   - Every push to main/master branch auto-deploys
   - Pull requests get preview deployments

3. **Check Deployment**
   - Visit: https://just-artist-things.vercel.app
   - Test all routes: /, /landing, /home

## Troubleshooting

### Build fails?
- Check build logs in Vercel dashboard
- Ensure all dependencies are in package.json
- Run `npm run build` locally first

### Images not loading?
- Images in /public folder should work automatically
- Check image paths are correct

### 404 errors?
- Ensure root directory is set correctly
- Check that app/page.tsx exists

## Your Project URLs

- Production: https://just-artist-things.vercel.app
- Dashboard: https://vercel.com/dashboard

## Need Help?

Check Vercel docs: https://vercel.com/docs
