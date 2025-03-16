import Profile from "@/app/_components/pages/settings/profile";
import { getProfileAPI } from "@/lib/web-api/user";
import React from "react";

export default async function SettingsPage({ searchParams }: any) {
  const profile = await getProfileAPI();
  const editKey = await searchParams;
  return <Profile profile={profile?.vendor} editKey={editKey?.edit} />;
}
