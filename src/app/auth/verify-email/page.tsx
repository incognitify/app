"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/lib/i18n/translation-provider";

export default function VerifyEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const { t } = useTranslation();

  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    const verifyEmail = async () => {
      if (!token) {
        setStatus("error");
        setMessage(t("page.error.tokenMissing", "verify-email"));
        return;
      }

      try {
        // Call our API route which will forward the request to the external API
        const response = await fetch(`/api/auth/verify-email?token=${token}`, {
          method: "GET",
        });

        const data = await response.json();

        if (response.ok) {
          setStatus("success");
          setMessage(data.message || t("page.success.message", "verify-email"));
        } else {
          setStatus("error");

          // Map error messages to translation keys if possible
          let errorKey = "page.error.generic";
          if (data.error === "Invalid verification token") {
            errorKey = "page.error.invalid";
          } else if (data.error === "Verification token has expired") {
            errorKey = "page.error.expired";
          } else if (data.error === "Email is already verified") {
            errorKey = "page.error.alreadyVerified";
          }

          setMessage(data.message || t(errorKey, "verify-email"));
        }
      } catch (error) {
        console.error("Error verifying email:", error);
        setStatus("error");
        setMessage(t("page.error.generic", "verify-email"));
      }
    };

    verifyEmail();
  }, [token, t]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 bg-black text-white">
      <div className="w-full max-w-md space-y-8 rounded-lg border border-gray-800 bg-black p-6 shadow-md">
        <div className="text-center">
          <h1 className="text-2xl font-bold">{t("page.title", "verify-email")}</h1>

          {status === "loading" && (
            <div className="mt-4 space-y-4">
              <div className="mx-auto h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-primary"></div>
              <p>{t("page.loading.message", "verify-email")}</p>
            </div>
          )}

          {status === "success" && (
            <div className="mt-4 space-y-4">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-900">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-green-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <p className="text-green-400">{message}</p>
              <Button onClick={() => router.push("/login")} className="mt-4 w-full cursor-pointer">
                {t("page.success.button", "verify-email")}
              </Button>
            </div>
          )}

          {status === "error" && (
            <div className="mt-4 space-y-4">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-900">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-red-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </div>
              <p className="text-red-400">{message}</p>
              <Button onClick={() => router.push("/")} className="mt-4 w-full cursor-pointer">
                {t("page.error.button", "verify-email")}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
