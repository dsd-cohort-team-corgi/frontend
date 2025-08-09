"use client";

import { useEffect, useState } from "react";
import { Card, CardBody, CardHeader } from "@heroui/react";
import dynamic from "next/dynamic";
import { useApiQuery } from "@/lib/api-client";
import MapPin from "@/components/icons/MapPin";
import LoadingSkeleton from "@/components/LoadingSkeleton";
import ProviderBookingCard from "@/components/ProviderBookingCard";

// Dynamically import MapComponent to avoid SSR issues
const MapComponent = dynamic(() => import("@/components/MapComponent"), {
  ssr: false,
  loading: () => <div className="h-[30dvh] w-full bg-gray-100 animate-pulse" />,
});

interface Service {
  id: string;
  service_title: string;
  service_description: string;
  pricing: number;
  duration: number;
  category: string;
}

interface Customer {
  first_name: string;
  last_name: string;
  phone_number: string;
  id: string;
}

interface Address {
  street_address_1: string;
  street_address_2: string;
  city: string;
  state: string;
  zip: string;
  id: string;
  latitude: number;
  longitude: number;
}

interface BookingItem {
  special_instructions: string;
  service_notes: string;
  start_time: string;
  status:
    | "confirmed"
    | "en_route"
    | "in_progress"
    | "completed"
    | "cancelled"
    | "review_needed";
  service: Service;
  customer: Customer;
  address: Address;
  id: string;
}

// Defines the type for the array of booking items
type BookingList = BookingItem[];

interface MapBooking {
  id: string;
  coordinates: [latitude: number, longitude: number];
  name: string;
  service_title: string;
}

export default function Page() {
  const [completed, setCompleted] = useState<number>(0);
  const [bookingsForMap, setBookingsForMap] = useState<
    MapBooking[] | undefined
  >([]);

  const { data, error, isLoading } = useApiQuery<BookingList>(
    ["providers", "bookings"],
    "/providers/bookings",
  );

  // sets the number of completed bookings on page load
  useEffect(() => {
    data?.forEach((booking) => {
      if (booking.status === "completed") {
        setCompleted((prev) => prev + 1);
      }
    });
  }, [data]);

  // creates a temp array that gets data needed for component map and sets it to array state
  useEffect(() => {
    const tempArr = data?.map((booking) => {
      return {
        id: booking.id,
        coordinates: [booking.address.latitude, booking.address.longitude] as [
          number,
          number,
        ],
        name: `${booking.customer.first_name} ${booking.customer.last_name}`,
        service_title: booking.service.service_title,
      };
    });
    setBookingsForMap(tempArr);
  }, [data]);

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  if (error) {
    return <h1>Something went wrong: {error.message}</h1>;
  }

  if (data?.length === 0) {
    return (
      <h1 className="m-auto w-4/5 text-center text-lg font-semibold lg:text-2xl">
        Looks like there&apos;s no work for today! 🎉
      </h1>
    );
  }

  const totalRevenue =
    data?.reduce((acc, booking) => acc + booking.service.pricing, 0) ?? 0;

  return (
    <main className="m-auto w-[90%] md:w-4/5">
      <Card className="mb-4">
        <CardHeader className="pb-0">
          <div className="flex items-center gap-2 text-sm">
            <MapPin size={16} color="#2563eb" />
            <span className="md:text-base">Today&apos;s Route</span>
          </div>
        </CardHeader>
        <CardBody>
          <MapComponent bookingsForMap={bookingsForMap || []} />
        </CardBody>
      </Card>
      {/* At a glance cards */}
      <div className="grid grid-cols-3 gap-2">
        <Card>
          <CardBody className="text-center text-base md:text-lg">
            <p className="font-black">{data?.length}</p>
            <p>Jobs Today</p>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="text-center text-base md:text-lg">
            <p className="font-black text-green">${totalRevenue}</p>
            <p>Today&apos;s Revenue</p>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="text-nowrap px-0 text-center text-base md:text-lg">
            <p className="font-black text-primary">{completed}</p>
            <p>Completed</p>
          </CardBody>
        </Card>
      </div>
      {data?.map(
        ({
          status,
          start_time,
          special_instructions,
          service,
          customer,
          address,
          id,
        }) => (
          <ProviderBookingCard
            key={id}
            bookingId={id}
            status={status}
            start_time={start_time}
            special_instructions={special_instructions}
            service_title={service.service_title}
            pricing={service.pricing}
            duration={service.duration}
            first_name={customer.first_name}
            last_name={customer.last_name}
            phone_number={customer.phone_number}
            street_address_1={address.street_address_1}
            street_address_2={address.street_address_2}
            city={address.city}
            state={address.state}
            zip={address.zip}
            setCompleted={setCompleted}
          />
        ),
      )}
    </main>
  );
}
