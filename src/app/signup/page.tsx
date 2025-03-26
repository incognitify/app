import { Metadata } from "next";
import { SignupForm } from "@/components/auth/signup-form";

export const metadata: Metadata = {
  title: "Sign up | Incognitify",
  description: "Create a new Incognitify account",
};

export default function SignupPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-black text-white">
      <div className="w-full max-w-md px-8 py-12">
        <SignupForm />
      </div>
    </div>
  );
}
