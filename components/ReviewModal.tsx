import { Modal, ModalBody, ModalContent, ModalHeader } from "@heroui/react";
import StyledAsButton from "./StyledAsButton";
import Star from "./icons/Star";
import ReviewStar from "./ReviewStar";

interface ReviewModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  service_title: string;
  company_name: string;
}

function ReviewModal({
  isOpen,
  onOpenChange,
  service_title,
  company_name,
}: ReviewModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      placement="center"
      onOpenChange={onOpenChange}
      classNames={{
        closeButton: "text-black top-3.5 right-2 hover:text-primary",
        // the X defaults to the top right corner, moved it with top and right
        base: "max-w-[500px] w-4/5",
        // default version was too small and had a max-w-m
      }}
    >
      <ModalContent>
        {() => (
          <>
            <ModalHeader>Rate Your Experience</ModalHeader>
            <ModalBody>
              <p>
                How was your {service_title} with {company_name}?
              </p>
              <ReviewStar />
              <textarea
                name="description"
                placeholder="Share your experience (optional)"
                className="mt-3 h-[20dvh] resize-none rounded-lg border-1 border-light-accent px-2 py-1"
              ></textarea>
              <StyledAsButton label="Submit Review" className="mb-8" />
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}

export default ReviewModal;
