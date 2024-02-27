"use client";
import { ConnectKitButton } from "connectkit";
import Image from "next/image";
import { useAccount, useEnsName } from "wagmi";
import { Button } from "./components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./components/ui/dropdown-menu";
import { ModeToggle } from "./components/mode-toggle";

export default function Home() {
  return (
    <div>
      <ModeToggle />
    </div>
  );
}
