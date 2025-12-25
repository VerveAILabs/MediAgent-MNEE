import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";
import { adminDb } from "@/lib/firebase/admin";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

export async function POST(req: Request) {
    try {
        const formData = await req.formData();
        const file = formData.get("file") as File;

        if (!file) {
            return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
        }

        const buffer = Buffer.from(await file.arrayBuffer());

        // Gemini Prompt
        const prompt = `
        You are a medical billing analyst.
        Extract structured data from this medical bill.

        Return JSON ONLY with:
        - patientName
        - providerName
        - providerWallet (if found, otherwise null)
        - services [{ name, code, amount }]
        - totalPayable
        - confidenceScore

        Validate JSON before returning.
        `;

        const result = await model.generateContent([
            prompt,
            {
                inlineData: {
                    data: buffer.toString("base64"),
                    mimeType: file.type,
                },
            },
        ]);

        const text = result.response.text();
        const jsonMatch = text.match(/\{[\s\S]*\}/);

        if (!jsonMatch) {
            throw new Error("Failed to extract structured data");
        }

        const extractedData = JSON.parse(jsonMatch[0]);

        // Save to Firestore as a pending claim
        const claimRef = adminDb.collection("claims").doc();
        await claimRef.set({
            ...extractedData,
            status: "PENDING_REVIEW",
            createdAt: new Date(),
            fileType: file.type,
        });

        return NextResponse.json({
            claimId: claimRef.id,
            ...extractedData
        });

    } catch (error: any) {
        console.error("Upload API Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
