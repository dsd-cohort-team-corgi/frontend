import React from "react";
import ReviewStars from "./ReviewStars";

type ReviewCardType = {
  customerName?: string;
  reviewTime?: string;
  reviewText?: string;
  reviewRating?: number;
};

export default function ReviewCard({
  customerName = "Sarah Johnson",
  reviewTime = "2 weeks",
  reviewText = "Great service! Very professional and thorough. Mike arrived on time and did an excellent job on my lawn. The attention to detail was impressive.",
  reviewRating = 5,
}: ReviewCardType) {
  return (
    <section className="my-10 flex max-w-[1000px] pt-2">
      {/* max-w-[1000px] so the review doesn't get weirdly stretched out on large screens */}
      <img
        src="/default-profile-image.png"
        className="mr-2 mt-2 h-[60px] w-[60px]"
        alt="default avatar"
      />

      <div>
        <div className="flex justify-between">
          <span> {customerName} </span>
          <span className="text-secondary-font-color">
            {" "}
            {`${reviewTime} ago`}{" "}
          </span>
        </div>
        <ReviewStars reviewRating={reviewRating} className="my-2" />
        <p>{reviewText}</p>
      </div>
    </section>
  );
}
