export const dynamic = "force-dynamic";
import TokenPair from "../components/token-pair";

export default function LiquidityPage() {
  return (
    <div className="mt-20">
      <div className="flex flex-col items-center">
        <h1 className="font-semibold text-2xl mb-2">Provide Liquidity</h1>
        <TokenPair type={"liquidity"} />
      </div>
    </div>
  );
}
