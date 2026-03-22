# 🚀 Deployment Guide

## Quick Deploy to Vercel

### Option 1: Vercel CLI (Fastest)

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# Follow prompts:
# - Link to existing project? No
# - Project name: jira-dashboard-pro
# - Directory: ./
# - Override settings? No

# Deploy to production
vercel --prod
```

### Option 2: GitHub Integration

1. **Push to GitHub**
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/yourusername/jira-dashboard.git
git push -u origin main
```

2. **Import to Vercel**
- Go to https://vercel.com/new
- Click "Import Git Repository"
- Select your repo
- Add environment variables (see below)
- Click "Deploy"

## Environment Variables Setup

### Required Variables

Add these in Vercel Dashboard → Settings → Environment Variables:

```
JIRA_BASE_URL=https://your-domain.atlassian.net
JIRA_EMAIL=your-email@company.com
JIRA_API_TOKEN=your-api-token
```

### Optional Variables

```
NEXT_PUBLIC_BOARD_IDS=1,2,3
NEXT_PUBLIC_CACHE_DURATION=3600000
NEXT_PUBLIC_AUTO_REFRESH_INTERVAL=3600000
```

## Getting JIRA Credentials

### 1. JIRA Base URL
Your Atlassian domain: `https://yourcompany.atlassian.net`

### 2. JIRA Email
The email you use to login to JIRA

### 3. JIRA API Token

**Steps:**
1. Go to https://id.atlassian.com/manage-profile/security/api-tokens
2. Click **"Create API token"**
3. Name it: "MIS Dashboard"
4. Copy the token (you won't see it again!)
5. Paste into `JIRA_API_TOKEN` in Vercel

## Verifying Deployment

### 1. Check Build Logs
```bash
vercel logs your-deployment-url
```

### 2. Test API Routes
```bash
# Test boards endpoint
curl https://your-app.vercel.app/api/jira/boards

# Test search endpoint
curl -X POST https://your-app.vercel.app/api/jira/search \
  -H "Content-Type: application/json" \
  -d '{"jql":"sprint in (1,2,3)","maxResults":10}'
```

### 3. Monitor Performance
- Vercel Dashboard → Analytics
- Check response times
- Monitor error rates

## Custom Domain Setup

### 1. Add Domain in Vercel
- Project Settings → Domains
- Add your domain: `dashboard.yourcompany.com`

### 2. Update DNS
Add CNAME record:
```
Type: CNAME
Name: dashboard
Value: cname.vercel-dns.com
```

### 3. Enable SSL
Vercel automatically provisions SSL certificates (free)

## Performance Optimization

### Enable Edge Caching

Add to `next.config.js`:
```js
async headers() {
  return [
    {
      source: '/api/:path*',
      headers: [
        {
          key: 'Cache-Control',
          value: 's-maxage=3600, stale-while-revalidate',
        },
      ],
    },
  ]
}
```

### Monitor Bundle Size
```bash
npm run build

# Check output:
# ┌ ○ Static  (SSG)
# ├ λ Server  (ISR)
# └ ● Dynamic (SSR)
```

## Troubleshooting

### Build Fails

**Error: Missing environment variables**
- Solution: Add all required env vars in Vercel

**Error: TypeScript errors**
```bash
npm run type-check
# Fix any type errors locally first
```

### Runtime Errors

**401 Unauthorized from JIRA**
- Check JIRA_EMAIL matches your account
- Regenerate API token
- Verify JIRA_BASE_URL (no trailing slash)

**CORS Errors**
- Use the API proxy routes (`/api/jira/*`)
- Don't call JIRA directly from client

**Data Not Loading**
- Check Vercel Function Logs
- Verify network settings allow JIRA access
- Test API routes manually

### Performance Issues

**Slow Initial Load**
```bash
# Enable ISR for faster subsequent loads
# Add to page components:
export async function getStaticProps() {
  return {
    props: {},
    revalidate: 3600, // Revalidate every hour
  }
}
```

**High Function Execution Time**
- Reduce `maxResults` in JQL queries
- Implement pagination
- Use edge caching

## Monitoring & Alerts

### Vercel Analytics
Enable in Project Settings → Analytics
- Page views
- User sessions
- Web Vitals (LCP, FID, CLS)

### Error Tracking
Integrate Sentry:
```bash
npm install @sentry/nextjs
npx @sentry/wizard -i nextjs
```

### Uptime Monitoring
Use services like:
- UptimeRobot (free)
- Pingdom
- StatusCake

## Rollback Procedure

### Via Vercel CLI
```bash
# List deployments
vercel ls

# Rollback to previous
vercel rollback [deployment-url]
```

### Via Dashboard
1. Go to Deployments
2. Find stable deployment
3. Click "Promote to Production"

## Scaling Considerations

### Vercel Limits (Hobby Plan)
- 100GB bandwidth/month
- 100 hours function execution
- 12 serverless functions/deployment

### Upgrade Triggers
When you hit limits, upgrade to Pro:
- 1TB bandwidth
- 1000 hours execution
- Unlimited team members

## Security Checklist

- [ ] API tokens stored in environment variables (not in code)
- [ ] CORS headers properly configured
- [ ] Rate limiting implemented (via Vercel middleware)
- [ ] HTTPS enforced (automatic with Vercel)
- [ ] Sensitive data never logged

## Post-Deployment

### 1. Test All Features
- Overview dashboard loads
- Sprint detail pages work
- Analytics charts render
- Team page displays
- CSV export functions

### 2. Share with Team
```
Dashboard URL: https://your-app.vercel.app
Login: Use your JIRA credentials
```

### 3. Schedule Regular Updates
```bash
# Set up automatic dependency updates
npm install -g npm-check-updates
ncu -u
npm install
```

## Need Help?

- Vercel Docs: https://vercel.com/docs
- Next.js Docs: https://nextjs.org/docs
- JIRA API Docs: https://developer.atlassian.com/cloud/jira/platform/rest/v3/

---

**Deployment Complete! 🎉**
