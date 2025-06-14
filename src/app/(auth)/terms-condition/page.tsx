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
          <h2 className="text-4xl font-bold mb-3">Terms and Conditions</h2>
          <p className="text-lg">
            Please read these terms carefully before using our platform.
          </p>
        </div>
      </section>

      {/* <!-- Terms Content --> */}
      <main className="max-w-4xl mx-auto px-4 py-10 space-y-10">
        {/* <!-- Each Term --> */}
        <section>
          <h3 className="text-xl font-semibold text-black mb-2">
            1. Definitions
          </h3>
          <p>
            "Truereff" or "we" or "our" refers to GRIFEN INCORPORATED, the owner
            and operator of the website. "User" or "you" means any individual or
            entity using the website, including but not limited to brands and
            creators. "Platform" refers to the website and all related services
            offered by Truereff.
          </p>
        </section>

        <section>
          <h3 className="text-xl font-semibold text-black mb-2">
            2. Eligibility
          </h3>
          <p>
            You must be at least 18 years old or the age of majority in your
            jurisdiction. You must also have authority to bind any organization
            you represent.
          </p>
        </section>

        <section>
          <h3 className="text-xl font-semibold text-black mb-2">
            3. Account Registration
          </h3>
          <p>
            You agree to provide accurate information and maintain your account
            credentials securely.
          </p>
        </section>

        <section>
          <h3 className="text-xl font-semibold text-black mb-2">
            4. User Roles and Responsibilities
          </h3>
          <p>
            Creators may link Instagram accounts and grant Truereff permissions
            to access post data. Brands may browse, collaborate, and manage
            interactions.
          </p>
        </section>

        <section>
          <h3 className="text-xl font-semibold text-black mb-2">
            5. Meta Platform Integration
          </h3>
          <p>
            Creators must authorize access to Instagram data via Meta’s API. You
            agree to Meta’s Terms, Data Policy, and Community Guidelines.
            Permissions are only used as described in our Privacy Policy.
          </p>
        </section>

        <section>
          <h3 className="text-xl font-semibold text-black mb-2">
            6. Use of the Platform
          </h3>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li>Do not violate laws or regulations.</li>
            <li>No impersonation or platform disruption.</li>
            <li>No use of bots, scrapers, or uploading harmful content.</li>
          </ul>
        </section>

        <section>
          <h3 className="text-xl font-semibold text-black mb-2">
            7. Content Ownership and Licenses
          </h3>
          <p>
            You retain ownership. You grant Truereff a non-exclusive,
            royalty-free license to display and use content only for platform
            functionality.
          </p>
        </section>

        <section>
          <h3 className="text-xl font-semibold text-black mb-2">
            8. Payments and Collaborations
          </h3>
          <p>
            Payment terms are between brands and creators. Truereff does not
            handle payments unless otherwise stated in the future.
          </p>
        </section>

        <section>
          <h3 className="text-xl font-semibold text-black mb-2">
            9. Intellectual Property
          </h3>
          <p>
            All platform content is owned by GRIFEN INCORPORATED or licensed
            third parties. Unauthorized use is prohibited.
          </p>
        </section>

        <section>
          <h3 className="text-xl font-semibold text-black mb-2">
            10. Termination
          </h3>
          <p>
            We may suspend or terminate accounts for any reason, including
            violation of these Terms.
          </p>
        </section>

        <section>
          <h3 className="text-xl font-semibold text-black mb-2">
            11. Disclaimers
          </h3>
          <p>
            The platform is provided "as is". We do not guarantee availability
            or accuracy. Use at your own risk.
          </p>
        </section>

        <section>
          <h3 className="text-xl font-semibold text-black mb-2">
            12. Limitation of Liability
          </h3>
          <p>
            We are not liable for any damages resulting from your use of the
            platform, to the fullest extent permitted by law.
          </p>
        </section>

        <section>
          <h3 className="text-xl font-semibold text-black mb-2">
            13. Indemnification
          </h3>
          <p>
            You agree to hold Truereff and its affiliates harmless against
            claims arising from your use of the platform or violations of these
            Terms.
          </p>
        </section>

        <section>
          <h3 className="text-xl font-semibold text-black mb-2">
            14. Modifications to Terms
          </h3>
          <p>
            We may update these Terms at any time. Continued use after updates
            means you accept the new Terms.
          </p>
        </section>

        <section>
          <h3 className="text-xl font-semibold text-black mb-2">
            15. Governing Law
          </h3>
          <p>
            These Terms are governed by the laws of India. Disputes fall under
            the courts of [Insert City, India].
          </p>
        </section>

        <section>
          <h3 className="text-xl font-semibold text-black mb-2">
            16. Contact Us
          </h3>
          <p>
            For questions, contact us at:
            <br />
            <strong>Email:</strong>{" "}
            <a
              href="mailto:contact.trf@truereff.com"
              className="text-primary hover:underline"
              target="_blank"
            >
              contact.trf@truereff.com
            </a>
          </p>
        </section>
      </main>
      {/* <Launchpad /> */}
      <LandingPageFooter isLanginPage={false} />
    </div>
  );
}

export default page;
