import { Suspense } from "react";
import PaymentFlow from "@/components/payment-flow";
import { PaymentFlowSkeleton } from "@/components/payment-flow/skeleton";

export const metadata = {
  title: "Valest Payment Demo",
  description:
    "Demo payment flow for Valest mobile money payments via Bitcoin Lightning",
};

export default function DemoPage() {
  return (
    <div className="container max-w-md mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6 text-center">
        Valest Payment Demo
      </h1>

      <Suspense fallback={<PaymentFlowSkeleton />}>
        <PaymentFlow />
      </Suspense>
    </div>
  );
}
