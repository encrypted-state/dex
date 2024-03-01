// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import { SwapPair } from "./SwapPair.sol";
import { ISwapPair } from "./interfaces/ISwapPair.sol";
import { FHE, euint16, inEuint16 } from "@fhenixprotocol/contracts/FHE.sol";
import { Factory } from "./Factory.sol";
import { FHE } from "@fhenixprotocol/contracts/FHE.sol";

/// @notice not sure if FHE disqualifies this as Library, if so make it contract and inherit
/// @notice there is no fee
library RouterUtilities {

    // returns sorted token addresses, used to handle return values from pairs sorted in this order
    function sortTokens(address tokenA, address tokenB) internal pure returns (address token0, address token1) {
        require(tokenA != tokenB, 'UniswapV2Library: IDENTICAL_ADDRESSES');
        (token0, token1) = tokenA < tokenB ? (tokenA, tokenB) : (tokenB, tokenA);
        require(token0 != address(0), 'UniswapV2Library: ZERO_ADDRESS');
    }
    // calculates the CREATE2 address for a pair without making any external calls
    function pairFor(address factory, address tokenA, address tokenB) internal view returns (address pair) {
        (address token0, address token1) = sortTokens(tokenA, tokenB);
        pair = Factory(factory).getPair(token0, token1);
    }

    // fetches and sorts the reserves for a pair
    function getRatio(address factory, address tokenA, address tokenB) internal view returns (euint16 ratio) {
        (address token0,) = sortTokens(tokenA, tokenB);
        (euint16 ratioAB, euint16 ratioBA) = SwapPair(pairFor(factory, tokenA, tokenB)).getRatios();
        ratio = tokenA == token0 ? ratioAB : ratioBA;
    function getReserves(address factoryAddress, address tokenA, address tokenB) internal view returns (euint16 reserveA, euint16 reserveB) {
        (address token0, address token1) = sortTokens(tokenA, tokenB);
        (euint16 reserve0, euint16 reserve1) = ISwapPair(pairFor(factoryAddress, token0, token1)).getReserves();

        // Determine which reserve corresponds to tokenA and tokenB
        (reserveA, reserveB) = tokenA == token0 ? (reserve0, reserve1) : (reserve1, reserve0);
    }

    function quote(euint16 amountIn, euint16 reserveIn, euint16 reserveOut) internal pure returns (euint16 amountOut) {
        FHE.req(FHE.ne(amountIn, FHE.asEuint16(0))); // Ensure amountIn is non-zero
        // Ensure reserveIn and reserveOut are non-zero
        FHE.req(
            FHE.and(
                FHE.ne(reserveIn, FHE.asEuint16(0)),
                FHE.ne(reserveOut, FHE.asEuint16(0))
            )
        ); 
        // Calculate price quote
        euint16 numerator = FHE.mul(amountIn, reserveOut);
        amountOut = FHE.div(numerator, reserveIn);

        return amountOut;
    }

    function getAmountOut(euint16 amountIn, euint16 reserveIn, euint16 reserveOut) internal pure returns (euint16) {
        FHE.req(FHE.ne(amountIn, FHE.asEuint16(0))); // Ensure amountIn is non-zero
        // Ensure reserveIn and reserveOut are non-zero
        FHE.req(
            FHE.and(
                FHE.ne(reserveIn, FHE.asEuint16(0)),
                FHE.ne(reserveOut, FHE.asEuint16(0))
            )
        ); 
        // Calculate the output amount
        amountOut = FHE.div(FHE.mul(amountIn, reserveOut), reserveIn);
        return amountOut;
    }   

    function getAmountsOut(address factory, euint16 amountIn, address[] memory path) internal view returns (euint16[] memory) {
        require(path.length >= 2, "Invalid path length"); // Ensure valid path
        euint16[] memory amounts = new euint16[](path.length);
        amounts[0] = amountIn;
        for (uint i = 0; i < path.length - 1; i++) {
            (euint16 reserve0, euint16 reserve1) = getReserves(factory, path[i], path[i + 1]);
            amounts[i + 1] = getAmountOut(amounts[i], reserve0, reserve1);     
        }
        return amountsOut;
    }

    function getAmountIn(euint16 amountOut, euint16 reserveIn, euint16 reserveOut) internal pure returns (euint16) {
        FHE.req(FHE.ne(amountOut, FHE.asEuint16(0)));
        FHE.req(
            FHE.and(
                FHE.ne(reserveIn, FHE.asEuint16(0)),
                FHE.ne(reserveOut, FHE.asEuint16(0))
            )
        ); 
        euint16 amountIn = FHE.div(FHE.mul(amountOut, reserveIn), reserveOut);
        return amountIn;
    }

    function getAmountsIn(address factory, euint16 amountOut, address[] memory path) internal view returns (euint16[] memory) {
        require(path.length >= 2, "Invalid path");
    
        euint16[] memory amounts = new euint16[](path.length);
        amounts[amounts.length - 1] = amountOut;

        for (uint i = path.length - 1; i > 0; i--) {
            (euint16 reserveIn, euint16 reserveOut) = getReserves(factory, path[i-1], path[i]);
            amounts[i - 1] = getAmountIn(amounts[i], reserveIn, reserveOut);
        }
    
        return amountsIn;
    }

    // compute address of a given pair
    function pairFor(address factoryAddress, address tokenA, address tokenB) internal pure returns (address pairAddress) {
        (address token0, address token1) = sortTokens(tokenA, tokenB);
        pairAddress = address(uint160(uint256(keccak256(abi.encodePacked(
            hex"ff", 
            factoryAddress, 
            keccak256(abi.encodePacked(token0, token1)), 
            keccak256(type(SwapPair).creationCode) 
        )))));
    }

    // formal ordering of token addresses
    function sortTokens(address tokenA, address tokenB) internal pure returns (address token0, address token1) {
        return tokenA < tokenB ? (tokenA, tokenB) : (tokenB, tokenA);
    }
}