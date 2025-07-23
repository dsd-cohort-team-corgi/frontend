import { User as UserIcon } from "lucide-react";

interface IconProps {
  size?: number;
  color?: string;
  strokeWidth?: number;
  fill?: string;
}

function User({ size, color, strokeWidth, fill }: IconProps) {
  return (
    <UserIcon
      size={size ? size : 24}
      color={color ? color : "currentColor"}
      strokeWidth={strokeWidth ? strokeWidth : 2}
      fill={fill ? fill : "none"}
    />
  );
}

export default User;
