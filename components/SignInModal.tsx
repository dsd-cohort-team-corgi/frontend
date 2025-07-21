"use client";

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/react";
import GoogleSignInbutton from "./googleSignInbutton";

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
  function googleSignIn() {
    console.log("hi from google");
  }
  return (
    <Modal isOpen={isOpen} placement="top-center" onOpenChange={onOpenChange}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              Sign in to continue{" "}
            </ModalHeader>
            <ModalBody>
              <h2> Complete Your Booking</h2>
              <p>
                <span>Service:</span> Lawn Mowing
              </p>
              <p>
                <span>Date:</span> Monday, July ....{" "}
              </p>
              <p>
                <span>Total:</span> $65
              </p>
            </ModalBody>
            <ModalFooter>
              <p> Sign in or create an account to complete your booking </p>
              <GoogleSignInbutton />
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
