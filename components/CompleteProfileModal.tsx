"use client";

import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import {
  Form,
  Input,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  Button,
} from "@heroui/react";
import StyledAsButton from "@/components/StyledAsButton";
import User from "./icons/User";
import Phone from "./icons/Phone";
import MapPin from "./icons/MapPin";

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

interface ProfileData {
  fullName: string;
  phone: string;
  streetAddress: string;
  city: string;
  state: string;
  zip: string;
}

interface CompleteProfileModalProps {
  isOpen: boolean;
  onOpen: () => void;
  onOpenChange: (isOpen: boolean) => void;
}

function CompleteProfileModal({
  isOpen,
  onOpen,
  onOpenChange,
}: CompleteProfileModalProps) {
  const [profileData, setProfileData] = useState<ProfileData>({
    fullName: "",
    phone: "",
    streetAddress: "",
    city: "",
    state: "",
    zip: "",
  });
  const mutation = useMutation({
    mutationFn: async () => {
      // Simulate a 500ms network delay
      // temp disabling this rule since this is mock flow
      /* eslint-disable no-promise-executor-return */
      await new Promise((resolve) => setTimeout(resolve, 500));
      const response = await fetch("http://localhost:8000/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer YOUR_TOKEN_HERE",
        },
        body: JSON.stringify(profileData),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message);
      }
      return response.json();
    },
  });
  const handleSubmit = () => {
    console.log(profileData);
    mutation.mutate();
  };
  useEffect(() => {
    if (mutation.isSuccess) {
      onOpenChange(false);
    }
  }, [mutation.isSuccess, onOpenChange]);

  // submit button label condtions
  let buttonLabel;
  if (mutation.isPending) {
    buttonLabel = "Submitting Profile...";
  } else if (mutation.isError) {
    buttonLabel = "Submission Failed. Retry?";
  } else if (mutation.isSuccess) {
    buttonLabel = "Profile Updated!";
  } else {
    buttonLabel = "Complete Profile"; // Default case
  }

  return (
    <>
      <Button onPress={onOpen}>Open</Button>
      <Modal
        isOpen={isOpen}
        placement="top-center"
        onOpenChange={onOpenChange}
        classNames={{
          closeButton: "text-black top-4 right-2 hover:text-primary",
          // the X defaults to the top right corner, moved it with top and right
          base: "max-w-[500px] w-4/5",
          // default version was too small and had a max-w-m
        }}
      >
        <ModalContent>
          {() => (
            <>
              <ModalHeader>Complete your profile</ModalHeader>
              <hr />
              <ModalBody>
                <p className="text-center">
                  Just a few more details so providers can reach you and
                  complete your service
                </p>
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
                    value={profileData.fullName}
                    placeholder="John Smith"
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
                  <StyledAsButton
                    className="m-auto w-full rounded-md"
                    type="submit"
                    label={buttonLabel}
                  />
                  <p className="m-auto text-center text-xs text-[#62748e]">
                    This will be your default address for future bookings
                  </p>
                </Form>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
export default CompleteProfileModal;
