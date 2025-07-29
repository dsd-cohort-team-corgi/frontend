"use client";

import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Card as HeroCard, CardBody } from "@heroui/react";
import Card from "@/components/CardWithImage";
import HomePageHeroImage from "../public/HomePageHeroImage.png";
import StyledAsButton from "@/components/StyledAsButton";
import listOfServices from "@/data/services";
import useAuth from "@/lib/useAuth";
import CompleteProfileModal from "@/components/CompleteProfileModal";
import { useApiQuery } from "@/lib/api-client";

interface UserSession {
  id: string;
  email: string;
}
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

function AuthenticatedHero({ userSession }: { userSession: UserSession }) {
  const { data, error, isLoading } = useApiQuery<BookingQueryProps[]>(
    ["bookings"],
    "/bookings",
  );
  const TEMP_CUSTOMER_ID = "09761bda-e98b-46f0-b976-89658eb70148";
  const bookingsFromId = data?.filter(
    (booking) => booking.customer_id === TEMP_CUSTOMER_ID,
  );
  console.log(bookingsFromId);
  return (
    <div className="m-auto flex w-4/5 justify-center border-1 border-black">
      <div className="text-center">
        <h1 className="">
          👋 Welcome back,{" "}
          <span className="font-bold">{userSession.email}</span>
        </h1>
        <p>Book a service or manage your bookings</p>
        <div>
          <h2>Your Upcoming Services {bookingsFromId?.length}</h2>
        </div>
      </div>
    </div>
  );
}

function UnauthenticatedHero() {
  return (
    <div className="flex justify-center">
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
