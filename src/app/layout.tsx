import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
import type { Metadata } from "next";
import NextAuthProvider from "@/lib/context/auth-session-provider";
import Dialogs from "@/app/_components/components-common/dialogs";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import { Suspense } from "react";
import Loader from "./_components/components-common/layout/loader";

export const metadata: Metadata = {
  title: "Truereff – Creator-Brand Collaboration for Affiliate Marketing",
  description:
    "Truereff connects creators and brands for product promotions. Generate CRM links, track commissions, and boost sales through affiliate marketing campaigns.",
  manifest: "/manifest.json",
  themeColor: "#000000",
  keywords: [
    "Truereff",
    "Affiliate Marketing",
    "Brand Collaboration",
    "Creator Marketing",
    "Influencer CRM",
    "Commission Tracking",
    "Sell with Influencers",
    "Product Promotion Platform",
    "Creator Tools",
    "Brand Deals"
  ],
  openGraph: {
    title: "Truereff – Creator x Brand Affiliate Collaboration",
    description:
      "Join Truereff to partner with brands, promote products, and earn commissions. A smart affiliate marketing CRM platform for creators.",
    url: "https://truereff.com", // Replace with your domain
    siteName: "Truereff",
    type: "website",
    images: [
      {
        url: "/web-app-manifest-192x192", // ideally a branded image preview (1200x630)
        width: 1200,
        height: 630,
        alt: "Truereff - Creator Brand Collaboration Platform"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Truereff – Affiliate Marketing for Creators and Brands",
    description:
      "Truereff helps creators monetize through brand collaborations with commission tracking and CRM integration.",
    images: ["/web-app-manifest-192x192"] // use the same image as Open Graph
  },
  icons: {
    icon: "/favicon-96x96.png",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png"
  }
};


export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  try {
    const locale = (await getLocale()) || "en";
    const messages = (await getMessages()) || { locale: "en" };

    return (
      <html lang={locale}>
        <head>
          <title>Truereff</title>
          <link rel="manifest" href="/manifest.json" />
          <link rel="icon" type="image/png" href="/favicon-96x96.png" sizes="96x96" />
          <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
          <link rel="shortcut icon" href="/favicon.ico" />
          <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
          <meta name="theme-color" content="#000000" />
          <link rel="apple-touch-icon" href="/web-app-manifest-192x192.png" />
          {/* <script src="https://checkout.razorpay.com/v1/checkout.js"></script> */}
          <script src="https://sdk.cashfree.com/js/v3/cashfree.js"></script>
          <!-- Meta Pixel Code -->
            <script>
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '1999154744218829');
            fbq('track', 'PageView');
            </script>
            <noscript><img height="1" width="1" style="display:none"
            src="https://www.facebook.com/tr?id=1999154744218829&ev=PageView&noscript=1"
            /></noscript>
        <!-- End Meta Pixel Code -->
        </head>
        <body>
          <Suspense fallback={<Loader />}>
            <NextAuthProvider>
              <NextIntlClientProvider messages={messages}>
                {/* <div className="absolute right-8 top-8">
                  <LocaleSwitcher />
                </div> */}
                {children}
                <Dialogs />
                <Toaster position="top-right" />
              </NextIntlClientProvider>
            </NextAuthProvider>
          </Suspense>
          {/* <InstallButton /> */}
        </body>
      </html>
    );
  } catch (e) {
    return null;
  }
}
