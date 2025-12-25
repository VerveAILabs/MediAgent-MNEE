// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title MediClaimMNEE
 * @dev Minimal contract for medical claim settlements via MNEE tokens.
 */
contract MediClaimMNEE {
    address public owner;
    
    event PaymentSettled(
        address indexed provider,
        uint256 amount,
        bytes32 indexed documentHash,
        uint256 timestamp
    );

    error OnlyOwner();
    error TransferFailed();

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        if (msg.sender != owner) revert OnlyOwner();
        _;
    }

    /**
     * @notice Settles a medical claim by transferring MNEE (Native ETH for demo) to provider.
     * @param provider The wallet address of the hospital/clinic.
     * @param amount The amount in Wei (or token units).
     * @param documentHash The hash of the claim record stored in Firestore.
     */
    function payProvider(
        address payable provider,
        uint256 amount,
        bytes32 documentHash
    ) external payable onlyOwner {
        // In a real MNEE token scenario, we'd use IERC20(MNEE).transfer(provider, amount);
        // For this demo, we'll use native ETH to simulate the transfer from the reserve.
        
        (bool success, ) = provider.call{value: amount}("");
        if (!success) revert TransferFailed();

        emit PaymentSettled(provider, amount, documentHash, block.timestamp);
    }

    /**
     * @dev Fallback to receive funds into the reserve.
     */
    receive() external payable {}
}
