"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Card as UpcomingServicesCard,
  CardBody,
  CardHeader,
  addToast,
} from "@heroui/react";
import Card from "@/components/CardWithImage";
import Container from "@/components/Container";
import HomePageHeroImage from "../public/HomePageHeroImage.png";
import StyledAsButton from "@/components/StyledAsButton";
import listOfServices from "@/data/services";
import { useAuthContext } from "@/components/context-wrappers/AuthContext";
import { useApiQuery } from "@/lib/api-client";
import UpcomingService from "@/components/UpcomingService";
import LeaveReview from "@/components/LeaveReview";
import Truck from "@/components/icons/Truck";
import MessageSquare from "@/components/icons/MessageSquare";

interface UserSession {
  id: string;
  email: string;
  displayName?: string;
  firstName?: string;
}
export interface BookingItem {
  provider_first_name: string;
  provider_last_name: string;
  provider_company_name: string;
  status: "confirmed" | "pending" | "cancelled" | "completed";
  start_time: string;
  service_title: string;
  id: string;
  provider_id: string;
}

export interface BookingsData {
  upcoming_bookings: BookingItem[];
  completed_needs_review: BookingItem[];
}

interface UserData {
  data: {
    id: string;
  };
  // Add other user fields as needed
}

function AuthenticatedHero({ userSession }: { userSession: UserSession }) {
  const [bookingStatuses, setBookingStatuses] = useState<
    BookingItem[] | undefined
  >([]);
  const [showAllServices, setShowAllServices] = useState(false);

  const {
    data: userData,
    isLoading: userLoading,
    error: userError,
  } = useApiQuery<UserData>(["users", "me"], "/users/me");

  const customerId = userData?.data?.id;

  const { data, dataUpdatedAt, error, isLoading } = useApiQuery<BookingsData>(
    ["customers", "customerId", "dashboard"],
    `/customers/${customerId}/dashboard`,
    {
      refetchInterval: 1000,
      refetchIntervalInBackGround: false,
      skip: !customerId,
    },
  );

  // sets booking statuses to initial data for comparisons
  // loops through incoming data and booking statuses and checks for any changes
  // if there is a change toast fires and booking statues is updated for new comparison point
  useEffect(() => {
    if (bookingStatuses?.length === 0 && data?.upcoming_bookings) {
      setBookingStatuses(data?.upcoming_bookings);
    }
    if (bookingStatuses && bookingStatuses?.length > 0) {
      data?.upcoming_bookings.forEach(
        ({ provider_company_name, status }, idx) => {
          if (bookingStatuses && bookingStatuses[idx].status !== status) {
            addToast({
              title: `${provider_company_name} is now ${status} to your location`,
              icon: <Truck color="#fff" />,
            });
          }
        },
      );
      setBookingStatuses(data?.upcoming_bookings);
    }
  }, [dataUpdatedAt, bookingStatuses, data?.upcoming_bookings]);

  if (userLoading) {
    return (
      <Container>
        <div className="mb-8 text-center md:text-left">
          <div className="mb-6 relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl opacity-60 -z-10 animate-pulse" />
            <div className="py-4 rounded-2xl">
              <div className="mb-3">
                <div className="h-8 bg-gray-300 rounded-lg animate-pulse mb-2 md:h-10 lg:h-10" />
                <div className="h-6 bg-gray-300 rounded-lg animate-pulse w-3/4 md:h-8" />
              </div>
              <div className="h-5 bg-gray-300 rounded-lg animate-pulse w-2/3" />
            </div>
          </div>
        </div>
      </Container>
    );
  }

  if (userError) {
    return (
      <Container>
        <div className="mb-8 text-center md:text-left">
          <div className="mb-6 relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-red-50 to-red-100 rounded-2xl opacity-60 -z-10" />
            <div className="py-4 rounded-2xl">
              <div className="mb-3">
                <h1 className="text-2xl font-bold text-red-800 md:text-3xl leading-tight">
                  ⚠️ Authentication Error
                </h1>
                <p className="text-lg text-red-600 md:text-xl mt-2">
                  {userError.message || "Unable to load user information"}
                </p>
              </div>
              <p className="text-base text-red-500">
                Please try refreshing the page or contact support if the problem
                persists.
              </p>
            </div>
          </div>
        </div>
      </Container>
    );
  }

  if (isLoading) {
    return (
      <Container>
        <div className="mb-8 text-center md:text-left">
          <div className="mb-6 relative group">
            {/* Loading skeleton background */}
            <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl opacity-60 -z-10 animate-pulse" />
            <div className="py-4 rounded-2xl">
              {/* Loading skeleton for title */}
              <div className="mb-3">
                <div className="h-8 bg-gray-300 rounded-lg animate-pulse mb-2 md:h-10 lg:h-12" />
                <div className="h-6 bg-gray-300 rounded-lg animate-pulse w-3/4 md:h-8 lg:h-10" />
              </div>
              {/* Loading skeleton for subtitle */}
              <div className="h-5 bg-gray-300 rounded-lg animate-pulse w-2/3 md:h-6" />
            </div>
          </div>
        </div>

        {/* Loading skeleton for upcoming services */}
        <div className="lg:p-2 shadow-lg border-0 bg-gradient-to-br from-white to-gray-50 rounded-xl">
          <div className="p-4 md:text-md lg:pt-6 lg:pb-4">
            <div className="space-y-2">
              <div className="h-6 bg-gray-300 rounded-lg animate-pulse w-1/3 md:h-7" />
              <div className="h-4 bg-gray-300 rounded-lg animate-pulse w-1/2 md:h-5" />
            </div>
          </div>
          <div className="px-4 pb-4">
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="flex items-center space-x-4 p-4 bg-white rounded-lg border border-gray-100"
                >
                  <div className="size-12 bg-gray-300 rounded-full animate-pulse" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-300 rounded-lg animate-pulse w-3/4" />
                    <div className="h-3 bg-gray-300 rounded-lg animate-pulse w-1/2" />
                  </div>
                  <div className="h-8 w-20 bg-gray-300 rounded-lg animate-pulse" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <div className="mb-8 text-center md:text-left">
          <div className="mb-6 relative group">
            {/* Error state background */}
            <div className="absolute inset-0 bg-gradient-to-br from-red-50 to-red-100 rounded-2xl opacity-60 -z-10" />
            <div className="py-4 rounded-2xl">
              <div className="mb-3">
                <h1 className="text-2xl font-bold text-red-800 md:text-3xl lg:text-4xl leading-tight">
                  ⚠️ Something went wrong
                </h1>
                <p className="text-lg text-red-600 md:text-xl mt-2">
                  {error.message || "Unable to load your booking details"}
                </p>
              </div>
              <p className="text-base text-red-500">
                Please try refreshing the page or contact support if the problem
                persists.
              </p>
            </div>
          </div>
        </div>

        {/* Placeholder for upcoming services section */}
        <div className="lg:p-2 shadow-lg border-0 bg-gradient-to-br from-white to-gray-50 rounded-xl">
          <div className="p-4 md:text-md lg:pt-6 lg:pb-4">
            <div className="space-y-2">
              <h2 className="font-bold lg:text-xl text-gray-400">
                Upcoming Services
              </h2>
              <p className="text-sm text-gray-400">Unable to load</p>
            </div>
          </div>
          <div className="px-4 pb-4">
            <div className="text-center py-8">
              <p className="text-gray-400 text-lg">
                Service information unavailable
              </p>
            </div>
          </div>
        </div>
      </Container>
    );
  }
  return (
    <Container>
      <div className="mb-8 text-center md:text-left">
        <div className="mb-6 relative group">
          {/* Subtle background pattern */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl opacity-60 -z-10 transition-all duration-300 group-hover:opacity-80 group-hover:scale-[1.02]" />
          <div className="py-4 rounded-2xl transition-all duration-300">
            <h1 className="mb-3 text-2xl font-bold text-gray-900 md:text-3xl lg:text-4xl leading-tight">
              👋 Welcome back,{" "}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {userSession.displayName ||
                  userSession.firstName ||
                  userSession.email?.split("@")[0] ||
                  "there"}
              </span>
            </h1>
            <p className="text-lg text-gray-600 md:text-2xl leading-relaxed">
              Ready to book your next service or manage your bookings?
            </p>
          </div>
        </div>
      </div>
      {data?.completed_needs_review &&
        data.completed_needs_review.length > 0 && (
          <UpcomingServicesCard className="lg:p-2 shadow-lg border-0 bg-gradient-to-br from-green-50 to-emerald-50 mb-6">
            <CardHeader className="flex flex-row items-start justify-between text-pretty p-4 md:text-md lg:pt-6 lg:pb-4">
              <div className="space-y-2">
                <h2 className="font-bold lg:text-xl text-gray-900">
                  Services Completed ({data.completed_needs_review.length})
                </h2>
                <p className="text-sm text-gray-600 font-medium">
                  Share your experience and help others choose
                </p>
              </div>
              <div className="flex items-center gap-2 text-green-600">
                <MessageSquare color="#187a24" />
              </div>
            </CardHeader>
            <CardBody className="px-4 pb-4">
              <div className="space-y-4">
                {data.completed_needs_review.map(
                  ({
                    service_title,
                    provider_company_name,
                    start_time,
                    id,
                    provider_id,
                  }) => (
                    <LeaveReview
                      key={id}
                      service_title={service_title}
                      company_name={provider_company_name}
                      start_time={start_time}
                      customer_id={customerId || ""}
                      provider_id={provider_id}
                    />
                  ),
                )}
              </div>
            </CardBody>
          </UpcomingServicesCard>
        )}
      <UpcomingServicesCard className="lg:p-2 shadow-lg border-0 bg-gradient-to-br from-white to-gray-50">
        <CardHeader className="flex flex-row items-start justify-between text-pretty p-4 md:text-md lg:pt-6 lg:pb-4">
          <div className="space-y-2">
            <h2 className="font-bold lg:text-xl text-gray-900">
              Your Upcoming Services ({data?.upcoming_bookings.length ?? 0})
            </h2>
            <p className="text-sm text-gray-600 font-medium">
              Stay on top of your scheduled appointments
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowAllServices(!showAllServices)}
            className="text-nowrap text-blue-600 hover:text-blue-700 font-semibold transition-colors duration-200 hover:underline cursor-pointer"
          >
            {showAllServices ? "Show Less" : "View All"}
          </button>
        </CardHeader>
        <CardBody className="px-4 pb-4">
          {data?.upcoming_bookings.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 text-lg">
                No upcoming services scheduled
              </p>
              <p className="text-gray-400 text-sm mt-2">
                Book your first service to get started!
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {data?.upcoming_bookings
                .slice(0, showAllServices ? undefined : 2)
                .map(
                  ({
                    provider_company_name,
                    status,
                    start_time,
                    service_title,
                  }) => (
                    <UpcomingService
                      key={provider_company_name}
                      provider_company_name={provider_company_name}
                      status={status}
                      start_time={start_time}
                      service_title={service_title}
                    />
                  ),
                )}
            </div>
          )}
        </CardBody>
      </UpcomingServicesCard>
    </Container>
  );
}

