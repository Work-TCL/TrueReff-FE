import AuthenticatedLayout from "@/lib/components/authenticated-layout";

export default function App() {
  return <AuthenticatedLayout redirectPath="/dashboard" />
} 
