"use client";

import React, { useState } from "react";
import { useTranslation } from "@/lib/i18n/translation-provider";
import { PaymentMethodForm } from "@/components/payment/payment-method-form";
import { Button } from "@/components/ui/button";
import { DashboardLayout } from "../../_components/dashboard-layout";

export default function BillingPage() {
  const { t } = useTranslation();
  const workspaceId = "default"; // Replace with actual workspace ID logic
  const [activeTab, setActiveTab] = useState("payment-methods");

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto py-8 px-4">
        <h1 className="text-2xl font-bold mb-6">{t("billing", "settings")}</h1>
        <div className="mb-6">
          <div className="border-b border-gray-700">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveTab("payment-methods")}
                className={`mr-8 py-4 px-1 border-b-2 font-medium text-sm cursor-pointer ${
                  activeTab === "payment-methods"
                    ? "border-indigo-500 text-indigo-400"
                    : "border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300"
                }`}
              >
                {t("billing_paymentMethods", "settings")}
              </button>
              <button
                onClick={() => setActiveTab("subscription")}
                className={`mr-8 py-4 px-1 border-b-2 font-medium text-sm cursor-pointer ${
                  activeTab === "subscription"
                    ? "border-indigo-500 text-indigo-400"
                    : "border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300"
                }`}
              >
                {t("billing_subscription", "settings")}
              </button>
              <button
                onClick={() => setActiveTab("billing-history")}
                className={`py-4 px-1 border-b-2 font-medium text-sm cursor-pointer ${
                  activeTab === "billing-history"
                    ? "border-indigo-500 text-indigo-400"
                    : "border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300"
                }`}
              >
                {t("billing_history", "settings")}
              </button>
            </nav>
          </div>
        </div>

        {activeTab === "payment-methods" && (
          <div>
            <div className="bg-gray-800 rounded-lg p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4">
                {t("billing_paymentMethodsTitle", "settings")}
              </h2>
              <p className="text-gray-300 mb-6">
                {t("billing_paymentMethodsDescription", "settings")}
              </p>
              <PaymentMethodForm workspaceId={workspaceId} />
            </div>
            <div className="text-sm text-gray-400 mt-4">
              <p>{t("billing_securityNote", "settings")}</p>
            </div>
          </div>
        )}

        {activeTab === "subscription" && (
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">
              {t("billing_subscriptionTitle", "settings")}
            </h2>
            <div className="mb-6">
              <div className="bg-gray-700 p-4 rounded-md mb-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-medium">{t("billing_currentPlan", "settings")}</h3>
                    <p className="text-indigo-400 text-lg font-semibold">Free Plan</p>
                  </div>
                  <Button className="bg-indigo-600 hover:bg-indigo-700">
                    {t("billing_upgradePlan", "settings")}
                  </Button>
                </div>
              </div>
              <p className="text-gray-300">{t("billing_planFeatures", "settings")}</p>
            </div>
          </div>
        )}

        {activeTab === "billing-history" && (
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">
              {t("billing_billingHistoryTitle", "settings")}
            </h2>
            <div className="text-gray-300 text-center py-8">
              <p>{t("billing_noTransactions", "settings")}</p>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
