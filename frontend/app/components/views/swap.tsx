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
import { ArrowDown } from "lucide-react";
import { useAccount } from "wagmi";
import { ConnectButton } from "../connect-button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";

const SwapCard = ({ type }: { type: "receive" | "pay" }) => (
  <Card className={`bg-zinc-900 border-0 ${type === "receive" && "-mt-5"}`}>
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
    className="m-auto bg-zinc-900 border-zinc-950 border-4 rounded-xl -mt-7 mx-auto"
    variant="outline"
    size="icon"
  >
    <ArrowDown />
  </Button>
);

const SwapMainButton = () => {
  const { isConnected } = useAccount();
  return (
    <>
      {isConnected ? (
        <Button className="w-full text-base mt-4" size={"lg"}>
          Swap
        </Button>
      ) : (
        <ConnectButton size={"lg"} className="w-full text-base mt-4" />
      )}
    </>
  );
};

const Swap = () => {
  return (
    <div className="w-[450px]">
      <SwapCard type="pay" />
      <SwapSwitchButton />
      <SwapCard type="receive" />
      <SwapMainButton />
    </div>
  );
};
export default Swap;
