// Define supported languages
export type Language = "en" | "pt";

// Define user preferences interface
export interface UserPreferences {
  language: Language;
}

// Define translation context interface
export interface TranslationContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string, namespace?: string) => string;
  isLoading: boolean;
}
