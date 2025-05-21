"use client";

import { MoveRight } from 'lucide-react';
import React from 'react'
import Instagram from '../../../public/assets/svg/Instagram';
import SignUpImage from '../../../public/assets/svg/SignUP';
import EarningHeans from '../../../public/assets/svg/EarningHeans';

export default function SocialMediaSections() {
    return (
        <section className="bg-gradient-to-br from-[#ffe2ec] to-[#e1f1ff] flex flex-col sm:gap-[18px] md:gap-32">
            <div className='flex flex-col justify-center'>
                <div data-aos="zoom-in-left" className="flex justify-center text-center pt-16">
                    <p className="mobile:text-2xl sm:text-2xl lg:text-5xl font-medium text-gray-900 leading-[60px]">
                        Discover and explore endless <br /> possibilities with
                        <span className="text-primary font-bold"> Truereff</span>
                    </p>
                </div>

                <div data-aos="zoom-in-right" className=" flex justify-center items-center mobile:ml-[170px] md:ml-[180px] sm:ml-[200px] lg:ml-[350px] h-[533px] pt-5 mobile:mt-[-110px]">
                    <div className=' flex justify-center items-center'>
                        <div className="h-[114px] w-[291px] py-[10px] px-[20] flex flex-col gap-1 bg-white bg-opacity-80 backdrop-blur-sm rounded-[15px] shadow-md">
                            <p className="lg:text-2xl xl:text-3xl font-medium">Smith Jain</p>
                            <p className="text-xs flex items-center gap-1">
                                <Instagram />450k Followers
                            </p>
                            <p className='text-gray-500 lg:text-sm xl:text-base'>@imsmithjain</p>
                        </div>
                    </div>

                    <div className='relative mobile:right-[160px] right-[140px]'>
                        <img src="/assets/landing/menHeartGroup.png" alt="Smith Jain" className="mobile:min-w-[300px] md:h-[533px] md:min-w-[400px] sm:min-w-[300px] sm:h-[433px] lg:min-w-[500px]" />
                    </div>

                    <div className="h-[533px]  md:min-w-[160px] mobile:pb-24 sm:ml-[20px] flex flex-col justify-end items-start relative left-[-210px] pb-20 sm:gap-[10px] mobile:gap-[10px] lg:gap-[15px]">
                        <h3 className="lg:text-2xl xl:text-3xl font-semibold text-gray-800">Exponential Growth</h3>
                        <p className="text-xs lg:text-sm ">Grow your social media presence <br /> and achieve</p>
                        <button className="group relative flex items-center justify-between mobile:pl-2 pl-6 pr-[1px] py-[1px] rounded-full bg-primary text-white mobile:text-xs text-base overflow-hidden border-2 border-transparent transition-all duration-300 ease-in-out hover:border-pink-600 hover:bg-white  mobile:w-[100px]sm:w-[180px] lg:w-[215px]">
                            <span className="absolute inset-0 bg-white transform scale-x-0 origin-right transition-transform duration-300 ease-in-out group-hover:scale-x-100 z-0" />
                            <span className="relative z-10 transition-colors duration-300 ease-in-out group-hover:text-primary">
                                Read More
                            </span>
                            <div className="relative z-10 flex items-center justify-center mobile:h-[20px] mobile:w-[20px] h-[44px] w-[44px] rounded-full bg-white transition-colors duration-300 ease-in-out">
                                <MoveRight className="text-primary transition-colors duration-300 ease-in-out" />
                            </div>
                        </button>
                    </div>
                </div>
            </div>

            <div className='flex flex-col justify-center items-center gap-5'>
                <p data-aos='zoom-out-up' className=" mobile:text-2xl sm:text-4xl md:text-4xl lg:text-5xl font-medium text-gray-900 leading-6 pb-10">
                    Join <span className="text-primary font-bold">Truereff</span> and start earning
                </p>

                <div className='flex mobile:gap-3 sm:gap-4 mobile:h-[400px] sm:h-[400px] md:h-[551px]'>
                    <div data-aos='zoom-in-right' className='rounded-tl-xl rounded-tr-xl h-full mobile:w-[130px] sm:w-[150px] md:w-[220px] lg:w-[250px] xl:w-[300px] flex flex-col text-center items-center justify-end  p-[40px] bg-[#38a2f5]'>
                        <p className='font-black mobile:text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-white opacity-25'>1</p>
                        <p className='sm:text-lg mobile:text-base md:text-xl lg:text-2xl font-medium text-white pt-4 mobile:pb-4 pb-8'>Sign up on Truereff</p>
                        <div className='flex sm:pb-0 md:pb-12 align-center justify-center'>
                        <SignUpImage />
                        </div>
                    </div>
                    <div data-aos="flip-left" className='rounded-tl-xl rounded-tr-xl sm:w-[200px]  mobile:w-[250pxpx] md:w-[300px] lg:w-[400px] xl:w-[600px] bg-primary flex flex-col items-center text-center justify-end'>
                        <p className='font-black text-white mobile:text-2xl sm:text-3xl  md:text-4xl lg:text-5x'>2</p>
                        <p className='ont-medium text-white pt-4 mobile:text-xl md:text-2xl lg:text-3xl'>Link your social media</p>
                        <p className='text-white mobile:px-6'>Connect either your Instagram <br /> or YouTube account</p>
                        <div className='w-full flex justify-center'>
                        <img src="/assets/landing/iPhone.png" alt="iphone"  className="mobile:h-[230px] sm:h-[200px] md:h-[380px] md:w-[400px]" />
                        </div>
                    </div>
                     <div data-aos='zoom-in-left' className='rounded-tl-xl rounded-tr-xl h-full mobile:w-[130px] sm:w-[150px] md:w-[220px] lg:w-[250px] xl:w-[300px] flex flex-col  text-center items-center justify-end  p-[40px] bg-[#38a2f5]'>
                        <p className='font-black mobile:text-2xl sm:text-3xl md:text-4xl lg:text-5x text-white opacity-25'>3</p>
                        <p className=' sm:text-lg mobile:text-base md:text-xl lg:text-2xl font-medium text-white mobile:pb-4 pt-4 pb-8'>Kickstart your earninas</p>
                        <div className='flex sm:pb-0  md:pb-12 align-center justify-center'>
                        <EarningHeans />
                        </div>
                    </div>
                </div>
            </div>

        </section>
    );
}
