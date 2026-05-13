import { ClerkProvider } from "@clerk/nextjs";
import { Geist, Geist_Mono } from "next/font/google";

import "../globals.css";

import LeftSidebar from "@/components/shared/LeftSidebar";
import RightSidebar from "@/components/shared/RightSidebar";
import Bottombar from "@/components/shared/Bottombar";
import Topbar from "@/components/shared/Topbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Threads App",
  description: "Threads clone built with Next.js",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
        <body className="min-h-screen antialiased">
          <Topbar />

          <main className="mx-auto flex w-full max-w-[1800px]">
            <LeftSidebar />

            <section className="main-container flex-1">
              <div className="w-full">{children}</div>
            </section>

            <div className="hidden xl:flex xl:min-w-[320px] xl:max-w-[360px] xl:flex-1">
              <RightSidebar />
            </div>
          </main>

          <Bottombar />
        </body>
      </html>
    </ClerkProvider>
  );
}
