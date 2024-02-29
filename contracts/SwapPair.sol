// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.19;

import "@fhenixprotocol/contracts/FHE.sol";
import {Permissioned, Permission} from "@fhenixprotocol/contracts/access/Permissioned.sol";
import { FHE } from "@fhenixprotocol/contracts/FHE.sol";
import { FHERC20 } from "./FHERC20.sol";
import { IFHERC20 } from "./interfaces/IFHERC20.sol";
import "./libraries/Math.sol";

contract SwapPair is Permissioned, FHERC20{

    uint16 public constant MINIMUM_LIQUIDITY = 1000;

    address public factory;

    FHERC20 public token0;
    FHERC20 public token1;

    euint16 internal reserve0;
    euint16 internal reserve1;

    event Mint(address indexed sender, euint16 amount0, euint16 amount1);
    event Burn(address indexed sender, euint16 amount0, euint16 amount1, address indexed to);
    event Swap(address indexed sender, euint16 amount0Out, euint16 amount1Out, address indexed to);

    constructor() FHERC20("Liquidity Provider Token", "LP") {
        factory = msg.sender;

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

    /// @notice not returning liquidity amount for privacy 
    function mint(address to, euint16 _amount0, euint16 _amount1) external  returns(euint16 liquidity){
        (euint16 _reserve0, euint16 _reserve1) = getReserves();

   
        euint16 amount0 = _amount0;
        euint16 amount1 = _amount1;
        
        ebool isInitialLiquidity = FHE.eq(totalEncryptedSupply, FHE.asEuint16(0));

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
        _update(amount0, amount1);


        // emit Mint(msg.sender, amount0, amount1);
    }

    // function burn(address to) external {
    //     (uint112 _reserve0, uint112 _reserve1,) = getReserves();
    //     address _token0 = token0;                            
    //     address _token1 = token1; 
    //     euint16 balance0 = IFHERC20(_token0).balanceOfEncrypted(address(this));
    //     euint16 balance1 = IFHERC20(_token1).balanceOfEncrypted(address(this));   
    //     euint16 liquidity = IFHERC20(address(this)).balanceOfEncrypted(address(this));
    //     euint16 _totalEncryptedSupply = totalEncryptedSupply;   
    //     euint16 amount0 = FHE.div(FHE.mul(liquidity, balance0), _totalEncryptedSupply);
    //     euint16 amount1 = FHE.div(FHE.mul(liquidity, balance0), _totalEncryptedSupply);
    //     FHE.req(FHE.and(FHE.gt(amount0, FHE.asEuint16(0)), FHE.lt(amount1, FHE.asEuint16(0))));
    //     // can we pass in liquidity like this ?
    //     _burn(address(this), liquidity);
    //     IFHERC20(_token0).transferEncrypted(to, amount0);
    //     IFHERC20(_token1).transferEncrypted(to, amount1);
    //     balance0 = FHERC20(_token0).balanceOfEncrypted(address(this));
    //     balance1 = FHERC20(_token1).balanceOfEncrypted(address(this));
    //     _update(balance0, balance1, _reserve0, _reserve1);
    //     emit Burn(msg.sender, amount0, amount1, to);   
    // }

    function swap(euint16 amount0Out, euint16 amount1Out, address to) external {
        // Ensure at least one output amount is non-zero
        FHE.req(
            FHE.or(
                FHE.ne(amount0Out, FHE.asEuint16(0)),
                FHE.ne(amount1Out, FHE.asEuint16(0))
            )
        ); 
        
        (euint16 _reserve0, euint16 _reserve1) = getReserves();
        FHE.req(FHE.and(FHE.lt(amount0Out, _reserve0), FHE.lt(amount1Out, _reserve1)));  // Ensure output amounts are less than reserves

        // Optimistically transfering tokens (can be moved down if needed)
        token0.transferEncrypted(to, amount0Out); 
        token1.transferEncrypted(to, amount1Out);

       // Fetch current balances
        euint16 balance0 = IFHERC20(token0).balanceOfEncrypted(address(this));
        euint16 balance1 = IFHERC20(token1).balanceOfEncrypted(address(this));   

        // Adjust for output amounts
        balance0 = FHE.sub(balance0, amount0Out);
        balance1 = FHE.sub(balance1, amount1Out);

        // Calculate input amounts
        euint16 amount0In = FHE.select(
            FHE.gt(balance0, FHE.sub(_reserve0, amount0Out)),
            FHE.sub(balance0, FHE.sub(_reserve0, amount0Out)),
            FHE.asEuint16(0)
        );
        euint16 amount1In = FHE.select(
            FHE.gt(balance1, FHE.sub(_reserve1, amount1Out)),
            FHE.sub(balance1, FHE.sub(_reserve1, amount1Out)),
            FHE.asEuint16(0)
        );

        FHE.req(FHE.or(FHE.gt(amount0In, FHE.asEuint16(0)), FHE.gt(amount1In, FHE.asEuint16(0)))); // Ensure at least one input amount is non-zero

        // Enforce the invariant 
        euint16 productBefore = FHE.mul(_reserve0, _reserve1);
        euint16 productAfter = FHE.mul(balance0, balance1);

        FHE.req(FHE.gte(productAfter, productBefore));  // K = reserve0 * reserve1 can only increase after the swap

        // Update reserves
        // _update(balance0, balance1, _reserve0, _reserve1);

        // Emit an event with ciphertext values (still thinking about this)
        emit Swap(msg.sender, amount0Out, amount1Out, to);
    }

    function getReserves() internal view returns (euint16, euint16) {
        return (reserve0, reserve1);
    }

    function getRatios(euint16 amountADesired, euint16 amountBDesired) external view returns (euint16 amountBOptimal, euint16 amountAOptimal) {
        (euint16 _reserve0, euint16 _reserve1) = getReserves();
         ebool isNotZero = FHE.or(reserve0.ne(FHE.asEuint16(0)), reserve1.ne(FHE.asEuint16(0)));
        amountBOptimal = FHE.select(isNotZero, FHE.div(FHE.mul(_reserve1, amountADesired), _reserve0), FHE.asEuint16(0));
        amountAOptimal = FHE.select(isNotZero, FHE.div(FHE.mul(_reserve0, amountBDesired), _reserve1), FHE.asEuint16(0));
    }


    // balances are not used, adjust as needed
    function _update(euint16 _amount0, euint16 _amount1) private {
        reserve0 = reserve0 + _amount0;
        reserve1 = reserve1 + _amount1;

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
