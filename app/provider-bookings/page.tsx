"use client";

import MapPin from "@/components/icons/MapPin";
import Maximize from "@/components/icons/Maximize";
import ProviderBookingCard from "@/components/ProviderBookingCard";
import { useApiQuery } from "@/lib/api-client";
import { Card, CardBody, CardHeader } from "@heroui/react";

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
}

type BookingList = BookingItem[]; // Defines the type for the array of booking items

export default function Page() {
  const { data, error, isLoading } = useApiQuery<BookingList>(
    ["providers", "bookings"],
    "/providers/bookings",
  );

  console.log(data);
  return (
    <main className="m-auto w-[90%] md:w-4/5">
      {/* Map Card */}
      <Card className="mb-4">
        <CardHeader className="flex justify-between">
          <div className="flex items-center gap-2 text-sm">
            <MapPin size={16} color="#2563eb" />
            <span>Today's Route</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Maximize size={16} color="#2563eb" />
            <span className="text-[#2563eb]">View Full Map</span>
          </div>
        </CardHeader>
      </Card>
      {/* At a glance cards */}
      <div className="grid grid-cols-3 gap-2">
        <Card>
          <CardBody className="text-center text-sm">
            <p className="font-black">{data?.length}</p>
            <p>Jobs Today</p>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="text-center text-sm">
            <p className="font-black text-primary">{data?.length}</p>
            <p>Today's Revenue</p>
          </CardBody>
        </Card>
        <Card className="">
          <CardBody className="text-nowrap px-0 text-center text-sm">
            <p className="text-green font-black">{data?.length}</p>
            <p>Completed</p>
          </CardBody>
        </Card>
      </div>
      {data?.map(
        ({ status, start_time, service_notes, special_instructions, service, customer }, idx) => (
          <ProviderBookingCard
            key={start_time + idx}
            status={status}
            start_time={start_time}
            service_notes={service_notes}
            special_instructions={special_instructions}
            service_title={service.service_title}
            pricing={service.pricing}
            duration={service.duration}
            first_name={customer.first_name}
            last_name={customer.last_name}
            phone_number={customer.phone_number}
          />
        ),
      )}
    </main>
  );
}
