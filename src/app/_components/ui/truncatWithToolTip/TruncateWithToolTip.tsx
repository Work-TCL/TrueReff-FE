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
  linesToClamp = 2, // 👈 New prop to support custom line clamping
}: {
  text?: string;
  className?: string;
  tooltipContentClassName?: string;
  checkHorizontalOverflow?: boolean;
  linesToClamp?: number;
}) {
  const {
    showTooltip,
    handleMouseEnterTruncate,
    handleMouseLeaveTruncate,
    textRef,
  } = useIsTruncate(checkHorizontalOverflow);

  return (
    <TooltipProvider>
      <Tooltip>
        {showTooltip ? ( // Conditionally wrap in TooltipTrigger
          <TooltipTrigger asChild>
            <p className={cn(`line-clamp-${linesToClamp}`, className)}>
              {text}
            </p>
          </TooltipTrigger>
        ) : (
          <p
            ref={textRef}
            className={cn(`line-clamp-${linesToClamp}`, className)}
            onMouseEnter={handleMouseEnterTruncate}
            onMouseLeave={handleMouseLeaveTruncate}
          >
            {text}
          </p>
        )}
        <TooltipContent
          side="bottom"
          className={cn(
            "z-[99] w-auto max-w-[80vw] rounded-md border border-igray-color bg-white text-[14px] md:max-w-[300px] overflow-hidden",
            tooltipContentClassName
          )}
        >
          <p className="rounded-md bg-white text-sm p-2 break-words whitespace-normal">
            {text}
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
