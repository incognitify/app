"use client";

import React from "react";
import Link from "next/link";
import { useTranslation } from "@/lib/i18n/translation-provider";
import { Button } from "@/components/ui/button";
import { DashboardLayout } from "../_components/dashboard-layout";

export default function SettingsPage() {
  const { t } = useTranslation();

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto py-8 px-4">
        <h1 className="text-2xl font-bold mb-6">{t("title", "settings")}</h1>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Settings Navigation Sidebar */}
          <div className="md:col-span-1">
            <div className="bg-gray-800 rounded-lg p-4">
              <nav className="space-y-2">
                <Link
                  href="/dashboard/settings"
                  className="block px-3 py-2 rounded-md text-gray-300 hover:bg-gray-700 hover:text-white"
                >
                  {t("account", "settings")}
                </Link>
                <Link
                  href="/dashboard/settings/billing"
                  className="block px-3 py-2 rounded-md text-gray-300 hover:bg-gray-700 hover:text-white"
                >
                  {t("billing", "settings")}
                </Link>
                <Link
                  href="/dashboard/settings/security"
                  className="block px-3 py-2 rounded-md text-gray-300 hover:bg-gray-700 hover:text-white"
                >
                  {t("security", "settings")}
                </Link>
                <Link
                  href="/dashboard/settings/notifications"
                  className="block px-3 py-2 rounded-md text-gray-300 hover:bg-gray-700 hover:text-white"
                >
                  {t("notifications", "settings")}
                </Link>
              </nav>
            </div>
          </div>
          {/* Settings Content */}
          <div className="md:col-span-3">
            <div className="bg-gray-800 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">{t("accountSettings", "settings")}</h2>
              {/* Profile Settings */}
              <div className="mb-8">
                <h3 className="text-lg font-medium mb-4">{t("profile", "settings")}</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      {t("name", "settings")}
                    </label>
                    <input
                      type="text"
                      className="w-full bg-gray-700 text-white rounded-lg p-2"
                      placeholder={t("namePlaceholder", "settings")}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      {t("email", "settings")}
                    </label>
                    <input
                      type="email"
                      className="w-full bg-gray-700 text-white rounded-lg p-2"
                      placeholder={t("emailPlaceholder", "settings")}
                      disabled
                    />
                    <p className="text-sm text-gray-400 mt-1">
                      {t("emailChangeNote", "settings")}
                    </p>
                  </div>
                  <Button className="bg-indigo-600 hover:bg-indigo-700">
                    {t("saveChanges", "settings")}
                  </Button>
                </div>
              </div>
              {/* Password Settings */}
              <div>
                <h3 className="text-lg font-medium mb-4">{t("changePassword", "settings")}</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      {t("currentPassword", "settings")}
                    </label>
                    <input
                      type="password"
                      className="w-full bg-gray-700 text-white rounded-lg p-2"
                      placeholder={t("currentPasswordPlaceholder", "settings")}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      {t("newPassword", "settings")}
                    </label>
                    <input
                      type="password"
                      className="w-full bg-gray-700 text-white rounded-lg p-2"
                      placeholder={t("newPasswordPlaceholder", "settings")}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      {t("confirmPassword", "settings")}
                    </label>
                    <input
                      type="password"
                      className="w-full bg-gray-700 text-white rounded-lg p-2"
                      placeholder={t("confirmPasswordPlaceholder", "settings")}
                    />
                  </div>
                  <Button className="bg-indigo-600 hover:bg-indigo-700">
                    {t("changePasswordButton", "settings")}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
