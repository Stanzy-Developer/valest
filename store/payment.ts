import { create } from "zustand"
import { type Currency, type CryptoData, currencies, fallbackCryptoData } from "@/components/payment-flow/data"

interface PaymentStore {
  // User input
  amount: string
  phoneNumber: string
  email: string
  motif: string

  // UI state
  stage: "form" | "qrcode" | "success"
  loading: boolean
  error: string | null

  // Payment data
  invoice: string | null
  cryptoData: CryptoData[]
  satsAmount: number

  // Currency and exchange data
  btcPrice: number
  exchangeRates: Record<string, number>
  selectedCurrency: Currency
  dataSource: "real-time" | "fallback"

  // UI actions
  setStage: (stage: "form" | "qrcode" | "success") => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void

  // User input actions
  setAmount: (amount: string) => void
  setPhoneNumber: (phoneNumber: string) => void
  setEmail: (email: string) => void
  setMotif: (motif: string) => void

  // Payment data actions
  setInvoice: (invoice: string | null) => void
  setCryptoData: (data: CryptoData[]) => void
  setSatsAmount: (amount: number) => void

  // Currency and exchange actions
  setBtcPrice: (price: number) => void
  setExchangeRates: (rates: Record<string, number>) => void
  setSelectedCurrency: (currency: Currency) => void
  setDataSource: (source: "real-time" | "fallback") => void

  // Flow control
  resetPayment: () => void
  initializeWithFallbackData: () => void
}

export const usePaymentStore = create<PaymentStore>((set) => ({
  // User input - initial values
  amount: "",
  phoneNumber: "",
  email: "",
  motif: "",

  // UI state - initial values
  stage: "form",
  loading: true,
  error: null,

  // Payment data - initial values
  invoice: null,
  cryptoData: [],
  satsAmount: 0,

  // Currency and exchange data - initial values
  btcPrice: 32450.12,
  exchangeRates: {},
  selectedCurrency: currencies[0],
  dataSource: "real-time",

  // UI actions
  setStage: (stage) => set({ stage }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),

  // User input actions
  setAmount: (amount) => set({ amount }),
  setPhoneNumber: (phoneNumber) => set({ phoneNumber }),
  setEmail: (email) => set({ email }),
  setMotif: (motif) => set({ motif }),

  // Payment data actions
  setInvoice: (invoice) => set({ invoice }),
  setCryptoData: (data) => set({ cryptoData: data }),
  setSatsAmount: (amount) => set({ satsAmount: amount }),

  // Currency and exchange actions
  setBtcPrice: (price) => set({ btcPrice: price }),
  setExchangeRates: (rates) => set({ exchangeRates: rates }),
  setSelectedCurrency: (currency) => set({ selectedCurrency: currency }),
  setDataSource: (source) => set({ dataSource: source }),

  // Flow control
  resetPayment: () => set({
    amount: "",
    phoneNumber: "",
    email: "",
    motif: "",
    stage: "form",
    invoice: null,
    error: null,
    satsAmount: 0,
  }),

  initializeWithFallbackData: () => set({
    cryptoData: fallbackCryptoData,
    btcPrice: fallbackCryptoData[0].price,
    dataSource: "fallback",
    loading: false,
  }),
}))
