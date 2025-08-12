"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDisclosure } from "@heroui/react";
import StyledAsButton from "@/components/StyledAsButton";
import { useAuthContext } from "@/components/context-wrappers/AuthContext";
import { useBooking } from "@/components/context-wrappers/BookingContext";
import SignInModal from "@/components/SignInModal";
// import CompleteProfileModal from "@/components/CompleteProfileModal";

type CheckoutButtonProps = {
  providerInfo: ProviderInfo | ServiceRecommendation;
  disabled?: boolean;
  className?: string;
  text?: string;
  onClose?: () => void;
};

export default function CheckoutButton({
  providerInfo,
  disabled,
  className,
  text,
  onClose,
}: CheckoutButtonProps) {
  const { authContextObject } = useAuthContext();
  const { booking, updateBooking } = useBooking();
  const router = useRouter();

  console.log("booking", booking);

  const {
    isOpen: signInIsOpen,
    onOpen: signInOnOpen,
    onClose: signInIsClosed,
  } = useDisclosure();
  // const {
  //   isOpen: completeProfileIsOpen,
  //   onOpenChange: completeProfileOnOpenChange,
  //   onOpen: openCompleteProfile,
  // } = useDisclosure();

  useEffect(() => {
    if (providerInfo && "first_name" in providerInfo) {
      const redirectUrl = window.location.pathname;
      // providerInfo is a ProviderInfo object, aka they are coming from the provider's page
      // because ServiceRecommendation does not have "first_name"
      updateBooking({
        companyName: providerInfo?.company_name,
        firstName: providerInfo?.first_name,
        lastName: providerInfo?.last_name,
        providerId: providerInfo?.id,
        redirectPath: redirectUrl,
        paymentIntentId: undefined,
        // if they go from /checkout back to this page, perhaps to change the time or day we want them to keep all their selected information except for paymentIntentId
      });
    } else {
      // providerInfo is a ServiceRecommendation object, they are coming from bumi ai
      const priceToNumber = Number(providerInfo?.price);
      console.log("providerInfo.available_time", providerInfo.available_time);
      updateBooking({
        companyName: providerInfo?.provider,
        serviceId: providerInfo.id,
        price: priceToNumber,
        rating: providerInfo?.rating,
        description: providerInfo.description,
        serviceDuration: providerInfo.duration,
        paymentIntentId: undefined,
        providerId: providerInfo.provider_id,
        availableTime: providerInfo.available_time,
        redirectPath: "/checkout",
      });
    }
  }, [providerInfo]);
  function handleContinueToBooking() {
    if (!booking.serviceId && (!booking.time || !booking.availableTime)) {
      console.error("no booking time or serviceId Found");
      return;
    }

    if (!authContextObject.supabaseUserId) {
      signInOnOpen(); // show sign-in modal
      return;
    }

    // if (authContextObject.supabaseUserId) {
    //   const isMissingProfileInfo =
    //     !authContextObject.customerId ||
    //     !authContextObject.streetAddress1 ||
    //     !authContextObject.city ||
    //     !authContextObject.state ||
    //     !authContextObject.zip;

    //   if (isMissingProfileInfo && !completeProfileIsOpen) {
    //     openCompleteProfile();
    //     return;
    //   }
    // }

    router.push(`/checkout`);
    // Close modal if onClose function is provided
    if (onClose) {
      onClose();
    }
  }

  return (
    <section>
      <SignInModal
        isOpen={signInIsOpen}
        onOpenChange={signInOnOpen}
        signInIsClosed={signInIsClosed}
      />
      {/* <CompleteProfileModal
        isOpen={completeProfileIsOpen}
        onOpenChange={completeProfileOnOpenChange}
      /> */}
      <StyledAsButton
        className={`mb-4 mt-6 block px-0 disabled:bg-gray-500 disabled:text-white h-14 ${className}`}
        label={text || "Continue to Booking"}
        onPress={() => handleContinueToBooking()}
        disabled={disabled}
      />
    </section>
  );
}
