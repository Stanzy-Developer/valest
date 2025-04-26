"use client";
import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
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
import { PaymentFormValues, currencies, paymentFormSchema } from "./data";
import { usePaymentStore } from "@/store/payment";
import { convertAmountToBtc } from "@/services/crypto";
import { CryptoMarquee } from "./crypto-marquee";

interface PaymentFormProps {
  onSuccess?: () => void;
}

export function PaymentForm({ onSuccess }: PaymentFormProps) {
  const {
    setStage,
    setInvoice,
    selectedCurrency,
    setSelectedCurrency,
    exchangeRates,
    btcPrice,
    setSatsAmount,
    dataSource,
    setAmount,
    setPhoneNumber,
  } = usePaymentStore();

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
  }, [form.watch("currency"), setSelectedCurrency]);

  // Calculate SATS amount whenever relevant values change
  useEffect(() => {
    const amountValue = form.watch("amount");
    const currencyValue = form.watch("currency");

    if (amountValue && currencyValue) {
      convertAmountToBtc(
        amountValue,
        currencyValue,
        exchangeRates,
        btcPrice
      ).then(setSatsAmount);
    } else {
      setSatsAmount(0);
    }
  }, [
    form.watch("amount"),
    form.watch("currency"),
    btcPrice,
    exchangeRates,
    setSatsAmount,
  ]);

  async function onSubmit(values: PaymentFormValues) {
    // Store the values in the global state
    setAmount(values.amount);
    setPhoneNumber(values.phoneNumber);

    try {
      // Call the API to create an invoice
      const response = await fetch("/api/lnbtc-invoice/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: values.amount,
          description: values.motif || "Payment via Valest",
          reference: values.phoneNumber,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create invoice");
      }

      const responseData = await response.json();
      console.log("Invoice response:", responseData);

      if (responseData.message === "Successful" && responseData.data) {
        const { data } = responseData;

        // Store the invoice hash for the QR code component to use
        setInvoice(data.invoiceHash);

        setStage("qrcode");
        onSuccess?.();
      } else {
        throw new Error("Invalid response format from invoice API");
      }
    } catch (error) {
      console.error("Failed to create invoice:", error);
      form.setError("root", {
        type: "submit",
        message: "Failed to create payment. Please try again.",
      });
    }
  }

  return (
    <div>
      <div className="text-center text-xl">
        <CryptoMarquee />
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
            {usePaymentStore.getState().satsAmount.toLocaleString()} SATS
            {dataSource === "fallback" && (
              <span className="ml-1 text-xs text-amber-500">(est.)</span>
            )}
          </div>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="flex justify-center gap-4">
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
                        form.trigger("amount");
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

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
                        <SelectItem key={currency.code} value={currency.code}>
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
                  <Input placeholder="What is this payment for?" {...field} />
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
            Confirm
          </Button>
        </form>
      </Form>
    </div>
  );
}
