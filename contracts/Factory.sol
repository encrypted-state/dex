// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import { SwapPair } from "./SwapPair.sol";
import { ISwapPair } from "./interfaces/ISwapPair.sol";

contract Factory {

    mapping(address token0 => mapping(address token1 => address pairContract) ) public getPair;
    address[] public allPairs;

    event PairCreated(address indexed token0, address indexed token1, address pair, uint);

    constructor() {}

    function allPairsLength() external view returns (uint) {
        return allPairs.length;
    }

     /**
     * @dev Creates a new SwapPair with deterministic addresses
     */
    function createPair(address tokenA, address tokenB) external returns (address pair) {
        require(tokenA != tokenB, "Factory: Identical addresses");
        (address token0, address token1) = tokenA < tokenB ? (tokenA, tokenB) : (tokenB, tokenA);
        require(token0 != address(0), 'Factory: Zero address');
        require(getPair[token0][token1] == address(0), 'Factory: Pair exists'); 
        bytes memory bytecode = type(SwapPair).creationCode; 
        bytes32 salt = keccak256(abi.encodePacked(token0, token1));
        assembly {
            pair := create2(0, add(bytecode, 32), mload(bytecode), salt)
        }
        ISwapPair(pair).initialize(token0, token1);
        getPair[token0][token1] = pair;
        getPair[token1][token0] = pair;
        allPairs.push(pair);
        emit PairCreated(token0, token1, pair, allPairs.length);
    }

}