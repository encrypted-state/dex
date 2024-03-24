// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.19;

import {FHE, euint16, ebool} from "@fhenixprotocol/contracts/FHE.sol";
import {ISwapPair} from "./interfaces/ISwapPair.sol";

contract EpochManager {
    uint256 public constant MAX_EPOCH_DURATION = 100; // Block amount before force closing open batch
    uint256 public constant MIN_LIQUIDITY_THRESHOLD = 1000;
    uint256 public constant PRIVACY_COEFFICIENT = 10; // A higher PC prioritizes privacy over settlement frequency

    uint256 public currentEpoch;
    uint256 public epochStartBlock;

    struct EpochData {
        uint256 numSwaps;
        euint16 totalVolume;
        uint256 uniqueUsers;
        mapping(address => bool) userParticipated;
    }

    mapping(uint256 epochId => EpochData) public epochSwapData;
    mapping(address pairContract => bool) public registeredPairs;

    event EpochSettled(uint256 indexed epoch, uint256 numSwaps, uint256 uniqueUsers);
    event PairRegistered(address indexed pair);

    constructor() {}

    function registerPair(address pair) external {
        require(!registeredPairs[pair], "EpochManager: PAIR_ALREADY_REGISTERED");
        registeredPairs[pair] = true;
        emit PairRegistered(pair);
    }

    function recordSwap(address user, euint16 amountIn, euint16 amountOut, bool isToken1Out) external {
        require(registeredPairs[msg.sender], "EpochManager: UNAUTHORIZED_PAIR");

        EpochData storage epoch = epochSwapData[currentEpoch];
        epoch.numSwaps++;
        epoch.totalVolume = epoch.totalVolume + amountIn + amountOut;

        if (!epoch.userParticipated[user]) {
            epoch.userParticipated[user] = true;
            epoch.uniqueUsers++;
        }

        if (epochStartBlock == 0) {
            epochStartBlock = block.number;
        }

        // handle bool correctly
        if (shouldSettleEpoch(epoch)) {
            _settleEpoch(currentEpoch);
            currentEpoch++;
            epochStartBlock = 0;
        }
    }

    /// @dev uses encrypted values becasue takes into account volume
    function shouldSettleEpoch(EpochData storage epoch) internal view returns (ebool) {
        euint16 epochDuration = FHE.asEuint16(block.number - epochStartBlock);
        euint16 averageSwapVolume = epoch.numSwaps > 0 ? FHE.div(epoch.totalVolume, FHE.asEuint16(epoch.numSwaps)) : FHE.asEuint16(0);
        euint16 privacyScore = FHE.asEuint16(epoch.uniqueUsers * PRIVACY_COEFFICIENT);

        ebool isEpochDurationExceeded = FHE.gte(epochDuration, FHE.asEuint16(MAX_EPOCH_DURATION));
        ebool isAverageSwapVolumeAboveThreshold = FHE.gte(averageSwapVolume, FHE.asEuint16(MIN_LIQUIDITY_THRESHOLD));
        ebool isPrivacyScoreAboveNumSwaps = FHE.gte(privacyScore, FHE.asEuint16(epoch.numSwaps));

        // returns ebool
        return FHE.or(
            isEpochDurationExceeded,
            FHE.and(isAverageSwapVolumeAboveThreshold, isPrivacyScoreAboveNumSwaps)
        );
    }

    /// @dev needs calculations and token transfers
    /// @dev update token balances, distribute fees, etc
    function _settleEpoch(uint256 epochId) internal {
        EpochData storage epoch = epochSwapData[epochId];

        // Perform settlement calculations and token transfers
        // Update token balances, distribute fees, etc.

        emit EpochSettled(epochId, epoch.numSwaps, epoch.uniqueUsers);
        delete epochSwapData[epochId];
    }
}