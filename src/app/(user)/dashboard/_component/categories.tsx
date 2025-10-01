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
import { useEffect, useRef, useState } from "react";

type CategoriesProps = {
  categories: ICategory[];
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

  // 🔑 Keep refs for each category
  const categoryRefs = useRef<Record<string, HTMLDivElement | null>>({});

  useEffect(() => {
    const checkScrollable = () => {
      if (channelsRef.current) {
        setChannelsScrollable(
          channelsRef.current.scrollWidth > channelsRef.current.clientWidth
        );
      }
    };

    checkScrollable();
    window.addEventListener("resize", checkScrollable);
    return () => {
      window.removeEventListener("resize", checkScrollable);
    };
  }, [categories]);

  // Auto-focus input on expand
  useEffect(() => {
    if (activeSearch) {
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [activeSearch]);

  // 🔑 Auto-scroll active category into view
  useEffect(() => {
    if (activeCategory && categoryRefs.current[activeCategory]) {
      categoryRefs.current[activeCategory]?.scrollIntoView({
        behavior: "smooth",
        inline: "center", // keeps it centered in the scroll area
        block: "nearest",
      });
    }
  }, [activeCategory]);

  const clearSearch = () => {
    onChange && onChange("");
    setActiveSearch(false);
  };

  const scrollLeft = () => {
    if (channelsRef.current) {
      const visibleWidth = channelsRef.current.clientWidth;
      channelsRef.current.scrollBy({ left: -1 * visibleWidth, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (channelsRef.current) {
      const visibleWidth = channelsRef.current.clientWidth;
      channelsRef.current.scrollBy({ left: visibleWidth, behavior: "smooth" });
    }
  };

  return (
    <div className="flex gap-3 justify-center items-center">
      {channelsScrollable && (
        <div
          className="bg-primary cursor-pointer text-primary-foreground hover:text-primary-foreground rounded-full bg-primary/10 text-primary hover:bg-primary/5  p-2"
          onClick={scrollLeft}
        >
          <ChevronLeft size={20} className="text-primary" />
        </div>
      )}
      <div
        ref={channelsRef}
        className="flex gap-3 overflow-x-auto bg-white p-2 rounded-full [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
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
            const channelLabel = el.name;

            const renderedChannel = (
              <div
                key={el._id}
                ref={(elRef: HTMLDivElement | null) => {
                  categoryRefs.current[el._id] = elRef
                }} // store ref
                className={cn(
                  "rounded-full capitalize h-[36px] px-3 gap-1 cursor-pointer flex items-center",
                  el._id === activeCategory
                    ? "bg-primary/10 text-primary border border-primary hover:bg-primary/5"
                    : "bg-gray-50 text-secondary hover:bg-primary/10 border border-gray-50 hover:border-primary"
                )}
                onClick={() => setActiveCategoryTabId(el._id)}
              >
                <span className="whitespace-nowrap text-sm font-[500]">
                  {channelLabel.length > 20
                    ? channelLabel.substring(0, 20) + "..."
                    : channelLabel}
                </span>
              </div>
            );

            return channelLabel.length > 20 ? (
              <TooltipProvider key={el._id}>
                <Tooltip>
                  <TooltipTrigger>{renderedChannel}</TooltipTrigger>
                  <TooltipContent className="z-[99] px-3 py-2 rounded-md border bg-white text-[14px] max-w-[300px]">
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
          className="bg-primary cursor-pointer text-primary-foreground hover:text-primary-foreground rounded-full bg-primary/10 text-primary hover:bg-primary/5 p-2"
          onClick={scrollRight}
        >
          <ChevronRight size={20} className="text-primary" />
        </div>
      )}
    </div>
  );
}
