// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import { SwapPair } from "./SwapPair.sol";
import { ISwapPair } from "./interfaces/ISwapPair.sol";
import { FHE, euint16, inEuint16 } from "@fhenixprotocol/contracts/FHE.sol";
import { Factory } from "./Factory.sol";

library RouterLibrary {

    // returns sorted token addresses, used to handle return values from pairs sorted in this order
    function sortTokens(address tokenA, address tokenB) internal pure returns (address token0, address token1) {
        require(tokenA != tokenB, 'Router: IDENTICAL_ADDRESSES');
        (token0, token1) = tokenA < tokenB ? (tokenA, tokenB) : (tokenB, tokenA);
        require(token0 != address(0), 'Router: ZERO_ADDRESS');
    }
    // calls factory directly to retreive pair address
    function pairFor(address factory, address tokenA, address tokenB) internal view returns (address pair) {
        (address token0, address token1) = sortTokens(tokenA, tokenB); 
        pair = Factory(factory).getPair(token0, token1);
    }
    
    // fetches and sorts the reserves for a pair
    function getRatio(address factory, address tokenA, address tokenB) internal view returns (euint16 ratio) {
        (address token0,) = sortTokens(tokenA, tokenB);
        (euint16 ratioAB, euint16 ratioBA) = SwapPair(pairFor(factory, tokenA, tokenB)).getRatios();
        ratio = tokenA == token0 ? ratioAB : ratioBA;
    }

    function getAmountsOut(address factory, euint16 amountIn, address[] memory path) internal view returns (euint16[] memory amounts) {
        require(path.length >= 2, "Invalid path length"); // Ensure valid path
        amounts = new euint16[](path.length);
        amounts[0] = amountIn;
        for (uint i = 0; i < path.length - 1; i++) {
            euint16 ratio = getRatio(factory, path[i], path[i] + 1);
            amounts[i + 1] = getAmountOut(amounts[i], ratio);
        }
    } 

    function getAmountOut(euint16 amountIn, euint16 ratio) internal pure returns (euint16) {
        FHE.req(FHE.ne(amountIn, FHE.asEuint16(0))); // Ensure amountIn is non-zero
        FHE.req(FHE.ne(ratio, FHE.asEuint16(0))); // Ensure ratio is non-zero

        // calculate amount out based on ratio
        euint16 amountOut = FHE.mul(amountIn, ratio);
        return amountOut;
    } 
}