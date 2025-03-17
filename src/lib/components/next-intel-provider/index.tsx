"use client";
import { NextIntlClientProvider } from "next-intl";
import React, { ReactNode } from "react";

interface IProps {
  children: ReactNode;
  messages: any;
}

export default function NextIntelProvider({ children, messages }: IProps) {
  return (
    <NextIntlClientProvider messages={messages}>
      {children}
    </NextIntlClientProvider>
  );
}
