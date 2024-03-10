"use client";
import { ethers } from "ethers";
import { ReactNode, useEffect, useState } from "react";
import { contractStore } from "../../store/contractStore";
import { instanceStore } from "../../store/instanceStore";
import { routerABI } from "@/../abi/routerABI";
import { useAccount } from "wagmi";
import { ConnectButton } from "@/components/connect-button";
import { ExternalProvider } from "@ethersproject/providers";

declare var window: any;
export default function ContractProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [mounted, setMounted] = useState(false);
  const { address } = useAccount();
  const setRouter = contractStore((state) => state.setRouter);
  const setProvider = instanceStore((state) => state.setProvider);
  const setContractAddress = contractStore((state) => state.setContractAddress);

  const HandleContractStore = async () => {
    if (!address) {
      setMounted(true);
      return;
    }

    const routeraddress = "0x58295167A9c2fecE5C6C709846EaAdCe3668Ed5F";
    const provider = new ethers.BrowserProvider(window.ethereum);
    setProvider(provider);
    const signer = await provider.getSigner();

    setContractAddress(routeraddress);
    const router = new ethers.Contract(routeraddress, routerABI, signer);
    setRouter(router);

    setMounted(true);
  };

  useEffect(() => {
    HandleContractStore();
  }, [address]);

  if (mounted) {
    return <>{children}</>;
  } else {
    return <></>;
  }
}
