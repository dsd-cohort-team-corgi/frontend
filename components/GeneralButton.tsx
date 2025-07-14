import React from "react";
import { Button as HeroUiButton } from "@heroui/react";
// importing the Button Component from HeroUi's library but renaming it to HeroUiButton
import type { PressEvent } from "@react-types/shared";
// importing the PressEvent type defintion used by React Aria libaries which heroUi uses
import type { ElementType, ComponentPropsWithoutRef } from "react";

// If you need to customize the button with tailwindcss use the className prop
// ex className ="text-lg font-semibold"
// https://www.heroui.com/docs/components/button

type HeroUiButtonType<Component extends ElementType = "button"> = {
  href?: string;
  as?: ElementType;
  // <....ElementType = "button">: if we do not pass an ElementType with the "as" prop, it will default to rendering like a native button component

  // HeroUI's components expose an "as" prop which allows you to customize the React element type it will render as (<Link> <div>)
  // In other words, it will look like a button but under the hood it will be whatever elementType you pass it such as <Link>
  //  https://www.heroui.com/docs/components/link#polymorphic-component

  // <Component....>: a generic type parameter, in other words a placeholder
  // <Component extends ElementType....>: the component must be an ElementType aka any valid React Component or HTML tag ( button, a, Link, div)
  // this gives us a flexible type "Component" that must always be something that can be rendered in JSX
  variant?:
    | "solid"
    | "bordered"
    | "light"
    | "flat"
    | "faded"
    | "shadow"
    | "ghost";
  label: string;
  size?: "sm" | "md" | "lg";
  radius?: "none" | "sm" | "md" | "lg" | "full";
  color?:
    | "default"
    | "primary"
    | "secondary"
    | "success"
    | "warning"
    | "danger";
  isDisabled?: boolean;
  onPress?: (e: PressEvent) => void;
  isLoading?: boolean;
  className?: string;
} & Omit<ComponentPropsWithoutRef<Component>, "as">;

// `ComponentPropsWithoutRef<Component>` is key to polymorphic components, without it "Component" doesn't understand what props it should accept when we render it as a <a>, <Link>, ect.
// it allows all the props that the ElementType type we gave it accepts (ex: href is allowed for <a> )

// `ComponentPropsWithoutRef<Component>` is needed for intelliSense to work:
// 1. as you type, it will suggest valid props you can use
// 2. if you pass an invalid prop it will warn you
// for example if you say as="a" and try to pass onPress, typescript will warn you it isn't allowed in the inherited prop types for <a> elements
// 3. Hover tooltips for valid prop types
// 4. Tell you component specific props, for <Link> it will be able to tell you the allowed props

// Omit is telling <Component>: when you render as the ElementType <a>, do not pass the "as" prop to the rendered <a> component
// But pass all the other props to the rendered <Component>, just omit "as"
// We are just using "as" to determine the element type it should render as, we don't want to pass the as prop to the rendered component
// Ex: For ElementTypes with inherited "as" prop, this would lead to unexpected behavior or type conflicts

export default function GeneralButton({
  href,
  as,
  variant = "flat",
  label,
  size,
  // size = the button size
  radius,
  color,
  isDisabled,
  isLoading,
  onPress,
  // onPress is heroUi's version of onClick
  // https://react-spectrum.adobe.com/react-aria/Button.html
  //   "Button supports user interactions via mouse, keyboard, and touch. You can handle all of these via the onPress prop. This is similar to the standard onClick event, but normalized to support all interaction methods equally."
  className,
}: HeroUiButtonType) {
  return (
    <HeroUiButton
      href={href}
      as={as}
      variant={variant}
      size={size}
      radius={radius}
      color={color}
      isDisabled={isDisabled}
      isLoading={isLoading}
      onPress={onPress}
      className={className}
    >
      {label}
    </HeroUiButton>
  );
}
