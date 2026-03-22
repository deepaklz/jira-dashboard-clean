# 🚀 JIRA & Vercel MIS Dashboard Pro

A premium, production-ready Next.js dashboard for comprehensive JIRA sprint analytics and team performance tracking with glassmorphism design.

![Version](https://img.shields.io/badge/version-2.0.0-blue)
![Next.js](https://img.shields.io/badge/Next.js-14.2-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)
![License](https://img.shields.io/badge/license-MIT-green)

## ✨ Features

### 🎯 Core Capabilities
- **Multi-Board Sprint Aggregation** - Unified view across multiple boards with same sprint name
- **Automated Week Splitting** - Week 1 (first 7 days) vs Full Sprint metrics
- **Subtask Inclusion** - Full credit for developers working on subtasks
- **Smart On-Time Calculation** - Compares resolution vs due date with sprint end fallback
- **Global Search Fallback** - Catches cross-team tasks via JQL

### 📊 Analytics
- **Real-time Metrics** - Completion rates, on-time rates, velocity tracking
- **Visual Charts** - Velocity trends, burndown, issue distribution, team comparison
- **Employee Leaderboards** - Sort by completion rate, on-time rate, or velocity
- **Sprint Health Scoring** - AI-powered insights on team performance

### 🎨 Premium UI/UX
- **Glassmorphism Design** - Deep charcoal backgrounds (#0a0a0a) with subtle glass effects
- **Smooth Animations** - Framer Motion transitions and micro-interactions
- **Progress Rings** - Chart.js circular indicators for completion/on-time rates
- **Responsive Layout** - Mobile-first design with Tailwind CSS
- **Dark Theme** - Optimized for developer workflows

### 🔐 Security & Performance
- **Server-Side Proxy** - JIRA credentials never exposed to client
- **Smart Caching** - Multi-tier (1hr boards, 30min sprints, 10min issues)
- **SWR Auto-Refresh** - Hourly data updates without page reload
- **TypeScript** - Full type safety across the stack

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Client (Browser)                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │   Overview   │  │ Sprint View  │  │  Analytics   │  │
│  │   Dashboard  │  │  (Weekly +   │  │   Charts     │  │
│  │              │  │  Full Sprint)│  │              │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
└─────────────────────────────────────────────────────────┘
                          ↓ SWR (auto-refresh)
┌─────────────────────────────────────────────────────────┐
│              Next.js API Routes (Proxy)                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │ /api/jira/   │  │ /api/jira/   │  │ /api/jira/   │  │
│  │   boards     │  │  sprints     │  │   search     │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
│         ↓ Basic Auth                                     │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│                  JIRA REST API v3                        │
│           (your-domain.atlassian.net)                    │
└─────────────────────────────────────────────────────────┘
```

## 📦 Installation

### Prerequisites
- Node.js 18+ and npm/yarn
- JIRA Cloud account with API access
- Vercel account (optional, for deployment)

### Quick Start

1. **Clone and Install**
```bash
git clone <your-repo-url>
cd jira-vercel-dashboard-pro
npm install
```

2. **Configure Environment**
```bash
cp .env.example .env.local
```

Edit `.env.local`:
```env
JIRA_BASE_URL=https://your-domain.atlassian.net
JIRA_EMAIL=your-email@company.com
JIRA_API_TOKEN=your-api-token-here

# Optional
NEXT_PUBLIC_BOARD_IDS=1,2,3
NEXT_PUBLIC_CACHE_DURATION=3600000
```

**Get JIRA API Token:**
1. Go to https://id.atlassian.com/manage-profile/security/api-tokens
2. Click "Create API token"
3. Copy the token to your `.env.local`

3. **Run Development Server**
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

4. **Build for Production**
```bash
npm run build
npm start
```

## 🚢 Deployment

### Vercel (Recommended)

1. **Push to GitHub**
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin <your-repo-url>
git push -u origin main
```

2. **Deploy to Vercel**
```bash
npm install -g vercel
vercel
```

Or use the [Vercel Dashboard](https://vercel.com/new):
- Import your GitHub repository
- Add environment variables (JIRA_BASE_URL, JIRA_EMAIL, JIRA_API_TOKEN)
- Deploy!

### Environment Variables in Vercel
Go to Project Settings → Environment Variables and add:
- `JIRA_BASE_URL`
- `JIRA_EMAIL`
- `JIRA_API_TOKEN`

## 📖 Usage Guide

### Understanding Metrics

**Week 1 Metrics**
- Calculated as first 7 days from sprint start date
- Helps identify early sprint velocity

**Full Sprint Metrics**
- From sprint start to end date
- Comprehensive performance overview

**On-Time Calculation**
- Compares `resolutiondate` (or `updated` for subtasks) vs `duedate`
- Falls back to sprint end date if no due date set
- Task must be marked "Done" to count

**Subtask Inclusion**
- "Items" = Tasks + Subtasks
- Ensures developers get credit for all work

### API Rate Limits

JIRA Cloud limits:
- 300 requests per minute per user
- Dashboard uses smart caching to stay well within limits
- Auto-refresh set to 1 hour by default

## 🎨 Customization

### Change Theme Colors

Edit `tailwind.config.js`:
```js
colors: {
  accent: {
    success: '#10b981',  // Green
    warning: '#f59e0b',  // Amber
    progress: '#3b82f6', // Blue
    danger: '#ef4444',   // Red
    purple: '#a855f7',   // Purple
  },
}
```

### Adjust Cache Duration

Edit `.env.local`:
```env
NEXT_PUBLIC_CACHE_DURATION=1800000  # 30 minutes
NEXT_PUBLIC_AUTO_REFRESH_INTERVAL=1800000
```

### Add Custom Board Filters

Edit `pages/index.tsx` to filter specific board IDs:
```typescript
const boardIds = [1, 2, 3]; // Your board IDs
```

## 🔧 Troubleshooting

### JIRA API 401 Error
- Verify JIRA_EMAIL matches your Atlassian account
- Regenerate API token
- Check JIRA_BASE_URL format (no trailing slash)

### No Sprints Showing
- Ensure boards have active sprints
- Check board IDs in JIRA settings
- Verify API has permission to view sprints

### Data Not Refreshing
- Check browser console for errors
- Verify SWR configuration in `_app.tsx`
- Clear browser cache

## 📊 Business Logic Details

### Sprint Aggregation
When a sprint name (e.g., "Sprint 2") exists across multiple boards:
1. Fetch all sprint IDs with that name
2. Execute JQL: `sprint in (id1, id2, id3)`
3. Aggregate all issues into single view

### Employee Global Search
If an employee's tasks aren't found on a specific board:
1. Execute global JQL: `assignee = "accountId" AND sprint in (...)`
2. Merge results with board-specific tasks
3. Deduplicate by issue key

### Week Calculation
```typescript
Week 1 End = Sprint Start + 6 days (Day 0-6 = 7 days)
Week 2 = Day 7 to Sprint End
```

## 🤝 Contributing

Contributions welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Commit changes
4. Push to branch
5. Open a Pull Request

## 📄 License

MIT License - feel free to use in commercial projects.

## 🙏 Acknowledgments

Built with:
- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Chart.js](https://www.chartjs.org/)
- [Framer Motion](https://www.framer.com/motion/)
- [SWR](https://swr.vercel.app/)

## 📧 Support

For issues and questions:
- GitHub Issues: [Create an issue](https://github.com/your-repo/issues)
- Email: support@yourcompany.com

---

**Built with ❤️ for agile teams**
