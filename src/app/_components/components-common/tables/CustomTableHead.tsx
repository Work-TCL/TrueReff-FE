import { TableHead } from "@/components/ui/table";
import { cn } from "@/lib/utils/commonUtils";

export function CustomTableHead({ className, children }: { className?: string; children: React.ReactNode }) {
  return <TableHead className={cn("text-sm text-gray-600 whitespace-nowrap p-4", className)}>{children}</TableHead>;
}
