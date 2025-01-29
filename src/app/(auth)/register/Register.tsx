"use client";
import React from 'react';
import { useRouter } from 'next/navigation';

const Register = () => {
    const router = useRouter();
    return (
        <div className="min-h-screen bg-gray-100 text-gray-900 flex justify-center">
            <div className="bg-white shadow sm:rounded-lg flex justify-center flex-1">
                <div className="flex-1 w-full text-center hidden lg:flex">
                    <div
                        className="w-full bg-contain bg-center bg-no-repeat"
                        style={{ backgroundImage: "url('/assets/auth/sign-up-image.svg')" }}
                    >
                    </div>
                </div>
                <div className="lg:w-1/2 xl:w-7/12 sm:p-12">
                    <div className="flex justify-center">
                        <img
                            src="/assets/TrueReff-logo.svg"
                            alt="Sign in"
                            className="w-mx-auto"
                        />
                    </div>
                    <div className="mt-6 flex flex-col items-center">
                        <div className="w-full flex-1 ">
                            <div className="flex justify-center text-[32px] font-bold">
                                Sign up to get started
                            </div>
                            <div className="mx-auto max-w-lg mt-5">
                                <input
                                    className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
                                    type="email"
                                    placeholder="Email"
                                />
                                <input
                                    className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white mt-5"
                                    type="password"
                                    placeholder="Password"
                                />

                                <div className="mt-6 text-xs flex align-middle  text-gray-600">
                                    <input type="checkbox" className="w-[20px] h-[20px]" />
                                    <span className="text-[16px]">By Signing up, you agree to our <span className="text-[#FF4979]">Privacy Policy</span> & <span className="text-[#FF4979]">Terms of Use.</span></span>
                                </div>
                                <button
                                    className="mt-5 tracking-wide font-semibold bg-[#090919] text-[#FFFFFF] w-full py-4 rounded-lg transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none"
                                >
                                    Sign up
                                </button>
                            </div>
                            <div className="my-6 border-b text-center">
                                <div
                                    className="leading-none px-2 inline-block text-sm text-gray-600 tracking-wide font-medium bg-white transform translate-y-1/2">
                                    Or Continue with
                                </div>
                            </div>
                            <div className="flex justify-center gap-[20px]">
                                <button
                                    className="w-full max-w-xs font-bold shadow-sm rounded-lg py-3 bg-white-100 text-gray-800 flex items-center justify-center transition-all duration-300 ease-in-out focus:outline-none hover:shadow focus:shadow-sm focus:shadow-outline"
                                >
                                    <div className="bg-white p-2 rounded-full">
                                        <svg className="w-4" viewBox="0 0 533.5 544.3">
                                            <path
                                                d="M533.5 278.4c0-18.5-1.5-37.1-4.7-55.3H272.1v104.8h147c-6.1 33.8-25.7 63.7-54.4 82.7v68h87.7c51.5-47.4 81.1-117.4 81.1-200.2z"
                                                fill="#4285f4"
                                            />
                                            <path
                                                d="M272.1 544.3c73.4 0 135.3-24.1 180.4-65.7l-87.7-68c-24.4 16.6-55.9 26-92.6 26-71 0-131.2-47.9-152.8-112.3H28.9v70.1c46.2 91.9 140.3 149.9 243.2 149.9z"
                                                fill="#34a853"
                                            />
                                            <path
                                                d="M119.3 324.3c-11.4-33.8-11.4-70.4 0-104.2V150H28.9c-38.6 76.9-38.6 167.5 0 244.4l90.4-70.1z"
                                                fill="#fbbc04"
                                            />
                                            <path
                                                d="M272.1 107.7c38.8-.6 76.3 14 104.4 40.8l77.7-77.7C405 24.6 339.7-.8 272.1 0 169.2 0 75.1 58 28.9 150l90.4 70.1c21.5-64.5 81.8-112.4 152.8-112.4z"
                                                fill="#ea4335"
                                            />
                                        </svg>
                                    </div>
                                    <span className="ml-4">
                                        Continue with Google
                                    </span>
                                </button>
                                <button
                                    className="w-full max-w-xs font-bold shadow-sm rounded-lg py-3 bg-white-100 text-gray-800 flex items-center justify-center transition-all duration-300 ease-in-out focus:outline-none hover:shadow focus:shadow-sm focus:shadow-outline"
                                >
                                    <div className="bg-white p-2 rounded-full">
                                        <svg className="w-4" viewBox="0 0 533.5 544.3">
                                            <path
                                                d="M533.5 278.4c0-18.5-1.5-37.1-4.7-55.3H272.1v104.8h147c-6.1 33.8-25.7 63.7-54.4 82.7v68h87.7c51.5-47.4 81.1-117.4 81.1-200.2z"
                                                fill="#4285f4"
                                            />
                                            <path
                                                d="M272.1 544.3c73.4 0 135.3-24.1 180.4-65.7l-87.7-68c-24.4 16.6-55.9 26-92.6 26-71 0-131.2-47.9-152.8-112.3H28.9v70.1c46.2 91.9 140.3 149.9 243.2 149.9z"
                                                fill="#34a853"
                                            />
                                            <path
                                                d="M119.3 324.3c-11.4-33.8-11.4-70.4 0-104.2V150H28.9c-38.6 76.9-38.6 167.5 0 244.4l90.4-70.1z"
                                                fill="#fbbc04"
                                            />
                                            <path
                                                d="M272.1 107.7c38.8-.6 76.3 14 104.4 40.8l77.7-77.7C405 24.6 339.7-.8 272.1 0 169.2 0 75.1 58 28.9 150l90.4 70.1c21.5-64.5 81.8-112.4 152.8-112.4z"
                                                fill="#ea4335"
                                            />
                                        </svg>
                                    </div>
                                    <span className="ml-4">
                                        Continue with Apple
                                    </span>
                                </button>
                            </div>
                            <div className="my-6 text-center">
                                <div
                                    className="leading-none px-2 inline-block text-sm text-gray-600 tracking-wide font-medium bg-white transform translate-y-1/2">
                                    Already have an account? <span className="text-[#FF4979]" onClick={() => router.push("/login")}>Log in</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;