export type Token = {
  symbol: string;
  name: string;
  address: "NATIVE" | `0x${string}`;
  image?: string;
};

export const tokens: Array<Token> = [
  {
    symbol: "tFHE",
    name: "Fhenix Token",
    address: "NATIVE",
    image:
      "fhenix.png",
  },
  {
    symbol: "UNI",
    name: "Uniswap",
    address: "0xA5fB53e25bd4261ce891dcafacbDD00fC26a2F84",
    image:
      "uni.svg",
  },
  {
    symbol: "DAI",
    name: "DAI",
    address: "0x36a37a136AB4e5be83BAcde2847D134E9125E17B",
    image:
      "dai.svg",
  },
  {
    symbol: "USDC",
    name: "USD Coin",
    address: "0xE1724a7da2cE9fCdC1C035c7C7EfEb31e7F121c1",
    image:
      "usdc.svg",
  },
  {
    symbol: "LINK",
    name: "Link",
    address: "0x595263d73F6600F5d0d9C8707b7B2ca3d7916808",
    image:
      "link.svg",
  },
  {
    symbol: "MATIC",
    name: "Polygon",
    address: "0x8c7423c8221c2937d0A11aC3fD62892a88122348",
    image:
      "matic.svg",
  }
];
