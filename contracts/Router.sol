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
        liquidity = SwapPair(pair).mint(to, amountA, amountB);
    }

    function removeLiquidity(
        address tokenA,
        address tokenB,
        inEuint16 calldata liquidity,
        address to
    ) public returns (euint16 amountA, euint16 amountB) {
        address pair = RouterLibrary.pairFor(address(factory), tokenA, tokenB);
        SwapPair(pair).transferFromEncrypted(msg.sender, pair, liquidity);
        // (amountA, amountB) = SwapPair(pair).burn(to);
    }

    /// @notice Swaps `amountIn` of one token for as much as possible of another token
    function swapExactTokensForTokens(
        inEuint16 calldata _amountIn, 
        // inEuint16 calldata _amountOutMin, 
        address[] calldata path, 
        address to
    ) external returns (euint16[] memory amounts) {
        euint16 amountIn = FHE.asEuint16(_amountIn);
        // euint16 amountOutMin = FHE.asEuint16(_amountOutMin);
        amounts = RouterLibrary.getAmountsOut(address(factory), amountIn, path);

        address pair = RouterLibrary.pairFor(address(factory), path[0], path[1]);
        IFHERC20(path[0]).transferFromEncrypted(msg.sender, pair, amountIn);

        // FHE.req(FHE.gte(amounts[amounts.length - 1], amountOutMin)); // Ensure last amount is gte amountOutMin
        _swap(amounts, path, to);  
    }

    function _swap(euint16[] memory amounts, address[] memory path, address to) internal {
        for (uint i = 0; i < path.length - 1; i++) {
            address token0 = path[i];
            address token1 = path[i + 1];
            euint16 amountOut = amounts[i + 1];

            SwapPair pair = SwapPair(RouterLibrary.pairFor(address(factory), token0, token1));

        if (token0 < token1) {
            euint16 amount0Out = FHE.asEuint16(0);
            euint16 amount1Out = amountOut;
            pair.swap(amount0Out, amount1Out, to);
        } else {
            euint16 amount0Out = amountOut;
            euint16 amount1Out = FHE.asEuint16(0);
            pair.swap(amount0Out, amount1Out, to);
        }

        }
    }

    function _calculateLiquidity(
        address tokenA, 
        address tokenB,
        euint16 amountADesired,
        euint16 amountBDesired
    ) internal view returns (euint16 amountA, euint16 amountB) {
        (euint16 amountBOptimal, euint16 amountAOptimal) = RouterLibrary.getRatio(address(factory), tokenA, tokenB, amountADesired, amountBDesired);

        // Determine if it's the initial liquidity event
        // If it is, use the desired amounts directly
        // If not, use the calculated optimal amounts
        amountA = FHE.max(amountADesired, amountAOptimal);
        amountB = FHE.max(amountBDesired, amountBOptimal);

        return (amountA, amountB);
    }
}