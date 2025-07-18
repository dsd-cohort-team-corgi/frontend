import React from "react";
import ReviewStars from "./ReviewStars";

export default function ReviewCard() {
  return (
    <section className="flex max-w-[1000px] pt-2">
      {/* max-w-[1000px] so the review doesn't get weirdly stretched out on large screens */}
      <img
        src="/default-profile-image.png"
        className="mt-2 h-[60px] w-[60px]"
        alt="default avatar"
      />
      <div className="w-full">
        <div className="flex justify-between">
          <span> Customer Name </span>
          <span className="text-secondary-font-color"> 2 weeks ago </span>
        </div>
        <ReviewStars className="my-2" />
        <p>
          {" "}
          Review Review Review Review Review Review Review Review Review Review
          Review Review Review Review Review Review Review Review Review Review
          Review Review Review Review Review Review Review Review Review Review
          Review Review Review Review Review Review Review Review Review Review
          Review Review Review Review Review Review Review Review Review Review
          Review Review Review Review Review Review Review Review Review Review
          Review Review Review Review Review Review Review Review Review Review
          Review Review Review Review Review Review Review Review Review Review
          Review Review Review Review Review Review Review Review Review Review
          Review Review Review Review Review Review Review Review Review Review
          Review Review Review Review Review Review Review Review Review Review
          Review Review Review Review Review Review Review Review{" "}
        </p>
      </div>
    </section>
  );
}
