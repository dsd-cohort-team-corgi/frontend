import { ChevronDown as ChevronDownIcon } from "lucide-react";

interface IconProps {
  size?: number;
  color?: string;
  strokeWidth?: number;
  fill?: string;
}
function ChevronDown({ size, color, strokeWidth, fill }: IconProps) {
  return (
    <ChevronDownIcon
      size={size || 24}
      color={color || "currentColor"}
      strokeWidth={strokeWidth || 2}
      fill={fill || "none"}
    />
  );
}

export default ChevronDown;
