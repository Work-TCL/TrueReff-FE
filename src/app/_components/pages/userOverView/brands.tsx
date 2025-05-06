"use client";

import { Table, TableHeader, TableRow, TableBody } from "@/components/ui/table";
import { translate } from "@/lib/utils/translate";
import { CustomTableHead } from "../../components-common/tables/CustomTableHead";
import { CustomTableCell } from "../../components-common/tables/CustomTableCell";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import TruncateWithToolTip from "../../ui/truncatWithToolTip/TruncateWithToolTip";
import { useEffect, useState } from "react";
import { TablePagination } from "../../components-common/tables/Pagination";
import { useRouter } from "next/navigation";
import { getErrorMessage } from "@/lib/utils/commonUtils";
import { toastMessage } from "@/lib/utils/toast-message";
import { getVendorList } from "@/lib/web-api/auth";
import Loading from "@/app/creator/loading";
import { EmptyPlaceHolder } from "../../ui/empty-place-holder";

interface ITableProps {
  title: string;
}
interface IContact {
    name: string;
    phone: string;
    email: string;
    isDefault: boolean;
    _id: string;
}
interface IBrand {
    _id: string;
    accountId: string;
    business_name: string;
    company_email: string;
    company_phone: string;
    gst_number: string;
    website: string;
    type_of_business: string;
    contacts: IContact[];
    omni_channels: string [];
    addresses: any[];
    createdAt: string;
    updatedAt: string;
    profile_image: string;
}
export default function Brands({title}:ITableProps) {
  const router = useRouter();
  const [currentPage,setCurrentPage] = useState<number>(1);
  const [totalPages,setTotalPages] = useState<number>(0);
  const [brands,setBrands] = useState<IBrand[]>([])
  const [loading,setLoading] = useState<boolean>(true);
  const [internalLoading,setInternalLoading] = useState<boolean>(false);
  const limit = 10;
    const handleViewVendorDetails = (id: string) => {
      router.push(`/vendor/profile/${id}`);
    };
    useEffect(() => {
      fetchBrandList(currentPage);
    },[])
    const fetchBrandList = async (page:number,internalLoading:boolean = false) => {
      internalLoading ? setInternalLoading(true) : setLoading(true);
      try{
        const response = await getVendorList(page,limit)
       const data = response?.list;
       const count = response?.count;
       if(data?.length > 0){
        const brandList = data?.map((brand:IBrand) => {
          return {...brand};
        })
        setBrands(brandList);
        setTotalPages(Math.ceil(count / limit));
        setCurrentPage(page);
       } else {
        setBrands([]);
        setTotalPages(0);
        setCurrentPage(1);
       }
      } catch(error) {
        let errorMessage = await getErrorMessage(error);
        toastMessage.error(errorMessage);
      } finally{
        setLoading(false);
        setInternalLoading(false);
      }
    }
    const handlePageChange = (page:number) => {
      page !== currentPage && fetchBrandList(page,true);
    }
  return (
    <div className="relative flex flex-col gap-3 p-4 bg-white rounded-[20px]">
      <div className="flex justify-between items-center">
        <h2 className="md:text-xl text-base text-text font-semibold">
          {translate(title)}
        </h2>
      </div>
      {internalLoading && <Loading isTransparent={true} height="fit"/>}
      {loading ? <Loading height="fit"/> : brands?.length > 0 ? <div className="overflow-auto">
        <Table className="min-w-full border border-gray-200 rounded-2xl">
          <TableHeader className="bg-gray-100">
            <TableRow>
              <CustomTableHead className="w-2/6 p-2 text-text text-left text-sm">
                {translate("Brand_Name")}
              </CustomTableHead>
              <CustomTableHead className="w-2/6 p-2 text-text text-left text-sm">
                {translate("Business_Type")}
              </CustomTableHead>
              <CustomTableHead className="w-2/6 p-2 text-text text-left text-sm">
                {translate("Channels")}
              </CustomTableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {brands.map((brand, index) => (
              <TableRow key={index} className="hover:bg-gray-50">
                <CustomTableCell parentClassName="p-2 text-font-grey text-sm">
                  <div className="flex items-center gap-2 cursor-pointer" onClick={() => handleViewVendorDetails(brand?._id)}>
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={brand?.profile_image ? brand?.profile_image : "/assets/profile/profile-image.png" } />
                    </Avatar>
                    {brand?.business_name}
                  </div>
                </CustomTableCell>
                <CustomTableCell parentClassName="p-2 text-font-grey text-sm">
                  <span className="text-text ">
                    {" "}
                    <TruncateWithToolTip
                      checkHorizontalOverflow={false}
                      linesToClamp={2}
                      text={brand?.type_of_business}
                    />
                  </span>
                </CustomTableCell>
                <CustomTableCell parentClassName="p-2 text-font-grey text-sm">
                  <span className="text-text ">
                    {" "}
                    <TruncateWithToolTip
                      checkHorizontalOverflow={false}
                      linesToClamp={2}
                      text={brand?.omni_channels?.length > 0 ? brand?.omni_channels?.join(", "):""}
                    />
                  </span>
                </CustomTableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>:<EmptyPlaceHolder
                        title={"No_Brands_Available"}
                        description={
                          "It seems there are currently no brands to display. Please check back later."
                        }
                      />}
      {totalPages > 1 && <TablePagination totalPages={totalPages} activePage={currentPage} onPageChange={handlePageChange}  />}
    </div>
  );
}
