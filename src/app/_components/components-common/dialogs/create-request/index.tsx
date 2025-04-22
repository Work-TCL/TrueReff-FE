"use client";
import React from "react";
import DialogLayout from "@/app/_components/ui/layout/dialog";
import { Button } from "@/components/ui/button";

export default function CreateRequest({
    onClose = () => { },
    collaborationId = "",
    handleSendRequest = (id: string) => { },
    loading = false,
}) {

    return (
        <DialogLayout
            open={true}
            size="!max-w-[438px] w-full overflow-auto m-2"
            title=""
            skipClose={true}
        // onClose={() => !loading && onClose()}
        >
            <div className="p-2 sm:p-4 sm:bg-white sm:rounded-md sm:shadow-sm w-full flex flex-col gap-4 overflow-y-auto">
                <p className="text-xs md:text-sm text-gray-500">
                    Are you sure you would like to send collaboration request?
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-4">
                    <div /><div />
                    <Button
                        variant="outline"
                        type="button"
                        disabled={loading}
                        onClick={() => onClose()}
                        className="w-full h-full border-black bg-transparent text-base"
                    >Cancel</Button>
                    <Button
                        disabled={loading}
                        variant="secondary"
                        className="w-full h-full border-black text-white"
                        onClick={() => handleSendRequest(collaborationId)}
                    >
                        Ok
                    </Button>
                </div>
            </div>
        </DialogLayout>
    );
}
