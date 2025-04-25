"use client"

import { useState } from "react"
import { Bitcoin, Clock, Mic } from "lucide-react"
import { Button } from "@/components/ui/button"
import HomeScreen from "@/components/home-screen"
import SendScreen from "@/components/send-screen"
import ReceiveScreen from "@/components/receive-screen"
import PayMerchantScreen from "@/components/pay-merchant-screen"
import TransactionHistory from "@/components/transaction-history"

export default function ValestApp() {
  const [currentScreen, setCurrentScreen] = useState("home")

  const renderScreen = () => {
    switch (currentScreen) {
      case "home":
        return <HomeScreen onNavigate={setCurrentScreen} />
      case "send":
        return <SendScreen onBack={() => setCurrentScreen("home")} />
      case "receive":
        return <ReceiveScreen onBack={() => setCurrentScreen("home")} />
      case "pay-merchant":
        return <PayMerchantScreen onBack={() => setCurrentScreen("home")} />
      case "history":
        return <TransactionHistory onBack={() => setCurrentScreen("home")} />
      default:
        return <HomeScreen onNavigate={setCurrentScreen} />
    }
  }

  return (
    <div className="mx-auto max-w-7xl">
      <header className="mb-6 flex items-center justify-between rounded-xl bg-white p-4 shadow-sm">
        <div className="flex items-center">
          <div className="mr-2 flex h-10 w-10 items-center justify-center rounded-full bg-orange-100">
            <Bitcoin className="h-6 w-6 text-orange-500" />
          </div>
          <h1 className="text-xl font-bold">Valest</h1>
        </div>
        {currentScreen === "home" && (
          <Button variant="ghost" size="icon" className="rounded-full" onClick={() => setCurrentScreen("history")}>
            <Clock className="h-5 w-5" />
          </Button>
        )}
      </header>

      <div className="relative">
        {renderScreen()}

        {/* Voice Assistant Floating Button */}
        <div className="fixed bottom-6 right-6 z-10">
          <div className="relative group">
            <Button size="icon" className="h-14 w-14 rounded-full bg-orange-500 shadow-lg hover:bg-orange-600">
              <Mic className="h-6 w-6 text-white" />
            </Button>
            <div className="absolute -top-10 right-0 rounded-md bg-gray-800 px-2 py-1 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100">
              Speak to send money
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
