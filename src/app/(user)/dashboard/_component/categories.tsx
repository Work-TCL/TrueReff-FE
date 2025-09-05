import { ICategory } from "@/lib/types-api/category";
import { getConnectedChannelsList } from "@/lib/web-api/channel";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@radix-ui/react-tooltip";
import { cn } from "@sohanemon/utils";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import { startTransition, useEffect, useRef, useState } from "react";
type CategoriesProps = {
  categories: ICategory[]; // Replace `any` with your actual channel type
  activeCategory: string;
  setActiveCategoryTabId: (id: string) => void;
  isIncludeSearch?: boolean;
  onChange?: (val: string) => void;
  search?: string;
};

export default function Categories({
  categories,
  activeCategory,
  setActiveCategoryTabId,
  isIncludeSearch = false,
  onChange,
  search,
}: CategoriesProps) {
  const channelsRef = useRef<HTMLDivElement | null>(null);
  const [channelsScrollable, setChannelsScrollable] = useState(false);
  const [activeSearch, setActiveSearch] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

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

  // Auto-focus input on expand
  useEffect(() => {
    if (activeSearch) {
      setTimeout(() => inputRef.current?.focus(), 150); // slight delay for smooth animation
    }
  }, [activeSearch]);

  const clearSearch = () => {
    onChange && onChange("");
    setActiveSearch(false);
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
    <div className="flex gap-3 justify-center items-center">
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
        className={`flex gap-3 overflow-x-auto bg-white p-2 rounded-full [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]`}
      >
        {isIncludeSearch && (
          <TooltipProvider key="search">
            <Tooltip>
              <TooltipTrigger>
                <div
                  key="search"
                  className={cn(
                    "flex items-center transition-all duration-300 ease-in-out rounded-full h-[36px] border px-2",
                    activeSearch
                      ? "bg-white text-primary border-primary sm:w-96 w-full justify-center"
                      : "bg-gray-50 text-secondary border-gray-200 hover:border-primary w-[36px] justify-center"
                  )}
                  onClick={() => {
                    if (!activeSearch) setActiveSearch(true);
                  }}
                >
                  <Search className="text-gray-500 w-4 h-4" />
                  {activeSearch && (
                    <input
                      ref={inputRef}
                      type="text"
                      value={search}
                      placeholder="Search"
                      onChange={(e) => onChange && onChange(e.target.value)}
                      onClick={(e) => e.stopPropagation()} // prevent div click
                      onBlur={() => {
                        if (activeSearch && !search) {
                          setActiveSearch(false);
                        }
                      }}
                      className={cn(
                        "bg-transparent outline-none text-sm font-medium ml-2 transition-all duration-300 text-secondary",
                        activeSearch ? "w-full opacity-100" : "w-0 opacity-0"
                      )}
                    />
                  )}
                  {activeSearch && search && (
                    <div
                      role="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        clearSearch();
                      }}
                      className="ml-1 text-gray-500 hover:text-red-500 transition"
                    >
                      ✕
                    </div>
                  )}
                </div>
              </TooltipTrigger>
              <TooltipContent
                className="z-[99] px-3 py-2 w-auto max-w-[80vw] rounded-md border border-gray-color bg-white text-[14px] md:max-w-[300px] overflow-hidden"
                side="bottom"
              >
                Search
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
        {!activeSearch &&
          categories.map((el: ICategory) => {
            const channelLabel = `${el.name}`;

            const renderedChannel = (
              <div
                key={channelLabel}
                className={cn(
                  " rounded-full capitalize h-[36px] px-3 gap-1 cursor-pointer",
                  el._id === activeCategory
                    ? "bg-primary/10 text-primary border border-primary hover:bg-primary/5 "
                    : "bg-gray-50 text-secondary hover:bg-primary/10 border border-gray-50 hover:border-primary"
                )}
                onClick={() => {
                  setActiveCategoryTabId(el._id);
                }}
              >
                <span
                  className={`flex justify-center h-full items-center whitespace-nowrap text-sm font-[500] ${
                    el._id === activeCategory ? "text-secondary" : ""
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
