"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useTranslation } from "@/lib/i18n/translation-provider";

export default function RequestPasswordResetPage() {
  const router = useRouter();
  const { t, language } = useTranslation();

  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState<string>("");
  const [emailError, setEmailError] = useState<string>("");

  const validateEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Reset errors
    setEmailError("");

    // Validate email
    if (!email) {
      setEmailError(t("page.error.emailMissing", "request-password-reset"));
      return;
    }

    if (!validateEmail(email)) {
      setEmailError(t("page.error.emailInvalid", "request-password-reset"));
      return;
    }

    setStatus("loading");

    try {
      // Call our API route which will forward the request to the external API
      const response = await fetch("/api/auth/request-password-reset", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          language, // Include the user's current language preference
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus("success");
        setMessage(data.message || t("page.success.message", "request-password-reset"));
      } else {
        setStatus("error");

        // Map error messages to translation keys if possible
        let errorKey = "page.error.generic";
        if (data.error === "Email is required") {
          errorKey = "page.error.emailMissing";
        } else if (data.error === "Invalid email address") {
          errorKey = "page.error.emailInvalid";
        } else if (data.error === "No account found with this email") {
          errorKey = "page.error.userNotFound";
        }

        setMessage(data.message || t(errorKey, "request-password-reset"));
      }
    } catch (error) {
      console.error("Error requesting password reset:", error);
      setStatus("error");
      setMessage(t("page.error.generic", "request-password-reset"));
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 bg-black text-white">
      <div className="w-full max-w-md space-y-8 rounded-lg border border-gray-800 bg-black p-6 shadow-md">
        <div className="text-center">
          <h1 className="text-2xl font-bold">{t("page.title", "request-password-reset")}</h1>
          <p className="mt-2 text-gray-400">{t("page.subtitle", "request-password-reset")}</p>
        </div>

        {status === "idle" && (
          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">{t("page.form.email.label", "request-password-reset")}</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t("page.form.email.placeholder", "request-password-reset")}
                className="bg-gray-900 border-gray-700"
                aria-invalid={!!emailError}
              />
              {emailError && <p className="text-sm text-red-400">{emailError}</p>}
            </div>

            <Button type="submit" className="w-full">
              {t("page.form.submit", "request-password-reset")}
            </Button>
          </form>
        )}

        {status === "loading" && (
          <div className="mt-4 space-y-4">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-primary"></div>
            <p>{t("page.loading.message", "request-password-reset")}</p>
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
            <h2 className="text-xl font-semibold text-green-400">
              {t("page.success.title", "request-password-reset")}
            </h2>
            <p className="text-gray-300">{message}</p>
            <Button onClick={() => router.push("/login")} className="mt-4 w-full cursor-pointer">
              {t("page.success.button", "request-password-reset")}
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
            <h2 className="text-xl font-semibold text-red-400">
              {t("page.error.title", "request-password-reset")}
            </h2>
            <p className="text-red-300">{message}</p>
            <Button onClick={() => setStatus("idle")} className="mt-4 w-full cursor-pointer">
              {t("page.error.button", "request-password-reset")}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
