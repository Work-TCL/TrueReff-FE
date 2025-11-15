"use client";

import React, { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import AOS from "aos";
import { FormProvider, useForm } from "react-hook-form";
import { getInTouchSchema, IGetInTouchSchema } from "@/lib/utils/validations";
import { yupResolver } from "@hookform/resolvers/yup";
import axios from "@/lib/web-api/axios";
import Button from "../_components/ui/button";
import { useTranslations } from "next-intl";
import Input from "../_components/ui/form/Input";
import Link from "next/link";
import { toastMessage } from "@/lib/utils/toast-message";
import { youtubeVideoUrls } from "@/lib/utils/constants";


const GetInTouchModal: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [hasOpened, setHasOpened] = useState(false);
    const [loading, setLoading] = useState(false);
    const modalRef = useRef<HTMLDivElement>(null);
    const translate = useTranslations();

    const methods = useForm<IGetInTouchSchema>({
        defaultValues: {
            link: "",
            name: "",
            email: "",
            phone: "",
            role: ""
        },
        resolver: yupResolver(getInTouchSchema),
        mode: "onSubmit",
    });

    useEffect(() => {
        // Initialize AOS
        AOS.init({ duration: 600, easing: "ease-out-cubic" });
        // Access sessionStorage only in the browser
        const opened = sessionStorage.getItem("getInTouchModalOpened");
        if (opened === "true") {
            setHasOpened(true);
        }
    }, []);

    // Detect scroll -> delay -> show modal
    useEffect(() => {
        const handleScroll = () => {
            if (!hasOpened && window.scrollY > 50) {
                setHasOpened(true);
                sessionStorage.setItem("getInTouchModalOpened", "true");
                setTimeout(() => {
                    setIsOpen(true);
                }, 1500); // wait 1.5 seconds after scroll
            }
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [hasOpened]);

    // Close on outside click
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        if (isOpen) document.addEventListener("mousedown", handleClickOutside);
        else document.removeEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [isOpen]);

    const onSubmit = async (data: IGetInTouchSchema) => {
        setLoading(true);
        try {
            // Simulate API call
            const payload = {
                "name": data.name,
                "email": data.email,
                "url": data.link,
                "mobileNo": data.phone,
                "type": data?.role
            }
            const response = await axios.post("/auth/contact-us/add", payload);
            if(response.status === 201){
                toastMessage.success(translate("Form_submitted_successfully"));
            }
        } catch (error) {
            console.error("Error submitting form:", error);
        } finally {
            setLoading(false);
            setIsOpen(false);
        }
    };

    const userRole = methods.watch("role");

    return (
        <>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                    <div
                        ref={modalRef}
                        data-aos="fade-up"
                        className="relative bg-white w-11/12 sm:w-[400px] md:w-[450px] rounded-lg shadow-lg p-6 sm:p-8"
                    >
                        {/* Close button */}
                        <button
                            onClick={() => setIsOpen(false)}
                            className="absolute top-4 right-4 text-gray-600 hover:text-black"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        {/* Form Heading */}
                        <div className="mb-4">
                            <h1 className="text-2xl font-semibold text-primary">
                                Get In Touch
                            </h1>
                        </div>

                        {/* Form */}
                        <div className="overflow-y-auto h-[320px] md:h-[400px] lg:h-[450px] pr-2">
                            <FormProvider {...methods}>
                                <form
                                    onSubmit={methods.handleSubmit(onSubmit)}
                                    className=" pb-3 w-full h-full flex-1 flex flex-col justify-between gap-3"
                                >
                                    <div className="grid grid-cols-1 gap-4">
                                        <div className="col-span-1">
                                            <Input
                                                label={translate("Tell_me_about_you_as_a")}
                                                name="role"
                                                type="select"
                                                options={[
                                                    { label: "Creator", value: "creator" },
                                                    { label: "Brand", value: "vendor" }
                                                ]}
                                                placeholder={`${translate("Tell_me_about_you_as_a")} ${translate("Enter_your_role")}`}
                                                lableClassName="text-md font-[400]"
                                            />
                                        </div>
                                        {(userRole === "vendor" || userRole === "creator") && <div className="col-span-1">
                                            <Input
                                                label={translate(userRole === "vendor" ? "Brand_Website" : "Social_Media_Handles")}
                                                placeholder={translate(userRole === "vendor" ? "Enter your website link" : "Enter_your_social_media_profile_link")}
                                                name="link"
                                                lableClassName="text-md font-[400]"
                                                type="url"
                                                required={false}
                                            />
                                        </div>}
                                        <div className="col-span-1">
                                            <Input
                                                label={translate("Name")}
                                                name="name"
                                                type="text"
                                                placeholder={translate("Enter_your_name")}
                                                lableClassName="text-md font-[400]"
                                                autoFocus
                                            />
                                        </div>
                                        <div className="col-span-1">
                                            <Input
                                                label={translate("Phone_number")}
                                                name={`phone`}
                                                type="tel"
                                                placeholder="XXXXX XXXXX"
                                                lableClassName="text-md font-[400]"
                                            />
                                        </div>
                                        <div className="col-span-1">
                                            <Input
                                                label={translate("Email_address")}
                                                name="email"
                                                type="email"
                                                placeholder={translate("Enter_your_email_address")}
                                                lableClassName="text-md font-[400]"
                                            />
                                        </div>
                                    </div>
                                    <div className="bg-white flex justify-center">
                                        <Button
                                            type="submit"
                                            size="small"
                                            loading={loading}
                                            disabled={loading}
                                            className="w-fit font-medium px-8 md:text-base text-sm"
                                        >
                                            {translate("Submit")}
                                        </Button>
                                    </div>
                                    <div className="my-3 text-center">
                                        {translate("Watch_Video")}
                                        <Link href="/video" className="text-primary-color font-medium">
                                            {/* {translate("Watch_Video")} */}
                                        </Link>
                                    </div>
                                    <div className="flex flex-col gap-2 justify-center items-center">
                                        <div className="flex">
                                            {translate("Creator")}{" : "}
                                            <Link target="_blank" href={youtubeVideoUrls?.creatorRegistration}
                                                className="ml-2 flex items-center gap-1 text-white bg-secondary bg-opacity-40 px-2 py-1 rounded-lg text-xs hover:bg-opacity-60 transition"
                                            >
                                                ▶ Watch How
                                            </Link>
                                        </div>
                                        <div className="flex">
                                            {translate("Brand")}{" : "}
                                            <Link target="_blank" href={youtubeVideoUrls?.vendorRegistration}
                                                className="ml-2 flex items-center gap-1 text-white bg-secondary bg-opacity-40 px-2 py-1 rounded-lg text-xs hover:bg-opacity-60 transition"
                                            >
                                                ▶ Watch How
                                            </Link>
                                        </div>
                                    </div>
                                </form>
                            </FormProvider>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default GetInTouchModal;
