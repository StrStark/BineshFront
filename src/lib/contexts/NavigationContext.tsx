"use client"

import { createContext, useContext, useState, useCallback, ReactNode, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

export type PageType =
  | "dashboard"
  | "sales"
  | "products"
  | "customers"
  | "warehouse"
  | "financial"
  | "ai"
  | "exhibition"
  | "settings"
  | "login";

const pathToPage: Record<string, PageType> = {
  '/dashboard': 'dashboard',
  '/sales': 'sales',
  '/products': 'products',
  '/customers': 'customers',
  '/warehouse': 'warehouse',
  '/financial': 'financial',
  '/ai': 'ai',
  '/exhibition': 'exhibition',
  '/settings': 'settings',
  '/login': 'login',
};

const pageToPath: Record<string, string> = {
  dashboard: '/dashboard',
  sales: '/sales',
  products: '/products',
  customers: '/customers',
  warehouse: '/warehouse',
  financial: '/financial',
  ai: '/ai',
  exhibition: '/exhibition',
  settings: '/settings',
  login: '/login',
};

interface NavigationContextType {
  activePage: PageType;
  setActivePage: (page: PageType) => void;
  push: (path: string) => void;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export function NavigationProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [activePage, setActivePageState] = useState<PageType>(
    () => pathToPage[pathname] || "dashboard"
  );

  useEffect(() => {
    const page = pathToPage[pathname] || "dashboard";
    if (page !== activePage) {
      setActivePageState(page);
    }
  }, [pathname, activePage]);

  const setActivePage = useCallback((page: PageType) => {
    const path = pageToPath[page];
    if (path) {
      router.push(path);
    }
  }, [router]);

  const push = useCallback((path: string) => {
    const page = pathToPage[path];
    if (page) {
      setActivePage(page);
    } else {
      router.push(path);
    }
  }, [router, setActivePage]);

  return (
    <NavigationContext.Provider value={{ activePage, setActivePage, push }}>
      {children}
    </NavigationContext.Provider>
  );
}

export function useNavigation() {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error("useNavigation must be used within NavigationProvider");
  }
  return context;
}
