import Profile from "@/app/_components/pages/settings/profile";
import React from "react";

export default async function SettingsPage({ searchParams }: any) {
  
  const editKey = searchParams?.edit; // Ensure editKey is correctly extracted

  return (
      <Profile editKey={editKey} />
  );
}