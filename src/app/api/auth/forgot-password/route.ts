import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

// Define validation schema for forgot password request
const forgotPasswordSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
});

export async function POST(request: NextRequest) {
  try {
    // Parse and validate request body
    const body = await request.json();
    const result = forgotPasswordSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { message: "Invalid input", errors: result.error.errors },
        { status: 400 }
      );
    }

    const { email } = result.data;

    // This is a mock implementation - replace with your actual password reset logic
    // In a real implementation, you would:
    // 1. Check if the user exists
    // 2. Generate a password reset token
    // 3. Store the token with an expiration time
    // 4. Send an email with a reset link
    // 5. Return a success response

    // Log the email for debugging (in a real app, you would check if it exists in the database)
    console.log(`Password reset requested for: ${email}`);

    // For security reasons, always return a success response even if the email doesn't exist
    // This prevents email enumeration attacks
    return NextResponse.json(
      {
        message: "If an account with that email exists, a password reset link has been sent.",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
