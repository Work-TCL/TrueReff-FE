"use client";
import { Controller, useFormContext } from "react-hook-form";
import { MdKeyboardArrowDown } from "react-icons/md";
// import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";
// import { BsCalendar2Date } from "react-icons/bs";
// import PhoneInput, { CountryData } from "react-phone-input-2";
// import "react-phone-input-2/lib/style.css";
// import ProfileUpload from "@/app/components/account-setting/profileUpload";
import { IoIosEye, IoIosEyeOff } from "react-icons/io";
import { useState } from "react";
import { cn } from "@sohanemon/utils";

interface IInput extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  name: string;
  type?: string;
  required?: boolean;
  rows?: number;
  options?: {
    label: string;
    value: string;
  }[];
}

export default function Input({
  label = "",
  name,
  type = "text",
  required = true,
  placeholder = "",
  options = [],
  ...props
}: IInput) {
  const [showPassword, setShowPassword] = useState(false);
  const {
    formState: { errors, touchedFields, submitCount },
    control,
    trigger,
    register,
    setValue,
  } = useFormContext();

  const inputStyle =
    "w-full px-8 py-4 rounded-lg font-medium border border-gray-light placeholder-gray-500 text-sm focus:outline-none focus:border-gray-light focus:bg-white";

  const getErrorMessage = (name: string) => {
    const error = errors[name];
    if (error && error.message) {
      return error.message as string;
    }
    return null;
  };

  const getError = () => {
    return (
      Boolean(touchedFields[name] || submitCount > 0) &&
      Boolean(errors[name]) && (
        <span className="text-red-500 text-sm">{getErrorMessage(name)}</span>
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
          {label && (
            <label className="mb-2 text-black font-medium">
              {label} {required && <span className="text-red-500">*</span>}
            </label>
          )}
          <input
            type={type}
            className={cn(inputStyle)}
            placeholder={placeholder}
            {...field}
            autoComplete="off"
            onBlur={() => {
              field.onBlur();
              trigger(name);
            }}
          />
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
          {label && (
            <label className="mb-2 text-black font-medium">
              {label} {required && <span className="text-red-500">*</span>}
            </label>
          )}
          <div className="w-full relative">
            <input
              type={showPassword ? "text" : type}
              className={cn(inputStyle)}
              placeholder={placeholder}
              {...field}
              autoComplete="off"
              onBlur={() => {
                field.onBlur();
                trigger(name);
              }}
            />
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
          {label && (
            <label className="mb-2 text-black font-medium">
              {label} {required && <span className="text-red-500">*</span>}
            </label>
          )}
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
          {label && (
            <label className="mb-2 text-black font-medium">
              {label} {required && <span className="text-red-500">*</span>}
            </label>
          )}
          <div className="relative">
            <select
              className={cn(inputStyle)}
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
            <MdKeyboardArrowDown
              fontSize={25}
              className="absolute top-1/2 right-5 transform -translate-y-1/2 pointer-events-none"
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
