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
      {/* <!-- Terms Content --> */}
      <main className="max-w-4xl mx-auto px-4 py-10 space-y-10">
        <section className="space-y-4">
          <p>
            Welcome to Truereff ("Truereff," "we," "our," or "us"). This Privacy
            Policy applies to our app "Truereff," operated by GRIFEN
            INCORPORATED, and available at <strong>trf.truereff.com</strong>.
            Our app integrates with Instagram via our Facebook App{" "}
            <strong>"truereff_fabk_instg"</strong> to facilitate collaborations
            between brands and content creators.
          </p>
          <p>
            By accessing or using the Services, you acknowledge that you have
            read, understood, and agreed to the terms of this Privacy Policy. If
            you do not agree with the practices described herein, please do not
            use the Services.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-blue-600">
            1. Definitions
          </h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <strong>Brand</strong>: Any company that registers on the Site to
              find and collaborate with creators.
            </li>
            <li>
              <strong>Creator</strong>: An individual registering on the Site to
              collaborate with brands.
            </li>
            <li>
              <strong>Personal Information</strong>: Any data that can identify
              a person, under GDPR/CCPA.
            </li>
            <li>
              <strong>Meta Platform</strong>: Refers to Meta Platforms, Inc. and
              affiliated services (Instagram, Facebook).
            </li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-blue-600">
            2. Scope of This Policy
          </h2>
          <p>
            This policy applies to Personal Information we process when you use
            Truereff’s website, tools, and integrations with Meta (e.g.,
            Instagram Graph API).
          </p>
        </section>

        {/* <!-- You can repeat the pattern below for each section (3 to 16) --> */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-blue-600">
            3. Information We Collect
          </h2>
          <p>
            <strong>3.1 Directly from You:</strong>
          </p>
          <ul className="list-disc pl-5">
            <li>Account info (name, email, etc.)</li>
            <li>Profile details and preferences</li>
            <li>Campaign-related data</li>
          </ul>
          <p>
            <strong>3.2 Via Instagram Integration:</strong> Data accessed via
            Instagram Graph API like public profile, media, comments, and DMs
            (with user consent).
          </p>
          <p>
            <strong>3.3 Automatically:</strong> IP, device info, usage data,
            cookies.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-blue-600">
            4–16. Additional Key Sections
          </h2>
          <ul className="list-decimal pl-5 space-y-2">
            <li>
              <strong>Legal Basis:</strong> GDPR lawful bases (contract,
              consent, legal obligation).
            </li>
            <li>
              <strong>Use of Data:</strong> Managing accounts, campaigns,
              Instagram interactions, and more.
            </li>
            <li>
              <strong>Sharing:</strong> Limited to campaign-related parties,
              service providers, or required by law.
            </li>
            <li>
              <strong>Meta Compliance:</strong> Follows Meta’s Developer and
              Data Deletion policies.
            </li>
            <li>
              <strong>Cookies:</strong> Uses cookies for analytics,
              personalization, and session management.
            </li>
            <li>
              <strong>Data Retention:</strong> Data is retained only as long as
              necessary or legally required.
            </li>
            <li>
              <strong>Security:</strong> Follows strong encryption and security
              practices (AES-256, TLS 1.3).
            </li>
            <li>
              <strong>International Transfers:</strong> Handled via SCCs and
              appropriate safeguards.
            </li>
            <li>
              <strong>Your Rights:</strong> Access, correct, delete, restrict,
              or object to data processing.
            </li>
            <li>
              <strong>Children:</strong> Not intended for users under 16.
            </li>
            <li>
              <strong>Third Party Links:</strong> Truereff is not responsible
              for third-party privacy practices.
            </li>
            <li>
              <strong>Policy Changes:</strong> Updates will be announced clearly
              on the platform.
            </li>
            <li>
              <strong>Contact:</strong> Email:{" "}
              <a
                href="mailto:contact.trf@truereff.com"
                className="text-blue-500 underline"
              >
                contact.trf@truereff.com
              </a>
            </li>
          </ul>
        </section>
      </main>
      {/* <Launchpad /> */}
      <LandingPageFooter isLanginPage={false} />
    </div>
  );
}

export default page;
