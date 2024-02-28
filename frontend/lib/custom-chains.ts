import { type Chain } from "viem";

export const fhenixfrontier: Chain = {
  id: 42069,
  name: "Fhenix Frontier",
  nativeCurrency: {
    decimals: 18,
    name: "Fhenix",
    symbol: "tFHE",
  },
  rpcUrls: {
    default: { http: ["https://api.testnet.fhenix.zone:7747/"] },
  },
  blockExplorers: {
    default: {
      name: "Fhenix Explorer",
      url: "https://explorer.testnet.fhenix.zone/",
    },
  },
  testnet: true,
};
