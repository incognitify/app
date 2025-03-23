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

    const { displayName, email, password } = result.data;

    // This is a mock implementation - replace with your actual registration logic
    // In a real implementation, you would:
    // 1. Check if the user already exists
    // 2. Hash the password
    // 3. Store the user in your database
    // 4. Send a verification email
    // 5. Return a success response

    // Simulate checking if email already exists
    if (email === "demo@example.com") {
      return NextResponse.json(
        { message: "Email already in use" },
        { status: 409 }
      );
    }

    // Log password length for validation (in a real app, you would hash it)
    console.log(`Password length: ${password.length}`);

    // Simulate successful registration
    return NextResponse.json(
      {
        message: "Registration successful",
        user: {
          id: "user_" + Math.floor(Math.random() * 1000),
          email,
          displayName,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
