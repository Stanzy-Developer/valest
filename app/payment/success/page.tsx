"use client";

import { useRouter } from "next/navigation";
import { SuccessView } from "@/components/payment-flow/success-view";
import { Card, CardContent } from "@/components/ui/card";
import { usePaymentStore } from "@/store/payment";
import { useEffect } from "react";

export default function PaymentSuccessPage() {
  const router = useRouter();
  const { invoice, stage } = usePaymentStore();

  useEffect(() => {
    if (!invoice || stage !== "success") {
      router.replace("/payment/form");
    }
  }, [invoice, stage, router]);

  if (!invoice || stage !== "success") {
    return null; // Don't render anything while redirecting
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
