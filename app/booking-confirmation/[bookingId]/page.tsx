"use client";

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@heroui/react";
import Check from "@/components/icons/Check";
import { useApiQuery } from "@/lib/api-client";

interface BookingModalProps {
  isOpen: boolean;
}
export default function page() {
  const { isOpen, onOpen } = useDisclosure();
  const { data, error, isLoading } = useApiQuery<unknown>(
    ["bookings"],
    "/bookings",
  );

  console.log(data)
  return (
    <>
      <p>fasd</p>
      <Modal
        isOpen={isOpen}
        placement="top-center"
        classNames={{
          closeButton: "invisible",
          header: "flex-col justify-center items-center gap-4",
          // the X defaults to the top right corner, moved it with top and right
          base: "max-w-[500px]",
          // default version was too small and had a max-w-m
        }}
      >
        <ModalContent>
          <ModalHeader className="text-center">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-200">
              <Check color="#187a24" />
            </div>
            Booking Confirmed
            <p className="text-light-font-color text-sm">ID: BK-001234</p>
          </ModalHeader>
        </ModalContent>
      </Modal>
    </>
  );
}
