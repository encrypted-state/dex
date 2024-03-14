// components/views/liquidity-provsions.tsx
// TODO: this should take in the pool details allow the liquidity provision of only the given pair
"use client";

import React, { useState } from "react";
import { Token, tokens } from "@/lib/tokens";
import { ethers } from "ethers";
import { useAccount } from "wagmi";
import { useEthersSigner } from "@/lib/ethers";
import { routerABI } from "@/abi/routerABI";
import { fherc20ABI } from "@/abi/fherc20ABI";
import { FhenixClient } from "fhenixjs";
import { toast } from "sonner";
import { ConnectButton } from "./connect-button";
import { Button } from "@/app/components/ui/button";
import { Plus } from "lucide-react";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import { Input } from "@/app/components/ui/input";

const routerAddress: string = "0x58295167A9c2fecE5C6C709846EaAdCe3668Ed5F";

const LiquidityTokenCard = ({
  token,
  amount,
  setAmount,
}: {
  token: Token;
  amount: number;
  setAmount: (amount: number) => void;
}) => {
  const tokenImage = token?.image ? `/${token.image}` : undefined;

  return (
    <Card className="dark:bg-zinc-900 dark:border-0">
      <CardHeader className="p-5 pb-1">
        <CardTitle className="text-base font-medium text-zinc-700 dark:text-zinc-300">
          You provide
        </CardTitle>
      </CardHeader>
      <CardContent className="px-5 pb-4">
        <div className="flex flex-row gap-2 pb-2">
          <Input
            className="bg-transparent text-3xl border-0 p-0 focus-visible:ring-0 focus-visible:border-0 focus-visible:outline-none focus-visible:ring-offset-0"
            placeholder="0"
            type="number"
            min={0}
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
          />
          {/* take in the actuall images of pair */}
          <div className="flex items-center">
            {tokenImage && (
              <Image
                src={tokenImage}
                alt={token.symbol}
                width={24}
                height={24}
                className="mr-2"
              />
            )}
            <span>{token?.symbol}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const ProvideLiquidityMiddleButton = () => (
  <div className=" dark:bg-zinc-900 dark:border-zinc-950 dark:border-4 rounded-xl relative -mt-6 h-10 w-10 flex flex-row items-center align-middle justify-center">
    <Plus />
  </div>
);

const LiquidityProvision = () => {
  const [topToken, setTopToken] = useState<Token>(tokens[1]);
  const [bottomToken, setBottomToken] = useState<Token | null>(null);
  const [topTokenAmount, setTopTokenAmount] = useState<number>(0);
  const [bottomTokenAmount, setBottomTokenAmount] = useState<number>(0);

  const { isConnected } = useAccount();
  const signer: any = useEthersSigner();
  const { address } = useAccount();

  const provider = new ethers.BrowserProvider(window.ethereum);
  const fhenix = new FhenixClient({ provider });

  const handleAddLiquidity = async () => {
    try {
      const amountTokenTop = await fhenix.encrypt_uint16(topTokenAmount);
      const amountTokenBottom = await fhenix.encrypt_uint16(bottomTokenAmount);
      const tokenContract1 = {
        contract: new ethers.Contract(
          topToken.address,
          fherc20ABI,
          signer as any,
        ),
        address: topToken.address,
      };
      const tokenContract2 = {
        contract: new ethers.Contract(
          bottomToken!.address,
          fherc20ABI,
          signer as any,
        ),
        address: bottomToken!.address,
      };

      const approve1 = await tokenContract1.contract.approveEncrypted(
        routerAddress,
        amountTokenTop,
      );
      await approve1.wait();

      const approve2 = await tokenContract2.contract.approveEncrypted(
        routerAddress,
        amountTokenBottom,
      );
      await approve2.wait();

      const RouterContract = {
        contract: new ethers.Contract(routerAddress, routerABI, signer as any),
        address: routerAddress,
      };

      toast("Your transaction is pending...");

      const addLiquidity = await RouterContract.contract.addLiquidity(
        topToken.address,
        bottomToken!.address,
        amountTokenTop,
        amountTokenBottom,
        address,
      );
      await addLiquidity.wait();
      toast.success("Successfully added liquidity");
    } catch (error) {
      toast.error("Unable to add liquidity");
      console.error(error);
    }
  };

  return (
    <div className="w-[450px]">
      <LiquidityTokenCard
        token={topToken}
        amount={topTokenAmount}
        setAmount={setTopTokenAmount}
      />

      <div className="w-full  flex flex-row items-center justify-center h-2 pt-2">
        <ProvideLiquidityMiddleButton />
      </div>

      {bottomToken && (
        <LiquidityTokenCard
          token={bottomToken}
          amount={bottomTokenAmount}
          setAmount={setBottomTokenAmount}
        />
      )}

      {isConnected ? (
        <Button
          className="w-full text-base mt-1"
          size={"lg"}
          onClick={handleAddLiquidity}
        >
          Add
        </Button>
      ) : (
        <ConnectButton size={"lg"} className="w-full text-base mt-1" />
      )}
    </div>
  );
};

export default LiquidityProvision;
