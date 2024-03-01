import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { FhenixClient, EthersProvider } from "fhenixjs";

interface Instance {
  fhenix: FhenixClient | null;
  setFhenix: (fhenix: FhenixClient | null) => void;
  provider: EthersProvider | null;
  setProvider: (provider: EthersProvider | null) => void;
}

export const instanceStore = create(
  persist<Instance>(
    (set) => ({
      fhenix: null,
      setFhenix: (fhenix) => set({ fhenix }),
      provider: null,
      setProvider: (provider) => set({ provider }),
    }),
    {
      name: "Fhenix",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
