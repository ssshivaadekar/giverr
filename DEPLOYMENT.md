# Giverr Deployment Guide

## Overview
This guide walks you through deploying your Giverr application using Railway for hosting and connecting your GoDaddy domain.

## Prerequisites
- GitHub account
- Railway account (free)
- GoDaddy domain
- Cloudflare account (free) - recommended for domain management

## Step 1: Push Code to GitHub

1. Create a new repository on GitHub
2. Push your current code:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/giverr.git
   git push -u origin main
   ```

## Step 2: Deploy to Railway

1. **Create Railway Account**
   - Go to [railway.app](https://railway.app)
   - Sign up with your GitHub account

2. **Create New Project**
   - Click "Start a New Project"
   - Select "Deploy from GitHub repo"
   - Choose your Giverr repository
   - Railway will automatically detect it's a Node.js app

3. **Add PostgreSQL Database**
   - In your project, click "New"
   - Select "Database" → "Add PostgreSQL"
   - Wait for it to deploy (takes ~2 minutes)

4. **Configure Environment Variables**
   - Click on your web service
   - Go to "Variables" tab
   - Add these variables:
     - `NODE_ENV=production`
     - `SESSION_SECRET=your_super_secret_session_key_here`
     - `REPL_ID=your_app_id` (can be any unique string)
     - `ISSUER_URL=https://replit.com/oidc`
     - `REPLIT_DOMAINS=yourdomain.com`
     - `OPENAI_API_KEY=your_openai_key` (if using AI features)
   - Railway automatically provides `DATABASE_URL` and other DB variables

5. **Generate Railway Domain**
   - Go to Settings → Networking
   - Click "Generate Domain"
   - Test your app at the generated URL (e.g., `giverr-production.up.railway.app`)

## Step 3: Connect Your GoDaddy Domain

### Option A: Using Cloudflare (Recommended)

1. **Setup Cloudflare**
   - Create account at [cloudflare.com](https://cloudflare.com)
   - Add your domain
   - Note the nameservers provided

2. **Change Nameservers in GoDaddy**
   - Login to GoDaddy → My Products → DNS
   - Go to Nameservers → "Change"
   - Select "I'll use my own nameservers"
   - Enter Cloudflare's nameservers
   - Save changes

3. **Configure DNS in Cloudflare**
   - Wait 5-15 minutes for nameserver changes
   - In Cloudflare dashboard → DNS
   - Delete any existing records
   - Add CNAME record:
     - **Type**: CNAME
     - **Name**: @ (root domain)
     - **Target**: Your Railway domain (without https://)
     - **Proxy**: On (orange cloud)
   - Add www CNAME:
     - **Name**: www
     - **Target**: Same Railway domain
     - **Proxy**: On

4. **Add Custom Domain in Railway**
   - Go to Railway project → Settings → Domains
   - Click "Custom Domain"
   - Enter your domain: `yourdomain.com`
   - Railway will verify DNS (may take a few minutes)

5. **SSL Configuration**
   - In Cloudflare → SSL/TLS → Overview
   - Set to "Full" mode
   - SSL certificate will be automatically issued

### Option B: GoDaddy DNS Only (www subdomain)

1. **Add www domain in Railway**
   - Add `www.yourdomain.com` as custom domain

2. **Configure GoDaddy DNS**
   - Add CNAME record:
     - **Type**: CNAME
     - **Name**: www
     - **Value**: Your Railway domain
   - Setup forwarding:
     - Forward `yourdomain.com` to `https://www.yourdomain.com`

## Step 4: Run Database Migrations

1. **Install Railway CLI** (optional)
   ```bash
   npm install -g @railway/cli
   railway login
   railway link
   ```

2. **Push Database Schema**
   - Your app should automatically run migrations on first deploy
   - If needed, you can run: `railway run npm run db:push`

## Step 5: Test Your Deployment

1. Visit your domain
2. Test user registration/login
3. Try creating gratitude stories
4. Check that all features work

## Troubleshooting

### Common Issues:
- **DNS not detected**: Ensure old records are deleted, wait up to 72 hours
- **App won't start**: Check Railway logs for errors
- **Database connection**: Verify environment variables are set
- **Authentication issues**: Ensure `REPLIT_DOMAINS` matches your domain

### Railway Logs:
- View logs in Railway dashboard → Your service → Logs
- Look for startup errors or database connection issues

## Environment Variables Checklist

Make sure these are set in Railway:
- ✅ `NODE_ENV=production`
- ✅ `DATABASE_URL` (auto-provided)
- ✅ `SESSION_SECRET`
- ✅ `REPL_ID`
- ✅ `ISSUER_URL`
- ✅ `REPLIT_DOMAINS`
- ✅ `OPENAI_API_KEY` (if needed)

## Costs

- **Railway**: Free tier includes 500 hours/month (enough for most personal projects)
- **Cloudflare**: Free tier includes DNS, SSL, CDN
- **GoDaddy**: Just your existing domain cost

Your Giverr app should now be live at your custom domain! 🎉