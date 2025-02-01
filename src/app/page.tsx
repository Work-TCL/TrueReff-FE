import { redirect } from "next/navigation";
import CreatorTable from "./_components/tables/CreatorTable";
import Sidebar from "./_components/sidebar";

export default function App() {
  // return redirect("/register");
  // return <CreatorTable/>
  return <Sidebar/>
}
