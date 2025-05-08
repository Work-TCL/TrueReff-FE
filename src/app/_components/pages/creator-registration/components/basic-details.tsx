"use client";
import Input from "@/app/_components/ui/form/Input";
import { cities, gender, indianStates } from "@/lib/utils/constants";
import { translate } from "@/lib/utils/translate";
import { get } from "lodash";
import React from "react";
import Select from "react-select";
const customStyles = {
  placeholder: (base: any) => ({
    ...base,
    fontSize: "0.875rem ", // Tailwind text-sm
    color: "#9CA3AF", // Tailwind slate-400
    fontWeight: 'normal',
  }),
  control: (base: any,state:any) => {
    console.log("state",state.getValue()[0]?.value === "")
    return ({
    ...base,
    height: "54px",
    borderRadius: "8px",
    color: state.getValue()[0]?.value === "" ? "#9CA3AF":"#000000"
  })},
  menu: (base: any) => ({
    ...base,
    zIndex: 9999
  })
};
interface IBasicInfoFormProps {
  handleOnSelect: (value: any, name: any) => void;
  methods: any;
  formState: { state: string, city: string;gender:string;dob: string; }
}
export default function BasicInfoForm({ handleOnSelect, methods, formState }: IBasicInfoFormProps) {
  return (
    <div className="grid md:grid-cols-2 grid-cols-1 gap-4">
      <div className="col-span-1">
        <Input
          label="Full Name"
          name="full_name"
          type="text"
          placeholder="John Doe"
          autoFocus
        />
      </div>
      <div className="col-span-1">
        <Input
          label="Username"
          name="user_name"
          type="text"
          placeholder="john_doe_90"
        />
      </div>
      <div className="col-span-1">
        <Input
          label="Email"
          name="email"
          type="email"
          placeholder="johndoe@gmail.com"
          disabled
        />
      </div>
      <div className="col-span-1">
        <Input
          label="Phone Number"
          name="phone_number"
          type="phone"
          placeholder="+91 864 542 2548 "
        />
      </div>
      <div className="col-span-1">
        <div className="flex flex-col">
          <span className="mb-1 text-sm text-gray-500 font-semibold">{"State"}<span className="text-red-500">*</span></span>
          <Select
            styles={customStyles}
            value={[
              {
                value: formState.state,
                label: formState.state
                  ? formState.state
                  : "Select State",
              },
            ]}
            onChange={(value) => handleOnSelect(value?.value, "state")}
            options={indianStates?.map(ele => ({ value: ele, label: ele }))}
            className="basic-multi-select focus:outline-none focus:shadow-none"
            placeholder="Select State"
          />
          {Boolean(get(methods.formState.errors, "state")) && (
            <span className="text-red-600 text-sm p-2 block">
              {methods.formState.errors["state"]?.message}
            </span>
          )}
        </div>
      </div>
      <div className="col-span-1">
        <div className="flex flex-col">
          <span className="mb-1 text-sm text-gray-500 font-semibold">{"City"}<span className="text-red-500">*</span></span>
          <Select
            styles={customStyles}
            value={[
              {
                value: formState.city,
                label: formState.city
                  ? formState.city
                  : "Select City",
              },
            ]}
            onChange={(value) => handleOnSelect(value?.value, "city")}
            options={formState.state ? cities[formState?.state]?.map((ele: string) => ({ value: ele, label: ele })) : []}
            className="basic-multi-select focus:outline-none focus:shadow-none"
            placeholder="Select City"
          />
          {Boolean(get(methods.formState.errors, "city")) && (
            <span className="text-red-600 text-sm p-2 block">
              {methods.formState.errors["city"]?.message}
            </span>
          )}
        </div>
      </div>
      <div className="col-span-1">
        <div className="flex flex-col">
          <span className="mb-1 text-sm text-gray-500 font-semibold">{"Gender"}<span className="text-red-500">*</span></span>
          <Select
            styles={customStyles}
            value={[
              {
                value: formState.gender,
                label: formState.gender
                  ? formState.gender
                  : "Select Gender",
              },
            ]}
            onChange={(value) => handleOnSelect(value?.value, "gender")}
            options={gender?.map(ele => ({ value: ele, label: ele }))}
            className="basic-multi-select focus:outline-none focus:shadow-none"
            placeholder="Select State"
          />
          {Boolean(get(methods.formState.errors, "gender")) && (
            <span className="text-red-600 text-sm p-2 block">
              {methods.formState.errors["gender"]?.message}
            </span>
          )}
        </div>
      </div>
      <div className="col-span-1">
        <div className="flex flex-col">
          <Input
            name="dob"
            type="date"
            placeholder={translate("Select_date_of_birth")}
            label={translate("Date of Birth")}
            maxDate={new Date(new Date().setDate(new Date().getDate()))
            }
          />
        </div>
      </div>
    </div>
  );
}
