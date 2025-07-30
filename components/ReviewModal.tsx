import { Modal, ModalBody, ModalContent } from "@heroui/react";

interface ReviewModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

function ReviewModal({ isOpen, onOpenChange }: ReviewModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      placement="top-center"
      onOpenChange={onOpenChange}
      classNames={{
        closeButton: "text-black top-4 right-2 hover:text-primary",
        // the X defaults to the top right corner, moved it with top and right
        base: "max-w-[500px] w-4/5",
        // default version was too small and had a max-w-m
      }}
    >
      <ModalContent>
        <ModalBody>
          <h1>hello</h1>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}

export default ReviewModal;
