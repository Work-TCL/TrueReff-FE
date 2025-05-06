"use client";
import Input from "@/app/_components/ui/form/Input";
import React from "react";

export default function BasicInfoForm() {
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
    </div>
  );
}
