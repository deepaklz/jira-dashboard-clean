# 📁 Project Structure

```
jira-vercel-dashboard-pro/
│
├── 📄 Configuration Files
│   ├── package.json                 # Dependencies & scripts
│   ├── tsconfig.json               # TypeScript config
│   ├── tailwind.config.js          # Tailwind customization
│   ├── postcss.config.js           # PostCSS config
│   ├── next.config.js              # Next.js config
│   ├── vercel.json                 # Vercel deployment config
│   ├── .env.example                # Environment template
│   ├── .gitignore                  # Git ignore rules
│   ├── README.md                   # Project documentation
│   └── DEPLOYMENT.md               # Deployment guide
│
├── 📂 pages/                       # Next.js pages (routes)
│   ├── _app.tsx                    # App initialization
│   ├── _document.tsx               # Custom HTML structure
│   ├── index.tsx                   # Dashboard overview (/)
│   ├── team.tsx                    # Team members page (/team)
│   ├── analytics.tsx               # Analytics charts (/analytics)
│   │
│   ├── 📂 sprint/
│   │   └── [name].tsx              # Sprint detail (/sprint/sprint-2)
│   │
│   └── 📂 api/                     # API routes (serverless)
│       └── 📂 jira/
│           ├── boards.ts           # GET /api/jira/boards
│           ├── search.ts           # POST /api/jira/search
│           └── 📂 boards/
│               └── [boardId]/
│                   └── sprints.ts  # GET /api/jira/boards/1/sprints
│
├── 📂 components/                  # React components
│   ├── 📂 layout/
│   │   ├── Layout.tsx              # Main layout wrapper
│   │   ├── Sidebar.tsx             # Navigation sidebar
│   │   └── Header.tsx              # Top header bar
│   │
│   ├── 📂 dashboard/
│   │   └── EmployeeCard.tsx        # Employee metrics card
│   │
│   └── 📂 ui/                      # Reusable UI components
│       ├── GlassCard.tsx           # Glassmorphism card
│       ├── ProgressRing.tsx        # Circular progress
│       └── StatCard.tsx            # Metric display card
│
├── 📂 lib/                         # Utility functions
│   ├── utils.ts                    # Helper functions
│   └── jira-service.ts             # JIRA business logic
│
├── 📂 types/                       # TypeScript definitions
│   └── jira.ts                     # JIRA & dashboard types
│
├── 📂 styles/                      # Global styles
│   └── globals.css                 # Tailwind + custom CSS
│
└── 📂 public/                      # Static assets
    └── favicon.ico                 # App icon

```

## 🗂️ File Purposes

### Configuration Layer

**package.json**
- Dependencies (Next.js, React, Chart.js, etc.)
- Scripts (dev, build, start, lint)
- Project metadata

**tsconfig.json**
- TypeScript compiler options
- Path aliases (@/components, @/lib)
- Strict type checking

**tailwind.config.js**
- Custom color palette (accent.success, accent.warning, etc.)
- Glassmorphism utilities
- Animation keyframes

**next.config.js**
- Image domains whitelist
- API CORS headers
- Production optimizations

**vercel.json**
- Deployment region (Mumbai - bom1)
- Function settings (30s timeout, 1GB memory)
- Cache headers

### Pages Layer

**pages/index.tsx**
- Dashboard overview
- Active sprints summary
- Quick action cards
- Aggregate metrics

**pages/sprint/[name].tsx**
- Sprint detail view
- Employee cards (weekly + full sprint)
- Filters (period, sort)
- CSV export

**pages/team.tsx**
- All team members
- Search & sort
- Top performer highlight
- Team statistics

**pages/analytics.tsx**
- Chart.js visualizations
- Velocity trend
- Burndown chart
- Issue distribution
- Performance comparison

**pages/api/jira/\***
- Server-side JIRA proxy
- Credential security
- Response caching
- Error handling

### Components Layer

**Layout Components**
- `Layout.tsx` - Main wrapper with sidebar
- `Sidebar.tsx` - Project-grouped navigation
- `Header.tsx` - Search bar & actions

**Dashboard Components**
- `EmployeeCard.tsx` - Individual performance
  - Progress rings
  - Weekly vs full sprint toggle
  - Breakdown by type

**UI Components**
- `GlassCard.tsx` - Premium card with blur
- `ProgressRing.tsx` - Chart.js circular progress
- `StatCard.tsx` - Metric with icon & trend

### Library Layer

**lib/utils.ts**
- Date calculations (week splitting)
- On-time logic
- Performance color mapping
- Rate calculations

**lib/jira-service.ts**
- Board fetching
- Sprint aggregation
- Issue JQL search
- Employee metrics calculation
- Global search fallback

### Types Layer

**types/jira.ts**
- `JiraIssue` - Issue structure
- `SprintData` - Sprint metadata
- `EmployeeMetrics` - Performance metrics
- `TeamMetrics` - Aggregate data

## 🔄 Data Flow

```
User Request
    ↓
Next.js Page (SSR/CSR)
    ↓
SWR Hook (client-side fetch)
    ↓
API Route (/api/jira/*)
    ↓
JIRA Service (lib/jira-service.ts)
    ↓
JIRA REST API v3
    ↓
Response (JSON)
    ↓
Type Validation (TypeScript)
    ↓
Component Render
    ↓
User Interface
```

## 📊 Key Patterns

### Component Pattern
```tsx
import { GlassCard } from '@/components/ui/GlassCard';
import { motion } from 'framer-motion';

export const MyComponent = () => {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <GlassCard hover>
        {/* Content */}
      </GlassCard>
    </motion.div>
  );
};
```

### API Route Pattern
```typescript
export default async function handler(req, res) {
  const auth = Buffer.from(
    `${process.env.JIRA_EMAIL}:${process.env.JIRA_API_TOKEN}`
  ).toString('base64');
  
  const response = await axios.get(JIRA_URL, {
    headers: { Authorization: `Basic ${auth}` }
  });
  
  res.setHeader('Cache-Control', 's-maxage=3600');
  res.status(200).json(response.data);
}
```

### Data Fetching Pattern
```typescript
import useSWR from 'swr';

const { data, error } = useSWR('/api/jira/boards', fetcher, {
  refreshInterval: 3600000, // 1 hour
  revalidateOnFocus: false,
});
```

## 🎯 Adding New Features

### Add New Page
1. Create `pages/my-page.tsx`
2. Add route in `Sidebar.tsx` navigation
3. Wrap in `<Layout>` component

### Add New API Route
1. Create `pages/api/my-route.ts`
2. Implement handler with JIRA proxy pattern
3. Add caching headers

### Add New Component
1. Create in appropriate folder (`ui/`, `dashboard/`, etc.)
2. Export from component file
3. Import where needed with `@/` alias

### Add New Chart
1. Import Chart.js components
2. Define data structure
3. Apply dark theme options
4. Wrap in `<GlassCard>`

## 🔍 Important Files to Edit

**For Styling:**
- `tailwind.config.js` - Colors, spacing
- `styles/globals.css` - Global CSS

**For Business Logic:**
- `lib/jira-service.ts` - Metric calculations
- `lib/utils.ts` - Helper functions

**For UI:**
- `components/ui/*` - Reusable components
- `components/dashboard/*` - Feature components

**For Configuration:**
- `.env.local` - Environment variables
- `next.config.js` - Build settings
- `vercel.json` - Deployment config

---

**Navigate with confidence! 🗺️**
