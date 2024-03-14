// components/pool-card.tsx

import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "./ui/card";
import { tokens } from "@/lib/tokens";

const findTokenImage = (symbol: any) => {
  const token = tokens.find((t) => t.symbol === symbol);
  return token?.image;
};

export type Pool = {
  contractAddress: string;
  tokenSymbols: [string, string];
  tvl: string;
  epochEndsIn: string;
  epoch: string;
  details: string;
};

const PoolCard = ({ pool }: { pool: Pool }) => {
  const router = useRouter();

  const navigateToDetails = () => {
    router.push(`/liquidity/${pool.contractAddress}`);
  };

  const tokenImages = pool.tokenSymbols.map((symbol) => findTokenImage(symbol));

  return (
    <Card
      onClick={navigateToDetails}
      className="cursor-pointer hover:bg-gray-700 transition duration-300 ease-in-out p-4 mb-2 flex flex-col md:flex-row items-center md:items-start"
    >
      <div className="flex">
        {tokenImages.map((image, index) => (
          <div className="relative ml-1 h-10 w-10" key={index}>
            <Image
              src={`/${image}`}
              alt={`${pool.tokenSymbols[index]} icon`}
              layout="fill"
              objectFit="contain"
              className="rounded-full"
            />
          </div>
        ))}
      </div>
      <CardContent className="flex-grow mt-4 md:mt-0 md:ml-4">
        <div className="flex flex-col md:flex-row justify-between items-center w-full">
          <h2 className="text-lg font-bold md:mr-4">{pool.tokenSymbols}</h2>
          <h3 className="text-md md:flex-grow md:text-right">
            TVL since last epoch: {pool.tvl}
          </h3>
          <h3 className="text-md md:flex-grow md:text-right">
            . Add / Remove Liquidity
          </h3>
        </div>
      </CardContent>
    </Card>
  );
};

export default PoolCard;
