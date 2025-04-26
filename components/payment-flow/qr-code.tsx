"use client";
import { ArrowRight, Copy, Share2, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePaymentStore } from "@/store/payment";
import { useEffect, useState } from "react";
import { generateQrCodeUrl, formatInvoice } from "@/services/qrcode";
import { sendSMS } from "@/lib/sms";

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
    phoneNumber,
    email,
    motif,
  } = usePaymentStore();

  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);
  const [isQrCodeLoading, setIsQrCodeLoading] = useState(true);
  const [qrCodeError, setQrCodeError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [isSharing, setIsSharing] = useState(false);

  useEffect(() => {
    if (invoice) {
      setIsQrCodeLoading(true);
      setQrCodeError(null);

      try {
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

  const handleCopyInvoice = async () => {
    if (invoice) {
      try {
        await navigator.clipboard.writeText(invoice);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      } catch (err) {
        console.error("Failed to copy:", err);
      }
    }
  };

  const handleShare = async () => {
    if (!navigator.share) return;
    
    setIsSharing(true);
    try {
      await navigator.share({
        title: "Bitcoin Lightning Payment",
        text: `Payment of ${selectedCurrency.symbol}${amount} ${selectedCurrency.code}`,
        url: window.location.href,
      });
    } catch (err) {
      if (err instanceof Error && err.name !== "AbortError") {
        console.error("Failed to share:", err);
      }
    } finally {
      setIsSharing(false);
    }
  };

  async function simulatePayment() {
    if (isProcessing) return;
    setIsProcessing(true);
    
    try {
      const paymentReference = `VLT-${Math.floor(Math.random() * 1000000)}`;
      
      // Envoyer l'email de reçu
      const emailResponse = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          amount,
          currency: selectedCurrency.code,
          currencySymbol: selectedCurrency.symbol,
          phoneNumber,
          reference: paymentReference,
          motif,
          satsAmount,
        }),
      });

      if (!emailResponse.ok) {
        throw new Error('Failed to send email receipt');
      }

      // Envoyer le SMS de confirmation
      if (phoneNumber) {
        await sendSMS(
          "Valest",
          `Payment of ${selectedCurrency.symbol}${amount} ${selectedCurrency.code} was successful! Ref: ${paymentReference}. VALEST`,
          phoneNumber
        );
      }

      setStage("success");
      onSuccess?.();
    } catch (error) {
      console.error("Error processing payment:", error);
      setQrCodeError("Failed to process payment. Please try again.");
    } finally {
      setIsProcessing(false);
    }
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
            onClick={handleShare}
            disabled={!navigator.share || isSharing}
          >
            {isSharing ? (
              <span className="animate-pulse">Sharing...</span>
            ) : (
              <>
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </>
            )}
          </Button>
          <Button
            variant="outline"
            className="flex-1"
            onClick={handleCopyInvoice}
            disabled={isCopied}
          >
            {isCopied ? (
              <span className="text-green-600">Copied!</span>
            ) : (
              <>
                <Copy className="h-4 w-4 mr-2" />
                Copy code
              </>
            )}
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
        <Button 
          className="mt-8 w-full" 
          onClick={simulatePayment}
          disabled={isProcessing}
        >
          {isProcessing ? (
            <div className="flex items-center justify-center">
              <span className="mr-2">Processing payment</span>
              <span className="animate-spin">⚡</span>
            </div>
          ) : (
            <>
              Pay with Valest
              <ArrowRight className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
