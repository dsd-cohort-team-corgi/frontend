"use client";

import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  useDisclosure,
  Card,
  CardBody,
} from "@heroui/react";
import Check from "@/components/icons/Check";
import { useApiQuery } from "@/lib/api-client";
import LoadingSkeleton from "@/components/LoadingSkeleton";
import { useEffect } from "react";
import { formatDateTimeString } from "@/utils/formatDateTimeString";
import Calendar from "@/components/icons/Calendar";
import StyledAsButton from "@/components/StyledAsButton";
import ArrowRight from "@/components/icons/ArrowRight";
import Phone from "@/components/icons/Phone";
import MapPin from "@/components/icons/MapPin";

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
interface Address {
  street_address_1: string;
  street_address_2: string;
  city: string;
  state: string;
  zip: string;
  id: string;
  customer_id: string;
  created_at: string;
  updated_at: string;
}

export default function page({ params }: { params: { slug: string } }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const pathName = usePathname();
  const bookingId = pathName.split("/")[2];
  const router = useRouter();
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

  const {
    data: addressData,
    error: addressError,
    isLoading: addressIsLoading,
  } = useApiQuery<Address[]>(["address"], `/addresses`);
  const address = addressData?.find(
    (address) => address.customer_id === bookingData?.customer_id,
  );
  const serviceId = bookingData?.service_id;
  const service = providerData?.services.find(
    (service) => service.id === serviceId,
  );
  let serviceDateAndTime: { datePart: string; timePart: string };
  if (bookingData) {
    serviceDateAndTime = formatDateTimeString(bookingData?.start_time ?? "");
  }

  useEffect(() => {
    // opens modal after data has been fetched
    onOpen();
  }, [providerData, onOpen]);

  if (bookingIsLoading || providerIsLoading) {
    return (
      <div className="m-auto w-4/5 max-w-[500px]">
        <LoadingSkeleton />
      </div>
    );
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

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={() => router.push("/")}
        placement="top-center"
        classNames={{
          closeButton: "",
          header: "flex-col justify-center items-center gap-4",
          // the X defaults to the top right corner, moved it with top and right
          base: "max-w-[500px] w-4/5",
          // default version was too small and had a max-w-m
        }}
      >
        <ModalContent>
          {() => (
            <>
              <ModalHeader className="text-center">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-200">
                  <Check color="#187a24" />
                </div>
                Booking Confirmed
                <p className="text-xs lg:text-sm text-light-font-color">
                  ID: {bookingData?.id}
                </p>
              </ModalHeader>
              <ModalBody>
                {/* Appointment Card */}
                <Card>
                  <CardBody className="flex flex-row items-center gap-4">
                    <Calendar color="#2563eb" size={18} />
                    <div className="flex flex-col">
                      <p>{serviceDateAndTime.datePart}</p>
                      <p className="text-sm text-light-font-color">
                        {serviceDateAndTime.timePart}
                      </p>
                    </div>
                  </CardBody>
                </Card>
                {/* Service and Address Card */}
                <Card>
                  <CardBody className="flex flex-row items-center gap-4">
                    <MapPin color="#2563eb" size={20} />
                    <div>
                      <p>
                        {service ? service.service_title : "Service not found"}
                      </p>
                      <p className="text-small text-light-font-color">
                        {address
                          ? `${address.street_address_1}${address.street_address_2 ? ", " + address.street_address_2 : ""}, ${address.city}, ${address.state} ${address.zip}`
                          : "Address not found"}
                      </p>
                    </div>
                  </CardBody>
                </Card>
                {/* Provider Card */}
                <Card>
                  <CardBody className="flex flex-row items-center justify-between gap-4">
                    <div className="flex flex-row items-center justify-around gap-4">
                      <Phone color="#2563eb" size={20} />
                      <div>
                        <p>
                          {providerData?.company_name || "Green Thumb Services"}
                        </p>
                        <p className="text-sm text-light-font-color">
                          {providerData?.phone_number}
                        </p>
                      </div>
                    </div>
                    <div>
                      <p className="font-black">${service?.pricing}</p>
                    </div>
                  </CardBody>
                </Card>
                <Link href={`/api/generate-ics/${bookingId}`}>
                  <StyledAsButton
                    className="w-full"
                    label="Add To Calandar"
                    startContent={<Calendar size={18} />}
                  />
                </Link>
                <StyledAsButton
                  endContent={<ArrowRight size={16} />}
                  label="View My Bookings"
                  className="bg-[#ededed] text-black"
                  onPress={() => router.push("/")}
                />
                <p className="mb-8 rounded-lg bg-blue-100 p-4">
                  <span className="text-primary">What's next?</span>{" "}
                  <span>
                    You'll get updates when your provider is on the way.
                  </span>
                </p>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
