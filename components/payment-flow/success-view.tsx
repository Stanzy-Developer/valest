import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePaymentStore } from "@/store/payment";

export function SuccessView() {
  const { 
    selectedCurrency, 
    dataSource, 
    amount,
    phoneNumber,
    resetPayment
  } = usePaymentStore();

  return (
    <div className="flex flex-col items-center justify-center text-center">
      <div className="mx-auto rounded-full h-24 w-24 bg-green-100 flex items-center justify-center mb-6">
        <CheckCircle2 className="h-12 w-12 text-green-600" />
      </div>

      <h2 className="text-xl font-medium mb-2">Payment successful</h2>

      <div className="w-full my-4 p-3 border rounded-md bg-muted/20">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-muted-foreground">Amount:</span>
          <span className="font-medium">
            {selectedCurrency.symbol}
            {amount} {selectedCurrency.code}
            {dataSource === "fallback" && (
              <span className="ml-1 text-xs text-amber-500">(est.)</span>
            )}
          </span>
        </div>
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-muted-foreground">Sent to:</span>
          <span className="font-medium">{phoneNumber}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">Reference:</span>
          <span className="font-medium">
            VLT-{Math.floor(Math.random() * 1000000)}
          </span>
        </div>
      </div>

      <Button 
        className="mt-4 w-full" 
        onClick={() => {
          resetPayment();
          window.location.href = "/payment/form";
        }}
      >
        Start New Payment
      </Button>
    </div>
  );
}
