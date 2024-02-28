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
import { ArrowDown, CheckIcon, ChevronDownIcon, Plus } from "lucide-react";
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/app/components/ui/popover";
import { useState } from "react";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "./ui/command";
import { AvatarFallback, AvatarImage, Avatar } from "./ui/avatar";

const tokens = [
  {
    symbol: "ETH",
    address: "pending",
    image:
      "https://cloudfront-us-east-1.images.arcpublishing.com/coindesk/ZJZZK5B2ZNF25LYQHMUTBTOMLU.png",
  },
  {
    symbol: "DAI",
    address: "pending",
    image:
      "https://cloudfront-us-east-1.images.arcpublishing.com/coindesk/UVVKGPI6U5CDXFAIVCLHODHZ6M.png",
  },
  {
    symbol: "USDC",
    address: "pending",
    image:
      "https://cloudfront-us-east-1.images.arcpublishing.com/coindesk/7ZYCGPG5DFFPJNTEDNPUE75AJY.png",
  },
];

type Token = { symbol: string; address: string; image?: string };

const TokenSelector = ({
  selectedToken,
  onSelectToken,
  excludeToken,
}: {
  selectedToken: Token | null;
  onSelectToken: (token: Token) => void;
  excludeToken: Token | null;
}) => {
  const [open, setOpen] = useState<boolean>(false);
  const filteredTokens = tokens.filter(
    (token) => !excludeToken || token.symbol !== excludeToken.symbol,
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant={selectedToken ? "outline" : "default"}
          size={"sm"}
          className={`w-[180px] rounded-full font-semibold flex justify-between px-2`}
        >
          {selectedToken ? (
            <>
              <Avatar className="w-6 h-6">
                <AvatarImage src={selectedToken.image} />
                <AvatarFallback>{selectedToken.symbol}</AvatarFallback>
              </Avatar>
              {selectedToken.symbol}
            </>
          ) : (
            <span className="ml-1">Select token</span>
          )}
          <ChevronDownIcon size={18} />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[320px] p-0">
        <Command>
          <CommandInput placeholder="Search by token name or address"></CommandInput>
          <CommandList>
            <CommandEmpty>No tokens found.</CommandEmpty>
            <CommandGroup heading="Suggested">
              {filteredTokens.map((token, i) => (
                <CommandItem
                  onSelect={() => {
                    onSelectToken(token);
                    setOpen(false);
                  }}
                  key={i}
                >
                  <Avatar className="w-6 h-6 mr-2">
                    <AvatarImage src={token.image} />
                    <AvatarFallback>{token.symbol}</AvatarFallback>
                  </Avatar>
                  {token.symbol}
                  <CheckIcon
                    className={cn(
                      "ml-auto h-4 w-4",
                      selectedToken === token ? "opacity-100" : "opacity-0",
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

const TokenCard = ({
  type,
  className,
  selectedToken,
  onSelectToken,
  excludeToken,
}: {
  type: "receive" | "pay" | "provide";
  className?: string;
  selectedToken: Token | null;
  onSelectToken: (token: Token) => void;
  excludeToken: Token | null;
}) => (
  <Card className={` dark:bg-zinc-900 dark:border-0 ${className}`}>
    <CardHeader className={`p-5 pb-1`}>
      <CardTitle className="text-base font-medium text-zinc-700 dark:text-zinc-300">
        You {type}
      </CardTitle>
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
            <TokenSelector
              selectedToken={selectedToken}
              onSelectToken={onSelectToken}
              excludeToken={excludeToken}
            />
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

const SwapSwitchButton = ({ onClick }: { onClick: () => void }) => (
  <Button
    className=" dark:bg-zinc-900 dark:border-zinc-950 dark:border-4 rounded-xl relative -mt-6"
    variant="outline"
    size="icon"
    onClick={onClick}
  >
    <ArrowDown />
  </Button>
);

const ProvideLiquidityMiddleButton = () => (
  <div className=" dark:bg-zinc-900 dark:border-zinc-950 dark:border-4 rounded-xl relative -mt-6 h-10 w-10 flex flex-row items-center align-middle justify-center">
    <Plus />
  </div>
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

const TokenPair = ({ type }: { type: "swap" | "liquidity" }) => {
  const [topToken, setTopToken] = useState<Token>(tokens[0]);
  const [bottomToken, setBottomToken] = useState<Token | null>(null);

  const switchTopAndBottomTokens = () => {
    if (!bottomToken) return;
    setTopToken(bottomToken);
    setBottomToken(topToken);
  };

  return (
    <div className="w-[450px]">
      <TokenCard
        type={type === "liquidity" ? "provide" : "pay"}
        selectedToken={topToken}
        onSelectToken={setTopToken}
        excludeToken={bottomToken}
      />

      <div className="w-full  flex flex-row items-center justify-center h-6">
        {type === "swap" ? (
          <SwapSwitchButton onClick={switchTopAndBottomTokens} />
        ) : (
          <ProvideLiquidityMiddleButton />
        )}
      </div>

      <TokenCard
        className="-mt-5"
        type={type === "liquidity" ? "provide" : "receive"}
        selectedToken={bottomToken}
        onSelectToken={setBottomToken}
        excludeToken={topToken}
      />
      <MainButton type={type} />
    </div>
  );
};

export default TokenPair;
