"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { Card, CardBody } from "@heroui/react";
import ConfettiExplosion from "react-confetti-explosion";
import { useAuthContext } from "@/components/context-wrappers/AuthContext";
import Check from "@/components/icons/Check";
import { useApiQuery } from "@/lib/api-client";
import LoadingSkeleton from "@/components/LoadingSkeleton";
import formatDateTimeString from "@/utils/time/formatDateTimeString";
import Calendar from "@/components/icons/Calendar";
import StyledAsButton from "@/components/StyledAsButton";
import ArrowRight from "@/components/icons/ArrowRight";
import Phone from "@/components/icons/Phone";
import MapPin from "@/components/icons/MapPin";
import { useBooking } from "@/components/context-wrappers/BookingContext";
import {
  deleteBookingCookies,
  getBookingFromCookies,
} from "@/utils/cookies/bookingCookies";
import bookingsMatchCookies from "@/utils/cookies/bookingsMatchCookiesCheck";

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
  const [showConfetti, setShowConfetti] = useState(false);
  const pathName = usePathname();
  const bookingId = pathName.split("/")[2];
  const router = useRouter();
  const { booking, resetBooking } = useBooking();
  const cookiesDeletedRef = useRef(false);

  useEffect(() => {
    if (cookiesDeletedRef.current) return; // ✅ Skip if already deleted

    const bookingFromCookies = getBookingFromCookies();

    if (!bookingFromCookies || Object.keys(bookingFromCookies).length === 0) {
      return;
    }

    if (bookingsMatchCookies(bookingFromCookies, booking)) {
      deleteBookingCookies();
      cookiesDeletedRef.current = true;
    }

    resetBooking();
    // if they have reached this page, their booking was successful. Empty the booking context
    // If they backtrack to the providers page to check out another service, the useEffect will fire and refill the booking context with the basic provider information
  }, [booking]);

  useEffect(() => {
    // Check if auth context has been initialized
    const isAuthInitialized =
      Object.keys(authContextObject).length > 0 ||
      authContextObject.supabaseUserId;
    if (isAuthInitialized !== undefined) {
      setAuthLoading(false);
    }
  }, [authContextObject]);

  useEffect(() => {
    // Trigger confetti after a short delay for better effect
    const timer = setTimeout(() => {
      setShowConfetti(true);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const {
    data: bookingData,
    error: bookingError,
    isLoading: bookingIsLoading,
  } = useApiQuery<BookingQueryProps>(
    ["bookings", "bookingId"],
    `/bookings/${bookingId}`,
  );
  console.log(bookingData);
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
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="m-auto w-4/5 max-w-[600px]">
          <Card className="border border-gray-200 bg-white shadow-none">
            <CardBody className="p-8">
              <LoadingSkeleton />
            </CardBody>
          </Card>
        </div>
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
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="m-auto w-4/5 max-w-[600px]">
        {/* Confetti Effect */}
        {showConfetti && (
          <div className="fixed inset-0 pointer-events-none z-50">
            <ConfettiExplosion
              force={0.8}
              duration={6000}
              particleCount={200}
              width={1600}
              colors={["#10B981", "#3B82F6", "#8B5CF6", "#F59E0B", "#EF4444"]}
            />
          </div>
        )}

        {/* Main Card */}
        <Card className="border border-gray-200 bg-white shadow-none">
          <CardBody className="p-8">
            {/* Header */}
            <header className="mb-8 flex flex-col items-center gap-4">
              <div className="relative">
                <div className="bg-green-500 flex h-16 w-16 flex-row items-center justify-center rounded-full text-center">
                  <Check color="green" size={48} strokeWidth={4} />
                </div>
              </div>
              <div className="text-center">
                <h1 className="text-2xl font-bold text-gray-900 lg:text-3xl">
                  Booking Confirmed
                </h1>
                <p className="text-gray-600 mt-2 text-sm">
                  Your service has been successfully scheduled
                </p>
                <p className="text-xs text-gray-500 mt-1 font-mono">
                  ID: {bookingData?.id}
                </p>
              </div>
            </header>

            {/* Appointment Card */}
            <Card className="mb-6 bg-blue-50/30 border border-blue-100/50 shadow-none">
              <CardBody className="p-5 md:flex md:flex-row items-center gap-4">
                <div
                  className="flex-shrink-0 w-9 h-9 bg-blue-500/80 p-2 rounded-full
                    flex justify-center items-center"
                >
                  <Calendar color="white" size={18} />
                </div>

                <div className="flex flex-col">
                  <h3 className="font-medium text-gray-700 text-sm">
                    Appointment
                  </h3>

                  {serviceDateAndTime ? (
                    <>
                      <p className="text-lg font-semibold text-gray-900">
                        {serviceDateAndTime.datePart}
                      </p>
                      <p className="text-sm text-gray-600">
                        {serviceDateAndTime.timePart}
                      </p>
                    </>
                  ) : (
                    <p className="text-red-500">
                      There was an error getting the booking date
                    </p>
                  )}
                </div>
              </CardBody>
            </Card>

            {/* Service and Address Card */}
            <Card className="mb-6 bg-purple-50/30 border border-purple-100/50 shadow-none">
              <CardBody className="p-5">
                <div className="flex flex-col md:flex-row md:items-start gap-4">
                  <div className="bg-purple-500/80 p-2 h-9 w-9 md:h-auto md:w-auto m-auto flex justify-center items-center rounded-full mt-1">
                    <MapPin color="white" size={18} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-700 text-sm mb-2">
                      Service & Location
                    </h3>
                    <p className="text-lg font-semibold text-gray-900 mb-2">
                      {service ? service.service_title : "Service not found"}
                    </p>
                    {authContextObject.streetAddress1 && (
                      <div className="bg-white/80 p-3 rounded border border-gray-200/50">
                        <p className="text-sm text-gray-700">
                          {`${authContextObject.streetAddress1}`}
                          {authContextObject.streetAddress2 &&
                            `, ${authContextObject.streetAddress2}`}
                          {`, ${authContextObject.city}, ${authContextObject.state} ${authContextObject.zip}`}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </CardBody>
            </Card>

            {/* Provider Card */}
            <Card className="mb-6 bg-emerald-50/30 border border-emerald-100/50 shadow-none">
              <CardBody className="p-5">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                  <div className="flex flex-col md:flex-row items-center gap-4">
                    <div className="bg-emerald-500/80 p-2 rounded-full">
                      <Phone color="white" size={18} />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-700 text-sm">
                        Provider
                      </h3>
                      <p className="text-lg font-semibold text-gray-900">
                        {providerData?.company_name || "Company Name Not Found"}
                      </p>
                      <p className="text-sm text-gray-600">
                        {providerData?.phone_number}
                      </p>
                    </div>
                  </div>
                  <div className="text-center md:text-right">
                    <p className="text-xs text-gray-500">Total Price</p>
                    <p className="text-xl font-bold text-gray-900">
                      ${service?.pricing}
                    </p>
                  </div>
                </div>
              </CardBody>
            </Card>

            {/* Action Buttons */}
            <div className="space-y-3 mb-8">
              <Link href={`/api/generate-ics/${bookingId}`}>
                <StyledAsButton
                  className="w-full bg-green text-white font-medium py-3 text-base hover:bg-green-600 transition-colors duration-200"
                  label="Add To Calendar"
                  startContent={<Calendar size={18} />}
                />
              </Link>

              <StyledAsButton
                endContent={<ArrowRight size={16} />}
                label="View My Bookings"
                className="w-full bg-gray-100/80 text-gray-700 font-medium py-3 text-base border border-gray-200/60 hover:bg-gray-200/80 transition-colors duration-200"
                onPress={() => router.push("/")}
              />
            </div>

            {/* Next Steps Info */}
            <div className="bg-blue-50/40 rounded-lg p-5 border border-blue-200/50">
              <div className="flex items-center gap-3 mb-2">
                <div className="bg-blue-500/70 w-2 h-2 rounded-full" />
                <h3 className="font-medium text-blue-800/80 text-base">
                  What&apos;s next?
                </h3>
              </div>
              <p className="text-blue-700/80 text-sm leading-relaxed">
                You&apos;ll receive real-time updates when your provider is on
                the way. Sit back and relax - we&apos;ve got everything covered!
              </p>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
