"use client";
import React from "react";
import DialogLayout from "@/app/_components/ui/layout/dialog";
import AnchorButton from "@/app/_components/ui/button/variant";
import { Button } from "@/components/ui/button";

export default function CancelRequest({
    onClose = () => { },
    collaborationId = "",
    handleCancelRequest = (id:string) => { }
}) {

    return (
        <DialogLayout
            open={true}
            size="!max-w-[638px] w-full overflow-auto"
            title="Cancel Request"
            onClose={() => onClose()}
        >
            <div className="p-4 sm:p-10 sm:bg-white sm:rounded-md sm:shadow-sm w-full text-center overflow-y-auto">
                <span className="mb-4 inline-flex justify-center items-center w-[62px] h-[62px] rounded-full border-4 border-yellow-50 bg-yellow-100 text-yellow-500">
                    <svg
                        className="w-5 h-5"
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        viewBox="0 0 16 16"
                    >
                        <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"></path>
                    </svg>
                </span>

                <h3 className="mb-2 text-2xl font-bold text-gray-800">Cancel Request</h3>
                <p className="text-gray-500">
                    Are you sure you would like to cancel this request?
                </p>

                <div className="mt-6 grid grid-cols-2 gap-x-4">
                    <Button
                        variant="outline"
                        type="button"
                        onClick={() => onClose()}
                        className="w-full h-full border-black bg-transparent text-base"
                    >Cancel</Button>
                        <Button
                            variant="secondary"
                            className={`text-white`}
                            onClick={() => handleCancelRequest(collaborationId)}
                        >
                            Ok
                        </Button>
                </div>
            </div>
        </DialogLayout>
    );
}
