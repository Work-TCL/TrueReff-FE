"use client";
import { Card } from "@/components/ui/card";
import { daysFilter, formatFloatValue, formatNumber } from "@/lib/utils/constants";
import axios from "@/lib/web-api/axios";
import { Star } from "lucide-react";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Select from "react-select";
import Loading from "@/app/creator/loading";

const customStyles = {
  placeholder: (base: any) => ({
    ...base,
    fontSize: "0.875rem ", // Tailwind text-sm
    color: "#a1a1aa", // Tailwind slate-400
  }),
  control: (base: any, state: any) => ({
    ...base,
    borderRadius: "8px",
    borderColor: state.isFocused ? "#FF4979" : base.borderColor,
    boxShadow: "none",
    "&:hover": {
      borderColor: "#FF4979",
    },
    transition: "all 0.2s ease",
  }),
  option: (base: any, state: any) => ({
    ...base,
    backgroundColor: state.isFocused ? "rgba(255, 73, 121, 0.1)" : "white",
    color: "black",
    "&:active": {
      backgroundColor: "rgba(255, 73, 121, 0.2)",
    },
    cursor:"pointer"
  }),
  menu: (base:any) => ({
    ...base,
    width: "150px"
  })
};
interface ICollabStats {
  totalCollaborations: number;
  totalRevenue: number;
  totalOrders: number;
  conversionRate: number;
  rating: {
       totalRating: number;
       numberOfRatings: number;
   }
}
export default function VendorStats() {
  const translate = useTranslations();
  const { id } = useParams();
  const [filter,setFilter] = useState<string>("7");
  const [loading,setLoading] = useState<boolean>(false);
  const initialState = {
   totalCollaborations: 0,
   totalRevenue: 0,
   totalOrders: 0,
   conversionRate: 0,
   rating: {
        totalRating: 0,
        numberOfRatings: 0
    }
}
  const [collabStats,setCollabStats] = useState<ICollabStats>(initialState)

  useEffect(()=> {
    // fetchCollabWithCompanies(filter);
  },[])
  const fetchCollabWithCompanies = async (days:string) => {
    setLoading(true);
    try{
        const response = await axios.get(`/auth/creator/stats?creatorId=${id}&days=${days}`);
        if(response?.data?.data){
          setCollabStats(response?.data?.data)
        } else {
          setCollabStats(initialState);
        }
    } catch(error) {
      
    } finally {
      setLoading(false)
    }
  }
  const handleFilterValue = (value:any) => {
    setFilter(value.value);
    fetchCollabWithCompanies(value.value);
  }
  return (
    <Card className="rounded-[20px] p-6 bg-white border-0 shadow-none flex-1">
      {/* Header Section */}
      {loading ? (<Loading height="fit"/>) : <>
      <div className="flex justify-between items-center">
        <h2 className="sm:text-xl text-base font-medium text-text">
          {translate("Brand_Stats")}
        </h2>
        <Select
                styles={customStyles}
                value={[
                  {
                    value: filter,
                    label: filter
                      ? daysFilter.find((ele) => ele?.value === filter)?.label
                      : "Select Days",
                  },
                ]}
                onChange={handleFilterValue}
                options={daysFilter}
                className="basic-multi-select focus:outline-none focus:shadow-none"
                placeholder="Select Days"
              />
      </div>

      {/* Total Count */}
      {/* <div className="mt-3 flex items-center gap-2">
        <span className="md:text-[40px] text-lg font-medium text-text">
          6,4K
        </span>
        <span className="text-xs font-medium text-success bg-success-light px-2 py-1 rounded-md">
          +3.4%
        </span>
      </div> */}

      {/* Progress Indicator */}
      {/* <div className="mt-4 flex h-1.5 w-full rounded-full gap-2">
        <div className="bg-purple h-full w-[25%] rounded-l-full"></div>
        <div className="bg-light-blue h-full w-[25%]"></div>
        <div className="bg-orange h-full w-[25%]"></div>
        <div className="bg-blue h-full w-[25%] rounded-r-full"></div>
      </div> */}

      {/* Company Stats */}
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
      <StatCard name={translate("Collaboration")} value={formatNumber(collabStats?.totalCollaborations)} growth="" color="light-blue" />
        <StatCard name={translate("Conversion_Rate")} value={formatNumber(collabStats?.conversionRate)} growth="" color="purple" />
        <StatCard name={translate("Orders")} value={formatNumber(collabStats?.totalOrders)} growth="" color="orange" />
        <StatCard
          name={translate("Revenues")}
          value={formatNumber(collabStats?.totalRevenue)}
          growth=""
          color="blue"
          isNegative
        />
        <StatCard
          name={translate("Ratings")}
          value={<div className="flex items-center gap-2"><Star size={20} color="#FFAD33" fill="#FFAD33" /><span>{`${formatFloatValue(collabStats?.rating?.totalRating)}/${collabStats?.rating?.numberOfRatings}`}</span></div>}
          growth=""
          color="blue"
          isNegative
        />
      </div></> }
    </Card>
  );
}

// Reusable Stat Card Component
function StatCard({
  name,
  value,
  growth,
  color,
  isNegative,
}: {
  name: string;
  value: any;
  growth: string;
  color: string;
  isNegative?: boolean;
}) {
  return (
    <div className="p-4 rounded-lg border bg-white shadow-sm flex flex-col gap-1">
      <div className="flex items-center gap-2">
        <span className={`h-2 w-2 rounded-full bg-${color}`}></span>
        <span className="text-font-grey font-medium md:text-base text-sm">
          {name}
        </span>
      </div>
      <div className="flex items-center gap-2 p-1">
        <span className="md:text-[20px] text-sm font-medium text-text">
          {value}
        </span>
        {growth && <span
          className={`md:text-xs text-[10px] font-medium px-2 py-1 rounded-md ${
            isNegative
              ? "text-red-600 bg-red-100"
              : "text-success bg-success-light"
          }`}
        >
          {growth}
        </span>}
      </div>
    </div>
  );
}
