"use client";

import React, { useState } from "react";
import RepeatComponentXTimes from "@/utils/repeatComponentXTimes";
import FullStar from "./icons/FullStar";

type ReviewStarsType = {
  className?: string;
  rating?: number;
};

export default function ReviewStars({
  className,
  rating = 0,
}: ReviewStarsType) {
  const [numberOfStars, setNumberOfStars] = useState(rating);
  //   let emptyStars = 5 - numberOfStars;

  return (
    <RepeatComponentXTimes
      className={`flex ${className}`}
      times={numberOfStars}
      Element={FullStar}
    />
  );
}
