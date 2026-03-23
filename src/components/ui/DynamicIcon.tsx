import { icons } from "lucide-react";

export interface DynamicIconProps extends React.SVGProps<SVGSVGElement> {
  name: string;
}

export function DynamicIcon({ name, ...props }: DynamicIconProps) {
  // Use "Circle" or a valid default if the requested icon isn't found
  const IconComponent = (icons as any)[name] || icons.Circle;
  return <IconComponent {...props} />;
}
