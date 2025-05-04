import { NextRequest, NextResponse } from "next/server";
import { getUserWorkspaceId } from "@/lib/api/user-utils";

/**
 * API route handler for attaching a payment method to a workspace
 */
export async function POST(request: NextRequest) {
  try {
    // Get the token from the Authorization header
    const authHeader = request.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { message: "Unauthorized - Missing or invalid authorization header" },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7); // Remove "Bearer " prefix
    if (!token) {
      return NextResponse.json({ message: "Unauthorized - Invalid token" }, { status: 401 });
    }

    // Get the payment method ID from the request body
    const { paymentMethodId } = await request.json();
    if (!paymentMethodId) {
      return NextResponse.json({ message: "Payment method ID is required" }, { status: 400 });
    }

    try {
      // Get the user's workspace ID using our utility function
      let workspaceId;
      try {
        workspaceId = await getUserWorkspaceId(token);
      } catch (error) {
        console.error("Error fetching user workspace ID:", error);
        return NextResponse.json(
          {
            message: "Failed to verify workspace",
            error: error instanceof Error ? error.message : "Unknown error",
          },
          { status: 500 }
        );
      }

      if (!workspaceId) {
        console.error("No workspace ID found in user data");
        return NextResponse.json(
          {
            message: "No workspace found for user",
            error: "Missing workspace ID in user profile",
          },
          { status: 400 }
        );
      }

      // Log the attempt to attach a payment method
      console.log(`Attaching payment method ${paymentMethodId} to workspace ${workspaceId}`);

      // Configure the API URL for the external API
      const apiBaseUrl = process.env.API_BASE_URL || "http://localhost:3001";
      const attachUrl = `${apiBaseUrl}/billing/workspaces/${workspaceId}/payment-methods/attach`;

      console.log(`Forwarding request to external API: ${attachUrl}`);

      try {
        // Forward the request to the external API
        const response = await fetch(attachUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ paymentMethodId }),
        });

        // Create a clone of the response before reading its body
        const responseClone = response.clone();

        // Check if the response is successful
        if (!response.ok) {
          console.error(`External API error: ${response.status} ${response.statusText}`);

          // Try to parse the error response as JSON
          try {
            const errorData = await response.json();
            return NextResponse.json(
              {
                success: false,
                message: errorData.message || "Payment method attachment failed",
                error: errorData.error || "External API error",
                status: response.status,
              },
              { status: response.status }
            );
          } catch (jsonError) {
            // If JSON parsing fails, try to get text content
            console.error("JSON parsing failed:", jsonError);

            let responseText = "";
            try {
              responseText = await responseClone.text();
              console.log(`Received non-JSON error response: ${responseText.substring(0, 100)}...`);
            } catch (textError) {
              console.error("Failed to read response text:", textError);
            }

            return NextResponse.json(
              {
                success: false,
                message: "Payment method attachment failed",
                error: `External API returned status ${response.status}`,
                status: response.status,
              },
              { status: response.status }
            );
          }
        }

        // Try to parse the successful response as JSON
        try {
          const data = await response.json();
          return NextResponse.json(
            {
              ...data,
              success: true,
            },
            { status: 200 }
          );
        } catch (jsonError) {
          // If JSON parsing fails, return a generic success response
          console.error("JSON parsing failed for success response:", jsonError);
          return NextResponse.json(
            {
              success: true,
              message: "Payment method attached successfully",
              paymentMethodId,
              workspaceId,
            },
            { status: 200 }
          );
        }
      } catch (error) {
        // Handle network errors
        console.error("Fetch error:", error);
        return NextResponse.json(
          {
            success: false,
            message: "Failed to connect to payment service",
            error: error instanceof Error ? error.message : "Unknown fetch error",
          },
          { status: 502 }
        );
      }
    } catch (fetchError) {
      console.error("Error fetching user data:", fetchError);
      return NextResponse.json(
        {
          message: "Failed to connect to user service",
          error: fetchError instanceof Error ? fetchError.message : "Unknown fetch error",
        },
        { status: 502 }
      );
    }
  } catch (error) {
    console.error("Payment method attachment error:", error);
    return NextResponse.json(
      {
        message: "Internal server error",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
