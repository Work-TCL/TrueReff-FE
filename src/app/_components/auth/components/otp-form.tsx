
"use client"
import Button from "@/lib/ui/button";
import React, { useState } from 'react';
import OtpInput from 'react-otp-input';

export default function VerifyOTPForm() {
    const [otp, setOtp] = useState('');
    return (
        <div>
            <OtpInput
                value={otp}
                onChange={setOtp}
                numInputs={4}
                renderSeparator={<span> </span>}
                renderInput={(props) => <input {...props} className="min-w-10 min-h-10 max-w-10 max-h-10 mx-2 border border-gray-dark rounded focus:outline-none focus:border-gray-color" />}
            />

            <Button className="mt-5">Verify</Button>
        </div>
    )
}


