import { cn } from "@sohanemon/utils"
import React from 'react'

interface IAuthTitle {
    text: string
    className?: string
}

export default function AuthDescription({ text, className }: IAuthTitle) {
    return (
        <div className={cn("text-gray-desc text-sm md:text-start text-center", className)}>
            {text}
        </div>
    )
}
