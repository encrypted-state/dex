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
    address: "0x853882bb6c8C9B0ACB94d12C8C21E3c3173eec9d",
    image:
      "uni.svg",
  },
  {
    symbol: "DAI",
    name: "DAI",
    address: "0xCf094d866D9b9c4E5F4fB64D781b7eAE4e864129",
    image:
      "dai.svg",
  },
  {
    symbol: "USDC",
    name: "USD Coin",
    address: "0x3ceD0dd733A6916BB86FD5080824Dd0079b71C8c",
    image:
      "usdc.svg",
  },
  {
    symbol: "LINK",
    name: "Link",
    address: "0x461628E7B2c1a86B15225cF6ed637C5Fb883BFB1",
    image:
      "link.svg",
  },
  {
    symbol: "MATIC",
    name: "Polygon",
    address: "0x9E2D4f4471D758aF6f7CE5293175B19C2bac710c",
    image:
      "matic.svg",
  }
];
