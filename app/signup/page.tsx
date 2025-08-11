"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Form, Input } from "@heroui/react";
import StyledAsButton from "@/components/StyledAsButton";
import User from "@/components/icons/User";
import Phone from "@/components/icons/Phone";
import MapPin from "@/components/icons/MapPin";
import useGoogleLogin from "@/lib/hooks/useGoogleLogin";
import { setCookie } from "@/utils/cookies/cookies";
import {
  setUserInfoCookies,
  getUserInfoFromCookies,
} from "@/utils/cookies/userInfoCookies";
import { useAuthContext } from "@/components/context-wrappers/AuthContext";
import { useApiMutation } from "@/lib/api-client";
import formatPhoneNumber from "@/utils/phone/formatPhoneNum";
import filterPhoneInput from "@/utils/phone/filterPhoneInput";
import { useQueryClient } from "@tanstack/react-query";

const usStates = [
  "alabama",
  "alaska",
  "arizona",
  "arkansas",
  "california",
  "colorado",
  "connecticut",
  "delaware",
  "florida",
  "georgia",
  "hawaii",
  "idaho",
  "illinois",
  "indiana",
  "iowa",
  "kansas",
  "kentucky",
  "louisiana",
  "maine",
  "maryland",
  "massachusetts",
  "michigan",
  "minnesota",
  "mississippi",
  "missouri",
  "montana",
  "nebraska",
  "nevada",
  "new hampshire",
  "new jersey",
  "new mexico",
  "new york",
  "north carolina",
  "north dakota",
  "ohio",
  "oklahoma",
  "oregon",
  "pennsylvania",
  "rhode island",
  "south carolina",
  "south dakota",
  "tennessee",
  "texas",
  "utah",
  "vermont",
  "virginia",
  "washington",
  "west virginia",
  "wisconsin",
  "wyoming",
  // Common territories/districts often included
  "district of columbia",
  "guam",
  "puerto rico",
  "virgin islands",
  "american samoa",
  "northern mariana islands",
];

// interface ProfileData {
//   firstName: string;
//   lastName: string;
//   phone: string;
//   streetAddress: string;
//   city: string;
//   state: string;
//   zip: string;
// }

type CustomerPayload = {
  first_name?: string;
  last_name?: string;
  phone_number?: string;
};

type AddressPayload = {
  street_address_1?: string;
  street_address_2?: string;
  city?: string;
  state?: string;
  zip?: string;
  customer_id?: string; // added later
};

type AddressResponse = {
  street_address_1: string;
  street_address_2: string;
  city: string;
  state: string;
  zip: string;
  latitude: number;
  longitude: number;
  id: string; // UUID format
  customer_id: string; // UUID format
  created_at: string; // ISO date string
  updated_at: string; // ISO date string
};

