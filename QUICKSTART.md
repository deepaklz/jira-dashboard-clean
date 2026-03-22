# 🚀 Quick Start Guide

## What You Have

A complete, production-ready **JIRA Analytics Dashboard** built with:
- ✅ Next.js 14 + TypeScript
- ✅ Tailwind CSS (Glassmorphism design)
- ✅ Chart.js visualizations
- ✅ SWR auto-refresh
- ✅ Secure JIRA proxy
- ✅ Full business logic implementation

## 📦 Files Included

```
jira-dashboard-clean/
├── components/          # React components
├── lib/                 # Business logic
├── pages/               # Routes & API
├── types/               # TypeScript types
├── styles/              # Global CSS
├── package.json         # Dependencies
├── README.md            # Full documentation
├── DEPLOYMENT.md        # Deploy guide
└── setup.sh             # Auto-setup script
```

## ⚡ 5-Minute Setup

### 1. Extract & Install
```bash
# Navigate to the project folder
cd jira-dashboard-clean

# Make setup script executable
chmod +x setup.sh

# Run setup (installs dependencies)
./setup.sh
```

### 2. Configure JIRA
Edit `.env.local`:
```env
JIRA_BASE_URL=https://your-domain.atlassian.net
JIRA_EMAIL=your-email@company.com
JIRA_API_TOKEN=your-api-token-here
```

**Get API Token:** https://id.atlassian.com/manage-profile/security/api-tokens

### 3. Start Development Server
```bash
npm run dev
```

Open http://localhost:3000 🎉

## 🚀 Deploy to Vercel

### Option 1: One Command
```bash
npm i -g vercel
vercel
```

### Option 2: GitHub + Vercel
1. Push to GitHub
2. Import to Vercel
3. Add environment variables
4. Deploy!

**Full guide:** See `DEPLOYMENT.md`

## 📊 Features Overview

### Dashboard Pages
- **/** - Overview with active sprints
- **/sprint/[name]** - Sprint details with employee cards
- **/team** - All team members
- **/analytics** - Charts & visualizations

### Key Capabilities
✅ Multi-board sprint aggregation
✅ Week 1 vs Full Sprint metrics
✅ Subtask inclusion logic
✅ On-time calculation with fallbacks
✅ Global search for cross-team tasks
✅ CSV export functionality
✅ Real-time auto-refresh (hourly)

## 🎨 Customization

### Change Colors
Edit `tailwind.config.js`:
```js
accent: {
  success: '#10b981',  // Green
  warning: '#f59e0b',  // Amber
  progress: '#3b82f6', // Blue
}
```

### Adjust Cache
Edit `.env.local`:
```env
NEXT_PUBLIC_CACHE_DURATION=3600000  # 1 hour
```

### Add Board IDs
```env
NEXT_PUBLIC_BOARD_IDS=1,2,3
```

## 📚 Documentation

| File | Purpose |
|------|---------|
| `README.md` | Complete project guide |
| `DEPLOYMENT.md` | Vercel deployment steps |
| `PROJECT_STRUCTURE.md` | Code organization |

## 🔍 Business Logic Highlights

### Sprint Aggregation
- Fetches all sprint instances with same name across boards
- Executes unified JQL: `sprint in (id1, id2, id3)`
- Aggregates all issues into single view

### Week Splitting
```
Week 1 = Sprint Start + 6 days (first 7 days)
Week 2 = Day 7 to Sprint End
```

### On-Time Logic
```
Compare: resolutiondate (or updated for subtasks)
Against: duedate (or sprint end if no due date)
Result: OnTime if completed <= deadline
```

### Subtask Inclusion
```
"Items" = Tasks + Subtasks
Ensures all work is counted
```

## 🐛 Troubleshooting

### JIRA 401 Error
- ✅ Verify email matches Atlassian account
- ✅ Regenerate API token
- ✅ Check base URL (no trailing slash)

### No Sprints Showing
- ✅ Ensure boards have active sprints
- ✅ Check board permissions
- ✅ Verify API token has read access

### Build Errors
```bash
npm run type-check  # Check TypeScript
npm run lint        # Check code quality
```

## 🎯 Next Steps

1. ✅ Set up JIRA credentials
2. ✅ Test locally (`npm run dev`)
3. ✅ Deploy to Vercel
4. ✅ Share with your team!

## 💡 Pro Tips

- **Performance:** Enable ISR for faster loads
- **Security:** Never commit `.env.local`
- **Monitoring:** Use Vercel Analytics
- **Updates:** Run `npm update` monthly

## 🆘 Need Help?

- 📖 Read `README.md` for detailed docs
- 🚀 Check `DEPLOYMENT.md` for deploy issues
- 🏗️ See `PROJECT_STRUCTURE.md` for code layout
- 💬 Open GitHub issue

## ✨ What Makes This Special?

Compared to your current dashboard:
- ✅ Full TypeScript safety
- ✅ Better error handling
- ✅ Cleaner component architecture
- ✅ Comprehensive documentation
- ✅ Production-ready setup
- ✅ One-command deployment

---

**You're ready to go! Happy dashboarding! 🎉**

Made with ❤️ for agile teams
