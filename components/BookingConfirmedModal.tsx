"use client";

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/react";
import Check from "@/components/icons/Check";

interface BookingModalProps {
  isOpen: boolean;
}

function BookingConfirmedModal({ isOpen }: BookingModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      placement="top-center"
      classNames={{
        closeButton: "invisible",
        header: "flex-col justify-center items-center",
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
        </ModalHeader>
      </ModalContent>
    </Modal>
  );
}

export default BookingConfirmedModal;
