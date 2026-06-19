"use client"

import { createContext, useContext, useState, ReactNode, useEffect, useCallback } from "react";

export interface ExhibitionVisit {
  id: string;
  fullName: string;
  phoneNumber: string;
  company: string;
  city: string;
  province: string;
  interestedProducts: string;
  notes: string;
  recordedConversation?: string;
  visitDate: Date;
  followUpStatus: "pending" | "contacted" | "converted" | "not_interested";
  priority: "low" | "medium" | "high";
}

interface ExhibitionVisitsContextType {
  visits: ExhibitionVisit[];
  addVisit: (visit: Omit<ExhibitionVisit, "id">) => void;
  updateVisit: (id: string, visit: Partial<ExhibitionVisit>) => void;
  deleteVisit: (id: string) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  filterStatus: string;
  setFilterStatus: (status: string) => void;
  filterPriority: string;
  setFilterPriority: (priority: string) => void;
  loading: boolean;
}

const ExhibitionVisitsContext = createContext<ExhibitionVisitsContextType | undefined>(undefined);

export function ExhibitionVisitsProvider({ children }: { children: ReactNode }) {
  const [visits, setVisits] = useState<ExhibitionVisit[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterPriority, setFilterPriority] = useState("all");

  const loadVisits = useCallback(async () => {
    try {
      const res = await fetch("/api/exhibition-visits");
      const data = await res.json();
      if (data.body) {
        setVisits(data.body.map((v: any) => ({ ...v, visitDate: new Date(v.visitDate) })));
      }
    } catch (error) {
      console.error("Failed to load visits:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadVisits();
  }, [loadVisits]);

  const addVisit = useCallback(async (visit: Omit<ExhibitionVisit, "id">) => {
    try {
      const res = await fetch("/api/exhibition-visits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(visit),
      });
      const data = await res.json();
      if (data.body) {
        setVisits((prev) => [{ ...data.body, visitDate: new Date(data.body.visitDate) }, ...prev]);
      }
    } catch (error) {
      console.error("Failed to add visit:", error);
    }
  }, []);

  const updateVisit = useCallback(async (id: string, updatedData: Partial<ExhibitionVisit>) => {
    try {
      const res = await fetch(`/api/exhibition-visits/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData),
      });
      const data = await res.json();
      if (data.body) {
        setVisits((prev) =>
          prev.map((visit) =>
            visit.id === id ? { ...visit, ...data.body, visitDate: new Date(data.body.visitDate) } : visit
          )
        );
      }
    } catch (error) {
      console.error("Failed to update visit:", error);
    }
  }, []);

  const deleteVisit = useCallback(async (id: string) => {
    try {
      await fetch(`/api/exhibition-visits/${id}`, { method: "DELETE" });
      setVisits((prev) => prev.filter((visit) => visit.id !== id));
    } catch (error) {
      console.error("Failed to delete visit:", error);
    }
  }, []);

  return (
    <ExhibitionVisitsContext.Provider
      value={{
        visits,
        addVisit,
        updateVisit,
        deleteVisit,
        searchTerm,
        setSearchTerm,
        filterStatus,
        setFilterStatus,
        filterPriority,
        setFilterPriority,
        loading,
      }}
    >
      {children}
    </ExhibitionVisitsContext.Provider>
  );
}

export function useExhibitionVisits() {
  const context = useContext(ExhibitionVisitsContext);
  if (!context) {
    throw new Error("useExhibitionVisits must be used within ExhibitionVisitsProvider");
  }
  return context;
}
