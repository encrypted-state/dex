// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

interface IFactory {

    function getPair(address token0, address token1) external view returns (address pairContract);
    function allPairs(uint index) external view returns (address pairContract);
    function allPairsLength() external view returns (uint);
    function createPair(address tokenA, address tokenB) external returns (address pair);

    event PairCreated(address indexed token0, address indexed token1, address pair, uint indexed pairIndex);

}
