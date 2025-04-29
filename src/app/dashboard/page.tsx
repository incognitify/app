"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { isAuthenticated, logout, isEmailVerified } from "@/lib/auth/auth-utils";
import { useTranslation } from "@/lib/i18n/translation-provider";
import { Button } from "@/components/ui/button";
import { LanguageSelector } from "@/components/language-selector";
import { AuthGuard } from "@/components/auth/auth-guard";

export default function Dashboard() {
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
    } else if (pathname === "/dashboard/settings") {
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

    // Add event listener for window resize
    window.addEventListener("resize", checkIfMobile);

    // Cleanup
    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  return (
    <AuthGuard>
      <div className="flex h-screen bg-gray-900 text-white relative">
        {/* Mobile sidebar backdrop */}
        {isMobile && !sidebarCollapsed && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-10 md:hidden"
            onClick={toggleSidebar}
          />
        )}

        {/* Sidebar */}
        <div
          className={`${
            sidebarCollapsed ? "w-16" : "w-64"
          } bg-gray-800 p-4 flex flex-col transition-all duration-300 ease-in-out ${
            isMobile ? "fixed z-20 h-full" : "relative"
          } ${isMobile && sidebarCollapsed ? "-translate-x-full" : "translate-x-0"}`}
        >
          <div className="flex items-center mb-8 justify-between">
            {!sidebarCollapsed && (
              <>
                <svg
                  className="w-8 h-8 text-indigo-500 flex-shrink-0"
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
          className={`flex-1 p-8 overflow-y-auto ${isMobile ? "w-full" : ""} ${
            isMobile && !sidebarCollapsed ? "opacity-50" : "opacity-100"
          }`}
        >
          {activeTab === "generate" && (
            <div className="max-w-4xl mx-auto">
              <h2 className={`text-3xl font-bold mb-8 ${isMobile ? "pt-8" : ""}`}>
                {t("generate.title", "dashboard")}
              </h2>

              <div className="bg-gray-800 rounded-lg p-4 mb-6">
                <textarea
                  className="w-full bg-gray-700 text-white rounded-lg p-4 min-h-[200px]"
                  placeholder={t("generate.placeholder", "dashboard")}
                />
              </div>

              <div className="flex space-x-4">
                <Button className="bg-indigo-600 hover:bg-indigo-700">
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {t("generate.buttons.fromUrl", "dashboard")}
                </Button>

                <Button className="bg-indigo-600 hover:bg-indigo-700">
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {t("generate.buttons.fromTopic", "dashboard")}
                </Button>
              </div>
            </div>
          )}

          {activeTab === "history" && (
            <div className="max-w-4xl mx-auto">
              <h2 className={`text-3xl font-bold mb-8 ${isMobile ? "pt-8" : ""}`}>
                {t("history.title", "dashboard")}
              </h2>
              <div className="bg-gray-800 rounded-lg p-6">
                <p className="text-gray-400 text-center">{t("history.noHistory", "dashboard")}</p>
              </div>
            </div>
          )}

          {activeTab === "dashboard" && (
            <div className="max-w-4xl mx-auto">
              <h2 className={`text-3xl font-bold mb-8 ${isMobile ? "pt-8" : ""}`}>
                {t("dashboard.title", "dashboard")}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-800 rounded-lg p-6">
                  <h3 className="text-xl font-semibold mb-4">
                    {t("dashboard.recentActivity.title", "dashboard")}
                  </h3>
                  <p className="text-gray-400">
                    {t("dashboard.recentActivity.noActivity", "dashboard")}
                  </p>
                </div>
                <div className="bg-gray-800 rounded-lg p-6">
                  <h3 className="text-xl font-semibold mb-4">
                    {t("dashboard.statistics.title", "dashboard")}
                  </h3>
                  <p className="text-gray-400">{t("dashboard.statistics.noStats", "dashboard")}</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === "settings" && (
            <div className="max-w-4xl mx-auto">
              <h2 className={`text-3xl font-bold mb-8 ${isMobile ? "pt-8" : ""}`}>
                {t("settings.title", "dashboard")}
              </h2>
              <div className="grid grid-cols-1 gap-8">
                {/* Password Change Section */}
                <div className="bg-gray-800 rounded-lg p-6">
                  <h3 className="text-xl font-semibold mb-4">
                    {t("settings.changePassword", "dashboard")}
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        {t("settings.currentPassword", "dashboard")}
                      </label>
                      <input
                        type="password"
                        className="w-full bg-gray-700 text-white rounded-lg p-2"
                        placeholder={t("settings.currentPasswordPlaceholder", "dashboard")}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        {t("settings.newPassword", "dashboard")}
                      </label>
                      <input
                        type="password"
                        className="w-full bg-gray-700 text-white rounded-lg p-2"
                        placeholder={t("settings.newPasswordPlaceholder", "dashboard")}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        {t("settings.confirmPassword", "dashboard")}
                      </label>
                      <input
                        type="password"
                        className="w-full bg-gray-700 text-white rounded-lg p-2"
                        placeholder={t("settings.confirmPasswordPlaceholder", "dashboard")}
                      />
                    </div>
                    <Button className="bg-indigo-600 hover:bg-indigo-700">
                      {t("settings.changePasswordButton", "dashboard")}
                    </Button>
                  </div>
                </div>
                {/* Payment Method Section */}
                <div className="bg-gray-800 rounded-lg p-6">
                  <h3 className="text-xl font-semibold mb-4">
                    {t("settings.paymentMethods", "dashboard")}
                  </h3>
                  <p className="text-gray-300 mb-4">
                    {t("settings.paymentMethodsDescription", "dashboard")}
                  </p>
                  <div className="bg-gray-700 p-4 rounded-md mb-4">
                    <label className="block text-sm font-medium mb-2">
                      {t("settings.cardDetails", "dashboard")}
                    </label>
                    <div className="h-10 flex items-center text-gray-400">•••• •••• •••• ••••</div>
                  </div>
                  <Button className="bg-indigo-600 hover:bg-indigo-700">
                    {t("settings.addCardButton", "dashboard")}
                  </Button>
                </div>
              </div>
            </div>
          )}

          {activeTab === "support" && (
            <div className="max-w-4xl mx-auto">
              <h2 className={`text-3xl font-bold mb-8 ${isMobile ? "pt-8" : ""}`}>
                {t("support.title", "dashboard")}
              </h2>
              <p className="text-gray-300 mb-8">{t("support.description", "dashboard")}</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-gray-800 rounded-lg p-6">
                  <h3 className="text-xl font-semibold mb-4">
                    {t("support.contactInfo", "dashboard")}
                  </h3>
                  <div className="space-y-3">
                    <p className="flex items-center">
                      <svg
                        className="w-5 h-5 mr-2 text-indigo-400"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                      </svg>
                      <span>{t("support.email", "dashboard")}</span>
                    </p>
                    <p className="flex items-center">
                      <svg
                        className="w-5 h-5 mr-2 text-indigo-400"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                      </svg>
                      <span>{t("support.phone", "dashboard")}</span>
                    </p>
                    <p className="flex items-center">
                      <svg
                        className="w-5 h-5 mr-2 text-indigo-400"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span>{t("support.hours", "dashboard")}</span>
                    </p>
                  </div>
                </div>

                <div className="bg-gray-800 rounded-lg p-6">
                  <h3 className="text-xl font-semibold mb-4">
                    {t("support.faq.title", "dashboard")}
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-indigo-400">
                        {t("support.faq.q1", "dashboard")}
                      </h4>
                      <p className="text-gray-300 mt-1">{t("support.faq.a1", "dashboard")}</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-indigo-400">
                        {t("support.faq.q2", "dashboard")}
                      </h4>
                      <p className="text-gray-300 mt-1">{t("support.faq.a2", "dashboard")}</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-indigo-400">
                        {t("support.faq.q3", "dashboard")}
                      </h4>
                      <p className="text-gray-300 mt-1">{t("support.faq.a3", "dashboard")}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-800 rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-4">Contact Form</h3>
                <form className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Name</label>
                    <input type="text" className="w-full bg-gray-700 text-white rounded-lg p-2" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Email</label>
                    <input type="email" className="w-full bg-gray-700 text-white rounded-lg p-2" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Message</label>
                    <textarea className="w-full bg-gray-700 text-white rounded-lg p-2 min-h-[100px]"></textarea>
                  </div>
                  <Button className="bg-indigo-600 hover:bg-indigo-700">Send Message</Button>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </AuthGuard>
  );
}
