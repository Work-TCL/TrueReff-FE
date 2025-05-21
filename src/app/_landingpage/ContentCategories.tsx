"use client";

import React from 'react'
import Enagel from '../../../public/assets/svg/Enagle'
import CupPlus from '../../../public/assets/svg/CupPlus'
import Lotus from '../../../public/assets/svg/Lotus'
import PantCategory from '../../../public/assets/svg/PantCategory'
import Sofa from '../../../public/assets/svg/Sofa'
import GirlStart from '../../../public/assets/svg/GirlsStart'
import BookCategory from '../../../public/assets/svg/BookCategory'
import Bag from '../../../public/assets/svg/Bag'
import ImageCategory from '../../../public/assets/svg/ImageCategory'
import Music from '../../../public/assets/svg/Music'
import { MoveRight } from 'lucide-react'

export default function ContentCategories() {
    const categories = [
        { cateGoriesIcon: <Enagel /> },
        { cateGoriesIcon: <CupPlus /> },
        { cateGoriesIcon: <Lotus /> },
        { cateGoriesIcon: <Music /> },
        { cateGoriesIcon: <ImageCategory /> },
        { cateGoriesIcon: <Bag /> },
        { cateGoriesIcon: <BookCategory /> },
        { cateGoriesIcon: <GirlStart /> },
        { cateGoriesIcon: <Sofa /> },
        { cateGoriesIcon: <PantCategory /> },
    ]
    return (
        <>
        <div className='bg-[#f3ad1e] py-[85px]'>
            <div className="grid sm:grid-cols-1 sm:place-items-center lg:place-item-start lg:grid-cols-2 lg:gap-[35px] xl:gap-[60px] gap-[60px] items-center max-w-[1322px] mx-auto">
                    <div className='flex flex-col justify-center items-center gap-[10px]'>
                        <div className="flex mobile:gap-[6px] gap-[10px] lg:gap-[8px] xl:gap-[10px]">
                            {categories.slice(0, 3).map((category, index) => (
                                <div key={index} className=' h-[120px] w-[120px] xl:h-[120px] xl:w-[120px] 2xl:h-[150px] 2xl:w-[150px] flex items-center justify-center bg-[#FBBF12] rounded-[10px]'>
                                    {category.cateGoriesIcon}
                                </div>
                            ))}
                        </div>

                        <div className="flex mobile:gap-[6px] gap-[10px] lg:gap-[8px] xl:gap-[10px]">
                            {categories.slice(3, 7).map((category, index) => (
                                <div key={index + 3} className='h-[120px] w-[120px] xl:h-[120px] xl:w-[120px] 2xl:h-[150px] 2xl:w-[150px] flex items-center justify-center bg-[#FBBF12] rounded-[10px]'>
                                    {category.cateGoriesIcon}
                                </div>
                            ))}
                        </div>

                        <div className="flex mobile:gap-[6px] gap-[10px] lg:gap-[8px] xl:gap-[10px]">
                            {categories.slice(7, 10).map((category, index) => (
                                <div key={index + 7} className=' h-[120px] w-[120px] xl:h-[120px] xl:w-[120px] 2xl:h-[150px] 2xl:w-[150px] flex items-center justify-center bg-[#FBBF12] rounded-[10px]'>
                                    {category.cateGoriesIcon}
                                </div>
                            ))}
                        </div>
                    </div>
                
                    <div className='mobile:px-12'>
                        <h2 className="mobile:text-3xl md:text-5xl xl:text-7xl font-medium text-[#333333] max-w-[438px] mb-4 leading-[90px]">Are you one of <b>them?</b></h2>
                        <p className='text-xl font-medium text-[#333333] max-w-[632px] mb-10 '>We work with Creators big and small, up and comers, trendsetters and market leaders, We look for creators with interesting stories and exceptional content across categories</p>
                        <button className="group relative flex items-center justify-between pl-6 pr-[1px] py-[1px] rounded-full bg-primary text-white text-base overflow-hidden border-2 border-transparent transition-all duration-300 ease-in-out hover:border-pink-600 hover:bg-white w-[215px]">
                            <span className="absolute inset-0 bg-white transform scale-x-0 origin-right transition-transform duration-300 ease-in-out group-hover:scale-x-100 z-0" />
                            <span className="relative z-10 transition-colors duration-300 ease-in-out group-hover:text-primary">
                                Get Started
                            </span>
                            <div className="relative z-10 flex items-center justify-center h-[44px] w-[44px] rounded-full bg-white transition-colors duration-300 ease-in-out">
                                <MoveRight className="text-primary transition-colors duration-300 ease-in-out" />
                            </div>
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}
