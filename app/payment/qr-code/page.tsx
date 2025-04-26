"use client";

import { useRouter } from "next/navigation";
import { QRCode } from "@/components/payment-flow/qr-code";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { usePaymentStore } from "@/store/payment";
import { useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function QRCodePage() {
  const router = useRouter();
  const invoice = usePaymentStore((state) => state.invoice);

  useEffect(() => {
    // Check if invoice is available
    if (!invoice) {
      router.replace("/payment/form");
    }
  }, [invoice, router]);

  // Handle back button click
  const handleBack = () => {
    router.back();
  };

  if (!invoice) {
    return (
      <div className="w-full max-w-md mx-auto h-full">
        <Card className="w-full h-full">
          <CardContent className="pt-6 flex items-center justify-center h-full">
            <div className="text-center">
              <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-muted-foreground">
                Loading payment details...
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto h-full">
      <Card className="w-full h-full">
        <CardHeader className="pb-2">
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 mr-2"
              onClick={handleBack}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <CardTitle className="text-lg">Complete Payment</CardTitle>
              <CardDescription>
                Scan the QR code with your wallet
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-2">
          <QRCode onSuccess={() => router.push("/payment/success")} />
        </CardContent>
      </Card>
    </div>
  );
}
