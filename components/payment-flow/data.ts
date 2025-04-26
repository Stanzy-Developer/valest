import * as z from "zod";

// Define type for cryptocurrency data
export type CryptoData = {
  id: string;
  symbol: string;
  name: string;
  price: number;
  priceChangePercentage24h: number;
};

// Define type for CoinGecko API response
export interface CoinGeckoResponse {
  id: string;
  symbol: string;
  name: string;
  current_price: number;
  price_change_percentage_24h: number;
}

// Define type for supported currencies
export type Currency = {
  code: string;
  name: string;
  symbol: string;
  exchangeRate: number; // Exchange rate to USD
};

// Available currencies
export const currencies: Currency[] = [
  {
    code: "XAF",
    name: "Central African CFA franc",
    symbol: "₣",
    exchangeRate: 0.00152,
  }, // XAF to USD
  { code: "USD", name: "US Dollar", symbol: "$", exchangeRate: 1 },
  { code: "EUR", name: "Euro", symbol: "€", exchangeRate: 1.09 },
  { code: "NGN", name: "Nigerian Naira", symbol: "₦", exchangeRate: 0.00064 },
  { code: "GHS", name: "Ghanaian Cedi", symbol: "₵", exchangeRate: 0.071 },
];

// Define form schema for payment details
export const paymentFormSchema = z.object({
  amount: z
    .string()
    .refine((val: string) => !isNaN(Number(val)) && Number(val) > 0, {
      message: "Amount must be a positive number.",
    }),
  currency: z.string().default("XAF"),
  phoneNumber: z.string().min(8, {
    message: "Phone number must be at least 8 digits.",
  }),
  motif: z.string().optional(),
  email: z.string().email({ message: "Invalid email address" }).optional(),
});

export type PaymentFormValues = z.infer<typeof paymentFormSchema>;

// Sample fallback crypto data to use when API fails
export const fallbackCryptoData: CryptoData[] = [
  {
    id: "bitcoin",
    symbol: "BTC",
    name: "Bitcoin",
    price: 32450.12,
    priceChangePercentage24h: 1.25,
  },
  {
    id: "ethereum",
    symbol: "ETH",
    name: "Ethereum",
    price: 1850.45,
    priceChangePercentage24h: -0.75,
  },
  {
    id: "tether",
    symbol: "USDT",
    name: "Tether",
    price: 1.0,
    priceChangePercentage24h: 0.01,
  },
  {
    id: "binancecoin",
    symbol: "BNB",
    name: "Binance Coin",
    price: 295.12,
    priceChangePercentage24h: 2.34,
  },
  {
    id: "solana",
    symbol: "SOL",
    name: "Solana",
    price: 82.45,
    priceChangePercentage24h: 5.67,
  },
]; 
