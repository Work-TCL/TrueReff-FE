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
import Editor from "./editor";
import { Tag, X } from "lucide-react";

const menuPortal = typeof window !== "undefined" ? document.body : null;
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
  maxDate?: any;
  options?: {
    label: string;
    value: string;
  }[];
  menuPortalTarget?: any;
  lableClassName?: string;
  inputClassName?: string;
}

export const inputStyle =
  "w-full px-4 py-4 rounded-xl font-medium border border-gray-light placeholder:text-gray-color placeholder:font-normal text-sm focus:outline-none focus:border-gray-light focus:bg-white disabled:cursor-not-allowed";

export const labelStyle = "mb-1 text-sm text-gray-500 font-semibold";

export default function Input({
  label = "",
  name,
  type = "text",
  required = true,
  placeholder = "",
  options = [],
  Icon,
  hideError,
  lableClassName,
  inputClassName,
  menuPortalTarget = menuPortal,
  max,
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
      getErrorMessage(name) &&
      !hideError && (
        <span className="text-red-600 text-sm p-2">
          {getErrorMessage(name)}
        </span>
      )
    );
  };

  const getLabel = () =>
    label && (
      <label className={cn(labelStyle, lableClassName)}>
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
  const renderPhoneInput = () => (
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
                e.target.value = e.target.value.replace(/[^0-9]/g, "");
                field.onChange(e);
              }}
              autoComplete="off"
              maxLength={10}
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
  const renderEditorInput = () => (
    <Controller
      control={control}
      name={name}
      rules={{ required: required ? `${label} is required` : false }}
      render={({ field }) => (
        <div className="flex flex-col">
          {getLabel()}
          <div className="relative">
            <Editor
              onChange={(val: any) => field?.onChange(val)}
              value={field?.value}
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
              onChange={field?.onChange}
              selected={field.value}
              className={cn(inputStyle, "!pl-10")}
              placeholderText={placeholder}
              dateFormat="dd/MM/yyyy"
              wrapperClassName="w-full"
              {...(props?.minDate ? { minDate: props.minDate } : {})}
              {...(props?.maxDate ? { maxDate: props.maxDate } : {})}
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

  const renderTagInputUpdated = () => (
    <Controller
      name={name}
      control={control}
      rules={{ required: required ? `${label} is required` : false }}
      render={({ field }) => (
        <div className="flex flex-col">
          {getLabel()}
          <div className="relative w-full">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={addTag}
              onBlur={field.onBlur}
              placeholder={placeholder}
              className={cn(
                "w-full bg-white text-gray-700 border border-gray-300 rounded-md pl-10 pr-4 py-2 focus:outline-none focus:ring-2",
                inputClassName
              )}
              {...props}
            />
            <Tag
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
              size={16}
            />
          </div>
          {tags?.length > 0 ? "" : getError()}
          {tags.length > 0 && (
            <div className="flex items-center py-2 mt-2 gap-4 flex-wrap">
              {tags.map((tag: string, index: number) => (
                <span
                  key={index}
                  className="bg-gray-darken text-white py-1 px-3 rounded-full flex items-center gap-2 cursor-pointer hover:bg-gray-darken/80 transition-colors"
                  onClick={() => console.log(`Tag clicked: ${tag}`)} // Optional: Add click functionality
                >
                  {tag}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent triggering the onClick of the span
                      removeTag(index);
                    }}
                    className="text-sm text-white hover:text-gray-200"
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

  const renderNewSelectInput = () => (
    <Controller
      control={control}
      name={name}
      rules={{ required: required ? `${label} is required` : false }}
      render={({ field }) => (
        <div className="flex flex-col">
          {getLabel()}
          <div className="relative">
            <Select
              styles={customStyles}
              options={options}
              className="basic-multi-select focus:outline-none focus:shadow-none"
              classNamePrefix="select"
              {...field}
              onChange={(v) => setValue(name, v?.value)}
              value={options?.find((v) => v?.value === field?.value)}
              isDisabled={props?.disabled}
              menuPortalTarget={menuPortal} // Renders the dropdown outside of the current scrollable container
              menuPosition="fixed" // Makes the dropdown position fixed
              autoFocus={false} // Prevents focus behavior causing auto-scroll
            />
          </div>
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
  const customStyles = {
    placeholder: (base: any) => ({
      ...base,
      fontSize: "0.875rem ", // Tailwind text-sm
      color: "#9CA3AF", // Tailwind slate-400
      fontWeight: "normal",
    }),
    control: (base: any, state: any) => {
      return {
        ...base,
        height: "54px",
        borderRadius: "8px",
      };
    },
    menu: (base: any) => ({
      ...base,
      zIndex: 9999,
    }),
  };
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
              styles={customStyles}
              isMulti
              options={options}
              className="basic-multi-select focus:outline-none focus:shadow-none"
              classNamePrefix="select"
              {...field}
              isDisabled={props?.disabled}
              menuPortalTarget={menuPortal} // Renders the dropdown outside of the current scrollable container
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
              menuPortalTarget={menuPortal} // render dropdown outside the parent container
              styles={{
                menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                menu: (base) => ({ ...base, zIndex: 9999 }),
                control: (base: any) => ({
                  ...base,
                  height: "54px",
                  borderRadius: "8px",
                }),
              }}
            />
          </div>
          {getError()}
        </div>
      )}
    />
  );

  const multiSelectWithTags = () => {
    return (
      <Controller
        control={control}
        name={name}
        rules={{ required: required ? `${label} is required` : false }}
        render={({ field }) => {
          const handleChange = (selected: any) => {
            const updated = max === 1 ? [selected]:[...(field.value || []), selected];
            field.onChange(updated);
          };

          const handleRemove = (valueToRemove: any) => {
            const updated = (field.value || []).filter(
              (item: any) => item.value !== valueToRemove
            );
            field.onChange(updated);
          };

          // Filter out selected options from available options
          const selectedValues = (field.value || []).map(
            (item: any) => item.value
          );
          const filteredOptions = options.filter(
            (option: any) => !selectedValues.includes(option.value)
          );

          return (
            <div className="flex flex-col gap-1">
              {getLabel?.()}
              <Select
                value={null} // keep the value empty to always show placeholder
                onChange={handleChange}
                options={filteredOptions}
                placeholder={placeholder ? placeholder : "Select option"}
                classNamePrefix="select"
                className="react-select-container"
                isDisabled={props?.disabled}
                menuPortalTarget={menuPortalTarget ? menuPortalTarget : null}
                menuPosition="fixed"
                autoFocus={false}
                styles={{
                  control: (base: any) => ({
                    ...base,
                    height: "54px",
                    borderRadius: "12px",
                  }),
                  placeholder: (base: any) => ({
                    ...base,
                    fontSize: "0.875rem ", // Tailwind text-sm
                    color: "#a1a1aa", // Tailwind slate-400
                  }),
                }}
              />

              {/* Custom Tag Display */}
              {Array.isArray(field.value) && field.value.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {field.value.map((tag: any) => (
                    <div
                      key={tag.value}
                      className={cn(
                        "flex items-center gap-1 px-3 py-1 text-sm rounded-full bg-muted text-muted-foreground border border-muted-foreground"
                      )}
                    >
                      {tag.label}
                      <button
                        type="button"
                        onClick={() => handleRemove(tag.value)}
                        className="hover:text-destructive focus:outline-none"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              {getError?.()}
            </div>
          );
        }}
      />
    );
  };

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
                    className="mr-3 mt-1 w-4 h-4 cursor-pointer"
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
      case "toggle":
        return (
          <Controller
            control={control}
            name={name}
            rules={{ required: required ? `${label} is required` : false }}
            render={({ field }) => (
              <div className="flex flex-col">
                <div className="flex gap-2 items-center">
                  <label className="inline-flex items-center cursor-pointer relative">
                    <input
                      type="checkbox"
                      className="sr-only peer hidden"
                      checked={field?.value}
                      {...field}
                      {...props}
                      onChange={(e) => {
                        if (props?.disabled) return;
                        //@ts-ignore
                        props?.onChange(e);
                      }}
                    />
                    <div
                      className={`relative w-9 h-5 ${
                        props?.checked ? "bg-primary" : "bg-gray-200"
                      } rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600 dark:peer-checked:bg-blue-600`}
                    ></div>
                  </label>
                  <label
                    className={`flex items-start text-black font-medium sm:text-base text-sm ${
                      props?.disabled ? "opacity-50 cursor-not-allowed" : ""
                    } ${props?.className ? props?.className : ""}`}
                    onClick={() => {
                      if (props?.disabled) return;
                      //@ts-ignore
                      props?.onChange && props?.onChange(!props?.checked);
                    }}
                  >
                    {/* <input
                    type="checkbox"
                    className="mr-3 mt-1 w-4 h-4 cursor-pointer"
                    checked={field?.value}
                    {...field}
                    {...props}
                  /> */}
                    {label}
                  </label>
                </div>
                {getError()}
              </div>
            )}
          />
        );

      case "select":
        return renderSelectInput();
      case "react-select":
        return renderNewSelectInput();
      case "select-multiple":
        return renderMultiSelectInput();

      case "textarea":
        return renderTextAreaInput();

      case "password":
        return renderPasswordInput();
      case "editor":
        return renderEditorInput();

      case "tag":
        return renderTagInput();
      case "productCategories":
        return renderMultiSelectCategories();
      case "date":
        return renderDateInput();
      case "multiSelectWithTags":
        return multiSelectWithTags();
      case "renderTagInputUpdated":
        return renderTagInputUpdated();
      case "tel":
        return renderPhoneInput();
      case "phone":
        return renderPhoneInput();
      default:
        return renderTextInput();
    }
  };

  return renderInput();
}
