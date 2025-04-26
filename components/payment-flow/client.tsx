"use client";

import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { ArrowRight, Copy, Share2, CheckCircle2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  PaymentFormValues,
  CryptoData,
  CoinGeckoResponse,
  Currency,
  currencies,
  paymentFormSchema,
  fallbackCryptoData,
} from "./data";

// Mock QR code image - in a real app would be generated from invoice
const qrCodeUrl =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQAAAAEAAQMAAABmvDolAAAABlBMVEX///8AAABVwtN+AAABH0lEQVR42uyYwY3DMAxEZ0m5cAWuys0oV87iULZx2JPPyyEwAgPrRzSUaZLiy+UeqMoJVAowgJeAAeyBvV4ABvARPkwHuHq9A7R6AaxeAKsXwAzgJTCAvV4ABtDrBbAGCGD1Ali9AFYvgBnAS2AAe70ADKDXC2ANEMDqBbB6AaxeADOAl8AA9noBGECvF8AaIIDVC2D1Ali9AGaAAHu9AAyg1wtgDRDA6gWwegGsXgAzgJfAAPZ6ARhArxfAGiCA1Qtg9QJYvQBmAC+BAez1AjCAXi+ANUAAqxfA6gWwegHMAAHsfv3H97IA+v14qKp6AaxeADOAPf+ALID3fEKmqupvOd7zEZuqqr69mKp6vQDe81GdquprvV4A7/nQj/2DP27k37O6/APwB9ZmUbCKKHfSAAAAAElFTkSuQmCC";

