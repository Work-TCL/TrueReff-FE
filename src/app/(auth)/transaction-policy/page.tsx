"use client"
import HeaderAuth from "@/app/_components/pages/auth/components/header-auth";
import LandingPageFooter from "@/app/_landingpage/LandingPageFooter";
import Launchpad from "@/app/_landingpage/Launchpad";
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
             className="md:w-fit sm:max-w-[203px] w-fit max-w-[160px] mr-auto"
             src="/assets/common/truereff-dark.svg"
             onClick={() => router?.push('/')}
           />
         </div>
       </header>

      {/* <!-- Hero Section --> */}
      <section className="bg-primary text-white py-12 text-center">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-4xl font-bold mb-3">Truereff Cancellation & Refund Policy</h2>
          <p className="text-lg">
            Please read these policy carefully before using our platform.
          </p>
        </div>
      </section>

      {/* <!-- Terms Content --> */}
      <main className="max-w-4xl mx-auto px-4 py-10 space-y-10">
       <section>
          <h2 className="text-xl font-semibold text-primary mb-2">Cancellation Policy</h2>
          <p className="text-gray-700 leading-relaxed">
            At <span className="font-medium">Truereff</span>, we aim to offer a flexible and transparent experience for all our users and partners.
          </p>
          <ul className="list-disc pl-6 text-gray-700 mt-3 space-y-2">
            <li>You may cancel your subscription or service plan at any time through your account settings or by contacting our support team.</li>
            <li>For cancellations requested before the next billing cycle, no further payments will be charged.</li>
            <li>If you cancel during an active billing cycle, your service will remain active until the end of the paid period. We do not offer partial cancellations or early terminations for that cycle.</li>
            <li>We recommend contacting our support team if you need any help with canceling or pausing your plan.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-primary mb-2">Refund Policy</h2>
          <p className="text-gray-700 leading-relaxed">
            At <span className="font-medium">Truereff</span>, customer satisfaction is important to us. However, please note:
          </p>
          <ul className="list-disc pl-6 text-gray-700 mt-3 space-y-2">
            <li>We do not offer refunds for services that have already been used or are currently active within the paid period due to the nature of our digital services.</li>
            <li>Refunds are not applicable once a billing cycle has begun and services have been accessed.</li>
            <li>In special cases of billing errors or technical issues caused by Truereff, we may review refund requests on a case-by-case basis. Please contact our support team within 7 days of the issue for assistance.</li>
          </ul>
        </section>

        <div className="bg-primary/10 rounded-xl p-4 text-primary border border-primary">
          <p className="font-medium">
            Our goal is to be fair and transparent. If you have any concerns, we encourage you to reach out — we’re here to help!
          </p>
        </div>

        <div className="text-center">
          <a
            href="/contact"
            className="inline-block bg-primary text-white font-semibold rounded-full px-6 py-3 shadow hover:bg-primary/90 transition"
          >
            Contact Support
          </a>
        </div>
      </main>
      {/* <Launchpad /> */}
      <LandingPageFooter isLanginPage={false} />
    </div>
  );
}

export default page;
