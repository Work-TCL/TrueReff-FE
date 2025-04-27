"use client";
import { Controller, useFormContext } from "react-hook-form";
import { IoIosEye, IoIosEyeOff } from "react-icons/io";
import { useState } from "react";
import { cn } from "@sohanemon/utils";
import { GoChevronDown } from "react-icons/go";
import Select from "react-select";
import { get } from "lodash";
import { FaRegCalendarAlt } from "react-icons/fa";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
interface IInput
  extends React.InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement> {
  label?: string;
  name: string;
  type?: string;
  required?: boolean;
  hideError?: boolean;
  rows?: number;
  Icon?: any;
  minDate?: any;
  options?: {
    label: string;
    value: string;
  }[];
}

export const inputStyle =
  "w-full px-4 py-4 rounded-xl font-medium border border-gray-light placeholder:text-gray-color placeholder:font-normal text-sm focus:outline-none focus:border-gray-light focus:bg-white disabled:cursor-not-allowed";

export const labelStyle = "mb-1 text-sm text-gray-500";

export default function Input({
  label = "",
  name,
  type = "text",
  required = true,
  placeholder = "",
  options = [],
  Icon,
  hideError,
  ...props
}: IInput) {
  const [showPassword, setShowPassword] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const {
    formState: { errors, touchedFields, submitCount },
    control,
    trigger,
    register,
    setValue,
    watch,
  } = useFormContext();
  const tags = watch(name, []);

  const [inputValue, setInputValue] = useState("");

  const addTag = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && inputValue.trim()) {
      event.preventDefault();
      setValue(name, [...tags, inputValue.trim()]); // Update form state
      setInputValue(""); // Clear input
    }
  };

  const removeTag = (index: number) => {
    setValue(
      name,
      tags.filter((_: any, i: number) => i !== index)
    );
  };

  const getErrorMessage = (name: string) => {
    const error = get(errors, name);
    if (error && error.message) {
      return error.message as string;
    }
    return null;
  };

  const getError = () => {
    return (
      Boolean(get(errors, name)) &&
      !hideError && (
        <span className="text-red-600 text-sm p-2">
          {getErrorMessage(name)}
        </span>
      )
    );
  };

  const getLabel = () =>
    label && (
      <label className={cn(labelStyle)}>
        {label}
        {required && <span className="text-red-500">*</span>}
      </label>
    );

  const renderTextInput = () => (
    <Controller
      control={control}
      name={name}
      rules={{ required: required ? `${label} is required` : false }}
      render={({ field }) => (
        <div className="flex flex-col">
          {getLabel()}
          <div className="relative">
            <input
              type={type}
              className={cn(inputStyle, Icon ? "!pl-12" : "")}
              placeholder={placeholder}
              {...field}
              onChange={(e) => {
                if (type === "email") {
                  e.target.value = e?.target?.value?.toLowerCase();
                  field.onChange(e);
                } else {
                  field?.onChange(e);
                }
              }}
              autoComplete="off"
              {...props}
            />
            {Icon ? (
              <Icon
                fontSize={25}
                className="absolute top-[50%] left-4 text-gray-black z-10 translate-y-[-50%]"
              />
            ) : null}
          </div>
          {getError()}
        </div>
      )}
    />
  );
  const renderDateInput = () => (
    <Controller
      control={control}
      name={name}
      rules={{ required: required ? `${label} is required` : false }}
      render={({ field }) => (
        <div className="flex flex-col">
          {getLabel()}
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 z-[1]">
              <FaRegCalendarAlt />
            </span>
            <DatePicker
              {...field}
              selected={field.value}
              className={cn(inputStyle, "!pl-10")}
              placeholderText={placeholder}
              dateFormat="dd/MM/yyyy"
              wrapperClassName="w-full"
              {...(props?.minDate ? { minDate: props.minDate } : {})}
              {...(props?.disabled ? { disabled: true } : {})}
            />
            {Icon ? (
              <Icon
                fontSize={25}
                className="absolute top-[50%] left-4 text-gray-black z-10 translate-y-[-50%]"
              />
            ) : null}
          </div>
          {getError()}
        </div>
      )}
    />
  );
  const renderTagInput = () => (
    <Controller
      name={name}
      control={control}
      rules={{ required: required ? `${label} is required` : false }}
      render={({ field }) => (
        <div className="flex flex-col">
          {getLabel()}
          <div className="w-full ">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={addTag}
              onBlur={field.onBlur}
              placeholder={placeholder}
              className={inputStyle}
              {...props}
            />
          </div>
          {tags?.length > 0 ? "" : getError()}
          {tags.length > 0 && (
            <div className="flex items-center py-2 mt-2 gap-4 flex-wrap">
              {tags.map((tag: string, index: number) => (
                <span key={index} className="bg-gray-small-light py-3 px-4">
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(index)}
                    className="ml-1 text-sm"
                  >
                    ✖
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>
      )}
    />
  );

  const renderPasswordInput = () => (
    <Controller
      control={control}
      name={name}
      rules={{ required: required ? `${label} is required` : false }}
      render={({ field }) => (
        <div className="flex flex-col relative">
          {getLabel()}
          <div className="w-full relative">
            <input
              type={showPassword ? "text" : type}
              className={cn(inputStyle, Icon ? "!pl-12" : "")}
              placeholder={placeholder}
              {...field}
              {...props}
              autoComplete="off"
            />
            {Icon ? (
              <Icon
                fontSize={25}
                className="absolute top-[50%] left-4 text-gray-black z-10 translate-y-[-50%]"
              />
            ) : null}
            {showPassword ? (
              <IoIosEye
                onClick={() => setShowPassword(!showPassword)}
                fontSize={25}
                className="absolute top-[50%] right-2 text-black z-10 translate-y-[-50%]"
              />
            ) : (
              <IoIosEyeOff
                onClick={() => setShowPassword(!showPassword)}
                fontSize={25}
                className="absolute top-[50%] right-2 text-black/50 z-10 translate-y-[-50%]"
              />
            )}
          </div>
          {getError()}
        </div>
      )}
    />
  );

  const renderTextAreaInput = () => (
    <Controller
      control={control}
      name={name}
      rules={{ required: required ? `${label} is required` : false }}
      render={({ field }) => (
        <div className="flex flex-col">
          {getLabel()}
          <textarea
            className={cn(inputStyle)}
            placeholder={placeholder}
            rows={4}
            {...field}
            {...props}
          />
          {getError()}
        </div>
      )}
    />
  );

  const renderSelectInput = () => (
    <Controller
      control={control}
      name={name}
      rules={{ required: required ? `${label} is required` : false }}
      render={({ field }) => (
        <div className="flex flex-col">
          {getLabel()}
          <div className="relative">
            <select
              className={cn(inputStyle, "appearance-none")}
              {...field}
              disabled={props?.disabled}
            >
              <option value={placeholder || "Select..."}>
                {placeholder || "Select..."}
              </option>
              {options?.map((item) => (
                <option key={item?.value} value={item?.value}>
                  {item?.label}
                </option>
              ))}
            </select>
            <GoChevronDown
              fontSize={27}
              className="absolute top-1/2 right-5 transform -translate-y-1/2 pointer-events-none font-thin"
            />
          </div>
          {getError()}
        </div>
      )}
    />
  );

  const renderMultiSelectInput = () => (
    <Controller
      control={control}
      name={name}
      rules={{ required: required ? `${label} is required` : false }}
      render={({ field }) => (
        <div className="flex flex-col">
          {getLabel()}
          <div className="relative">
            <Select
              isMulti
              options={options}
              className="basic-multi-select focus:outline-none focus:shadow-none"
              classNamePrefix="select"
              {...field}
              isDisabled={props?.disabled}
              menuPortalTarget={document.body} // Renders the dropdown outside of the current scrollable container
              menuPosition="fixed" // Makes the dropdown position fixed
              autoFocus={false} // Prevents focus behavior causing auto-scroll
            />
          </div>
          {getError()}
        </div>
      )}
    />
  );

  const renderMultiSelectCategories = () => (
    <Controller
      control={control}
      name={name}
      rules={{ required: required ? `${label} is required` : false }}
      render={({ field }) => (
        <div className="flex flex-col">
          {getLabel()}
          <div className="relative z-50">
            <Select
              isMulti
              options={options}
              className="basic-multi-select focus:outline-none focus:shadow-none"
              classNamePrefix="select"
              {...field}
              isDisabled={props?.disabled}
              menuPortalTarget={document.body} // render dropdown outside the parent container
              styles={{
                menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                menu: (base) => ({ ...base, zIndex: 9999 }),
              }}
            />
          </div>
          {getError()}
        </div>
      )}
    />
  );

  const renderInput = () => {
    switch (type) {
      case "radio":
        return (
          <Controller
            control={control}
            name={name}
            rules={{ required: required ? `${label} is required` : false }}
            render={({ field }) => (
              <div className="flex flex-col">
                <label
                  className={`flex items-center mb-2 text-black font-medium ${
                    props?.disabled ? "opacity-50 cursor-not-allowed" : ""
                  } ${props?.className ? props?.className : ""}`}
                >
                  <input
                    type="radio"
                    className="mr-2"
                    checked={field?.value}
                    {...field}
                    {...props}
                  />
                  {label}
                </label>
                {getError()}
              </div>
            )}
          />
        );

      case "checkbox":
        return (
          <Controller
            control={control}
            name={name}
            rules={{ required: required ? `${label} is required` : false }}
            render={({ field }) => (
              <div className="flex flex-col">
                <label
                  className={`flex items-start text-black font-medium sm:text-base text-sm ${
                    props?.disabled ? "opacity-50 cursor-not-allowed" : ""
                  } ${props?.className ? props?.className : ""}`}
                >
                  <input
                    type="checkbox"
                    className="mr-3 mt-1 w-4 h-4"
                    checked={field?.value}
                    {...field}
                    {...props}
                  />
                  {label}
                </label>
                {getError()}
              </div>
            )}
          />
        );

      case "select":
        return renderSelectInput();
      case "select-multiple":
        return renderMultiSelectInput();

      case "textarea":
        return renderTextAreaInput();

      case "password":
        return renderPasswordInput();

      case "tag":
        return renderTagInput();
      case "productCategories":
        return renderMultiSelectCategories();
      case "date":
        return renderDateInput();
      default:
        return renderTextInput();
    }
  };

  return renderInput();
}
