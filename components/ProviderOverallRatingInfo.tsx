import React from "react";
import FullStar from "./icons/FullStar";

type StarRatingReviewTypes = {
  providerRating?: number | null;
  numberOfReviews?: number;
};

export default function StarRatingReview({
  providerRating,
  numberOfReviews,
}: StarRatingReviewTypes) {
  return (
    <div className="flex text-xs">
      <FullStar width={16} height={16} />
      <span className="pl-1 pr-1 font-bold">
        {providerRating?.toFixed(2) || "No ratings yet"}
      </span>
      <span className="text-secondary-font-color">
        {`(${numberOfReviews || 0} reviews)`}
      </span>
    </div>
  );
}
