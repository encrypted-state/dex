"use client";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import { ThemeProvider } from "@/app/components/theme-provider";
import { ConnectKitButton } from "connectkit";
const inter = Inter({ subsets: ["latin"] });
import { Web3Provider } from "./components/web3-provider";
import { ModeToggle } from "./components/mode-toggle";
import { ConnectButton } from "./components/connect-button";
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
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <ConnectButton />
            <ModeToggle />
            {children}
          </ThemeProvider>
        </body>
      </Web3Provider>
    </html>
  );
}
