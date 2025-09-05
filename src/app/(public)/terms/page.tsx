"use client";
import LandingPageFooter from "@/app/_landingpage/LandingPageFooter";
import { useRouter, useSearchParams } from "next/navigation";
import React from "react";

const TermsAndConditions = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  return (
    <div className="bg-gray-50 text-gray-800">
      <header className="bg-white shadow">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center gap-3">
          <img
            alt="TrueReff"
            className="md:w-fit sm:max-w-[203px] w-fit max-w-[160px] mr-auto cursor-pointer"
            src="/assets/common/truereff-dark.svg"
            onClick={() => {
              const nextParam = searchParams.get("next");
              if (nextParam) {
                router.push(nextParam);
              } else {
                router.push("/");
              }
            }}
          />
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-10 text-gray-800">
        <h1 className="text-3xl font-bold mb-6 text-center">
          TRUEREFF UNIVERSAL AFFILIATE CAMPAIGN AGREEMENT
        </h1>
        <p className="mb-4 italic">
          (Applicable to All Brands on the Truereff Platform)
        </p>

        <p className="mb-4">
          <strong>Platform Name:</strong> Truereff ("Platform")
        </p>
        <p className="mb-4">
          <strong>Applicable To:</strong> All registered brands using the
          Truereff platform.
        </p>
        <p className="mb-6">
          This Agreement outlines the terms and conditions under which brands
          engage in affiliate-based marketing campaigns with creators on
          Truereff. By listing products and launching campaigns on Truereff,
          brands agree to comply with the following terms:
        </p>

        <h2 className="text-2xl font-semibold mb-2">
          1. Campaign Creation and Affiliate Model
        </h2>
        <ul className="list-disc list-inside mb-6 space-y-1">
          <li>
            1.1 Brands may upload product details and initiate affiliate
            marketing campaigns on Truereff.
          </li>
          <li>
            1.2 Campaigns operate on a commission-per-sale basis driven by
            creators.
          </li>
          <li>
            1.3 Brands can accept, reject, or counter commission bids submitted
            by creators.
          </li>
          <li>
            1.4 Once a commission rate is mutually agreed upon, it becomes fixed
            and binding for that specific campaign.
          </li>
          <li>
            1.5 Brands must ensure that all campaign details and product
            information provided are accurate and lawful.
          </li>
        </ul>

        <h2 className="text-2xl font-semibold mb-2">
          2. Wallet Balance Requirement & Affiliate Link Activation
        </h2>
        <ul className="list-disc list-inside mb-6 space-y-1">
          <li>
            2.1 Brands must maintain a sufficient wallet balance on Truereff to
            activate and run campaigns.
          </li>
          <li>
            2.2 If the brand’s wallet balance is insufficient or depleted:
            <ul className="list-disc ml-6">
              <li>
                a. Affiliate links associated with the campaign will be
                automatically disabled.
              </li>
              <li>
                b. No further sales will be tracked or attributed, and no
                commissions will be payable.
              </li>
            </ul>
          </li>
          <li>
            2.3 Truereff shall not be held responsible for any performance
            issues, missed sales, or creator concerns arising from insufficient
            wallet balance.
          </li>
        </ul>

        <h2 className="text-2xl font-semibold mb-2">3. Commission Payments</h2>
        <ul className="list-disc list-inside mb-6 space-y-1">
          <li>
            3.1 All creator commission payments are processed by Truereff.
          </li>
          <li>
            3.2 Commissions are deducted from the brand’s wallet based on
            verified sales tracked through the platform.
          </li>
          <li>
            3.3 Payouts to creators are made according to Truereff’s settlement
            timeline.
          </li>
          <li>
            3.4 Truereff is not responsible for any tax or compliance
            obligations arising on the brand’s side in connection with the
            payouts.
          </li>
        </ul>

        <h2 className="text-2xl font-semibold mb-2">
          4. Creator Content & Usage Restrictions
        </h2>
        <ul className="list-disc list-inside mb-6 space-y-1">
          <li>
            4.1 All content (including videos, reels, images, etc.) created by
            creators remains their exclusive intellectual property.
          </li>
          <li>
            4.2 Brands are not permitted to use creator-generated content for
            any purpose—including but not limited to marketing, ads, or
            promotions—without the creator’s explicit written consent.
          </li>
          <li>
            4.3 Unauthorized use of creator content constitutes a breach of this
            Agreement and may lead to:
            <ul className="list-disc ml-6">
              <li>a. Legal action under Indian intellectual property laws</li>
              <li>b. Financial penalties</li>
              <li>c. Suspension or termination from the Truereff platform</li>
            </ul>
          </li>
        </ul>

        <h2 className="text-2xl font-semibold mb-2">
          5. Dispute Resolution & Legal Jurisdiction
        </h2>
        <ul className="list-disc list-inside mb-6 space-y-1">
          <li>
            5.1 Truereff will act as a neutral mediator in case of disputes
            related to campaigns, payments, or content misuse.
          </li>
          <li>5.2 This Agreement is governed by the laws of India.</li>
          <li>
            5.3 The courts of Ahmedabad shall have exclusive jurisdiction over
            any unresolved disputes.
          </li>
        </ul>

        <h2 className="text-2xl font-semibold mb-2">6. General Terms</h2>
        <ul className="list-disc list-inside mb-6 space-y-1">
          <li>
            6.1 This Agreement applies to all brands using Truereff, regardless
            of individual contract signing.
          </li>
          <li>
            6.2 Truereff may amend this Agreement at any time, with notice
            provided via email or platform notification. Continued use of
            Truereff after such updates constitutes acceptance of the revised
            terms.
          </li>
          <li>
            6.3 By listing products or creating campaigns, the brand confirms
            its authority to represent its business and legally bind it to this
            Agreement.
          </li>
        </ul>

        <p className="mt-8 font-medium">
          By using Truereff, the brand agrees to the terms stated in this
          Agreement.
        </p>
      </main>
      <LandingPageFooter isLanginPage={false} />
    </div>
  );
};

export default TermsAndConditions;
