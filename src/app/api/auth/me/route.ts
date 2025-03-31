import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    // Get the token from the Authorization header
    const authHeader = request.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.substring(7); // Remove "Bearer " prefix

    const apiBaseUrl = process.env.API_BASE_URL || "https://api.udooku.com";
    const apiUrl = `${apiBaseUrl}/users/me`;

    console.log(`Fetching user data from: ${apiUrl}`);

    try {
      // Forward the request to the external API
      const response = await fetch(apiUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      // Check if the response is JSON
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        // Parse JSON response
        const data = await response.json();
        return NextResponse.json(data, { status: response.status });
      } else {
        // Handle non-JSON response
        const text = await response.text();
        console.log(`Received non-JSON response: ${text.substring(0, 100)}...`);

        // Return a formatted error response
        return NextResponse.json(
          {
            message: "Failed to fetch user data",
            error: "External API returned non-JSON response",
            status: response.status,
          },
          { status: 500 }
        );
      }
    } catch (fetchError: unknown) {
      console.error("Fetch error:", fetchError);
      // Provide more detailed error information
      type ErrorWithCause = Error & { cause?: { code: string; message: string } };

      const errorDetails = {
        message: "Failed to connect to user data service",
        error: fetchError instanceof Error ? fetchError.message : "Unknown fetch error",
        cause:
          fetchError instanceof Error && "cause" in fetchError && fetchError.cause
            ? {
                code: (fetchError as ErrorWithCause).cause?.code || "unknown",
                message: (fetchError as ErrorWithCause).cause?.message || "unknown",
              }
            : "No cause details available",
        url: apiUrl,
      };
      console.error("Detailed error:", JSON.stringify(errorDetails, null, 2));

      return NextResponse.json(errorDetails, { status: 502 });
    }
  } catch (error: unknown) {
    console.error("User data error:", error);
    return NextResponse.json(
      {
        message: "Internal server error",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
