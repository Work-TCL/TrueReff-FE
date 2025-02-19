import React, { ReactNode } from "react";

export default function SectionLayout({
  children,
  title = "",
}: {
  children: ReactNode
  title: string
}) {

  return (
    <div className="max-w-custom-1 mx-auto mt-10 lg:mt-24 px-4 relative">
      <div className="flex items-center justify-between">
        <h2 className="text-heading">{title}</h2>
      </div>
      {children}
    </div>
  );
}
