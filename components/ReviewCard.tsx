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
    <section className="my-4 max-w-[1000px] px-4 pt-2">
      {/* max-w-[1000px] so the review doesn't get weirdly stretched out on large screens */}
      <img
        src="/default-profile-image.png"
        className="mr-2 mt-2 h-[60px] w-[60px]"
        alt="default avatar"
      />

      <div className="w-full">
        <div className="w-full items-center justify-between">
          <span> {customerName} </span>
        </div>
        <ReviewStarRating rating={rating} />
        <p className="italic text-secondary-font-color">{description}</p>
        <p className="text-xs text-light-font-color">{createdAt}</p>
      </div>
    </section>
  );
}
