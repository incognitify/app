"use client";

import { useState } from "react";
import { CardElement, useStripe, useElements, Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { getToken } from "@/lib/auth/auth-utils";
import { useTranslation } from "@/lib/i18n/translation-provider";
import { Button } from "@/components/ui/button";

// Initialize Stripe with publishable key from environment variables
// We need to ensure this is only loaded on the client side
const getStripePromise = () => {
  const key = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
  console.log("Stripe key:", key); // For debugging
  return loadStripe(key as string);
};

const stripePromise = typeof window !== "undefined" ? getStripePromise() : null;

function PaymentMethodFormContent() {
  const stripe = useStripe();
  const elements = useElements();
  const { t } = useTranslation();
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [paymentError, setPaymentError] = useState("");

  // Handle payment method submission
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js has not loaded yet
      return;
    }

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      return;
    }

    try {
      setIsProcessing(true);
      setPaymentError("");

      // Create a payment method
      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: "card",
        card: cardElement,
      });

      if (error) {
        throw new Error(error.message || "Failed to process payment method");
      }

      if (!paymentMethod) {
        throw new Error("Failed to create payment method");
      }

      // Send the payment method ID to your backend
      // The workspaceId is already in the URL path, so we don't need to include it in the body
      const response = await fetch(`/api/workspaces/default/payment-methods/attach`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({
          paymentMethodId: paymentMethod.id,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to attach payment method");
      }

      // Clear the card element
      cardElement.clear();
      setPaymentSuccess(true);

      // Hide success message after 5 seconds
      setTimeout(() => {
        setPaymentSuccess(false);
      }, 5000);
    } catch (error) {
      console.error("Error processing payment method:", error);
      setPaymentError(error instanceof Error ? error.message : "An unknown error occurred");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="bg-gray-700 p-4 rounded-md">
        <label className="block text-sm font-medium mb-2">{t("cardDetails", "settings")}</label>
        <div id="card-element-container" className="p-3 bg-gray-800 rounded border border-gray-600">
          <CardElement
            id="card-element"
            options={{
              style: {
                base: {
                  fontSize: "16px",
                  color: "#ffffff",
                  "::placeholder": {
                    color: "#aab7c4",
                  },
                  iconColor: "#ffffff",
                  fontFamily: "Arial, sans-serif",
                  fontSmoothing: "antialiased",
                },
                invalid: {
                  color: "#fa755a",
                  iconColor: "#fa755a",
                },
              },
              hidePostalCode: true,
            }}
            onChange={(event) => {
              // Log any change events to help debug
              console.log("CardElement change", event);
              // Clear any previous error messages when the user makes changes
              if (paymentError) {
                setPaymentError("");
              }
            }}
          />
        </div>
      </div>

      {paymentSuccess && (
        <div className="bg-green-800 text-white p-3 rounded-md">
          {t("paymentMethodSuccess", "settings")}
        </div>
      )}

      {paymentError && <div className="bg-red-800 text-white p-3 rounded-md">{paymentError}</div>}

      <Button
        type="submit"
        className="bg-indigo-600 hover:bg-indigo-700 cursor-pointer"
        disabled={!stripe || isProcessing}
      >
        {isProcessing ? t("addingCard", "settings") : t("addCardButton", "settings")}
      </Button>
    </form>
  );
}

export function PaymentMethodForm() {
  // Only render the Elements provider if we have a Stripe promise
  if (!stripePromise) {
    return (
      <div className="p-4 bg-red-800 text-white rounded-md">
        Stripe could not be initialized. Please check your environment variables.
      </div>
    );
  }
  return (
    <Elements stripe={stripePromise}>
      <PaymentMethodFormContent />
    </Elements>
  );
}
