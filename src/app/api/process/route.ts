import { NextRequest, NextResponse } from "next/server";
import { extractMedicalData, validateAndComputePayable } from "@/lib/ai/agent";
import { submitClaimToBlockchain } from "@/lib/blockchain/orchestrator";

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const file = formData.get("file") as File;

        if (!file) {
            return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
        }

        const buffer = Buffer.from(await file.arrayBuffer());

        // 1. AI Extraction
        console.log("Starting AI Extraction...");
        const extractedData = await extractMedicalData(buffer, file.type);

        // 2. Validation & Computation
        console.log("Validating and computing payable...");
        const validationResult = await validateAndComputePayable(extractedData);

        // 3. Blockchain Orchestration
        console.log("Submitting to blockchain...");
        const claimId = `claim_${Date.now()}`;
        const blockchainReceipt = await submitClaimToBlockchain(
            validationResult.totalPayable,
            claimId
        );

        return NextResponse.json({
            ...validationResult,
            txHash: blockchainReceipt.hash,
            claimId,
        });
    } catch (error: any) {
        console.error("Processing failed:", error);
        return NextResponse.json(
            { error: error.message || "Internal Server Error" },
            { status: 500 }
        );
    }
}
