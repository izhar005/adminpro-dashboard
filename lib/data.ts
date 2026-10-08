// Mock data for the dashboard

export interface User {
  id: string
  name: string
  email: string
  role: string
  status: "active" | "inactive"
  avatar: string
  joinDate: string
  department?: string
}

export interface Order {
  id: string
  customer: string
  product: string
  amount: number
  status: "pending" | "processing" | "completed" | "cancelled"
  date: string
  paymentMethod: string
}

export interface Task {
  id: string
  title: string
  description: string
  status: "todo" | "in-progress" | "review" | "done"
  priority: "low" | "medium" | "high"
  assignee: string
  dueDate: string
  tags: string[]
}

export interface CalendarEvent {
  id: string
  title: string
  start: Date
  end: Date
  category: "meeting" | "task" | "reminder" | "personal"
  description?: string
}

const USER_DEPARTMENTS = [
  "Engineering", "Engineering", "Design", "Product", "Marketing",
  "Sales", "Support", "Finance",
] as const

const USER_ROLES = [
  "Senior Developer", "Product Manager", "UX Designer", "Marketing Lead",
  "Sales Manager", "Support Specialist", "Data Analyst", "Account Executive",
] as const

const USER_FIRST_NAMES = [
  "Priya", "Daniel", "Yuki", "Omar", "Grace", "Lucas", "Nina", "Tomas",
  "Aisha", "Jonas", "Mei", "Rafael", "Sofia", "Andre", "Hana", "Viktor",
  "Leila", "Diego",
] as const

const USER_LAST_NAMES = [
  "Kowalski", "Ferreira", "Nakamura", "Haddad", "Mbeki", "Novak", "Petrov",
  "Silva", "Okafor", "Lindqvist", "Rossi", "Duarte", "Kim", "Ali", "Moreau",
  "Weber", "Costa", "Berg",
] as const

/**
 * Builds the demo user list — 5 hand-written examples followed by generated
 * ones, deterministic for the same reason as the orders. See `buildOrders`.
 */
function buildUsers(): User[] {
  const handWritten: User[] = [
    {
      id: "1", name: "Sarah Johnson", email: "sarah.j@company.com",
      role: "Product Manager", status: "active", avatar: "SJ",
      joinDate: "2023-01-15", department: "Product",
    },
    {
      id: "2", name: "Michael Chen", email: "michael.c@company.com",
      role: "Senior Developer", status: "active", avatar: "MC",
      joinDate: "2023-03-20", department: "Engineering",
    },
    {
      id: "3", name: "Emily Davis", email: "emily.d@company.com",
      role: "UX Designer", status: "active", avatar: "ED",
      joinDate: "2023-05-10", department: "Design",
    },
    {
      id: "4", name: "James Wilson", email: "james.w@company.com",
      role: "Marketing Lead", status: "inactive", avatar: "JW",
      joinDate: "2023-02-28", department: "Marketing",
    },
    {
      id: "5", name: "Lisa Anderson", email: "lisa.a@company.com",
      role: "Sales Manager", status: "active", avatar: "LA",
      joinDate: "2023-04-12", department: "Sales",
    },
  ]

  const generated: User[] = Array.from({ length: 20 }, (_, i) => {
    const n = i + handWritten.length
    const first = USER_FIRST_NAMES[i % USER_FIRST_NAMES.length]
    const last = USER_LAST_NAMES[i % USER_LAST_NAMES.length]
    const month = 1 + (i % 12)
    const day = 1 + (i % 27)

    return {
      id: String(n + 1),
      name: `${first} ${last}`,
      email: `${first.toLowerCase()}.${last.toLowerCase()}@company.com`,
      role: USER_ROLES[i % USER_ROLES.length],
      // Roughly 4 in 5 active, so the filter has both buckets populated.
      status: i % 5 === 4 ? "inactive" : "active",
      avatar: `${first[0]}${last[0]}`,
      joinDate: `2024-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`,
      department: USER_DEPARTMENTS[i % USER_DEPARTMENTS.length],
    }
  })

  return [...handWritten, ...generated]
}

export const mockUsers: User[] = buildUsers()

