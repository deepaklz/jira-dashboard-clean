# ✅ DEPLOYMENT CHECKLIST

Copy this checklist and mark items as you complete them.

## 🎯 PRE-DEPLOYMENT

```
[ ] Node.js 18+ installed
[ ] npm/yarn working
[ ] Git installed
[ ] Vercel account created (free at vercel.com)
[ ] JIRA Cloud admin access confirmed
[ ] JIRA API token generated
```

## 📦 LOCAL SETUP

```
[ ] Downloaded jira-dashboard-clean folder
[ ] Navigated to folder in terminal
[ ] Ran: npm install
[ ] Created .env.local file
[ ] Added JIRA_BASE_URL to .env.local
[ ] Added JIRA_EMAIL to .env.local
[ ] Added JIRA_API_TOKEN to .env.local
[ ] Tested locally: npm run dev
[ ] Dashboard opens at localhost:3000
[ ] Boards visible in sidebar
[ ] Sprint pages load correctly
```

## 🚀 VERCEL DEPLOYMENT

```
[ ] Installed Vercel CLI: npm install -g vercel
[ ] Logged in: vercel login
[ ] Ran: vercel --prod
[ ] Answered setup questions
[ ] Deployment completed successfully
[ ] Received deployment URL
```

## 🔐 ENVIRONMENT VARIABLES

```
[ ] Opened Vercel dashboard
[ ] Navigated to project
[ ] Clicked Settings → Environment Variables
[ ] Added JIRA_BASE_URL
[ ] Added JIRA_EMAIL
[ ] Added JIRA_API_TOKEN
[ ] Selected "Production" environment
[ ] Saved all variables
[ ] Redeployed: vercel --prod
```

## ✅ VERIFICATION

```
[ ] Opened production URL
[ ] Dashboard homepage loads
[ ] No errors in browser console (F12)
[ ] Sidebar shows boards
[ ] Active sprints display
[ ] Clicked on sprint - employees appear
[ ] Progress rings render
[ ] Analytics page works
[ ] Team page loads
[ ] CSV export functions
[ ] Tested on mobile device
[ ] HTTPS lock icon visible
```

## 🎨 OPTIONAL ENHANCEMENTS

```
[ ] Custom domain configured
[ ] DNS updated (if using custom domain)
[ ] SSL certificate verified
[ ] Vercel Analytics enabled
[ ] Team members invited
[ ] Bookmarked dashboard URL
```

## 📊 POST-DEPLOYMENT

```
[ ] Shared URL with team
[ ] Documented credentials location
[ ] Set calendar reminder for quarterly API token rotation
[ ] Scheduled monthly dependency updates
[ ] Created backup of .env.local (secure location)
```

---

## 🚨 TROUBLESHOOTING CHECKLIST

If dashboard doesn't load:

```
[ ] Check Vercel deployment logs
[ ] Verify environment variables in Vercel
[ ] Test JIRA API token with curl command
[ ] Check browser console for errors
[ ] Review network tab (F12 → Network)
[ ] Try incognito/private browsing
[ ] Clear browser cache
[ ] Check JIRA_BASE_URL has no trailing slash
[ ] Verify JIRA_EMAIL matches Atlassian account
[ ] Regenerate JIRA API token if needed
```

---

## ⏱️ ESTIMATED TIME

- **Local Setup:** 5 minutes
- **Vercel Deployment:** 3 minutes
- **Environment Variables:** 2 minutes
- **Verification:** 5 minutes

**Total: ~15 minutes** ⚡

---

## 📞 QUICK HELP

**Error:** 401 Unauthorized
→ Check environment variables in Vercel

**Error:** Build failed
→ Run `npm run build` locally to see errors

**Error:** No data showing
→ Verify JIRA credentials with test query

**Need more help?**
→ See DEPLOY_NOW.md for detailed troubleshooting

---

## 🎉 COMPLETION

When all items are checked:

**Your JIRA Dashboard is LIVE! 🚀**

Production URL: _________________________

Deployed on: ___________________________

Team notified: [ ] Yes

---

**Pro Tip:** Keep this checklist for future deployments or updates!
