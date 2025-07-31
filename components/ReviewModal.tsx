import { useState, useEffect } from "react";
import { Modal, ModalBody, ModalContent, ModalHeader } from "@heroui/react";
import StyledAsButton from "./StyledAsButton";
import ReviewStar from "./ReviewStar";
import { useApiMutation } from "@/lib/api-client";
import LoaderSpinner from "./Loader";

interface ReviewModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onClose: () => void;
  service_title: string;
  company_name: string;
  customer_id: string;
  provider_id: string;
}

export interface CreateReviewRequest {
  rating: number;
  description: string;
  customer_id: string;
  provider_id: string;
}

export interface Review {
  rating: number;
  description: string;
  id: string;
  customer_id: string;
  provider_id: string;
  created_at: string;
  updated_at: string;
}

function ReviewModal({
  isOpen,
  onOpenChange,
  onClose,
  service_title,
  company_name,
  customer_id,
  provider_id,
}: ReviewModalProps) {
  const [clickedStar, setClickedStar] = useState(0);
  const [reviewDescription, setReviewDescription] = useState<string>("");
  const createReview = useApiMutation<Review, CreateReviewRequest>(
    "/reviews",
    "POST",
  );

  let labelText;
  if (createReview.isPending) {
    labelText = "Submitting Review...";
  } else {
    labelText = "Submit Review";
  }

  if (createReview.isError) {
    console.error(createReview.error);
  }

  useEffect(() => {
    if (createReview.isSuccess) {
      setClickedStar(0);
      setReviewDescription("");
      onClose();
    }
  }, [createReview.isSuccess]);

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
              <ReviewStar
                clickedStar={clickedStar}
                setClickedStar={setClickedStar}
              />
              <textarea
                name="description"
                placeholder="Share your experience (optional)"
                className="mt-3 h-[20dvh] resize-none rounded-lg border-1 border-light-accent px-2 py-1"
                value={reviewDescription}
                onChange={(e) => setReviewDescription(e.target.value)}
              ></textarea>
              <StyledAsButton
                isDisabled={clickedStar === 0 || createReview.isPending}
                label={labelText}
                className="mb-8"
                onPress={() => {
                  createReview.mutate({
                    rating: clickedStar,
                    description: reviewDescription,
                    customer_id: customer_id,
                    provider_id: provider_id,
                  });
                }}
              />
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}

export default ReviewModal;
