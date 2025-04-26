import { z } from "zod"

export interface Currency {
  code: string
  symbol: string
  name: string
}

export interface CryptoData {
  id: string
  symbol: string
  name: string
  price: number
  priceChangePercentage24h: number
}
/* eslint-disable @typescript-eslint/no-explicit-any */
export interface CoinGeckoResponse {
  current_price: any
  price_change_percentage_24h: any
  id: string
  symbol: string
  name: string
  market_data: {
    current_price: {
      usd: number
    }
    price_change_percentage_24h: number
  }
}

export const currencies: Currency[] = [
  { code: "XAF", symbol: "FCFA", name: "Central African CFA franc" },
  { code: "EUR", symbol: "€", name: "Euro" },
  { code: "USD", symbol: "$", name: "US Dollar" },
  { code: "NGN", symbol: "₦", name: "Nigerian Naira" },
  { code: "GHS", symbol: "GH₵", name: "Ghanaian Cedi" },
]

// Validation régulière pour le numéro de téléphone
const phoneRegex = /^\+?[0-9]{8,}$/

export const paymentFormSchema = z.object({
  amount: z
    .string()
    .min(1, "Le montant est requis")
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: "Le montant doit être supérieur à 0",
    }),
  currency: z.string().min(1, "La devise est requise"),
  phoneNumber: z
    .string()
    .min(1, "Le numéro de téléphone est requis")
    .regex(phoneRegex, "Numéro de téléphone invalide")
    .refine((val) => val.replace(/\D/g, "").length >= 9, {
      message: "Le numéro doit contenir au moins 9 chiffres",
    }),
  motif: z.string().min(1, "Le motif du paiement est requis"),
  email: z.string().email("Email invalide").min(1, "L'email est requis"),
})

export type PaymentFormValues = z.infer<typeof paymentFormSchema>

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
]

// Add the missing PaymentStage type and PAYMENT_STAGES object
export type PaymentStage = "FORM" | "PROCESSING" | "SUCCESS" | "ERROR"

export const PAYMENT_STAGES = {
  FORM: "FORM" as const,
  PROCESSING: "PROCESSING" as const,
  SUCCESS: "SUCCESS" as const,
  ERROR: "ERROR" as const,
}
