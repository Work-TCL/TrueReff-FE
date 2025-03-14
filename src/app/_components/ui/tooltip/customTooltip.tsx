import * as RadixTooltip from "@radix-ui/react-tooltip";
import React from "react";

// Define the TooltipProvider component
const CustomTooltipProviderComponent: React.FC<{ delayDuration?: number; children: React.ReactNode }> = ({
  delayDuration,
  children,
}) => {
  return <RadixTooltip.Provider delayDuration={delayDuration}>{children}</RadixTooltip.Provider>;
};

// Exporting the TooltipProvider component
export const CustomTooltipProvider = CustomTooltipProviderComponent;

// Define the Tooltip component
const TooltipComponent: React.FC<{ children: React.ReactNode }> & {
  Trigger: React.FC<{ children: React.ReactNode; className?: string }>;
  Content: React.FC<{ children: React.ReactNode; className?: string; side?: "left" | "top" | "right" | "bottom" }>;
} = ({ children }) => {
  return <RadixTooltip.Root>{children}</RadixTooltip.Root>;
};

// Define the Trigger component
TooltipComponent.Trigger = ({ children, className }) => {
  return <RadixTooltip.Trigger className={className}>{children}</RadixTooltip.Trigger>;
};

// Define the Content component
TooltipComponent.Content = ({ children, className, side }) => {
  return (
    <RadixTooltip.Content side={side} className={className}>
      {children}
    </RadixTooltip.Content>
  );
};

// Exporting the components
export { CustomTooltipProvider as ToolTipProvider, TooltipComponent as Tooltip }; // Exporting the Tooltip component with a new name