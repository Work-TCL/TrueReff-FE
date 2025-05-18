import { MoveRight } from 'lucide-react'
import React from 'react'

export default function Launchpad() {
    return (
        <>
            <div className="bg-[url('/assets/landing/launchpad.png')] bg-cover bg-center bg-no-repeat pt-[150px] pb-[300px] w-full">

                <div className='max-w-[1200px] mx-auto flex gap-[100px] items-center'>
                    <div className='text-6xl  font-medium text-gray-900 leading-[80px]'>Your launchpad to<span className="text-primary font-bold"> success!!</span></div>
                    <div className='max-w-[575px] text-right text-xl'>
                        <p>Help your followers shop smarter with great product recommendations and earn when they shop from your content. With Wishlink, you can expand your reach, engage a wider audience, and effortlessly manage everything from a single app.</p>
                    </div>
                </div>
            </div>

            <div className='flex justify-center items-center relative bottom-[150px] h-[300px]'>
                <div className='relative py-[100px]  flex justify-between align-middle bg-gradient-to-br from-[#ffe2ec] to-[#e1f1ff] max-w-[1200px] rounded-[15px] w-full px-[60px]'>
                    <p className='text-5xl font-medium text-gray-900'>Try <span className="text-primary font-bold "> Truereff</span> for free</p>
                    <img src='/assets/landing/iphoneTwo.png' className='absolute top-[-130px] right-[230px] h-[550px] w-[500px]' />

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
        </>

    )
}
