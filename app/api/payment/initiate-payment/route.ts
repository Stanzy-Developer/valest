import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";

async function getAuthToken() {
  try {
    const response = await fetch(
      `${process.env.EJARA_MOMO_PAYMENT_SANDBOX_URL}/api/v1/accounts/authenticate`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "client-secret": process.env.EJARA_MOMO_CLIENT_SECRET!,
          "client-key": process.env.EJARA_MOMO_CLIENT_KEY!,
        },
      }
    );

    const data = await response.json();
    console.log("Authentication response:", data);

    return data.data;

  } catch (error) {
    return NextResponse.json(
      { error: "Failed to authenticate" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const sandbox_url = process.env.EJARA_MOMO_PAYMENT_SANDBOX_URL!;

  if (!sandbox_url) {
    return NextResponse.json({ error: "Configuration error" }, { status: 500 });
  }

  try {
    // Get authentication token
    const authResponse = await getAuthToken();
    const token = authResponse?.accessToken;
    console.log("Token:", token);

    const body = await request.json();

    const response = await fetch(
      `${sandbox_url}/api/v1/transactions/initiate-momo-payment`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
          "client-secret": process.env.EJARA_MOMO_CLIENT_SECRET!,
          "client-key": process.env.EJARA_MOMO_CLIENT_KEY!,
        },
        body: JSON.stringify({
          phoneNumber: body.phoneNumber,
          transactionType: "payin",
          amount: body.amount,
          fullName: body.fullName,
          emailAddress: body.emailAddress,
          currencyCode: body.currencyCode || "XAF",
          countryCode: body.countryCode || "CM",
          paymentMode: body.paymentMode || "OM",
          externalReference: randomUUID(),
          featureCode: "PRO"
        })
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(errorData, { status: response.status });
    }

    const responseData = await response.json();
    return NextResponse.json(responseData);

  } catch (error) {
    console.error("Payment initiation error:", error);
    return NextResponse.json(
      {
        error: "Failed to initiate payment",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}
