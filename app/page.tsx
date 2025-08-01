"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Card as UpcomingServicesCard,
  CardBody,
  CardHeader,
} from "@heroui/react";
import Card from "@/components/CardWithImage";
import HomePageHeroImage from "../public/HomePageHeroImage.png";
import StyledAsButton from "@/components/StyledAsButton";
import listOfServices from "@/data/services";
import useAuth from "@/lib/useAuth";
import { useApiQuery } from "@/lib/api-client";
import UpcomingService from "@/components/UpcomingService";
import LeaveReview from "@/components/LeaveReview";
import { useEffect, useState } from "react";

interface UserSession {
  id: string;
  email: string;
}
export interface BookingItem {
  provider_first_name: string;
  provider_last_name: string;
  provider_company_name: string;
  status: "confirmed" | "pending" | "cancelled" | "completed";
  start_time: string;
  service_title: string;
}

export interface BookingsData {
  upcoming_bookings: BookingItem[];
  completed_needs_review: BookingItem[];
}
const TEMP_CUSTOMER_ID = "09761bda-e98b-46f0-b976-89658eb70148";
const TEMP_PROVIDER_ID = "1f0f15da-9de9-4c79-bd6d-a48919b988d4";

function AuthenticatedHero({ userSession }: { userSession: UserSession }) {
  const [bookingStatuses, setBookingStatuses] = useState<
    BookingItem[] | undefined
  >([]);
  const { data, dataUpdatedAt, error, isLoading } = useApiQuery<BookingsData>(
    ["customers", "customerId", "dashboard"],
    `/customers/${TEMP_CUSTOMER_ID}/dashboard`,
    { refetchInterval: 500, refetchIntervalInBackGround: true },
  );

  useEffect(() => {
    if (bookingStatuses?.length === 0 && data?.upcoming_bookings) {
      setBookingStatuses(data?.upcoming_bookings);
    }
  }, [dataUpdatedAt]);

  if (isLoading) {
    return <h1>Grabbing Booking Details...</h1>;
  }

  if (error) {
    return <h1>Something went wrong {error.message}</h1>;
  }
  return (
    <div className="m-auto w-4/5 max-w-[1200px]">
      <div className="mb-4 text-pretty text-left text-lg md:text-2xl lg:text-3xl">
        <h1>
          👋 Welcome back,{" "}
          <span className="font-bold">{userSession.email}</span>
        </h1>
        <p>Book a service or manage your bookings</p>
      </div>
      {/* {data?.completed_needs_review && <LeaveReview />} */}
      {data?.completed_needs_review.map(
        ({ service_title, provider_company_name, start_time }) => (
          <LeaveReview
            key={`${provider_company_name}-${start_time}`}
            service_title={service_title}
            company_name={provider_company_name}
            start_time={start_time}
            customer_id={TEMP_CUSTOMER_ID}
            provider_id={TEMP_PROVIDER_ID}
          />
        ),
      )}
      <UpcomingServicesCard className="lg:px-6">
        <CardHeader className="flex flex-row items-start justify-between text-pretty p-4 md:text-lg lg:pt-8">
          <h2 className="font-black lg:text-xl">
            Your Upcoming Services ({data?.upcoming_bookings.length ?? 0})
          </h2>
          <p className="text-nowrap">View All</p>
        </CardHeader>
        <CardBody>
          {data?.upcoming_bookings.map(
            ({ provider_company_name, status, start_time, service_title }) => (
              <UpcomingService
                key={provider_company_name}
                provider_company_name={provider_company_name}
                status={status}
                start_time={start_time}
                service_title={service_title}
              />
            ),
          )}
        </CardBody>
      </UpcomingServicesCard>
    </div>
  );
}

function UnauthenticatedHero() {
  return (
    <div className="m-auto flex max-w-[1200px] justify-center">
      {/* Container placed around image and text to allow for positioning based off image rather than screen */}
      <div className="relative">
        <Image
          className="h-[40dvh] rounded-lg object-cover md:h-[60dvh]"
          alt="Young woman diligently cleaning a bright, modern home."
          // static import to have Next Image component decide height and width to prevent CLS
          src={HomePageHeroImage}
        />
        {/* Text Container */}
        <div className="absolute left-[10%] top-[5%] w-1/2 md:top-[10%] lg:left-[15%] lg:top-1/4">
          <div className="xlg:text-8xl text-3xl font-black md:text-7xl">
            <p>Book. Relax.</p>
            <p>Done.</p>
          </div>
          <p className="my-[10px] font-medium md:my-[1em] md:text-lg md:font-semibold">
            Professional services for your busy life.
          </p>
          <StyledAsButton
            as={Link}
            href="/"
            label="Start Your Search"
            className="text-xs md:text-base"
          />
        </div>
      </div>
    </div>
  );
}

function ServicesSection() {
  return (
    <section className="mx-auto mt-20 max-w-[1200px] px-5 text-center sm:text-left">
      <h3 className="text-4xl font-bold text-primary-font-color">
        What service do you need?
      </h3>
      <p className="mb-8 mt-4 text-lg tracking-wider text-secondary-font-color">
        Choose from our most popular home services
      </p>
      <section className="grid-row-1 sm:grid-row-2 grid grid-cols-1 gap-7 sm:grid-cols-2 md:grid-cols-3">
        {Object.values(listOfServices).map((service) => (
          <Card
            key={service.label}
            service={service}
            className="group relative shadow-none"
            // group relative allows for the blue hover effect, it will trigger the group div inside this component to activate
            // heroui has a shadow by default, turned off with shadow-none
          />
        ))}
      </section>
    </section>
  );
}

const renderHero = (userSession: UserSession | null) => {
  if (userSession) return <AuthenticatedHero userSession={userSession} />;
  return <UnauthenticatedHero />;
};

export default function Home() {
  const { userSession } = useAuth();

  return (
    <div>
      {renderHero(userSession)}
      <ServicesSection />
    </div>
  );
}
