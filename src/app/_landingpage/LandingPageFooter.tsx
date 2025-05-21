"use client";


import React from 'react'
import ShareImage from '../../../public/assets/svg/ShareImage'
import LocationImage from '../../../public/assets/svg/Location'
import PhoneImage from '../../../public/assets/svg/PhoneImage'
import YouTubeImage from '../../../public/assets/svg/Youtube'
import LinkedinImage from '../../../public/assets/svg/LinkedinImage'
import TwitterImage from '../../../public/assets/svg/TwitterImage'
import FaceBookImage from '../../../public/assets/svg/FaceBookImage'

export default function LandingPageFooter() {
    return (
        <footer className="bg-[#333333] dark:bg-gray-900 mobile:pt-[150px] sm:pt-[160px] lg:pt-[325px] mt-[-596px]">
            <div className="mx-auto w-full max-w-[1720px] px-[100px] ">
                <div className="flex justify-between mobile:flex-col sm:flex-col md:flex-row lg:gap-[50px] xl:gap-[130px] 2xl:gap-56">
                    <div data-aos='fade-down-right' className="flex items-center md:w-[200px] lg:w-[351px]">
                        <img src="/assets/landing/logo_TrueReff.svg" className="h-[50px]" alt="TrueReff Logo" />
                    </div>

                    <div data-aos='fade-left' className="flex mobile:flex-col sm:flex-col md:flex-col mobile:pt-10 sm:pt-10 md:pt-0 lg:flex-row lg:gap-[50px] xl:gap-[130px] 2xl:gap-[278px]">
                        <div className='flex flex-col xl:min-w-[448px] mx-w-[448px] w-full'>
                            <h2 className="mb-6 lg:text-xl xl:text-2xl font-light text-gray-500 ">Quick Links</h2>
                            <div className='flex  mobile:gap-8 sm:gap-8 md:flex-row md:gap-8 lg:justify-between'>
                                <ul className="text-white lg:text-lg xl:text-xl font-normal">
                                    <li className="mb-6">
                                        <a href="" className="hover:underline">For Creators</a>
                                    </li>
                                    <li className="mb-6">
                                        <a href="" className="hover:underline">For Brands</a>
                                    </li>
                                    <li className="mb-6">
                                        <a href="" className="hover:underline">About Us</a>
                                    </li>
                                    <li className="mb-6">
                                        <a href="" className="hover:underline">Blogs</a>
                                    </li>
                                    <li className="mb-6">
                                        <a href="" className="hover:underline">Case Studies</a>
                                    </li>
                                </ul>
                                <ul className="text-white lg:text-lg xl:text-xl font-normal">
                                    <li className="mb-6">
                                        <a href="" className="hover:underline ">Careers</a>
                                    </li>
                                    <li className="mb-6">
                                        <a href="" className="hover:underline">Privacy Policy</a>
                                    </li>
                                    <li className="mb-6">
                                        <a href="" className="hover:underline">Cookie Policy</a>
                                    </li>
                                    <li className="mb-6">
                                        <a href="" className="hover:underline">Terms Of Service</a>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        <div className='xl:min-w-[252px] mx-w-[252px]'>
                            <h2 className="mb-6 lg:text-xl xl:text-2xl font-light text-gray-500">Support</h2>
                            <ul className="text-white lg:text-lg xl:text-xl font-normal">
                                <li className="mb-6">
                                    <a href="#" className="hover:underline flex">
                                        <span className="pt-1 pr-3"><LocationImage /></span> Street name, City name State, 000 0000</a>
                                </li>
                                <li className="mb-6">
                                    <a href="#" className="hover:underline  flex"><span className="pt-1 pr-3"><ShareImage /></span> hello@truereff.com</a>
                                </li>
                                <li className="mb-6">
                                    <a href="#" className="hover:underline flex"><span className="pt-1 pr-3"><PhoneImage /></span> 0-000-000-0000</a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="sm:flex sm:items-center sm:justify-between pb-20 pt-24">
                    <span className="text-sm text-gray-500 sm:text-center dark:text-gray-400">Copyright © 2024<a href="" className="hover:underline">Truereff</a>. All Rights Reserved.
                    </span>
                    <div className="flex gap-3 items-baseline mt-4 sm:justify-center sm:mt-0">
                        <div>
                            <YouTubeImage />
                        </div>
                        <div>
                            <LinkedinImage />
                        </div>

                        <div>
                            <TwitterImage />
                        </div>

                        <div>
                            <FaceBookImage />
                        </div>
                    </div>
                </div>
            </div>
        </footer>

    )
}
