"use client";
import { Button } from "@/components/ui/button";
import { translate } from "@/lib/utils/translate";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { getErrorMessage } from "@/lib/utils/commonUtils";
import { ICategory } from "@/lib/types-api/vendor";
import axios from "@/lib/web-api/axios";
import { useRouter } from "next/navigation";
import CancelRequest from "../dialogs/cancel-request";
import { ICollaboration } from "../../pages/vendor-collobration/collaboration";
import Loading from "@/app/vendor/loading";
import CollaborationTable from "../../pages/vendor-collobration/collaboration-table";
import { useAuthStore } from "@/lib/store/auth-user";
import { EmptyPlaceHolder } from "../../ui/empty-place-holder";

// Sample Data
interface IRequestCancel {
  collaborationId: string;
  status: string;
  show: boolean;
}

export default function RecentActivities() {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(true);
  const { account: user } = useAuthStore();
  const [collaborations, setCollaborations] = useState<ICollaboration[]>([]);
  const pageSize = 3;
  const initialValue = { show: false, collaborationId: "", status: "" };
  const [isOpen, setIsOpen] = useState<IRequestCancel>(initialValue);

  // get user role
  const getUserType = () => {
    return { vendor: "Creator", creator: "Brand" }[user?.role] ?? "";
  };

  const handleStatusChangeRequest = async (
    status: "accepted" | "rejected",
    collaborataionId: string
  ) => {
    setLoading(true);
    try {
      const response: any = await axios.put(
        `/product/collaboration/request/status`,
        {
          status: status,
          collaborationId: collaborataionId,
        }
      );
      if (response.status === 200) {
        toast.success(response.data.message);
        await fetchCollaboration();
        setIsOpen(initialValue);
      }
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
      setIsOpen(initialValue);
    }
  };

  const handleCancelRequest = async () => {
    setLoading(true);
    try {
      const response: any = await axios.delete(
        `/product/collaboration/request/cancel/${isOpen?.collaborationId}`
      );
      if (response.status === 200) {
        toast.success(response.data.message);
        await fetchCollaboration();
        setLoading(false);
        setIsOpen(initialValue);
      } else {
        setLoading(false);
        setIsOpen(initialValue);
      }
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      toast.error(errorMessage);
      setLoading(false);
      setIsOpen(initialValue);
    }
  };

  const handleConfirm = () => {
    if (isOpen?.status === "cancel") {
      handleCancelRequest();
    } else {
      handleStatusChangeRequest("rejected", isOpen?.collaborationId);
    }
  };
  // Get Creator list
  const fetchCollaboration = async () => {
    try {
      const response = await axios.get(
        `/product/collaboration/list?page=${1}&limit=${pageSize}`
      );
      if (response.status === 200) {
        const collaborationData = response.data.data;
        if (collaborationData && typeof collaborationData === "object") {
          const collaborationArray = collaborationData.data || [];

          if (Array.isArray(collaborationArray)) {
            let result = collaborationArray.map((ele: ICollaboration) => {
              ele.product.category =
                ele.product.categories?.length > 0
                  ? ele.product.categories
                      .filter(
                        (category: ICategory) => category?.parentId === null
                      )
                      .map((category: ICategory) => {
                        return category?.name;
                      })
                      .join(", ")
                  : "";
              ele.product.subCategories =
                ele.product.categories?.length > 0
                  ? ele.product.categories
                      .filter(
                        (category: ICategory) => category?.parentId !== null
                      )
                      .map((category: ICategory) => {
                        return category?.name;
                      })
                      .join(", ")
                  : "";
              ele.product.tag = ele.product.tags.join(", ");
              return { ...ele };
            });
            setCollaborations([...result]);
          } else {
          }
          setLoading(false);
        } else {
          setCollaborations([]);
          setLoading(false);
        }
      }
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      toast.error(errorMessage);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCollaboration();
  }, []);
  return (
    <div className="p-4 bg-white rounded-[20px] relative overflow-hidden h-full flex-1">
      {loading ? (
        <div className="absolute top-0 bottom-0 right-0 left-0 z-[999] flex justify-center items-center bg-white/50">
          <Loading height="fit" />
        </div>
      ) : null}
      <div className="flex justify-between items-center mb-4">
        <h2 className="md:text-xl text-base text-text font-semibold">
          {" "}
          {translate("Recent_Collobration")}
        </h2>
        <Button
          onClick={() => router?.push(`/vendor/creators/collaboration`)}
          variant="link"
          className="text-primary md:h-10 h-7"
        >
          {" "}
          {translate("View_all")}
        </Button>
      </div>
      <div className="overflow-auto">
        {collaborations?.length > 0 ? (
          <CollaborationTable
            data={collaborations}
            user={getUserType()}
            refreshCentral={() => fetchCollaboration()}
            loader={false}
          />
        ) : (
          <EmptyPlaceHolder
            title={"No_Active_Collaborations"}
            description={
              "Collaborations_will_appear_here_once_you've_created_or_joined_one._Share_data_and_insights_with_your_team_effortlessly."
            }
          />
        )}

        {isOpen?.show && (
          <CancelRequest
            onClose={() => setIsOpen(initialValue)}
            collaborationId={""}
            handleCancelRequest={handleConfirm}
            loading={loading}
          />
        )}
      </div>
    </div>
  );
}
