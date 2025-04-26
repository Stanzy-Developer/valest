import { NextRequest, NextResponse } from "next/server";
import {sendSMS} from "@/lib/sms";

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

export async function POST(req: NextRequest) {
  try {
    const { reference } = await req.json();
    const authToken = await getAuthToken();

    if (!authToken) {
      return NextResponse.json(
        { error: "Authentication failed" },
        { status: 401 }
      );
    }

    const verifyResponse = await fetch(
      `${process.env.EJARA_MOMO_PAYMENT_SANDBOX_URL}/api/v1/transactions/${reference}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${authToken.token}`,
        },
      }
    );

    const verificationData = await verifyResponse.json();

    if (verificationData.data.status === "confirmed") {
      // Send SMS notification
      await sendSMS(
        "ReachDem",
        `You have received ${verificationData.data.amount} ${verificationData.data.currencyCode} has been confirmed.\nValest!`,
        verificationData.data.phoneNumber
      );

      return NextResponse.json(verificationData);
    }

    return NextResponse.json(verificationData);
    
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to verify transaction" },
      { status: 500 }
    );
  }
}



