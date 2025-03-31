"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { isAuthenticated, isEmailVerified, sendVerificationEmail } from "@/lib/auth/auth-utils";
import { useTranslation } from "@/lib/i18n/translation-provider";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";

interface AuthGuardProps {
  children: React.ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [isVerified, setIsVerified] = useState<boolean | null>(null);
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      setLoading(true);

      // Check if user is authenticated
      if (!isAuthenticated()) {
        router.push("/login");
        return;
      }

      // Check if email is verified
      const verified = await isEmailVerified();
      setIsVerified(verified);
      setLoading(false);
    };

    checkAuth();
  }, [router]);

  const handleResendVerification = async () => {
    setIsSending(true);
    try {
      const success = await sendVerificationEmail();

      if (success) {
        toast.success(t("success.emailSent", "verify-email"));
      } else {
        throw new Error("Failed to send verification email");
      }
    } catch (error) {
      console.error("Error sending verification email:", error);
      toast.error(t("errors.sendFailed", "verify-email"));
    } finally {
      setIsSending(false);
    }
  };

  // const handleCheckAgain = async () => {
  //   setLoading(true);
  //   const verified = await isEmailVerified();
  //   setIsVerified(verified);
  //   setLoading(false);
  // };

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-4 bg-black text-white">
        <div className="w-full max-w-md space-y-8 rounded-lg border border-gray-800 bg-black p-6 shadow-md">
          <div className="text-center">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-primary"></div>
            <p className="mt-4">{t("loading", "dashboard")}</p>
          </div>
        </div>
      </div>
    );
  }

  if (isVerified === false) {
    return (
      <div
        className="flex min-h-screen flex-col items-center justify-center p-4 bg-black text-white"
        role="alert"
        aria-live="assertive"
      >
        <div className="w-full max-w-md space-y-8 rounded-lg border border-gray-800 bg-black p-6 shadow-md">
          <div className="text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-yellow-900">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-yellow-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <h1 className="mt-4 text-2xl font-bold">{t("title", "verify-email")}</h1>
            <p className="mt-2 text-gray-400">{t("description", "verify-email")}</p>

            <div className="mt-6 space-y-4">
              <p className="text-sm text-gray-400">{t("instructions", "verify-email")}</p>

              <Button
                onClick={handleResendVerification}
                className="w-full cursor-pointer"
                disabled={isSending}
                aria-busy={isSending}
              >
                {isSending
                  ? t("buttons.sending", "verify-email")
                  : t("buttons.resend", "verify-email")}
              </Button>

              {/*<Button*/}
              {/*  onClick={handleCheckAgain}*/}
              {/*  variant="outline"*/}
              {/*  className="w-full mt-2 cursor-pointer"*/}
              {/*>*/}
              {/*  {t("buttons.checkAgain", "verify-email")}*/}
              {/*</Button>*/}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
