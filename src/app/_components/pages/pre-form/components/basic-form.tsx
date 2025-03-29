"use client";
import Input from "@/app/_components/ui/form/Input";
import React from "react";

export default function BasicInfoForm() {
  return (
    <div className="grid md:grid-cols-2 grid-cols-1 gap-4">
      <div className="col-span-2">
        <Input
          label="Business Name"
          name="business_name"
          type="text"
          placeholder="business"
        />
      </div>
      <div className="col-span-2">
        <Input
          label="Company email"
          name="company_email"
          type="email"
          placeholder="business@example.com"
        />
      </div>
      <div className="md:col-span-1 col-span-2">
        <Input
          label="Company Phone Number"
          placeholder="+91 958 624 7482 "
          name="company_phone"
          type="phone"
        />
      </div>
      <div className="md:col-span-1 col-span-2">
        <Input
          label="GST Number"
          placeholder="27ABCDE1234F1Z5"
          name="gst_number"
          type="phone"
        />
      </div>
      <div className="md:col-span-1 col-span-2">
        <Input
          label="Website"
          placeholder="www.truereff.com"
          name="website"
          type="url"
        />
      </div>
      <div className="md:col-span-1 col-span-2">
        <Input
          label="Type of business"
          placeholder="Select business type"
          name="type_of_business"
          type="select"
          options={[
            {
              label: "business type 1",
              value: "business type 1",
            },
            {
              label: "business type 2",
              value: "business type 2",
            },
          ]}
        />
      </div>
      {/* <div className="col-span-2">
          <Input
            label="Brand documents"
            placeholder="GST Certificate"
            name="gstCertificate"
            type="select"
            options={[
              {
                label: "GST Certificate 1",
                value: "business type 1",
              },
              {
                label: "GST Certificate 1",
                value: "business type 2",
              },
            ]}
          />
        </div> */}
    </div>
  );
}
