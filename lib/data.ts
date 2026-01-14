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

export const mockUsers: User[] = [
  {
    id: "1",
    name: "Sarah Johnson",
    email: "sarah.j@company.com",
    role: "Product Manager",
    status: "active",
    avatar: "SJ",
    joinDate: "2023-01-15",
    department: "Product",
  },
  {
    id: "2",
    name: "Michael Chen",
    email: "michael.c@company.com",
    role: "Senior Developer",
    status: "active",
    avatar: "MC",
    joinDate: "2023-03-20",
    department: "Engineering",
  },
  {
    id: "3",
    name: "Emily Davis",
    email: "emily.d@company.com",
    role: "UX Designer",
    status: "active",
    avatar: "ED",
    joinDate: "2023-05-10",
    department: "Design",
  },
  {
    id: "4",
    name: "James Wilson",
    email: "james.w@company.com",
    role: "Marketing Lead",
    status: "inactive",
    avatar: "JW",
    joinDate: "2023-02-28",
    department: "Marketing",
  },
  {
    id: "5",
    name: "Lisa Anderson",
    email: "lisa.a@company.com",
    role: "Sales Manager",
    status: "active",
    avatar: "LA",
    joinDate: "2023-04-12",
    department: "Sales",
  },
]

export const mockOrders: Order[] = [
  {
    id: "ORD-001",
    customer: "Acme Corporation",
    product: "Premium Plan",
    amount: 4999,
    status: "completed",
    date: "2024-01-15",
    paymentMethod: "Credit Card",
  },
  {
    id: "ORD-002",
    customer: "TechStart Inc",
    product: "Enterprise Plan",
    amount: 9999,
    status: "processing",
    date: "2024-01-16",
    paymentMethod: "Bank Transfer",
  },
  {
    id: "ORD-003",
    customer: "Digital Solutions",
    product: "Basic Plan",
    amount: 1999,
    status: "pending",
    date: "2024-01-17",
    paymentMethod: "PayPal",
  },
  {
    id: "ORD-004",
    customer: "Global Systems",
    product: "Premium Plan",
    amount: 4999,
    status: "completed",
    date: "2024-01-14",
    paymentMethod: "Credit Card",
  },
  {
    id: "ORD-005",
    customer: "Innovative Labs",
    product: "Enterprise Plan",
    amount: 9999,
    status: "cancelled",
    date: "2024-01-13",
    paymentMethod: "Credit Card",
  },
]

export const mockTasks: Task[] = [
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

export const mockEvents: CalendarEvent[] = [
  {
    id: "1",
    title: "Team Standup",
    start: new Date(2024, 0, 18, 9, 0),
    end: new Date(2024, 0, 18, 9, 30),
    category: "meeting",
    description: "Daily team sync",
  },
  {
    id: "2",
    title: "Product Review",
    start: new Date(2024, 0, 19, 14, 0),
    end: new Date(2024, 0, 19, 15, 30),
    category: "meeting",
    description: "Q1 product roadmap review",
  },
  {
    id: "3",
    title: "Design Sprint",
    start: new Date(2024, 0, 22, 10, 0),
    end: new Date(2024, 0, 22, 12, 0),
    category: "task",
    description: "New feature design sprint",
  },
]

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
