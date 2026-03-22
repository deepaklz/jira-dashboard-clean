# 🏗️ Technical Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │   Browser    │  │  Mobile App  │  │   Desktop    │          │
│  │  (React UI)  │  │ (Responsive) │  │   Client     │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
│         │                  │                  │                  │
│         └──────────────────┴──────────────────┘                  │
│                           │                                      │
│                    SWR Auto-Refresh                              │
│                    (Every 1 hour)                                │
└───────────────────────────┬─────────────────────────────────────┘
                            │
                            │ HTTPS
                            │
┌───────────────────────────▼─────────────────────────────────────┐
│                    NEXT.JS APPLICATION                           │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │                     PAGES LAYER                            │ │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  │ │
│  │  │   Home   │  │  Sprint  │  │Analytics │  │   Team   │  │ │
│  │  │   (/)    │  │ ([name]) │  │          │  │          │  │ │
│  │  └──────────┘  └──────────┘  └──────────┘  └──────────┘  │ │
│  └────────────────────────────────────────────────────────────┘ │
│                            │                                     │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │                   COMPONENT LAYER                          │ │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐                │ │
│  │  │  Layout  │  │Dashboard │  │    UI    │                │ │
│  │  │          │  │Components│  │Primitives│                │ │
│  │  └──────────┘  └──────────┘  └──────────┘                │ │
│  └────────────────────────────────────────────────────────────┘ │
│                            │                                     │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │                     API ROUTES                             │ │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐    │ │
│  │  │ /api/jira/   │  │ /api/jira/   │  │ /api/jira/   │    │ │
│  │  │   boards     │  │  sprints     │  │   search     │    │ │
│  │  └──────────────┘  └──────────────┘  └──────────────┘    │ │
│  │         │                  │                  │            │ │
│  │    [1hr cache]      [30min cache]     [10min cache]       │ │
│  └────────┬───────────────────┴──────────────────┬────────────┘ │
│           │                                      │              │
│           │         Basic Auth Header            │              │
│           │      (Server-side only)              │              │
└───────────┼──────────────────────────────────────┼──────────────┘
            │                                      │
            │                                      │
┌───────────▼──────────────────────────────────────▼──────────────┐
│                    JIRA CLOUD REST API v3                        │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │   Endpoints: /board, /sprint, /search (JQL)               │ │
│  │   Rate Limit: 300 requests/minute per user                │ │
│  │   Authentication: Basic Auth (email + API token)          │ │
│  └────────────────────────────────────────────────────────────┘ │
│           https://your-domain.atlassian.net                      │
└──────────────────────────────────────────────────────────────────┘
```

## Data Flow Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                     USER INTERACTION                             │
│  User visits: /sprint/sprint-2                                   │
└───────────────────────────┬─────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                  NEXT.JS PAGE COMPONENT                          │
│  1. useRouter() gets sprint name from URL                       │
│  2. useSWR() fetches boards list                                │
│  3. useEffect() triggers loadSprintData()                       │
└───────────────────────────┬─────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                   JIRA SERVICE LAYER                             │
│  calculateTeamMetrics(boardIds, sprintName)                     │
│    │                                                             │
│    ├─► getSprintsByName(boardIds, "Sprint 2")                   │
│    │     └─► Returns: [sprintId: 101, 205, 312]                 │
│    │                                                             │
│    ├─► getIssuesForSprint([101, 205, 312])                      │
│    │     └─► JQL: sprint in (101,205,312)                       │
│    │     └─► Returns: 150 issues                                │
│    │                                                             │
│    ├─► groupByAssignee(issues)                                  │
│    │     └─► Map<accountId, Issue[]>                            │
│    │                                                             │
│    ├─► For each employee:                                       │
│    │     ├─► calculateEmployeeMetrics()                         │
│    │     │     ├─► Week 1 metrics                               │
│    │     │     └─► Full sprint metrics                          │
│    │     │                                                       │
│    │     └─► searchEmployeeTasks() [Fallback]                   │
│    │           └─► Global JQL search                            │
│    │                                                             │
│    └─► Returns: TeamMetrics                                     │
└───────────────────────────┬─────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                     API PROXY LAYER                              │
│  POST /api/jira/search                                           │
│    │                                                             │
│    ├─► Build authorization header                               │
│    │     Buffer.from(email:token).toString('base64')            │
│    │                                                             │
│    ├─► Forward request to JIRA                                  │
│    │     axios.post(JIRA_URL, { jql, fields })                  │
│    │                                                             │
│    ├─► Set cache headers                                        │
│    │     Cache-Control: s-maxage=600                            │
│    │                                                             │
│    └─► Return response                                          │
│          res.status(200).json(data)                             │
└───────────────────────────┬─────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                       JIRA API                                   │
│  Executes JQL query against JIRA database                       │
│  Returns paginated results (maxResults: 1000)                   │
└───────────────────────────┬─────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                    RESPONSE FLOW                                 │
│  JIRA → API Route → Service Layer → Component → UI              │
│                                                                  │
│  Transformations:                                                │
│    Raw JIRA JSON                                                 │
│      ↓                                                           │
│    Type-safe TeamMetrics                                         │
│      ↓                                                           │
│    Employee cards with progress rings                            │
│      ↓                                                           │
│    Rendered UI with animations                                   │
└──────────────────────────────────────────────────────────────────┘
```

