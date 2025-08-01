# Your Giverr Deployment Steps

## What We're Doing
Deploy your Giverr social platform so it's live on your GoDaddy domain with professional hosting.

## The Plan
- **GitHub**: Store your code
- **Railway**: Host your app (free tier)
- **Your GoDaddy Domain**: Connect to the hosted app

## Step 1: Get Code to GitHub (10 minutes)

### Download from Replit:
1. Click the three dots menu (⋯) in Replit
2. Choose "Download as zip" 
3. Extract on your computer

### Create GitHub Repository:
1. Go to github.com
2. Click "+" → "New repository"
3. Name: `giverr`
4. Set to Public
5. Click "Create repository"

### Upload Code:
In your project folder terminal:
```bash
git init
git add .
git commit -m "Giverr social platform"
git remote add origin https://github.com/YOUR_USERNAME/giverr.git
git branch -M main
git push -u origin main
```

## Step 2: Deploy to Railway (15 minutes)

### Create Railway Account:
1. Go to railway.app
2. Sign up with your GitHub account

### Deploy Your App:
1. Click "Start a New Project"
2. Choose "Deploy from GitHub repo"
3. Select your "giverr" repository
4. Railway automatically builds and deploys

### Add Database:
1. Click "New" in your project
2. Select "Database" → "Add PostgreSQL"
3. Wait for it to deploy

### Set Environment Variables:
Click your app service → Variables tab → Add these:
- `NODE_ENV` = `production`
- `SESSION_SECRET` = `make_this_a_long_random_string_123456789`
- `REPL_ID` = `giverr_app`
- `ISSUER_URL` = `https://replit.com/oidc`
- `REPLIT_DOMAINS` = `yourdomain.com` (your actual GoDaddy domain)

### Get Your Railway URL:
1. Settings → Networking → "Generate Domain"
2. You'll get something like: `giverr-production.up.railway.app`
3. Test your app at this URL first

## Step 3: Connect Your GoDaddy Domain (10 minutes)

### In Railway:
1. Settings → Domains → "Custom Domain"
2. Enter your GoDaddy domain: `yourdomain.com`

### In GoDaddy:
1. Go to your domain DNS settings
2. If you have Cloudflare, use that (recommended)
3. If not, add CNAME record:
   - Name: `www`
   - Value: `your-railway-url.up.railway.app`
4. Forward root domain to www version

## Step 4: Test Everything (5 minutes)
1. Visit your domain
2. Try logging in
3. Create a test gratitude story
4. Verify everything works

## What You'll Have
- ✅ Your Giverr platform live on your domain
- ✅ Full database and user authentication
- ✅ Professional hosting that scales
- ✅ Free SSL certificate
- ✅ Automatic deployments when you update code

## Total Time: ~40 minutes
## Cost: Free (Railway free tier + your existing domain)

## Need Help?
- Railway has great logs if something goes wrong
- DNS changes can take up to 24 hours to fully propagate
- Your app will be accessible worldwide once complete

Ready to start? Follow the steps above in order!