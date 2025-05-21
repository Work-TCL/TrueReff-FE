"use client";
import React, { useState } from "react";
import { ImageOff, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { cn, getErrorMessage } from "@/lib/utils/commonUtils";
import axios from "@/lib/web-api/axios";
import { Card, CardContent } from "@/components/ui/card";
import { useTranslations } from "next-intl";
import { IBrandProduct } from "../list";
import Loader from "@/app/_components/components-common/layout/loader";
import TruncateWithToolTip from "@/app/_components/ui/truncatWithToolTip/TruncateWithToolTip";
import StatusBadge from "@/app/_components/components-common/status-badge";
import CancelRequest from "@/app/_components/components-common/dialogs/cancel-request";
import ToolTip from "@/app/_components/components-common/tool-tip";

const ProductCard = ({
    item: product,
    handleUpdateProduct,
}: {
    item: IBrandProduct;
    handleUpdateProduct: (id:string) => void;
}) => {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [isOpen, setIsOpen] = useState("");

    const handleDetailView = (id: string, vendorId: string) => {
        router.push(`/creator/brandsList/${vendorId}/${id}`);
    };

    const handleSendRequest = async () => {
        setLoading(true);
        try {
            const response = await axios.post(
                `/product/collaboration/creator/request-creator`,
                {
                    productId: product?._id,
                    vendorId: product?.vendorId,
                }
            );
            if (response.status === 201) {
                handleUpdateProduct(product?.vendorId);
                setIsOpen("")
                toast.success(
                    response?.data?.message
                );
            }
        } catch (err) {
            toast.error(getErrorMessage(err));
        } finally {
            setLoading(false);
        }
    };

    return (
        <><Card className="relative cursor-pointer w-full border border-stroke rounded-xl p-2 md:p-4 flex flex-col items-center text-center gap-3 hover:shadow-md transition-shadow bg-white overflow-hidden">
            <CardContent className="w-full p-0 flex flex-col items-center gap-3">
                {loading && <Loader />}
                {/* Image */}
                <div
                    className="bg-background rounded-lg max-w-full aspect-[4/3] w-full flex items-center justify-center overflow-hidden"
                    onClick={() => handleDetailView(product?._id, product?.vendorId)}
                >
                    {product.media?.length > 0 ? (
                        <img
                            src={product.media[0]}
                            alt={product.title}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <ImageOff className="w-8 h-8 text-gray-400" />
                    )}
                </div>

                {/* Info */}
                <div className="flex flex-col gap-2 text-start w-full overflow-hidden">
                    {/* Title */}
                    <TruncateWithToolTip
                        checkHorizontalOverflow={true}
                        className="text-lg font-semibold w-full truncate"
                        text={product.title}
                    />
                    {/* Status */}
                    <div className="flex justify-center mb-3 !text-sm absolute top-0 left-0 m-3 bg-white rounded">
                        {product?.collaboration?.collaborationStatus ? (
                            <StatusBadge status={product?.collaboration?.collaborationStatus} messageStatus={product?.collaboration?.collaborationStatus} />
                        ) : (
                            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center shadow" onClick={() => setIsOpen(product?._id)}>
                                <ToolTip content={"Send Collaboration Request"} delayDuration={500}><Plus className="text-primary" size={20} /></ToolTip>
                            </div>
                        )}
                    </div>
                    {/* Price and Discount */}
                    <div className="flex justify-between items-center w-full text-sm">
                        <span className="text-green-600 px-2 py-1 font-bold">
                            ${product.price || "0.00"}
                        </span>
                        {product.discount && (
                            <span className="text-red-500 text-xs bg-red-100 px-2 py-1 rounded-full">
                                Earn {product.discount}%
                            </span>
                        )}
                    </div>

                    {/* Category */}
                    {Array.isArray(product.categories) && product.categories.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                            {product.categories.map((tag: string) => (
                                <div
                                    key={tag}
                                    className={cn(
                                        "flex items-center gap-1 px-2 py-1 text-xs rounded-full bg-muted text-muted-foreground border border-muted-foreground"
                                    )}
                                >
                                    {tag}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
            {isOpen && (
                <CancelRequest
                    onClose={() => setIsOpen("")}
                    collaborationId={isOpen}
                    handleCancelRequest={handleSendRequest}
                    loading={loading}
                    title="Are you sure you want to send the collaboration request?"
                />
            )}
        </>
    );
};

export default ProductCard;