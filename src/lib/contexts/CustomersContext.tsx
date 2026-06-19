"use client"

import { createContext, useContext, useState, ReactNode, useEffect } from "react";

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string;
  totalCalls: number;
  lastCall: string;
  satisfaction: number;
  province?: string;
  city?: string;
  neighborhood?: string;
  status?: string;
  lastContact?: string;
  satisfactionScore?: number;
}

// تولید داده‌های تصادفی برای مشتریان
const generateCustomers = (): Customer[] => {
  const firstNames = ["علی", "سارا", "محمد", "فاطمه", "حسین", "زهرا", "رضا", "مریم", "احمد", "نرگس", "مهدی", "الهام", "امیر", "نازنین", "حامد", "سمیرا", "کامران", "لیلا", "بهزاد", "شیرین", "مسعود", "پریسا", "جواد", "مینا", "فرهاد", "سمانه", "سعید", "نیلوفر", "داود", "مهسا"];
  const lastNames = ["محمدی", "احمدی", "رضایی", "کریمی", "قاسمی", "حسینی", "نوری", "موسوی", "صادقی", "اکبری", "جعفری", "میرزایی", "علیپور", "خانی", "زارعی", "ملکی", "باقری", "یوسفی", "فتحی", "عباسی", "طاهری", "رحیمی", "کاظمی", "حیدری", "اسدی", "فروغی", "نصیری", "شریفی", "امینی", "رستمی"];
  
  const emailFirstNames = ["ali", "sara", "mohammad", "fatemeh", "hossein", "zahra", "reza", "maryam", "ahmad", "narges", "mahdi", "elham", "amir", "nazanin", "hamed", "samira", "kamran", "leila", "behzad", "shirin", "masoud", "parisa", "javad", "mina", "farhad", "samaneh", "saeed", "niloofar", "davood", "mahsa"];
  const emailLastNames = ["mohammadi", "ahmadi", "rezaei", "karimi", "ghasemi", "hosseini", "noori", "mousavi", "sadeghi", "akbari", "jafari", "mirzaei", "alipour", "khani", "zarei", "maleki", "bagheri", "yousefi", "fathi", "abbasi", "taheri", "rahimi", "kazemi", "heidari", "asadi", "foroughi", "nasiri", "sharifi", "amini", "rostami"];
  
  const provinces = ["تهران", "اصفهان", "خراسان رضوی", "فارس", "خوزستان", "آذربایجان شرقی", "مازندران", "گیلان"];
  const citiesByProvince: Record<string, string[]> = {
    "تهران": ["تهران", "کرج", "ورامین", "شهریار", "اسلامشهر"],
    "اصفهان": ["اصفهان", "کاشان", "نجف‌آباد", "خمینی‌شهر", "شاهین‌شهر"],
    "خراسان رضوی": ["مشهد", "نیشابور", "سبزوار", "کاشمر", "تربت حیدریه"],
    "فارس": ["شیراز", "مرودشت", "جهرم", "فسا", "کازرون"],
    "خوزستان": ["اهواز", "آبادان", "دزفول", "خرمشهر", "بهبهان"],
    "آذربایجان شرقی": ["تبریز", "مراغه", "مرند", "میانه", "بناب"],
    "مازندران": ["ساری", "بابل", "آمل", "قائم‌شهر", "نوشهر"],
    "گیلان": ["رشت", "بندر انزلی", "لاهیجان", "لنگرود", "آستارا"],
  };
  const neighborhoods = ["میدان آزادی", "خیابان ولیعصر", "میدان انقلاب", "خیابان آزادی", "میدان فردوسی", "خیابان شریعتی", "پارک ملت", "خیابان سعادت‌آباد", "میدان ونک", "خیابان نواب", "خیابان انقلاب", "میدان تجریش"];
  
  const customers: Customer[] = [];
  
  for (let i = 1; i <= 120; i++) {
    const firstNameIndex = Math.floor(Math.random() * firstNames.length);
    const lastNameIndex = Math.floor(Math.random() * lastNames.length);
    const firstName = firstNames[firstNameIndex];
    const lastName = lastNames[lastNameIndex];
    const emailFirstName = emailFirstNames[firstNameIndex];
    const emailLastName = emailLastNames[lastNameIndex];
    const totalCalls = Math.floor(Math.random() * 100) + 1;
    const day = String(Math.floor(Math.random() * 28) + 1).padStart(2, '0');
    const month = String(Math.floor(Math.random() * 3) + 8).padStart(2, '0');
    const satisfaction = (Math.random() * 2 + 3).toFixed(1);
    const phonePrefix = ["0912", "0913", "0914", "0915", "0916", "0917", "0918", "0919", "0921", "0922"][Math.floor(Math.random() * 10)];
    const phoneNumber = phonePrefix + String(Math.floor(Math.random() * 10000000)).padStart(7, '0');
    
    const province = provinces[Math.floor(Math.random() * provinces.length)];
    const cities = citiesByProvince[province];
    const city = cities[Math.floor(Math.random() * cities.length)];
    const neighborhood = neighborhoods[Math.floor(Math.random() * neighborhoods.length)];
    
    customers.push({
      id: String(i),
      name: `${firstName} ${lastName}`,
      phone: phoneNumber,
      email: `${emailFirstName}.${emailLastName}${i}@example.com`,
      totalCalls: totalCalls,
      lastCall: `1403/${month}/${day}`,
      satisfaction: parseFloat(satisfaction),
      province: province,
      city: city,
      neighborhood: neighborhood,
    });
  }
  
  return customers;
};

