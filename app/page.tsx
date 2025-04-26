import { Suspense } from "react";
import PaymentFlow from "@/components/payment-flow";
import { PaymentFlowSkeleton } from "@/components/payment-flow/skeleton";

export default function Home() {
  return (
    <div className="h-screen">
      <main className="h-full">
        <Suspense fallback={<PaymentFlowSkeleton />}>
          <PaymentFlow />
        </Suspense>
      </main>
    </div>
  );
}
