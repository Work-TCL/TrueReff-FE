import { redirect } from "next/navigation";
import CreatorTable from "./_components/tables/CreatorTable";

export default function App() {
  // return redirect("/register");
  return <CreatorTable/>
}
