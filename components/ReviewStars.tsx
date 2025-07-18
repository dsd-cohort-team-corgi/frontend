"use client";

import React from "react";
import RepeatComponentXTimes from "@/utils/repeatComponentXTimes";
import FullStar from "./icons/FullStar";

export default function ReviewStars() {
  //   const [numberOfStars, setNumberOfStars] = useState(0);
  //   let emptyStars = 5 - numberOfStars;
  const numberOfStars = 5;

  return (
    <RepeatComponentXTimes
      className="flex"
      times={numberOfStars}
      Element={FullStar}
    />
  );
}
