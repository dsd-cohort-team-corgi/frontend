"use client";

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/react";

interface BookingModalProps {
  isOpen: boolean;
  onOpen: () => void;
  onOpenChange: (isOpen: boolean) => void;
  onClose: () => void;
  bookingOnOpen: () => void;
}

function BookingConfirmedModal({ isOpen }: BookingModalProps) {
  return (
    <Modal isOpen={isOpen}>
      <ModalContent>
        <ModalHeader>Booking Confirmed</ModalHeader>
      </ModalContent>
    </Modal>
  );
}

export default BookingConfirmedModal;
