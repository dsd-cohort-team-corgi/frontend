"use client";

import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
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
  } = useApiQuery<unknown>(
    ["providers", "providerId"],
    `/providers/${bookingData?.provider_id}`,
  );

  // const {
  //   data: serviceData,
  //   error: serviceError,
  //   isLoading: serviceIsLoading,
  // } = useApiQuery<unknown>(
  //   ["bookings", "bookingId"],
  //   "/bookings/19eb6a08-5e86-4420-ae28-b6c4435f6238",
  // );

  useEffect(() => {
    // opens modal after data has been fetched
    onOpen();
  }, [providerData, onOpen]);
  // need to add provider check
  if (bookingIsLoading) {
    return (
      <div className="m-auto w-4/5 max-w-[500px]">
        <LoadingSkeleton />
      </div>
    );
  }
  // need to add provider check
  if (bookingError) {
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
                <p className="text-light-font-color text-sm">
                  ID: {bookingData?.id}
                </p>
              </ModalHeader>
              <ModalBody>
                <Card>
                  <CardBody className="flex flex-row gap-4">
                    <Calendar color="#2563eb" />
                    <p>{formatDateTimeString(bookingData?.start_time ?? "")}</p>
                  </CardBody>
                </Card>
                <Card>
                  <CardBody className="flex flex-row gap-4">
                    <Calendar color="#2563eb" />
                    <p>{formatDateTimeString(bookingData?.start_time ?? "")}</p>
                  </CardBody>
                </Card>
                <Card>
                  <CardBody className="flex flex-row gap-4">
                    <Calendar color="#2563eb" />
                    <p>{formatDateTimeString(bookingData?.start_time ?? "")}</p>
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
