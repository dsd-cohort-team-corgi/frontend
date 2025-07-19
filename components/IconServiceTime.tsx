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
    <div className="group my-3 flex flex-col items-center rounded-lg border-1 border-light-accent p-4 hover:border-2 hover:border-primary sm:flex-row">
      {/* group is used so when the div is hovered over the leaf icon also turns blue */}
      <span className="bg-slate-200 p-2 group-hover:bg-slate-300">
        <Leaf className="group-hover:fill-primary" />
      </span>
      <p className="pl-4 pr-2 font-bold"> {description} </p>
      <span className="text-secondary-font-color"> {`(${time} mins)`}</span>
      <span className="pl-2 font-bold sm:ml-auto"> {`$${price}`} </span>
      {/* ml-auto works because its basically telling the last item, hey I want you to put as much margin on your left as you possibly can
       So it gets shoved to the right
       with flexbox and grid layouts, auto margins will take over the leftover space. Since everything else is staying to the left, theres a ton of space to the right
       */}
    </div>
  );
}
