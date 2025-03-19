"use client";
import Input from "@/app/_components/ui/form/Input";
import React from "react";

export default function ContactDetailsForm() {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="col-span-2">
        <Input
          label="Contact Person 1"
          name={`contacts[0].name`}
          type="text"
          placeholder="ABC"
        />
      </div>
      <div className="md:col-span-1 col-span-2">
        <Input
          label="Phone Number"
          name={`contacts[0].phone`}
          type="tel"
          placeholder="+91 958 624 7482"
        />
      </div>
      <div className="md:col-span-1 col-span-2">
        <Input
          label="Email Address"
          placeholder="abc@gmail.com"
          name={`contacts[0].email`}
          type="email"
        />
      </div>
      <div className="col-span-2">
        <Input
          label="Contact Person 2"
          name={`contacts[1].name`}
          type="text"
          placeholder="ABC"
        />
      </div>
      <div className="md:col-span-1 col-span-2">
        <Input
          label="Phone Number"
          name={`contacts[1].phone`}
          type="tel"
          placeholder="+91 958 624 7482"
        />
      </div>
      <div className="md:col-span-1 col-span-2">
        <Input
          label="Email Address"
          placeholder="abc@gmail.com"
          name={`contacts[1].email`}
          type="email"
        />
      </div>
    </div>
  );
}
