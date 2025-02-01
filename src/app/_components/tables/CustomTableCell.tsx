import { TableCell } from "@/components/ui/table";
import { cn } from "@/lib/utils";

export function CustomTableCell({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <TableCell
    >
      <div 
        className={cn(
          "text-sm text-gray-600 line-clamp-2",
          className
        )}
        >
        {children}
      </div>
    </TableCell>
  );
}
