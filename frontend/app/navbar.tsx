"use client";
import Link from "next/link";
import { ConnectButton } from "./components/connect-button";
import { ModeToggle } from "./components/mode-toggle";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
  navigationMenuTriggerStyle,
} from "@/app/components/ui/navigation-menu";

const Navbar = () => {
  return (
    <div id="navbar" className="flex justify-between p-2 mb-6">
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <Link href={"/"}>
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                Swap
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link href={"/liquidity"}>
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                Liquidity
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link href="/faucet">
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                Free Tokens
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
      <div className="gap-2 flex justify-normal">
        <ModeToggle />
        <ConnectButton />
      </div>
    </div>
  );
};
export default Navbar;
