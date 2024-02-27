"use client";
import { Button } from "@/app/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import { Input } from "@/app/components/ui/input";
import { ArrowDown, Plus } from "lucide-react";
import { useAccount } from "wagmi";
import { ConnectButton } from "./connect-button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { cn } from "@/lib/utils";

const TokenButton = () => {
  return (
    <Button variant={"outline"} className="w-24 rounded-full font-bold">
      ETH
    </Button>
  );
};

const TokenCard = ({
  type,
  className,
}: {
  type: "receive" | "pay" | "provide";
  className?: string;
}) => (
  <Card className={` dark:bg-zinc-900 dark:border-0 ${className}`}>
    <CardHeader className={`p-5 pb-1`}>
      <CardTitle className="text-base font-medium">You {type}</CardTitle>
    </CardHeader>
    <CardContent className="px-5 pb-4">
      <div className="flex flex-row gap-2 pb-2">
        <Input
          className="bg-transparent text-3xl border-0 p-0 focus-visible:ring-0 focus-visible:border-0 focus-visible:outline-none focus-visible:ring-offset-0"
          placeholder="0"
          min={0}
        />
        <Dialog>
          <DialogTrigger asChild>
            <TokenButton />
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>tokens</DialogTitle>
              <DialogDescription>tokens</DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </div>
      {/* <p className="p-0 text-sm text-zinc-500">(estimated market value here)</p> */}
    </CardContent>
  </Card>
);

const SwapSwitchButton = () => (
  <Button
    className=" dark:bg-zinc-900 dark:border-zinc-950 dark:border-4 rounded-xl relative -mt-7"
    variant="outline"
    size="icon"
  >
    <ArrowDown />
  </Button>
);

const ProvideLiquidityMiddleButton = () => (
  <Button
    className=" dark:bg-zinc-900 dark:border-zinc-950 dark:border-4 rounded-xl relative -mt-7"
    variant="outline"
    size="icon"
  >
    <Plus />
  </Button>
);

const MainButton = ({ type }: { type: "swap" | "liquidity" }) => {
  const { isConnected } = useAccount();
  return (
    <>
      {isConnected ? (
        <Button className="w-full text-base mt-4" size={"lg"}>
          {type === "swap" ? "Swap" : "Add"}
        </Button>
      ) : (
        <ConnectButton size={"lg"} className="w-full text-base mt-4" />
      )}
    </>
  );
};

const TokenPair = ({ type }: { type: "swap" | "liquidity" }) => (
  <div className="w-[450px]">
    <TokenCard type={type === "liquidity" ? "provide" : "pay"} />
    {type === "swap" ? <SwapSwitchButton /> : <ProvideLiquidityMiddleButton />}

    <TokenCard
      className="-mt-5"
      type={type === "liquidity" ? "provide" : "receive"}
    />
    <MainButton type={type} />
  </div>
);

export default TokenPair;