type CustomerResponse = {
  first_name: string;
  last_name: string;
  phone_number: string;
  id: string; // UUID format
  supabase_user_id: string; // UUID format
  created_at: string; // ISO date string
  updated_at: string; // ISO date string
};

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
  const createCustomerMutation = useApiMutation<
    CustomerResponse,
    CustomerPayload
  >("/customers/", "POST", true);

  const createAddressMutation = useApiMutation<AddressResponse, AddressPayload>(
    "/addresses/",
    "POST",
    true,
  );

  const profileRef = useRef<AuthDetailsType | undefined>();
  const router = useRouter();
  const queryClient = useQueryClient();

  const googleLogin = useGoogleLogin();
  const cookieExpirationInDays = 0.0034722;
  const { authContextObject } = useAuthContext();

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const filtered = filterPhoneInput(e.target.value);
    setProfileData((prev) => ({
      ...prev,
      phoneNumber: filtered,
    }));
  };

  const handlePhoneBlur = () => {
    setProfileData((prev) => ({
      ...prev,
      phoneNumber: formatPhoneNumber(prev.phoneNumber ?? ""),
    }));
  };
  // ?? = if phoneNumber is undefined or null, use empty string instead

  // On mount: read cookies into profileRef
  useEffect(() => {
    const cookieData = getUserInfoFromCookies();
    if (cookieData) {
      profileRef.current = cookieData;
      setProfileData(cookieData);
    }
  }, []);

  useEffect(() => {
    // logic to run after the user signs in with google
    if (!authContextObject.supabaseUserId || !profileRef.current) return;

    const ref = profileRef.current;

    const createData = async () => {
      const customerData: CustomerPayload = {
        first_name: ref.firstName,
        last_name: ref.lastName,
        phone_number: `+1-${ref.phoneNumber}`,
      };

      const addressData: AddressPayload = {
        street_address_1: ref.streetAddress1,
        street_address_2: ref.streetAddress2 || "",
        city: ref.city,
        state: ref.state,
        zip: ref.zip,
      };

      try {
        const customer = await createCustomerMutation.mutateAsync(customerData);

        const address = await createAddressMutation.mutateAsync({
          ...addressData,
          customer_id: customer.id,
        });
        if (address.id) {
          queryClient.getMutationCache().clear();
          // clear mutations to prevent memory leaks
          router.replace("/");
        }

        console.log("Both created:", { customer, address });
      } catch (error) {
        console.error("Error creating customer or address", error);
      }
    };

    createData();
  }, [authContextObject.supabaseUserId]);

  // const mutation = useMutation({
  //   mutationFn: async () => {
  //     // Simulate a 500ms network delay
  //     // temp disabling this rule since this is mock flow
  //     /* eslint-disable no-promise-executor-return */
  //     await new Promise((resolve) => setTimeout(resolve, 500));
  //     const response = await fetch("http://localhost:8000/", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //         Authorization: "Bearer YOUR_TOKEN_HERE",
  //       },
  //       body: JSON.stringify(profileData),
  //     });
  //     if (!response.ok) {
  //       const errorData = await response.json();
  //       console.error(errorData);
  //     }
  //     return response.json();
  //   },
  // });

  const handleSubmit = () => {
    if (!profileData) {
      return;
    }
    //  ################# cookies ############################
    setCookie(
      "booking_redirect_path",
      window.location.pathname,
      cookieExpirationInDays,
      "/",
    );
    setUserInfoCookies(profileData);

    // ############# login ##########################
    if (!authContextObject.supabaseUserId) {
      googleLogin();
    }
  };

  // submit button label condtions
  console.log(createCustomerMutation);

  const isPending =
    createCustomerMutation.isPending || createAddressMutation.isPending;
  const isError =
    createCustomerMutation.isError || createAddressMutation.isError;
  const isSuccess =
    createCustomerMutation.isSuccess && createAddressMutation.isSuccess;

  let buttonLabel;
  if (isPending) {
    buttonLabel = "Submitting Profile...";
  } else if (isError) {
    // typescript isn't sure about details, because it doesn't exist on a normal object, but it does on the one we get back from the server
    /* eslint-disable @typescript-eslint/no-explicit-any */
    buttonLabel = `Submission Failed. Retry?  ${(createCustomerMutation?.failureReason as any)?.detail || (createAddressMutation?.failureReason as any)?.detail || ""}`;
  } else if (isSuccess) {
    buttonLabel = "Profile Created!";
  } else {
    buttonLabel = "Sign Up";
  }
  return (
    <section>
      <h1 className="text-center">Create an account </h1>
      <hr />

      <Form
        className="m-auto w-4/5"
        onSubmit={(e) => {
          e.preventDefault();
          console.log("asdf");
          handleSubmit();
        }}
      >
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

        <Input
          isDisabled={isPending}
          value={profileData.phoneNumber}
          onChange={handlePhoneChange}
          onBlur={handlePhoneBlur}
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
        <div className="w-full lg:flex lg:gap-2">
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
        <p className="m-auto text-center text-xs text-[#62748e]">
          This will be your default address for future bookings
        </p>
        <StyledAsButton
          className="m-auto w-full rounded-md"
          type="submit"
          label={buttonLabel}
        />
        <p className="m-auto text-center text-xs text-[#62748e]">
          Sign in with google to complete registration
        </p>
      </Form>
    </section>
  );
}
