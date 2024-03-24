// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.19;

import {FHE, euint16, ebool} from "@fhenixprotocol/contracts/FHE.sol";
import {Permissioned, Permission} from "@fhenixprotocol/contracts/access/Permissioned.sol";
import {FHERC20} from "./FHERC20.sol";
import {IFHERC20} from "./interfaces/IFHERC20.sol";
import {EpochManager} from "./EpochManager.sol";

contract SwapPair is Permissioned, FHERC20 {

    uint16 public constant MINIMUM_LIQUIDITY = 1000;
    euint16 private ZERO = FHE.asEuint16(0);

    address public factory;
    EpochManager public epochManager;

    FHERC20 public token0;
    FHERC20 public token1;
    euint16 internal reserve0;
    euint16 internal reserve1;

    event Mint(address indexed sender, euint16 amount0, euint16 amount1);
    event Burn(address indexed sender, euint16 amount0, euint16 amount1, address indexed to);
    event Swap(address indexed sender, euint16 amountOut, address indexed to);

    constructor(EpochManager _epochManager) FHERC20("Donut Liquidity Provider", "DLP") {
        factory = msg.sender;
        epochManager = _epochManager;
    }

    function initialize(FHERC20 _token0, FHERC20 _token1) external {
        require(msg.sender == factory, "SwapPair: Not authorized");
        token0 = _token0;
        token1 = _token1;
    }

    function _initialize(address _token0, address _token1) external {
        token0 = FHERC20(_token0);
        token1 = FHERC20(_token1);
    }

    function mint(address to, euint16 _amount0, euint16 _amount1) external  returns(euint16 liquidity){
        (euint16 _reserve0, euint16 _reserve1) = getReserves();

        euint16 amount0 = _amount0;
        euint16 amount1 = _amount1;
        
        ebool isInitialLiquidity = FHE.eq(totalEncryptedSupply, ZERO);

        liquidity = FHE.select(
            isInitialLiquidity, 
            FHE.asEuint16(
                _sqrt(FHE.mul(amount0,amount1))
            ), 
            _min(
                FHE.div(FHE.mul(amount0, totalEncryptedSupply),reserve0), 
                FHE.div(FHE.mul(amount1, totalEncryptedSupply),reserve1)
            )
        );
        // FHE.req(FHE.gt(liquidity, FHE.asEuint16(0)));
        mintEncryptedTo(to, liquidity);
        _update(_reserve0 + amount0, _reserve1 + amount1);

        emit Mint(msg.sender, amount0, amount1);
    }

    function burn(address to, euint16 liquidity) external {
        (euint16 _reserve0, euint16 _reserve1) = getReserves();

        euint16 _totalEncryptedSupply = totalEncryptedSupply;   
        euint16 amount0 = FHE.div(FHE.mul(liquidity, _reserve1), _totalEncryptedSupply);
        euint16 amount1 = FHE.div(FHE.mul(liquidity, _reserve0), _totalEncryptedSupply);

        // FHE.req(FHE.and(FHE.gt(amount0, FHE.asEuint16(0)), FHE.lt(amount1, FHE.asEuint16(0))));
        burnEncryptedTo(to, liquidity);
        token0.transferEncrypted(to, amount0);
        token1.transferEncrypted(to, amount1);
        _update(reserve0 - amount0, _reserve1 - amount1);

        emit Burn(msg.sender, amount0, amount1, to);   
    }

    /// @dev Ensure at least one output amount is non-zero in router
    /// @dev Ensure output amounts are less than reserves in router 
    function swap(euint16 amountOut, address to, bool isToken1Out, euint16 amountIn) external {
        (euint16 _reserve0, euint16 _reserve1) = getReserves();

        // Optimistically transfering tokens 
        if (isToken1Out) {
            token0.transferEncrypted(to, amountOut); 
            _update( _reserve0 + amountIn , _reserve1 - amountOut);
        } else{
            token1.transferEncrypted(to, amountOut);
            _update( _reserve0 - amountOut , _reserve1 + amountIn);
        }  

        // Enforce constant product invariant (k = x * y)
        euint16 balance0 = token0.balanceOfEncrypted(address(this));
        euint16 balance1 = token1.balanceOfEncrypted(address(this));
        euint16 productBefore = FHE.mul(_reserve0, _reserve1);
        euint16 productAfter = FHE.mul(balance0, balance1);
        FHE.req(FHE.gte(productAfter, productBefore)); 

        // List swap for batching
        epochManager.recordSwap(address(this), amountIn, amountOut, isToken1Out);
    
        // Check if the current epoch needs to be settled
        epochManager.settleCurrentEpoch();

        emit Swap(msg.sender, amountOut, to);
    }

    function getReserves() internal view returns (euint16, euint16) {
        return (reserve0, reserve1);
    }

    function getRatios(euint16 amountADesired, euint16 amountBDesired) external view returns (euint16 amountBOptimal, euint16 amountAOptimal) {
        (euint16 _reserve0, euint16 _reserve1) = getReserves();
         ebool isNotZero = FHE.or(reserve0.ne(ZERO), reserve1.ne(ZERO));
        amountBOptimal = FHE.select(isNotZero, FHE.div(FHE.mul(_reserve1, amountADesired), _reserve0), ZERO);
        amountAOptimal = FHE.select(isNotZero, FHE.div(FHE.mul(_reserve0, amountBDesired), _reserve1), ZERO);
    }

    function getAmountOut(euint16 amountIn, address tokenIn) external view returns(euint16 amountOut) {
        amountOut = tokenIn == address(token0) ? 
        FHE.div(FHE.mul(amountIn, reserve1), reserve0.add(amountIn)) : 
        FHE.div(FHE.mul(amountIn, reserve0), reserve1.add(amountIn));
    }


    function _update(euint16 _reserve0, euint16 _reserve1) private {
        reserve0 = _reserve0;
        reserve1 = _reserve1;

    }

    function _sqrt(euint16 _y) private pure returns (uint16 z){
        uint16 y = FHE.decrypt(_y);
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

        function _min(euint16 x,euint16 y) private pure returns (euint16) {
            ebool result = x.lte(y);
        return FHE.select(result,x,y);
        }
}
