import * as React from "react";

import { HeroUIProvider, ToastProvider } from "@heroui/react";

import type { Metadata } from "next";
// import localFont from "next/font/local";
import { DM_Sans } from "next/font/google"; // https://nextjs.org/docs/app/getting-started/fonts#google-fonts
// "Next/font/google Fonts are included stored as static assets and served from the same domain as the deployment, meaning no requests are sent to Google by the browser when the user visits your site"
// it improves performance:
// 1. only downloads the font weights the app uses, not the entire library. So the page loads faster.
// 2. no DNS lookups since its bundled in our app
// 3. no layout shift, since the fonts load immediately so there is no flash of fallback text
// improves privacy
// 1. user's browser won't ping google's servers for the font data
import BookingProvider from "../components/context-wrappers/BookingWrapper";
import ClientProviders from "../components/context-wrappers/AuthWrapper";
import "./globals.css";
import Header from "../components/Header";
import TanstackQueryProvider from "@/components/TanstackQueryProvider";
import Bumi from "@/components/Bumi";
import LoadingWrapper from "@/components/LoadingWrapper";

const dmSans = DM_Sans({ subsets: ["latin"], variable: "--font-dm-sans" });
// variable "--font-dm-sans" =  a custom css property we created so we can setup this font in Tailwindcss's config

export const metadata: Metadata = {
  title: "Wipe Right - Professional Cleaning & Home Maintenance Services",
  description:
    "Book reliable cleaning and home maintenance services for your home. From house cleaning to handyman repairs, Wipe Right connects you with trusted professionals in your area.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={` ${dmSans.variable} bg-gray-50 font-sans antialiased`}>
        {/* Step 1. body className={` ${dmSans.variable...}`} === exposes (adds) the css variable "--font-dm-sans" to the DOM,
         so tailwindcss can see and use it, if its setup up within tailwindcss.config.js (the setup in the config: fontFamily: { sans: ["var(--font-dm-sans)"],},)
         Step 2. font-sans === tells Tailwindcss to globally USE the value of that css variable
        
        
        why dmSans.className or dmSans.variable? 
         When we call DM_Sans({ subsets: ["latin"], variable: "--font-dm-sans" }) we're getting an object back
         ex: {
         className: "font-dm-sans_abcafafdasdf1133", <==nextJS automatically creating a css class for that font
         variable: "--font-dm-sans" <=== a custom css property we created so we can setup this font in Tailwindcss's config
          }

          dmSans.className = we're passing the unique css class that next.js automatically generated
          dmSans.variable = we're passing the unique css variable that we made in the DM_Sans() setup to tailwindcss.config ("--font-dm-sans"). We then pass it to tailwindcss by referencing that variable in the fontFamily config inside tailwind.config.js

          Either of the above work. 
          dmSans.variable is a bit cleaner:
          - because we'll see font-dm-sans instead of the long custom css that Next.JS made "font-dm-sans_abcafafdasdf1133"
          - Putting it in tailwind's config makes it easier to keep track of themes

          Using dm.Sans would not work, because react would try to return the entire object "[object object] antialiased"

          Special note: if we make another layout, we'd have to import DM_Sans and pass it to that layouts body as well like we did with this root layout, so tailwindCSS can "see" it for that other layout's pages
         */}
        <ClientProviders>
          <LoadingWrapper>
            <BookingProvider>
              <HeroUIProvider>
                <TanstackQueryProvider>
                  <Header />
                  {/* Toast provider needed for HeroUI toasts. Set defaults for project */}
                  <ToastProvider
                    placement="bottom-center"
                    toastProps={{
                      timeout: 5000,
                      radius: "md",
                      hideCloseButton: false,
                      classNames: {
                        title: "text-white",
                        base: "bg-[#1c1c1c]",
                        closeButton: "opacity-100 absolute right-4 top-2",
                      },
                    }}
                  />
                  <main className="pt-6">{children}</main>
                  <Bumi />
                </TanstackQueryProvider>
              </HeroUIProvider>
            </BookingProvider>
          </LoadingWrapper>
        </ClientProviders>
      </body>
    </html>
  );
}
