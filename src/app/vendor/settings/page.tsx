import React, { Suspense } from "react";

export default async function SettingsPage({ searchParams }: any) {
  // const profile = await getProfileAPI();
  // const editKey = searchParams?.edit; // Ensure editKey is correctly extracted

  // // Check if profile data is available before rendering
  // if (!profile) {
  //   return <div>Error loading profile data</div>;
  // }

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <h1>hello</h1>
      {/* <Profile profile={profile?.vendor} editKey={editKey} /> */}
    </Suspense>
  );
}