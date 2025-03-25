import { Language } from "./types";

// Define a type for translation objects
export type TranslationObject = Record<string, string | Record<string, unknown>>;

// Cache for loaded translations
const translationCache: Record<string, TranslationObject> = {};

/**
 * Load translations for a specific language and namespace
 */
export async function loadTranslations(
  language: Language,
  namespace: string
): Promise<TranslationObject> {
  const cacheKey = `${language}:${namespace}`;

  // Return from cache if available
  if (translationCache[cacheKey]) {
    return translationCache[cacheKey];
  }

  try {
    // Dynamic import of translation files
    const translations = (await import(`../../locales/${language}/${namespace}.json`))
      .default as TranslationObject;

    // Cache the translations
    translationCache[cacheKey] = translations;

    return translations;
  } catch (error) {
    console.error(`Failed to load translations for ${language}:${namespace}`, error);
    return {};
  }
}

/**
 * Get a nested translation value by key path
 */
export function getTranslationByPath(obj: TranslationObject, path: string): string {
  const keys = path.split(".");
  let result: unknown = obj;

  for (const key of keys) {
    if (result && typeof result === "object" && key in (result as object)) {
      result = (result as Record<string, unknown>)[key];
    } else {
      return path; // Return the key path if translation not found
    }
  }

  return typeof result === "string" ? result : path;
}

/**
 * Detect browser language
 */
export function detectBrowserLanguage(): Language {
  if (typeof window === "undefined") {
    return "en"; // Default to English on server
  }

  const browserLang = navigator.language.split("-")[0];

  // Check if browser language is supported
  if (browserLang === "pt") {
    return "pt";
  }

  return "en"; // Default to English
}

/**
 * Save language preference to localStorage
 */
export function saveLanguagePreference(language: Language): void {
  if (typeof window !== "undefined") {
    localStorage.setItem("language", language);
  }
}

/**
 * Get language preference from localStorage
 */
export function getLanguagePreference(): Language | null {
  if (typeof window !== "undefined") {
    const savedLanguage = localStorage.getItem("language") as Language | null;
    return savedLanguage;
  }
  return null;
}
