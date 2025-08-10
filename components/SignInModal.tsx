"use client";

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/react";
import { useBooking } from "@/components/context-wrappers/BookingContext";
import GoogleSignInButton from "./GoogleSignInButton";
import formatDateTimeString from "@/utils/formatDateTimeString";
import convertToWeekDayYearTime from "@/utils/convertToWeekDayYearTIme";
import convertDateToWeekDayYear from "@/utils/convertDateToWeekDayYear";

type LoginPageType = {
  isOpen: boolean;
  onOpenChange: () => void;
  signInIsClosed: () => void;
};
// https://developers.google.com/identity/gsi/web/guides/display-button#javascript
// https://www.npmjs.com/package/@react-oauth/google

export default function LoginPage({
  isOpen,
  onOpenChange,
  signInIsClosed,
}: LoginPageType) {
  const { booking } = useBooking();

  let timeFormatted = "";
  if (booking.availableTime) {
    timeFormatted = convertToWeekDayYearTime(booking.availableTime);
  } else {
    if (booking.date && booking.time) {
      timeFormatted = `${convertDateToWeekDayYear(booking?.date)} ${booking.time}`;
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={signInIsClosed}
      placement="top-center"
      onOpenChange={onOpenChange}
      classNames={{
        closeButton: "text-black top-8 right-6 hover:text-primary",
        // the X defaults to the top right corner, moved it with top and right
        base: "max-w-[500px]",
        // default version was too small and had a max-w-m
      }}
    >
      <ModalContent>
        {() => (
          <>
            <ModalHeader className="my-4 flex flex-col gap-1 text-2xl font-extrabold">
              Sign in to continue{" "}
            </ModalHeader>
            <ModalBody className="gap-0 pl-12">
              <h2 className="mb-3 text-lg font-extrabold">
                {" "}
                Complete Your Booking
              </h2>
              <div>
                <span className="font-semibold text-secondary-font-color">
                  Service:
                </span>{" "}
                <span>{booking.serviceTitle || ""}</span>
              </div>
              <div>
                <span className="font-semibold text-secondary-font-color">
                  Date:
                </span>
                <span>{` ${timeFormatted}`}</span>
              </div>
              <div>
                <span className="font-semibold text-secondary-font-color">
                  Total:
                </span>{" "}
                <span className="font-bold"> {`$${booking.price}`}</span>
              </div>
            </ModalBody>
            <ModalFooter className="flex-col items-center">
              {/* // footer automatically is flexed as flex-row, flex-none is ignored, so I told it to flex-col */}
              <p className="mx-auto mb-3 ml-3">
                Sign in or create an account to complete your booking
              </p>
              <GoogleSignInButton />
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
