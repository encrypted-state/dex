"use client";
import { ConnectButton } from "./components/connect-button";
import { ModeToggle } from "./components/mode-toggle";

const Navbar = () => {
  return (
    <div id="navbar" className="flex justify-end gap-2 p-2 mb-6">
      <ModeToggle />

      <ConnectButton />
    </div>
  );
};
export default Navbar;
