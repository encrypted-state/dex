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
import { Button } from "../components/ui/button";
import { tokens } from "@/lib/tokens";

import { AvatarImage, Avatar, AvatarFallback } from "../components/ui/avatar";

export default function FaucetPage() {
  return (
    <>
      <h1 className="font-semibold text-2xl mb-2">Fhenix Faucet</h1>
      <Table>
        <TableCaption>A list of available tokens on Fhenix.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[150px]">Asset</TableHead>
            {/* <TableHead>Name</TableHead> */}
            <TableHead>Address</TableHead>
            <TableHead className="w-[100px] text-center"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tokens.map((token, i) => (
            <TableRow key={i}>
              <TableCell className="font-medium w-[150px]">
                <div className="flex flex-row gap-2 items-center">
                  <Avatar className="w-6 h-6">
                    <AvatarImage src={token.image} />
                    <AvatarFallback>{token.symbol}</AvatarFallback>
                  </Avatar>
                  {token.symbol}
                </div>
              </TableCell>
              {/* <TableCell>{t.name}</TableCell> */}
              <TableCell>{token.address}</TableCell>
              <TableCell className="text-center">
                <Button>Mint</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
}
