import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Poppins } from 'next/font/google';
import { Inter } from 'next/font/google';
import { Toaster } from "@/components/ui/sonner"
import Providers from "./provider";
import Script from 'next/script'

// Configure the font loader
const inter = Inter({
  variable:"--font-inter",
  subsets: ['latin'], // Specifies which subset of glyphs to preload
  display: 'swap', // Controls font loading behavior
});

const poppins = Poppins({
  variable:"--font-poppins",
  subsets: ['latin'],
  // display: 'swap',
  weight: ['400', '700'], // Specify only the weights you need
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Build My Idea",
  description: "BuildMyIdea is a platform where users can post software/app ideas and developers can browse, submit solutions, and collaborate to build them.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${poppins.variable} ${inter.variable} h-full antialiased`}
    >
      <head>
        <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="beforeInteractive" />
      </head>
      <body className="min-h-full flex flex-col">
        <Providers>
          {children}
          <Toaster duration={3000} position="bottom-right"
            // toastOptions={{
            //   classNames: {
            //     toast: "border-2 text-black",
            //     title: " text-lg font-bold",
            //     description:"font-semibold text-black" 
            //   },
            // }}
          />
        </Providers>
      </body>
    </html>
  );
}
