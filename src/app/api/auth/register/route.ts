import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

// Define validation schema for registration request
const registerSchema = z.object({
  displayName: z.string().min(2, {
    message: "Display name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
  workspaceName: z.string().optional(),
  language: z.string().default("en"),
});

export async function POST(request: NextRequest) {
  try {
    // Parse and validate request body
    const body = await request.json();
    const result = registerSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { message: "Invalid input", errors: result.error.errors },
        { status: 400 }
      );
    }

    const { displayName, email, password, workspaceName, language } = result.data;

    // Set default workspace name if not provided
    const finalWorkspaceName = workspaceName || `${displayName}'s Workspace`;

    const apiBaseUrl = process.env.API_BASE_URL || "https://api.udooku.com";
    const projectName = process.env.PROJECT_NAME || "incognitify";
    const apiUrl = `${apiBaseUrl}/users`;

    console.log(`Forwarding registration request to: ${apiUrl}`);

    console.log("Values:", {
      email,
      password,
      displayName,
      projectName,
      workspaceName: finalWorkspaceName,
      language,
    });

    try {
      // Forward the request to the external API
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
          displayName,
          projectName,
          workspaceName: finalWorkspaceName,
          language,
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
            message: "Registration failed",
            error: "External API returned non-JSON response",
            status: response.status,
          },
          { status: 500 }
        );
      }
    } catch (fetchError: any) {
      console.error("Fetch error:", fetchError);
      return NextResponse.json(
        {
          message: "Failed to connect to registration service",
          error: fetchError.message || "Unknown fetch error",
        },
        { status: 502 }
      );
    }
  } catch (error: any) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { message: "Failed to register user", error: error.message || "Unknown error" },
      { status: 500 }
    );
  }
}
