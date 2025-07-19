import React from "react";
import FullStar from "./icons/FullStar";

type StarRatingReviewTypes = {
  providerRating?: number;
  numberOfReviews?: number;
};

export default function StarRatingReview({
  providerRating = 4.75,
  numberOfReviews = 65,
}: StarRatingReviewTypes) {
  return (
    <div className="flex">
      <FullStar />
      <span className="pl-1 pr-2 font-bold">{providerRating}</span>
      <span className="text-secondary-font-color">
        {`(${numberOfReviews} reviews)`}
      </span>
    </div>
  );
}
