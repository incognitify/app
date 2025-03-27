import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    // Parse the request body to get the email
    const body = await request.json();
    const { email, language } = body;

    if (!email) {
      return NextResponse.json(
        { message: "Email is required" },
        { status: 400 }
      );
    }

    // Get the API base URL from environment variables
    const apiBaseUrl = process.env.API_BASE_URL || "https://api.udooku.com";
    
    // Get the project name from environment variables
    const projectName = process.env.PROJECT_NAME || "incognitify";
    
    // Define the API endpoint to forward the request to
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
          language: language || "en", // Include the user's language, default to English if not provided
          projectName // Include the project name from environment variables
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
            status: response.status
          }, 
          { status: 500 }
        );
      }
    } catch (fetchError: any) {
      console.error("Fetch error:", fetchError);
      return NextResponse.json(
        { 
          message: "Failed to connect to password reset service", 
          error: fetchError.message || "Unknown fetch error"
        }, 
        { status: 502 }
      );
    }
  } catch (error: any) {
    console.error("Password reset request error:", error);
    return NextResponse.json(
      { message: "Failed to request password reset", error: error.message || "Unknown error" },
      { status: 500 }
    );
  }
}
