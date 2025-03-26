import { Metadata } from "next";
import { LoginForm } from "@/components/auth/login-form";

export const metadata: Metadata = {
  title: "Sign in | Incognitify",
  description: "Sign in to your Incognitify account",
};

export default function LoginPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-black text-white">
      <div className="w-full max-w-md px-8 py-12">
        <LoginForm />
      </div>
    </div>
  );
}