function UnauthenticatedHero() {
  const openBumi = () => {
    window.dispatchEvent(new CustomEvent("open-bumi-modal"));
  };
  return (
    <Container className="flex justify-center">
      {/* Container placed around image and text to allow for positioning based off image rather than screen */}
      <div
        className="relative w-full max-w-6xl rounded-lg overflow-hidden"
        style={{
          height: "clamp(350px, 40vh, 600px)", // controls height
        }}
      >
        <Image
          className=" object-cover"
          fill
          alt="Young woman diligently cleaning a bright, modern home."
          // static import to have Next Image component decide height and width to prevent CLS
          src={HomePageHeroImage}
        />
        {/* Text Container */}
        <div className="absolute inset-0 flex flex-col items-start justify-center px-[10%]  translate-y-[-10%] lg:translate-y-0">
          {/* inset-0 flex flex-col items-start justify-center px-[10%]  */}
          <div className="text-3xl font-black md:text-5xl lg:text-6xl">
            <p>Book. Relax.</p>
            <p>Done.</p>
          </div>
          <p className="my-[10px] font-medium md:my-[1em] lg:text-lg md:font-semibold">
            Professional services for your busy life.
          </p>
          <p className="mb-3 font-medium lg:text-lg md:font-semibold ">
            {" "}
            Need help ASAP?
          </p>
          <StyledAsButton
            as={Link}
            href="/"
            onPress={openBumi}
            label="Chat With Bumi!"
            className="text-xs md:text-base"
            endContent={
              <img
                src="/bumi.png"
                width={24}
                height={24}
                className="rounded-full -ml-1 my-auto"
                alt="a happy corgi with its tongue lolling out of its mouth"
              />
            }
          />
        </div>
      </div>
    </Container>
  );
}

