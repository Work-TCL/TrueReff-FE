import Sidebar from "@/lib/components/layout/dashboard/sidebar"
import React from 'react'
import Header from "./header"

interface IDashboardLayout {
    children: React.ReactNode
}


export default function DashboardLayout({ children }: IDashboardLayout) {
    return (
        <div className="flex h-screen overflow-hidden">
            <Sidebar />
            <main className="flex-1 w-full h-full overflow-hidden flex flex-col">
                <Header />
                <div className="flex-1 overflow-auto">
                    {children}
                </div>
            </main>
        </div>
    )
}
