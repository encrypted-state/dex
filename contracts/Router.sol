// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import { SwapPair } from "./SwapPair.sol";
import { ISwapPair } from "./interfaces/ISwapPair.sol";
import { IFactory } from "./interfaces/IFactory.sol";
import { RouterUtilities } from "./RouterUtilities.sol";

contract Router {
    IFactory factory;

    constructor(address factoryAddress){
        factory = IFactory(factoryAddress);
    }

    function addLiquidity(
        address tokenA, 
        address tokenB, 
        inEuint16 calldata amountADesired,
        inEuint16 calldata amountBDesired,
        inEuint16 calldata amountAMin,
        inEuint16 calldata amountBMin,
        address to
    ) public returns (euint16 amountA, euint16 amountB, euint16 liquidity) { 
        // create new pair if needed
        if (factory.getPair(tokenA, tokenB) == address(0)){
            factory.createPair(tokenA, tokenB);
        }
        (amountA, amountB) = _calculateLiquidity(
            tokenA,
            tokenB,
            amountADesired,
            amountBDesired,
            amountAMin,
            amountBMin
        );
        address pairAddress = RouterUtilities.pairFor(address(factory), tokenA, tokenB);

        // function transferFromEncrypted(address from, address to, euint16 value) external returns (euint16);
        IFHERC20(tokenA).transferFromEncrypted(msg.sender, pairAddress, amountA);
        IFHERC20(tokenB).transferFromEncrypted(msg.sender, pairAddress, amountB);

        // mint LP tokens for user
        liquidity = SwapPair(pairAddress).mint(to);
    }

    // TODO: add FHE
    function _calculateLiquidity(
        address tokenA, 
        address tokenB,
        euint16 amountADesired,
        euint16 amountBDesired,
        euint16 amountAMin,
        euint16 amountBMin
    ) internal view returns (uint256 amountA, uint256 amountB) {
        (uint256 reserveA, uint256 reserveB) = RouterUtilities.getReserves(address(factory), tokenA, tokenB);
        // initial liquidity event, desired liquidity amounts will define the reserves ratio
        if (reserveA == 0 && reserveB == 0) {
            (amountA, amountB) = (amountADesired, amountBDesired);
        // subsequent liquidity events, calculate the optimal amount of tokenA and tokenB to add to pool
        } else {
            uint256 amountBOptimal = RouterUtilities.quote(amountADesired, reserveA, reserveB);
            if (amountBOptimal <= amountBDesired){
                require(amountBOptimal >= amountBMin, "Insufficient B amount");
                (amountA, amountB) = (amountADesired, amountBOptimal);
            } else {
                uint256 amountAOptimal = RouterUtilities.quote(amountBDesired, reserveB, reserveA);
                assert(amountAOptimal <= amountADesired);
                if (amountAOptimal <= amountAMin) revert("Insufficient A amount");
                (amountA, amountB) = (amountAOptimal, amountBDesired);
            }
        }
    }
}