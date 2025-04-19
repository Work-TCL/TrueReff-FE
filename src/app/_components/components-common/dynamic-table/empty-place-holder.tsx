import { Info } from "lucide-react";
import React from "react";

interface EmptyPlaceholderProps {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
}

export function EmptyPlaceholder({
  title = "No Data Available",
  description = "There's nothing to show here yet.",
  icon = <Info className="mx-auto mb-2 text-gray-400" />,
}: EmptyPlaceholderProps) {
  return (
    <div className="flex items-center justify-center flex-col text-center h-[200px] text-gray-500 p-4 bg-white flex-1 h-full">
      {icon}
      <h2 className="text-lg font-semibold">{title}</h2>
      <p className="text-sm">{description}</p>
    </div>
  );
}
