import { Phone as PhoneIcon } from "lucide-react";
interface IconProps {
  size?: number;
  color?: string;
  strokeWidth?: number;
  fill?: string;
}
function Phone({ size, color, strokeWidth, fill }: IconProps) {
  return (
    <PhoneIcon
      size={size ? size : 24}
      color={color ? color : "currentColor"}
      strokeWidth={strokeWidth ? strokeWidth : 2}
      fill={fill ? fill : "none"}
    />
  );
}

export default Phone;
