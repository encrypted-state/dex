"use client";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/app/components/ui/table";
import { useAccount, useClient, useConnect, useWriteContract } from "wagmi";
import { injected } from "wagmi/connectors";
import { Button } from "../components/ui/button";
import { tokens } from "@/lib/tokens";
import { useEthersSigner, useEthersProvider } from "@/lib/ethers";
import { fherc20ABI } from "@/abi/fherc20ABI";
import { FhenixClient, getPermit } from "fhenixjs";

import { AvatarImage, Avatar, AvatarFallback } from "../components/ui/avatar";
import { ethers } from "ethers";
import Token from "./token";

const externalMintUrl = "https://faucet.fhenix.zone/";
export default function FaucetPage() {
  const provider = new ethers.BrowserProvider(window.ethereum);
  const fhenix = new FhenixClient({ provider });

  const { connect } = useConnect();
  const { isConnected } = useAccount();

  // const handleMint = async (tokenAddress: string) => {
  //   if (!isConnected) {
  //     console.log("not connected");
  //     return;
  //   }

  //   // const { writeAsync } = useWriteContract({
  //   //   abi: mockTokenABI;
  //   //   address: 0x853882bb6c8C9B0ACB94d12C8C21E3c3173eec9d,
  //   //   contractInterface: mockTokenABI,
  //   //   functionName: 'mint',
  //   // });

  //   // try {
  //   //   const txReceipt = await writeAsync();
  //   //   console.log('Transaction receipt:', txReceipt);
  //   // } catch (error) {
  //   //   console.error('Error minting tokens:', error);
  //   // }
  // };

  return (
    <>
      <h1 className="font-semibold text-2xl mb-2">Test Assets</h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[140px]">Asset</TableHead>{" "}
            <TableHead className="pl-2 w-[110px]">Balance</TableHead>{" "}
            <TableHead>Address</TableHead>
            <TableHead className="w-[100px] text-center"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tokens.map((token, i) => (
            <Token token={token} provider={provider} key={i} fhenix={fhenix} />
          ))}
        </TableBody>
      </Table>
    </>
  );
}
