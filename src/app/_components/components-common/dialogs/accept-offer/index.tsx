"use client";
import React from "react";
import DialogLayout from "@/app/_components/ui/layout/dialog";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function CollaborationConfirmed({
    onClose = () => { },
    collaborationData,
    getCommissionType
}:{collaborationData:any, onClose?: () => void,getCommissionType:() => any}) {
    const translate = useTranslations();
    const router = useRouter();
    return (
        <DialogLayout
            open={true}
            size="!max-w-[438px] w-full overflow-auto m-2"
            title=""
            skipClose={true}
        // onClose={() => !loading && onClose()}
        >
            <div className="max-w-md mx-auto shadow-xl p-6 text-center border">
                <div className="flex justify-center mb-4">
                    <img src="/assets/product/collab-accepted.svg" className="w-25 h-25" />
                </div>

                <h2 className="text-2xl font-bold text-gray-800 mb-2">Collaboration Confirmed!</h2>
                <p className="text-gray-600 mb-6">
                    You’ve successfully locked in a fixed commission for this product. You can now promote and
                    earn directly from your creator store.
                </p>

                <div className="text-left text-sm text-gray-700 space-y-2 mb-6">
                    <p>
                        <span className="font-semibold">Product Name:</span>{" "}
                        <span>{collaborationData?.productId?.title}</span>
                    </p>
                    <p>
                        <span className="font-semibold">Your Commission:</span>{" "}
                        <span>{getCommissionType()}</span>
                    </p>
                    <p>
                        <span className="font-semibold">Your Affiliate Link:</span>{" "}
                        <Link
                            href={collaborationData?.crmLink??""}
                            className="text-pink-600 hover:underline break-words"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                           {collaborationData?.crmLink}
                        </Link>
                    </p>
                </div>

                <button className="w-full bg-white border hover:text-white py-2 px-4 rounded-xl hover:bg-gray-900 transition" onClick={() => router.push(`/store/${collaborationData?.creatorId?.store_name}`)}>
                    View on Creator Store
                </button>
            </div>
        </DialogLayout>
    );
}
