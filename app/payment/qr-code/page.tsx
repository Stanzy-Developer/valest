import { redirect } from "next/navigation";
import { QRCode } from "@/components/payment-flow/qr-code";
import { Card, CardContent } from "@/components/ui/card";
import { usePaymentStore } from "@/store/payment";

export default function QRCodePage() {
  const invoice = usePaymentStore(state => state.invoice);

  if (!invoice) {
    redirect("/payment/form");
  }

  return (
    <div className="w-full max-w-md mx-auto h-full">
      <Card className="w-full h-full">
        <CardContent className="pt-6">
          <QRCode onSuccess={() => redirect("/payment/success")} />
        </CardContent>
      </Card>
    </div>
  );
}