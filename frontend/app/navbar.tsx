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
import NextLink from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

const Navbar = () => {
  return (
    <div id="navbar" className="flex justify-between p-4 mb-6">
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem className="ml-2 mr-4">
            <Link href="/">
              <Image
                className="relative transform duration-150 hover:scale-110 hover:-rotate-1"
                src="/invisiswap.svg"
                alt="Invisiswap Logo"
                width={60}
                height={36}
                priority
              />
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem>
            {/* <Link href={"/"}> */}
            <NavigationMenuLink
              href={"/"}
              className={navigationMenuTriggerStyle()}
            >
              Swap
            </NavigationMenuLink>
            {/* </Link> */}
          </NavigationMenuItem>
          <NavigationMenuItem>
            {/* <Link href={"/liquidity"}> */}
            <NavigationMenuLink
              href={"/liquidity"}
              className={navigationMenuTriggerStyle()}
            >
              Liquidity
            </NavigationMenuLink>
            {/* </Link> */}
          </NavigationMenuItem>
          <NavigationMenuItem>
            {/* <Link> */}
            <NavigationMenuLink
              href="/faucet"
              className={navigationMenuTriggerStyle()}
            >
              Free Tokens
            </NavigationMenuLink>
            {/* </Link> */}
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
