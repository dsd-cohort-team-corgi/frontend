import { Modal, ModalBody, ModalContent, ModalHeader } from "@heroui/react";
import StyledAsButton from "./StyledAsButton";
import { useApiMutation } from "@/lib/api-client";
import { ReactNode, useEffect } from "react";

interface StatusModal {
  bookingId: string;
  isOpen: boolean;
  onOpenChange: () => void;
  status:
    | "confirmed"
    | "en_route"
    | "in_progress"
    | "completed"
    | "cancelled"
    | "review_needed";
  name: string;
  setBookingStatus: React.Dispatch<React.SetStateAction<string>>;
}

interface StatusData {
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
}

interface UpdateStatusRequest {
  status:
    | "confirmed"
    | "en_route"
    | "in_progress"
    | "completed"
    | "cancelled"
    | "review_needed";
}

function ProviderBookingStatusModal({
  bookingId,
  isOpen,
  onOpenChange,
  status,
  name,
  setBookingStatus
}: StatusModal) {
  const updateStatus = useApiMutation<StatusData, UpdateStatusRequest>(
    `/bookings/${bookingId}/status`,
    "PATCH",
  );
  useEffect(() => {
    if (isOpen && updateStatus.isSuccess) {
      setBookingStatus(updateStatus.data.status)
      onOpenChange();
    }
  }, [updateStatus.isPending]);
  let modalContent: ReactNode | null;
  if (status === "confirmed") {
    modalContent = (
      <>
        <ModalHeader>Update Status?</ModalHeader>
        <ModalBody>
          <p>Would you like to notifiy {name} that you are on your way?</p>
          <StyledAsButton
            onPress={() => {
              updateStatus.mutate({ status: "en_route" });
            }}
            label="Notify"
            isLoading={updateStatus.isPending ? true : false}
          />
          <StyledAsButton
            className="mb-2"
            onPress={() => onOpenChange()}
            label="Close"
          />
        </ModalBody>
      </>
    );
  }
  return (
    <Modal
      isOpen={isOpen}
      placement="center"
      onOpenChange={onOpenChange}
      classNames={{
        closeButton: "text-black hover:text-primary",
        // the X defaults to the top right corner, moved it with top and right
        base: "max-w-[500px]",
        // default version was too small and had a max-w-m
      }}
    >
      <ModalContent>{() => <>{modalContent}</>}</ModalContent>
    </Modal>
  );
}

export default ProviderBookingStatusModal;