const ORDER_CUSTOMERS = [
  "Acme Corporation", "TechStart Inc", "Digital Solutions", "Global Systems",
  "Innovative Labs", "Northwind Traders", "Contoso Ltd", "Fabrikam Inc",
  "Adventure Works", "Litware Inc", "Proseware GmbH", "Fourth Coffee",
  "Woodgrove Bank", "Trey Research", "Tailspin Toys", "Wide World Importers",
  "Blue Yonder Airlines", "Coho Vineyard", "Alpine Ski House", "Tallgrass Energy",
]

const ORDER_PRODUCTS = [
  { name: "Basic Plan", amount: 1999 },
  { name: "Premium Plan", amount: 4999 },
  { name: "Enterprise Plan", amount: 9999 },
  { name: "Additional Seats", amount: 2500 },
  { name: "Priority Support", amount: 1500 },
] as const

const ORDER_PAYMENT_METHODS = ["Credit Card", "PayPal", "Bank Transfer", "Crypto"] as const

/**
 * Status mix, weighted by repeating each entry to its rough real-world share.
 * An even split would make the funnel chart look synthetic.
 */
const ORDER_STATUS_CYCLE = [
  "completed", "completed", "completed", "completed", "completed",
  "completed", "completed", "pending", "pending",
  "processing", "processing", "cancelled",
] as const

/**
 * Builds the demo order list.
 *
 * The first five are hand-written so the examples a buyer reads first look
 * intentional; the rest are generated so the tables, charts and analytics pages
 * have enough rows to be worth looking at.
 *
 * This is deterministic on purpose — `Math.random()` at module scope would
 * produce different data on the server and the client and trip a hydration
 * mismatch. Swap this for a real query when you add a database.
 */
function buildOrders(): Order[] {
  const handWritten: Order[] = [
    {
      id: "ORD-001", customer: "Acme Corporation", product: "Premium Plan",
      amount: 4999, status: "completed", date: "2024-01-15", paymentMethod: "Credit Card",
    },
    {
      id: "ORD-002", customer: "TechStart Inc", product: "Enterprise Plan",
      amount: 9999, status: "processing", date: "2024-01-16", paymentMethod: "Bank Transfer",
    },
    {
      id: "ORD-003", customer: "Digital Solutions", product: "Basic Plan",
      amount: 1999, status: "pending", date: "2024-01-17", paymentMethod: "PayPal",
    },
    {
      id: "ORD-004", customer: "Global Systems", product: "Premium Plan",
      amount: 4999, status: "completed", date: "2024-01-14", paymentMethod: "Credit Card",
    },
    {
      id: "ORD-005", customer: "Innovative Labs", product: "Enterprise Plan",
      amount: 9999, status: "cancelled", date: "2024-01-13", paymentMethod: "Credit Card",
    },
  ]

  const generated: Order[] = Array.from({ length: 45 }, (_, i) => {
    const n = i + handWritten.length
    const customer = ORDER_CUSTOMERS[n % ORDER_CUSTOMERS.length]
    const product = ORDER_PRODUCTS[n % ORDER_PRODUCTS.length]
    const status = ORDER_STATUS_CYCLE[n % ORDER_STATUS_CYCLE.length]
    const paymentMethod = ORDER_PAYMENT_METHODS[n % ORDER_PAYMENT_METHODS.length]

    // Walk backwards through the six months so the list reads newest-first.
    const day = 28 - (n % 28)
    const month = String(6 - Math.floor(n / 8)).padStart(2, "0")

    return {
      id: `ORD-${String(n + 1).padStart(3, "0")}`,
      customer,
      product: product.name,
      amount: product.amount,
      status,
      date: `2024-${month}-${String(day).padStart(2, "0")}`,
      paymentMethod,
    }
  })

  return [...handWritten, ...generated]
}

export const mockOrders: Order[] = buildOrders()

