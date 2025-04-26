"use client";
import { ArrowRight, Copy, Share2, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePaymentStore } from "@/store/payment";
import { useEffect, useState } from "react";
import { generateQrCodeUrl, formatInvoice } from "@/services/qrcode";

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
    amount,
  } = usePaymentStore();

  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);
  const [isQrCodeLoading, setIsQrCodeLoading] = useState(true);
  const [qrCodeError, setQrCodeError] = useState<string | null>(null);

  useEffect(() => {
    if (invoice) {
      setIsQrCodeLoading(true);
      setQrCodeError(null);

      try {
        // Generate QR code URL using our utility function
        const url = generateQrCodeUrl(invoice, 200);
        setQrCodeUrl(url);
      } catch (error) {
        console.error("Error generating QR code:", error);
        setQrCodeError(
          error instanceof Error ? error.message : "Failed to generate QR code"
        );
      } finally {
        setIsQrCodeLoading(false);
      }
    }
  }, [invoice]);

  function simulatePayment() {
    setStage("success");
    onSuccess?.();
  }

  // Format invoice display
  const displayInvoice = invoice ? formatInvoice(invoice, 10, 10) : "";

  return (
    <div>
      <div className="text-center mb-4">
        <h2 className="text-xl font-medium">Lightning Invoice</h2>
        <p className="text-sm text-muted-foreground">
          Scan with your Bitcoin wallet
        </p>
      </div>

      <div className="flex flex-col items-center">
        <div className="border rounded-lg p-6 mb-6 bg-white">
          {isQrCodeLoading ? (
            <div className="w-[180px] h-[180px] flex items-center justify-center bg-muted">
              Loading...
            </div>
          ) : qrCodeUrl ? (
            <img
              src={qrCodeUrl}
              alt="Payment QR Code"
              className="w-[180px] h-[180px]"
              onLoad={() => setIsQrCodeLoading(false)}
              onError={() => {
                console.error("Failed to load QR code image");
                setQrCodeError("Failed to load QR code image");
                setIsQrCodeLoading(false);
              }}
            />
          ) : (
            <div className="w-[180px] h-[180px] flex items-center justify-center bg-muted text-red-500">
              {qrCodeError || "Failed to generate QR code"}
            </div>
          )}
        </div>

        <div className="w-full mb-4 p-3 border rounded-md">
          <div className="text-sm font-medium mb-1">Invoice details:</div>
          <div className="text-xs overflow-hidden text-ellipsis whitespace-nowrap text-muted-foreground">
            {displayInvoice}
            <Button
              variant="outline"
              size="sm"
              className="ml-2 h-6 rounded-full"
              onClick={() => navigator.clipboard.writeText(invoice || "")}
            >
              Copy full invoice
            </Button>
          </div>
          <div className="flex items-center mt-2 text-xs text-muted-foreground">
            <Clock className="h-3 w-3 mr-1" />
            <span>Expires in 15 minutes</span>
          </div>
        </div>

        <div className="flex justify-between w-full gap-2 mt-4">
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => {
              if (navigator.share) {
                navigator.share({
                  title: "Bitcoin Lightning Payment",
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
            onClick={() => navigator.clipboard.writeText(invoice || "")}
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
          Pay with Valest
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
