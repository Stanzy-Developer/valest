"use client"

import { Bitcoin, ArrowUpRight, ArrowDownLeft, Store } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface HomeScreenProps {
  onNavigate: (screen: string) => void
}

export default function HomeScreen({ onNavigate }: HomeScreenProps) {
  return (
    <div className="grid gap-6 md:grid-cols-12">
      {/* Main Content - Left Side on larger screens, full width on mobile */}
      <div className="md:col-span-8 lg:col-span-9">
        <div className="grid gap-6 md:grid-cols-2">
          {/* Balance Card */}
          <Card className="overflow-hidden rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 p-5 text-white shadow-md md:col-span-2">
            <div className="mb-1 text-sm font-medium opacity-90">Your Balance</div>
            <div className="mb-1 flex items-center">
              <Bitcoin className="mr-2 h-5 w-5" />
              <span className="text-2xl font-bold">125,000 sats</span>
            </div>
            <div className="text-sm opacity-90">≈ 4,500 XAF</div>
          </Card>

          {/* Action Buttons */}
          <div className="grid grid-cols-3 gap-3 md:col-span-2 md:grid-cols-3">
            <Button
              onClick={() => onNavigate("send")}
              className="flex h-auto flex-col items-center gap-2 rounded-xl bg-white p-4 shadow-sm hover:bg-gray-50"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                <ArrowUpRight className="h-6 w-6 text-blue-600" />
              </div>
              <span className="text-sm font-medium">Send</span>
            </Button>

            <Button
              onClick={() => onNavigate("receive")}
              className="flex h-auto flex-col items-center gap-2 rounded-xl bg-white p-4 shadow-sm hover:bg-gray-50"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                <ArrowDownLeft className="h-6 w-6 text-green-600" />
              </div>
              <span className="text-sm font-medium">Receive</span>
            </Button>

            <Button
              onClick={() => onNavigate("pay-merchant")}
              className="flex h-auto flex-col items-center gap-2 rounded-xl bg-white p-4 shadow-sm hover:bg-gray-50"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-100">
                <Store className="h-6 w-6 text-purple-600" />
              </div>
              <span className="text-sm font-medium">Pay Merchant</span>
            </Button>
          </div>

          {/* Recent Activity - Full width on mobile, left column on desktop */}
          <Card className="md:col-span-2">
            <div className="p-4">
              <h2 className="mb-3 text-lg font-bold">Recent Activity</h2>
              <div className="space-y-3">
                <ActivityItem
                  type="received"
                  title="Received from John"
                  amount="15,000"
                  amountXAF="540"
                  time="Today, 2:30 PM"
                />
                <ActivityItem
                  type="sent"
                  title="Sent to Sarah"
                  amount="8,500"
                  amountXAF="306"
                  time="Yesterday, 5:15 PM"
                />
                <ActivityItem
                  type="merchant"
                  title="Paid to MTN Merchant"
                  amount="22,000"
                  amountXAF="792"
                  time="Apr 23, 10:45 AM"
                />
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Transaction History - Right Side on larger screens, below on mobile */}
      <div className="md:col-span-4 lg:col-span-3">
        <Card className="h-full">
          <div className="p-4">
            <h2 className="mb-3 text-lg font-bold">Transaction History</h2>
            <Tabs defaultValue="all" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="sent">Sent</TabsTrigger>
                <TabsTrigger value="received">Received</TabsTrigger>
              </TabsList>
              <TabsContent value="all" className="mt-2">
                <div className="space-y-3">
                  <TransactionItem
                    type="received"
                    name="John Doe"
                    amount="15,000"
                    amountXAF="540"
                    time="Today, 2:30 PM"
                  />
                  <TransactionItem
                    type="sent"
                    name="Sarah Smith"
                    amount="8,500"
                    amountXAF="306"
                    time="Yesterday, 5:15 PM"
                  />
                  <TransactionItem
                    type="merchant"
                    name="MTN Money"
                    amount="22,000"
                    amountXAF="792"
                    time="Apr 23, 10:45 AM"
                  />
                  <TransactionItem
                    type="received"
                    name="Mike Johnson"
                    amount="30,000"
                    amountXAF="1,080"
                    time="Apr 20, 9:20 AM"
                  />
                  <TransactionItem
                    type="sent"
                    name="Emma Wilson"
                    amount="5,000"
                    amountXAF="180"
                    time="Apr 18, 3:45 PM"
                  />
                </div>
              </TabsContent>
              <TabsContent value="sent" className="mt-2">
                <div className="space-y-3">
                  <TransactionItem
                    type="sent"
                    name="Sarah Smith"
                    amount="8,500"
                    amountXAF="306"
                    time="Yesterday, 5:15 PM"
                  />
                  <TransactionItem
                    type="sent"
                    name="Emma Wilson"
                    amount="5,000"
                    amountXAF="180"
                    time="Apr 18, 3:45 PM"
                  />
                </div>
              </TabsContent>
              <TabsContent value="received" className="mt-2">
                <div className="space-y-3">
                  <TransactionItem
                    type="received"
                    name="John Doe"
                    amount="15,000"
                    amountXAF="540"
                    time="Today, 2:30 PM"
                  />
                  <TransactionItem
                    type="received"
                    name="Mike Johnson"
                    amount="30,000"
                    amountXAF="1,080"
                    time="Apr 20, 9:20 AM"
                  />
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </Card>
      </div>
    </div>
  )
}

