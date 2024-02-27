"use client";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const queryClient = new QueryClient();

const inter = Inter({ subsets: ["latin"] });
import { WagmiProvider } from "wagmi";
import { config } from "@/lib/wagmi-config";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Web3Provider } from "./components/web3-provider";
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <Web3Provider>
        <body className={inter.className}>{children}</body>
      </Web3Provider>
    </html>
  );
}
