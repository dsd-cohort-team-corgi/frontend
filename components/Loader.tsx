import React from 'react';

// Define the shape of the props for our LoaderSpinner component
interface LoaderSpinnerProps {
  /**
   * The size of the spinner.
   * Uses Tailwind's width/height scale (e.g., 'w-8' is 32px, 'w-16' is 64px).
   * @default 'w-8 h-8'
   */
  size?: string;
  /**
   * The color of the spinner.
   * Uses Tailwind's text/border color classes (e.g., 'text-blue-500', 'text-gray-400').
   * This color will be used for the visible part of the spinner.
   * @default 'text-blue-500'
   */
  color?: string;
  /**
   * The color of the spinner's transparent part (the "background" ring).
   * Uses Tailwind's border color classes (e.g., 'border-gray-200').
   * @default 'border-gray-200'
   */
  ringColor?: string;
  /**
   * The thickness of the spinner border.
   * Uses Tailwind's border width classes (e.g., 'border-2', 'border-4').
   * @default 'border-4'
   */
  thickness?: string;
  /**
   * Additional Tailwind CSS classes to apply to the spinner.
   * Useful for custom margins, positioning, etc.
   */
  className?: string;
}

const LoaderSpinner: React.FC<LoaderSpinnerProps> = ({
  size = 'w-8 h-8',
  color = 'text-blue-500',
  ringColor = 'border-gray-200',
  thickness = 'border-4',
  className = '',
}) => {
  return (
    <div
      className={`
        ${size}
        ${thickness}
        border-solid
        rounded-full
        animate-spin
        ${ringColor}
        border-t-${color.split('-')[1] || 'current'}
        ${className}
      `}
      // The `border-t-${color.split('-')[1] || 'current'}` line dynamically sets
      // the top border color using the suffix of the 'color' prop (e.g., 'blue-500' -> '500')
      // and falls back to 'current' if the color prop isn't in a standard Tailwind format.
      // This makes the active part of the spinner match the `color` prop.
    ></div>
  );
};

export default LoaderSpinner;