export default function PaymentFlowClient() {
  const [stage, setStage] = useState<"form" | "qrcode" | "success">("form");
  const [invoice, setInvoice] = useState<string | null>(null);
  const [cryptoData, setCryptoData] = useState<CryptoData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [satsAmount, setSatsAmount] = useState<number>(0);
  const [btcPrice, setBtcPrice] = useState<number>(32450.12); // Default BTC price
  const [exchangeRates, setExchangeRates] = useState<Record<string, number>>(
    {}
  );
  const [selectedCurrency, setSelectedCurrency] = useState<Currency>(
    currencies[0]
  );
  const [dataSource, setDataSource] = useState<"real-time" | "fallback">(
    "real-time"
  );

  const form = useForm<PaymentFormValues>({
    resolver: zodResolver(paymentFormSchema),
    defaultValues: {
      amount: "20000",
      currency: "XAF",
      phoneNumber: "",
      motif: "",
      email: "",
    },
  });

  // Update selected currency when currency field changes
  useEffect(() => {
    const currencyValue = form.watch("currency");
    const newCurrency =
      currencies.find((c) => c.code === currencyValue) || currencies[0];
    setSelectedCurrency(newCurrency);
  }, [form.watch("currency")]);

  // Fetch exchange rates
  useEffect(() => {
    const fetchExchangeRates = async () => {
      try {
        // Note: For production, replace with your actual API key from https://exchangeratesapi.io/
        // Free alternatives: https://open.er-api.com/v6/latest/USD or https://api.exchangerate.host/latest?base=USD
        const response = await fetch("https://open.er-api.com/v6/latest/USD", {
          cache: "no-store",
        });

        // If the API fails, use fallback rates
        if (!response.ok) {
          console.warn("Using fallback exchange rates");
          const fallbackRates: Record<string, number> = {
            XAF: 655.957, // 1 USD to XAF
            EUR: 0.92, // 1 USD to EUR
            NGN: 1560.0, // 1 USD to NGN
            GHS: 14.08, // 1 USD to GHS
            USD: 1.0, // 1 USD to USD
          };

          setExchangeRates(fallbackRates);
          setDataSource("fallback");
          return;
        }

        const data = await response.json();
        setExchangeRates(data.rates);
      } catch (err) {
        console.error("Error fetching exchange rates:", err);
        // Use fallback rates if API fails
        const fallbackRates: Record<string, number> = {
          XAF: 655.957,
          EUR: 0.92,
          NGN: 1560.0,
          GHS: 14.08,
          USD: 1.0,
        };

        setExchangeRates(fallbackRates);
        setDataSource("fallback");
      }
    };

    fetchExchangeRates();

    // Refresh every hour
    const interval = setInterval(fetchExchangeRates, 3600000);
    return () => clearInterval(interval);
  }, []);

  // Fetch cryptocurrency data
  useEffect(() => {
    const fetchCryptoData = async () => {
      try {
        setLoading(true);

        const response = await fetch(
          "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false&price_change_percentage=24h",
          {
            headers: {
              Accept: "application/json",
            },
            cache: "no-store",
            next: { revalidate: 300 }, // Revalidate every 5 minutes
          }
        );

        if (!response.ok) {
          throw new Error(
            `Failed to fetch cryptocurrency data: ${response.status}`
          );
        }

        const data = (await response.json()) as CoinGeckoResponse[];

        const formattedData = data.map((coin) => ({
          id: coin.id,
          symbol: coin.symbol.toUpperCase(),
          name: coin.name,
          price: coin.current_price,
          priceChangePercentage24h: coin.price_change_percentage_24h,
        }));

        setCryptoData(formattedData);

        // Store Bitcoin price for conversion
        const bitcoin = formattedData.find((coin) => coin.id === "bitcoin");
        if (bitcoin) {
          setBtcPrice(bitcoin.price);
        }

        setError(null);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching crypto data:", err);
        // Use fallback data when API fails
        setCryptoData(fallbackCryptoData);
        setBtcPrice(fallbackCryptoData[0].price); // Use fallback Bitcoin price
        setError("Using estimated prices - CoinGecko API unavailable");
        setDataSource("fallback");
        setLoading(false);
      }
    };

    fetchCryptoData();

    // Refresh data every 2 minutes
    const interval = setInterval(fetchCryptoData, 120000);

    return () => clearInterval(interval);
  }, []);

  // Use separate API for BTC to fiat conversion with real-time exchange rates
  const convertAmountToBtc = async (amount: string, currencyCode: string) => {
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      setSatsAmount(0);
      return;
    }

    try {
      // Try to use a direct cryptocurrency conversion API
      const response = await fetch(
        `https://api.coinconvert.net/convert/${currencyCode}/BTC?amount=${amount}`,
        { cache: "no-store" }
      );

      if (response.ok) {
        const data = await response.json();
        if (data.status === "success" && data.BTC) {
          // Convert BTC to SATS (1 BTC = 100,000,000 sats)
          const sats = Math.round(data.BTC * 100000000);
          setSatsAmount(sats);
          return;
        }
      }

      // Fallback to manual calculation using exchange rates if direct API fails
      if (exchangeRates[currencyCode] && btcPrice) {
        // Convert to USD first
        const amountInUsd = Number(amount) / exchangeRates[currencyCode];
        // Convert USD to BTC
        const btcAmount = amountInUsd / btcPrice;
        // Convert BTC to SATS (1 BTC = 100,000,000 sats)
        const sats = Math.round(btcAmount * 100000000);
        setSatsAmount(sats);
      } else {
        // Use fallback calculation if we don't have exchange rates
        const currencyObj = currencies.find((c) => c.code === currencyCode);
        if (currencyObj && btcPrice) {
          const amountInUsd = Number(amount) * currencyObj.exchangeRate;
          const btcAmount = amountInUsd / btcPrice;
          const sats = Math.round(btcAmount * 100000000);
          setSatsAmount(sats);
        } else {
          setSatsAmount(0);
        }
      }
    } catch (err) {
      console.error("Error converting to BTC:", err);
      // Use fallback calculation
      const currencyObj = currencies.find((c) => c.code === currencyCode);
      if (currencyObj && btcPrice) {
        const amountInUsd = Number(amount) * currencyObj.exchangeRate;
        const btcAmount = amountInUsd / btcPrice;
        const sats = Math.round(btcAmount * 100000000);
        setSatsAmount(sats);
      } else {
        setSatsAmount(0);
      }
    }
  };

  // Calculate SATS amount whenever relevant values change
  useEffect(() => {
    const amountValue = form.watch("amount");
    const currencyValue = form.watch("currency");

    if (amountValue && currencyValue) {
      convertAmountToBtc(amountValue, currencyValue);
    } else {
      setSatsAmount(0);
    }
  }, [form.watch("amount"), form.watch("currency"), btcPrice, exchangeRates]);

  // Handle form submission
  function onSubmit(values: PaymentFormValues) {
    console.log(values);
    // Mock invoice creation
    setInvoice("woeydcrjqf127394782427x942022...");
    setStage("qrcode");
  }

  // Handle simulating a completed payment
  function simulatePayment() {
    setStage("success");
  }

  // Handle starting a new payment
  function resetPayment() {
    setStage("form");
    setInvoice(null);
    form.reset({
      amount: "20000",
      currency: "XAF",
      phoneNumber: "",
      motif: "",
      email: "",
    });
  }

  return (
    <div className="w-full max-w-md mx-auto h-full">
      {stage === "form" && (
        <Card className="w-full h-full">
          <CardHeader>
            <CardTitle className="text-center text-xl">
              {/* Cryptocurrency Marquee */}
              <div className="w-full overflow-hidden mb-6">
                {loading ? (
                  <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground animate-pulse">
                    <span>Loading cryptocurrency data...</span>
                  </div>
                ) : error ? (
                  <div className="flex items-center justify-center gap-1 text-xs text-amber-500">
                    <span>{error}</span>
                  </div>
                ) : (
                  <div className="relative w-full overflow-hidden">
                    <div className="animate-marquee">
                      {cryptoData.map((coin) => (
                        <div
                          key={coin.id}
                          className="inline-flex items-center gap-1 text-xs px-2"
                        >
                          <span className="font-medium">{coin.symbol}</span>
                          <span
                            className={`${
                              coin.priceChangePercentage24h >= 0
                                ? "text-green-500"
                                : "text-red-500"
                            }`}
                          >
                            {coin.priceChangePercentage24h >= 0 ? "+" : ""}
                            {coin.priceChangePercentage24h.toFixed(2)}%
                          </span>
                        </div>
                      ))}
                      {/* Duplicate for continuous scrolling effect */}
                      {cryptoData.map((coin) => (
                        <div
                          key={`${coin.id}-dup`}
                          className="inline-flex items-center gap-1 text-xs px-2"
                        >
                          <span className="font-medium">{coin.symbol}</span>
                          <span
                            className={`${
                              coin.priceChangePercentage24h >= 0
                                ? "text-green-500"
                                : "text-red-500"
                            }`}
                          >
                            {coin.priceChangePercentage24h >= 0 ? "+" : ""}
                            {coin.priceChangePercentage24h.toFixed(2)}%
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Amount Display */}
              <div className="flex flex-col items-center justify-center">
                <div className="flex items-center justify-center">
                  <span className="mr-2">{selectedCurrency.symbol}</span>
                  <span className="text-2xl font-bold">
                    {form.watch("amount") || "0"}
                  </span>
                  <span className="ml-1 text-sm text-muted-foreground">
                    {selectedCurrency.code}
                  </span>
                </div>
                <div className="text-sm text-muted-foreground mt-2">
                  {satsAmount.toLocaleString()} SATS
                  {dataSource === "fallback" && (
                    <span className="ml-1 text-xs text-amber-500">(est.)</span>
                  )}
                </div>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                {/* Amount and Currency Fields */}
                <div className="grid grid-cols-2 gap-4">
                  {/* Amount Input Field */}
                  <FormField
                    control={form.control}
                    name="amount"
                    render={({ field }) => (
                      <FormItem className="col-span-1">
                        <FormLabel>Amount</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Enter amount"
                            {...field}
                            onChange={(e) => {
                              field.onChange(e);
                              // Trigger revalidation of form for amount changes
                              form.trigger("amount");
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Currency Selector */}
                  <FormField
                    control={form.control}
                    name="currency"
                    render={({ field }) => (
                      <FormItem className="col-span-1">
                        <FormLabel>Currency</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select currency" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {currencies.map((currency) => (
                              <SelectItem
                                key={currency.code}
                                value={currency.code}
                              >
                                <div className="flex items-center gap-2">
                                  <span>{currency.symbol}</span>
                                  <span>{currency.code}</span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="phoneNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sent to</FormLabel>
                      <FormControl>
                        <Input placeholder="Phone number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="motif"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Motif</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="What is this payment for?"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Your email</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="For payment receipt"
                          type="email"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full mt-6">
                  Pay
                </Button>

                <div className="flex justify-between text-sm mt-4">
                  <Button variant="link" className="p-0 h-auto" asChild>
                    <a href="/auth/sign-up">create account</a>
                  </Button>
                  <Button variant="link" className="p-0 h-auto" asChild>
                    <a href="/auth/login">login</a>
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      )}

      {stage === "qrcode" && (
        <Card className="w-full shadow-md">
          <CardHeader>
            <CardTitle className="text-center">QRCode</CardTitle>
            <CardDescription className="text-center">
              Scan with your Bitcoin wallet
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <div className="border rounded-lg p-6 mb-6">
              <img
                src={qrCodeUrl}
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
                >
                  copy code
                </Button>
              </div>
            </div>

            <div className="flex justify-between w-full gap-2 mt-4">
              <Button variant="outline" className="flex-1">
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
              <Button variant="outline" className="flex-1">
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
                  {form.getValues().amount} {form.getValues().currency}
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
          </CardContent>
        </Card>
      )}

      {stage === "success" && (
        <Card className="w-full shadow-md">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center justify-center text-center">
              <div className="mx-auto rounded-full h-24 w-24 bg-green-100 flex items-center justify-center mb-6">
                <CheckCircle2 className="h-12 w-12 text-green-600" />
              </div>

              <h2 className="text-xl font-medium mb-2">Payment successful</h2>

              {/* Payment details */}
              <div className="w-full my-4 p-3 border rounded-md bg-muted/20">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-muted-foreground">Amount:</span>
                  <span className="font-medium">
                    {selectedCurrency.symbol}
                    {form.getValues().amount} {form.getValues().currency}
                    {dataSource === "fallback" && (
                      <span className="ml-1 text-xs text-amber-500">
                        (est.)
                      </span>
                    )}
                  </span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-muted-foreground">
                    Sent to:
                  </span>
                  <span className="font-medium">
                    {form.getValues().phoneNumber}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    Reference:
                  </span>
                  <span className="font-medium">
                    VLT-{Math.floor(Math.random() * 1000000)}
                  </span>
                </div>
              </div>

              <Button className="mt-4 w-full" onClick={resetPayment}>
                Start New Payment
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
