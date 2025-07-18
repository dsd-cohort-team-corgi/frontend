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
    <div className="flex items-center">
      <Leaf />
      <p className="pl-4 pr-2 font-bold"> {description} </p>
      <span className="text-secondary-font-color"> {`(${time} mins)`}</span>
    </div>
  );
}
