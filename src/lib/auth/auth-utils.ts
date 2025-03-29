/**
 * Authentication utility functions
 */

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

  // Also remove the cookie
  document.cookie = "token=; path=/; max-age=0";
}

// Handle user logout
export function logout(): void {
  removeToken();

  // Redirect to login page
  window.location.href = "/login";
}
