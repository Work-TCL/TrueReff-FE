"use client";
import Input from "@/lib/ui/form/Input";
import React from "react";

export default function ChannelForm() {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="col-span-2">
        <Input
          label="Choose Your Selling Platforms"
          name={`omni_channels`}
          type="select-multiple"
          placeholder="Select"
          options={[
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
          ]}
        />
      </div>
    </div>
  );
}
