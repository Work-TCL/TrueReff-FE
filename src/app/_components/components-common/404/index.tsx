"use client";
import { useTranslations } from "next-intl";
import React from "react";

export default function NotFound() {
  const t = useTranslations("notFound");
  return (
    <main className="grid min-h-screen place-items-center bg-white px-6 py-24 sm:py-32 lg:px-8">
      <div className="text-center">
        <p className="text-base font-semibold text-primary">404</p>
        <h1 className="mt-4 text-5xl font-semibold tracking-tight text-balance text-gray-900 sm:text-7xl">
          {t("notfoundTitle")}
        </h1>
        <p className="mt-6 text-lg font-medium text-pretty text-gray-500 sm:text-xl/8">
          {t("notfoundDesc")}
        </p>
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <a
            href="/"
            className="rounded-md bg-primary px-3.5 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            {t("notfoundGoBack")}
          </a>
        </div>
      </div>
    </main>
  );
}
