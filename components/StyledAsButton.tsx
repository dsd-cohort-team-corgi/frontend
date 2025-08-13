import React from "react";
import { Button as HeroUiButton, type ButtonProps } from "@heroui/react";

type StyledAsButtonProps = ButtonProps & {
  label?: string;
};

export default function StyledAsButton({
  label,
  className,
  color,
  ...rest
}: StyledAsButtonProps) {
  return (
    <HeroUiButton
      className={`text-white ${className ?? ""}`}
      color="primary"
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...rest}
    >
      {label}
    </HeroUiButton>
  );
}
