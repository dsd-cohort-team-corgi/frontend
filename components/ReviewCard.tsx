import React from "react";
import ReviewStarRating from "./ReviewStarRating";

type ReviewCardType = {
  customerName?: string;
  createdAt?: string;
  description?: string;
  rating?: number;
};

export default function ReviewCard({
  customerName,
  createdAt,
  description,
  rating,
}: ReviewCardType) {
  return (
    <section className="my-10 flex max-w-[1000px] px-4 pt-2">
      {/* max-w-[1000px] so the review doesn't get weirdly stretched out on large screens */}
      <img
        src="/default-profile-image.png"
        className="mr-2 mt-2 h-[60px] w-[60px]"
        alt="default avatar"
      />

      <div>
        <div className="flex justify-between">
          <span> {customerName} </span>
          <span className="text-xs text-secondary-font-color">
            {" "}
            {createdAt}
          </span>
        </div>
        <ReviewStarRating rating={rating} />
        <p>{description}</p>
      </div>
    </section>
  );
}
