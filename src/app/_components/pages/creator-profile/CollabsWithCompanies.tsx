import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";

export default function CollabsWithCompanies() {
  return (
    <Card className="rounded-[20px] p-6 bg-white border-0 shadow-none">
      {/* Header Section */}
      <div className="flex justify-between items-center">
        <h2 className="text-[20px] font-medium text-text">
          Total collabs with companies
        </h2>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="text-font-grey font-semibold px-3 py-1 rounded-lg bg-white"
            >
              Last 7 Days <ChevronDown className="text-xs w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>This Month</DropdownMenuItem>
            <DropdownMenuItem>Last 30 Days</DropdownMenuItem>
            <DropdownMenuItem>Last Year</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Total Count */}
      <div className="mt-3 flex items-center gap-2">
        <span className="text-[40px] font-medium text-text">6,4K</span>
        <span className="text-xs font-medium text-success bg-success-light px-2 py-1 rounded-md">
          +3.4%
        </span>
      </div>

      {/* Progress Indicator */}
      <div className="mt-4 flex h-1.5 w-full rounded-full gap-2">
        <div className="bg-purple h-full w-[25%] rounded-l-full"></div>
        <div className="bg-light-blue h-full w-[25%]"></div>
        <div className="bg-orange h-full w-[25%]"></div>
        <div className="bg-blue h-full w-[25%] rounded-r-full"></div>
      </div>

      {/* Company Stats */}
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <StatCard name="Nike" value="1,1K" growth="+3.4%" color="purple" />
        <StatCard name="Puma" value="2,3K" growth="+11.4%" color="light-blue" />
        <StatCard name="Adidas" value="1,6K" growth="+7.0%" color="orange" />
        <StatCard
          name="Others"
          value="1,5K"
          growth="-1.4%"
          color="blue"
          isNegative
        />
      </div>
    </Card>
  );
}

// Reusable Stat Card Component
function StatCard({
  name,
  value,
  growth,
  color,
  isNegative,
}: {
  name: string;
  value: string;
  growth: string;
  color: string;
  isNegative?: boolean;
}) {
  return (
    <div className="p-4 rounded-lg border bg-white shadow-sm flex flex-col gap-1">
      <div className="flex items-center gap-2">
        <span className={`h-2 w-2 rounded-full bg-${color}`}></span>
        <span className="text-font-grey font-medium">{name}</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-[20px] font-medium text-text">{value}</span>
        <span
          className={`text-xs font-medium px-2 py-1 rounded-md ${
            isNegative
              ? "text-red-600 bg-red-100"
              : "text-success bg-success-light"
          }`}
        >
          {growth}
        </span>
      </div>
    </div>
  );
}
