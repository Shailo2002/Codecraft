import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "react-hot-toast";
import { ThemeProvider } from "./_components/theme-provider";
import Script from "next/script";

const outfit = Outfit({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "CodeCraft",
    template: "%s | CodeCraft",
  },
  description: "AI website builder",
  icons: {
    icon: "/logosymbol.svg",
    shortcut: "/logosymbol.svg",
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    title: "CodeCraft",
    description: "AI website builder",
    url: "https://codecraft.shaileshiitr.site",
    siteName: "CodeCraft",
    images: [
      {
        url: "https://codecraft.shaileshiitr.site/og-image.png",
        width: 1200,
        height: 630,
        alt: "CodeCraft – AI Website Builder",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "CodeCraft",
    description: "AI website builder",
    images: ["https://codecraft.shaileshiitr.site/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={outfit.className}>
        <ClerkProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            <div className="relative w-full h-screen overflow-hidden bg-[#fefcff] dark:bg-transparent">
              {/* Light Mode Background */}
              {/* <div className="absolute inset-0 block dark:hidden bg-[radial-gradient(circle_at_30%_70%,rgba(173,216,230,0.35),transparent_60%),radial-gradient(circle_at_70%_30%,rgba(255,182,193,0.4),transparent_60%)]" /> */}

              {/* Dark Mode Star Background */}
              {/* <div className="absolute inset-0 hidden dark:block star-container">
                <div id="stars" />
                <div id="stars2" />
                <div id="stars3" />
              </div> */}
              <div className="absolute inset-0 star-container">
                <div id="stars" />
                <div id="stars2" />
                <div id="stars3" />
              </div>
              {/* Content */}
              <div className="relative z-10 h-full text-slate-900 dark:text-white transition-colors duration-300">
                <Script
                  src="https://checkout.razorpay.com/v1/checkout.js"
                  strategy="afterInteractive"
                />
                {children}
                <Toaster position="top-right" />
              </div>
            </div>
          </ThemeProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
