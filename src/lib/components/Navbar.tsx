"use client"

import { Sun, Moon, Search, Maximize, Minimize, User, LogOut } from "lucide-react";
import { useState, useEffect } from "react";
import { useCurrentColors } from "../contexts/ThemeColorsContext";
import { useTheme } from "../contexts/ThemeContext";
import { useNavigation } from "../contexts/NavigationContext";
import { useAuth } from "../contexts/AuthContext";

interface UserInfo {
  name: string;
  role: string;
  position: string;
}

export function Navbar() {
  const { isDarkMode, toggleDarkMode } = useTheme();
  const colors = useCurrentColors();
  const { setActivePage } = useNavigation();
  const { logout } = useAuth();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [user, setUser] = useState<UserInfo | null>(null);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (data.code === 200 && data.body) {
          setUser(data.body);
        }
      })
      .catch(() => {});
  }, []);

  // Toggle fullscreen
  const toggleFullscreen = () => {
    if (!document.fullscreenEnabled) return;
    if (!document.fullscreenElement) {
      document.documentElement
        .requestFullscreen()
        .then(() => setIsFullscreen(true))
        .catch(() => setIsFullscreen(false));
    } else {
      document
        .exitFullscreen()
        .then(() => setIsFullscreen(false))
        .catch(() => setIsFullscreen(false));
    }
  };

  useEffect(() => {
    const onFsChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", onFsChange);
    return () => document.removeEventListener("fullscreenchange", onFsChange);
  }, []);

  return (
    <>
      <nav
        className="fixed top-0 left-0 right-0 border-b px-3 md:px-6 py-2 transition-colors duration-300 z-50"
        style={{ backgroundColor: colors.cardBackground, borderColor: colors.border }}
      >
        <div className="flex items-center justify-between">
          {/* Left area intentionally left empty (menu toggle removed) */}
          <div />

          {/* Right area - user info + controls */}
          <div className="flex items-center gap-3">
            {/* User info */}
            {user && (
              <div className="hidden md:flex items-center gap-2.5 pl-3 border-l" style={{ borderColor: colors.border }}>
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-xs text-white"
                  style={{ backgroundColor: colors.primary }}
                >
                  <User className="w-4 h-4" />
                </div>
                <div className="flex flex-col text-right leading-tight">
                  <span className="text-sm font-medium" style={{ color: colors.textPrimary }}>{user.name}</span>
                  <span className="text-xs" style={{ color: colors.textSecondary }}>{user.position || user.role}</span>
                </div>
              </div>
            )}

            <button
              onClick={logout}
              className="w-8 h-8 flex items-center justify-center rounded-full transition-all duration-300"
              style={{ backgroundColor: "transparent" }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.backgroundColor = colors.backgroundSecondary;
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent";
              }}
              title="خروج از حساب"
            >
              <LogOut className="w-4 h-4" style={{ color: colors.textSecondary }} />
            </button>

            <div className="flex items-center gap-2 md:gap-3">
              <button
                onClick={toggleFullscreen}
                className="hidden md:flex w-8 h-8 items-center justify-center rounded-full transition-all duration-300 group"
                style={{ backgroundColor: "transparent" }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.backgroundColor = colors.backgroundSecondary;
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent";
                }}
                aria-label={isFullscreen ? "خروج از حالت تمام صفحه" : "ورود به حالت تمام صفحه"}
              >
                {isFullscreen ? (
                  <Minimize className="w-4 h-4" style={{ color: colors.textPrimary }} />
                ) : (
                  <Maximize className="w-4 h-4" style={{ color: colors.textPrimary }} />
                )}
              </button>

              <button
                onClick={toggleDarkMode}
                className="w-8 h-8 flex items-center justify-center rounded-full transition-all duration-300 group"
                style={{ backgroundColor: "transparent" }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.backgroundColor = colors.backgroundSecondary;
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent";
                }}
                aria-label={isDarkMode ? "تغییر به حالت روز" : "تغییر به حالت شب"}
              >
                {isDarkMode ? (
                  <Sun className="w-4 h-4 text-[#ffd700]" />
                ) : (
                  <Moon className="w-4 h-4" style={{ color: colors.textPrimary }} />
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}
