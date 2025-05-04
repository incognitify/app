"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { isAuthenticated, logout, isEmailVerified } from "@/lib/auth/auth-utils";
import { useTranslation } from "@/lib/i18n/translation-provider";
import { Button } from "@/components/ui/button";
import { LanguageSelector } from "@/components/language-selector";
import { AuthGuard } from "@/components/auth/auth-guard";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState("generate");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check if user is authenticated on client side
  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/login");
    } else if (!isEmailVerified()) {
      router.push("/verify-email");
    }
  }, [router]);

  // Set active tab based on pathname
  useEffect(() => {
    if (pathname === "/dashboard") {
      setActiveTab("dashboard");
    } else if (pathname === "/support") {
      setActiveTab("support");
    } else if (pathname === "/history") {
      setActiveTab("history");
    } else if (pathname === "/generate") {
      setActiveTab("generate");
    } else if (pathname.includes("/dashboard/settings")) {
      setActiveTab("settings");
    }
  }, [pathname]);

  // Check if mobile and set sidebar collapsed by default on mobile
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
      setSidebarCollapsed(window.innerWidth < 768);
    };

    // Initial check
    checkIfMobile();

    // Add event listener
    window.addEventListener("resize", checkIfMobile);

    // Cleanup
    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <AuthGuard>
      <div className="flex h-screen bg-gray-900 text-white">
        {/* Sidebar */}
        <div
          className={`bg-gray-800 ${
            sidebarCollapsed ? "w-16" : "w-64"
          } flex flex-col fixed h-full z-20 transition-all duration-300 ease-in-out ${
            isMobile && !sidebarCollapsed ? "translate-x-0" : ""
          } ${isMobile && sidebarCollapsed ? "-translate-x-full" : ""}`}
        >
          <div className="p-4 flex items-center">
            {!sidebarCollapsed && (
              <>
                <svg
                  className="w-8 h-8 text-indigo-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 2a8 8 0 100 16 8 8 0 000-16zm0 14a6 6 0 100-12 6 6 0 000 12z"
                    clipRule="evenodd"
                  />
                </svg>
                <h1 className="text-xl font-bold ml-2 flex-grow">
                  {t("sidebar.title", "dashboard")}
                </h1>
              </>
            )}
            {sidebarCollapsed && (
              <svg
                className="w-8 h-8 text-indigo-500 mx-auto"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M10 2a8 8 0 100 16 8 8 0 000-16zm0 14a6 6 0 100-12 6 6 0 000 12z"
                  clipRule="evenodd"
                />
              </svg>
            )}

            {/* Toggle button for desktop */}
            {!isMobile && (
              <button
                onClick={toggleSidebar}
                className="p-1 rounded-md hover:bg-gray-700 focus:outline-none"
                aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
              >
                <svg
                  className="w-5 h-5 text-gray-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {sidebarCollapsed ? (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 5l7 7-7 7M5 5l7 7-7 7"
                    />
                  ) : (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
                    />
                  )}
                </svg>
              </button>
            )}
          </div>

          <nav className="flex-1 space-y-2">
            <Link
              href="/dashboard"
              className={`flex items-center p-2 rounded-lg ${
                activeTab === "dashboard" ? "bg-indigo-600" : "hover:bg-gray-700"
              } ${sidebarCollapsed ? "justify-center" : ""}`}
              onClick={() => setActiveTab("dashboard")}
            >
              <svg
                className={`w-5 h-5 ${sidebarCollapsed ? "" : "mr-3"}`}
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
              </svg>
              {!sidebarCollapsed && t("sidebar.nav.dashboard", "dashboard")}
            </Link>

            <Link
              href="/generate"
              className={`flex items-center p-2 rounded-lg ${
                activeTab === "generate" ? "bg-indigo-600" : "hover:bg-gray-700"
              } ${sidebarCollapsed ? "justify-center" : ""}`}
              onClick={() => setActiveTab("generate")}
            >
              <svg
                className={`w-5 h-5 ${sidebarCollapsed ? "" : "mr-3"}`}
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
                <path
                  fillRule="evenodd"
                  d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z"
                  clipRule="evenodd"
                />
              </svg>
              {!sidebarCollapsed && t("sidebar.nav.generate", "dashboard")}
            </Link>

            <Link
              href="/history"
              className={`flex items-center p-2 rounded-lg ${
                activeTab === "history" ? "bg-indigo-600" : "hover:bg-gray-700"
              } ${sidebarCollapsed ? "justify-center" : ""}`}
              onClick={() => setActiveTab("history")}
            >
              <svg
                className={`w-5 h-5 ${sidebarCollapsed ? "" : "mr-3"}`}
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                  clipRule="evenodd"
                />
              </svg>
              {!sidebarCollapsed && t("sidebar.nav.history", "dashboard")}
            </Link>

            <Link
              href="/support"
              className={`flex items-center p-2 rounded-lg ${
                activeTab === "support" ? "bg-indigo-600" : "hover:bg-gray-700"
              } ${sidebarCollapsed ? "justify-center" : ""}`}
              onClick={() => setActiveTab("support")}
            >
              <svg
                className={`w-5 h-5 ${sidebarCollapsed ? "" : "mr-3"}`}
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z"
                  clipRule="evenodd"
                />
              </svg>
              {!sidebarCollapsed && t("sidebar.nav.support", "dashboard")}
            </Link>

            <Link
              href="/dashboard/settings"
              className={`flex items-center p-2 rounded-lg ${
                activeTab === "settings" ? "bg-indigo-600" : "hover:bg-gray-700"
              } ${sidebarCollapsed ? "justify-center" : ""}`}
              onClick={() => setActiveTab("settings")}
            >
              <svg
                className={`w-5 h-5 ${sidebarCollapsed ? "" : "mr-3"}`}
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z"
                  clipRule="evenodd"
                />
              </svg>
              {!sidebarCollapsed && t("sidebar.nav.settings", "dashboard")}
            </Link>
          </nav>

          <div
            className={`pt-4 mt-6 border-t border-gray-700 ${sidebarCollapsed ? "items-center" : ""}`}
          >
            {!sidebarCollapsed ? (
              <>
                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center">
                    <span className="font-bold">U</span>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium">{t("sidebar.user.profile", "dashboard")}</p>
                    <p className="text-xs text-gray-400">user@example.com</p>
                  </div>
                </div>

                <Button
                  variant="outline"
                  className="w-full justify-start text-gray-300 hover:text-white"
                  onClick={handleLogout}
                >
                  <svg
                    className="w-5 h-5 mr-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                    />
                  </svg>
                  {t("sidebar.user.logout", "dashboard")}
                </Button>

                <div className="mt-4 flex justify-center">
                  <LanguageSelector />
                </div>
              </>
            ) : (
              <>
                <div className="flex justify-center mb-4">
                  <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center">
                    <span className="font-bold">U</span>
                  </div>
                </div>
                <Button
                  variant="outline"
                  className="w-full justify-center text-gray-300 hover:text-white p-2"
                  onClick={handleLogout}
                  title={t("sidebar.user.logout", "dashboard")}
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                    />
                  </svg>
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Mobile toggle button */}
        {isMobile && (
          <button
            onClick={toggleSidebar}
            className={`fixed top-4 ${sidebarCollapsed ? "left-4" : "left-[calc(16rem-2.5rem)]"} z-30 p-2 rounded-md bg-gray-800 text-white hover:bg-gray-700 focus:outline-none transition-all duration-300 ease-in-out`}
            aria-label={sidebarCollapsed ? "Open menu" : "Close menu"}
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              {sidebarCollapsed ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              )}
            </svg>
          </button>
        )}

        {/* Main Content */}
        <div
          className={`flex-1 ${!isMobile ? "ml-64" : ""} ${
            sidebarCollapsed && !isMobile ? "ml-16" : ""
          } transition-all duration-300 ease-in-out overflow-y-auto ${
            isMobile && !sidebarCollapsed ? "opacity-50" : "opacity-100"
          }`}
        >
          {children}
        </div>
      </div>
    </AuthGuard>
  );
}
