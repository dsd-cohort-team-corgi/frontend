import React from "react";
import Leaf from "./icons/Leaf";

type IconServiceTimeType = {
  description: string;
  time: number;
  price: number;
};

export default function IconServiceTime({
  description,
  time,
  price,
}: IconServiceTimeType) {
  return (
    <div className="group flex items-center rounded-lg p-6 hover:border-2 hover:border-primary">
      {/* group is used so when the div is hovered over the leaf icon also turns blue */}
      <Leaf className="group-hover:fill-primary" />
      <p className="pl-4 pr-2 font-bold"> {description} </p>
      <span className="text-secondary-font-color"> {`(${time} mins)`}</span>
      <span className="ml-auto"> {`$${price}`} </span>
      {/* ml-auto works because its basically telling the last item, hey I want you to put as much margin on your left as you possibly can
       So it gets shoved to the right
       with flexbox and grid layouts, auto margins will take over the leftover space. Since everything else is staying to the left, theres a ton of space to the right
       */}
    </div>
  );
}
