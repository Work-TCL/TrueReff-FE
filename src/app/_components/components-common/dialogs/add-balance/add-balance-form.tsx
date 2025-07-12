"use client";
import React, { useState } from "react";
import { getErrorMessage } from "@/lib/utils/commonUtils";
import toast from "react-hot-toast";
import Button from "@/app/_components/ui/button";
import { Input } from "@/components/ui/input";
import { useVendorStore } from "@/lib/store/vendor";
import axios from "@/lib/web-api/axios";
import { Info } from "lucide-react";
import { useTranslations } from "next-intl";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@radix-ui/react-tooltip";
interface IAddBalanceFormProps {
  onClose: () => void;
  submitting: boolean;
  setSubmitting: (value: boolean) => void;
  handleRefresh?: () => void; 
}
declare global {
  interface Window {
    Razorpay: any;
    Cashfree: any;
  }
}
interface IDeposit {
  razorpayOrderId: string;
  amount: number;
}
export default function AddBalanceForm({
  onClose,
  handleRefresh = () => {}
}: IAddBalanceFormProps) {
  const translate = useTranslations();
  const { vendor } = useVendorStore();
  const [amount, setAmount] = useState<any>(500);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const minAmount = 1;
  const maxAmount = 500000;

  // const handlePayment = async ({amount,razorpayOrderId}:IDeposit) => {  
  //   const key = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
  //   try {  
  //     // Step 1: Configure Razorpay options
  //     const options = {
  //       key: key, // Replace with your Razorpay Key ID
  //       amount: amount, // Amount in paise
  //       currency: 'INR',
  //       name: 'truereff',
  //       description: 'Wallet Recharge',
  //       order_id: razorpayOrderId, // Use the order ID from the backend
  //       prefill: {
  //         name: vendor?.business_name, // Replace with dynamic user data
  //         email: vendor?.company_email, // Replace with dynamic user data
  //       },
  //       theme: {
  //         color: '#3399cc',
  //       },
  //       handler: async function (response: any) {
  //         // Step 2: Handle payment success
  //         console.log('Payment successful', response);
  //         handleRefresh()
  //       },
  //       modal: {
  //         ondismiss: function () {
  //           console.log('Payment popup closed');
  //         },
  //       },
  //     };
  
  //     // Step 4: Open Razorpay payment popup
  //     const rzp = new window.Razorpay(options);
  //     rzp.open();
  //   } catch (error) {
  //     console.error('Error creating Razorpay order:', error);
  //     // alert('Failed to initiate payment. Please try again.');
  //   }
  // };
  const handleCheckout = (payment_session_id:string) => {
    console.log("payment_session_id",payment_session_id)
    const cashfree = window.Cashfree({
      mode: 'production', // or 'production'
    });

    const checkoutOptions = {
      paymentSessionId:payment_session_id,
      redirectTarget: '_blank',
      appearance: {
        width: '425px',
        height: '700px',
      },
    };

    cashfree.checkout(checkoutOptions).then((result:any) => {
      if (result.error) {
        console.error('Payment error:', result.error);
      }
      if (result.redirect) {
        console.log('Redirection triggered.');
      }
      if (result.paymentDetails) {
        console.log('Payment completed:', result.paymentDetails.paymentMessage);
      }
    });
  };
  const handleAddBalance = async () => {
    setSubmitting(true);
    try {
      const response: any = await axios.post(
        `/payment/wallet/deposite`,
        {
          amount
        }
      );
      if (response.status === 200) {
        onClose();
        setSubmitting(false);
        handleCheckout(response?.data?.data?.payment_session_id)
      } else {
        setSubmitting(false);
      }
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      toast.error(errorMessage);
      setSubmitting(false);
    }
  };
  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
  
    if (isNaN(value)) {
      setAmount(value); // Default to minimum if input is invalid
      setError(translate("Amount_is_required"));
      return;
    }  
    handleSetValue(value);
  };
  const handleSetValue = (value:number) => {
    if (value < minAmount) {
      setAmount(value); // Set to minimum amount
      setError(`${translate("Minimum_balance_amount")} ${minAmount}`);
    } else if (value > maxAmount) {
      setAmount(value); // Set to maximum amount
      setError(`${translate("Maximum_balance_amount")} ${maxAmount}`);
    } else {
      setAmount(value); // Set the valid amount
      setError(""); // Clear any error
    }
  }
  const handleAddAmount = (value:number) => {
    handleSetValue(amount + value);
  }
  return (
    <div className="flex flex-col items-center gap-4">
      <div className="grid grid-cols-2 text-left gap-1 w-full relative">        
        <div className="col-span-2 mt-2"> 
          <div className="flex flex-col">
            <span className="flex items-center mb-1 text-md text-gray-500 font-[400]">
            <span className="text-red-500">*</span>
              {translate("Amount")}
              <TooltipProvider key={`main_balance`}>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="w-4 h-4 ml-1 text-gray-500" />
                  </TooltipTrigger>
                  <TooltipContent
                    className="z-[99] px-3 py-2 w-auto max-w-[80vw] rounded-md border border-gray-color bg-white text-[14px] md:max-w-[300px] overflow-hidden"
                    side="top"
                  >
                    {`Please enter an amount between ₹${minAmount.toLocaleString()} and ₹${maxAmount.toLocaleString()} to add balance.`}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              
              
            </span>
            <Input
              name="amount"
              value={amount}
              onChange={handleOnChange}
              type="number"
              className="w-full px-4 py-4 rounded-xl bg-white font-medium border border-gray-light placeholder:text-gray-color placeholder:font-normal text-sm focus:outline-none focus:border-gray-light focus:bg-white disabled:cursor-not-allowed"
              placeholder={translate("Enter_amount")}
              autoFocus
              min={minAmount}
              max={maxAmount}
            />
          </div>
        </div>
        <div className="col-span-2 flex justify-between">
          {error && (
            <span className="text-red-600 text-sm block">
              {error}
            </span>
          )}
        </div>
        <div className="col-span-2">
        <div className="flex flex-wrap gap-2">
          {[5000,10000,20000,50000,100000].map((ele:number,index:number) => (
            <div key={index} onClick={() => handleAddAmount(ele)} className="flex items-center text-sm md:text-md bg-white border font-semibold py-1 px-2 rounded-lg">
              +{ele}
            </div>
          ))}
      </div>
      </div>
      </div>
      <div className="flex justify-center w-full md:w-1/2 mt-6 gap-2">
      <Button
          type="button"
          className=" bg-white border text-secondary"
          // loading={submitting}
          disabled={submitting}
          onClick={onClose}
        >
          {translate("Cancel")}
        </Button>
        <Button
          type="button"
          className=""
          loading={submitting}
          disabled={!!error || submitting}
          onClick={handleAddBalance}
        >
          {translate("Add_Balance")}
        </Button>
      </div>
    </div>
  );
}
