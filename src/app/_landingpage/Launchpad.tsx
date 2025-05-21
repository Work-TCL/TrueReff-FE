"use client";


import { MoveRight } from 'lucide-react'
import React from 'react'
import ButtonLogin from '../_components/components-common/Button-Login';
import { useRouter } from 'next/navigation';

export default function Launchpad() {
    const router = useRouter();
    return (
        <>
            <div className="bg-[url('/assets/landing/launchpad.png')] bg-cover bg-center bg-no-repeat mobile:pt-[60px] mobile:pb-[100px] sm:pt-[80px] sm:pb-[120px] md:pt-[100px] md:pb-[200px] lg:pt-[150px] lg:pb-[300px] w-full">

                <div className='max-w-[1200px] mx-auto flex mobile:flex-col sm:flex-col lg:flex-row mobile:px-10 lg:px-8 xl:px-0 mobile:gap-[20px] sm:gap-[30px] md:gap-[60px] lg:gap-[50px] xl:gap-[100px] items-center'>
                    <div data-aos='fade-down' className=' sm:text-3xl md:text-5xl xl:text-6xl font-medium text-gray-900  lg:leading-[60px] xl:leading-[80px]'>Your launchpad to<span className="text-primary font-bold"> success!!</span></div>
                    <div data-aos='fade-left' className='max-w-[575px] sm:text-[16px] md:text-[24px]  lg:text-5xl lg:leading-[60px]  xl:text-right xl:text-xl'>
                        <p>Help your followers shop smarter with great product recommendations and earn when they shop from your content. With Wishlink, you can expand your reach, engage a wider audience, and effortlessly manage everything from a single app.</p>
                    </div>
                </div>
            </div>

            <div data-aos='zoom-in' className='flex justify-center items-center relative  bottom-[150px] h-[300px] mb-[300px]'>
                <div className='relative mobile:py-[20px] sm:py-[30px] md:py-[60px] mobile:w-[350px] sm:w-[450px] md:w-[700px] lg:py-[125px] lg:w-[1000px] xl:w-full flex justify-between items-center bg-gradient-to-br from-[#ffe2ec] to-[#e1f1ff] max-w-[1200px] mobile:rounded-[10px] sm:rounded-[10px] md:rounded-[15px] w-full mobile:px-[20px] sm:px-[20px] md:px-[30px] lg:px-[60px]'>
                    <p className='mobile:text-xs sm:text-sm md:text-2xl lg:text-4xl xl:text-5xl font-medium text-gray-900'>Try <span className="text-primary font-bold "> Truereff</span> for free</p>
                    <img src='/assets/landing/iphoneTwo.png' className='absolute mobile:top-[-25px] sm:top-[-50px] md:top-[-80px] lg:top-[-140px] sm:right-[140px] mobile:right-[120px] md:right-[200px] mobile:w-[100px] sm:w-[160px] md:w-[280px]  lg:h-[620px] lg:w-[460px] xl:w-[550px]' />

                    <ButtonLogin label="Get Started" spanClassName='mobile:pr-[3px] sm:pr-[5px]' className='md:w-[170px] lg:w-[215px] mobile:pl-2 sm:pl-3 md:pl-6 sm:pr-[2px] md:pr-[1px] mobile:text-xs sm:text-sm md:text-base' iconClassName='mobile:h-[20px] mobile:w-[20px] sm:h-[25px] sm:w-[25px] md:h-[44px] md:w-[44px]'
                        onClick={() => {
                            router.push("/login");
                        }} />

                </div>
            </div>
        </>

    )
}
