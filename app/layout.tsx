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
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <div className="relative w-full h-screen overflow-hidden bg-[#fefcff] dark:bg-[#3e73db]">
              <div className="absolute inset-0 block dark:hidden bg-[radial-gradient(circle_at_30%_70%,rgba(173,216,230,0.35),transparent_60%),radial-gradient(circle_at_70%_30%,rgba(255,182,193,0.4),transparent_60%)]" />

              <div className="absolute inset-0 hidden dark:block">
                <div className="absolute inset-0 bg-linear-to-br from-[#3e73db] via-[#1a1a2e] to-[#fe3f44] opacity-90" />
                <div className="absolute inset-0 overflow-hidden">
                  <div className="absolute -top-[10%] -left-[10%] w-[600px] h-[600px] bg-[#3e73db] rounded-full mix-blend-overlay blur-[100px] opacity-70 animate-blob" />
                  <div className="absolute top-[20%] -right-[10%] w-[500px] h-[500px] bg-[#fe49ab] rounded-full mix-blend-overlay blur-[100px] opacity-70 animate-blob animation-delay-2000" />
                  <div className="absolute -bottom-[10%] left-[20%] w-[600px] h-[600px] bg-[#fe3f44] rounded-full mix-blend-overlay blur-[100px] opacity-70 animate-blob animation-delay-4000" />
                </div>
              </div>

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
