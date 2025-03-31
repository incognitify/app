/**
 * Authentication utility functions
 */

// User data interface
export interface User {
  id: string;
  email: string;
  emailVerified: boolean;
  name?: string;
}

// Check if the user is authenticated (client-side)
export function isAuthenticated(): boolean {
  if (typeof window === "undefined") {
    return false;
  }

  // Check for token in localStorage
  const token = localStorage.getItem("token");
  return !!token;
}

// Get the authentication token (client-side)
export function getToken(): string | null {
  if (typeof window === "undefined") {
    return null;
  }

  return localStorage.getItem("token");
}

// Set the authentication token (client-side)
export function setToken(token: string): void {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.setItem("token", token);

  // Also set as a cookie for the middleware
  document.cookie = `token=${token}; path=/; max-age=${60 * 60 * 24 * 7}`; // 7 days
}

// Remove the authentication token (client-side)
export function removeToken(): void {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.removeItem("token");
  localStorage.removeItem("user");

  // Also remove the cookie
  document.cookie = "token=; path=/; max-age=0";
}

// Handle user logout
export function logout(): void {
  removeToken();

  // Redirect to login page
  window.location.href = "/login";
}

/**
 * Fetch current user data
 * @returns Promise resolving to User object or null
 * @throws Error if fetch fails for reasons other than authentication
 */
export async function fetchUserData(): Promise<User | null> {
  try {
    if (!isAuthenticated()) {
      return null;
    }

    const response = await fetch("/api/auth/me", {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });

    // Handle authentication errors (401 Unauthorized)
    if (response.status === 401) {
      console.warn("Authentication token expired or invalid");
      // Clear invalid token and redirect to login
      logout();
      return null;
    }

    if (!response.ok) {
      throw new Error(`Failed to fetch user data: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data.user || null;
  } catch (error) {
    console.error("Error fetching user data:", error);

    // If the error is a network error, don't log out the user
    // This prevents logout on temporary network issues
    if (error instanceof TypeError && error.message.includes("network")) {
      return null;
    }

    return null;
  }
}

// Check if user's email is verified
export async function isEmailVerified(): Promise<boolean> {
  const user = await fetchUserData();
  return user?.emailVerified === true;
}

// Send email verification request
export async function sendVerificationEmail(): Promise<boolean> {
  try {
    const response = await fetch("/api/auth/send-verification-email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
    });

    // Handle authentication errors (401 Unauthorized)
    if (response.status === 401) {
      console.warn("Authentication token expired or invalid");
      // Clear invalid token and redirect to login
      logout();
      return false;
    }

    return response.ok;
  } catch (error) {
    console.error("Error sending verification email:", error);
    return false;
  }
}
