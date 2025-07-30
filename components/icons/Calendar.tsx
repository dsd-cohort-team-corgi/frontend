import { Calendar as CalendarIcon } from "lucide-react";

interface IconProps {
  size?: number;
  color?: string;
  strokeWidth?: number;
  fill?: string;
}
function Calendar({ size, color, strokeWidth, fill }: IconProps) {
  return (
    <CalendarIcon
      size={size || 24}
      color={color || "currentColor"}
      strokeWidth={strokeWidth || 2}
      fill={fill || "none"}
    />
  );
}

export default Calendar;
