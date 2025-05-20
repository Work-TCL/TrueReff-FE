"use client";
import React, { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import axios from "@/lib/web-api/axios";
import { ICategory, ICollaboration } from "../creator/collaboration";
import { getErrorMessage } from "@/lib/utils/commonUtils";
import { toastMessage } from "@/lib/utils/toast-message";
import { useRouter } from "next/navigation";
import CollaborationTable from "../creator/collaboration-table";
import Loading from "@/app/creator/loading";
import { EmptyPlaceHolder } from "../../ui/empty-place-holder";
import { useTranslations } from "next-intl";

// Sample Data

export default function RecentCollaborations() {
  const translate = useTranslations();
  const router = useRouter();
  const [collaborations, setCollaborations] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchCollaboration = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `/product/collaboration/creator/list?page=1&limit=3`
      );
      if (response.status === 200) {
        const collaborationData = response.data.data;
        if (collaborationData && typeof collaborationData === "object") {
          const collaborationArray = collaborationData.list || [];

          if (Array.isArray(collaborationArray)) {
            let result = collaborationArray.map((ele: ICollaboration) => {
              let category =
                ele.productId.category?.length > 0
                  ? ele.productId.category
                      .filter(
                        (category: ICategory) => category?.parentId === null
                      )
                      .map((category: ICategory) => {
                        return category?.name;
                      })
                  : "";
              // let subCategory =
              //   ele.productId.category?.length > 0
              //     ? ele.productId.category
              //         .filter(
              //           (category: ICategory) => category?.parentId !== null
              //         )
              //         .map((category: ICategory) => {
              //           return category?.name;
              //         })
              //         .join(", ")
              //     : "";
              let tag = ele.productId.tags.join(", ");
              return {
                ...ele,
                productId: {
                  ...ele?.productId,
                  categories: category,
                  // subCategories: subCategory,
                  tag,
                },
              };
            });
            setCollaborations([...result]);
          } else {
            setCollaborations([]);
          }
          setLoading(false);
        } else {
          setCollaborations([]);
          setLoading(false);
        }
      }
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      toastMessage.error(errorMessage);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCollaboration();
  }, []);
  return (
    <div className="p-4 bg-white rounded-[20px]">
      <div className="flex justify-between items-center mb-4">
        <h2 className="md:text-xl text-base text-text font-semibold">
          {" "}
          {translate("Recent_Collaboration")}
        </h2>
        {collaborations?.length > 0 && (
          <Button
            variant="link"
            className="text-primary md:h-10 h-7"
            onClick={() => router.push("/creator/collaboration")}
          >
            {translate("View_all")}
          </Button>
        )}
      </div>
      {loading ? (
        <Loading height="fit" />
      ) : (
        <div className="overflow-auto">
          {collaborations?.length > 0 ? (
            <CollaborationTable
              data={collaborations}
              isDashboard={true}
              fetchCollaboration={() => fetchCollaboration()}
            />
          ) : (
            <EmptyPlaceHolder
              title={translate("No_Active_Collaborations")}
              description={translate("No_Active_Collaborations_Desc")}
            />
          )}
        </div>
      )}
    </div>
  );
}
