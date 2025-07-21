"use client";

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/react";
import GoogleSignInbutton from "./GoogleSignInButton";

// const params = new URLSearchParams({
//   client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
//   redirect_uri: "http://localhost:3000/auth/callback",
//   response_type: "code",
//   scope: "openid email profile",
//   access_type: "offline", // get refresh token if needed
//   prompt: "consent", // always ask user
// });
type LoginPageType = {
  isOpen: boolean;
  onOpenChange: () => void;
};
// https://developers.google.com/identity/gsi/web/guides/display-button#javascript
// https://www.npmjs.com/package/@react-oauth/google

export default function LoginPage({ isOpen, onOpenChange }: LoginPageType) {
  return (
    <Modal
      isOpen={isOpen}
      placement="top-center"
      onOpenChange={onOpenChange}
      classNames={{
        closeButton: "text-black top-8 right-6 hover:text-primary",
        base: "max-w-[500px]",
      }}
    >
      <ModalContent>
        {(onClose) => (
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
                <span>Lawn Mowing</span>
              </div>
              <div>
                <span className="font-semibold text-secondary-font-color">
                  Date:
                </span>
                <span> Monday, July .... </span>
              </div>
              <div>
                <span className="font-semibold text-secondary-font-color">
                  Total:
                </span>{" "}
                <span className="font-bold"> $65</span>
              </div>
            </ModalBody>
            <ModalFooter className="flex-col">
              {/* // footer automatically is flexed as flex-row, flex-none is ignored, so I told it to flex-col */}
              <p className="mb-3 ml-3 w-full">
                Sign in or create an account to complete your booking
              </p>
              <GoogleSignInbutton />
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
