"use client";
import React, { useState } from "react";
interface IFaqItem {
  question: string;
  answer: string;
}
export const creatorFaqData: IFaqItem[] = [
  {
    question: "Who can join Truereff as a creator?",
    answer:
      "To maintain quality and ensure brand success, we only accept creators with at least 1,000 followers on Instagram, YouTube, or other supported platforms.",
  },
  {
    question: "How do I get paid?",
    answer:
      "Once your content drives actual sales, your earnings are automatically credited to your Truereff wallet. You can withdraw to your bank account anytime.",
  },
  {
    question: "Can I negotiate the brand’s offer?",
    answer:
      "Absolutely. Brands set a base bid, but you can counter-bid with your preferred rate. You’re always in control of your value.",
  },
  {
    question: "Do I need to sign a contract?",
    answer:
      "No long-term contracts. You choose which deals to accept, and you can leave the platform anytime. It’s built for creator flexibility.",
  },
  {
    question: "How do I showcase my selected products?",
    answer:
      "You’ll get a personalized storefront to feature all the products you love. Share the link with your followers and earn per sale.",
  },
];

export const brandFaqData = [
  {
    question: "What type of creators are on Truereff?",
    answer:
      "All creators on our platform are verified and have a minimum of 1,000 followers. We focus on creators with high engagement and niche audience trust.",
  },
  {
    question: "How is pricing handled?",
    answer:
      "You set your own bid price per product sale. There’s no upfront cost — you only pay when a creator drives an actual conversion.",
  },
  {
    question: "Can I chat with creators before confirming a collaboration?",
    answer:
      "Yes, Truereff includes a built-in chat system where you can communicate with creators, clarify expectations, and build better relationships.",
  },
  {
    question: "How is campaign performance tracked?",
    answer:
      "You’ll have access to a real-time analytics dashboard with complete visibility on clicks, conversions, and ROI — all in one place.",
  },
  {
    question: "What support does Truereff provide?",
    answer:
      "Every campaign is backed by our dedicated support team to ensure smooth execution, from creator onboarding to final delivery.",
  },
];

interface IFAQSectionProps {
  type: "creator" | "vendor";
}
const FaqSection = ({ type }: IFAQSectionProps) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0); // open first by default

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const faqQuestions: IFaqItem[] = {
    creator: creatorFaqData,
    vendor: brandFaqData,
  }[type];

  return (
    <section className="bg-yellow-400 py-12 xl:px-4 px-8">
      <div className="max-w-3xl mx-auto">
        <div data-aos="zoom-in-left">
          <h2 className="text-4xl font-bold text-center text-black">FAQs</h2>
        </div>
        <div data-aos="zoom-in-right">
          <p className="text-center text-sm text-black mt-2 mb-8">
            Got questions? We've got answers!
          </p>
        </div>
        <div data-aos="zoom-in-up">
          <div className="bg-white rounded-xl shadow-md divide-y">
            {faqQuestions.map((faq: IFaqItem, index: number) => (
              <div key={index} className="px-6 py-4">
                <button
                  onClick={() => toggle(index)}
                  className="w-full text-left flex justify-between gap-2 items-center focus:outline-none"
                >
                  <span className="font-medium text-sm md:text-lg text-black">
                    {faq.question}
                  </span>
                  <span className="text-xl text-gray-600">
                    {openIndex === index ? "−" : "+"}
                  </span>
                </button>
                <div
                  className={`overflow-hidden transition-all duration-700 ease-in-out ${
                    openIndex === index ? "max-h-40 mt-3" : "max-h-0"
                  }`}
                >
                  <p className="text-xs md:text-sm text-gray-600">
                    {faq.answer}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FaqSection;
