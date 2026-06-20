import { PrismaClient } from '@prisma/client'
import crypto from 'crypto'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Create accounts for testing
  const accountsData = [
    { username: '+989121111111', name: 'مدیر سیستم', role: 'admin', position: 'مدیر سیستم', title: 'مهندس' },
    { username: '+989135098259', name: 'رامتین قیامی', role: 'admin', position: 'مدیر سیستم', title: 'مهندس' },
  ]
  for (const acc of accountsData) {
    await prisma.account.upsert({
      where: { username: acc.username },
      update: { name: acc.name, role: acc.role, position: acc.position, title: acc.title },
      create: { ...acc, password: '' },
    })
    console.log(`✅ Account upserted: ${acc.username} -> ${acc.name}`)
  }

  // Create products
  const productNames = [
    { name: 'مبل راحتی چرمی', category: 'furniture', stock: 2, price: 25000000 },
    { name: 'میز ناهارخوری 6 نفره', category: 'furniture', stock: 1, price: 18000000 },
    { name: 'فرش ماشینی 6 متری', category: 'textile', stock: 6, price: 12000000 },
    { name: 'صندلی غذاخوری', category: 'furniture', stock: 28, price: 3500000 },
    { name: 'کاور مبل 3 نفره', category: 'textile', stock: 64, price: 2200000 },
    { name: 'یخچال سامسونگ 20 فوت', category: 'appliance', stock: 5, price: 45000000 },
    { name: 'تلویزیون ال جی 65 اینچ', category: 'electronics', stock: 3, price: 55000000 },
    { name: 'لباسشویی بوش 9 کیلو', category: 'appliance', stock: 4, price: 38000000 },
    { name: 'کولر گازی گری 24000', category: 'appliance', stock: 7, price: 32000000 },
    { name: 'جاروبرقی فیلیپس', category: 'electronics', stock: 12, price: 8500000 },
  ]

  const products = []
  for (const p of productNames) {
    const product = await prisma.product.create({
      data: { ...p, minStock: 5, maxStock: 30, status: 'normal', daysInStock: Math.floor(Math.random() * 180), lastUpdate: '1403/10/15' },
    })
    products.push(product)
  }
  console.log(`✅ ${products.length} products created`)

  // Create customers
  const customerNames = [
    { name: 'محمد احمدی', phone: '09121234567', totalPurchases: 45000000, segment: 'vip', orderCount: 23 },
    { name: 'فاطمه حسینی', phone: '09122345678', totalPurchases: 28000000, segment: 'premium', orderCount: 15 },
    { name: 'علی رضایی', phone: '09123456789', totalPurchases: 52000000, segment: 'vip', orderCount: 31 },
    { name: 'زهرا محمدی', phone: '09124567890', totalPurchases: 12000000, segment: 'regular', orderCount: 7 },
    { name: 'سارا جعفری', phone: '09128901234', totalPurchases: 15000000, segment: 'regular', orderCount: 9 },
    { name: 'امیر حسینی', phone: '09126789012', totalPurchases: 32000000, segment: 'premium', orderCount: 18 },
    { name: 'نرگس کریمی', phone: '09127890123', totalPurchases: 8000000, segment: 'regular', orderCount: 4 },
    { name: 'رضا موسوی', phone: '09129012345', totalPurchases: 60000000, segment: 'vip', orderCount: 35 },
  ]

  const customers = []
  for (const c of customerNames) {
    const customer = await prisma.customer.create({
      data: {
        ...c,
        email: `${c.name.replace(/\s/g, '.').toLowerCase()}@example.com`,
        lastPurchase: '1403/10/12',
        status: c.segment === 'vip' ? 'active' : 'active',
        joinDate: `1402/0${Math.floor(Math.random() * 9) + 1}/15`,
      },
    })
    customers.push(customer)
  }
  console.log(`✅ ${customers.length} customers created`)

  // Create sales
  const saleRecords = [
    { invoiceNumber: 'INV-001', productName: 'مبل راحتی چرمی', category: 'furniture', quantity: 1, customerName: 'محمد احمدی', seller: 'کارشناس فروش', amount: 25000000, date: '1403/10/15', paymentStatus: 'پرداخت شده', orderStatus: 'تکمیل شده' },
    { invoiceNumber: 'INV-002', productName: 'فرش ماشینی 6 متری', category: 'textile', quantity: 2, customerName: 'فاطمه حسینی', seller: 'کارشناس فروش', amount: 24000000, date: '1403/10/14', paymentStatus: 'پرداخت شده', orderStatus: 'تکمیل شده' },
    { invoiceNumber: 'INV-003', productName: 'تلویزیون ال جی 65 اینچ', category: 'electronics', quantity: 1, customerName: 'علی رضایی', seller: 'کارشناس فروش', amount: 55000000, date: '1403/10/13', paymentStatus: 'در انتظار', orderStatus: 'در حال پردازش' },
    { invoiceNumber: 'INV-004', productName: 'یخچال سامسونگ 20 فوت', category: 'appliance', quantity: 1, customerName: 'زهرا محمدی', seller: 'کارشناس فروش', amount: 45000000, date: '1403/10/12', paymentStatus: 'پرداخت شده', orderStatus: 'تکمیل شده' },
    { invoiceNumber: 'INV-005', productName: 'صندلی غذاخوری', category: 'furniture', quantity: 4, customerName: 'سارا جعفری', seller: 'کارشناس فروش', amount: 14000000, date: '1403/10/11', paymentStatus: 'پرداخت شده', orderStatus: 'تکمیل شده' },
    { invoiceNumber: 'INV-006', productName: 'لباسشویی بوش 9 کیلو', category: 'appliance', quantity: 1, customerName: 'امیر حسینی', seller: 'کارشناس فروش', amount: 38000000, date: '1403/10/10', paymentStatus: 'لغو شده', orderStatus: 'لغو شده' },
    { invoiceNumber: 'INV-007', productName: 'کولر گازی گری 24000', category: 'appliance', quantity: 2, customerName: 'رضا موسوی', seller: 'کارشناس فروش', amount: 64000000, date: '1403/10/09', paymentStatus: 'پرداخت شده', orderStatus: 'تکمیل شده' },
    { invoiceNumber: 'INV-008', productName: 'جاروبرقی فیلیپس', category: 'electronics', quantity: 1, customerName: 'نرگس کریمی', seller: 'کارشناس فروش', amount: 8500000, date: '1403/10/08', paymentStatus: 'پرداخت شده', orderStatus: 'تکمیل شده' },
    { invoiceNumber: 'INV-009', productName: 'میز ناهارخوری 6 نفره', category: 'furniture', quantity: 1, customerName: 'محمد احمدی', seller: 'کارشناس فروش', amount: 18000000, date: '1403/10/07', paymentStatus: 'پرداخت شده', orderStatus: 'تکمیل شده' },
    { invoiceNumber: 'INV-010', productName: 'کاور مبل 3 نفره', category: 'textile', quantity: 3, customerName: 'علی رضایی', seller: 'کارشناس فروش', amount: 6600000, date: '1403/10/06', paymentStatus: 'در انتظار', orderStatus: 'در حال پردازش' },
  ]

  for (const sale of saleRecords) {
    const customer = customers.find(c => c.name === sale.customerName)
    const product = products.find(p => p.name === sale.productName)

    await prisma.sale.create({
      data: {
        ...sale,
        customerId: customer?.id,
        productId: product?.id,
      },
    })
  }
  console.log(`✅ ${saleRecords.length} sales created`)

  // Create warehouse transactions
  const dates = ['1403/09/01', '1403/09/08', '1403/09/15', '1403/09/22', '1403/09/29', '1403/10/06', '1403/10/13']
  const ins = [145, 167, 134, 189, 156, 178, 145]
  const outs = [89, 112, 98, 134, 145, 156, 123]

  for (let i = 0; i < dates.length; i++) {
    await prisma.warehouseTransaction.create({
      data: { date: dates[i], in: ins[i], out: outs[i] },
    })
  }
  console.log(`✅ ${dates.length} warehouse transactions created`)

  // Create financial transactions
  const financialTxns = [
    { date: '1403/09/01', description: 'فروش کالا', amount: 250000000, type: 'income', category: 'فروش' },
    { date: '1403/09/02', description: 'اجاره محل', amount: 50000000, type: 'expense', category: 'عملیاتی' },
    { date: '1403/09/03', description: 'حقوق کارکنان', amount: 80000000, type: 'expense', category: 'پرسنلی' },
    { date: '1403/09/04', description: 'خرید کالا', amount: 120000000, type: 'expense', category: 'تدارکات' },
    { date: '1403/09/05', description: 'سود سرمایه‌گذاری', amount: 30000000, type: 'income', category: 'سرمایه‌گذاری' },
    { date: '1403/09/06', description: 'هزینه حمل و نقل', amount: 15000000, type: 'expense', category: 'عملیاتی' },
  ]

  for (const t of financialTxns) {
    await prisma.financialTransaction.create({ data: t })
  }
  console.log(`✅ ${financialTxns.length} financial transactions created`)

  // Create warehouse items
  const warehouseItems = [
    { productName: 'فرش ۴۰۰*۳ شانه تراکم ۱۶۰۰ پرستیژ', category: 'فرش', warehouse: 'انبار ۱', quantity: 45, unit: 'عدد', lastUpdate: '1403/09/15', status: 'normal', minStock: 20, maxStock: 100 },
    { productName: 'مبل راحتی 7 نفره چستر', category: 'مبلمان', warehouse: 'انبار ۲', quantity: 8, unit: 'دست', lastUpdate: '1403/09/14', status: 'low', minStock: 10, maxStock: 50 },
    { productName: 'تابلو فرش دستباف ۱۰۰*۱۵۰', category: 'تابلو فرش', warehouse: 'نمایشگاه فرش ۴', quantity: 2, unit: 'عدد', lastUpdate: '1403/09/13', status: 'critical', minStock: 5, maxStock: 20 },
    { productName: 'موکت ۷۰۰*۵ شانه تراکم ۲۵۰۰', category: 'موکت', warehouse: 'انبار ۳', quantity: 150, unit: 'متر', lastUpdate: '1403/09/15', status: 'excess', minStock: 50, maxStock: 100 },
    { productName: 'فرش ماشینی ۱۲۰۰*۹ شانه', category: 'فرش', warehouse: 'انبار ۱', quantity: 65, unit: 'عدد', lastUpdate: '1403/09/14', status: 'normal', minStock: 30, maxStock: 80 },
    { productName: 'مبل کلاسیک 5 نفره', category: 'مبلمان', warehouse: 'انبار ۲', quantity: 15, unit: 'دست', lastUpdate: '1403/09/15', status: 'normal', minStock: 10, maxStock: 30 },
    { productName: 'فرش دستباف تبریز', category: 'فرش', warehouse: 'نمایشگاه فرش ۴', quantity: 3, unit: 'عدد', lastUpdate: '1403/09/12', status: 'critical', minStock: 5, maxStock: 15 },
    { productName: 'کوسن تزئینی', category: 'کالای ۲', warehouse: 'انبار ۳', quantity: 200, unit: 'عدد', lastUpdate: '1403/09/15', status: 'excess', minStock: 100, maxStock: 150 },
  ]
  for (const item of warehouseItems) {
    await prisma.warehouseItem.create({ data: item })
  }
  console.log(`✅ ${warehouseItems.length} warehouse items created`)

  // Create AI preferences for existing accounts
  const accounts = await prisma.account.findMany()
  for (const account of accounts) {
    await prisma.aiPreference.upsert({
      where: { accountId: account.id },
      update: {},
      create: { accountId: account.id, model: "gpt-4o-mini", apiUrl: "https://api.openai.com/v1" },
    })
  }
  console.log(`✅ ${accounts.length} AI preferences created`)

  console.log('✅ Seeding complete!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
