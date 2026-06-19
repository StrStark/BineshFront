import { Transaction, ExpenseDetail, FinancialSummary, BalanceSheet } from "./types";

export const MOCK_TRANSACTIONS: Transaction[] = [
  {
    id: "T001",
    date: "1403/10/15",
    description: "فروش مبل راحتی",
    amount: 25000000,
    type: "income"
  },
  {
    id: "T002",
    date: "1403/10/15",
    description: "حقوق پرسنل",
    amount: 45000000,
    type: "expense",
    category: "هزینه‌های پرسنلی"
  },
  {
    id: "T003",
    date: "1403/10/14",
    description: "فروش میز ناهارخوری",
    amount: 18000000,
    type: "income"
  },
  {
    id: "T004",
    date: "1403/10/14",
    description: "اجاره ماهانه",
    amount: 15000000,
    type: "expense",
    category: "اجاره و تأسیسات"
  },
  {
    id: "T005",
    date: "1403/10/13",
    description: "فروش کمد دیواری",
    amount: 32000000,
    type: "income"
  },
  {
    id: "T006",
    date: "1403/10/13",
    description: "کمپین تبلیغاتی اینستاگرام",
    amount: 8000000,
    type: "expense",
    category: "بازاریابی و تبلیغات"
  },
  {
    id: "T007",
    date: "1403/10/12",
    description: "فروش صندلی اداری",
    amount: 12000000,
    type: "income"
  },
  {
    id: "T008",
    date: "1403/10/12",
    description: "خرید محصولات جدید",
    amount: 85000000,
    type: "expense",
    category: "خرید کالا"
  },
  {
    id: "T009",
    date: "1403/10/11",
    description: "فروش لوستر",
    amount: 15000000,
    type: "income"
  },
  {
    id: "T010",
    date: "1403/10/11",
    description: "هزینه حمل و نقل",
    amount: 5500000,
    type: "expense",
    category: "حمل و نقل"
  },
];

export const MOCK_EXPENSE_DETAILS: ExpenseDetail[] = [
  {
    category: "هزینه‌های پرسنلی",
    currentMonth: 45000000,
    previousMonth: 42000000,
    change: 7.1,
    percentage: 32.8
  },
  {
    category: "اجاره و تأسیسات",
    currentMonth: 15000000,
    previousMonth: 15000000,
    change: 0,
    percentage: 10.9
  },
  {
    category: "بازاریابی و تبلیغات",
    currentMonth: 12000000,
    previousMonth: 15000000,
    change: -20.0,
    percentage: 8.7
  },
  {
    category: "خرید کالا",
    currentMonth: 35000000,
    previousMonth: 32000000,
    change: 9.4,
    percentage: 25.5
  },
  {
    category: "حمل و نقل",
    currentMonth: 8500000,
    previousMonth: 7800000,
    change: 9.0,
    percentage: 6.2
  },
  {
    category: "نگهداری و تعمیرات",
    currentMonth: 6200000,
    previousMonth: 5500000,
    change: 12.7,
    percentage: 4.5
  },
  {
    category: "مالیات و بیمه",
    currentMonth: 9800000,
    previousMonth: 9500000,
    change: 3.2,
    percentage: 7.1
  },
  {
    category: "آموزش و توسعه",
    currentMonth: 3500000,
    previousMonth: 2800000,
    change: 25.0,
    percentage: 2.5
  },
  {
    category: "سایر هزینه‌ها",
    currentMonth: 2500000,
    previousMonth: 3200000,
    change: -21.9,
    percentage: 1.8
  }
];

export const MOCK_FINANCIAL_SUMMARY: FinancialSummary = {
  totalIncome: 450000000,
  totalExpenses: 285000000,
  netProfit: 165000000,
  profitMargin: 36.7
};

export const MOCK_BALANCE_SHEET: BalanceSheet = {
  assets: [
    {
      category: "دارایی‌های جاری",
      amount: 850000000,
      percentage: 45.2,
      change: 8.5
    },
    {
      category: "موجودی کالا",
      amount: 625000000,
      percentage: 33.2,
      change: 12.3
    },
    {
      category: "دارایی‌های ثابت",
      amount: 405000000,
      percentage: 21.6,
      change: -2.1
    }
  ],
  liabilities: [
    {
      category: "بدهی‌های جاری",
      amount: 420000000,
      percentage: 58.3,
      change: 5.2
    },
    {
      category: "بدهی‌های بلندمدت",
      amount: 300000000,
      percentage: 41.7,
      change: -3.8
    }
  ],
  equity: [
    {
      category: "سرمایه اولیه",
      amount: 800000000,
      percentage: 52.3,
      change: 0
    },
    {
      category: "سود انباشته",
      amount: 730000000,
      percentage: 47.7,
      change: 15.2
    }
  ],
  totalAssets: 1880000000,
  totalLiabilities: 720000000,
  totalEquity: 1530000000
};
