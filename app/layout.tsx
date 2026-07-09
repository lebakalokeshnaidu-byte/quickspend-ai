import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/layout/Sidebar";
import { MobileNav } from "@/components/layout/MobileNav";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "QuickSpend AI — Quick-commerce spend tracker",
  description:
    "Track and understand your Blinkit, Zepto, Instamart & BigBasket spending — impulse tax, price creep, and recurring baskets in one dashboard.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="bg-app min-h-screen font-sans">
        <div className="flex min-h-screen">
          <Sidebar />
          <main className="min-w-0 flex-1 px-4 pb-24 pt-6 sm:px-8 sm:pb-8 sm:pt-8 lg:px-10">
            <div className="mx-auto max-w-7xl">{children}</div>
          </main>
        </div>
        <MobileNav />
      </body>
    </html>
  );
}
