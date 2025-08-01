"use client";

import React, { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  useStripe,
  useElements,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
  Elements,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useSearchParams, useRouter } from "next/navigation";
import { CircleAlert, Lock } from "lucide-react";
import StyledAsButton from "@/components/StyledAsButton";
import { useApiMutation } from "@/lib/api-client";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY!);

type CheckoutOutFormType = {
  clientSecret: string;
  serviceNotes?: string | undefined;
};

type BookingResponse = {
  booking_id: string;
};

type BookingRequestPayload = {
  payment_intent_id: string;
  service_id: string;
  customer_id: string;
  provider_id: string;
  date: string;
  time: string;
  location: string;
  service_notes?: string;
};

function CheckoutForm({ clientSecret, serviceNotes }: CheckoutOutFormType) {
  const router = useRouter();
  const stripe = useStripe();
  const elements = useElements();
  const [message, setMessage] = useState<string>();
  const [cardholderError, setCardholderError] = useState("");
  const [loading, setLoading] = useState(false);
  const [cardholderName, setCardholderName] = useState("");

  const queryClient = useQueryClient();

  // plus to using reactQuery versus a normal fetch
  // 1. If the fetch fails due to a flaky network, React Query can automatically retry a few times before showing the error
  // 2. Automatic Caching, avoids duplicate networking calls, allows refetching, improves performance
  // 3. access to a more robust error state
  // 4. if the hook was modified slightly, we could also access the isloading state
  const { mutate: createBooking, error } = useApiMutation<
    BookingResponse,
    BookingRequestPayload
  >("/bookings", "POST");

  // ########################      SEARCH PARAMS  ##########################################

  const searchParams = useSearchParams();
  const serviceId =
    searchParams.get("serviceid") || "24afade0-1c79-4831-9bf4-7c0c5bbd0f66";
  const date = searchParams.get("date") || "Monday, July 15th, 2025";
  const time = searchParams.get("time") || "11:00 AM";
  const location =
    searchParams.get("location") || "123 Main St, San Francisco, CA 94102";
  const providerId =
    searchParams.get("providerID") || "db846969-e83a-4956-b6fc-8e1e735bcd5b";
  // Test Nurse Joy
  const customerId =
    searchParams.get("customerID") || "aaae3041-903f-4934-b820-2abcda916b3b";
  // Arcanine Fireblast

  // ############################ HANDLE SUBMIT FOR PAYMENTS #####################################

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage(undefined);

    if (!cardholderName.trim()) {
      setCardholderError("Cardholder name is required.");
      setLoading(false);
      return;
    }
    setCardholderError("");

    if (!stripe || !elements) {
      setMessage("Stripe.js has not loaded yet.");
      setLoading(false);
      return;
    }

    if (error) {
      setLoading(false);
      setMessage(
        "An error occured when processing your payment! The useApiMutation hook failed",
      );
    }

    setLoading(true);
    setMessage("processing your payment");

    const { error: submitError } = await elements.submit();
    if (submitError) {
      setMessage(submitError.message);
      setLoading(false);
      return;
    }

    const cardElement = elements.getElement(CardNumberElement);
    if (!cardElement) {
      setMessage("Card element not found.");
      setLoading(false);
      return;
    }

    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: cardElement,
        billing_details: {
          name: cardholderName,
        },
      },
    });

    if (result.error) {
      setMessage(result.error.message);
    }

    if (result.paymentIntent?.status === "succeeded") {
      setMessage("Payment was successful!");

      // ########################## CREATE BOOKING ###################
      // createBooking() will call useAPIMutation's mutation function const { mutate: createBooking, error } ....

      createBooking(
        {
          payment_intent_id: result.paymentIntent.id,
          service_id: serviceId,
          customer_id: customerId,
          provider_id: providerId,
          date,
          time,
          location,
          service_notes: serviceNotes,
        },
        {
          onSuccess: (data) => {
            const bookingId = data.booking_id;
            setMessage("Booking successfully created!");
            queryClient.invalidateQueries({ queryKey: ["bookings"] });
            // since next.js 14 has persistant layouts and react query's cache persists, we want to invalidate the query so we don't have old information if we revist it laer
            router.push(`/booking-confirmation/${bookingId}`);
          },
          onError: (err) => {
            setMessage("There was an error creating your booking");
            console.error("Booking failed:", err.message);
          },
          onSettled: () => {
            setLoading(false);
          },
        },
      );

      // const bookingResponse = await fetch(
      //   "https://maidyoulook-backend.onrender.com/api/bookings",
      //   {
      //     method: "POST",
      //     headers: {
      //       "Content-Type": "application/json",
      //     },
      //     body: JSON.stringify({
      //       payment_intent_id: result.paymentIntent.id,
      //       service_id: serviceId,
      //       customer_id: customerId,
      //       provider_id: providerId,
      //       date,
      //       time,
      //       location,
      //       service_notes: serviceNotes,
      //     }),
      //   },
      // );

      // if (!bookingResponse.ok) {
      //   let errMessage = "Booking failed";

      //   try {
      //     const errData = await bookingResponse.json();
      //     errMessage = errData.detail || errMessage;
      //   } catch (jsonErr) {
      //     // if the route was not found then this will be a plain text/html error. So it the 404 response can't be parsed as JSON
      //     const errText = await bookingResponse.text();
      //     errMessage = errText || errMessage;
      //   }
      //   setMessage("There was an error when creating your booking");
      //   throw new Error(errMessage);
      // }

      // // https://github.com/dsd-cohort-team-corgi/backend/issues/37
      // if (bookingResponse) {
      //   const bookingData = await bookingResponse.json();
      //   const bookingId = bookingData.booking_id;
      //   // "19eb6a08-5e86-4420-ae28-b6c4435f6238"
      //   setMessage("Booking successfully created!");
      //   // window.location.href = `/booking-confirmation/${bookingId}`;
      // }
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-4xl rounded-md">
      <section className="rounded-xl border-1 border-light-accent bg-white p-6">
        <div className="my-auto flex max-w-4xl rounded-md bg-white py-4">
          <Lock color="green" size={24} />
          <h2 className="pl-2 text-xl font-semibold">Secure Payment </h2>
        </div>
        {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
        <label className="mb-4 block">
          <span>Card Number</span>
          <div className="mt-1 rounded border border-gray-300 p-3">
            <CardNumberElement options={{ showIcon: true }} />
          </div>
        </label>

        <div className="mb-4 flex gap-4">
          {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
          <label className="flex-1">
            <span> Expiry Date</span>
            <div className="mt-1 rounded border border-gray-300 p-3">
              <CardExpiryElement />
            </div>
          </label>
          {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
          <label className="flex-1">
            <span> CVC</span>
            <div className="mt-1 rounded border border-gray-300 p-3">
              <CardCvcElement />
            </div>
          </label>
        </div>
        {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
        <label className="block">
          <span> Cardholder Name</span>

          <div className="mt-1 rounded border border-gray-300 p-3">
            <input
              type="text"
              className="w-full"
              name="customername"
              value={cardholderName}
              onChange={(e) => {
                setCardholderName(e.target.value);
                if (cardholderError) setCardholderError(""); // Clear error on input
              }}
            />
          </div>
          {cardholderError && (
            <p className="mt-1 text-sm text-red-600">{cardholderError}</p>
          )}
        </label>

        <section className="mx-auto mt-6 flex max-w-4xl rounded-md bg-blue-50 p-4 text-blue-800">
          <CircleAlert color="#2563eb" size={30} />
          <div className="pl-3">
            <h4 className="font-semibold">Payment Protection</h4>
            <p>
              Your payment is processed securely by Stripe. You&apos;ll be
              charged when the service is completed.
            </p>
          </div>
        </section>
      </section>

      {message && !message.includes("success") && (
        <div className="mb-4 font-semibold text-red-600">{message}</div>
      )}

      {message && message.includes("success") && (
        <div className="mb-4 font-semibold text-green-600">{message}</div>
      )}

      <StyledAsButton
        type="submit"
        disabled={!stripe || loading}
        className="mx-auto my-20 flex w-full max-w-lg rounded-3xl bg-blue-500 p-4 font-bold text-white disabled:cursor-not-allowed disabled:opacity-50"
        label={!loading ? `Confirm and Pay Bill` : "Processing..."}
      />
    </form>
  );
}

type StripeCheckoutPageType = {
  serviceNotes?: string | undefined;
};

export default function StripeCheckoutPage({
  serviceNotes,
}: StripeCheckoutPageType) {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [loadingPaymentSectionMessage, setLoadingPaymentSectionMessage] =
    useState<string | null>("loading payment section ...");

  const searchParams = useSearchParams();
  const serviceId = searchParams.get("serviceid");
  // || "24afade0-1c79-4831-9bf4-7c0c5bbd0f66";
  // default backup is the service id for decluttering

  const { mutate: createPaymentIntent } = useApiMutation<
    { client_secret: string },
    { service_id: string }
  >("/stripe/create-payment-intent", "POST");

  // this outer data = This represents the current cached mutation result React Query stores for this mutation
  // this outer data was not needed, so it was removed from const { mutate:createPaymentIntent ....}

  const handleCreatePaymentIntent = () => {
    createPaymentIntent(
      { service_id: serviceId },
      {
        onSuccess: (responseData) => {
          // This inner data is the data returned from this specific mutation call
          setClientSecret(responseData.client_secret);
          // no need to invalidate since this since we don't use a query fetching the client secret anywhere else, and the useEffect ensures we always get fresh data on page load or if theres a new serviceId
          setLoadingPaymentSectionMessage(null);
        },
        onError: (err) => {
          setLoadingPaymentSectionMessage(
            "There was an error with loading the stripe payment section! Payment intent creation failed. Please refresh the page",
          );
          console.error("Booking failed:", err.message);
        },
        onSettled: () => {},
        // Runs on both success or error
      },
    );
  };

  useEffect(() => {
    // rerun the handleCreatePaymentIntent anytime the serviceId changes, which triggers the tan Query mutation via createPaymentIntent
    // for example, if the serviceId is slow to load from the queryParams
    if (serviceId) {
      handleCreatePaymentIntent();
    }

    setLoadingPaymentSectionMessage(
      "There was an error with loading the stripe payment section! No service Id was found, please refresh the page.",
    );
  }, [serviceId]);

  // useEffect(() => {
  //   const createIntent = async () => {
  //     if (!serviceId) {
  //       return;
  //     }
  //     try {
  //       const res = await fetch(
  //         "https://maidyoulook-backend.onrender.com/stripe/create-payment-intent",
  //         {
  //           method: "POST",
  //           headers: { "Content-Type": "application/json" },
  //           body: JSON.stringify({ service_id: serviceId }),
  //         },
  //       );

  //       const data = await res.json();
  //       setClientSecret(data.client_secret);
  //     } catch (err) {
  //       console.error("Failed to create payment intent:", err);
  //     } finally {
  //       setLoadingIntent(false);
  //     }
  //   };

  //   createIntent();
  // }, [serviceId]);

  if (loadingPaymentSectionMessage || !clientSecret) {
    return (
      <div className="p-10 text-center">{loadingPaymentSectionMessage}</div>
    );
  }

  return (
    <Elements stripe={stripePromise} options={{ clientSecret }}>
      <CheckoutForm clientSecret={clientSecret} serviceNotes={serviceNotes} />
    </Elements>
  );
}
