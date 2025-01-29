"use client";
import React from 'react';
import { useRouter } from 'next/navigation';

const ResetPassword = () => {
    const router = useRouter();
    return (
        <div className="min-h-screen bg-gray-100 text-gray-900 flex justify-center">
            <div className="bg-white shadow sm:rounded-lg flex justify-center flex-1">
                <div className="flex-1 w-full text-center hidden lg:flex">
                    <div
                        className="w-full bg-contain bg-center bg-no-repeat"
                        style={{ backgroundImage: "url('/assets/auth/forgot-pass-image.svg')" }}
                    >
                    </div>
                </div>
                <div className="lg:w-1/2 xl:w-7/12 sm:p-12">
                    <div className="mt-40 flex flex-col justify-center items-center">
                        <div className="w-full flex-1 ">
                            <div className=" mx-auto max-w-lg flex items-center text-[18px] cursor-pointer" onClick={()=>{router.push("/send-otp")}}>
                            {"<"} Back!
                            </div>
                            <div className="mx-auto max-w-lg flex text-[32px] font-bold">
                            Reset Password
                            </div>
                            <div className="mt-6 mx-auto max-w-lg text-[16px] flex align-middle justify-between  text-gray-600">
                            Enter new password to secure your account.
                            </div>
                            <div className="mx-auto max-w-lg mt-5">
                                <input
                                    className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
                                    type="password"
                                    placeholder="Password"
                                />
                                <input
                                    className="w-full mt-5 px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
                                    type="confirm-password"
                                    placeholder="ConfirmPassword"
                                />
                                <button
                                    className="mt-5 tracking-wide font-semibold bg-[#090919] text-[#FFFFFF] w-full py-4 rounded-lg transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none"
                                    onClick={() => router.push("/reset-password")}
                                >
                                    Verify
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;