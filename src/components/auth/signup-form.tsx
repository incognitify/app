"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useState, useEffect } from "react";
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

const formSchema = z
  .object({
    displayName: z.string().min(2, {
      message: "Display name must be at least 2 characters.",
    }),
    email: z.string().email({
      message: "Please enter a valid email address.",
    }),
    password: z.string().min(8, {
      message: "Password must be at least 8 characters.",
    }),
    confirmPassword: z.string(),
    workspaceName: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export function SignupForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [defaultWorkspaceName, setDefaultWorkspaceName] = useState("");
  const router = useRouter();
  const { t, language } = useTranslation();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      displayName: "",
      email: "",
      password: "",
      confirmPassword: "",
      workspaceName: "",
    },
  });

  // Watch the display name to update the default workspace name
  const displayName = form.watch("displayName");
  const workspaceNameValue = form.watch("workspaceName");

  // Update default workspace name when display name changes
  useEffect(() => {
    if (displayName) {
      const newDefaultWorkspaceName = `${displayName}'s Workspace`;
      setDefaultWorkspaceName(newDefaultWorkspaceName);
      
      // Only update the workspace name field if it's empty or was the previous default
      if (!workspaceNameValue || workspaceNameValue === defaultWorkspaceName) {
        form.setValue("workspaceName", newDefaultWorkspaceName);
      }
    }
  }, [displayName, form, defaultWorkspaceName, workspaceNameValue]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          displayName: values.displayName,
          email: values.email,
          password: values.password,
          workspaceName: values.workspaceName || defaultWorkspaceName,
          language,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || t("toasts.signupError"));
      }

      toast.success(t("toasts.signupSuccess"));
      router.push("/login");
    } catch (error) {
      console.error("Registration failed:", error);
      toast.error(error instanceof Error ? error.message : t("toasts.signupError"));
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-sm space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold">{t("signup.title")}</h1>
        <p className="text-gray-400">{t("signup.subtitle")}</p>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="displayName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("signup.displayNameLabel")}</FormLabel>
                <FormControl>
                  <Input placeholder={t("signup.displayNamePlaceholder")} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("signup.emailLabel")}</FormLabel>
                <FormControl>
                  <Input placeholder={t("signup.emailPlaceholder")} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="workspaceName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("signup.workspaceNameLabel")}</FormLabel>
                <FormControl>
                  <Input 
                    placeholder={defaultWorkspaceName || t("signup.workspaceNamePlaceholder")} 
                    {...field} 
                  />
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
                <FormLabel>{t("signup.passwordLabel")}</FormLabel>
                <FormControl>
                  <Input type="password" placeholder={t("signup.passwordPlaceholder")} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("signup.confirmPasswordLabel")}</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder={t("signup.confirmPasswordPlaceholder")}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? t("signup.creatingAccountButton") : t("signup.createAccountButton")}
          </Button>
        </form>
      </Form>
      <div className="text-center text-sm">
        <span className="text-gray-400">{t("signup.alreadyHaveAccount")}</span>{" "}
        <Link href="/login" className="text-indigo-400 hover:text-indigo-300">
          {t("signup.signInLink")}
        </Link>
      </div>
      <div className="flex justify-center mt-6">
        <LanguageSelector />
      </div>
    </div>
  );
}
