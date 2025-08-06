import { ReactNode, useEffect, Dispatch, SetStateAction } from "react";
import { Modal, ModalBody, ModalContent, ModalHeader } from "@heroui/react";
import StyledAsButton from "./StyledAsButton";
import { useApiMutation } from "@/lib/api-client";

interface StatusModal {
  bookingId: string;
  isOpen: boolean;
  onOpenChange: () => void;
  service_title: string;
  status: string;
  name: string;
  setBookingStatus: React.Dispatch<React.SetStateAction<string>>;
  setCompleted: Dispatch<SetStateAction<number>>;
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
  service_title,
  setBookingStatus,
  setCompleted,
}: StatusModal) {
  const updateStatus = useApiMutation<StatusData, UpdateStatusRequest>(
    `/bookings/${bookingId}/status`,
    "PATCH",
  );
  useEffect(() => {
    if (isOpen && updateStatus.isSuccess) {
      setBookingStatus(updateStatus.data.status);
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
            label="Cancel"
          />
        </ModalBody>
      </>
    );
  }

  if (status === "en_route") {
    modalContent = (
      <>
        <ModalHeader>Start Work?</ModalHeader>
        <ModalBody>
          <p>
            Would you like to start {service_title} for {name}
          </p>
          <StyledAsButton
            onPress={() => {
              updateStatus.mutate({ status: "in_progress" });
            }}
            label="Start"
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

  if (status === "in_progress") {
    modalContent = (
      <>
        <ModalHeader>Complete Job?</ModalHeader>
        <ModalBody>
          <p>
            Would you like to complete {service_title} for {name}
          </p>
          <StyledAsButton
            onPress={() => {
              updateStatus.mutate({ status: "completed" });
              setCompleted((prev) => prev + 1);
            }}
            label="Complete"
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
      <ModalContent>
        {() => (
          <>
            {modalContent}
            {updateStatus.isError && (
              <>
                <p className="text-red-500">
                  Something went wrong: {updateStatus.error.message}
                </p>
                <p>Please try again</p>
              </>
            )}
          </>
        )}
      </ModalContent>
    </Modal>
  );
}

export default ProviderBookingStatusModal;
