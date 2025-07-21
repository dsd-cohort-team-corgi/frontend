import React, { useState } from "react";
import { Button } from "@heroui/react";
import emptyOrFullStar from "@/utils/emptyOrFullStar";

type StarRatingType = {
  disabled?: boolean;
  rating?: number;
};

export default function StarRating({
  disabled = true,
  rating = 0,
}: StarRatingType) {
  const [numberOfStars, setNumberOfStars] = useState(rating);

  return (
    <div className="m-0 flex flex-nowrap gap-0 p-0">
      {Array.from({ length: 5 }).map((_, index) => (
        <Button
          onPress={() => setNumberOfStars(index + 1)}
          key={`star #${index + 1}`}
          startContent={emptyOrFullStar(index, numberOfStars)}
          className="min-w-2 bg-transparent px-0"
          // min-w-2 gets rid of heroui's default min-w-20
          disabled={disabled}
        />
      ))}
    </div>
  );
}
