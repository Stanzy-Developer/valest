import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";


export async function POST(request: NextRequest) {
    const url = process.env.EJARA_LNBTC_SANDBOX_URL;

    const {amount, amountCurrency, description} = await request.json();
    const ref = randomUUID();

    try {

        const response = await fetch(`${url}/v1/invoices`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-api-key": process.env.APP_API_KEY!
            },
            body: JSON.stringify({
                amount: amount,
                amountCurrency: amountCurrency,
                description: description,
                reference: ref,
            })
        });

        const data = await response.json();
        
        return NextResponse.json({ success: 200, data: data});
    } catch (error) {
        console.error("Error creating invoice:", error);
        return NextResponse.json({ error: "Failed to create invoice" }, { status: 500 });
    }
}