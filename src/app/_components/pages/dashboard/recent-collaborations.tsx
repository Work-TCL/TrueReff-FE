"use client";
import React, { useCallback, useEffect, useState } from "react";
import { Table, TableHeader, TableRow, TableBody } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle } from "lucide-react";
import { translate } from "@/lib/utils/translate";
import TruncateWithToolTip from "../../ui/truncatWithToolTip/TruncateWithToolTip";
import { CustomTableHead } from "../../components-common/tables/CustomTableHead";
import { CustomTableCell } from "../../components-common/tables/CustomTableCell";
import axios from "@/lib/web-api/axios";
import { ICategory, ICollaboration } from "../creator/collaboration";
import { getErrorMessage } from "@/lib/utils/commonUtils";
import { toastMessage } from "@/lib/utils/toast-message";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { useRouter } from "next/navigation";
import CollaborationTable from "../creator/collaboration-table";
import Loading from "@/app/creator/loading";
import { EmptyPlaceHolder } from "../../ui/empty-place-holder";

// Sample Data

export default function RecentCollaborations() {
    const router = useRouter();
    const [collaborations, setCollaborations] = useState<ICollaboration[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    const fetchCollaboration = async () => {
        setLoading(true);
        try {
            const response = await axios.get(
                `/product/collaboration/list?page=1&limit=3`);
            if (response.status === 200) {
                const collaborationData = response.data.data;
                if (collaborationData && typeof collaborationData === "object") {
                    const collaborationArray = collaborationData.data || [];

                    if (Array.isArray(collaborationArray)) {
                        let result = collaborationArray.map((ele: ICollaboration) => {
                            let category =
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
                            let subCategory =
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
                            let tag = ele.product.tags.join(", ");
                            return {
                                ...ele,
                                product: {
                                    ...ele?.product,
                                    category: category,
                                    subCategories: subCategory,
                                    tag,
                                },
                            };
                        });
                        // setCollaborations([...result]);
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
                {collaborations?.length > 0 && <Button variant="link" className="text-primary md:h-10 h-7" onClick={() => router.push("/creator/collaboration")}>
                    {translate("View_all")}
                </Button>}
            </div>
            {loading ? <Loading height="fit"/> : <div className="overflow-auto">
            {collaborations?.length > 0 ?<CollaborationTable
                data={collaborations}
                isDashboard={true}
                fetchCollaboration={() => fetchCollaboration()}
              />: <EmptyPlaceHolder
                          title={"No_Active_Collaborations"}
                          description={
                            "Collaborations_will_appear_here_once_you've_created_or_joined_one._Share_data_and_insights_with_your_team_effortlessly."
                          }
                        />}
            </div>}
        </div>
    );
}
