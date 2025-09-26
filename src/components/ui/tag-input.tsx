"use client";
import { useState, useCallback } from "react";
import { Tag, X } from "lucide-react";
import { debounce } from "lodash";
import { cn } from "@/lib/utils/commonUtils";
import axios from "@/lib/web-api/axios";
import { formatNumber } from "@/lib/utils/constants";
import { useTranslations } from "next-intl";

interface ITag {
  _id: string;
  name: string;
  usages: number;
}
export default function TagInput({
  labelClassName,
  value = [],
  onChange,
  error,
  isRequired = true,
}: {
  labelClassName?: string;
  value: string[];
  onChange: (tags: string[]) => void;
  error?: string;
  isRequired?: boolean;
}) {
  const translate = useTranslations();
  const [input, setInput] = useState("");
  const [suggestions, setSuggestions] = useState<ITag[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);

  const fetchSuggestions = async (query: string) => {
    if (!query.trim()) {
      setSuggestions([]);
      setShowDropdown(false);
      return;
    }

    try {
      const response = await axios.get(
        `/auth/user/tag-suggestion?search=${query}`
      );
      const data = response?.data?.data?.length > 0 ? response?.data?.data : [];
      setSuggestions(data);
      setShowDropdown(data.length > 0);
    } catch {
      setSuggestions([]);
      setShowDropdown(false);
    }
  };

  const debouncedSearch = useCallback(
    debounce((value: string) => {
      fetchSuggestions(value);
    }, 500),
    []
  );
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
    debouncedSearch(e.target.value);
  };

  const handleAddTag = (tag: string) => {
    if (!value.includes(tag)) {
      onChange([...value, tag]);
    }
    setInput("");
    setSuggestions([]);
    setShowDropdown(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && input.trim()) {
      e.preventDefault();
      const existing = suggestions.find(
        (s) => s?.name.toLowerCase() === input.trim().toLowerCase()
      )?.name;
      handleAddTag(existing || input.trim());
    }
  };
  const handleOnOk = () => {
    if (input.trim()) {
      const existing = suggestions.find(
        (s) => s?.name.toLowerCase() === input.trim().toLowerCase()
      )?.name;
      handleAddTag(existing || input.trim());
    }
  };

  const handleRemoveTag = (tag: string) => {
    onChange(value.filter((t) => t !== tag));
  };

  return (
    <div className="w-full">
      <label
        className={cn(
          "text-md font-[400] text-gray-500 mb-1 flex items-center gap-1",
          labelClassName
        )}
      >
        {translate("Tags")}
        {isRequired && <span className="text-red-500">*</span>}
      </label>
      <div className="relative">
        <div className="relative w-full flex justify-between sm:gap-0 gap-2 items-center">
          <input
            type="text"
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder={translate("Type_to_search_or_create_a_tag")}
            className={cn(
              "w-full pl-10 sm:py-4 py-3 rounded-xl font-medium border border-gray-light placeholder:text-gray-color placeholder:font-normal text-sm focus:outline-none focus:border-gray-light focus:bg-white disabled:cursor-not-allowed"
            )}
          />
          <Tag
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
            size={16}
          />
          <button
            type="button"
            onClick={() => {
              if (input.trim()) {
                handleOnOk();
              }
            }}
            className="block md:hidden px-3 py-2 bg-primary text-white rounded-md"
          >
            +
          </button>
        </div>

        {showDropdown && suggestions.length > 0 && (
          <ul className="absolute z-10 bg-white border mt-1 w-full rounded shadow text-sm max-h-60 overflow-y-auto">
            {suggestions.map((tag, i) => (
              <li
                key={i}
                className="px-4 py-2 hover:bg-gray-200 cursor-pointer"
                onClick={() => handleAddTag(tag?.name)}
              >
                <div className="flex flex-col">
                  <span className="font-medium text-gray-900">
                    #{tag?.name}
                  </span>
                  <span className="text-xs text-gray-500">
                    {formatNumber(tag?.usages)} uses
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
      {error && (
        <span className="text-red-600 text-sm pt-2 px-2 block">{error}</span>
      )}
      <div className="flex flex-wrap gap-2 mt-2">
        {value.map((tag: string, index: number) => (
          <span
            key={index}
            className="flex items-center bg-secondary rounded-full text-white py-1 px-2"
          >
            #{tag}
            <button
              type="button"
              onClick={() => handleRemoveTag(tag)}
              className="ml-1 text-sm"
            >
              <X size={18} onClick={() => handleRemoveTag(tag)} />
            </button>
          </span>
        ))}
      </div>
    </div>
  );
}
