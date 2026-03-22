# 🚀 QUICK DEPLOY REFERENCE CARD

## ⚡ FASTEST PATH TO DEPLOYMENT

```bash
# 1. Navigate to folder
cd jira-dashboard-clean

# 2. Run automated deployment
./deploy.sh
```

**Done!** Follow the prompts.

---

## 📝 ESSENTIAL COMMANDS

```bash
# Install dependencies
npm install

# Test locally
npm run dev

# Build for production
npm run build

# Deploy to Vercel
vercel --prod

# View deployment logs
vercel logs
```

---

## 🔑 REQUIRED ENVIRONMENT VARIABLES

Add these in **Vercel Dashboard → Settings → Environment Variables**:

```env
JIRA_BASE_URL=https://your-domain.atlassian.net
JIRA_EMAIL=your-email@company.com
JIRA_API_TOKEN=your-api-token-here
```

**Get API Token:** https://id.atlassian.com/manage-profile/security/api-tokens

---

## 🔗 QUICK LINKS

| Resource | URL |
|----------|-----|
| **Vercel Dashboard** | https://vercel.com/dashboard |
| **Get API Token** | https://id.atlassian.com/manage-profile/security/api-tokens |
| **Vercel CLI Docs** | https://vercel.com/docs/cli |
| **Next.js Docs** | https://nextjs.org/docs |

---

## ⚠️ COMMON ISSUES & FIXES

| Issue | Fix |
|-------|-----|
| **401 Unauthorized** | Check env vars in Vercel Dashboard |
| **Build Failed** | Run `npm run build` locally to debug |
| **No Data Showing** | Verify JIRA credentials |
| **Slow Loading** | Check deployment region (should be bom1 for Mumbai) |

---

## 📊 PROJECT STRUCTURE

```
jira-dashboard-clean/
├── pages/          → Routes
├── components/     → UI Components
├── lib/            → Business Logic
├── styles/         → CSS
├── types/          → TypeScript Types
└── .env.local      → Local credentials (not committed)
```

---

## 🎯 DEPLOYMENT CHECKLIST (30-SECOND VERSION)

```
✓ Install: npm install
✓ Configure: Edit .env.local
✓ Test: npm run dev
✓ Deploy: vercel --prod
✓ Add env vars in Vercel
✓ Redeploy: vercel --prod
```

---

## 💡 PRO TIPS

1. **Keep .env.local secure** - Never commit to Git
2. **Use custom domain** - More professional than vercel.app
3. **Enable Analytics** - Track usage in Vercel Dashboard
4. **Set up GitHub** - Auto-deploy on push
5. **Rotate tokens** - Update JIRA API token quarterly

---

## 📞 HELP RESOURCES

**Detailed Guides:**
- Full deployment: `DEPLOY_NOW.md`
- Step-by-step checklist: `DEPLOYMENT_CHECKLIST.md`
- Troubleshooting: `DEPLOYMENT.md`

**Vercel Support:**
- Docs: https://vercel.com/docs
- Discord: https://vercel.com/discord

---

## 🎉 YOU'RE READY!

**Estimated Time:** 15 minutes from start to live dashboard

**Last Updated:** March 2026

---

**Print this card and keep it handy!** 📄
