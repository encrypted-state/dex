"use client";
import { ConnectKitButton } from "connectkit";
import { Button } from "./ui/button";

export const ConnectButton = () => {
  return (
    <ConnectKitButton.Custom>
      {({
        isConnected,
        isConnecting,
        show,
        hide,
        address,
        ensName,
        chain,
        truncatedAddress,
      }) => {
        return (
          <Button onClick={show} variant={!isConnected ? "default" : "outline"}>
            {isConnected ? ensName ?? truncatedAddress : "Connect Wallet"}
          </Button>
        );
      }}
    </ConnectKitButton.Custom>
  );
};
