import TokenPair from "../token-pair";
import { Card } from "../ui/card";

const Swap = () => {
  return (
    <>
      <Card className="p-4 pb-6">
      <h1 className="font-semibold text-2xl mb-2 text-center">Swap Tokens</h1>
      <TokenPair type={"swap"} />
      </Card>
    </>
  );
};
export default Swap;
