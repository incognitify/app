/**
 * Utility functions for user-related API operations
 */

/**
 * Fetches the current user's workspace ID from the API
 * @param token The authentication token
 * @returns The user's workspace ID or null if not found
 * @throws Error if the API request fails
 */
export async function getUserWorkspaceId(token: string): Promise<string | null> {
  if (!token) {
    throw new Error("Authentication token is required");
  }

  // Configure the API URL for fetching the user's data
  const apiBaseUrl = process.env.API_BASE_URL || "http://localhost:3001";
  const userApiUrl = `${apiBaseUrl}/users/me`;

  // Fetch the user's data to get the workspace ID
  console.log(`Fetching user data from: ${userApiUrl}`);
  const userResponse = await fetch(userApiUrl, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!userResponse.ok) {
    throw new Error(`Failed to fetch user data: ${userResponse.status} ${userResponse.statusText}`);
  }

  // Parse the user response to get the workspace ID
  const userData = await userResponse.json();
  return userData.workspaceId || null;
}

/**
 * Validates that the provided workspace ID matches the user's actual workspace ID
 * @param routeWorkspaceId The workspace ID from the route
 * @param actualWorkspaceId The user's actual workspace ID
 * @returns True if the workspace ID is valid, false otherwise
 */
export function validateWorkspaceId(routeWorkspaceId: string, actualWorkspaceId: string): boolean {
  // Allow "default" as a special case
  return routeWorkspaceId === actualWorkspaceId || routeWorkspaceId === "default";
}
