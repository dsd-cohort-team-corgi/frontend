import React from "react";
import Leaf from "./icons/Leaf";

type IconServiceTimeType = {
  description: string;
  time: number;
};

export default function IconServiceTime({
  description,
  time,
}: IconServiceTimeType) {
  return (
    <div className="group flex items-center rounded-lg p-6 hover:border-2 hover:border-primary">
      {/* group is used so when the div is hovered over the leaf icon also turns blue */}
      <Leaf className="group-hover:fill-primary" />
      <p className="pl-4 pr-2 font-bold"> {description} </p>
      <span className="text-secondary-font-color"> {`(${time} mins)`}</span>
    </div>
  );
}
