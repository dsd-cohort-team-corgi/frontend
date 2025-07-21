"use client";

import { Button } from "@heroui/react";
import React, { Dispatch, SetStateAction } from "react";
import { Leaf } from "lucide-react";

import objectIsEmptyCheck from "@/utils/objectIsEmptyCheck";

type IconServiceTimeType = {
  description: string;
  time: number;
  price: number;
  setSelectedService: Dispatch<SetStateAction<Record<string, string | number>>>;
  selectedService: object;
};

export default function IconServiceTime({
  description,
  time,
  price,
  setSelectedService,
  selectedService,
}: IconServiceTimeType) {
  const handleClick = () => {
    if (objectIsEmptyCheck(selectedService)) {
      setSelectedService({ description, time, price });
    } else {
      setSelectedService({});
    }
  };
  return (
    <Button
      type="button"
      className="group my-3 flex h-fit w-full flex-col items-center rounded-lg border-1 border-light-accent bg-transparent p-4 text-[1rem] hover:border-2 hover:border-primary sm:flex-row"
      onPress={handleClick}
    >
      {/* group is used so when the div is hovered over the leaf icon also turns blue */}

      <span className="inline-block bg-slate-200 p-2 group-hover:bg-slate-300">
        <Leaf className="group-hover:stroke-primary" />
      </span>
      <p className="inline-block pl-4 pr-2 font-bold"> {description} </p>

      <span className="text-secondary-font-color"> {`(${time} mins)`}</span>
      <span className="pl-2 font-bold sm:ml-auto"> {`$${price}`} </span>
      {/* ml-auto works because its basically telling the last item, hey I want you to put as much margin on your left as you possibly can
       So it gets shoved to the right
       with flexbox and grid layouts, auto margins will take over the leftover space. Since everything else is staying to the left, theres a ton of space to the right
       */}
    </Button>
  );
}
