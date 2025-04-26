"use client";
import { redirect } from "next/navigation";
import { PaymentForm } from "@/components/payment-flow/payment-form";
import { Card, CardContent } from "@/components/ui/card";

export default function PaymentFormPage() {
  return (
    <div className="w-full max-w-md mx-auto h-full">
      <Card className="w-full h-full">
        <CardContent className="pt-6">
          <PaymentForm onSuccess={() => redirect("/payment/qr-code")} />
        </CardContent>
      </Card>
    </div>
  );
}