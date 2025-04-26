"use client";
import React, { useState, useEffect } from "react";
import Button from "@/app/_components/ui/button";

export default function BargainingDetailView() {
  // Bargaining state
  const [vendorProposal, setVendorProposal] = useState<number | "">("");
  const [creatorProposal, setCreatorProposal] = useState<number | "">("");
  const [finalAgreedAmount, setFinalAgreedAmount] = useState<number | "">("");

  // Discount section state
  const [discountType, setDiscountType] = useState<string>("PERCENTAGE");
  const [discountValue, setDiscountValue] = useState<number | "">("");
  const [couponCode, setCouponCode] = useState<string>("");
  const [startAt, setStartAt] = useState<string>("");
  const [expiresAt, setExpiresAt] = useState<string>("");

  // Update finalAgreedAmount automatically on latest vendor or creator input
  useEffect(() => {
    if (vendorProposal !== "") {
      setFinalAgreedAmount(vendorProposal);
    } else if (creatorProposal !== "") {
      setFinalAgreedAmount(creatorProposal);
    }
  }, [vendorProposal, creatorProposal]);

  // Lock Proposal button click
  const handleLockProposal = () => {
    // Here you can trigger API call to save the proposal
    console.log({
      vendorProposal,
      creatorProposal,
      finalAgreedAmount,
      discountType,
      discountValue,
      couponCode,
      startAt,
      expiresAt,
    });
    alert("Proposal Locked Successfully!");
  };

  return (
    <div className="flex flex-col gap-8 p-4 overflow-auto h-full">
      {/* Bargaining Section */}
      <div className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold">Bargaining Section</h2>
        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-1">
            <label className="text-sm text-font-grey">Your Suggestion (Vendor Proposal)</label>
            <input
              type="number"
              className="p-2 border text-sm rounded-md w-full"
              value={vendorProposal}
              onChange={(e) => setVendorProposal(Number(e.target.value))}
              placeholder="Enter Vendor Proposal"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm text-font-grey">Creator Suggestion</label>
            <input
              type="number"
              className="p-2 border text-sm rounded-md w-full"
              value={creatorProposal}
              onChange={(e) => setCreatorProposal(Number(e.target.value))}
              placeholder="Enter Creator Proposal"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm text-font-grey">Final Agreed Amount</label>
            <input
              type="number"
              className="p-2 border text-sm rounded-md w-full bg-gray-100"
              value={finalAgreedAmount}
              disabled
            />
          </div>
        </div>
      </div>

      {/* Discount & Offer Section */}
      <div className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold">Discount & Offer Details</h2>
        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-1">
            <label className="text-sm text-font-grey">Discount Type</label>
            <select
              className="p-2 border text-sm rounded-md w-full"
              value={discountType}
              onChange={(e) => setDiscountType(e.target.value)}
            >
              <option value="PERCENTAGE">Percentage</option>
              <option value="FIXED_AMOUNT">Fixed Amount</option>
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm text-font-grey">Discount Value</label>
            <input
              type="number"
              className="p-2 border text-sm rounded-md w-full"
              value={discountValue}
              onChange={(e) => setDiscountValue(Number(e.target.value))}
              placeholder="Enter Discount Value"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm text-font-grey">Coupon Code</label>
            <input
              type="text"
              className="p-2 border text-sm rounded-md w-full"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
              placeholder="Enter Coupon Code"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm text-font-grey">Start At</label>
            <input
              type="datetime-local"
              className="p-2 border text-sm rounded-md w-full"
              value={startAt}
              onChange={(e) => setStartAt(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm text-font-grey">Expires At</label>
            <input
              type="datetime-local"
              className="p-2 border text-sm rounded-md w-full"
              value={expiresAt}
              onChange={(e) => setExpiresAt(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Lock Proposal Button */}
      <div className="flex justify-center mt-6">
        <Button className="bg-black text-white px-6 py-2 rounded-md" onClick={handleLockProposal}>
          Lock Proposal
        </Button>
      </div>
    </div>
  );
}
