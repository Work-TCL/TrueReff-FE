"use client";

import { useEffect } from "react";

export default function OpenApp({ searchParams }: any) {

  useEffect(() => {
    const url = `apptruereff://creator-register?message=${searchParams?.message}`;

    const now = Date.now();

    window.location.href = url;

    setTimeout(() => {
      if (Date.now() - now < 2000) {
        window.location.href = url;
      }
    }, 1500);
  }, []);

  return <p>Opening app...</p>;
}