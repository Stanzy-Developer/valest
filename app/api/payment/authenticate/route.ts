import { NextResponse } from "next/server";

export async function POST() {
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

    return NextResponse.json(data);

  } catch (error) {
    return NextResponse.json(
      { error: "Failed to authenticate" + error},
      { status: 500 }
    );
  }
}
