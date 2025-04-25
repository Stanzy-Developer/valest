"use client"

import { useState } from "react"
import { ArrowLeft, Copy, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"

interface ReceiveScreenProps {
  onBack: () => void
}

export default function ReceiveScreen({ onBack }: ReceiveScreenProps) {
  const [invoice] = useState(
    "lnbc15u1p3xz2n8pp5yztkwjcz5ftl5laxkav9ksjt6wacc8k2c0vay5g2yqnlzkstgsdqqcqzpgxqyz5vqsp5usyc4lk9chsfp53kvcnvq456ganh6heeqqkr2m8mhd9bjzk4eq9q9qyyssqd5jmyznazzxpzav5m6h5yxwdjx9y8nqutmgzwm6jnk3h9f8r3h53kg8xdkg2xnp7z9fhyervq38ptl6xc0aenjz922d5r2dmsp6sp5q9",
  )
  const [amount, setAmount] = useState("50000")

  const handleCopy = () => {
    navigator.clipboard.writeText(invoice)
    toast("Copied to clipboard", {
      description: "The invoice has been copied to your clipboard.",
    })
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: "Valest Payment Request",
        text: "Here's my Valest payment request",
        url: `lightning:${invoice}`,
      })
    } else {
      toast("Share not supported", {
        description: "Your browser doesn't support the share functionality.",
      })
    }
  }

  return (
    <div>
      <div className="mb-4 flex items-center">
        <Button variant="ghost" size="icon" onClick={onBack} className="mr-2">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-xl font-bold">Receive Money</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="flex flex-col items-center justify-center p-6">
          <div className="mb-4 w-full max-w-xs">
            <Label htmlFor="amount" className="mb-2 block text-sm font-medium">
              Amount (sats)
            </Label>
            <Input
              id="amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="mb-1"
            />
            <div className="text-right text-xs text-muted-foreground">≈ {Number(amount) / 27.7} XAF</div>
          </div>

          <div className="mb-6 rounded-xl bg-background p-4 shadow-sm">
            <div className="mb-4 flex justify-center">
              {/* This would be a real QR code in production */}
              <div className="h-64 w-64 rounded-lg bg-background p-2 shadow-sm">
                <div className="flex h-full w-full items-center justify-center rounded bg-muted">
                  <img
                    src="/placeholder.svg?height=240&width=240"
                    alt="Lightning Invoice QR Code"
                    className="h-full w-full"
                  />
                </div>
              </div>
            </div>

            <div className="text-center">
              <p className="mb-1 text-sm font-medium text-muted-foreground">Scan this QR code to pay</p>
              <p className="text-xs text-muted-foreground">This invoice will expire in 15 minutes</p>
            </div>
          </div>

          <div className="mb-4 w-full space-y-3">
            <Button
              onClick={handleCopy}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-4 font-medium text-primary-foreground hover:bg-primary/90"
            >
              <Copy className="h-4 w-4" />
              Copy Invoice
            </Button>

            <Button
              onClick={handleShare}
              variant="outline"
              className="flex w-full items-center justify-center gap-2 rounded-xl py-4 font-medium"
            >
              <Share2 className="h-4 w-4" />
              Share
            </Button>
          </div>
        </Card>

        <div className="hidden md:block">
          <Card className="h-full p-6">
            <h2 className="mb-4 text-lg font-semibold">Receiving Bitcoin</h2>
            <div className="space-y-6">
              <div className="flex items-start">
                <div className="mr-3 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  <span className="font-medium text-primary">1</span>
                </div>
                <div>
                  <h3 className="mb-1 font-medium">Set Amount</h3>
                  <p className="text-sm text-muted-foreground">
                    Enter the amount you want to receive in sats or XAF. The QR code will update automatically.
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="mr-3 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  <span className="font-medium text-primary">2</span>
                </div>
                <div>
                  <h3 className="mb-1 font-medium">Share QR Code</h3>
                  <p className="text-sm text-gray-600">
                    Let the sender scan your QR code with their Bitcoin wallet or Valest app.
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="mr-3 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  <span className="font-medium text-primary">3</span>
                </div>
                <div>
                  <h3 className="mb-1 font-medium">Instant Receipt</h3>
                  <p className="text-sm text-gray-600">
                    Once payment is sent, you'll receive the funds instantly in your Valest wallet.
                  </p>
                </div>
              </div>

              <div className="rounded-lg bg-accent/10 p-4">
                <h3 className="mb-2 font-medium text-accent-foreground">Payment History</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between rounded-md p-2 hover:bg-accent/20">
                    <div className="flex items-center">
                      <div className="mr-2 h-8 w-8 rounded-full bg-muted"></div>
                      <div>
                        <div className="text-sm font-medium">John Doe</div>
                        <div className="text-xs text-muted-foreground">Today, 2:30 PM</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">+15,000 sats</div>
                      <div className="text-xs text-gray-500">+540 XAF</div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between rounded-md p-2 hover:bg-accent/20">
                    <div className="flex items-center">
                      <div className="mr-2 h-8 w-8 rounded-full bg-muted"></div>
                      <div>
                        <div className="text-sm font-medium">Mike Johnson</div>
                        <div className="text-xs text-muted-foreground">Apr 20, 9:20 AM</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">+30,000 sats</div>
                      <div className="text-xs text-gray-500">+1,080 XAF</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
