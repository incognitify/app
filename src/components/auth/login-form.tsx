"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { useTranslation } from "@/lib/i18n/translation-provider";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { LanguageSelector } from "@/components/language-selector";

const formSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }),
});

export function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { t } = useTranslation();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || t("toasts.loginError"));
      }

      const data = await response.json();

      // Store the token in localStorage or a secure cookie
      localStorage.setItem("token", data.token);

      toast.success(t("toasts.loginSuccess"));

      // Redirect to dashboard or home page
      router.push("/");
    } catch (error) {
      console.error("Login failed:", error);
      toast.error(error instanceof Error ? error.message : t("toasts.loginError"));
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-sm space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold">{t("login.title")}</h1>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("login.emailLabel")}</FormLabel>
                <FormControl>
                  <Input placeholder={t("login.emailPlaceholder")} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center justify-between">
                  <FormLabel>{t("login.passwordLabel")}</FormLabel>
                  <Link
                    href="/forgot-password"
                    className="text-sm text-indigo-400 hover:text-indigo-300"
                  >
                    {t("login.forgotPassword")}
                  </Link>
                </div>
                <FormControl>
                  <Input type="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? t("login.signingInButton") : t("login.signInButton")}
          </Button>
        </form>
      </Form>
      <div className="text-center text-sm">
        <span className="text-gray-400">{t("login.notAMember")}</span>{" "}
        <Link href="/signup" className="text-indigo-400 hover:text-indigo-300">
          {t("login.signUpLink")}
        </Link>
      </div>
      <div className="flex justify-center mt-6">
        <LanguageSelector />
      </div>
    </div>
  );
}
