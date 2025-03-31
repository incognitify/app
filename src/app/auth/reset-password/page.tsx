"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useTranslation } from "@/lib/i18n/translation-provider";

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const { t, language } = useTranslation();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [passwordError, setPasswordError] = useState<string>("");
  const [confirmPasswordError, setConfirmPasswordError] = useState<string>("");

  useEffect(() => {
    // Check if token is present
    if (!token) {
      setStatus("error");
    }
  }, [token]);

  const validatePassword = (password: string) => {
    return password.length >= 8;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Reset errors
    setPasswordError("");
    setConfirmPasswordError("");

    // Validate password
    if (!password) {
      setPasswordError(t("page.error.passwordMissing", "reset-password"));
      return;
    }

    if (!validatePassword(password)) {
      setPasswordError(t("page.error.passwordTooShort", "reset-password"));
      return;
    }

    if (password !== confirmPassword) {
      setConfirmPasswordError(t("page.error.passwordsNotMatch", "reset-password"));
      return;
    }

    setStatus("loading");

    try {
      // Call our API route which will forward the request to the external API
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token,
          password,
          language,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus("success");
      } else {
        setStatus("error");

        // Map error messages to translation keys if possible
        let errorKey = "page.error.generic";
        if (data.error === "Reset token is required") {
          errorKey = "page.error.tokenMissing";
        } else if (data.error === "New password is required") {
          errorKey = "page.error.passwordMissing";
        } else if (data.error === "Invalid reset token") {
          errorKey = "page.error.invalid";
        } else if (data.error === "Reset token has expired") {
          errorKey = "page.error.expired";
        } else if (data.error === "Password must be at least 8 characters") {
          errorKey = "page.error.passwordTooShort";
        }

        setPasswordError(data.message || t(errorKey, "reset-password"));
      }
    } catch (error) {
      console.error("Error resetting password:", error);
      setStatus("error");
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 bg-black text-white">
      <div className="w-full max-w-md space-y-8 rounded-lg border border-gray-800 bg-black p-6 shadow-md">
        <div className="text-center">
          <h1 className="text-2xl font-bold">{t("page.title", "reset-password")}</h1>
          <p className="mt-2 text-gray-400">{t("page.subtitle", "reset-password")}</p>
        </div>

        {status === "idle" && token && (
          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            <div className="space-y-2">
              <Label htmlFor="password">{t("page.form.password.label", "reset-password")}</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t("page.form.password.placeholder", "reset-password")}
                className="bg-gray-900 border-gray-700"
                aria-invalid={!!passwordError}
              />
              {passwordError && <p className="text-sm text-red-400">{passwordError}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">
                {t("page.form.confirmPassword.label", "reset-password")}
              </Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder={t("page.form.confirmPassword.placeholder", "reset-password")}
                className="bg-gray-900 border-gray-700"
                aria-invalid={!!confirmPasswordError}
              />
              {confirmPasswordError && (
                <p className="text-sm text-red-400">{confirmPasswordError}</p>
              )}
            </div>

            <Button type="submit" className="w-full">
              {t("page.form.submit", "reset-password")}
            </Button>
          </form>
        )}

        {status === "loading" && (
          <div className="mt-4 space-y-4">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-primary"></div>
            <p>{t("page.loading.message", "reset-password")}</p>
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
              {t("page.success.title", "reset-password")}
            </h2>
            <p className="text-gray-300">{t("page.success.message", "reset-password")}</p>
            <Button onClick={() => router.push("/login")} className="mt-4 w-full cursor-pointer">
              {t("page.success.button", "reset-password")}
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
              {t("page.error.title", "reset-password")}
            </h2>
            <p className="text-red-300">
              {passwordError || t("page.error.generic", "reset-password")}
            </p>
            <Button
              onClick={() => router.push("/auth/request-password-reset")}
              className="mt-4 w-full cursor-pointer"
            >
              {t("page.error.button", "reset-password")}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
