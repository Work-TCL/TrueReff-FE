"use client";
import { Input } from "@/components/ui/input"; // adjust path as needed
import { cn } from "@/lib/utils/commonUtils";
import { Search } from "lucide-react";

interface SearchInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  className?: string;
}

export const SearchInput = ({
  value,
  onChange,
  placeholder = "Search...",
  className = "",
}: SearchInputProps) => {
  return (
    <div
      className={cn(`relative md:text-[20px] text-base text-500 md:max-w-[350px] w-full`,className)}
    >
      <Input
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="p-3 rounded-lg bg-white pl-10  w-full gray-color" // Add padding to the left for the icon
      />
      <Search className="absolute shrink-0 size-5 left-3 top-1/2 transform -translate-y-1/2 text-gray-color" />
    </div>
  );
};
