"use client";

import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { Form, Input } from "@heroui/react";
import StyledAsButton from "@/components/StyledAsButton";
import User from "@/components/icons/User";
import Phone from "@/components/icons/Phone";
import MapPin from "@/components/icons/MapPin";
import useGoogleLogin from "@/lib/hooks/useGoogleLogin";
import { setCookie } from "@/utils/cookies/cookies";
import { setUserInfoCookies } from "@/utils/cookies/userInfoCookies";
import { useAuthContext } from "@/components/context-wrappers/AuthContext";
import { useApiMutation } from "@/lib/api-client";

const usStates = [
  "Alabama",
  "Alaska",
  "Arizona",
  "Arkansas",
  "California",
  "Colorado",
  "Connecticut",
  "Delaware",
  "Florida",
  "Georgia",
  "Hawaii",
  "Idaho",
  "Illinois",
  "Indiana",
  "Iowa",
  "Kansas",
  "Kentucky",
  "Louisiana",
  "Maine",
  "Maryland",
  "Massachusetts",
  "Michigan",
  "Minnesota",
  "Mississippi",
  "Missouri",
  "Montana",
  "Nebraska",
  "Nevada",
  "New Hampshire",
  "New Jersey",
  "New Mexico",
  "New York",
  "North Carolina",
  "North Dakota",
  "Ohio",
  "Oklahoma",
  "Oregon",
  "Pennsylvania",
  "Rhode Island",
  "South Carolina",
  "South Dakota",
  "Tennessee",
  "Texas",
  "Utah",
  "Vermont",
  "Virginia",
  "Washington",
  "West Virginia",
  "Wisconsin",
  "Wyoming",
  // Common territories/districts often included
  "District of Columbia",
  "Guam",
  "Puerto Rico",
  "Virgin Islands",
  "American Samoa",
  "Northern Mariana Islands",
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
  const [profileData, setProfileData] = useState<AuthDetailsType | undefined>();
  const createCustomerMutation = useApiMutation<
    CustomerResponse,
    CustomerPayload
  >("/customers");

  const createAddressMutation = useApiMutation<AddressResponse, AddressPayload>(
    "/addresses",
  );
  const googleLogin = useGoogleLogin();
  const cookieExpirationInDays = 0.0034722;
  const { authContextObject } = useAuthContext();

  useEffect(() => {
    // logic to run after the user signs in with google
    if (!authContextObject.supabaseUserId) return;

    // ############## after login #################

    const createData = async () => {
      const customerData: CustomerPayload = {
        first_name: profileData?.firstName,
        last_name: profileData?.lastName,
        phone_number: profileData?.phoneNumber,
      };

      const addressData: AddressPayload = {
        street_address_1: profileData?.streetAddress1,
        street_address_2: profileData?.streetAddress2,
        city: profileData?.city,
        state: profileData?.state,
        zip: profileData?.zip,
      };

      try {
        const customer = await createCustomerMutation.mutateAsync(customerData);
        const address = await createAddressMutation.mutateAsync({
          ...addressData,
          customer_id: customer.id,
        });
        console.log("Both created:", { customer, address });
      } catch (error) {
        console.error("Error creating customer or address", error);
      }
    };

    createData();
  }, [authContextObject.supabaseUserId, profileData]);

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
  // const router = useRouter();

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
  let buttonLabel;
  if (mutation.isPending) {
    buttonLabel = "Submitting Profile...";
  } else if (mutation.isError) {
    buttonLabel = "Submission Failed. Retry?";
  } else if (mutation.isSuccess) {
    buttonLabel = "Profile Updated!";
  } else {
    buttonLabel = "Sign Up"; // Default case
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
          isDisabled={mutation.isPending}
          onChange={(e) =>
            setProfileData((prev) => ({
              ...prev,
              fullName: e.target.value,
            }))
          }
          value={profileData.firstName}
          placeholder="John"
          startContent={<User size={18} color="#62748e" />}
          isRequired
          name="full_name"
          type="text"
          errorMessage="Please enter a valid name"
          label="Full Name"
        />
        <Input
          isDisabled={mutation.isPending}
          onChange={(e) =>
            setProfileData((prev) => ({
              ...prev,
              fullName: e.target.value,
            }))
          }
          value={profileData.lastName}
          placeholder="Smith"
          startContent={<User size={18} color="#62748e" />}
          isRequired
          name="full_name"
          type="text"
          errorMessage="Please enter a valid name"
          label="Full Name"
        />
        <Input
          isDisabled={mutation.isPending}
          onChange={(e) =>
            setProfileData((prev) => ({
              ...prev,
              phone: e.target.value,
            }))
          }
          value={profileData.phone}
          description="For service updates and provider contact"
          placeholder="xxx-xxx-xxxx"
          startContent={<Phone size={18} color="#62748e" />}
          isRequired
          name="phone_number"
          type="tel"
          errorMessage="Please enter a valid phone number"
          label="Phone Number"
          //   allows only numbers 0-9 with no hyphens. We can expand validation later on
          pattern="[0-9]{10}"
        />
        <Input
          isDisabled={mutation.isPending}
          onChange={(e) =>
            setProfileData((prev) => ({
              ...prev,
              streetAddress: e.target.value,
            }))
          }
          value={profileData.streetAddress}
          placeholder="123 Main Street"
          startContent={<MapPin size={18} color="#62748e" />}
          isRequired
          name="street_address_1"
          type="text"
          errorMessage="Please enter a valid street address"
          label="Service Address"
        />
        <div className="w-full lg:flex lg:gap-2">
          <Input
            isDisabled={mutation.isPending}
            onChange={(e) =>
              setProfileData((prev) => ({
                ...prev,
                city: e.target.value,
              }))
            }
            value={profileData.city}
            placeholder="San Francisco"
            isRequired
            name="city"
            type="text"
            errorMessage="Please enter a valid city"
            label="City"
          />
          <Input
            isDisabled={mutation.isPending}
            onChange={(e) =>
              setProfileData((prev) => ({
                ...prev,
                state: e.target.value,
              }))
            }
            value={profileData.state}
            placeholder="CA"
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
            isDisabled={mutation.isPending}
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
