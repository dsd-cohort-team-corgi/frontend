"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDisclosure } from "@heroui/react";
import StyledAsButton from "@/components/StyledAsButton";
import { useAuthContext } from "@/components/context-wrappers/AuthContext";
import { useBooking } from "@/components/context-wrappers/BookingContext";
import SignInModal from "@/components/SignInModal";
import CompleteProfileModal from "@/components/CompleteProfileModal";

type CheckoutButtonProps = {
  providerInfo: ProviderInfo | ServiceRecommendation;
  disabled?: boolean;
};

export default function CheckoutButton({
  providerInfo,
  disabled,
}: CheckoutButtonProps) {
  const { authContextObject } = useAuthContext();
  const { booking, updateBooking } = useBooking();
  const router = useRouter();

  const { isOpen: signInIsOpen, onOpen: signInOnOpen } = useDisclosure();
  const {
    isOpen: completeProfileIsOpen,
    onOpenChange: completeProfileOnOpenChange,
    onOpen: openCompleteProfile,
  } = useDisclosure();

  useEffect(() => {
    console.log("booking", booking);
  }, [booking]);

  useEffect(() => {
    if (providerInfo && "first_name" in providerInfo) {
      // providerInfo is a ProviderInfo object
      updateBooking({
        companyName: providerInfo?.company_name,
        firstName: providerInfo?.first_name,
        lastName: providerInfo?.last_name,
        providerId: providerInfo?.id,
        paymentIntentId: undefined,
        // if they go from /checkout back to this page, perhaps to change the time or day we want them to keep all their selected information except for paymentIntentId
      });
    } else {
      // providerInfo is a ServiceRecommendation object
      const priceToNumber = Number(providerInfo?.price);
      updateBooking({
        companyName: providerInfo?.provider,
        serviceId: providerInfo.id,
        price: priceToNumber,
        rating: providerInfo?.rating,
        description: providerInfo.description,
        serviceDuration: providerInfo.duration,
        paymentIntentId: undefined,
        providerId: providerInfo.provider_id,
        available_time: providerInfo.available_time,
      });
    }
  }, [providerInfo]);
  function handleContinueToBooking() {
    if (!booking.serviceId && (!booking.time || !booking.available_time)) {
      console.error("no booking time or serviceId Found");
      return;
    }

    if (!authContextObject.supabaseUserId) {
      signInOnOpen(); // show sign-in modal
      return;
    }

    if (authContextObject.supabaseUserId) {
      const isMissingProfileInfo =
        !authContextObject.customerId ||
        !authContextObject.streetAddress1 ||
        !authContextObject.city ||
        !authContextObject.state ||
        !authContextObject.zip;

      if (isMissingProfileInfo && !completeProfileIsOpen) {
        openCompleteProfile();
        return;
      }
    }

    router.push(`/checkout`);
  }

  return (
    <section>
      <SignInModal isOpen={signInIsOpen} onOpenChange={signInOnOpen} />
      <CompleteProfileModal
        isOpen={completeProfileIsOpen}
        onOpenChange={completeProfileOnOpenChange}
      />
      <StyledAsButton
        className="mb-4 mt-6 block w-11/12 px-0 disabled:bg-gray-500"
        label="Continue to Booking"
        onPress={() => handleContinueToBooking()}
        disabled={disabled}
        // disabled={!booking.serviceId || !booking.time || !booking.date}
      />
    </section>
  );
}
