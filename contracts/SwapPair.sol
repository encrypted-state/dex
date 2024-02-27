// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.19;

import "@fhenixprotocol/contracts/FHE.sol";
import {Permissioned, Permission} from "@fhenixprotocol/contracts/access/Permissioned.sol";
import { FHE } from "@fhenixprotocol/contracts/FHE.sol";
import { FHERC20 } from "./FHERC20.sol";
import { IFHERC20 } from "./interfaces/IFHERC20.sol";
import { Math } from "./libraries/Math.sol";

contract SwapPair is Permissioned, FHERC20{

    uint16 public constant MINIMUM_LIQUIDITY = 1000;

    address public factory;

    FHERC20 public immutable token0;
    FHERC20 public immutable token1;

    euint16 internal reserve0;
    euint16 internal reserve1;

    // ommiting amounts
    event Mint(address indexed sender);

    constructor() FHERC20("Liquidity Provider Token", "LP") {
        factory = msg.sender;
    }

    function initialize(FHERC20 _token0, FHERC20 _token1) external {
        require(msg.sender == factory, "SwapPair: Not authorized");
        token0 = _token0;
        token1 = _token1;
    }

    /// @notice not returning liquidity amount for privacy 
    function mint(address to) external {
        (euint16 _reserve0, euint16 _reserve1) = getReserves();
        euint16 balance0 = IFHERC20(token0).balanceOfEncrypted(address(this));
        euint16 balance1 = IFHERC20(token1).balanceOfEncrypted(address(this));
   
        euint16 amount0 = FHE.sub(balance0, _reserve0);
        euint16 amount1 = FHE.sub(balance1, _reserve1);

        euint16 liquidity;
        
        ebool isInitialLiquidity = FHE.eq(totalEncryptedSupply, FHE.asEuint32(0));

        liquidity = FHE.select(
            isInitialLiquidity, 
            FHE.asEuint16(
                Math.sqrt(FHE.mul(amount0, amount1)) - MINIMUM_LIQUIDITY
            ), 
            Math.min(
                FHE.mul(amount0, totalEncryptedSupply) / reserve0, 
                FHE.mul(amount1, totalEncryptedSupply) / reserve1
            )
        );
        FHE.req(FHE.gt(liquidity, FHE.asEuint32(0)), "SwapPair: Insufficient liquidity minted");
        _mint(to, liquidity);
        _update(balance0, balance1, _reserve0, _reserve1);

        emit Mint(msg.sender);
    }

    function burn() external {}

    function swap(euint16 amount0Out, euint16 amount1Out, address to) external returns (euint16 amountOut) {}

    function getReserves() internal view returns (euint16, euint16) {
        return (reserve0, reserve1);
    }

    function _update(euint16 balance0, euint16 balance1, euint16 _reserve0, euint16 _reserve1) private {
        reserve0 = _reserve0;
        reserve1 = _reserve1;
    }
}
