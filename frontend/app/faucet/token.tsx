"use client";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/app/components/ui/table";
import { AvatarImage, Avatar, AvatarFallback } from "../components/ui/avatar";
import Link from "next/link";
import { Button } from "../components/ui/button";
import { getPermit } from "fhenixjs";
import { useState } from "react";

export default function Token({ token, provider }: any) {
  const [balance, setBalance] = useState<string>("Encrypted");

  async function getEncryptedBalance() {}

  const externalMintUrl = "https://faucet.fhenix.zone/";

  return (
    <TableRow>
      <TableCell className="font-medium w-[140px]">
        <div className="flex flex-row gap-2 items-center">
          <Avatar className="w-6 h-6">
            <AvatarImage src={token.image} />
            <AvatarFallback>{token.symbol}</AvatarFallback>
          </Avatar>
          {token.symbol}
        </div>
      </TableCell>
      <TableCell className="pl-2 w-[110px]">
        {" "}
        <p>
          Balance:{" "}
          {balance == "Encrypted" ? (
            <Button
              className="ml-auto"
              variant="outline"
              onClick={getEncryptedBalance}
            >
              decrypt
            </Button>
          ) : (
            balance
          )}
        </p>
      </TableCell>{" "}
      {/* Adjusted padding and width */}
      <TableCell>{token.address}</TableCell>
      <TableCell className="text-center">
        {token.address === "NATIVE" ? (
          <Link
            href={externalMintUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button>Mint</Button>
          </Link>
        ) : (
          // <Button onClick={handleMint}>Mint</Button>
          <Button
            onClick={async () => {
              const permit = await getPermit(
                "0x853882bb6c8C9B0ACB94d12C8C21E3c3173eec9d",
                provider,
              );
              console.log(permit);
            }}
          >
            Mint
          </Button>
        )}
      </TableCell>
    </TableRow>
  );
}
