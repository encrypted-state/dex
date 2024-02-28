"use client";

import TokenPair from "../components/token-pair";

export default function LiquidityPage() {
  return (
    <>
      <h1 className="font-semibold text-2xl mb-2">Provide Liquidity</h1>
      <TokenPair type={"liquidity"} />
    </>
  );
}
