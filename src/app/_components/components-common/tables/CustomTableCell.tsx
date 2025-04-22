"use client";
import React from "react";
import { TableCell } from "@/components/ui/table";
import { cn } from "@/lib/utils/commonUtils";

export function CustomTableCell({ children, className, parentClassName }: { children: React.ReactNode; className?: string, parentClassName?: string }) {
  return (
    <TableCell className={cn(parentClassName)}>
      <div 
        className={cn(
          "text-sm text-gray-600 line-clamp-2 text-left",
          className
        )}
        >
        {children}
      </div>
    </TableCell>
  );
}
