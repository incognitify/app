"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { Language, TranslationContextType } from "./types";
import {
  TranslationObject,
  detectBrowserLanguage,
  getLanguagePreference,
  getTranslationByPath,
  loadTranslations,
  saveLanguagePreference,
} from "./utils";
import { getUserId, saveUserPreferences } from "../user/user-preferences";

// Create the translation context
const TranslationContext = createContext<TranslationContextType>({
  language: "en",
  setLanguage: () => {},
  t: (key) => key,
  isLoading: true,
});

// Hook to use translations
export const useTranslation = () => useContext(TranslationContext);

interface TranslationProviderProps {
  children: React.ReactNode;
}

export function TranslationProvider({ children }: TranslationProviderProps) {
  const [language, setLanguageState] = useState<Language>("en");
  const [translations, setTranslations] = useState<Record<string, TranslationObject>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isClient, setIsClient] = useState(false);

  // Initialize language based on preference or browser setting
  useEffect(() => {
    setIsClient(true);

    // Try to get language from localStorage first
    const savedLanguage = getLanguagePreference();

    if (savedLanguage) {
      setLanguageState(savedLanguage);
    } else {
      // Fall back to browser language detection
      const browserLanguage = detectBrowserLanguage();
      setLanguageState(browserLanguage);
      saveLanguagePreference(browserLanguage);
    }

    setIsLoading(false);
  }, []);

  // Load translations when language changes
  useEffect(() => {
    if (!isClient) return;

    const loadAllTranslations = async () => {
      setIsLoading(true);

      try {
        // Load auth translations
        const authTranslations = await loadTranslations(language, "auth");
        
        // Load email verification translations
        const verifyEmailTranslations = await loadTranslations(language, "verify-email");
        
        // Load password reset translations
        const resetPasswordTranslations = await loadTranslations(language, "reset-password");
        
        // Load request password reset translations
        const requestPasswordResetTranslations = await loadTranslations(language, "request-password-reset");

        // Load register translations
        const registerTranslations = await loadTranslations(language, "register");

        // Set all translations
        setTranslations({
          auth: authTranslations,
          "verify-email": verifyEmailTranslations,
          "reset-password": resetPasswordTranslations,
          "request-password-reset": requestPasswordResetTranslations,
          "register": registerTranslations,
        });
      } catch (error) {
        console.error("Failed to load translations:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadAllTranslations();
  }, [language, isClient]);

  // Function to set language and save preference
  const setLanguage = (newLanguage: Language) => {
    setLanguageState(newLanguage);
    saveLanguagePreference(newLanguage);

    // Also update API to save user preference if user is logged in
    const userId = getUserId();
    if (userId) {
      // Save user preferences to the server
      saveUserPreferences(userId, {
        language: newLanguage,
      }).catch((error) => {
        console.error("Failed to save language preference to server:", error);
      });
    }
  };

  // Translation function
  const t = (key: string, namespace = "auth"): string => {
    if (!translations[namespace]) {
      return key;
    }

    return getTranslationByPath(translations[namespace], key);
  };

  const contextValue: TranslationContextType = {
    language,
    setLanguage,
    t,
    isLoading,
  };

  return <TranslationContext.Provider value={contextValue}>{children}</TranslationContext.Provider>;
}
