# 🚀 DEPLOY TO VERCEL - Step by Step Guide

## 📋 Prerequisites Checklist

Before deploying, ensure you have:

- ✅ Node.js 18+ installed ([Download](https://nodejs.org/))
- ✅ npm or yarn installed
- ✅ Git installed
- ✅ JIRA Cloud account with admin access
- ✅ Vercel account ([Sign up free](https://vercel.com/signup))

---

## 🎯 Method 1: Automated Deployment (Recommended)

### One Command Deployment

```bash
cd jira-dashboard-clean
./deploy.sh
```

The script will:
1. ✅ Check prerequisites
2. ✅ Install Vercel CLI
3. ✅ Validate environment variables
4. ✅ Install dependencies
5. ✅ Test build
6. ✅ Deploy to Vercel

**Time: ~5 minutes**

---

## 🛠️ Method 2: Manual Deployment

### Step 1: Prepare Your Environment

```bash
# Navigate to project folder
cd jira-dashboard-clean

# Install dependencies
npm install

# Create environment file
cp .env.example .env.local
```

### Step 2: Configure JIRA Credentials

Edit `.env.local`:

```env
JIRA_BASE_URL=https://your-domain.atlassian.net
JIRA_EMAIL=your-email@company.com
JIRA_API_TOKEN=your-api-token-here
```

**Get JIRA API Token:**
1. Go to: https://id.atlassian.com/manage-profile/security/api-tokens
2. Click **"Create API token"**
3. Name it: "JIRA Dashboard"
4. Copy the token
5. Paste into `.env.local`

### Step 3: Test Locally

```bash
# Run development server
npm run dev

# Open in browser
# http://localhost:3000
```

**Verify:**
- ✅ Dashboard loads without errors
- ✅ Boards appear in sidebar
- ✅ Can navigate to sprint pages
- ✅ Employee cards display correctly

### Step 4: Install Vercel CLI

```bash
npm install -g vercel
```

### Step 5: Login to Vercel

```bash
vercel login
```

Choose your login method:
- GitHub
- GitLab
- Bitbucket
- Email

### Step 6: Deploy!

```bash
# Deploy to production
vercel --prod
```

**You'll be asked:**

1. **Set up and deploy?** → Yes
2. **Which scope?** → Select your account
3. **Link to existing project?** → No
4. **Project name?** → `jira-dashboard-pro` (or your choice)
5. **Directory?** → `.` (current directory)
6. **Override settings?** → No

**Deployment takes ~2-3 minutes**

### Step 7: Configure Environment Variables in Vercel

**CRITICAL:** Your local `.env.local` is NOT uploaded to Vercel.

1. Go to: https://vercel.com/dashboard
2. Click your project: **jira-dashboard-pro**
3. Click **Settings** → **Environment Variables**
4. Add these three variables:

| Name | Value | Environment |
|------|-------|-------------|
| `JIRA_BASE_URL` | `https://your-domain.atlassian.net` | Production |
| `JIRA_EMAIL` | `your-email@company.com` | Production |
| `JIRA_API_TOKEN` | `your-api-token` | Production |

**Important:** Add to "Production" environment

### Step 8: Redeploy

```bash
# Trigger new deployment with environment variables
vercel --prod
```

### Step 9: Access Your Dashboard

Your dashboard is live at:
```
https://jira-dashboard-pro-username.vercel.app
```

Or your custom domain if configured.

---

## 🌐 Method 3: GitHub → Vercel (Git Integration)

### Step 1: Create GitHub Repository

```bash
cd jira-dashboard-clean

# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit: JIRA Dashboard"

# Create repo on GitHub.com, then:
git remote add origin https://github.com/YOUR_USERNAME/jira-dashboard.git
git branch -M main
git push -u origin main
```

### Step 2: Import to Vercel

1. Go to: https://vercel.com/new
2. Click **Import Git Repository**
3. Select your GitHub repo: `jira-dashboard`
4. Configure project:
   - **Framework Preset:** Next.js
   - **Root Directory:** `./`
   - **Build Command:** (leave default)
   - **Output Directory:** (leave default)

### Step 3: Add Environment Variables

Click **Environment Variables** and add:

```
JIRA_BASE_URL=https://your-domain.atlassian.net
JIRA_EMAIL=your-email@company.com
JIRA_API_TOKEN=your-api-token
```

### Step 4: Deploy

Click **Deploy**

**Time: ~3 minutes**

### Step 5: Automatic Deployments

From now on:
- Push to `main` → Auto-deploys to production
- Push to other branches → Creates preview deployments

---

## ✅ Verification Checklist

After deployment, verify:

- [ ] Dashboard homepage loads
- [ ] Sidebar shows your boards
- [ ] Active sprints appear
- [ ] Click on a sprint shows employee cards
- [ ] Progress rings display correctly
- [ ] Analytics page loads charts
- [ ] Team page shows members
- [ ] No console errors (F12 → Console)
- [ ] Mobile view works (responsive)
- [ ] HTTPS enabled (automatic)

---

## 🔧 Troubleshooting

### Issue: 401 Unauthorized from JIRA

**Cause:** Environment variables not set correctly

**Fix:**
1. Check Vercel Dashboard → Settings → Environment Variables
2. Verify `JIRA_BASE_URL` has no trailing slash
3. Verify `JIRA_EMAIL` matches your Atlassian account
4. Regenerate `JIRA_API_TOKEN` if needed
5. Redeploy: `vercel --prod`

### Issue: Build Failed

**Cause:** TypeScript errors or missing dependencies

**Fix:**
```bash
# Check for errors locally
npm run build

# Check TypeScript
npm run type-check

# Check lint
npm run lint
```

### Issue: Dashboard loads but no data

**Cause:** JIRA API credentials incorrect

**Fix:**
1. Test API token locally:
```bash
curl -u your-email@company.com:your-api-token \
  https://your-domain.atlassian.net/rest/api/3/myself
```

2. If successful, check Vercel environment variables
3. Ensure variables are in "Production" environment

### Issue: Slow performance

**Cause:** Cache not configured

**Fix:**
- Headers are set in `next.config.js` (already configured)
- Vercel Edge Network enables automatically
- Check deployment region in `vercel.json` (set to Mumbai - bom1)

---

## 🎨 Custom Domain Setup

### Add Your Domain

1. Vercel Dashboard → Your Project
2. Settings → Domains
3. Add domain: `dashboard.yourcompany.com`
4. Update DNS:

```
Type: CNAME
Name: dashboard
Value: cname.vercel-dns.com
```

5. Wait for DNS propagation (~10 minutes)
6. SSL certificate auto-provisions

---

## 📊 Monitoring Your Deployment

### Vercel Dashboard Features

- **Analytics:** Page views, visitors, Web Vitals
- **Logs:** Real-time function logs
- **Deployments:** History of all deploys
- **Preview:** Test before production

### Enable Analytics

1. Project Settings → Analytics
2. Toggle "Enable Analytics"
3. View at: Dashboard → Analytics

---

## 🚀 CI/CD Pipeline

Once deployed via GitHub:

```
Developer → git push → GitHub → Vercel Webhook → Deploy
                                       ↓
                              Automatic deployment
                                       ↓
                              Live in ~2 minutes
```

---

## 🔐 Security Best Practices

✅ **Environment Variables**
- Never commit `.env.local` to Git
- Store in Vercel dashboard only
- Rotate API tokens quarterly

✅ **Access Control**
- Use Vercel Teams for multiple users
- Implement authentication if needed
- Enable 2FA on Vercel account

✅ **Updates**
```bash
# Monthly dependency updates
npm update
npm audit fix

# Test locally
npm run build

# Deploy
git commit -am "Update dependencies"
git push
```

---

## 📞 Getting Help

**Vercel Support:**
- Docs: https://vercel.com/docs
- Discord: https://vercel.com/discord
- Twitter: @vercel

**Project Issues:**
- Check deployment logs in Vercel
- Review browser console (F12)
- Test API routes: `/api/jira/boards`

---

## 🎉 Success!

Your JIRA Dashboard is now live on Vercel!

**Share with your team:**
```
📊 JIRA Dashboard: https://your-app.vercel.app
🔐 Uses your company's JIRA credentials
📈 Auto-refreshes hourly
📱 Mobile-friendly
```

---

**Next Steps:**
1. ✅ Bookmark your dashboard URL
2. ✅ Share with team members
3. ✅ Set up custom domain (optional)
4. ✅ Enable Vercel Analytics (optional)
5. ✅ Schedule weekly reviews of metrics

**Happy dashboarding! 🚀**
