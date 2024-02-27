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

const TokenCard = ({
  type,
  className,
}: {
  type: "receive" | "pay" | "provide";
  className?: string;
}) => (
  <Card className={`dark:bg-zinc-900 dark:border-0 ${className}`}>
    <CardHeader>
      <CardTitle className="text-base font-medium ">You {type}</CardTitle>
    </CardHeader>
    <CardContent className="flex flex-row gap-2">
      <Input placeholder="0" type="number" min={0} />
      <Dialog>
        <DialogTrigger asChild>
          <Button variant={"outline"} className="w-24 rounded-full">
            ETH
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>tokens</DialogTitle>
            <DialogDescription>tokens</DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
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
