import { z } from "zod";

export interface Currency {
  code: string;
  symbol: string;
  name: string;
}

export interface CryptoData {
  id: string;
  symbol: string;
  name: string;
  price: number;
  priceChangePercentage24h: number;
}

export interface CoinGeckoResponse {
  id: string;
  symbol: string;
  name: string;
  current_price: number;
  price_change_percentage_24h: number;
}

export const currencies: Currency[] = [
  { code: "XAF", symbol: "FCFA", name: "Central African CFA franc" },
  { code: "EUR", symbol: "€", name: "Euro" },
  { code: "USD", symbol: "$", name: "US Dollar" },
  { code: "NGN", symbol: "₦", name: "Nigerian Naira" },
  { code: "GHS", symbol: "GH₵", name: "Ghanaian Cedi" },
];

export const paymentFormSchema = z.object({
  amount: z
    .string()
    .min(1, "Amount is required")
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: "Amount must be greater than 0",
    }),
  currency: z.string().min(1, "Currency is required"),
  phoneNumber: z
    .string()
    .min(1, "Phone number is required")
    .regex(/^\+?[0-9]{8,}$/, "Invalid phone number"),
  motif: z.string().min(1, "Payment reason is required"),
  email: z.string().email("Invalid email").min(1, "Email is required"),
});

export type PaymentFormValues = z.infer<typeof paymentFormSchema>;

export const fallbackCryptoData: CryptoData[] = [
  {
    id: "bitcoin",
    symbol: "BTC",
    name: "Bitcoin",
    price: 32450.12,
    priceChangePercentage24h: 2.5,
  },
  {
    id: "ethereum",
    symbol: "ETH",
    name: "Ethereum",
    price: 1850.34,
    priceChangePercentage24h: 1.8,
  },
  {
    id: "binancecoin",
    symbol: "BNB",
    name: "BNB",
    price: 312.45,
    priceChangePercentage24h: -0.5,
  },
];
