"use client";
import Input from "@/app/_components/ui/form/Input";
import { useTranslations } from "next-intl";
import React from "react";
import { useFormContext } from "react-hook-form";
const Options = [
  {
    label: "Flipkart",
    value: "Flipkart",
  },
  {
    label: "Amezone",
    value: "Amezone",
  },
  {
    label: "Meesho",
    value: "Meesho",
  },
];
export default function ChannelForm() {
  const translate = useTranslations();
  const methods = useFormContext();

  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="col-span-2">
        <Input
          label={translate("choose_your_selling_platforms")}
          placeholder="Select"
          name={`omni_channels`}
          type="select-multiple"
          options={Options}
          autoFocus={false}
        />
      </div>
    </div>
  );
}
