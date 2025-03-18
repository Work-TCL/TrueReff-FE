import PaymentEarnings from "@/app/_components/pages/payment-earnings";
import React, { Suspense } from "react";

export default function PaymentEarningsPage(){
    return <Suspense fallback={<div>Loading...</div>}>
        <PaymentEarnings/>
    </Suspense>
}