function ServicesSection() {
  return (
    <Container className="mt-20 text-center sm:text-left">
      <h3 className="text-4xl font-bold text-primary-font-color">
        What service would you like?
      </h3>
      <p className="mb-8 mt-4 text-lg tracking-wider text-secondary-font-color">
        Choose from our most popular home services
      </p>
      <section className="grid grid-cols-3 gap-4">
        {Object.values(listOfServices).map((service) => (
          <Card
            key={service.label}
            service={service}
            className="group relative max-w-xs bg-transparent pb-2 shadow-none"
            // group relative allows for the blue hover effect, it will trigger the group div inside this component to activate
            // heroui has a shadow by default, turned off with shadow-none
          />
        ))}
      </section>
    </Container>
  );
}

const renderHero = (authContextObject: AuthDetailsType) => {
  if (authContextObject.supabaseUserId)
    return (
      <AuthenticatedHero
        userSession={{
          id: authContextObject.supabaseUserId,
          email: authContextObject.email || "",
          displayName: authContextObject.displayName,
          firstName: authContextObject.firstName,
        }}
      />
    );
  return <UnauthenticatedHero />;
};

export default function Home() {
  const { authContextObject } = useAuthContext();

  return (
    <div>
      {renderHero(authContextObject)}
      <ServicesSection />
    </div>
  );
}
