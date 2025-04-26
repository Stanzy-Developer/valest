import { Resend } from "resend"
import { ReceiptEmail } from "@/components/emails/receipt";
import { render } from "@react-email/render";

export async function POST(request: Request) {
    const { 
        email, 
        amount,
        currency,
        currencySymbol,
        phoneNumber,
        reference,
        motif,
        satsAmount 
    } = await request.json();

    const resend = new Resend(process.env.NEXT_PUBLIC_RESEND_API_KEY);
    
    if (!email || !amount || !currency) {
        return new Response("Missing required fields", { status: 400 });
    }
    
    try {
        const emailHtml = await render(
            ReceiptEmail({
                paymentAmount: amount,
                paymentCurrency: currency,
                currencySymbol: currencySymbol,
                recipientPhone: phoneNumber,
                recipientEmail: email,
                paymentReference: reference,
                paymentMotif: motif,
                paymentDate: new Date().toLocaleString(),
                satsAmount: satsAmount,
            })
        );

        await resend.emails.send({
            from: "Valest <valest@updates.reachdem.cc>",
            to: email,
            subject: "VALEST - Confirmation de paiement",
            html: emailHtml,
        });
    
        return new Response("Email sent successfully", { status: 200 });
    } catch (error) {
        console.error("Error sending email:", error);
        return new Response("Failed to send email", { status: 500 });
    }
}
