"use client"

import { useState } from "react"
import { ArrowLeft, Bitcoin, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Card } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface PayMerchantScreenProps {
  onBack: () => void
}

export default function PayMerchantScreen({ onBack }: PayMerchantScreenProps) {
  const [phoneNumber, setPhoneNumber] = useState("")
  const [amount, setAmount] = useState("")
  const [provider, setProvider] = useState("mtn")
  const [showConfirmation, setShowConfirmation] = useState(false)

  const handlePay = () => {
    setShowConfirmation(true)
  }

  const handleConfirm = () => {
    setTimeout(() => {
      setShowConfirmation(false)
      onBack()
    }, 3000)
  }

  return (
    <div>
      <div className="mb-4 flex items-center">
        <Button variant="ghost" size="icon" onClick={onBack} className="mr-2">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-xl font-bold">Pay Merchant</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="p-6">
          <div className="mb-4">
            <Label className="mb-2 block text-sm font-medium">Mobile Money Provider</Label>
            <RadioGroup value={provider} onValueChange={setProvider} className="flex gap-4">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="mtn" id="mtn" />
                <Label htmlFor="mtn" className="flex items-center gap-2 rounded-md border border-gray-200 px-3 py-2">
                  <div className="h-5 w-5 rounded-full bg-yellow-400"></div>
                  <span>MTN</span>
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="orange" id="orange" />
                <Label htmlFor="orange" className="flex items-center gap-2 rounded-md border border-gray-200 px-3 py-2">
                  <div className="h-5 w-5 rounded-full bg-orange-500"></div>
                  <span>Orange</span>
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div className="mb-4">
            <Label htmlFor="phone" className="mb-2 block text-sm font-medium">
              Merchant Phone Number
            </Label>
            <Input
              id="phone"
              placeholder="Enter merchant's phone number"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
          </div>

          <div className="mb-6">
            <Label htmlFor="amount" className="mb-2 block text-sm font-medium">
              Amount (XAF)
            </Label>
            <Input
              id="amount"
              type="number"
              placeholder="Enter amount in XAF"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
            <div className="mt-2 flex items-center gap-1 text-sm text-gray-500">
              <Bitcoin className="h-4 w-4" />
              <span>≈ {amount ? Number.parseInt(amount) * 27.7 : 0} sats</span>
            </div>
          </div>

          <Button
            onClick={handlePay}
            disabled={!phoneNumber || !amount}
            className="w-full rounded-xl bg-orange-500 py-6 text-lg font-medium text-white hover:bg-orange-600 disabled:bg-gray-300"
          >
            Pay Now
          </Button>

          <p className="mt-4 text-center text-sm text-gray-500">
            The merchant will receive {provider.toUpperCase()} Mobile Money directly to their phone number.
          </p>
        </Card>

        <div className="hidden md:block">
          <Card className="h-full p-6">
            <h2 className="mb-4 text-lg font-semibold">How It Works</h2>
            <div className="space-y-6">
              <div className="flex items-start">
                <div className="mr-3 flex h-10 w-10 items-center justify-center rounded-full bg-purple-100">
                  <span className="font-medium text-purple-600">1</span>
                </div>
                <div>
                  <h3 className="mb-1 font-medium">Enter Merchant Details</h3>
                  <p className="text-sm text-gray-600">
                    Enter the merchant's mobile money number and select their provider (MTN or Orange)
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="mr-3 flex h-10 w-10 items-center justify-center rounded-full bg-purple-100">
                  <span className="font-medium text-purple-600">2</span>
                </div>
                <div>
                  <h3 className="mb-1 font-medium">Specify Amount</h3>
                  <p className="text-sm text-gray-600">
                    Enter the amount in XAF you want to pay. We'll convert it to Bitcoin automatically.
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="mr-3 flex h-10 w-10 items-center justify-center rounded-full bg-purple-100">
                  <span className="font-medium text-purple-600">3</span>
                </div>
                <div>
                  <h3 className="mb-1 font-medium">Instant Payment</h3>
                  <p className="text-sm text-gray-600">
                    We'll convert your Bitcoin to mobile money and send it directly to the merchant's account.
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="mr-3 flex h-10 w-10 items-center justify-center rounded-full bg-purple-100">
                  <span className="font-medium text-purple-600">4</span>
                </div>
                <div>
                  <h3 className="mb-1 font-medium">Confirmation</h3>
                  <p className="text-sm text-gray-600">
                    You'll receive a confirmation once the payment is complete. The merchant gets notified instantly.
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Confirmation Dialog */}
      <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center">Payment Successful!</DialogTitle>
            <DialogDescription className="text-center">Your payment has been processed successfully.</DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center justify-center gap-4 py-6">
            <div className="rounded-full bg-green-100 p-3">
              <CheckCircle2 className="h-12 w-12 text-green-600" />
            </div>
            <div className="text-center">
              <p className="text-xl font-bold">{amount || "1,500"} XAF</p>
              <p className="text-sm text-gray-500">≈ {amount ? Number.parseInt(amount) * 27.7 : 41550} sats</p>
            </div>
            <div className="w-full rounded-lg bg-gray-50 p-4 text-center">
              <p className="text-sm font-medium">Payment sent to:</p>
              <p className="text-lg font-bold">{phoneNumber || "677123456"}</p>
              <p className="text-sm text-gray-500">via {provider.toUpperCase()} Mobile Money</p>
            </div>
            <Button onClick={handleConfirm} className="mt-2 w-full bg-orange-500 hover:bg-orange-600">
              Done
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
