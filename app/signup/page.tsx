"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Form, Input } from "@heroui/react";
import { useQueryClient } from "@tanstack/react-query";
import StyledAsButton from "@/components/StyledAsButton";
import User from "@/components/icons/User";
import Phone from "@/components/icons/Phone";
import MapPin from "@/components/icons/MapPin";
import useGoogleLogin from "@/lib/hooks/useGoogleLogin";
import { getCookie, removeCookie, setCookie } from "@/utils/cookies/cookies";
import {
  setUserInfoCookies,
  getUserInfoFromCookies,
} from "@/utils/cookies/userInfoCookies";
import { useAuthContext } from "@/components/context-wrappers/AuthContext";
import { useApiMutation } from "@/lib/api-client";
import formatPhoneNumber, {
  getE164ForSupabase,
} from "@/utils/phone/formatPhoneNum";
import { usStates } from "@/data/usStates";
import {
  CustomerPayload,
  AddressPayload,
  CustomerResponse,
  AddressResponse,
} from "../types/createProfileTypes";
import generateButtonAndErrorText from "@/utils/signup/generateButtonAndErrorText";

export default function CompleteProfileModal() {
  const [profileData, setProfileData] = useState<AuthDetailsType>({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    streetAddress1: "",
    streetAddress2: "",
    city: "",
    state: "",
    zip: "",
  });

  const profileRef = useRef<AuthDetailsType | undefined>();
  const router = useRouter();
  const queryClient = useQueryClient();
  const googleLogin = useGoogleLogin();
  const cookieExpirationInDays = 0.0034722;
  const { authContextObject } = useAuthContext();

  // ########## to create a full profile, we need to make 2 documents for the user #############
  // 1. customer
  const createCustomerMutation = useApiMutation<
    CustomerResponse,
    CustomerPayload
  >("/customers/", "POST", true);
  //  2. address
  const createAddressMutation = useApiMutation<AddressResponse, AddressPayload>(
    "/addresses/",
    "POST",
    true,
  );

  // ############################# Phone input logic ##################################

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfileData((prev) => ({
      ...prev,
      phoneNumber: formatPhoneNumber(profileData.phoneNumber || ""),
    }));
  };

  useEffect(() => {
    // checking if user came back from logging in with google
    // On mount: use cookies to restore data to the profileData state and profileRef objects
    // which was lost when google redirected them to sign in
    const cookieData = getUserInfoFromCookies();
    if (cookieData) {
      profileRef.current = cookieData;
      setProfileData(cookieData);
    }
  }, []);

  // ############# main logic to create a profile ####################

  const createProfile = async () => {
    const ref = profileRef.current;

    if (!ref) return;

    const phoneE164 = getE164ForSupabase(ref.phoneNumber || "");
    if (!phoneE164) {
      console.error("Invalid phone number");
      return;
    }

    const customerData: CustomerPayload = {
      first_name: ref.firstName,
      last_name: ref.lastName,
      phone_number: phoneE164,
    };

    const addressData: AddressPayload = {
      street_address_1: ref.streetAddress1,
      street_address_2: ref.streetAddress2 || "",
      city: ref.city,
      state: ref.state,
      zip: ref.zip,
    };

    try {
      const createdCustomerDoc =
        await createCustomerMutation.mutateAsync(customerData);

      const createdAddressDoc = await createAddressMutation.mutateAsync({
        ...addressData,
        customer_id: createdCustomerDoc.id,
      });
      if (createdAddressDoc.id) {
        // if they have an address id then we know they made it to the end of the process successfully
        queryClient.getMutationCache().clear();
        removeCookie("booking_redirect_path");
        // clear mutations to prevent memory leaks
        router.replace("/");
      }

      console.log("Both created:", { createdCustomerDoc, createdAddressDoc });
    } catch (error) {
      console.error("Error creating customer or address", error);
    }
  };

  // #############  user returned from google sign in redirect ##############
  //  attempt to create a customer and address document for them to complete their profile

  useEffect(() => {
    // if there is not a supabaseUserId then the users not signed in
    if (!authContextObject.supabaseUserId || !profileRef.current) return;

    const userJustSignedIn = getCookie("just_signed_in");

    if (!userJustSignedIn) {
      //  we only want this check to run once, when they just signed in
      return;
    }
    removeCookie("just_signed_in");

    createProfile();
  }, [authContextObject.supabaseUserId]);

  const handleSubmit = () => {
    if (!profileData) {
      return;
    }
    //  ################# cookies ############################
    // so our data survives the login redirect
    setCookie(
      "booking_redirect_path",
      window.location.pathname,
      cookieExpirationInDays,
      "/",
    );
    setUserInfoCookies(profileData);

    // login
    if (!authContextObject.supabaseUserId) {
      setCookie("just_signed_in", "true", 0.0034722);
      googleLogin();
    }
    // let user manually retry if they logged in but some of the data was invalid

    createProfile();
  };

  // ############ submit button labels and error text ###############

  const { isPending, buttonLabel, detailedError } = generateButtonAndErrorText({
    customerMutation: createCustomerMutation,
    addressMutation: createAddressMutation,
  });

  return (
    <section className="mx-auto w-[90%] max-w-5xl">
      <h1 className="text-center text-2xl font-semibold mb-6">
        Create an account{" "}
      </h1>
      <hr />

      <Form
        className="m-auto w-4/5"
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        {/* ################### First Name  ################ */}

        <div className="sm:flex justify-between w-full gap-2">
          <Input
            isDisabled={isPending}
            onChange={(e) =>
              setProfileData((prev) => ({
                ...prev,
                firstName: e.target.value,
              }))
            }
            value={profileData.firstName}
            placeholder="John"
            startContent={<User size={18} color="#62748e" />}
            isRequired
            name="first_name"
            type="text"
            errorMessage="Please enter a valid name"
            label="First Name"
          />

          {/* ################### Last Name  ################ */}

          <Input
            isDisabled={isPending}
            onChange={(e) =>
              setProfileData((prev) => ({
                ...prev,
                lastName: e.target.value,
              }))
            }
            value={profileData.lastName}
            placeholder="Smith"
            startContent={<User size={18} color="#62748e" />}
            isRequired
            name="last_name"
            type="text"
            errorMessage="Please enter a valid name"
            label="Last Name"
          />
        </div>

        {/* ################### Phone ################ */}
        <div className="sm:flex justify-between w-full gap-2">
          <Input
            isDisabled={isPending}
            value={profileData.phoneNumber}
            onChange={handlePhoneChange}
            description="For service updates and provider contact"
            placeholder="xxx-xxx-xxxx"
            startContent={<Phone size={18} color="#62748e" />}
            isRequired
            name="phone_number"
            type="tel"
            errorMessage="Please enter a valid phone number"
            label="Phone Number"
            pattern="\d{3}-\d{3}-\d{4}"
          />

          {/* ################### Address 1 ################ */}

          <Input
            isDisabled={isPending}
            onChange={(e) =>
              setProfileData((prev) => ({
                ...prev,
                streetAddress1: e.target.value,
              }))
            }
            value={profileData.streetAddress1}
            placeholder="123 Main Street"
            startContent={<MapPin size={18} color="#62748e" />}
            isRequired
            name="street_address_1"
            type="text"
            errorMessage="Please enter a valid street address"
            label="Service Address"
          />
        </div>
        {/* ################### Address 2  ################ */}
        <div className="sm:flex justify-between w-full gap-2">
          <Input
            isDisabled={isPending}
            onChange={(e) =>
              setProfileData((prev) => ({
                ...prev,
                streetAddress1: e.target.value,
              }))
            }
            value={profileData.streetAddress2}
            placeholder="Apt 4b"
            startContent={<MapPin size={18} color="#62748e" />}
            name="street_address_2"
            type="text"
            errorMessage="Please enter a valid street address"
            label="Service Address 2"
          />

          {/* ################### City ################ */}

          <Input
            isDisabled={isPending}
            onChange={(e) =>
              setProfileData((prev) => ({
                ...prev,
                city: e.target.value,
              }))
            }
            value={profileData.city?.toLowerCase()}
            placeholder="San Francisco"
            isRequired
            name="city"
            type="text"
            errorMessage="Please enter a valid city"
            label="City"
          />
        </div>
        <div className="sm:flex justify-between w-full gap-2">
          {/* ################### State  ################ */}

          <Input
            isDisabled={isPending}
            onChange={(e) =>
              setProfileData((prev) => ({
                ...prev,
                state: e.target.value,
              }))
            }
            value={profileData.state?.toLowerCase()}
            placeholder="California"
            isRequired
            name="state"
            type="text"
            errorMessage="Please enter a valid state"
            label="State"
            list="stateList"
            id="state"
          />
          <datalist id="stateList">
            {usStates.map((state) => (
              <option key={state} value={state}>
                {state}
              </option>
            ))}
          </datalist>

          {/* ################### Zip ################ */}

          <Input
            isDisabled={isPending}
            onChange={(e) =>
              setProfileData((prev) => ({
                ...prev,
                zip: e.target.value,
              }))
            }
            value={profileData.zip}
            placeholder="94102"
            isRequired
            name="zip"
            type="number"
            errorMessage="Please enter a valid zip code"
            label="Zip"
          />
        </div>

        <p className="m-auto text-center text-xs text-light-font-color">
          This will be your default address for future bookings
        </p>
        <StyledAsButton
          className="m-auto w-full rounded-md"
          type="submit"
          label={buttonLabel}
        />
        {detailedError && (
          <p className="m-auto text-center text-xs text-red-500">
            {" "}
            <span className="font-semibold"> Error details: </span>
            {detailedError}
          </p>
        )}

        <p className="m-auto text-center text-xs text-light-font-color">
          Sign in with google to complete registration
        </p>
      </Form>
    </section>
  );
}
