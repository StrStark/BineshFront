import { prisma } from "./prisma"

export interface ToolDefinition {
  type: "function"
  function: {
    name: string
    description: string
    parameters: Record<string, unknown>
  }
}

export async function executeTool(name: string, args: Record<string, unknown>): Promise<string> {
  switch (name) {
    case "get_sales_summary":
      return JSON.stringify(await getSalesSummary())
    case "get_products":
      return JSON.stringify(await getProducts())
    case "get_products_by_category":
      return JSON.stringify(await getProductsByCategory(args.category as string))
    case "get_customers":
      return JSON.stringify(await getCustomers())
    case "get_warehouse_items":
      return JSON.stringify(await getWarehouseItems(args.category as string | undefined))
    case "get_financial_transactions":
      return JSON.stringify(await getFinancialTransactions(args.limit as number | undefined))
    case "get_dashboard_stats":
      return JSON.stringify(await getDashboardStats())
    case "get_sales_by_period":
      return JSON.stringify(await getSalesByPeriod(args.startDate as string, args.endDate as string))
    case "get_low_stock_products":
      return JSON.stringify(await getLowStockProducts())
    default:
      return JSON.stringify({ error: `Tool "${name}" not found` })
  }
}

export const tools: ToolDefinition[] = [
  {
    type: "function",
    function: {
      name: "get_sales_summary",
      description: "Get overall sales summary including total revenue, total orders, average order value, and top selling products",
      parameters: { type: "object", properties: {} },
    },
  },
  {
    type: "function",
    function: {
      name: "get_products",
      description: "Get list of all products with their stock, price, and category information",
      parameters: { type: "object", properties: {} },
    },
  },
  {
    type: "function",
    function: {
      name: "get_products_by_category",
      description: "Get products filtered by category",
      parameters: {
        type: "object",
        properties: {
          category: { type: "string", description: "Category name to filter by" },
        },
        required: ["category"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "get_customers",
      description: "Get list of all customers with their purchase history and contact info",
      parameters: { type: "object", properties: {} },
    },
  },
  {
    type: "function",
    function: {
      name: "get_warehouse_items",
      description: "Get warehouse inventory items, optionally filtered by category",
      parameters: {
        type: "object",
        properties: {
          category: { type: "string", description: "Category to filter by (optional)" },
        },
      },
    },
  },
  {
    type: "function",
    function: {
      name: "get_financial_transactions",
      description: "Get financial transactions with amounts and categories",
      parameters: {
        type: "object",
        properties: {
          limit: { type: "number", description: "Maximum number of transactions to return" },
        },
      },
    },
  },
  {
    type: "function",
    function: {
      name: "get_dashboard_stats",
      description: "Get key dashboard statistics including total customers, products, sales count, and revenue",
      parameters: { type: "object", properties: {} },
    },
  },
  {
    type: "function",
    function: {
      name: "get_sales_by_period",
      description: "Get sales data filtered by date range",
      parameters: {
        type: "object",
        properties: {
          startDate: { type: "string", description: "Start date (format: YYYY-MM-DD)" },
          endDate: { type: "string", description: "End date (format: YYYY-MM-DD)" },
        },
        required: ["startDate", "endDate"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "get_low_stock_products",
      description: "Get products with low or critical stock levels that need restocking",
      parameters: { type: "object", properties: {} },
    },
  },
]

async function getSalesSummary() {
  const sales = await prisma.sale.findMany()
  const totalRevenue = sales.reduce((sum, s) => sum + s.amount, 0)
  const totalOrders = sales.length
  const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0

  const productSales = new Map<string, { qty: number; revenue: number }>()
  for (const s of sales) {
    const existing = productSales.get(s.productName) || { qty: 0, revenue: 0 }
    existing.qty += s.quantity
    existing.revenue += s.amount
    productSales.set(s.productName, existing)
  }
  const topProducts = [...productSales.entries()]
    .sort((a, b) => b[1].qty - a[1].qty)
    .slice(0, 5)
    .map(([name, data]) => ({ name, quantity: data.qty, revenue: data.revenue }))

  return { totalRevenue, totalOrders, avgOrderValue, topProducts }
}

async function getProducts() {
  return prisma.product.findMany({ orderBy: { name: "asc" } })
}

async function getProductsByCategory(category: string) {
  return prisma.product.findMany({ where: { category }, orderBy: { name: "asc" } })
}

async function getCustomers() {
  return prisma.customer.findMany({ orderBy: { name: "asc" } })
}

async function getWarehouseItems(category?: string) {
  const where = category ? { category } : {}
  return prisma.warehouseItem.findMany({ where, orderBy: { productName: "asc" } })
}

async function getFinancialTransactions(limit?: number) {
  return prisma.financialTransaction.findMany({
    orderBy: { date: "desc" },
    take: limit || 50,
  })
}

async function getDashboardStats() {
  const [customerCount, productCount, saleCount, warehouseCount] = await Promise.all([
    prisma.customer.count(),
    prisma.product.count(),
    prisma.sale.count(),
    prisma.warehouseItem.count(),
  ])
  const totalRevenue = (await prisma.sale.aggregate({ _sum: { amount: true } }))._sum.amount || 0
  return { customerCount, productCount, saleCount, warehouseCount, totalRevenue }
}

async function getSalesByPeriod(startDate: string, endDate: string) {
  return prisma.sale.findMany({
    where: {
      date: { gte: startDate, lte: endDate },
    },
    orderBy: { date: "asc" },
  })
}

async function getLowStockProducts() {
  const products = await prisma.product.findMany({
    where: {
      OR: [
        { status: "low" },
        { status: "critical" },
      ],
    },
    orderBy: { stock: "asc" },
  })
  const warehouse = await prisma.warehouseItem.findMany({
    where: {
      OR: [
        { status: "low" },
        { status: "critical" },
      ],
    },
    orderBy: { quantity: "asc" },
  })
  return { products, warehouse }
}
