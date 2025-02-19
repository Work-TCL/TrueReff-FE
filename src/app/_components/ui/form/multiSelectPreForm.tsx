import React, { useState, useEffect, useRef, useCallback } from "react";
import { debounce } from "lodash";
import "./multiSelectPreForm.css";
import { inputStyle, labelStyle } from "./Input";
import { cn } from "@sohanemon/utils";
import { useFormContext } from "react-hook-form";

interface Option {
  label: string;
  value: string | number;
}

interface DropDownListItemProps {
  listData: Option;
  uniqueKey: keyof Option;
  toggleChangeListItem: (value: string | number) => void;
  isChecked: boolean;
}

// Debounced Click Handler Hook
const useDebouncedCallback = (
  callback: (...args: any[]) => void,
  delay: number
) => {
  return useCallback(debounce(callback, delay), [callback, delay]);
};

// Individual List Item Component
const DropDownListItem: React.FC<DropDownListItemProps> = ({
  listData,
  uniqueKey,
  toggleChangeListItem,
  isChecked,
}) => {
  const handleClick = useDebouncedCallback(() => {
    toggleChangeListItem(listData[uniqueKey]);
  }, 100);

  return (
    <div
      tabIndex={0}
      className={cn(
        "drop-down__list-item",
        "cursor-pointer !p-3 ",
        isChecked ? "bg-gray-light/75" : "hover:bg-gray-light/75"
      )}
      onClick={handleClick}
    >
      <input type="checkbox" checked={isChecked} readOnly className="hidden" />
      <label>{listData.label}</label>
    </div>
  );
};

// Dropdown Component
interface NewDropDownProps {
  data: Option[];
  selected: (string | number)[];
  toggleChangeListItem: (value: string | number) => void;
  uniqueKey: keyof Option;
  shouldHaveSelectAll?: boolean;
  label?: string;
  placeholder?: string;
}

const NewDropDown: React.FC<NewDropDownProps> = ({
  data,
  selected,
  toggleChangeListItem,
  uniqueKey,
  shouldHaveSelectAll = false,
  label = "Choose Your Selling Platforms ",
  placeholder = "Select planforms ",
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleOutsideClick = (e: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(e.target as Node)
    ) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const toggleDropdown = () => setIsOpen((prev) => !prev);

  const getIsChecked = (listData: Option): boolean => {
    if (listData[uniqueKey] === "ALL") return selected.length === data.length;
    return selected.includes(listData[uniqueKey]);
  };

  const options = shouldHaveSelectAll
    ? [{ label: "Select All", value: "ALL" }, ...data]
    : data;

  return (
    <div className="new-drop-down" ref={dropdownRef}>
      {label && <label className={cn(labelStyle, "mb-1")}>{label}</label>}
      <button
        type="button"
        className={cn(
          inputStyle,
          `new-drop-down__button ${isOpen ? "open" : ""}`,
          "text-left text-gray-color"
        )}
        onClick={toggleDropdown}
      >
        {placeholder}
        <span className="drop-down-icon">▼</span>
      </button>
      {isOpen && (
        <div className="new-drop-down__list-wrapper mt-1 shadow-sm border border-gray-light rounded-md">
          {options.map((listData, index) => (
            <DropDownListItem
              key={index}
              toggleChangeListItem={(val) => {
                toggleChangeListItem(val);
                setIsOpen(false);
              }}
              listData={listData}
              uniqueKey={uniqueKey}
              isChecked={getIsChecked(listData)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// Main App Component
const MultiSelectPreForm = ({ options = [], ...props }: any) => {
  const uniqueKey: keyof Option = "value";
  const method = useFormContext();

  const toggleChangeListItem = (uniqueKey: string | number) => {
    const prevSelected = Array.isArray(method.watch(props.name))
      ? method.watch(props.name)
      : [];
    if (uniqueKey === "ALL") {
      const val =
        prevSelected?.length === options.length
          ? []
          : options.map((item: Option) => item.value);
      method.setValue(props.name, val);
      // setSelected(val);
    } else {
      const val = prevSelected?.includes(uniqueKey)
        ? prevSelected?.filter((v:string) => v !== uniqueKey)
        : [...prevSelected, uniqueKey];

      method.setValue(props.name, val);
      // setSelected((prevSelected) =>
      //   prevSelected.includes(uniqueKey)
      //     ? prevSelected.filter((v) => v !== uniqueKey)
      //     : [...prevSelected, uniqueKey]
      // );
    }
  };

  return (
    <div>
      <NewDropDown
        shouldHaveSelectAll={true}
        uniqueKey={uniqueKey}
        data={options}
        selected={
          Array.isArray(method.watch(props.name))
            ? method.watch(props.name)
            : []
        }
        toggleChangeListItem={toggleChangeListItem}
        {...props}
      />
      <div className="flex items-center py-2 mt-2 gap-4">
        {Array.isArray(method.watch(props.name))
          ? method
              .watch(props.name)
              .map((c:string) => (
                <div className="bg-gray-small-light py-3 px-4">{c}</div>
              ))
          : null}
      </div>
    </div>
  );
};

export default MultiSelectPreForm;
