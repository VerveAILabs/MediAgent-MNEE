import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";
import { adminDb } from "@/lib/firebase/admin";

export async function POST(req: Request) {
    try {
        const { claimId, txHash, status } = await req.json();

        if (!claimId || !txHash) {
            return NextResponse.json({ error: "Missing claimId or txHash" }, { status: 400 });
        }

        const claimRef = adminDb.collection("claims").doc(claimId);
        await claimRef.update({
            txHash,
            status: status || "SETTLED",
            paidAt: new Date(),
        });

        return NextResponse.json({ success: true });

    } catch (error: any) {
        console.error("Record Tx Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