interface CustomersContextType {
  customers: Customer[];
  addCustomer: (customer: Omit<Customer, "id">) => Customer;
  updateCustomer: (id: string, customer: Partial<Customer>) => void;
  deleteCustomer: (id: string) => void;
  searchCustomers: (query: string) => Customer[];
  getCustomerByPhone: (phone: string) => Customer | undefined;
}

const CustomersContext = createContext<CustomersContextType | undefined>(undefined);

export function CustomersProvider({ children }: { children: ReactNode }) {
  const [customers, setCustomers] = useState<Customer[]>([]);

  // بارگذاری از localStorage بعد از mount
  useEffect(() => {
    const saved = localStorage.getItem("customers");
    if (saved) {
      try {
        setCustomers(JSON.parse(saved));
      } catch {
        setCustomers(generateCustomers());
      }
    } else {
      setCustomers(generateCustomers());
    }
  }, []);

  // ذخیره در localStorage
  useEffect(() => {
    if (customers.length > 0) {
      localStorage.setItem("customers", JSON.stringify(customers));
    }
  }, [customers]);

  const addCustomer = (customer: Omit<Customer, "id">): Customer => {
    const newCustomer: Customer = {
      ...customer,
      id: Date.now().toString(),
    };
    setCustomers((prev) => [...prev, newCustomer]);
    return newCustomer;
  };

  const updateCustomer = (id: string, updates: Partial<Customer>) => {
    setCustomers((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updates } : c))
    );
  };

  const deleteCustomer = (id: string) => {
    setCustomers((prev) => prev.filter((c) => c.id !== id));
  };

  const searchCustomers = (query: string): Customer[] => {
    if (!query.trim()) return [];
    
    const lowerQuery = query.toLowerCase().trim();
    return customers.filter(
      (c) =>
        c.name.toLowerCase().includes(lowerQuery) ||
        c.phone.includes(lowerQuery)
    );
  };

  const getCustomerByPhone = (phone: string): Customer | undefined => {
    return customers.find((c) => c.phone === phone);
  };

  return (
    <CustomersContext.Provider
      value={{
        customers,
        addCustomer,
        updateCustomer,
        deleteCustomer,
        searchCustomers,
        getCustomerByPhone,
      }}
    >
      {children}
    </CustomersContext.Provider>
  );
}

export function useCustomers() {
  const context = useContext(CustomersContext);
  if (!context) {
    throw new Error("useCustomers must be used within CustomersProvider");
  }
  return context;
}
