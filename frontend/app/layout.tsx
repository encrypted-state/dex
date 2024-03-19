import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import { ThemeProvider } from "@/app/components/theme-provider";
import { ConnectKitButton } from "connectkit";
const inter = Inter({ subsets: ["latin"] });
import { Web3Provider } from "./components/web3-provider";
import Navbar from "./navbar";
import { ethers } from "ethers";
import { Toaster } from "./components/ui/toaster";
export const metadata: Metadata = {
  title: "Donut",
};
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <Web3Provider>
        <body className={`${inter.className} dark:bg-black bg-white dark:bg-dot-white/[0.2] bg-dot-black/[0.2]`}>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
             <div className="absolute pointer-events-none inset-0 flex items-center justify-center dark:bg-black bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
            <Navbar />
            <main className="relative z-10 w-full max-w-[800px] flex flex-col items-center mx-auto">
              {children}
            </main>
            <Toaster position="top-center" duration={5000} richColors />
          </ThemeProvider>
        </body>
      </Web3Provider>
    </html>
  );
}
