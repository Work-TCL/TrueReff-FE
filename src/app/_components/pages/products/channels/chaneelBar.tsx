import { getConnectedChannelsList } from "@/lib/web-api/channel";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@radix-ui/react-tooltip";
import { cn } from "@sohanemon/utils";
import { ChevronLeft } from "lucide-react";
import { startTransition, useEffect, useRef, useState } from "react";
type ChannelBarProps = {
  channels: Array<any>; // Replace `any` with your actual channel type
  activeChannelTabId: string;
  setActiveChannelTabId: (id: string) => void;
};

export default function ChannelBar({
  channels,
  activeChannelTabId,
  setActiveChannelTabId,
}: ChannelBarProps) {
  const channelsRef = useRef<HTMLDivElement | null>(null);
  const [channelsScrollable, setChannelsScrollable] = useState(false);

  useEffect(() => {
    const checkScrollable = () => {
      if (channelsRef.current) {
        setChannelsScrollable(
          channelsRef.current.scrollWidth > channelsRef.current.clientWidth
        );
      }
    };

    // Check if the div is scrollable on mount and on window resize
    checkScrollable();
    window.addEventListener("resize", checkScrollable);

    return () => {
      window.removeEventListener("resize", checkScrollable);
    };
  }, [channels]);

  /**
   * Scrolls the channels container to the left with smooth animation.
   *
   * @return {void} No return value.
   */
  const scrollLeft = () => {
    if (channelsRef.current) {
      const visibleWidth = channelsRef.current.clientWidth;

      channelsRef.current.scrollBy({
        left: -1 * visibleWidth,
        behavior: "smooth",
      });
    }
  };

  /**
   * Scrolls the channels container to the right with smooth animation.
   *
   * @return {void} No return value.
   */
  const scrollRight = () => {
    if (channelsRef.current) {
      const visibleWidth = channelsRef.current.clientWidth;

      channelsRef.current.scrollBy({
        left: visibleWidth,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="flex gap-3 items-center">
      {channelsScrollable && (
        <div
          className="bg-primary text-primary-foreground hover:text-primary-foreground rounded-full bg-primary/10 text-primary hover:bg-primary/5 h-[36px] px-3 gap-1 text-[12px] flex items-center justify-center"
          onClick={scrollLeft}
        >
          <ChevronLeft className="mr-0.5 size-[11px] text-primary" />
        </div>
      )}
      <div
        ref={channelsRef}
        className="flex gap-3 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
      >
        {channels.map((el) => {
          const channelLabel = `${el.channelType}(${el?.channelConfig?.name})`;

          const renderedChannel = (
            <div
              key={el.value}
              className={cn(
                " rounded-full capitalize h-[36px] px-3 gap-1",
                el.channelType === activeChannelTabId
                  ? "bg-primary/90 text-white hover:bg-primary/90 "
                  : "bg-primary/10 text-primary hover:bg-primary/5 "
              )}
              onClick={() => {
                setActiveChannelTabId(el.channelType);
              }}
            >
              <span
                className={`flex justify-center h-full items-center whitespace-nowrap ${
                  el.channelType === activeChannelTabId ? "font-semibold" : ""
                }`}
              >
                {channelLabel.length > 15
                  ? channelLabel.substring(0, 15) + "..."
                  : channelLabel}
              </span>
            </div>
          );
          return channelLabel.length > 15 ? (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>{renderedChannel}</TooltipTrigger>
                <TooltipContent
                  className="z-[99] px-3 py-2 w-auto max-w-[80vw] rounded-md border border-igray-color bg-white text-[14px] md:max-w-[300px] overflow-hidden"
                  side="bottom"
                >
                  {channelLabel}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ) : (
            renderedChannel
          );
        })}
      </div>
      {channelsScrollable && (
        <div
          className="bg-primary text-primary-foreground hover:text-primary-foreground rounded-full bg-primary/10 text-primary hover:bg-primary/5 h-[36px] px-3 gap-1 text-[12px] flex items-center justify-center"
          onClick={scrollRight}
        >
          <ChevronLeft className="mr-0.5 size-[11px] text-primary" />
        </div>
      )}
    </div>
  );
}
