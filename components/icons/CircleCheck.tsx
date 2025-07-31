import { CircleCheckBig as CircleCheckIcon } from "lucide-react";

interface IconProps {
  size?: number;
  color?: string;
  strokeWidth?: number;
  fill?: string;
}
function CircleCheck({ size, color, strokeWidth, fill }: IconProps) {
  return (
    <CircleCheckIcon
      size={size || 24}
      color={color || "currentColor"}
      strokeWidth={strokeWidth || 2}
      fill={fill || "none"}
    />
  );
}

export default CircleCheck;
