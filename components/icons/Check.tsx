import { Check as CheckIcon } from "lucide-react";

interface IconProps {
  size?: number;
  color?: string;
  strokeWidth?: number;
  fill?: string;
}
function MapPin({ size, color, strokeWidth, fill }: IconProps) {
  return (
    <CheckIcon
      size={size || 24}
      color={color || "currentColor"}
      strokeWidth={strokeWidth || 2}
      fill={fill || "none"}
    />
  );
}

export default MapPin;
