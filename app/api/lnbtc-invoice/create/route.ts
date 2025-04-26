import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";

export async function POST(request: NextRequest) {
    const sandbox_url = process.env.EJARA_LNBTC_SANDBOX_URL;
    const apiKey = process.env.APP_API_KEY;

    if (!sandbox_url || !apiKey) {
        return NextResponse.json({ error: "Configuration error" }, { status: 500 });
    }

    try {
        const body = await request.json();
        const payload = {
            amount: Number(body.amount),
            amountCurrency: "SATs",
            description: body.description || "Payment description",
            reference: body.reference || randomUUID()
        };

        console.log("Sending payload:", payload);

        const response = await fetch(`${sandbox_url}/api/v1/invoices`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-api-key": apiKey
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error("API Error:", errorData);
            return NextResponse.json(errorData, { status: response.status });
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error("Error creating invoice:", error);
        return NextResponse.json({ 
            error: "Failed to create invoice",
            details: error instanceof Error ? error.message : "Unknown error"
        }, { status: 500 });
    }
}