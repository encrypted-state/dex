export const dynamic = "force-dynamic";
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
import { tokens } from "@/lib/tokens";

import { ethers } from "ethers";
import Token from "../components/token";

export default function FaucetPage() {
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
            <Token token={token} key={i} />
          ))}
        </TableBody>
      </Table>
    </>
  );
}
