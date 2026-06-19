"use client"

import { useCurrentColors } from "../../contexts/ThemeColorsContext";
import { UserCheck, Circle } from "lucide-react";

const agents = [
  { id: 1, name: "رضا احمدی", status: "active", calls: 23 },
  { id: 2, name: "سارا محمدی", status: "active", calls: 19 },
  { id: 3, name: "علی رضایی", status: "busy", calls: 15 },
  { id: 4, name: "مریم کریمی", status: "active", calls: 21 },
  { id: 5, name: "حسین نوری", status: "active", calls: 17 },
];

export function ActiveAgentsWidget() {
  const colors = useCurrentColors();

  return (
    <div className="h-full flex flex-col">
      {/* Header Stats */}
      <div className="mb-4 flex items-center gap-3">
        <div 
          className="w-12 h-12 rounded-full flex items-center justify-center"
          style={{ backgroundColor: `${colors.success}11` }}
        >
          <UserCheck className="w-6 h-6" style={{ color: colors.success }} />
        </div>
        <div>
          <p className="text-2xl font-bold" style={{ color: colors.textPrimary }}>12</p>
          <p className="text-xs" style={{ color: colors.textSecondary }}>کارشناس آنلاین</p>
        </div>
      </div>

      {/* Agents List */}
      <div className="flex-1 overflow-y-auto space-y-2">
        {agents.map((agent) => (
          <div
            key={agent.id}
            className="flex items-center justify-between p-2 rounded-lg transition-colors"
            style={{ backgroundColor: colors.backgroundSecondary }}
          >
            <div className="flex items-center gap-2">
              <Circle
                className="w-2 h-2"
                fill={agent.status === "active" ? colors.success : colors.warning}
                stroke="none"
              />
              <span className="text-xs" style={{ color: colors.textPrimary }}>
                {agent.name}
              </span>
            </div>
            <span 
              className="text-xs px-2 py-0.5 rounded"
              style={{ 
                backgroundColor: `${colors.primary}11`,
                color: colors.primary 
              }}
            >
              {agent.calls} تماس
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