## Component Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                       LAYOUT LAYER                               │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  <Layout>                                                  │ │
│  │    ├─ <Sidebar>                                            │ │
│  │    │    ├─ Navigation Links                                │ │
│  │    │    ├─ Board Groups                                    │ │
│  │    │    └─ Sprint Links                                    │ │
│  │    │                                                        │ │
│  │    ├─ <Header>                                             │ │
│  │    │    ├─ Search Bar                                      │ │
│  │    │    ├─ Refresh Button                                  │ │
│  │    │    └─ Export Button                                   │ │
│  │    │                                                        │ │
│  │    └─ <main>                                               │ │
│  │         └─ {children}                                      │ │
│  │                                                             │ │
│  └────────────────────────────────────────────────────────────┘ │
└──────────────────────────┬───────────────────────────────────────┘
                           │
┌──────────────────────────▼───────────────────────────────────────┐
│                      PAGE COMPONENTS                             │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  <SprintDetailPage>                                        │ │
│  │    ├─ <StatGrid>                                           │ │
│  │    │    └─ <StatCard> × 4                                  │ │
│  │    │                                                        │ │
│  │    ├─ <GlassCard> (Filters)                                │ │
│  │    │    ├─ Period Toggle (Week 1 / Full Sprint)           │ │
│  │    │    └─ Sort Dropdown                                   │ │
│  │    │                                                        │ │
│  │    └─ Employee Grid                                        │ │
│  │         └─ <EmployeeCard> × N                              │ │
│  │              ├─ Avatar                                      │ │
│  │              ├─ <ProgressRingGroup>                        │ │
│  │              │    ├─ Completion Ring                       │ │
│  │              │    └─ On-Time Ring                          │ │
│  │              ├─ Stats Grid                                 │ │
│  │              └─ Type Breakdown                             │ │
│  │                                                             │ │
│  └────────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────────┘
```

## State Management

```
┌─────────────────────────────────────────────────────────────────┐
│                      SWR CACHE LAYER                             │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  Key: '/api/jira/boards'                                   │ │
│  │  Data: BoardData[]                                         │ │
│  │  Stale: 1 hour                                             │ │
│  │  Revalidate: On reconnect                                  │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                  │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  Key: '/api/jira/boards/1/sprints'                        │ │
│  │  Data: SprintData[]                                        │ │
│  │  Stale: 30 minutes                                         │ │
│  │  Deduping: 10 seconds                                      │ │
│  └────────────────────────────────────────────────────────────┘ │
└──────────────────────────┬───────────────────────────────────────┘
                           │