const TASK_SEED: { title: string; description: string; tags: string[] }[] = [
  { title: "Migrate settings page to server components", description: "Cut the client bundle by moving reads to the server", tags: ["performance", "nextjs"] },
  { title: "Add CSV export to orders", description: "Export the currently filtered rows as a CSV file", tags: ["feature", "orders"] },
  { title: "Audit colour contrast in dark mode", description: "Verify every text token meets WCAG AA on the dark background", tags: ["design", "accessibility"] },
  { title: "Rate-limit the login endpoint", description: "Throttle failed attempts per IP and email", tags: ["security", "backend"] },
  { title: "Document the setup flow", description: "Write the README install steps a buyer follows on a fresh clone", tags: ["docs"] },
  { title: "Replace mock data with Prisma", description: "Wire the users, orders and tasks pages to real queries", tags: ["backend", "database"] },
  { title: "Empty states for every table", description: "Show a helpful message when a filter returns nothing", tags: ["design", "ux"] },
  { title: "Keyboard shortcuts for the kanban board", description: "Move a card between columns without the mouse", tags: ["feature", "accessibility"] },
  { title: "Add pagination to the users table", description: "Page sizes of 10, 25 and 50 with a count in the footer", tags: ["feature", "users"] },
  { title: "Cache the dashboard stats query", description: "Revalidate the stats instead of recomputing on every render", tags: ["performance"] },
  { title: "Handle 500s with the error boundary", description: "Verify error.tsx catches route-level failures", tags: ["reliability"] },
  { title: "Add a confirm step to every delete", description: "No destructive action should fire on a single click", tags: ["ux", "safety"] },
  { title: "Compress uploaded avatars", description: "Resize and re-encode before storing", tags: ["performance", "media"] },
  { title: "Write integration tests for auth", description: "Cover login, signup and session restore", tags: ["testing", "security"] },
  { title: "Sort orders by revenue on the dashboard", description: "Surface the highest-value accounts first", tags: ["analytics"] },
  { title: "Fix timezone drift on calendar events", description: "Store UTC, render in the viewer’s zone", tags: ["bug", "calendar"] },
]

const TASK_STATUS_CYCLE = ["todo", "in-progress", "review", "done"] as const
const TASK_PRIORITY_CYCLE = ["low", "medium", "high"] as const
const TASK_ASSIGNEES = [
  "Sarah Johnson", "Michael Chen", "Emily Davis",
  "James Wilson", "Lisa Anderson",
] as const

/** Same shape as `buildUsers`/`buildOrders`: deterministic, hand-written first. */
function buildTasks(): Task[] {
  const handWritten: Task[] = [
    {
      id: "1",
      title: "Design new landing page",
      description: "Create a modern, conversion-optimized landing page",
      status: "in-progress",
      priority: "high",
      assignee: "Emily Davis",
      dueDate: "2024-01-25",
      tags: ["design", "marketing"],
    },
    {
      id: "2",
      title: "Implement authentication",
      description: "Add OAuth and SSO support",
      status: "todo",
      priority: "high",
      assignee: "Michael Chen",
      dueDate: "2024-01-30",
      tags: ["development", "security"],
    },
    {
      id: "3",
      title: "Q1 Marketing Campaign",
      description: "Plan and execute Q1 marketing strategy",
      status: "review",
      priority: "medium",
      assignee: "James Wilson",
      dueDate: "2024-02-01",
      tags: ["marketing", "strategy"],
    },
    {
      id: "4",
      title: "Customer feedback analysis",
      description: "Analyze and categorize customer feedback",
      status: "done",
      priority: "low",
      assignee: "Sarah Johnson",
      dueDate: "2024-01-20",
      tags: ["research", "product"],
    },
  ]

  const generated: Task[] = TASK_SEED.map((seed, i) => ({
    id: String(i + handWritten.length + 1),
    title: seed.title,
    description: seed.description,
    status: TASK_STATUS_CYCLE[i % TASK_STATUS_CYCLE.length],
    priority: TASK_PRIORITY_CYCLE[i % TASK_PRIORITY_CYCLE.length],
    assignee: TASK_ASSIGNEES[i % TASK_ASSIGNEES.length],
    dueDate: `2024-02-${String(1 + (i % 27)).padStart(2, "0")}`,
    tags: seed.tags,
  }))

  return [...handWritten, ...generated]
}

export const mockTasks: Task[] = buildTasks()

