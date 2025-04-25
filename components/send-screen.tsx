"use client"

import { useState } from "react"
import { ArrowLeft, QrCode, RefreshCw, Fingerprint } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Card } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface SendScreenProps {
  onBack: () => void
}

export default function SendScreen({ onBack }: SendScreenProps) {
  const [recipient, setRecipient] = useState("")
  const [amount, setAmount] = useState("")
  const [isBTC, setIsBTC] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [showBiometric, setShowBiometric] = useState(false)

  const handleSend = () => {
    setShowConfirmation(true)
  }

  const handleConfirm = () => {
    setShowConfirmation(false)
    setShowBiometric(true)
  }

  const handleBiometricConfirm = () => {
    setShowBiometric(false)
    onBack()
  }

  return (
    <div>
      <div className="mb-4 flex items-center">
        <Button variant="ghost" size="icon" onClick={onBack} className="mr-2">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-xl font-bold">Send Money</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="p-6">
          <div className="mb-6">
            <Label htmlFor="recipient" className="mb-2 block text-sm font-medium">
              Recipient
            </Label>
            <div className="relative">
              <Input
                id="recipient"
                placeholder="Enter username or phone number"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                className="pr-10"
              />
              <Button variant="ghost" size="icon" className="absolute right-1 top-1/2 -translate-y-1/2 rounded-full">
                <QrCode className="h-5 w-5 text-gray-500" />
              </Button>
            </div>
          </div>

          <div className="mb-6">
            <div className="mb-2 flex items-center justify-between">
              <Label htmlFor="amount" className="text-sm font-medium">
                Amount
              </Label>
              <div className="flex items-center space-x-2">
                <Label htmlFor="currency-toggle" className="text-xs">
                  {isBTC ? "BTC" : "XAF"}
                </Label>
                <Switch id="currency-toggle" checked={isBTC} onCheckedChange={setIsBTC} />
              </div>
            </div>
            <div className="relative">
              <Input
                id="amount"
                type="number"
                placeholder={isBTC ? "Amount in sats" : "Amount in XAF"}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="pr-10"
              />
              <Button variant="ghost" size="icon" className="absolute right-1 top-1/2 -translate-y-1/2 rounded-full">
                <RefreshCw className="h-4 w-4 text-gray-500" />
              </Button>
            </div>
            <div className="mt-2 text-right text-sm text-gray-500">{isBTC ? "≈ 1,800 XAF" : "≈ 50,000 sats"}</div>
          </div>

          <Button
            onClick={handleSend}
            className="w-full rounded-xl bg-orange-500 py-6 text-lg font-medium text-white hover:bg-orange-600"
          >
            Send Money
          </Button>
        </Card>

        <div className="hidden md:block">
          <Card className="h-full p-6">
            <h2 className="mb-4 text-lg font-semibold">Send Money Tips</h2>
            <ul className="space-y-3">
              <li className="flex items-start">
                <div className="mr-2 mt-0.5 h-5 w-5 rounded-full bg-blue-100 text-center text-blue-600">1</div>
                <p className="text-sm text-gray-600">Enter the recipient's username or scan their QR code</p>
              </li>
              <li className="flex items-start">
                <div className="mr-2 mt-0.5 h-5 w-5 rounded-full bg-blue-100 text-center text-blue-600">2</div>
                <p className="text-sm text-gray-600">Enter the amount you want to send in XAF or BTC</p>
              </li>
              <li className="flex items-start">
                <div className="mr-2 mt-0.5 h-5 w-5 rounded-full bg-blue-100 text-center text-blue-600">3</div>
                <p className="text-sm text-gray-600">Confirm the transaction with your fingerprint</p>
              </li>
              <li className="flex items-start">
                <div className="mr-2 mt-0.5 h-5 w-5 rounded-full bg-blue-100 text-center text-blue-600">4</div>
                <p className="text-sm text-gray-600">The recipient will receive the money instantly</p>
              </li>
            </ul>
            <div className="mt-6 rounded-lg bg-orange-50 p-4">
              <h3 className="mb-2 font-medium text-orange-800">Recent Recipients</h3>
              <div className="space-y-2">
                <div className="flex cursor-pointer items-center rounded-md p-2 hover:bg-orange-100">
                  <div className="mr-2 h-8 w-8 rounded-full bg-gray-200"></div>
                  <span>John Doe</span>
                </div>
                <div className="flex cursor-pointer items-center rounded-md p-2 hover:bg-orange-100">
                  <div className="mr-2 h-8 w-8 rounded-full bg-gray-200"></div>
                  <span>Sarah Smith</span>
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
            <DialogTitle>Confirm Transaction</DialogTitle>
            <DialogDescription>You are about to send money to {recipient || "this recipient"}.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="flex flex-col items-center justify-center gap-2 rounded-lg bg-gray-50 p-4">
              <p className="text-sm text-gray-500">Sending</p>
              <p className="text-2xl font-bold">
                {amount || "50,000"} {isBTC ? "sats" : "XAF"}
              </p>
              <p className="text-sm text-gray-500">≈ {isBTC ? "1,800 XAF" : "50,000 sats"}</p>
            </div>
            <div className="flex flex-col gap-1">
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Recipient</span>
                <span className="text-sm font-medium">{recipient || "John Doe"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Fee</span>
                <span className="text-sm font-medium">1 sat (≈ 0.04 XAF)</span>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowConfirmation(false)}>
              Cancel
            </Button>
            <Button onClick={handleConfirm} className="bg-orange-500 hover:bg-orange-600">
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Biometric Dialog */}
      <Dialog open={showBiometric} onOpenChange={setShowBiometric}>
        <DialogContent className="sm:max-w-md">
          <div className="flex flex-col items-center justify-center gap-4 py-8">
            <Fingerprint className="h-16 w-16 text-orange-500" />
            <DialogTitle>Authenticate Payment</DialogTitle>
            <DialogDescription>Use your fingerprint to confirm this transaction</DialogDescription>
            <Button onClick={handleBiometricConfirm} className="mt-4 bg-orange-500 hover:bg-orange-600">
              Authenticate
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
