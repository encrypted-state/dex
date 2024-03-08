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
        <body className={inter.className}>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            <Navbar />
            <main className="w-full max-w-[800px]  flex flex-col  items-center mx-auto">
              {children}
            </main>
            <Toaster position="top-right" duration={4000}/>
          </ThemeProvider>
        </body>
      </Web3Provider>
    </html>
  );
}
