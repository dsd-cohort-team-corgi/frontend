"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardBody } from "@heroui/react";
import { useAuthContext } from "@/components/context-wrappers/AuthContext";
import Check from "@/components/icons/Check";
import { useApiQuery } from "@/lib/api-client";
import LoadingSkeleton from "@/components/LoadingSkeleton";
import { formatDateTimeString } from "@/utils/formatDateTimeString";
import Calendar from "@/components/icons/Calendar";
import StyledAsButton from "@/components/StyledAsButton";
import ArrowRight from "@/components/icons/ArrowRight";
import Phone from "@/components/icons/Phone";
import MapPin from "@/components/icons/MapPin";
import { useBooking } from "@/components/context-wrappers/BookingContext";

interface BookingQueryProps {
  special_instructions: string;
  service_notes: string;
  start_time: string;
  id: string;
  customer_id: string;
  provider_id: string;
  service_id: string;
  created_at: string;
  updated_at: string;
}

interface Service {
  service_title: string;
  service_description: string;
  pricing: number;
  duration: number;
  category: string;
  services_subcategories: string;
  id: string;
}

interface Review {
  rating: number;
  description: string;
  created_at: string;
  customer_name: string;
}

interface ProviderProps {
  id: string;
  phone_number: string;
  company_name: string;
  services: Service[];
  reviews: Review[];
  review_count: number;
  average_rating: number;
}

export default function Page() {
  const { authContextObject } = useAuthContext();
  const [authLoading, setAuthLoading] = useState(true);
  const pathName = usePathname();
  const bookingId = pathName.split("/")[2];
  const router = useRouter();
  const { resetBooking } = useBooking();

  useEffect(() => resetBooking(), []);
  // if they have reached this page, their booking was successful. Empty the booking context
  // If they backtrack to the providers page to check out another service, the useEffect will fire and refill the booking context with the basic provider information

  useEffect(() => {
    // Check if auth context has been initialized
    const isAuthInitialized =
      Object.keys(authContextObject).length > 0 ||
      authContextObject.supabaseUserId;
    if (isAuthInitialized !== undefined) {
      setAuthLoading(false);
    }
  }, [authContextObject]);

  const {
    data: bookingData,
    error: bookingError,
    isLoading: bookingIsLoading,
  } = useApiQuery<BookingQueryProps>(
    ["bookings", "bookingId"],
    `/bookings/${bookingId}`,
  );

  const {
    data: providerData,
    error: providerError,
    isLoading: providerIsLoading,
  } = useApiQuery<ProviderProps>(
    ["providers", "providerId"],
    `/providers/${bookingData?.provider_id}`,
  );

  const serviceId = bookingData?.service_id;
  const service = providerData?.services.find((s) => s.id === serviceId);
  // due to waiting for info from network we have to wrap the assignment of this variable in an if statement or we get errors on page
  /* eslint-disable no-undef-init */
  let serviceDateAndTime: { datePart: string; timePart: string } | undefined =
    undefined;
  if (bookingData) {
    serviceDateAndTime = formatDateTimeString(bookingData?.start_time ?? "");
  }

  if (bookingIsLoading || providerIsLoading || authLoading) {
    return (
      <div className="m-auto w-4/5 max-w-[500px]">
        <LoadingSkeleton />
      </div>
    );
  }
  if (!authContextObject.supabaseUserId) {
    alert("You must be signed in");
    router.push("/");
  }
  if (bookingError || providerError) {
    let errorMessage;
    if (providerError) {
      errorMessage = providerError.message;
    } else {
      errorMessage = bookingError?.message;
    }
    return <h1>Something went wrong: {errorMessage}</h1>;
  }

  /* 
    some booking rows do not have all info in the db. 
    e.g. some providers do not have company name or customer's have addresses attatched
    fallbacks are put in place if there is no relevent data for each booking
  */

  return (
    <Card className="m-auto w-4/5 max-w-[500px]">
      <CardBody className="m-auto w-[90%] text-center">
        {/* Header */}
        <header className="mb-4 flex flex-col items-center gap-2">
          <div className="flex h-10 w-10 flex-row items-center justify-center rounded-full bg-green-200 text-center">
            <Check color="#187a24" />
          </div>
          <h1 className="text-xl font-black lg:text-2xl">Booking Confirmed</h1>
          <p className="xs text-light-font-color lg:text-sm">
            ID: {bookingData?.id}
          </p>
        </header>
        {/* Appointment Card */}
        <Card className="mb-4 bg-[#ededed]">
          <CardBody className="flex flex-row items-center gap-4">
            <Calendar color="#2563eb" size={18} />
            <div className="flex flex-col">
              {serviceDateAndTime ? (
                <>
                  <p>{serviceDateAndTime.datePart}</p>
                  <p className="sm text-light-font-color">
                    {serviceDateAndTime.timePart}
                  </p>
                </>
              ) : (
                <p>There was an error getting the booking date</p>
              )}
            </div>
          </CardBody>
        </Card>
        {/* Service and Address Card */}
        <Card className="mb-4 bg-[#ededed]">
          <CardBody className="flex flex-row items-center gap-4">
            <MapPin color="#2563eb" size={20} />
            <div>
              <p>{service ? service.service_title : "Service not found"}</p>
            </div>
          </CardBody>
        </Card>
        {/* Provider Card */}
        <Card className="mb-4 bg-[#ededed]">
          <CardBody className="flex flex-row items-center justify-between gap-4">
            <div className="flex flex-row items-center justify-around gap-4">
              <Phone color="#2563eb" size={20} />
              <div>
                <p>{providerData?.company_name || "Company Name Not Found"}</p>
                <p className="sm text-light-font-color">
                  {providerData?.phone_number}
                </p>
              </div>
            </div>
            <div>
              <p className="font-black">${service?.pricing}</p>
            </div>
          </CardBody>
        </Card>
        <Link className="mb-2" href={`/api/generate-ics/${bookingId}`}>
          <StyledAsButton
            className="w-full"
            label="Add To Calandar"
            startContent={<Calendar size={18} />}
          />
        </Link>
        <StyledAsButton
          endContent={<ArrowRight size={16} />}
          label="View My Bookings"
          className="mb-2 bg-[#ededed] text-black"
          onPress={() => router.push("/")}
        />
        <p className="mb-8 rounded-lg bg-blue-100 p-4">
          {/* have to use &apos; in place of an apostrophe for linting rules */}
          <span className="text-primary">What&apos;s next? </span>
          <span>
            You&apos;ll get updates when your provider is on the way.{" "}
          </span>
        </p>
      </CardBody>
    </Card>
  );
}
