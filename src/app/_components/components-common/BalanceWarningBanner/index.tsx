"use client";
import React, { useEffect, useState } from "react";
import { X, AlertTriangle } from "lucide-react";
import { useRouter } from "next/navigation";
import { getWalletBalance } from "@/lib/web-api/vendor-dashboard";

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

  if (!visible) return null;

  return (
    <div className="fixed top-4 right-4 z-50 w-[90%] max-w-sm sm:w-[400px] bg-yellow-50 border border-yellow-300 text-yellow-900 px-4 py-4 rounded-xl shadow-xl backdrop-blur-md transition-all duration-500">
      <div className="flex justify-between items-start gap-3">
        <div className="flex gap-2 text-sm sm:text-base leading-snug">
          <AlertTriangle className="text-yellow-500 sm:w-12 w-7 mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <p className="font-semibold">Account balance warning</p>
            <p className="text-yellow-800">{message}</p>
          </div>
        </div>

        <button
          onClick={handleClose}
          className="hover:bg-yellow-200 p-1 rounded-full transition flex-shrink-0"
          aria-label="Close"
        >
          <X className="w-4 h-4 text-yellow-700" />
        </button>
      </div>

      <div className="mt-3 flex justify-end">
        <button
          onClick={() => router.push("/vendor/payment-earnings")}
          className="text-sm bg-yellow-400 hover:bg-yellow-500 text-yellow-900 font-medium px-3 py-1.5 rounded-md transition"
        >
          Recharge Now
        </button>
      </div>
    </div>
  );
};

export default BalanceWarningBanner;
