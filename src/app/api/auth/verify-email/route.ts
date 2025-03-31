import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    // Get the token from the URL
    const { searchParams } = new URL(request.url);
    const token = searchParams.get("token");

    if (!token) {
      return NextResponse.json({ message: "Verification token is required" }, { status: 400 });
    }

    // Get the API base URL from environment variables
    const apiBaseUrl = process.env.API_BASE_URL || "https://api.udooku.com";

    // Define the API endpoint to forward the request to
    const apiUrl = new URL(`${apiBaseUrl}/users/verify-email`);

    // Add the token to the query parameters
    apiUrl.searchParams.set("token", token);

    console.log(`Forwarding request to: ${apiUrl.toString()}`);

    try {
      // Forward the request to the external API
      const response = await fetch(apiUrl.toString(), {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          // Add any additional headers needed for your API
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
            message: "Email verification failed",
            error: "External API returned non-JSON response",
            status: response.status,
          },
          { status: 500 }
        );
      }
    } catch (fetchError: unknown) {
      console.error("Fetch error:", fetchError);
      const errorMessage = fetchError instanceof Error ? fetchError.message : "Unknown fetch error";
      return NextResponse.json(
        {
          message: "Failed to connect to verification service",
          error: errorMessage,
        },
        { status: 502 }
      );
    }
  } catch (error: unknown) {
    console.error("Email verification error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { message: "Failed to verify email", error: errorMessage },
      { status: 500 }
    );
  }
}
