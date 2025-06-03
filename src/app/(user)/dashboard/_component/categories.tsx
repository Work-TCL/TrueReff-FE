import { ICategory } from "@/lib/types-api/category";
import { getConnectedChannelsList } from "@/lib/web-api/channel";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@radix-ui/react-tooltip";
import { cn } from "@sohanemon/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { startTransition, useEffect, useRef, useState } from "react";
type CategoriesProps = {
    categories: ICategory[]; // Replace `any` with your actual channel type
  activeCategory: string;
  setActiveCategoryTabId: (id: string) => void;
};

export default function Categories({
  categories,
  activeCategory,
  setActiveCategoryTabId,
}: CategoriesProps) {
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
  }, [categories]);

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
          className="bg-primary cursor-pointer text-primary-foreground hover:text-primary-foreground rounded-full bg-primary/10 text-primary hover:bg-primary/5  p-2 gap-1 text-[12px] flex items-center justify-center"
          onClick={scrollLeft}
        >
          <ChevronLeft size={20} className="text-primary" />
        </div>
      )}
      <div
        ref={channelsRef}
        className="flex gap-3 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
      >
        {categories.map((el:ICategory) => {
          const channelLabel = `${el.name}`;

          const renderedChannel = (
            <div
              key={channelLabel}
              className={cn(
                " rounded-full capitalize h-[36px] px-3 gap-1 cursor-pointer",
                el._id === activeCategory
                  ? "bg-primary/90 text-white hover:bg-primary/90 "
                  : "bg-primary/10 text-primary hover:bg-primary/5 "
              )}
              onClick={() => {
                setActiveCategoryTabId(el._id);
              }}
            >
              <span
                className={`flex justify-center h-full items-center whitespace-nowrap text-sm ${
                    el._id === activeCategory ? "font-semibold" : ""
                }`}
              >
                {channelLabel.length > 20
                  ? channelLabel.substring(0, 20) + "..."
                  : channelLabel}
              </span>
            </div>
          );
          return channelLabel.length > 20 ? (
            <TooltipProvider key={channelLabel}>
              <Tooltip>
                <TooltipTrigger>{renderedChannel}</TooltipTrigger>
                <TooltipContent
                  className="z-[99] px-3 py-2 w-auto max-w-[80vw] rounded-md border border-gray-color bg-white text-[14px] md:max-w-[300px] overflow-hidden"
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
          className="bg-primary cursor-pointer text-primary-foreground hover:text-primary-foreground rounded-full bg-primary/10 text-primary hover:bg-primary/5  p-2 gap-1 text-[12px] flex items-center justify-center"
          onClick={scrollRight}
        >
          <ChevronRight size={20} className="text-primary" />
        </div>
      )}
    </div>
  );
}
