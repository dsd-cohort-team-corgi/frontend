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
  providerInfo: ProviderInfo;
};

export default function CheckoutButton({ providerInfo }: CheckoutButtonProps) {
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
    updateBooking({
      companyName: providerInfo?.company_name,
      firstName: providerInfo?.first_name,
      lastName: providerInfo?.last_name,
      providerId: providerInfo?.id,
      paymentIntentId: undefined,
      // if they go from /checkout back to this page, perhaps to change the time or day we want them to keep all their selected information except for paymentIntentId
    });
  }, [providerInfo]);
  function handleContinueToBooking() {
    if (!booking.serviceId || !booking.time) return;

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
        disabled={!booking.serviceId || !booking.time || !booking.date}
      />
    </section>
  );
}
