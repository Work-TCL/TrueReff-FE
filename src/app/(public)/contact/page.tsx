"use client"
import HeaderAuth from "@/app/_components/pages/auth/components/header-auth";
import LandingPageFooter from "@/app/_landingpage/LandingPageFooter";
import Launchpad from "@/app/_landingpage/Launchpad";
import { MapPin, PhoneCall } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

function page() {
  const router = useRouter()
  return (
    <div className="bg-gray-50 text-gray-800">
      {/* <!-- Header --> */}
      <header className="bg-white shadow">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center gap-3">
          <img
            alt="TrueReff"
            className="md:w-fit sm:max-w-[203px] w-fit max-w-[160px] mr-auto cursor-pointer"
            src="/assets/common/truereff-dark.svg"
            onClick={() => router?.push('/')}
          />
        </div>
      </header>

      {/* <!-- Hero Section --> */}
      <section className="bg-primary text-white py-12 text-center">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-4xl font-bold mb-3">Contact Us</h2>
          <p className="text-lg">
            We’re here to help. Reach out to us anytime!
          </p>
        </div>
      </section>

      {/* <!-- Terms Content --> */}
      <main className="max-w-4xl mx-auto px-4 py-10 space-y-10">
       <div className="space-y-6">
          <div className="flex items-center gap-4 p-4 rounded-xl border border-primary/30 bg-primary/5">
            <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full bg-primary text-white font-bold">
              @
            </div>
            <div>
              <div className="text-sm text-gray-500">Email</div>
              <div className="text-base font-medium text-primary">support@truereff.com</div>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-xl border border-primary/30 bg-primary/5">
            <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full bg-primary text-white font-bold">
              <PhoneCall />
            </div>
            <div>
              <div className="text-sm text-gray-500">Phone</div>
              <div className="text-base font-medium text-primary">+91 79908 17357</div>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 rounded-xl border border-primary/30 bg-primary/5">
            <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full bg-primary text-white font-bold">
             <MapPin />
            </div>
            <div>
              <div className="text-sm text-gray-500">Address</div>
              <div className="text-base font-medium text-primary">
                Shop no 2, Ozon Shopping Centre,
                <br />
                Kamrej Bardoli Road, Surat, Gujarat
                <br />
                PIN: 394180
              </div>
            </div>
          </div>
        </div>

        <div className="text-center">
          <a
            href="mailto:support@truereff.com"
            className="inline-block bg-primary text-white font-semibold rounded-full px-6 py-3 shadow hover:bg-primary/90 transition"
          >
            Send Email
          </a>
        </div>
      </main>
      {/* <Launchpad /> */}
      <LandingPageFooter isLanginPage={false} />
    </div>
  );
}

export default page;
