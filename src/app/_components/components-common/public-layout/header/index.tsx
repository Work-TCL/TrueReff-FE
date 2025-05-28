"use client";
import React, { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { IoLogOutOutline } from "react-icons/io5";
import Link from "next/link";
import { ArrowLeft, Menu, UserRound } from "lucide-react";
import toast from "react-hot-toast";
import socketService from "@/lib/services/socket-service";
import { useAuthStore } from "@/lib/store/auth-user";
import { useVendorStore } from "@/lib/store/vendor";
import { useCreatorStore } from "@/lib/store/creator";
import axios from "@/lib/web-api/axios";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils/commonUtils";

interface IHeaderProps {
    handleExpandSidebar?: () => void;
}
export default function Header({ handleExpandSidebar }: IHeaderProps) {
    const router = useRouter();
    const translate = useTranslations();
    const { account } = useAuthStore();
    const { vendor } = useVendorStore();
    const { creator } = useCreatorStore();
    return (
        <>
            <header className="bg-white justify-between px-3 py-3 flex items-center gap-1">
                <div className="flex  items-center">
                    <h2 className="hidden md:block md:text-2xl ml-2 text-lg font-bold text-primary">
                        {"truereff"}
                    </h2>
                </div>
                <div className="flex items-center gap-2">
                    {account?.email && <div className="ml-auto flex items-center md:gap-3 gap-2">
                        <Link
                            href={
                                creator.creatorId
                                    ? `/creator/settings`
                                    : `/vendor/settings`
                            }
                            className="flex gap-3 items-center w-fit"
                        >
                            <div
                                className="w-8 h-8 bg-background rounded-full bg-cover bg-center flex items-center justify-center"
                                style={{
                                    ...(creator.profile_image || vendor.profile_image
                                        ? {
                                            backgroundImage: `url(${creator.profile_image || vendor.profile_image
                                                })`,
                                        }
                                        : {}),
                                }}
                            >
                                {!(creator.profile_image || vendor.profile_image) && (
                                    <UserRound className="" color="#656466" />
                                )}
                            </div>
                            <p className="text-gray-black md:text-base text-sm md:block hidden">
                                {creator.full_name || vendor.business_name || account?.name}
                            </p>
                        </Link>
                    </div>}
                    <div
                        className={`flex justify-end items-center gap-4 w-full`}
                    >
                        {/* <ButtonPopover/> */}
                        {!account?.role && (
                            <>
                                <div
                                    onClick={() => router.push("/vendor-register")}
                                    className={cn(
                                        "text-black cursor-pointer md:text-[12px] lg:text-base  box-border border border-black rounded-[8px] py-[6px] px-[20px] hover:bg-secondary hover:text-white"
                                    )}
                                >
                                    <span className="hidden sm:block">
                                        {translate("Become_a_Brand")}
                                    </span>
                                    <span className="block sm:hidden">
                                        {translate("Brand")}
                                    </span>
                                </div>
                                <div
                                    onClick={() => router.push("/creator-registration")}
                                    className={cn(
                                        "text-black cursor-pointer md:text-[12px] lg:text-base  box-border border border-black rounded-[8px] py-[6px] px-[20px] hover:bg-secondary hover:text-white"
                                    )}
                                >
                                    <span className="hidden sm:block">
                                        {translate("Become_a_Creator")}
                                    </span>
                                    <span className="block sm:hidden">
                                        {translate("Creator")}
                                    </span>
                                </div>
                            </>
                        )}
                        {account?.email && <Link href="?auth=logout" className="mx-2 block">
                            <IoLogOutOutline className="text-2xl text-primary" />
                        </Link>}
                    </div>
                </div>
            </header>

        </>
    );
}
