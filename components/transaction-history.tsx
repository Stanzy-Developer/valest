"use client"

import { useState } from "react"
import { ArrowLeft, ArrowUpRight, ArrowDownLeft, Store, Search, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface TransactionHistoryProps {
  onBack: () => void
}

export default function TransactionHistory({ onBack }: TransactionHistoryProps) {
  const [searchQuery, setSearchQuery] = useState("")

  return (
    <div>
      <div className="mb-4 flex items-center">
        <Button variant="ghost" size="icon" onClick={onBack} className="mr-2">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-xl font-bold">Transaction History</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-12">
        {/* Filters - Left Side on Desktop */}
        <div className="md:col-span-3">
          <Card className="p-4">
            <h2 className="mb-3 text-lg font-medium">Filters</h2>

            <div className="mb-4">
              <label className="mb-1 block text-sm font-medium">Date Range</label>
              <Select defaultValue="all">
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select date range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="week">This Week</SelectItem>
                  <SelectItem value="month">This Month</SelectItem>
                  <SelectItem value="custom">Custom Range</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="mb-4">
              <label className="mb-1 block text-sm font-medium">Transaction Type</label>
              <Select defaultValue="all">
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="sent">Sent</SelectItem>
                  <SelectItem value="received">Received</SelectItem>
                  <SelectItem value="merchant">Merchant Payments</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="mb-4">
              <label className="mb-1 block text-sm font-medium">Amount Range</label>
              <div className="flex items-center gap-2">
                <Input type="number" placeholder="Min" className="w-full" />
                <span>-</span>
                <Input type="number" placeholder="Max" className="w-full" />
              </div>
            </div>

            <Button className="w-full bg-orange-500 hover:bg-orange-600">Apply Filters</Button>
          </Card>
        </div>

        {/* Transactions - Right Side on Desktop */}
        <div className="md:col-span-9">
          <div className="mb-4 flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
              <Input
                placeholder="Search transactions"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Button variant="outline" size="icon" className="md:hidden">
              <Filter className="h-4 w-4" />
            </Button>
          </div>

          <Card>
            <Tabs defaultValue="all" className="w-full">
              <div className="border-b px-4">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="sent">Sent</TabsTrigger>
                  <TabsTrigger value="received">Received</TabsTrigger>
                  <TabsTrigger value="merchant">Merchant</TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="all" className="p-4">
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
                    name="MTN Money (Merchant)"
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
                  <TransactionItem
                    type="merchant"
                    name="Orange Money (Merchant)"
                    amount="12,500"
                    amountXAF="450"
                    time="Apr 15, 11:30 AM"
                  />
                </div>
              </TabsContent>

              <TabsContent value="sent" className="p-4">
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

              <TabsContent value="received" className="p-4">
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

              <TabsContent value="merchant" className="p-4">
                <div className="space-y-3">
                  <TransactionItem
                    type="merchant"
                    name="MTN Money (Merchant)"
                    amount="22,000"
                    amountXAF="792"
                    time="Apr 23, 10:45 AM"
                  />
                  <TransactionItem
                    type="merchant"
                    name="Orange Money (Merchant)"
                    amount="12,500"
                    amountXAF="450"
                    time="Apr 15, 11:30 AM"
                  />
                </div>
              </TabsContent>
            </Tabs>
          </Card>
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
    <div className="flex items-center rounded-lg bg-white p-3 shadow-sm">
      <div className={`mr-3 flex h-10 w-10 items-center justify-center rounded-full ${bgColors[type]}`}>
        {icons[type]}
      </div>
      <div className="flex-1">
        <div className="font-medium">{name}</div>
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
