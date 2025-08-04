import { Maximize2 as MaximizeIcon } from "lucide-react";

interface IconProps {
  size?: number;
  color?: string;
  strokeWidth?: number;
  fill?: string;
}
function Maximize({ size, color, strokeWidth, fill }: IconProps) {
  return (
    <MaximizeIcon
      size={size || 24}
      color={color || "currentColor"}
      strokeWidth={strokeWidth || 2}
      fill={fill || "none"}
    />
  );
}

export default Maximize;
