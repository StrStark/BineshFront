import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { DashboardPage } from "./pages/DashboardPage";
import { SalesPage } from "./pages/SalesPage";
import { ProductsPage } from "./pages/ProductsPage";
import { CustomersPage } from "./pages/CustomersPage";
import { WarehousePage } from "./pages/WarehousePage";
import { FinancialPage } from "./pages/FinancialPage";
import { AIPage } from "./pages/AIPage";
import { TestPage } from "./pages/TestPage";
import { SettingsPage } from "./pages/SettingsPage";
import { TutorialsPage } from "./pages/TutorialsPage";
import { SupportPage } from "./pages/SupportPage";
import { NotificationsPage } from "./pages/NotificationsPage";
import { LoginPage } from "./pages/LoginPage";
import ExhibitionVisits from "./pages/ExhibitionVisits";
import { Provider } from "react-redux";
import { store } from "./store";
import { ThemeProvider } from "./contexts/ThemeContext";
import { ThemeColorsProvider } from "./contexts/ThemeColorsContext";
import { SettingsProvider } from "./contexts/SettingsContext";
import { SidebarProvider, useSidebar } from "./contexts/SidebarContext";
import {
  NavigationProvider,
  useNavigation,
} from "./contexts/NavigationContext";
import { SettingsTabProvider } from "./contexts/SettingsTabContext";
import { CustomersProvider } from "./contexts/CustomersContext";
import { ReportDataProvider } from "./contexts/ReportDataContext";
import { ExhibitionVisitsProvider } from "./contexts/ExhibitionVisitsContext";
import { useCurrentColors } from "./contexts/ThemeColorsContext";
import { Navbar } from "./components/Navbar";
import { Sidebar } from "./components/Sidebar";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { GlobalErrorHandler } from "./components/GlobalErrorHandler";
import { ApiConnectionStatus } from "./components/ApiConnectionStatus";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import "./utils/apiDebugger";

function MainContent() {
  const { activePage } = useNavigation();
  const { isOpen, closeSidebar } = useSidebar();
  const colors = useCurrentColors();

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 dark:bg-black/40 z-30 transition-opacity duration-300"
          onClick={closeSidebar}
        />
      )}

      <main
        className={`flex-1 overflow-y-auto transition-all duration-300 ${
          isOpen ? "md:mr-64 mr-0" : "mr-0"
        } ${
          activePage === "ai" || activePage === "testpage"
            ? "pt-[64px]"
            : "p-6 pt-[88px]"
        }`}
        dir="rtl"
        style={{ backgroundColor: colors.background }}
      >
        {activePage === "dashboard" && <DashboardPage />}
        {activePage === "sales" && <SalesPage />}
        {activePage === "products" && <ProductsPage />}
        {activePage === "customers" && <CustomersPage />}
        {activePage === "warehouse" && <WarehousePage />}
        {activePage === "financial" && <FinancialPage />}
        {activePage === "ai" && <AIPage />}
        {activePage === "exhibition" && <ExhibitionVisits />}
        {activePage === "testpage" && <TestPage />}
        {activePage === "settings" && <SettingsPage />}
        {activePage === "tutorials" && <TutorialsPage />}
        {activePage === "support" && <SupportPage />}
        {activePage === "notifications" && <NotificationsPage />}
      </main>
    </>
  );
}

function AppContent() {
  return (
    <div className="min-h-screen flex flex-col transition-colors duration-300 bg-[#fafafa] dark:bg-[#0f1419]">
      <ApiConnectionStatus />
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        <MainContent />
        <Sidebar />
      </div>
    </div>
  );
}

function AppRouter() {
  const { isAuthenticated, login } = useAuth();

  if (!isAuthenticated) {
    return <LoginPage onLoginSuccess={login} />;
  }

  return <AppContent />;
}

export default function App() {
  return (
    <ErrorBoundary>
      <GlobalErrorHandler />
      <Provider store={store}>
        <ThemeProvider>
          <AuthProvider>
            <ThemeColorsProvider>
              <SettingsProvider>
                <CustomersProvider>
                  <ReportDataProvider>
                    <ExhibitionVisitsProvider>
                      <SidebarProvider>
                        <NavigationProvider>
                          <SettingsTabProvider>
                            <DndProvider backend={HTML5Backend}>
                              <AppRouter />
                            </DndProvider>
                          </SettingsTabProvider>
                        </NavigationProvider>
                      </SidebarProvider>
                    </ExhibitionVisitsProvider>
                  </ReportDataProvider>
                </CustomersProvider>
              </SettingsProvider>
            </ThemeColorsProvider>
          </AuthProvider>
        </ThemeProvider>
      </Provider>
    </ErrorBoundary>
  );
}
