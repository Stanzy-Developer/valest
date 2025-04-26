import { ArrowRight, Copy, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePaymentStore } from "@/store/payment";

interface QRCodeProps {
  onSuccess?: () => void;
}

export function QRCode({ onSuccess }: QRCodeProps) {
  const { 
    invoice, 
    selectedCurrency, 
    satsAmount, 
    dataSource,
    setStage,
    amount 
  } = usePaymentStore();

  function simulatePayment() {
    setStage("success");
    onSuccess?.();
  }

  return (
    <div>
      <div className="text-center mb-4">
        <h2 className="text-xl font-medium">QRCode</h2>
        <p className="text-sm text-muted-foreground">
          Scan with your Bitcoin wallet
        </p>
      </div>

      <div className="flex flex-col items-center">
        <div className="border rounded-lg p-6 mb-6">
          <img
            src="/qr-code-placeholder.png"
            alt="Payment QR Code"
            className="w-[180px] h-[180px]"
          />
        </div>

        <div className="w-full mb-4">
          <div className="text-xs overflow-hidden text-ellipsis whitespace-nowrap text-muted-foreground">
            {invoice}
            <Button
              variant="outline"
              size="sm"
              className="ml-2 h-6 rounded-full"
              onClick={() => navigator.clipboard.writeText(invoice || '')}
            >
              copy code
            </Button>
          </div>
        </div>

        <div className="flex justify-between w-full gap-2 mt-4">
          <Button 
            variant="outline" 
            className="flex-1"
            onClick={() => {
              if (navigator.share) {
                navigator.share({
                  title: 'Payment QR Code',
                  text: `Payment of ${selectedCurrency.symbol}${amount} ${selectedCurrency.code}`,
                  url: window.location.href,
                });
              }
            }}
          >
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
          <Button 
            variant="outline" 
            className="flex-1"
            onClick={() => navigator.clipboard.writeText(invoice || '')}
          >
            <Copy className="h-4 w-4 mr-2" />
            Copy code
          </Button>
        </div>

        {/* Payment Amount Summary */}
        <div className="w-full mt-6 p-3 border rounded-md bg-muted/20">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-muted-foreground">Amount:</span>
            <span className="font-medium">
              {selectedCurrency.symbol}
              {amount} {selectedCurrency.code}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">
              BTC equivalent:
            </span>
            <span className="font-medium">
              {satsAmount.toLocaleString()} SATS
              {dataSource === "fallback" && (
                <span className="ml-1 text-xs text-amber-500">(est.)</span>
              )}
            </span>
          </div>
        </div>

        {/* For demo purposes only */}
        <Button className="mt-8 w-full" onClick={simulatePayment}>
          Simulate Payment
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}