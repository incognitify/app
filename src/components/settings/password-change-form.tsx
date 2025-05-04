"use client";

import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { getToken } from "@/lib/auth/auth-utils";
import { useTranslation } from "@/lib/i18n/translation-provider";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

// Password change form schema
const passwordSchema = z
  .object({
    currentPassword: z.string().min(8, "Password must be at least 8 characters"),
    newPassword: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(8, "Password must be at least 8 characters"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export function PasswordChangeForm() {
  const { t } = useTranslation();
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordChangeSuccess, setPasswordChangeSuccess] = useState(false);
  const [passwordChangeError, setPasswordChangeError] = useState("");

  // Password change form
  const passwordForm = useForm<z.infer<typeof passwordSchema>>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  // Handle password change submission
  const onPasswordSubmit = async (values: z.infer<typeof passwordSchema>) => {
    try {
      setIsChangingPassword(true);
      setPasswordChangeError("");
      const response = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({
          currentPassword: values.currentPassword,
          newPassword: values.newPassword,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to change password");
      }

      // Reset form and show success message
      passwordForm.reset();
      setPasswordChangeSuccess(true);
      // Hide success message after 5 seconds
      setTimeout(() => {
        setPasswordChangeSuccess(false);
      }, 5000);
    } catch (error) {
      console.error("Error changing password:", error);
      setPasswordChangeError(error instanceof Error ? error.message : "An unknown error occurred");
    } finally {
      setIsChangingPassword(false);
    }
  };

  return (
    <Form {...passwordForm}>
      <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-4">
        <FormField
          control={passwordForm.control}
          name="currentPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("settings.currentPassword", "settings")}</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder={t("settings.currentPasswordPlaceholder", "settings")}
                  className="bg-gray-700 text-white"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={passwordForm.control}
          name="newPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("settings.newPassword", "settings")}</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder={t("settings.newPasswordPlaceholder", "settings")}
                  className="bg-gray-700 text-white"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={passwordForm.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("settings.confirmPassword", "settings")}</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder={t("settings.confirmPasswordPlaceholder", "settings")}
                  className="bg-gray-700 text-white"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {passwordChangeSuccess && (
          <div className="bg-green-800 text-white p-3 rounded-md">
            {t("settings.passwordChangeSuccess", "settings")}
          </div>
        )}

        {passwordChangeError && (
          <div className="bg-red-800 text-white p-3 rounded-md">{passwordChangeError}</div>
        )}

        <Button
          type="submit"
          className="bg-indigo-600 hover:bg-indigo-700"
          disabled={isChangingPassword}
        >
          {isChangingPassword
            ? t("settings.changingPassword", "settings")
            : t("settings.changePasswordButton", "settings")}
        </Button>
      </form>
    </Form>
  );
}
