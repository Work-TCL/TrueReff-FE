// import useIsTruncate from '@/lib/hooks/useIsTruncate';
// import { Text } from '@/components/ui/text';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@radix-ui/react-tooltip";
import { cn } from "@sohanemon/utils";
import useIsTruncate from "./useIsTruncate";

export default function TruncateWithToolTip({
  text,
  className,
  tooltipContentClassName,
  checkHorizontalOverflow = false, // New prop to determine overflow direction
}: {
  text: string;
  className?: string;
  tooltipContentClassName?: string;
  checkHorizontalOverflow?: boolean;
}) {
  const { showTooltip, handleMouseEnterTruncate, handleMouseLeaveTruncate } =
    useIsTruncate(checkHorizontalOverflow);

  return (
    <TooltipProvider>
      <Tooltip>
        {showTooltip ? ( // Conditionally wrap in TooltipTrigger
          <TooltipTrigger asChild>
            <p className={cn("line-clamp-1 w-fit", className)}>{text}</p>
          </TooltipTrigger>
        ) : (
          <p
            className={cn("line-clamp-1 w-fit", className)}
            onMouseEnter={handleMouseEnterTruncate}
            onMouseLeave={handleMouseLeaveTruncate}
          >
            {text}
          </p>
        )}
        <TooltipContent
          side="bottom"
          className={cn(
            "w-auto max-w-[80vw] rounded-md border border-igray-color bg-white text-[14px] md:max-w-[50vw]",
            tooltipContentClassName
          )}
        >
          <p className="rounded-md bg-white text-sm p-2">{text}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
