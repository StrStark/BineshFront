"use client"

import { createContext, useContext, useState, ReactNode } from "react";

export type SettingsTab = "profile" | "company" | "users" | "accounting" | "data_management" | "security" | "appearance" | "support";

interface SettingsTabContextType {
  activeTab: SettingsTab;
  setActiveTab: (tab: SettingsTab) => void;
}

const SettingsTabContext = createContext<SettingsTabContextType | undefined>(undefined);

export function SettingsTabProvider({ children }: { children: ReactNode }) {
  const [activeTab, setActiveTab] = useState<SettingsTab>("profile");

  return (
    <SettingsTabContext.Provider value={{ activeTab, setActiveTab }}>
      {children}
    </SettingsTabContext.Provider>
  );
}

export function useSettingsTab() {
  const context = useContext(SettingsTabContext);
  if (!context) {
    throw new Error("useSettingsTab must be used within SettingsTabProvider");
  }
  return context;
}