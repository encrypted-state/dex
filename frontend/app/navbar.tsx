"use client";
import { ConnectButton } from "./components/connect-button";
import { ModeToggle } from "./components/mode-toggle";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/app/components/ui/navigation-menu";
import Image from "next/image";

const Navbar = () => {
  return (
    <div id="navbar" className="flex justify-between p-4 mb-6">
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem className="ml-2 mr-2">
            <NavigationMenuLink href="/">
              <Image
                className="relative transform duration-150 hover:scale-110 hover:-rotate-1"
                src="/donut-logo.png"
                alt="Donut Exchange Logo"
                width={65}
                height={65}
                priority
              />
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink
              href={"/swap"}
              className={navigationMenuTriggerStyle()}
            >
              Swap
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink
              href={"/liquidity"}
              className={navigationMenuTriggerStyle()}
            >
              Liquidity
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink
              href="/faucet"
              className={navigationMenuTriggerStyle()}
            >
              Faucet
            </NavigationMenuLink>
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
