"use client";

import React from "react";
import RepeatComponentXTimes from "@/utils/repeatComponentXTimes";
import FullStar from "./icons/FullStar";

type ReviewStarsType = {
  className?: string;
};

export default function ReviewStars({ className }: ReviewStarsType) {
  //   const [numberOfStars, setNumberOfStars] = useState(0);
  //   let emptyStars = 5 - numberOfStars;
  const numberOfStars = 5;

  return (
    <RepeatComponentXTimes
      className={`flex ${className}`}
      times={numberOfStars}
      Element={FullStar}
    />
  );
}
