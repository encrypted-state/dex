// app/liquidity/dummyData.ts
export const dummyPools = [
    {
      contractAddress: "0xdummyaddress1",
      tokenSymbols: ["DAI", "USDC"],
      tvl: "500,000",
      epochEndsIn: "3 days",
      epoch: "Epoch 27",
      details: "DAI and USDC pair"
    },
    {
      contractAddress: "0xdummyaddress2",
      tokenSymbols: ["UNI", "USDC"],
      tvl: "750,000",
      epochEndsIn: "5 days",
      epoch: "Epoch 12",
      details: "UNI and USDC pair"
    },
    {
      contractAddress: "0xdummyaddress3",
      tokenSymbols: ["UNI", "LINK"],
      tvl: "200,000",
      epochEndsIn: "7 days",
      epoch: "Epoch 19",
      details: "UNI and LINK tokens."
    }
  ];
  
  export type Pool = {
    contractAddress: string;
    tokenSymbols: [string, string]; 
    tvl: string;
    epochEndsIn: string;
    epoch: string;
    details: string;
  };