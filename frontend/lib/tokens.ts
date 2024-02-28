export type Token = {
  symbol: string;
  name: string;
  address: "NATIVE" | `0x${string}`;
  image?: string;
};

export const tokens: Array<Token> = [
  {
    symbol: "tFHE",
    name: "Fhenix Tokens",
    address: "NATIVE",
    image:
      "https://cloudfront-us-east-1.images.arcpublishing.com/coindesk/ZJZZK5B2ZNF25LYQHMUTBTOMLU.png",
  },
];
