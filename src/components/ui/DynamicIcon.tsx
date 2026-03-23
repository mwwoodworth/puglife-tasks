import { icons } from "lucide-react";

export interface DynamicIconProps extends React.SVGProps<SVGSVGElement> {
  name: string;
}

/**
 * DynamicIcon renders a Lucide icon by name and applies
 * consistent, friendly "Pug Life" colors (soft purples, pinks, ambers)
 * unless an explicit color class or prop is provided.
 */
export function DynamicIcon({ name, className, ...props }: DynamicIconProps) {
  const IconComponent = (icons as any)[name] || icons.Circle;

  // Detect if the caller already provided a color
  const hasExplicitColor =
    className?.includes("text-") ||
    !!props.color ||
    !!props.stroke ||
    !!props.fill;

  // Choose a cute default based on the icon name
  let cuteDefault = "text-purple-400"; // Default soft purple
  const lowName = name.toLowerCase();

  if (lowName.includes("heart") || lowName.includes("love") || lowName.includes("pink")) {
    cuteDefault = "text-pink-400";
  } else if (
    lowName.includes("sun") ||
    lowName.includes("star") ||
    lowName.includes("amber") ||
    lowName.includes("trophy") ||
    lowName.includes("award")
  ) {
    cuteDefault = "text-amber-400";
  } else if (lowName.includes("sparkle") || lowName.includes("party") || lowName.includes("fuchsia")) {
    cuteDefault = "text-fuchsia-400";
  } else if (lowName.includes("coffee") || lowName.includes("drink") || lowName.includes("cup")) {
    cuteDefault = "text-rose-300";
  } else if (lowName.includes("paw") || lowName.includes("dog") || lowName.includes("bone")) {
    cuteDefault = "text-purple-300";
  }

  const finalClassName = hasExplicitColor 
    ? className 
    : `${cuteDefault} ${className || ""}`.trim();

  return <IconComponent className={finalClassName} {...props} />;
}
