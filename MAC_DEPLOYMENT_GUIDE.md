# Complete Mac Deployment Guide: Giverr to Your GoDaddy Domain

This guide assumes you're completely new to deploying websites. I'll walk you through every single step.

## What You'll Need
- Your Mac computer
- Your GoDaddy domain name
- About 45 minutes of time

## What We're Building
Your Giverr social platform will be live on your GoDaddy domain, accessible to anyone worldwide.

---

## STEP 1: Download Your Project from Replit (5 minutes)

### 1.1 Download the Files
1. **In your Replit tab**, look for a menu with three dots (**⋯**) or three horizontal lines (**≡**)
2. **Click it** and look for "Download as zip" or "Export"
3. **Click "Download as zip"**
4. The file will download to your Downloads folder (usually named something like `giverr.zip`)

### 1.2 Extract the Files
1. **Open Finder** (the folder icon in your dock)
2. **Go to Downloads** folder
3. **Double-click the zip file** to extract it
4. You'll see a folder named something like `giverr` or your project name
5. **Drag this folder to your Desktop** for easy access

---

## STEP 2: Install Required Software (10 minutes)

### 2.1 Install Git (if not already installed)
1. **Open Terminal** (Press Cmd+Space, type "Terminal", press Enter)
2. **Type this command** and press Enter:
   ```bash
   git --version
   ```
3. **If you see a version number**, skip to Step 2.2
4. **If you get an error**, a popup will appear asking to install developer tools
5. **Click "Install"** and wait for it to complete (5-10 minutes)

### 2.2 Check if Node.js is installed
1. **In Terminal, type**:
   ```bash
   node --version
   ```
2. **If you see a version number** (like v18.x.x), you're good
3. **If you get "command not found"**, go to nodejs.org and download the latest version, then install it

---

## STEP 3: Create GitHub Account & Repository (10 minutes)

### 3.1 Create GitHub Account (if you don't have one)
1. **Go to github.com** in your browser
2. **Click "Sign up"**
3. **Create your account** with username, email, and password
4. **Verify your email** when prompted

### 3.2 Create New Repository
1. **Once logged into GitHub**, click the **"+"** button in the top-right corner
2. **Click "New repository"**
3. **Fill out the form**:
   - Repository name: `giverr`
   - Description: `Social gratitude platform`
   - Make sure it's set to **"Public"**
   - **DO NOT** check any boxes (Add a README file, etc.)
4. **Click "Create repository"**
5. **Keep this page open** - you'll need the URL it shows

---

## STEP 4: Upload Your Code to GitHub (10 minutes)

### 4.1 Open Terminal in Your Project Folder
1. **Open Terminal** (Cmd+Space, type "Terminal")
2. **Navigate to your project folder**:
   ```bash
   cd Desktop/giverr
   ```
   (Replace `giverr` with your actual folder name if different)

### 4.2 Initialize Git and Upload
**Copy and paste these commands one by one** (press Enter after each):

```bash
# Initialize git repository
git init
```

```bash
# Add all your files
git add .
```

```bash
# Create your first commit
git commit -m "Initial commit: Giverr social platform"
```

```bash
# Connect to your GitHub repository (REPLACE YOUR_USERNAME with your actual GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/giverr.git
```

```bash
# Set the main branch
git branch -M main
```

```bash
# Upload to GitHub
git push -u origin main
```

**If asked for username/password**: Use your GitHub username and for password, you might need a "Personal Access Token" instead of your regular password. GitHub will guide you through this.

### 4.3 Verify Upload
1. **Go back to your GitHub repository page** and refresh
2. **You should see all your files** listed there
3. **If you see your files**, you're ready for the next step!

---

## STEP 5: Deploy to Railway (15 minutes)

### 5.1 Create Railway Account
1. **Go to railway.app** in your browser
2. **Click "Login"** 
3. **Choose "Login with GitHub"**
4. **Authorize Railway** to access your GitHub account

### 5.2 Deploy Your App
1. **Click "Start a New Project"**
2. **Select "Deploy from GitHub repo"**
3. **Find and click on "giverr"** (your repository)
4. **Railway will automatically start building your app** - wait for it to finish (3-5 minutes)
5. **You'll see "Success" when it's done**

### 5.3 Add Database
1. **In your Railway project**, click the **"New"** button
2. **Select "Database"**
3. **Click "Add PostgreSQL"**
4. **Wait for it to deploy** (2-3 minutes)

### 5.4 Configure Environment Variables
1. **Click on your web service** (the one that's not the database)
2. **Click the "Variables" tab**
3. **Click "New Variable"** and add these one by one:

**Variable 1:**
- Name: `NODE_ENV`
- Value: `production`

**Variable 2:**
- Name: `SESSION_SECRET`
- Value: `your_super_secret_random_string_make_it_long_123456789`

**Variable 3:**
- Name: `REPL_ID`
- Value: `giverr_app`

**Variable 4:**
- Name: `ISSUER_URL`
- Value: `https://replit.com/oidc`

**Variable 5:**
- Name: `REPLIT_DOMAINS`
- Value: `yourdomain.com` (replace with your actual GoDaddy domain)

### 5.5 Get Your Railway URL
1. **Go to "Settings"** in your Railway project
2. **Click "Networking"**
3. **Click "Generate Domain"**
4. **Copy the URL** that appears (something like `giverr-production.up.railway.app`)
5. **Click on this URL** to test your app - it should work!

---

## STEP 6: Connect Your GoDaddy Domain (10 minutes)

### 6.1 Add Custom Domain in Railway
1. **In Railway Settings → Domains**
2. **Click "Custom Domain"**
3. **Enter your GoDaddy domain** (like `yourdomain.com`)
4. **Railway will show you a CNAME value** - copy this

### 6.2 Update GoDaddy DNS
1. **Log into your GoDaddy account**
2. **Go to "My Products" → "DNS"**
3. **Find your domain** and click "DNS"
4. **Look for existing records** and delete any that conflict
5. **Add a new CNAME record**:
   - Type: CNAME
   - Name: www
   - Value: (paste the Railway CNAME value)
6. **Set up domain forwarding**:
   - Forward `yourdomain.com` to `https://www.yourdomain.com`

### 6.3 Wait for DNS Propagation
- **DNS changes take 5-60 minutes** to work worldwide
- **You can check progress** at whatsmydns.net

---

## STEP 7: Test Your Live Website (5 minutes)

1. **Wait 10-15 minutes** after making DNS changes
2. **Visit your domain** in a browser
3. **Try these features**:
   - Sign up for an account
   - Log in
   - Create a gratitude story
   - View your profile

---

## You're Done! 🎉

Your Giverr social platform is now live on your GoDaddy domain!

## What You Have Now
- ✅ Professional website hosting
- ✅ Your own database
- ✅ SSL certificate (https://)
- ✅ Automatic scaling
- ✅ Automatic deployments when you update code

## Troubleshooting

**If your domain doesn't work:**
- Wait longer (DNS can take up to 24 hours)
- Check whatsmydns.net to see propagation status

**If the app has errors:**
- Check Railway logs: Dashboard → Your service → Logs
- Verify all environment variables are set correctly

**If you need to update your code:**
- Make changes in Replit
- Download and extract again
- In Terminal, go to your project folder
- Run: `git add .` then `git commit -m "Update"` then `git push`
- Railway automatically deploys the changes

## Support
- Railway has excellent documentation at docs.railway.app
- GoDaddy has chat support for DNS questions
- Your app logs are available in Railway dashboard

**Congratulations! Your social platform is live!**