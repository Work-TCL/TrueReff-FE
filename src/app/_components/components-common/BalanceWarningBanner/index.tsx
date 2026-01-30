"use client";
import React, { useEffect, useState } from "react";
import { X, AlertTriangle } from "lucide-react";
import { useRouter } from "next/navigation";
import { getWalletBalance } from "@/lib/web-api/vendor-dashboard";
import DialogLayout from "../../ui/layout/dialog";

const BalanceWarningBanner: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter();

  useEffect(() => {
    const hasClosed = sessionStorage.getItem(
      "truereff-balance-banner-dismissed"
    );

    if (!hasClosed) {
      (async () => {
        const response = await getWalletBalance();
        const balance = response?.balance || 0;
        console.log("Wallet balance:", balance);

        if (balance < 50) {
          setMessage(
            "Your Truereff services have been stopped due to low balance."
          );
          setVisible(true);
        } else if (balance < 200) {
          setMessage(
            "Your Truereff services are about to stop. Please recharge soon."
          );
          setVisible(true);
        }
      })();
    }
  }, []);

  const handleClose = () => {
    sessionStorage.setItem("truereff-balance-banner-dismissed", "true");
    setVisible(false);
  };

  return (
    <DialogLayout
      open={Boolean(visible)}
      size="!max-w-[482px] w-full overflow-auto m-4"
      onClose={() => handleClose()}
      clickOutsideToClose={false}
    >
      <div className="pt-0 px-2 pb-2 sm:px-4 sm:pb-4 sm:bg-white sm:rounded-md sm:shadow-sm w-full overflow-y-auto relative">
        <div className="flex flex-col justify-center items-center gap-2">
          <div className="flex justify-center gap-1">
            <AlertTriangle className="text-yellow-500 sm:w-12 w-7 mt-0.5 flex-shrink-0" />
            <h2 className="text-lg font-bold text-gray-800">
              Low Balance Alert
            </h2>
            <AlertTriangle className="text-yellow-500 sm:w-12 w-7 mt-0.5 flex-shrink-0" />
          </div>
          <p className="text-yellow-800 text-center">Action Required</p>
        </div>
        <div className="max-w-md bg-white p-6 text-gray-800">
          <p className="text-base font-medium mb-4">
            Your Truereff account balance is low.
          </p>

          <ul className="list-disc list-inside space-y-2 mb-6 text-gray-700">
            <li>Collaborations with creators will be paused</li>
            <li>Your product visibility will be limited</li>
          </ul>

          <p className="text-md text-gray-700 mb-6">
            To keep your product live, visible, and actively promoted by creators,
            <span className="font-semibold text-gray-900">{" "}recharge your account now.
            </span>
          </p>

          <p className="text-md font-medium text-gray-700">
            Don’t lose sales. Don’t lose reach.
            <span className="font-semibold"> Recharge immediately.</span>
          </p>
        </div>

        <div className="flex justify-end">
          <button
            onClick={() => {
              router.push("/vendor/payment-earnings")
              handleClose();
            }}
            className="text-sm bg-yellow-400 hover:bg-yellow-500 text-yellow-900 font-medium px-3 py-1.5 rounded-md transition"
          >
            Recharge Now
          </button>
        </div>
      </div>
    </DialogLayout>
  );
};

export default BalanceWarningBanner;
