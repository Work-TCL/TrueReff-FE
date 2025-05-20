'use client';

import Input from '@/components/ui/input';
import socketService from '@/lib/services/socket-service';
import { useAuthStore } from '@/lib/store/auth-user';
import { cn, getErrorMessage } from '@/lib/utils/commonUtils';
import { toastMessage } from '@/lib/utils/toast-message';
import axios from '@/lib/web-api/axios';
import { get, set } from 'lodash';
import { ChevronDown, Minus, Plus } from 'lucide-react';
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import Button from '../../ui/button';
import CollaborationConfirmed from '../../components-common/dialogs/accept-offer';
import { ICollaboration } from './view';
import ViewAllBids from '../../components-common/dialogs/all-bids';
import { useTranslations } from 'next-intl';

const bidAmount = {
    fixedPercentage: "FIXED_AMOUNT",
    percentage: "PERCENTAGE"
}
interface IBidProps {
    collaborationData: any,
    setCollaborationData: (data: ICollaboration) => void;
    setOfferAccepted: (value: boolean) => void;
    offerAccepted: boolean;
}
function Bid({ collaborationData, setCollaborationData, offerAccepted, setOfferAccepted }: IBidProps) {
    const params = useParams();
    const translate = useTranslations();
    const { account } = useAuthStore();
    const collaborationId: any = params?.collaborationId;
    const [bid, setBid] = React.useState<any>(bidAmount.fixedPercentage);
    const [yourOffer, setYourOffer] = React.useState<any>(null);
    const [receiveOffer, setReceiveOffer] = React.useState<number>(0);
    const [isEditing, setIsEditing] = useState(false);
    const [isYourOffer, setIsYourOffer] = useState(false);
    const [offerBid, setIsOfferBid] = useState("");
    const [offerError, setOfferError] = useState("");
    const [loading, setLoading] = useState(false);

    const [viewAllBids, setViewAllBids] = useState(false);

    const handleOfferChange = (e: any) => {
        const inputValue = e.target.value;

        // If the first character is "0" and the length is greater than 1, remove the first character
        if (inputValue.charAt(0) === "0" && inputValue.length > 1) {
            setYourOffer(parseFloat(inputValue.slice(1)));
        } else {
            const value = parseFloat(inputValue);
            if (!isNaN(value)) {
                if (bid === bidAmount.percentage) {
                    // For percentage-based commission, calculate the maximum offer
                    const maxOffer = (collaborationData?.productId?.price * value) / 100;
                    if (maxOffer > collaborationData?.productId?.price) {
                        setOfferError("Offer cannot exceed the product price.");
                    } else setOfferError("");
                } else if (bid === bidAmount.fixedPercentage) {
                    // For fixed amount, ensure the offer does not exceed the product price
                    if (value > collaborationData?.productId?.price) {
                        setOfferError("Offer cannot exceed the product price.");
                    } else setOfferError("");
                }
                setYourOffer(value);
            } else {
                setYourOffer(null);
            }
        }
    };

    useEffect(() => {
        socketService.connect();

        if (collaborationId) {
            socketService.joinCollaboration(collaborationId)
            socketService.newBidReceived((data) => newBidReceived(data))
            socketService.errorSendBid((error) => errorWhileSendBid(error))
        }

    }, [collaborationData]);
    useEffect(() => {
        if (collaborationData?.bids?.length > 0) {
            const bidData = collaborationData?.bids;
            let final = bidData[bidData.length - 1];
            // setBid(final?.type);
            if (final?.sender !== account?.role) {
                setReceiveOffer(final?.proposal);
                setIsOfferBid(final?.type)
            } else {
                setIsYourOffer(true);
                setYourOffer(final?.proposal);
                setBid(final?.type);
            };
            const findUserData = bidData?.findLast((item: any) => item?.sender === account?.role);
            if (findUserData) {
                setYourOffer(findUserData?.proposal);
                setBid(findUserData?.type);
            }
        }
    }, [collaborationData?._id])
    const newBidReceived = (data: any): void => {
        if (data?.data?.sender !== account?.role) {
            setReceiveOffer(data?.data?.proposal);
            setIsOfferBid(data?.data?.type)
            setIsYourOffer(false);
        }
        setCollaborationData({ ...collaborationData, bids: [...collaborationData?.bids, data?.data] });
    }

    const errorWhileSendBid = (error: any): void => {
        console.log("errorWhileSendBid", error)
    }

    const sendNewBid = () => {
        const data = {
            collaborationId,
            proposal: yourOffer,
            type: bid,
            sender: account?.role
        }
        setIsYourOffer(true);
        socketService.sendNewBid(data)
    }

    const getDisabled = () => {
        if (account?.role === "vendor") {
            return !collaborationData?.negotiation?.agreedByCreator;
        } else {
            return !collaborationData?.negotiation?.agreedByVendor;
        }
    }

    const handleAcceptOffer = async () => {
        setLoading(true);
        try {
            const response = await axios.get(
                `/product/collaboration/activate/${collaborationId}`
            );
            if (response?.status === 200) {
                setOfferAccepted(true);
                toastMessage.success("Offer accepted successfully");
                setCollaborationData(response?.data?.data?.collaboration);
            }

        } catch (error: any) {
            const errorMessage = getErrorMessage(error);
            toastMessage.error(errorMessage);
            setLoading(false);
        } finally {
            setLoading(false);
        }
    }
    function getLastBid() {
        const bid = collaborationData?.bids[collaborationData?.bids?.length - 1];
        return `${bid?.proposal} ${bid?.type === "FIXED_AMOUNT" ? "₹" : "%"}`;
    }
    return (
        <div className="flex flex-col p-4 gap-3">
            <h3 className="font-semibold mb-2">{translate("Per_product_sell_commission")}</h3>
            <div className="flex gap-2 mb-4">
                <Input type='radio' checked={bid === bidAmount.fixedPercentage} onChange={() => setBid(bidAmount.fixedPercentage)} id="commission-fixed" className="w-5 h-5 cursor-pointer" /><span className={`text-sm font-medium ${bid === bidAmount.fixedPercentage ? "text-black" : "text-gray-400"}`}>{translate("Fixed_Commission")}</span>
                <Input type='radio' checked={bid === bidAmount.percentage} onChange={() => setBid(bidAmount.percentage)} id="commission-percentage" className='w-5 h-5 cursor-pointer' /><span className={`text-sm font-medium ${bid === bidAmount.percentage ? "text-black" : "text-gray-400"}`}> {translate("Percentage")}</span>
            </div>
            <div className="flex justify-center gap-3 mb-3">
                {!isYourOffer && (
                    <div className={`flex flex-col justify-center items-center bg-primary-color text-white gap-3 px-4 py-2 rounded-md transition-all duration-300 ${isYourOffer ? "w-0 opacity-0" : "w-1/2 opacity-100"}`}>
                        <span className="text-sm">{account?.role !== "vendor" ? translate("Brands_Offer") : translate("Creators_Offer")}</span>
                        <span className="text-lg">
                            {receiveOffer} {offerBid === bidAmount.percentage ? "%" : "₹"}
                        </span>
                    </div>
                )}
                <div
                    className={`relative flex flex-col border justify-center items-center ${isYourOffer ? "bg-primary-color text-white" :"bg-white text-black"} gap-3 px-4 py-4 rounded-md transition-all duration-300 ${isYourOffer ? "w-full" : "w-1/2"
                        }`}
                >
                    <span className="text-sm">{translate("Your_Offer")}</span>

                    {isYourOffer ? <span className="text-lg">{yourOffer} {bid === bidAmount.percentage ? "%" : "₹"}</span> :
                        <div className='flex justify-center items-center gap-2'><input
                            type="number"
                            value={yourOffer ?? ""}
                            onChange={handleOfferChange}
                            onBlur={() => setIsEditing(false)}
                            className="w-1/2 text-center text-sm border border-gray-300 rounded-md px-2 py-1"
                            autoFocus
                        />
                            <span
                                className="text-lg cursor-pointer"
                                onClick={() => setIsEditing(true)}
                            >
                                {bid === bidAmount.percentage ? "%" : "₹"}
                            </span></div>}



                    {(!isYourOffer && !isEditing) && <><button
                        onClick={() => handleOfferChange({target:{value: Math.max(0, yourOffer - 1).toString()}})}
                        className="absolute bottom-2 left-2 bg-gray-200 hover:bg-gray-300 p-1 rounded-full"
                    >
                        <Minus className="w-4 h-4" />
                    </button>

                        {/* Plus Button - Bottom Right */}
                        <button
                            onClick={() => handleOfferChange({target:{value: (yourOffer + 1).toString()}})}
                            className="absolute bottom-2 right-2 bg-gray-200 hover:bg-gray-300 p-1 rounded-full"
                        >
                            <Plus className="w-4 h-4" />
                        </button></>}
                </div>
            </div>
            {offerError && <p className="text-red-500 text-sm">{offerError}</p>}

            <div className="flex justify-center gap-2">
                {!isYourOffer && <Button
                    type="button"
                    className={cn("w-fit font-medium px-8", "block border bg-white border-black hover:bg-black text-black hover:text-white")}
                    size="small"
                    loading={loading}
                    onClick={handleAcceptOffer}
                // disabled={getDisabled()}
                >
                    {translate("Accept_Offer")}
                </Button>}
                <Button
                    type="button"
                    className={cn("w-fit font-medium px-10", "block border bg-white border-black hover:bg-black text-black hover:text-white")}
                    size="small"
                    // loading={loading}
                    disabled={(isYourOffer) || (offerError !== "" || !yourOffer)}
                    onClick={sendNewBid}
                >
                    {translate("Make_Offer")}
                </Button>
            </div>
            {collaborationData?.bids?.length > 0 && <div className="flex justify-center text-sm text-gray-400 font-semibold mt-3">{translate("Last Bid")}: {" "}<span className="text-black font-semibold">{getLastBid()}</span></div>}
            {collaborationData?.bids?.length > 0 && <div className='flex justify-center text-primary-color cursor-pointer float-end' onClick={() => setViewAllBids(true)}>{translate("View_History")} <ChevronDown /></div>}
            {viewAllBids && <ViewAllBids bids={collaborationData?.bids} onClose={() => setViewAllBids(false)} />}
        </div>
    )
}

export default Bid;