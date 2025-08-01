# Quick Deploy Guide: Giverr to GoDaddy

## Step 1: Download Your Project
1. In Replit, click the three dots menu (⋯) 
2. Select "Download as zip"
3. Extract the zip file on your computer

## Step 2: Create GitHub Repository
1. Go to github.com and sign in
2. Click the "+" button → "New repository"
3. Name it "giverr"
4. Description: "Social gratitude platform"
5. Make it **Public**
6. **Don't** add README, .gitignore, or license
7. Click "Create repository"

## Step 3: Push Code to GitHub
Open terminal in your extracted project folder and run:

```bash
# Initialize git
git init

# Add all files
git add .

# Create first commit
git commit -m "Initial commit: Giverr social platform"

# Connect to GitHub (replace YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/giverr.git

# Set main branch
git branch -M main

# Push to GitHub
git push -u origin main
```

## Step 4: Deploy to Railway
1. Go to railway.app and sign up with GitHub
2. Click "Start a New Project"
3. Select "Deploy from GitHub repo"
4. Choose your "giverr" repository
5. Railway auto-detects Node.js and deploys

## Step 5: Add Database
1. In Railway project, click "New"
2. Select "Database" → "Add PostgreSQL"
3. Wait for deployment (~2 minutes)

## Step 6: Set Environment Variables
In Railway, click your web service → Variables tab, add:
- `NODE_ENV=production`
- `SESSION_SECRET=your_super_secret_key_here_make_it_long_and_random`
- `REPL_ID=giverr_app`
- `ISSUER_URL=https://replit.com/oidc`
- `REPLIT_DOMAINS=yourdomain.com` (replace with your actual domain)

Railway automatically provides DATABASE_URL and other database variables.

## Step 7: Get Railway Domain
1. Go to Settings → Networking
2. Click "Generate Domain"
3. Note your Railway URL (e.g., giverr-production.up.railway.app)
4. Test your app at this URL

## Step 8: Connect Your GoDaddy Domain

### Option A: Use Cloudflare (Recommended)
1. **Create Cloudflare account** (free)
2. **Add your domain** to Cloudflare
3. **Change nameservers in GoDaddy:**
   - Go to GoDaddy → My Products → DNS
   - Change to Cloudflare's nameservers
4. **In Cloudflare, add DNS records:**
   - Type: CNAME, Name: @, Target: your-railway-domain.up.railway.app
   - Type: CNAME, Name: www, Target: your-railway-domain.up.railway.app
5. **Add custom domain in Railway:**
   - Settings → Domains → "Custom Domain"
   - Enter your domain: yourdomain.com

### Option B: GoDaddy DNS Only (www subdomain)
1. **In Railway, add www domain:**
   - Add www.yourdomain.com as custom domain
2. **In GoDaddy DNS:**
   - Add CNAME: www → your-railway-domain.up.railway.app
   - Forward yourdomain.com → https://www.yourdomain.com

## Step 9: Test Your Live Site
1. Visit your domain
2. Test user login/registration
3. Try creating gratitude stories
4. Verify all features work

## Troubleshooting
- **DNS not detected**: Wait up to 24 hours, ensure old records are deleted
- **App won't start**: Check Railway logs for errors
- **Database issues**: Verify environment variables are set
- **Auth problems**: Ensure REPLIT_DOMAINS matches your domain exactly

## Your Live URLs
- Railway: https://your-app-name.up.railway.app
- Your Domain: https://yourdomain.com

Your Giverr platform will be live and accessible worldwide! 🎉

## Need Help?
- Railway logs: Dashboard → Your service → Logs
- DNS checker: whatsmydns.net
- SSL checker: ssllabs.com/ssltest