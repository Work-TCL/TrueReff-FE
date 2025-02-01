import AuthenticatedLayout from "@/lib/components/authenticated-layout";

export default function PrivateLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <AuthenticatedLayout>{children}</AuthenticatedLayout>;
}


// export default function PrivateLayout({
//   children,
// }: Readonly<{
//   children: React.ReactNode;
// }>) {
//   return <AuthenticatedLayout>
//     <div className="flex">
//       <Sidebar />
//       <main className="flex-1">
//     {children}
//         {/* <Component {...pageProps} /> */}
//       </main>
//     </div>
//     </AuthenticatedLayout>;
// }
