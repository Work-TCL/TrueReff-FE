"use client";
import React from "react";
import DialogLayout from "@/app/_components/ui/layout/dialog";
import { Button } from "@/components/ui/button";
interface IConfirmationProps {
    onClose?: () => void;
    handleConfirm?:() =>void;
    loading?: boolean;
    title?: string;
    note?: string;
}
export default function Confirmation({
    onClose = () => { },
    handleConfirm = () => { },
    loading = false,
    title = "Are you sure you would like to perform this action?",
    note
}:IConfirmationProps) {

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
                    {title}
                </p>
                {note && <p className="text-xs md:text-sm text-red-500">
                    {`Note: ${note}`}
                </p>}

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
                        className="w-full h-full border-black text-white text-base"
                        onClick={() => handleConfirm()}
                    >
                        Ok
                    </Button>
                </div>
            </div>
        </DialogLayout>
    );
}
