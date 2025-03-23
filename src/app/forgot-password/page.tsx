import { Metadata } from "next";
import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";

export const metadata: Metadata = {
  title: "Forgot Password | Incognitify",
  description: "Reset your Incognitify account password",
};

export default function ForgotPasswordPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-black text-white">
      <div className="w-full max-w-md px-8 py-12">
        <ForgotPasswordForm />
      </div>
    </div>
  );
}
