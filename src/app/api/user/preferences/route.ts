import { NextResponse } from "next/server";
import { z } from "zod";

// Define validation schema for user preferences
const userPreferencesSchema = z.object({
  userId: z.string(),
  preferences: z.object({
    language: z.enum(["en", "pt"]),
  }),
});

// Mock database for user preferences (in a real app, this would be a database)
const userPreferencesStore: Record<string, { language: string }> = {};

export async function PUT(request: Request) {
  try {
    // Parse and validate the request body
    const body = await request.json();
    const result = userPreferencesSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { message: "Invalid request data", errors: result.error.errors },
        { status: 400 }
      );
    }

    const { userId, preferences } = result.data;

    // In a real implementation, you would:
    // 1. Verify the user is authenticated
    // 2. Check if the user exists
    // 3. Update the user's preferences in the database

    // Store the user preferences in our mock database
    userPreferencesStore[userId] = preferences;

    // Return success response
    return NextResponse.json(
      {
        message: "Preferences updated successfully",
        preferences,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Failed to update user preferences:", error);
    return NextResponse.json(
      { message: "An error occurred while updating preferences" },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    // Get the userId from the URL
    const url = new URL(request.url);
    const userId = url.searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ message: "User ID is required" }, { status: 400 });
    }

    // In a real implementation, you would:
    // 1. Verify the user is authenticated
    // 2. Check if the user exists
    // 3. Retrieve the user's preferences from the database

    // Get the user preferences from our mock database
    const preferences = userPreferencesStore[userId] || { language: "en" };

    // Return the preferences
    return NextResponse.json(
      {
        preferences,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Failed to get user preferences:", error);
    return NextResponse.json(
      { message: "An error occurred while retrieving preferences" },
      { status: 500 }
    );
  }
}
