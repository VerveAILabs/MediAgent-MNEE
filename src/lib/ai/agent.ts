import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || "");

const schema: any = {
    description: "Medical Document Extraction Schema",
    type: SchemaType.OBJECT,
    properties: {
        providerName: {
            type: SchemaType.STRING,
            description: "Name of the medical provider or hospital",
        },
        patientName: {
            type: SchemaType.STRING,
            description: "Name of the patient",
        },
        diagnosisCodes: {
            type: SchemaType.ARRAY,
            items: {
                type: SchemaType.STRING,
            },
            description: "List of ICD-10 diagnosis codes",
        },
        procedures: {
            type: SchemaType.ARRAY,
            items: {
                type: SchemaType.OBJECT,
                properties: {
                    code: { type: SchemaType.STRING },
                    description: { type: SchemaType.STRING },
                    amount: { type: SchemaType.NUMBER },
                },
                required: ["code", "description", "amount"],
            },
            description: "List of procedures performed",
        },
        totalBilledAmount: {
            type: SchemaType.NUMBER,
            description: "Total amount billed by the provider",
        },
        serviceDate: {
            type: SchemaType.STRING,
            description: "Date of service in YYYY-MM-DD format",
        },
    },
    required: ["providerName", "patientName", "totalBilledAmount", "serviceDate"],
};

export async function extractMedicalData(fileBuffer: Buffer, mimeType: string) {
    const model = genAI.getGenerativeModel({
        model: "gemini-2.0-flash",
        generationConfig: {
            responseMimeType: "application/json",
            responseSchema: schema,
        },
    });

    const prompt = "Extract the following details from this medical document. Ensure accuracy of financial amounts and codes.";

    const result = await model.generateContent([
        prompt,
        {
            inlineData: {
                data: fileBuffer.toString("base64"),
                mimeType,
            },
        },
    ]);

    const response = result.response;
    return JSON.parse(response.text());
}

export interface ExtractionResult {
    providerName: string;
    patientName: string;
    diagnosisCodes: string[];
    procedures: {
        code: string;
        description: string;
        amount: number;
    }[];
    totalBilledAmount: number;
    serviceDate: string;
}

export async function validateAndComputePayable(data: ExtractionResult) {
    // 1. Basic Validation
    if (!data.providerName || !data.patientName || data.totalBilledAmount <= 0) {
        throw new Error("Invalid document data: Missing required fields or invalid amount.");
    }

    // 2. Compute Payable (Mock logic: 80% coverage up to $500 max per procedure)
    let totalPayable = 0;
    const validations = [];

    for (const proc of data.procedures) {
        const coverage = 0.8;
        const maxLimit = 500;
        const payableForProc = Math.min(proc.amount * coverage, maxLimit);
        totalPayable += payableForProc;

        validations.push({
            procedure: proc.description,
            billed: proc.amount,
            payable: payableForProc,
            status: "Validated",
        });
    }

    // Ensure total payable doesn't exceed total billed
    totalPayable = Math.min(totalPayable, data.totalBilledAmount);

    return {
        ...data,
        totalPayable,
        validations,
        status: "READY_FOR_PAYMENT",
    };
}
