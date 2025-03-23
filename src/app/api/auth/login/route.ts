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

    // This is a mock implementation - replace with your actual authentication logic
    // In a real implementation, you would:
    // 1. Check if the user exists in your database
    // 2. Verify the password against the stored hash
    // 3. Generate a JWT or session token
    // 4. Return the token to the client

    // For demo purposes, we'll simulate a successful login for a specific email
    if (email === "demo@example.com" && password === "password123") {
      return NextResponse.json(
        {
          message: "Login successful",
          user: {
            id: "user_123",
            email: email,
            displayName: "Demo User",
          },
          // In a real implementation, you would generate a JWT here
          token: "mock_jwt_token",
        },
        { status: 200 }
      );
    }

    // Simulate authentication failure
    return NextResponse.json(
      { message: "Invalid email or password" },
      { status: 401 }
    );
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
