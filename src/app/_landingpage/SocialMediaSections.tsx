"use client";

import { MoveRight } from "lucide-react";
import React from "react";
import Instagram from "../../../public/assets/svg/Instagram";
import SignUpImage from "../../../public/assets/svg/SignUP";
import EarningHeans from "../../../public/assets/svg/EarningHeans";
import ButtonLogin from "../_components/components-common/Button-Login";

export default function SocialMediaSections() {
  return (
    <section className="w-[100vw] overflow-hidden pt-20 md:pt-[100px] bg-gradient-to-r #f6f1fd #fef8e5 #faf7fd  flex flex-col gap-[100px]">
      {/* <div className='flex flex-col justify-center'>
                <div data-aos="zoom-in-left" className="flex justify-center text-center">
                    <p className="font-medium text-[70px] text-gray-900 leading-[90px] tablet:text-[40px] tablet:leading-[60px] xsmobile:text-[40px] xsmobile:leading-[60px]">
                        Discover and explore endless <br /> possibilities with
                        <span className="text-primary font-bold"> Truereff</span>
                    </p>
                </div>

                <div data-aos="zoom-in-right" className="w-full px-4 py-10 ">
                    <div className="max-w-7xl mx-auto flex justify-center lg:flex-row items-center ">

                        <div className="relative flex items-center">

                            <div className="absolute top-[35%] right-[75%] tablet:top-[32%] tablet:right-[47%] bg-white bg-opacity-80 backdrop-blur-sm rounded-[15px] xsmobile:rounded-[10px] shadow-md p-4 xsmobile:h-[55px] tablet:h-[70px] xsmobile:w-[160px] w-[250px] h-[114px] flex flex-col justify-center gap-1">
                                <p className="text-[30px] leading-[46px] tablet:text-[22px] tablet:leading-[23px] xsmobile:text-[20px] xsmobile:leading-[20px] font-medium">Smith Jain</p>
                                <p className=" text-[12px] tablet:text-[10px] xsmobile:text-[9px] xsmobile:leading-[9px] font-normal flex items-center gap-1">
                                    <Instagram className='tablet:h-[12px] tablet:w-[12px] xsmobile:h-[10px] xsmobile:w-[10px]'/> 450k Followers
                                </p>
                                <p className="text-gray-500 text-[16px] leading-[28px] tablet:text-[12px] tablet:leading-[13px] xsmobile:text-[10px] xsmobile:leading-[10px] font-medium">@imsmithjain</p>
                            </div>

                            <img
                                src="/assets/landing/menHeartGroup.png"
                                alt="Smith Jain"
                                className="tablet:w-[270px] lg:min-w-[500px] relative xsmobile:w-[180px]"
                            />

                            <div className="  absolute left-[88%] tablet:left-[85%]  w-max top-[53%]  flex flex-col justify-center text-start gap-4 tablet:gap-1 xsmobile:gap-1">
                            <h3 className=" font-medium	xl:text-[40px] xl:leading-[46px] lg:text-[26px] lg:leading-[31px] md:text-[20px] md:leading-[24px] tablet:text-[14px] tablet:leading-[15px] xsmobile:text-[10px] xsmobile:leading-[10px]">Exponential Growth</h3>
                            <p className=" xl:text-[20px] xl:leading-[28px] font-medium	lg:text-[16px] lg:leading-[21px] md:text-[12px] md:leading-[16px] tablet:text-[9px] tablet:leading-[10px] xsmobile:text-[8px] xsmobile:leading-[10px]">
                                Grow your social media presence <br /> and achieve
                            </p>
                            <ButtonLogin
                                label="Read More"
                                spanClassName=" tablet:text-[16px] xsmobile:text-[14px]"
                                className=" tablet:w-[140px]  xsmobile:w-[120px] w-[210px] h-[50px] xsmobile:pl-[8px] tablet:h-[40px] tablet:pl-[10px] xsmobile:h-[30px]"
                                iconClassName=" h-[44px] w-[44px] tablet:h-[30px] tablet:w-[30px] xsmobile:h-[20px] xsmobile:w-[20px]"
                                onClick={() => console.log('')}
                            />
                        </div>
                        </div>

                        
                    </div>
                </div>

            </div> */}

      <div className="flex flex-col justify-center items-center">
        <p
          data-aos="zoom-out-up"
          className=" xl:text-[70px] font-medium xl:leading-[90px] md:text-5xl md:leading-[1.3] text-3xl text-center font-medium text-gray-900 pb-[50px] pt-[40px["
        >
          Join <span className="text-primary font-bold">Truereff</span> and
          start earning
        </p>

        <div className="flex xsmobile:flex-col xsmobile:justify-center xsmobile:items-center  md:gap-[20px]">
          <div
            data-aos="zoom-in-right"
            className="rounded-tl-xl rounded-tr-xl   h-auto max-w-[300px] xsmobile:w-[250px]  xsmobile:h-[400px]  flex flex-col text-center items-center justify-end  p-[40px] bg-[#38a2f5]"
          >
            <p className="font-black text-[60px] tablet:text-[40px]  leading-[46px] text-white opacity-25">
              1
            </p>
            <p className="sm:text-lg mobile:text-base md:text-xl lg:text-2xl font-medium text-white pt-[30px]">
              Sign up on Truereff
            </p>
            <div className="flex sm:pb-0 md:pb-12 align-center justify-center">
              <SignUpImage />
            </div>
          </div>
          <div
            data-aos="flip-left"
            className="rounded-tl-xl rounded-tr-xl h-auto max-w-[600px]  xsmobile:w-[300px]  tablet:min-h-auto xsmobile:h-[536px]  bg-primary flex flex-col items-center text-center"
          >
            <p className="font-black text-white tablet:text-[40px]  text-[60px] pt-[40px] leading-[46px]">
              2
            </p>
            <p className="ont-medium text-white pt-[30px] text-[30px] leading-[46px] tablet:text-[25px] tablet:leading-[35px]">
              Link your social media
            </p>
            <p className="text-white pt-[15px] pb-[32px] text-[16px] leading-[24px]">
              Connect either your Instagram <br /> or YouTube account
            </p>
            <div className="w-full flex justify-center mt-[-21px] h-auto">
              <img src="/assets/landing/iPhone.png" alt="iphone" />
            </div>
          </div>
          <div
            data-aos="zoom-in-left"
            className="rounded-tl-xl rounded-tr-xl h-auto max-w-[300px] xsmobile:w-[250px]  xsmobile:h-[400px]  flex flex-col  text-center items-center justify-end  p-[40px] bg-[#38a2f5]"
          >
            <p className="font-black text-[60px] tablet:text-[40px]  leading-[46px] text-white opacity-25">
              3
            </p>
            <p className=" sm:text-lg mobile:text-base md:text-xl lg:text-2xl font-medium text-white mobile:pb-4 pt-4 pb-8">
              Kickstart your earninas
            </p>
            <div className="flex sm:pb-0  md:pb-12 align-center justify-center">
              <EarningHeans />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
