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
            size="!max-w-[700px] w-full overflow-auto m-2"
            title=""
            skipClose={true}
        // onClose={() => !loading && onClose()}
        >
            <div className="mx-auto shadow-xl p-6 text-center">
                <div className="flex justify-center mb-4">
                    <img src="/assets/product/collab-accepted.svg" className="w-25 h-25" />
                </div>

                <h2 className="text-2xl font-bold text-gray-800 mb-2">Collaboration Confirmed!</h2>
                <p className="text-gray-600 mb-6">
                    You’ve successfully locked in a fixed commission for this product. You can now promote and
                    earn directly from your creator store.
                </p>

                <div className="text-left text-sm text-gray-700 space-y-2 mb-6">
                    <p className="font-semibold text-lg">
                    Details Section:
                    </p>
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

                <div className="my-4"><Link href={`/store/${collaborationData?.creatorId?.store_name}`} target="_blank" className="w-full bg-white border hover:text-white py-2 my-4 px-4 rounded-xl hover:bg-gray-900 transition" >
                    View on Creator Store
                </Link></div>
            </div>
        </DialogLayout>
    );
}
