"use client";
import Input from "@/lib/ui/form/Input";
import React from "react";
import { useFormContext } from "react-hook-form";
import MultiSelectPreForm from "../../../../lib/ui/form/multiSelectPreForm";
import { translate } from "@/lib/utils/translate";
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
  const methods = useFormContext();

  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="col-span-2">
        <MultiSelectPreForm
          options={Options}
          label={translate("Choose Your Selling Platforms")}
          name={`omni_channels`}
          placeholder="Select"
        />
      </div>
    </div>
  );
}
