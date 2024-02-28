// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import { SwapPair } from "./SwapPair.sol";
import { ISwapPair } from "./interfaces/ISwapPair.sol";
import { IFactory } from "./interfaces/IFactory.sol";
import { RouterLibrary } from "./RouterLibrary.sol";
import { FHE, euint16, inEuint16, ebool} from "@fhenixprotocol/contracts/FHE.sol";
import { FHERC20 } from "./FHERC20.sol";
import { IFHERC20 } from "./interfaces/IFHERC20.sol";

contract Router {
    IFactory factory;

    constructor(address factoryAddress){
        factory = IFactory(factoryAddress);
    }

    /// @notice not having user specify min amounts
    function addLiquidity(
        address tokenA, 
        address tokenB, 
        inEuint16 calldata amountADesired,
        inEuint16 calldata amountBDesired,
        address to
    ) public returns (euint16 amountA, euint16 amountB, euint16 liquidity) { 
        // create new pair if needed
        if (factory.getPair(tokenA, tokenB) == address(0)){
            factory.createPair(tokenA, tokenB);
        }
        // (amountA, amountB) = (FHE.asEuint16(amountADesired), FHE.asEuint16(amountBDesired));
        (amountA, amountB) = _calculateLiquidity(
            tokenA,
            tokenB,
            FHE.asEuint16(amountADesired),
            FHE.asEuint16(amountBDesired)
            // FHE.asEuint16(amountAMin),
            // FHE.asEuint16(amountBMin)
        );
        address pair = RouterLibrary.pairFor(address(factory), tokenA, tokenB);

        // function transferFromEncrypted(address from, address to, euint16 value) external returns (euint16);
        IFHERC20(tokenA).transferFromEncrypted(msg.sender, pair, amountA);
        IFHERC20(tokenB).transferFromEncrypted(msg.sender, pair, amountB);

        // mint LP tokens for user
        liquidity = ISwapPair(pair).mint(to, amountA, amountB);
    }

    function removeLiquidity(
        address tokenA,
        address tokenB,
        inEuint16 calldata liquidity,
        address to
    ) public returns (euint16 amountA, euint16 amountB) {
        address pair = RouterLibrary.pairFor(address(factory), tokenA, tokenB);
        SwapPair(pair).transferFromEncrypted(msg.sender, pair, liquidity);
        (amountA, amountB) = ISwapPair(pair).burn(to);
    }

    /// @notice Swaps `amountIn` of one token for as much as possible of another token
    function swapExactTokensForTokens() external {}

    function _calculateLiquidity(
        address tokenA, 
        address tokenB,
        euint16 amountADesired,
        euint16 amountBDesired
    ) internal view returns (euint16 amountA, euint16 amountB) {
        euint16 ratio = RouterLibrary.getRatio(factory, tokenA, tokenB);
        ebool isInitialLiquidity = FHE.eq(ratio, FHE.asEuint16(0));

        euint16 amountBOptimal = FHE.mul(amountADesired, ratio);
        euint16 inverseRatio = RouterLibrary.getRatio(factory, tokenB, tokenA);
        euint16 amountAOptimal = FHE.mul(amountBDesired, inverseRatio);

        // Determine if it's the initial liquidity event
        // If it is, use the desired amounts directly
        // If not, use the calculated optimal amounts
        amountA = FHE.select(isInitialLiquidity, amountADesired, amountAOptimal);
        amountB = FHE.select(isInitialLiquidity, amountBDesired, amountBOptimal);

        return (amountA, amountB);
    }
}