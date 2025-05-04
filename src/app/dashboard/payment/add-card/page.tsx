"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslation } from "@/lib/i18n/translation-provider";
import { PaymentMethodForm } from "@/components/payment/payment-method-form";
import { Button } from "@/components/ui/button";
import { AuthGuard } from "@/components/auth/auth-guard";

export default function AddCardPage() {
  const router = useRouter();
  const { t } = useTranslation();
  const workspaceId = "default"; // Replace with actual workspace ID logic

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto py-12 px-4">
          <div className="flex items-center mb-8">
            <Button
              variant="ghost"
              className="mr-4 text-gray-400 hover:text-white"
              onClick={() => router.back()}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
            </Button>
            <h1 className="text-2xl font-bold">{t("billing_addCardTitle", "settings")}</h1>
          </div>

          <div className="bg-gray-800 rounded-lg p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">
              {t("billing_addCardDescription", "settings")}
            </h2>
            <p className="text-gray-300 mb-6">{t("billing_cardSecurityNote", "settings")}</p>
            <PaymentMethodForm workspaceId={workspaceId} />
            <div className="mt-6 text-sm text-gray-400">
              <p>{t("billing_cardStorageDisclaimer", "settings")}</p>
            </div>
          </div>

          <div className="text-center">
            <Link href="/dashboard" className="text-indigo-400 hover:text-indigo-300">
              {t("common.backToDashboard", "payment")}
            </Link>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}
