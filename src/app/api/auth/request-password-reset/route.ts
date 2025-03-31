import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    // Parse the request body to get the email
    const body = await request.json();
    const { email, language } = body;

    if (!email) {
      return NextResponse.json({ message: "Email is required" }, { status: 400 });
    }

    const apiBaseUrl = process.env.API_BASE_URL || "https://api.udooku.com";
    const projectName = process.env.PROJECT_NAME || "incognitify";
    const apiUrl = `${apiBaseUrl}/users/request-password-reset`;

    console.log(`Forwarding password reset request to: ${apiUrl}`);

    try {
      // Forward the request to the external API
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Add any additional headers needed for your API
        },
        body: JSON.stringify({
          email,
          language: language || "en",
          projectName,
        }),
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
            message: "Password reset request failed",
            error: "External API returned non-JSON response",
            status: response.status,
          },
          { status: 500 }
        );
      }
    } catch (fetchError: unknown) {
      console.error("Fetch error:", fetchError);
      // Provide more detailed error information
      const errorMessage = fetchError instanceof Error ? fetchError.message : "Unknown fetch error";
      const errorWithCause = fetchError as { cause?: { code?: string; message?: string } };
      const errorDetails = {
        message: "Failed to connect to password reset service",
        error: errorMessage,
        cause: errorWithCause.cause
          ? { code: errorWithCause.cause.code, message: errorWithCause.cause.message }
          : "No cause details available",
        url: apiUrl,
      };
      console.error("Detailed error:", JSON.stringify(errorDetails, null, 2));

      return NextResponse.json(errorDetails, { status: 502 });
    }
  } catch (error: unknown) {
    console.error("Password reset request error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { message: "Failed to request password reset", error: errorMessage },
      { status: 500 }
    );
  }
}
