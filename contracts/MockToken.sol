// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import { FHE, euint16 } from "@fhenixprotocol/contracts/FHE.sol";
import { FHERC20 } from "./FHERC20.sol";

contract MockToken is FHERC20 {
    uint16 amount;

    constructor(string memory name, string memory symbol, uint16 dripAmount) FHERC20(name, symbol){
        amount = dripAmount;
    }
    
    function mint() public {
         wrap(amount);
    }
    
}