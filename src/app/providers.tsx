"use client"

import { Provider } from "react-redux"
import { store } from "@/lib/store"
import { ThemeProvider } from "@/lib/contexts/ThemeContext"
import { AuthProvider } from "@/lib/contexts/AuthContext"
import { ThemeColorsProvider } from "@/lib/contexts/ThemeColorsContext"
import { SettingsProvider } from "@/lib/contexts/SettingsContext"
import { CustomersProvider } from "@/lib/contexts/CustomersContext"
import { ReportDataProvider } from "@/lib/contexts/ReportDataContext"
import { SidebarProvider } from "@/lib/contexts/SidebarContext"
import { NavigationProvider } from "@/lib/contexts/NavigationContext"
import { SettingsTabProvider } from "@/lib/contexts/SettingsTabContext"
import { DndProvider } from "react-dnd"
import { HTML5Backend } from "react-dnd-html5-backend"
import { ErrorBoundary } from "@/lib/components/ErrorBoundary"
import { GlobalErrorHandler } from "@/lib/components/GlobalErrorHandler"
import { Toaster } from "@/lib/components/ui/sonner"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary>
      <GlobalErrorHandler />
      <Provider store={store}>
        <ThemeProvider>
          <Toaster />
          <AuthProvider>
            <ThemeColorsProvider>
              <SettingsProvider>
                <CustomersProvider>
                  <ReportDataProvider>
                    <SidebarProvider>
                        <NavigationProvider>
                          <SettingsTabProvider>
                            <DndProvider backend={HTML5Backend}>
                              {children}
                            </DndProvider>
                          </SettingsTabProvider>
                        </NavigationProvider>
                      </SidebarProvider>
                  </ReportDataProvider>
                </CustomersProvider>
              </SettingsProvider>
            </ThemeColorsProvider>
          </AuthProvider>
        </ThemeProvider>
      </Provider>
    </ErrorBoundary>
  )
}
