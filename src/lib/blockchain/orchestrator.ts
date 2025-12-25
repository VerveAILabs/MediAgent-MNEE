import { ethers } from "ethers";
import MNEE_ABI from "./abi.json";

const RPC_URL = process.env.NEXT_PUBLIC_RPC_URL || "";
const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_MNEE_CONTRACT_ADDRESS || "";
const PRIVATE_KEY = process.env.PRIVATE_KEY || "";

export async function submitClaimToBlockchain(amount: number, claimId: string) {
    if (!RPC_URL || !CONTRACT_ADDRESS || !PRIVATE_KEY) {
        throw new Error("Blockchain configuration missing.");
    }

    const provider = new ethers.JsonRpcProvider(RPC_URL);
    const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
    const contract = new ethers.Contract(CONTRACT_ADDRESS, MNEE_ABI, wallet);

    // Convert amount to Wei (mocking 18 decimals for MNEE/Stablecoin)
    const amountInWei = ethers.parseUnits(amount.toFixed(2), 18);

    try {
        const tx = await contract.submitClaim(amountInWei, claimId);
        console.log("Transaction submitted:", tx.hash);

        return {
            success: true,
            hash: tx.hash,
            status: "PENDING",
        };
    } catch (error) {
        console.error("Blockchain transaction failed:", error);
        throw error;
    }
}

export async function getTransactionReceipt(txHash: string) {
    const provider = new ethers.JsonRpcProvider(RPC_URL);
    const receipt = await provider.getTransactionReceipt(txHash);
    return receipt;
}
