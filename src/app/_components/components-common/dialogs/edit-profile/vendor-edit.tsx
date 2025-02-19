"use client";
import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { FormProvider, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { getErrorMessage } from "@/lib/utils/commonUtils";
import {
    IVendorProfileUpdateSchema,
    vendorProfileUpdateSchema,
} from "@/lib/utils/validations";
import { yupResolver } from "@hookform/resolvers/yup";
import { translate } from "@/lib/utils/translate";
import useAxiosAuth from "@/lib/hooks/useAxiosAuth";
import Input from "@/app/_components/ui/form/Input";
import Button from "@/app/_components/ui/button";

export default function EditVendorForm({ profile }: { profile: any }) {
    console.log("profile", profile);
    const router = useRouter();
    const axios = useAxiosAuth();
    const [loading, setLoading] = useState(false);
    const schema = vendorProfileUpdateSchema;
    const methods = useForm<IVendorProfileUpdateSchema>({
        defaultValues: {
            company_email: profile?.vendorId?.company_email || "",
            company_phone: profile?.vendorId?.company_phone || "",
            gst_number: profile?.vendorId?.gst_number || "",
            website: profile?.vendorId?.website || "",
            business_name: profile?.vendorId?.business_name || "",
        },
        resolver: yupResolver(schema),
        mode: "onChange",
    });
    const onSubmit = async (data: IVendorProfileUpdateSchema) => {
        setLoading(true);
        console.log("data", data);
        try {
            const payload = data
            //   delete payload.company_email
            //   delete payload.company_phone
            let response: any = await axios.patch("/user", payload);
            if (response?.data) {
                response = response?.data;
            }
            console.log("response", response);
            if (response?.status === 200) {
                toast.success(response?.message);
                router.push("?");
                methods?.reset();
                return true;
            }
        } catch (error) {
            const errorMessage = getErrorMessage(error);
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };
    return (<>
        <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(onSubmit)}>
                <div className="grid grid-cols-2 text-left gap-3">
                    <div className="col-span-2">
                        <Input
                            name="company_email"
                            label="Company Email"
                            type="email"
                            placeholder={translate("Company Email")}
                        />
                        <Input
                            name="company_phone"
                            label="Company Phone"
                            type="phone"
                            placeholder={translate("Company Phone")}
                        />
                        <Input
                            name="gst_number"
                            label="GST Number"
                            type="text"
                            placeholder={translate("GST Number")}
                        />
                        <Input
                            name="website"
                            label="Website"
                            type="url"
                            placeholder={translate("Website")}
                        />
                        <Input
                            name="business_name"
                            label="Business Name"
                            type="text"
                            placeholder={translate("Business Name")}
                        />
                    </div>
                    <div className="mt-6">
                        <Button type="submit" loading={loading}>
                            Save
                        </Button>
                    </div>
                </div>
            </form>
        </FormProvider>
    </>
    );
}