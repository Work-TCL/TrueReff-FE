import { redirect } from "next/navigation";
import CreatorTable from "./_components/tables/CreatorTable";
import Sidebar from "./_components/sidebar";
import ChartLine from "./_components/charts/SalesChart";
import DonutChart from "./_components/charts/DonutChat";
import MostSellingBrands from "./_components/charts/MostSellingBrands";

export default function App() {
  // return redirect("/register");
  // return <CreatorTable/>
  // return <Sidebar/>
  return <MostSellingBrands/>
}
