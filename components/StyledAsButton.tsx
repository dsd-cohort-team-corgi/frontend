// If you need to customize it with tailwindcss use the className prop
// ex className ="text-lg font-semibold"
// https://www.heroui.com/docs/components/button

// see all available props here: https://www.heroui.com/docs/components/button ex disabled, sizes, radius, loading, icons

// Need a JSX component to look like a button?
// the as prop allows for this
// ex: as={link} as={div}
// The JSX component looks like a button despite rendering as whatever component you desire (<a>,<Link>, ect)
// if you don't use the "as" prop, it will default to rendering as a button

import React from "react";
import { Button as HeroUiButton, type ButtonProps } from "@heroui/react";

type StyledAsButtonProps = ButtonProps & {
  label: string;
};
// grabs all the props of a HeroUiButton (ButtonProps) and adds a custom prop called "label" and types it

export default function StyledAsButton({
  label,
  className, // although className & color are HeroUi Button props, we're destructuring them here so we can override the default values
  color,
  ...rest // href, src, ect
}: StyledAsButtonProps) {
  return (
    <HeroUiButton
      className={`text-white ${className ?? ""}`}
      color="primary"
      // the "primary" color is set in the tailwindcss config file, its currently set to blue

      // {...rest} <== We're intentionally spreading all the possible remaining props here to support polymorphic "as" components
      // Its smart enough to know what additional props the different JSX elements will allow & their types, so it'd just waste time to write down every possible prop
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...rest}
    >
      {label}
    </HeroUiButton>
  );
}

// if we end up needing fine grain control over the button we can switch to this implementation:
// https://www.heroui.com/docs/components/button#custom-implementation
// but this simple wrapper should be enough for what we need
