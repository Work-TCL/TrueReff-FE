import { cn } from "@sohanemon/utils"
import React from 'react'
import { GoChevronLeft } from "react-icons/go"

interface IBackButton {
    className?: string
}

export default function BackButton({ className = '' }: IBackButton) {
    return (
        <div className={cn('text-sm text-gray-darken cursor-pointer flex items-center gap-2', className)}>
            <GoChevronLeft className="text-xl" /> Back
        </div>
    )
}
