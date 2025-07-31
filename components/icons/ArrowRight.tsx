import { ArrowRight as ArrowRightIcon } from "lucide-react";

interface IconProps {
  size?: number;
  color?: string;
  strokeWidth?: number;
  fill?: string;
}
function ArrowRight({ size, color, strokeWidth, fill }: IconProps) {
  return (
    <ArrowRightIcon
      size={size || 24}
      color={color || "currentColor"}
      strokeWidth={strokeWidth || 2}
      fill={fill || "none"}
    />
  );
}

export default ArrowRight;
