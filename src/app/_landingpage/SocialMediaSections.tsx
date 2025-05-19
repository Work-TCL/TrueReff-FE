import { MoveRight } from 'lucide-react';
import React from 'react'
import Instagram from '../../../public/assets/svg/Instagram';
import SignUpImage from '../../../public/assets/svg/SignUP';
import EarningHeans from '../../../public/assets/svg/EarningHeans';

export default function SocialMediaSections() {
    return (
        <section className="bg-gradient-to-br from-[#ffe2ec] to-[#e1f1ff] flex flex-col gap-36">
            <div className='flex flex-col justify-center'>
                <div className="flex justify-center text-center pt-16">
                    <p className="text-5xl font-medium text-gray-900 leading-[60px]">
                        Discover and explore endless <br /> possibilities with
                        <span className="text-primary font-bold"> Truereff</span>
                    </p>
                </div>

                <div className=" flex justify-center ml-[140px]">
                    <div className=' flex justify-center items-center'>
                        <div className="h-[114px] w-[291px] py-[10px] px-[20] flex flex-col gap-1 bg-white bg-opacity-80 backdrop-blur-sm rounded-[15px] shadow-md">
                            <p className="text-3xl font-medium">Smith Jain</p>
                            <p className="text-xs flex items-center gap-1">
                                <Instagram />450k Followers
                            </p>
                            <p className='text-gray-500 text-base'>@imsmithjain</p>
                        </div>
                    </div>

                    <div className='relative right-[140px]'>
                        <img src="/assets/landing/menHeartGroup.png" alt="Smith Jain" className="" />
                    </div>

                    <div className="h-[533px] flex flex-col justify-end items-start relative left-[-210px] pb-20 gap-[15px]">
                        <h3 className="text-3xl font-semibold text-gray-800">Exponential Growth</h3>
                        <p className=" text-sm ">Grow your social media presence <br /> and achieve</p>
                        <button className="group relative flex items-center justify-between pl-6 pr-[1px] py-[1px] rounded-full bg-primary text-white text-base overflow-hidden border-2 border-transparent transition-all duration-300 ease-in-out hover:border-pink-600 hover:bg-white w-[215px]">
                            <span className="absolute inset-0 bg-white transform scale-x-0 origin-right transition-transform duration-300 ease-in-out group-hover:scale-x-100 z-0" />
                            <span className="relative z-10 transition-colors duration-300 ease-in-out group-hover:text-primary">
                                Read More
                            </span>
                            <div className="relative z-10 flex items-center justify-center h-[44px] w-[44px] rounded-full bg-white transition-colors duration-300 ease-in-out">
                                <MoveRight className="text-primary transition-colors duration-300 ease-in-out" />
                            </div>
                        </button>
                    </div>
                </div>
            </div>

            <div className='flex flex-col justify-center items-center gap-5'>
                <p className="text-5xl font-medium text-gray-900 leading-6 pb-10">
                    Join <span className="text-primary font-bold">Truereff</span> and start earning
                </p>

                <div className='flex gap-4 h-[551px]'>
                    <div className='rounded-tl-xl rounded-tr-xl h-full w-[300px] flex flex-col text-center align-middle justify-end  p-[40px] bg-[#38a2f5]'>
                        <p className='font-black text-5xl text-white opacity-25'>1</p>
                        <p className='text-2xl font-medium text-white pt-4 pb-8'>Sign up on Truereff</p>
                        <div className='flex pb-12 align-center justify-center'>
                        <SignUpImage />
                        </div>
                    </div>
                    <div className='rounded-tl-xl rounded-tr-xl w-[600px] bg-primary flex flex-col align-middle text-center justify-end'>
                        <p className='font-black text-white  text-5xl'>2</p>
                        <p className='ont-medium text-white pt-4 text-3xl'>Link your social media</p>
                        <p className='text-white'>Connect either your Instagram <br /> or YouTube account</p>
                        <div className='w-full flex justify-center'>
                        <img src="/assets/landing/iPhone.png" alt="iphone"  className="h-[380px] w-[400px]" />
                        </div>
                    </div>
                     <div className='rounded-tl-xl rounded-tr-xl h-full w-[300px] flex flex-col  text-center align-middle justify-end  p-[40px] bg-[#38a2f5]'>
                        <p className='font-black text-5xl text-white opacity-25'>1</p>
                        <p className='text-2xl font-medium text-white pt-4 pb-8'>Kickstart your earninas</p>
                        <div className='flex pb-12 align-center justify-center'>
                        <EarningHeans />
                        </div>
                    </div>
                </div>
            </div>

        </section>
    );
}
