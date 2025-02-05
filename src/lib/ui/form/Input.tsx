"use client";
import { Controller, useFormContext } from "react-hook-form";
import { IoIosEye, IoIosEyeOff } from "react-icons/io";
import { useState } from "react";
import { cn } from "@sohanemon/utils";
import { GoChevronDown } from "react-icons/go";
import Select from "react-select";

interface IInput extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  name: string;
  type?: string;
  required?: boolean;
  rows?: number;
  Icon?: any;
  options?: {
    label: string;
    value: string;
  }[];
}

export const inputStyle =
  "w-full px-4 py-4 rounded-xl font-medium border border-gray-light placeholder:text-gray-color placeholder:font-normal text-sm focus:outline-none focus:border-gray-light focus:bg-white";

export const labelStyle = "mb-1 text-sm text-gray-darken";

export default function Input({
  label = "",
  name,
  type = "text",
  required = true,
  placeholder = "",
  options = [],
  Icon,
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
  } = useFormContext();

  const getErrorMessage = (name: string) => {
    const error = errors[name];
    if (error && error.message) {
      return error.message as string;
    }
    return null;
  };

  const getError = () => {
    return (
      Boolean(errors[name]) && (
        <span className="text-red-600 text-sm p-2">
          {getErrorMessage(name)}
        </span>
      )
    );
  };

  const renderTextInput = () => (
    <Controller
      control={control}
      name={name}
      rules={{ required: required ? `${label} is required` : false }}
      render={({ field }) => (
        <div className="flex flex-col">
          {label && <label className={cn(labelStyle)}>{label}</label>}
          <div className="relative">
            <input
              type={type}
              className={cn(inputStyle, Icon ? "!pl-12" : "")}
              placeholder={placeholder}
              {...field}
              autoComplete="off"
              onBlur={() => {
                field.onBlur();
                trigger(name);
              }}
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

  const renderPasswordInput = () => (
    <Controller
      control={control}
      name={name}
      rules={{ required: required ? `${label} is required` : false }}
      render={({ field }) => (
        <div className="flex flex-col relative">
          {label && <label className={cn(labelStyle)}>{label}</label>}
          <div className="w-full relative">
            <input
              type={showPassword ? "text" : type}
              className={cn(inputStyle, Icon ? "!pl-12" : "")}
              placeholder={placeholder}
              {...field}
              autoComplete="off"
              onBlur={() => {
                field.onBlur();
                trigger(name);
              }}
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
          {label && <label className={cn(labelStyle)}>{label}</label>}
          <textarea
            className={cn(inputStyle)}
            placeholder={placeholder}
            rows={4}
            {...field}
            onBlur={() => {
              field.onBlur();
              trigger(name);
            }}
            onChange={(e) => field.onChange(e.target.value)} // Ensure onChange is correctly typed
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
          {label && <label className={cn(labelStyle)}>{label}</label>}
          <div className="relative">
            <select
              className={cn(inputStyle, "appearance-none")}
              {...field}
              onBlur={() => {
                field.onBlur();
                trigger(name);
              }}
            >
              <option selected>{placeholder || "Select..."}</option>
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
          {label && <label className={cn(labelStyle)}>{label}</label>}
          <div className="relative">
            <Select
              defaultValue={field?.value || []}
              isMulti
              options={options}
              className="basic-multi-select focus:outline-none focus:shadow-none"
              classNamePrefix="select"
              {...field}
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
                    props?.className ? props?.className : ""
                  }`}
                >
                  <input
                    type="radio"
                    className="mr-2"
                    checked={field?.value}
                    {...field}
                    onBlur={() => {
                      field.onBlur();
                      trigger(name);
                    }}
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
                    props?.className ? props?.className : ""
                  }`}
                >
                  <input
                    type="checkbox"
                    className="mr-3 mt-1"
                    checked={field?.value}
                    {...field}
                    onBlur={() => {
                      field.onBlur();
                      trigger(name);
                    }}
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

      default:
        return renderTextInput();
    }
  };

  return renderInput();
}
