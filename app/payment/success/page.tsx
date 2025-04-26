import { redirect } from "next/navigation";
import { SuccessView } from "@/components/payment-flow/success-view";
import { Card, CardContent } from "@/components/ui/card";
import { usePaymentStore } from "@/store/payment";

export default function PaymentSuccessPage() {
  const { invoice, stage } = usePaymentStore();

  if (!invoice || stage !== "success") {
    redirect("/payment/form");
  }

  return (
    <div className="w-full max-w-md mx-auto h-full">
      <Card className="w-full h-full">
        <CardContent className="pt-6">
          <SuccessView />
        </CardContent>
      </Card>
    </div>
  );
}