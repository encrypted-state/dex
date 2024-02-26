// SPDX-License-Identifier: UNLICENSED

pragma solidity >=0.8.13 <0.9.0;

import "@fhenixprotocol/contracts/FHE.sol";
import {Permissioned, Permission} from "@fhenixprotocol/contracts/access/Permissioned.sol";
import { FHE } from "@fhenixprotocol/contracts/FHE.sol";
import { FhERC20 } from "./FhERC20.sol";

contract SwapPair is Permissioned, FhERC20{
    FhERC20 public immutable token0;
    FhERC20 public immutable token1;

    euint16 internal reserve0;
    euint16 internal reserve1;

    constructor() FhERC20("Liquidity Provider Token", "LP") {
        factory = msg.sender;
    }

    function initialize(FhERC20 _token0, FHERC20 _token1){
        require(msg.sender == factory, "SwapPair: Not authorized");
        token0 = _token0;
        token1 = _token1;
    }

    function mint(address to) private {}

    function burn() {}

    function swap(euint16 amount0Out, euint16 amount1Out, address to) external returns (euint16 amountOut) {}

    function getReserves() internal view returns (euint16, euint16) {
        return (reserve0, reserve1);
    }

    function _update(euint16 _reserve0, euint16 _reserve1) private {
        reserve0 = _reserve0;
        reserve1 = _reserve1;
    }
}
