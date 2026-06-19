"use client"

import { useState } from "react"
import { Navbar } from "./Navbar"
import { Sidebar } from "./Sidebar"
import { ApiConnectionStatus } from "./ApiConnectionStatus"
import { useNavigation } from "../contexts/NavigationContext"
import { useCurrentColors } from "../contexts/ThemeColorsContext"
import { useAuth } from "../contexts/AuthContext"
import { LoginPage } from "../pages/LoginPage"

export function AppShell({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, login } = useAuth()
  const { activePage } = useNavigation()
  const [sidebarHovered, setSidebarHovered] = useState(false)
  const colors = useCurrentColors()

  if (!isAuthenticated) {
    return <LoginPage onLoginSuccess={login} />
  }

  return (
    <div className="min-h-screen flex flex-col transition-colors duration-300 bg-[#fafafa] dark:bg-[#0f1419]">
      <ApiConnectionStatus />
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        <main
          className={`flex-1 overflow-y-auto transition-all duration-300 ${
            sidebarHovered ? "md:mr-64" : "md:mr-20"
          } ${activePage === "ai" ? "md:ml-20" : ""} ${
            activePage === "ai"
              ? "pt-[56px]"
              : "p-4 pt-[64px]"
          }`}
          dir="rtl"
          style={{ backgroundColor: colors.background }}
        >
          {children}
        </main>
        <Sidebar onHoverChange={setSidebarHovered} />
      </div>
    </div>
  )
}
