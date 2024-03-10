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
import { AvatarImage, Avatar, AvatarFallback } from "./ui/avatar";
import Link from "next/link";
import { useAccount } from "wagmi";

import { Button } from "./ui/button";
import { getPermit, FhenixClient } from "fhenixjs";
import { useState, useEffect, useCallback } from "react";
import { fherc20ABI } from "@/abi/fherc20ABI";
import { injected } from "wagmi/connectors";

import { generatePermits } from "@/lib/permits";
import { ethers, formatEther } from "ethers";
import { useEthersSigner } from "@/lib/ethers";

export default function Token({ token }: any) {
  const provider = new ethers.BrowserProvider(window.ethereum);
  const fhenix = new FhenixClient({ provider });

  const [balance, setBalance] = useState<string>("Encrypted");
  const signer = useEthersSigner();
  const { address } = useAccount();

  const getNativeBalance = useCallback(async () => {
    try {
      const balance = await provider.getBalance(address!);
      setBalance(formatEther(balance));
    } catch (error) {
      console.error("Error fetching native balance:", error);
    }
  }, [provider, address, setBalance]);

  useEffect(() => {
    if (token.address === "NATIVE") {
      getNativeBalance();
    }
  }, [token.address, getNativeBalance]);

  async function getEncryptedBalance() {
    const permit = await generatePermits(token.address, provider);
    fhenix.storePermit(permit);
    const permission = await fhenix!.extractPermitPermission(permit!);

    console.log(token.address);
    const contract = {
      contract: new ethers.Contract(token.address, fherc20ABI, signer as any),
      address: token.address,
    };

    const eBalance = await contract.contract.balanceOfSealed(
      address,
      permission,
    );
    const DecryptedBalance = fhenix!.unseal(token.address, eBalance);
    setBalance(String(DecryptedBalance));
  }

  async function handleMint() {
    console.log(token.address);
    console.log(signer);

    const contract = {
      contract: new ethers.Contract(token.address, fherc20ABI, signer as any),
      address: token.address,
    };
    console.log(contract);
    const mintValue = await fhenix.encrypt_uint16(100);
    try {
      const tx = await contract.contract.mintEncrypted(mintValue);
      await tx.wait();
    } catch (error) {
      console.log(error);
    }

    getEncryptedBalance();
  }

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
          {address ? (
            token.address === "NATIVE" ? (
              balance
            ) : balance === "Encrypted" ? (
              <Button
                className="ml-auto"
                variant="outline"
                onClick={getEncryptedBalance}
              >
                decrypt
              </Button>
            ) : (
              balance
            )
          ) : (
            "Connect"
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
          <Button onClick={handleMint}>Mint</Button>
        )}
      </TableCell>
    </TableRow>
  );
}
