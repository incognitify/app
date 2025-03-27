"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useState } from "react";
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
});

export function ForgotPasswordForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { t, language } = useTranslation();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/request-password-reset", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...values,
          language
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        toast.error(error.message || t("toasts.forgotPasswordError"));
        return;
      }

      toast.success(t("toasts.forgotPasswordSuccess"));
      setIsSubmitted(true);
    } catch (error) {
      console.error("Password reset request failed:", error);
      toast.error(error instanceof Error ? error.message : t("toasts.forgotPasswordError"));
    } finally {
      setIsLoading(false);
    }
  }

  if (isSubmitted) {
    return (
      <div className="mx-auto max-w-sm space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold">{t("forgotPassword.checkEmail.title")}</h1>
          <p className="text-sm text-gray-400">{t("forgotPassword.checkEmail.subtitle")}</p>
        </div>
        <div className="space-y-4">
          <p className="text-sm text-gray-400 text-center">
            {t("forgotPassword.checkEmail.noEmail")}{" "}
            <button
              onClick={() => setIsSubmitted(false)}
              className="text-indigo-400 hover:text-indigo-300"
            >
              {t("forgotPassword.checkEmail.tryAgain")}
            </button>
          </p>
          <div className="text-center">
            <Link href="/login" className="text-sm text-indigo-400 hover:text-indigo-300">
              {t("forgotPassword.checkEmail.returnToSignIn")}
            </Link>
          </div>
        </div>
        <div className="flex justify-center mt-6">
          <LanguageSelector />
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-sm space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold">{t("forgotPassword.title")}</h1>
        <p className="text-sm text-gray-400">{t("forgotPassword.subtitle")}</p>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("forgotPassword.emailLabel")}</FormLabel>
                <FormControl>
                  <Input placeholder={t("forgotPassword.emailPlaceholder")} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading
              ? t("forgotPassword.sendingButton")
              : t("forgotPassword.sendResetLinkButton")}
          </Button>
        </form>
      </Form>
      <div className="text-center text-sm">
        <span className="text-gray-400">{t("forgotPassword.rememberPassword")}</span>{" "}
        <Link href="/login" className="text-indigo-400 hover:text-indigo-300">
          {t("forgotPassword.backToSignIn")}
        </Link>
      </div>
      <div className="flex justify-center mt-6">
        <LanguageSelector />
      </div>
    </div>
  );
}
