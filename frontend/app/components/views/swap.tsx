import TokenPair from "../token-pair";

const Swap = () => {
  return (
    <>
      <h1 className="font-semibold text-2xl mb-2 text-center">Swap Tokens</h1>
      <TokenPair type={"swap"} />
    </>
  );
};
export default Swap;
