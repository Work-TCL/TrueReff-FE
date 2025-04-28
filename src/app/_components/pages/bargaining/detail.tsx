"use client";
import React, { useState, useEffect } from "react";
import Button from "@/app/_components/ui/button";
import { useAuthStore } from "@/lib/store/auth-user";
import dynamic from "next/dynamic";
import { translate } from "@/lib/utils/translate";
import { FaEdit, FaRegCalendarAlt } from "react-icons/fa";
import DatePicker from "react-datepicker";
import { Icon, Info } from "lucide-react";
import ConfirmDialog from "../settings/components/confirmDialog";
import "react-datepicker/dist/react-datepicker.css";
import { getErrorMessage } from "@/lib/utils/commonUtils";
import { toastMessage } from "@/lib/utils/toast-message";
import axios from "@/lib/web-api/axios";
import { useParams } from "next/navigation";
import { vendored } from "next/dist/server/route-modules/app-page/module.compiled";

export default function BargainingDetailView() {
  const params = useParams();
  const collaborationId: any = params?.collaborationId;
  const { account: user } = useAuthStore();

  const [vendorProposal, setVendorProposal] = useState<number | "">("");
  const [creatorProposal, setCreatorProposal] = useState<number | "">("");
  const [commissionValue, setCommissionValue] = useState<number | "">("");
  // Discount section state
  const [discountType, setDiscountType] = useState<string>("PERCENTAGE");
  const [commissionType, setCommissionType] = useState<string>("PERCENTAGE");
  const [discountValue, setDiscountValue] = useState<number | "">("");
  const [couponCode, setCouponCode] = useState<string>("");
  const [startAt, setStartAt] = useState<string>("");
  const [expiresAt, setExpiresAt] = useState<string>("");
  const [startAtError, setStartAtError] = useState<string | null>(null);
  const [expiresAtError, setExpiresAtError] = useState<string | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isproposalLoader, setIsProposalLoader] = useState(false);
  const [proposalAgreedBy, setProposalAgreedBy] = useState<{
    vendor: boolean;
    creator: boolean;
  }>({
    vendor: false,
    creator: false,
  });
  const [isEditMode, setIsEditMode] = useState(false);
  const [utmGenerated, setUtmgGenerated] = useState(false);
  const [isUtmGenereated, setIsUtmGenerated] = useState(false);

  const handleLockProposal = async () => {
    setIsProposalLoader(true);
    try {
      let payload: any = {
        ...(user.role === "vendor"
          ? { vendorProposal: vendorProposal }
          : { creatorProposal: creatorProposal }),
        commissionType: commissionType,
        discountType: discountType,
        couponCode: couponCode,
        commissionValue: commissionValue,
        discountValue: discountValue,
        startAt: startAt,
        expiresAt: expiresAt,
        ...(user.role === "vendor"
          ? { agreedByVendor: true }
          : { agreedByCreator: true }),
      };
      const response = await axios.put(
        `product/collaboration/${collaborationId}`,
        payload
      );

      if (response?.status === 200) {
        setIsProposalLoader(false);
        setShowConfirm(false);
        setIsEditMode(false);
      } else {
        setIsProposalLoader(false);
      }
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      toastMessage.error(errorMessage);
      setIsProposalLoader(false);
      setShowConfirm(false);
      setIsEditMode(false);
    }
  };
  const fetchProductCollaboration = async () => {
    try {
      const response = await axios.get(
        `/product/collaboration/${collaborationId}`
      );
      if (response?.status === 200) {
        const collaboration: any = response?.data?.data?.collaboration;
        setVendorProposal(collaboration?.negotiation?.vendorProposal ?? 0);
        setCreatorProposal(collaboration?.negotiation?.creatorProposal ?? 0);
        setCommissionValue(collaboration?.commissionValue ?? 0);
        setDiscountType(collaboration?.discountType ?? 0);
        setCommissionType(collaboration?.commissionType ?? 0);
        setDiscountValue(collaboration?.commissionValue ?? 0);
        setCouponCode(collaboration?.couponCode ?? 0);
        setStartAt(collaboration?.startAt ?? 0);
        setExpiresAt(collaboration?.expiresAt ?? 0);
        setProposalAgreedBy({
          vendor: collaboration?.negotiation?.agreedByVendor,
          creator: collaboration?.negotiation?.agreedByCreator,
        });
      }
    } catch (error: any) {
      const errorMessage = getErrorMessage(error);
      toastMessage.error(errorMessage);
    }
  };
  const generateUTM = async () => {
    setIsUtmGenerated(true);
    try {
      const response = await axios.put(
        `product/generate-crm/${collaborationId}`
      );
      if (response?.status === 200) {
        setUtmgGenerated(true);
        setIsUtmGenerated(false);
      } else {
        setUtmgGenerated(false);
        setIsUtmGenerated(false);
      }
    } catch (error: any) {
      const errorMessage = getErrorMessage(error);
      toastMessage.error(errorMessage);
      setIsUtmGenerated(false);
      setUtmgGenerated(false);
    }
  };
  useEffect(() => {
    fetchProductCollaboration();
  }, []);

  const shoNote =
    (user.role === "vendor" &&
      proposalAgreedBy.vendor === true &&
      proposalAgreedBy.creator === false) ||
    (user.role === "creator" &&
      proposalAgreedBy.creator === true &&
      proposalAgreedBy.vendor === false);

  const handleEditClick = () => {
    setIsEditMode(true); // Enable edit mode when pencil icon is clicked
  };

  const ProposalAggreeed =
    proposalAgreedBy.creator === true && proposalAgreedBy.vendor === true;

  return (
    <>
      <div className="flex flex-col gap-8 overflow-auto h-full pr-3">
        {!ProposalAggreeed && shoNote && (
          <div className="flex items-center gap-x-3 rounded-lg bg-[#F9F8F8] p-2 text-[12px] font-normal text-[#6C7880]">
            <Info className="size-5 shrink-0 text-[#6C7880]" />
            <p>
              {user.role === "vendor"
                ? "Creator made changes reviewed it and Changed It."
                : "Vendor made changes reviewed it and Changed It."}
            </p>
          </div>
        )}
        {/* Bargaining Section */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between w-full">
            <h2 className="text-lg font-semibold">Bargaining Section</h2>
            {!ProposalAggreeed && !isEditMode && (
              <FaEdit
                className="size-5 shrink-0 text-primary cursor-pointer"
                onClick={handleEditClick}
              />
            )}
            {ProposalAggreeed && utmGenerated ? (
              <Button
                loading={isUtmGenereated}
                disabled={utmGenerated || isUtmGenereated}
                className="bg-black text-white px-6 py-2 rounded-md w-[40%] text-sm"
                onClick={() => {
                  generateUTM();
                }}
              >
                {utmGenerated ? "UTM Generated " : "Generate UTM"}
              </Button>
            ) : (
              <div
                className={`bg-[#098228] text-[#098228] text-sm bg-opacity-10 font-medium me-2 px-2.5 py-2 rounded-sm text-center cursor-not-allowed
              `}
              >
                UTM Generated
              </div>
            )}
          </div>
          <div className="flex sm:flex-row flex-col w-full items-center gap-2">
            <div className="flex flex-col gap-1 w-full">
              <label className="text-sm text-font-grey">
                Final Agreed Amount
              </label>
              <input
                type="number"
                className="p-2 border text-sm rounded-md w-full bg-gray-100"
                value={commissionValue}
                disabled
              />
            </div>

            <div className="flex flex-col gap-1 w-full">
              <label className="text-sm text-font-grey">Discount Type</label>
              <select
                className="p-2 border text-sm rounded-md w-full bg-gray-100"
                value={commissionType}
                onChange={(e) => setCommissionType(e.target.value)}
                disabled={!isEditMode}
              >
                <option value="PERCENTAGE">Percentage</option>
                <option value="FIXED_AMOUNT">Fixed Amount</option>
              </select>
            </div>
          </div>

          <div className="flex sm:flex-row flex-col w-full items-center gap-2">
            <div className="flex w-full flex-col gap-1">
              <label className="text-sm text-font-grey">Your Suggestion</label>
              <input
                type="number"
                className="p-2 border text-sm rounded-md w-full"
                value={
                  user.role === "vendor" ? vendorProposal : creatorProposal
                }
                disabled={!isEditMode}
                onChange={(e) => {
                  user.role === "vendor"
                    ? setVendorProposal(Number(e.target.value))
                    : setCreatorProposal(Number(e.target.value));
                  setCommissionValue(Number(e.target.value));
                }}
                placeholder="Enter Proposal Amount"
              />
            </div>

            <div className="flex w-full flex-col gap-1">
              <label className="text-sm text-font-grey">
                {user.role === "vendor"
                  ? "Creator Suggestion"
                  : "Vendor Suggestion"}
              </label>
              <input
                disabled={true}
                type="number"
                className="p-2 border text-sm rounded-md w-full"
                value={
                  user.role === "vendor" ? creatorProposal : vendorProposal
                }
                placeholder="0"
              />
            </div>
          </div>
        </div>

        {/* Discount & Offer Section */}
        <div className="flex flex-col gap-4">
          <h2 className="text-lg font-semibold">Discount & Offer Details</h2>

          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-sm text-font-grey">Coupon Code</label>
              <input
                disabled={!isEditMode || user.role === "creator"}
                type="text"
                className="p-2 border text-sm rounded-md w-full"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                placeholder="Enter Coupon Code"
              />
            </div>
            <div className="flex sm:flex-row flex-col w-full items-center gap-2">
              <div className="flex w-full flex-col gap-1">
                <label className="text-sm text-font-grey">Discount Value</label>
                <input
                  disabled={!isEditMode || user.role === "creator"}
                  type="number"
                  className="p-2 border text-sm rounded-md w-full"
                  value={discountValue}
                  onChange={(e) => setDiscountValue(Number(e.target.value))}
                  placeholder="Enter Discount Value"
                />
              </div>

              <div className="flex w-full flex-col gap-1">
                <label className="text-sm text-font-grey">Discount Type</label>
                <select
                  disabled={!isEditMode || user.role === "creator"}
                  className="p-2 border text-sm rounded-md w-full bg-gray-100"
                  value={discountType}
                  onChange={(e) => setDiscountType(e.target.value)}
                >
                  <option value="PERCENTAGE">Percentage</option>
                  <option value="FIXED_AMOUNT">Fixed Amount</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <h2 className="text-lg font-semibold">Duration</h2>

          <div className="flex sm:flex-row flex-col w-full items-center gap-4">
            {/* Start Date */}
            <div className="flex flex-col w-full">
              <label className="text-sm text-font-grey mb-1">Start Date</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 z-[1]">
                  <FaRegCalendarAlt />
                </span>
                <DatePicker
                  name="startDate"
                  key={startAt}
                  disabled={!isEditMode}
                  selected={startAt ? new Date(startAt) : null}
                  onChange={(date) => {
                    if (!date) {
                      setStartAt("");
                      setStartAtError("Start date is required");
                      return;
                    }
                    setStartAt(date.toISOString());
                    setStartAtError(null);

                    // Also revalidate expiresAt
                    if (expiresAt && new Date(expiresAt) <= date) {
                      setExpiresAtError("Expiry must be after start date");
                    } else {
                      setExpiresAtError(null);
                    }
                  }}
                  wrapperClassName="w-full"
                  dateFormat="dd/MM/yyyy"
                  placeholderText="Select start date"
                  className="w-full px-4 py-4 rounded-xl font-medium border border-gray-light placeholder:text-gray-color placeholder:font-normal text-sm focus:outline-none focus:border-gray-light focus:bg-white disabled:cursor-not-allowed !pl-10"
                  minDate={new Date()}
                />
              </div>
              {startAtError && (
                <p className="text-red-500 text-xs mt-1">{startAtError}</p>
              )}
            </div>

            {/* Expires At */}
            <div className="flex flex-col w-full">
              <label className="text-sm text-font-grey mb-1">Expires At</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 z-[1]">
                  <FaRegCalendarAlt />
                </span>
                <DatePicker
                  name="endDate"
                  disabled={!isEditMode}
                  selected={expiresAt ? new Date(expiresAt) : null}
                  onChange={(date) => {
                    if (!date) {
                      setExpiresAt("");
                      setExpiresAtError("Expiry date is required");
                      return;
                    }

                    if (startAt && new Date(date) <= new Date(startAt)) {
                      setExpiresAtError("Expiry must be after start date");
                    } else {
                      setExpiresAtError(null);
                    }

                    setExpiresAt(date.toISOString());
                  }}
                  wrapperClassName="w-full"
                  dateFormat="dd/MM/yyyy"
                  className="w-full px-4 py-4 rounded-xl font-medium border border-gray-light placeholder:text-gray-color placeholder:font-normal text-sm focus:outline-none focus:border-gray-light focus:bg-white disabled:cursor-not-allowed !pl-10"
                  placeholderText="Select expiry date"
                  minDate={startAt ? new Date(startAt) : new Date()}
                />
              </div>
              {expiresAtError && (
                <p className="text-red-500 text-xs mt-1">{expiresAtError}</p>
              )}
            </div>
          </div>
        </div>

        {/* Lock Proposal Button */}
        {isEditMode && (
          <div className="flex justify-between mt-6 gap-3">
            <Button
              disabled={isproposalLoader}
              className="bg-black text-white px-6 py-2 rounded-md"
              onClick={() => {
                setIsEditMode(false);
              }}
            >
              Cancle{" "}
            </Button>
            <Button
              disabled={isproposalLoader}
              className="bg-black text-white px-6 py-2 rounded-md"
              onClick={() => {
                setShowConfirm(true);
              }}
            >
              Agree{" "}
            </Button>
          </div>
        )}
      </div>
      {showConfirm && (
        <ConfirmDialog
          loading={isproposalLoader}
          open={showConfirm}
          description="You have successfully agreed to the proposal. Once the vendor accepts the offer you will get the uTM link"
          onClose={() => {
            setShowConfirm(false);
          }}
          onConfirm={handleLockProposal}
        />
      )}
    </>
  );
}