┌──────────────────────────▼───────────────────────────────────────┐
│                   COMPONENT STATE                                │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  useState                                                  │ │
│  │    ├─ teamMetrics: TeamMetrics | null                     │ │
│  │    ├─ isLoading: boolean                                  │ │
│  │    ├─ selectedPeriod: 'weekly' | 'fullSprint'             │ │
│  │    └─ sortBy: 'completionRate' | 'onTimeRate'             │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                  │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  Derived State (useMemo)                                   │ │
│  │    ├─ sortedEmployees                                      │ │
│  │    ├─ filteredEmployees                                    │ │
│  │    └─ aggregateMetrics                                     │ │
│  └────────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────────┘
```

## Security Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    SECURITY LAYERS                               │
│                                                                  │
│  Layer 1: Environment Variables                                 │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  JIRA_BASE_URL    ─┐                                       │ │
│  │  JIRA_EMAIL       ─┼─► Server-side only                    │ │
│  │  JIRA_API_TOKEN   ─┘    (process.env)                      │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                  │
│  Layer 2: API Routes (Proxy)                                    │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  ✅ Credentials never reach client                         │ │
│  │  ✅ CORS headers configured                                │ │
│  │  ✅ Request validation                                     │ │
│  │  ✅ Error sanitization                                     │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                  │
│  Layer 3: HTTPS (Vercel)                                        │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  ✅ Automatic SSL certificates                             │ │
│  │  ✅ DDoS protection                                        │ │
│  │  ✅ Edge caching                                           │ │
│  └────────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────────┘
```

## Performance Optimizations

```
1. Server-Side Rendering (SSR)
   ├─► First paint: <1s
   └─► SEO friendly

2. Code Splitting
   ├─► Route-based chunks
   ├─► Dynamic imports
   └─► Tree shaking

3. Image Optimization
   ├─► WebP conversion
   ├─► Lazy loading
   └─► Responsive sizes

4. Caching Strategy
   ├─► CDN edge cache
   ├─► SWR memory cache
   └─► Browser cache

5. Bundle Size
   ├─► Tailwind purge
   ├─► Minification
   └─► Gzip compression
```

## Deployment Pipeline

```
┌─────────────────────────────────────────────────────────────────┐
│  Developer                                                       │
│    │                                                             │
│    │ git push                                                    │
│    ▼                                                             │
│  GitHub Repository                                               │
│    │                                                             │
│    │ webhook trigger                                             │
│    ▼                                                             │
│  Vercel Build System                                             │
│    ├─► Install dependencies (npm ci)                            │
│    ├─► Type check (tsc --noEmit)                                │
│    ├─► Lint (eslint)                                            │
│    ├─► Build (next build)                                       │
│    │     ├─► SSR pages                                          │
│    │     ├─► API routes                                         │
│    │     └─► Static assets                                      │
│    │                                                             │
│    └─► Deploy to Edge Network                                   │
│          ├─► Mumbai (bom1) - primary                            │
│          ├─► Singapore (sin1) - fallback                        │
│          └─► Global CDN                                         │
│                                                                  │
│  Production URL: https://your-app.vercel.app                    │
└──────────────────────────────────────────────────────────────────┘
```

## Technology Stack Details

```
Frontend:
  ├─ React 18.3         → UI library
  ├─ Next.js 14.2       → Framework
  ├─ TypeScript 5.3     → Type safety
  ├─ Tailwind CSS 3.4   → Styling
  └─ Framer Motion 11   → Animations

Data Fetching:
  ├─ SWR 2.2            → Client-side cache
  ├─ Axios 1.6          → HTTP client
  └─ React Query (opt)  → Alternative

Visualization:
  ├─ Chart.js 4.4       → Charts
  ├─ Recharts 2.12      → Alternative charts
  └─ Lucide React       → Icons

Backend:
  ├─ Next.js API        → Serverless functions
  ├─ Vercel Functions   → Hosting
  └─ JIRA REST API v3   → Data source

Development:
  ├─ ESLint             → Code quality
  ├─ Prettier           → Formatting
  └─ Git                → Version control
```

---

**A scalable, secure, and performant architecture! 🏗️**
