// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

import { FHE, euint16, ebool } from "@fhenixprotocol/contracts/FHE.sol";

library Math {
    function sqrt(euint16 y_) private pure returns (uint16 z) {
        uint16 y = FHE.decrypt(y_);
        if (y > 3) {
            z = y;
            uint16 x = y / 2 + 1;
            while (x < z) {
                z = x;
                x = (y / x + x) / 2;
            }
        } else if (y != 0) {
            z = 1;
        }
    }

    function min(euint16 x, euint16 y) private pure returns (euint16) {
        ebool result = x.lte(y);
        return FHE.select(result,x,y);
    }
}