interface ActivityItemProps {
  type: "sent" | "received" | "merchant"
  title: string
  amount: string
  amountXAF: string
  time: string
}

function ActivityItem({ type, title, amount, amountXAF, time }: ActivityItemProps) {
  const icons = {
    sent: <ArrowUpRight className="h-5 w-5 text-blue-600" />,
    received: <ArrowDownLeft className="h-5 w-5 text-green-600" />,
    merchant: <Store className="h-5 w-5 text-purple-600" />,
  }

  const bgColors = {
    sent: "bg-blue-100",
    received: "bg-green-100",
    merchant: "bg-purple-100",
  }

  return (
    <div className="flex items-center rounded-lg bg-gray-50 p-3">
      <div className={`mr-3 flex h-10 w-10 items-center justify-center rounded-full ${bgColors[type]}`}>
        {icons[type]}
      </div>
      <div className="flex-1">
        <div className="font-medium">{title}</div>
        <div className="text-xs text-gray-500">{time}</div>
      </div>
      <div className="text-right">
        <div className="font-medium">
          {type === "received" ? "+" : "-"} {amount} sats
        </div>
        <div className="text-xs text-gray-500">
          {type === "received" ? "+" : "-"} {amountXAF} XAF
        </div>
      </div>
    </div>
  )
}

interface TransactionItemProps {
  type: "sent" | "received" | "merchant"
  name: string
  amount: string
  amountXAF: string
  time: string
}

function TransactionItem({ type, name, amount, amountXAF, time }: TransactionItemProps) {
  const icons = {
    sent: <ArrowUpRight className="h-4 w-4 text-blue-600" />,
    received: <ArrowDownLeft className="h-4 w-4 text-green-600" />,
    merchant: <Store className="h-4 w-4 text-purple-600" />,
  }

  const bgColors = {
    sent: "bg-blue-100",
    received: "bg-green-100",
    merchant: "bg-purple-100",
  }

  return (
    <div className="flex items-center rounded-lg p-2">
      <div className={`mr-2 flex h-8 w-8 items-center justify-center rounded-full ${bgColors[type]}`}>
        {icons[type]}
      </div>
      <div className="flex-1 overflow-hidden">
        <div className="truncate text-sm font-medium">{name}</div>
        <div className="text-xs text-gray-500">{time}</div>
      </div>
      <div className="text-right text-sm">
        <div className="font-medium">
          {type === "received" ? "+" : "-"} {amount}
        </div>
      </div>
    </div>
  )
}
