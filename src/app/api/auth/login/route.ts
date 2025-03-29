import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

// Define validation schema for login request
const loginSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }),
});

export async function POST(request: NextRequest) {
  try {
    // Parse and validate request body
    const body = await request.json();
    const result = loginSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { message: "Invalid input", errors: result.error.errors },
        { status: 400 }
      );
    }

    const { email, password } = result.data;

    const apiBaseUrl = process.env.API_BASE_URL || "https://api.udooku.com";
    const apiUrl = `${apiBaseUrl}/users/login`;

    console.log(`Forwarding login request to: ${apiUrl}`);

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
          password
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
            message: "Login failed", 
            error: "External API returned non-JSON response",
            status: response.status
          }, 
          { status: 500 }
        );
      }
    } catch (fetchError: any) {
      console.error("Fetch error:", fetchError);
      // Provide more detailed error information
      const errorDetails = {
        message: "Failed to connect to authentication service",
        error: fetchError.message || "Unknown fetch error",
        cause: fetchError.cause ? 
          { code: fetchError.cause.code, message: fetchError.cause.message } : 
          "No cause details available",
        url: apiUrl
      };
      console.error("Detailed error:", JSON.stringify(errorDetails, null, 2));
      
      return NextResponse.json(errorDetails, { status: 502 });
    }
  } catch (error: any) {
    console.error("Login error:", error);
    return NextResponse.json(
      { message: "Internal server error", error: error.message || "Unknown error" },
      { status: 500 }
    );
  }
}
