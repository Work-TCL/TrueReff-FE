"use client";
import { ReactNode, useEffect, useState } from "react";

interface Props {
  children: ReactNode;
}

export default function AuthLayout({ children }: Props) {
  const [isClient, setIsClient] = useState(false);
  const [isPromptPassWordAdded, setIsPromptPassWordAdded] = useState<
    string | null
  >(null);

  useEffect(() => {
    setIsClient(true);
    const storedPasswordStatus = localStorage.getItem("isPromptPassWordAdded");
    setIsPromptPassWordAdded(storedPasswordStatus);

    if (!storedPasswordStatus) {
      // const password = prompt("Enter Password");
      // if (password === "8965") {
      localStorage.setItem("isPromptPassWordAdded", "true");
      setIsPromptPassWordAdded("true");
      // }
    }
  }, []);

  if (!isClient || !isPromptPassWordAdded) {
    return null;
  }

  return <>{children}</>;
}
