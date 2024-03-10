import { create } from "zustand";
import { Router } from "../types/RouterABI";

interface ContractState {
  router: Router | null;
  setRouter: (router: any) => void;
  contractAddress: string | null;
  setContractAddress: (contractAddress: string) => void;
}

export const contractStore = create<ContractState>((set) => ({
  router: null,
  setRouter: (router: Router | null) => set({ router }),
  contractAddress: null,
  setContractAddress: (contractAddress: string) => set({ contractAddress }),
}));
