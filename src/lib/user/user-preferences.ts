import { Language } from "@/lib/i18n/types";

export interface UserPreferences {
  language: Language;
}

export interface UserPreferencesState {
  userId: string | null;
  preferences: UserPreferences;
  isLoading: boolean;
  error: string | null;
}

/**
 * Save user preferences to the server
 */
export async function saveUserPreferences(
  userId: string,
  preferences: UserPreferences
): Promise<UserPreferences> {
  try {
    const response = await fetch("/api/user/preferences", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId,
        preferences,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to save preferences");
    }

    const data = await response.json();
    return data.preferences;
  } catch (error) {
    console.error("Failed to save user preferences:", error);
    throw error;
  }
}

/**
 * Load user preferences from the server
 */
export async function loadUserPreferences(userId: string): Promise<UserPreferences> {
  try {
    const response = await fetch(`/api/user/preferences?userId=${userId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to load preferences");
    }

    const data = await response.json();
    return data.preferences;
  } catch (error) {
    console.error("Failed to load user preferences:", error);
    // Return default preferences if loading fails
    return { language: "en" };
  }
}

/**
 * Get user ID from localStorage
 */
export function getUserId(): string | null {
  if (typeof window === "undefined") {
    return null;
  }

  return localStorage.getItem("userId");
}

/**
 * Set user ID in localStorage
 */
export function setUserId(userId: string): void {
  if (typeof window !== "undefined") {
    localStorage.setItem("userId", userId);
  }
}
