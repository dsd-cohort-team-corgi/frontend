import React from "react";
import { LucideProps } from "lucide-react";

type IconLeftTwoTextRightType = {
  icon: React.ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>
  >;
  heading: string;
  text: string;
};
export default function IconLeftTwoTextRight({
  icon: Icon,
  heading,
  text,
}: IconLeftTwoTextRightType) {
  return (
    <div className="my-4 flex items-center rounded-xl bg-gray-50 py-2 pl-2">
      <Icon color="#2563eb" />
      <div className="pl-4">
        <span className="block font-semibold">{heading} </span>
        <span className="block text-secondary-font-color"> {text} </span>
      </div>
    </div>
  );
}