const EVENT_SEED: {
  title: string
  category: CalendarEvent["category"]
  description: string
  startHour: number
  durationHours: number
}[] = [
  { title: "Design Critique", category: "meeting", description: "Walk through the latest mockups", startHour: 11, durationHours: 1 },
  { title: "Sprint Planning", category: "meeting", description: "Plan the next two weeks of work", startHour: 9, durationHours: 2 },
  { title: "Customer Onboarding", category: "task", description: "Walk a new account through setup", startHour: 13, durationHours: 1.5 },
  { title: "Quarterly Business Review", category: "meeting", description: "Results, roadmap and budget", startHour: 15, durationHours: 3 },
  { title: "Deploy to Production", category: "task", description: "Ship the release and watch the metrics", startHour: 16, durationHours: 1 },
  { title: "Release v2.4", category: "task", description: "Cut the release and publish the changelog", startHour: 10, durationHours: 2 },
  { title: "All-Hands", category: "meeting", description: "Company-wide update", startHour: 12, durationHours: 1 },
  { title: "Support Escalation", category: "task", description: "Resolve the top escalated ticket", startHour: 15, durationHours: 2 },
  { title: "Roadmap Workshop", category: "meeting", description: "Prioritise the next quarter", startHour: 11, durationHours: 2.5 },
]

/**
 * Spreads the seed events across January.
 *
 * The three original entries are prepended by hand so the calendar opens on the
 * same week a buyer would recognise from the screenshots.
 */
function buildEvents(): CalendarEvent[] {
  const handWritten: CalendarEvent[] = [
    {
      id: "1", title: "Team Standup",
      start: new Date(2024, 0, 18, 9, 0), end: new Date(2024, 0, 18, 9, 30),
      category: "meeting", description: "Daily team sync",
    },
    {
      id: "2", title: "Product Review",
      start: new Date(2024, 0, 19, 14, 0), end: new Date(2024, 0, 19, 15, 30),
      category: "meeting", description: "Q1 product roadmap review",
    },
    {
      id: "3", title: "Design Sprint",
      start: new Date(2024, 0, 22, 10, 0), end: new Date(2024, 0, 22, 12, 0),
      category: "task", description: "New feature design sprint",
    },
  ]

  const generated: CalendarEvent[] = EVENT_SEED.map((seed, i) => {
    const n = i + handWritten.length
    const start = new Date(2024, 0, 2 + i * 2, seed.startHour, 0)

    // Whole and fractional hours separately — `setHours` drops the minutes.
    const wholeHours = Math.floor(seed.durationHours)
    const extraMinutes = (seed.durationHours % 1) * 60
    const end = new Date(start)
    end.setHours(end.getHours() + wholeHours)
    end.setMinutes(end.getMinutes() + extraMinutes)

    return {
      id: String(n + 1),
      title: seed.title,
      start,
      end,
      category: seed.category,
      description: seed.description,
    }
  })

  return [...handWritten, ...generated]
}

export const mockEvents: CalendarEvent[] = buildEvents()

export const dashboardStats = {
  revenue: {
    current: 125840,
    previous: 98320,
    trend: "up" as const,
  },
  sales: {
    current: 2543,
    previous: 2134,
    trend: "up" as const,
  },
  customers: {
    current: 8432,
    previous: 7891,
    trend: "up" as const,
  },
  conversion: {
    current: 3.42,
    previous: 3.18,
    trend: "up" as const,
  },
}

export const revenueData = [
  { month: "Jan", revenue: 42000, expenses: 28000 },
  { month: "Feb", revenue: 51000, expenses: 32000 },
  { month: "Mar", revenue: 48000, expenses: 30000 },
  { month: "Apr", revenue: 62000, expenses: 35000 },
  { month: "May", revenue: 71000, expenses: 38000 },
  { month: "Jun", revenue: 68000, expenses: 37000 },
]

export const salesByCategory = [
  { name: "Electronics", value: 42, color: "#03C9D7" },
  { name: "Clothing", value: 28, color: "#FB9678" },
  { name: "Home & Garden", value: 18, color: "#1E4DB7" },
  { name: "Sports", value: 12, color: "#00C292" },
]

export const trafficData = [
  { time: "00:00", visitors: 120 },
  { time: "04:00", visitors: 89 },
  { time: "08:00", visitors: 245 },
  { time: "12:00", visitors: 389 },
  { time: "16:00", visitors: 432 },
  { time: "20:00", visitors: 298 },
]
