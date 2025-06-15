"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { IoLogOutOutline } from "react-icons/io5";
import Link from "next/link";
import { UserRound } from "lucide-react";
import { useAuthStore } from "@/lib/store/auth-user";
import { useVendorStore } from "@/lib/store/vendor";
import { useCreatorStore } from "@/lib/store/creator";
import Image from "next/image";

interface IHeaderProps {
    handleExpandSidebar?: () => void;
}
export default function Header({ handleExpandSidebar }: IHeaderProps) {
    const router = useRouter();
    const { account } = useAuthStore();
    const { vendor } = useVendorStore();
    const { creator } = useCreatorStore();
    return (
        <><header className="bg-white px-3 py-3 flex items-center justify-between gap-1">
            <div className="flex space-x-2 items-center cursor-pointer" onClick={() => router.push("/")}>
                <Image
                    width={220}
                    height={35}
                    src="/assets/common/truereff-dark.svg"
                    alt="TrueReff"
                    className={`w-[225px] h-[35px] mx-auto`}
                />
            </div>
            <div className="flex items-center space-x-2">
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
                <Link href="?auth=logout" className="mx-2 block">
                    <IoLogOutOutline className="text-2xl text-primary" />
                </Link>
            </div>
        </header>
        </>
    );
}
