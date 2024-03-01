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
import { useAccount, useConnect, useWriteContract } from 'wagmi';
import { injected } from 'wagmi/connectors';
import { Button } from "../components/ui/button";
import { tokens } from "@/lib/tokens";
import { mockTokenABI } from "@/abi/mockTokenABI";

import { AvatarImage, Avatar, AvatarFallback } from "../components/ui/avatar";

const externalMintUrl = "https://faucet.fhenix.zone/";
export default function FaucetPage() {
  // const { connect } = useConnect();
  // const { isConnected } = useAccount();

  // const handleMint = async (tokenAddress: string) => {
  //   if (!isConnected) {
  //     console.log("not connected");
  //     return;
  //   }

  //   const { writeAsync } = useWriteContract({
  //     abi: mockTokenABI;
  //     address: 0x853882bb6c8C9B0ACB94d12C8C21E3c3173eec9d,
  //     contractInterface: mockTokenABI,
  //     functionName: 'mint',
  //   });

  //   try {
  //     const txReceipt = await writeAsync();
  //     console.log('Transaction receipt:', txReceipt);
  //   } catch (error) {
  //     console.error('Error minting tokens:', error);
  //   }
  // };
 
  

  return (
    <>
      <h1 className="font-semibold text-2xl mb-2">Fhenix Faucet</h1>
      <Table>
      <TableHeader>
  <TableRow>
    <TableHead className="w-[140px]">Asset</TableHead> {/* Slightly reduced width */}
    <TableHead className="pl-0 w-[110px]">Balance</TableHead> {/* Reduced left padding, adjusted width */}
    <TableHead>Address</TableHead>
    <TableHead className="w-[100px] text-center"></TableHead>
  </TableRow>
</TableHeader>
<TableBody>
  {tokens.map((token, i) => (
    <TableRow key={i}>
      <TableCell className="font-medium w-[140px]">
        <div className="flex flex-row gap-2 items-center">
          <Avatar className="w-6 h-6">
            <AvatarImage src={token.image} />
            <AvatarFallback>{token.symbol}</AvatarFallback>
          </Avatar>
          {token.symbol}
        </div>
      </TableCell>
      <TableCell className="pl-2 w-[110px]">0</TableCell> {/* Adjusted padding and width */}
      <TableCell>{token.address}</TableCell>
      <TableCell className="text-center">
        {token.address === "NATIVE" ? (
          <Link href={externalMintUrl} target="_blank" rel="noopener noreferrer">
              <Button>Mint</Button>
          </Link>
        ) : (
          // <Button onClick={handleMint}>Mint</Button>
          <Button>Mint</Button>
        )}
      </TableCell>
    </TableRow>
  ))}
</TableBody>

      </Table>
    </>
  );
}

