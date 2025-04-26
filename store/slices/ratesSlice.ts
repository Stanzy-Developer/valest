import { StateCreator } from 'zustand';
import { CryptoData, fallbackCryptoData } from '@/components/payment-flow/data';

// Define the rates state slice
export interface RatesSlice {
  // Crypto data
  cryptoData: CryptoData[];
  btcPrice: number;
  satsAmount: number;
  
  // Exchange rates
  exchangeRates: Record<string, number>;
  
  // Data source tracking
  dataSource: 'real-time' | 'fallback';
  ratesLoading: boolean;
  ratesError: string | null;
  
  // Bitcoin conversion
  satoshiConversion: {
    fiatAmount: string;
    fiatCurrency: string;
    satsAmount: number;
    btcAmount: number;
    exchangeRate: number;
    timestamp: number;
  } | null;
  
  // Actions
  setCryptoData: (data: CryptoData[]) => void;
  setBtcPrice: (price: number) => void;
  setSatsAmount: (amount: number) => void;
  setExchangeRates: (rates: Record<string, number>) => void;
  setDataSource: (source: 'real-time' | 'fallback') => void;
  setRatesLoading: (loading: boolean) => void;
  setRatesError: (error: string | null) => void;
  calculateSatsAmount: (amount: string, currencyCode: string) => Promise<number>;
  updateSatoshiConversion: (fiatAmount: string, fiatCurrency: string, satsAmount: number) => void;
  resetRates: () => void;
}

// Default exchange rates (fallback)
const defaultExchangeRates: Record<string, number> = {
  XAF: 655.957,
  EUR: 0.92,
  NGN: 1560.0,
  GHS: 14.08,
  USD: 1.0,
};

// Create the rates slice
export const createRatesSlice: StateCreator<RatesSlice> = (set, get) => ({
  // State
  cryptoData: [],
  btcPrice: 32450.12, // Default BTC price in USD
  satsAmount: 0,
  exchangeRates: defaultExchangeRates,
  dataSource: 'real-time',
  ratesLoading: true,
  ratesError: null,
  satoshiConversion: null,
  
  // Actions
  setCryptoData: (data) => {
    set({ cryptoData: data });
    
    // Update BTC price if available
    const bitcoin = data.find((coin) => coin.id === 'bitcoin');
    if (bitcoin) {
      get().setBtcPrice(bitcoin.price);
    }
  },
  
  setBtcPrice: (price) => set({ btcPrice: price }),
  
  setSatsAmount: (amount) => set({ satsAmount: amount }),
  
  setExchangeRates: (rates) => set({ exchangeRates: rates }),
  
  setDataSource: (source) => set({ dataSource: source }),
  
  setRatesLoading: (loading) => set({ ratesLoading: loading }),
  
  setRatesError: (error) => set({ ratesError: error }),
  
  calculateSatsAmount: async (amount, currencyCode) => {
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      const satsAmount = 0;
      get().setSatsAmount(satsAmount);
      return satsAmount;
    }
    
    try {
      // Try direct API conversion first
      const response = await fetch(
        `https://api.coinconvert.net/convert/${currencyCode}/BTC?amount=${amount}`,
        { cache: 'no-store' }
      );
      
      if (response.ok) {
        const data = await response.json();
        if (data.status === 'success' && data.BTC) {
          // Convert BTC to SATS (1 BTC = 100,000,000 sats)
          const satsAmount = Math.round(data.BTC * 100000000);
          get().setSatsAmount(satsAmount);
          get().updateSatoshiConversion(amount, currencyCode, satsAmount);
          return satsAmount;
        }
      }
      
      // Fall back to manual calculation
      const { exchangeRates, btcPrice } = get();
      
      if (exchangeRates[currencyCode] && btcPrice) {
        // Convert to USD first
        const amountInUsd = Number(amount) / exchangeRates[currencyCode];
        // Convert USD to BTC
        const btcAmount = amountInUsd / btcPrice;
        // Convert BTC to SATS
        const satsAmount = Math.round(btcAmount * 100000000);
        
        get().setSatsAmount(satsAmount);
        get().updateSatoshiConversion(amount, currencyCode, satsAmount);
        return satsAmount;
      }
      
      // If we don't have exchange rates, return 0
      get().setSatsAmount(0);
      return 0;
    } catch (error) {
      console.error('Error calculating SATS amount:', error);
      
      // Use fallback calculation
      const { exchangeRates, btcPrice } = get();
      if (exchangeRates[currencyCode] && btcPrice) {
        const amountInUsd = Number(amount) / exchangeRates[currencyCode];
        const btcAmount = amountInUsd / btcPrice;
        const satsAmount = Math.round(btcAmount * 100000000);
        
        get().setSatsAmount(satsAmount);
        get().setDataSource('fallback');
        get().updateSatoshiConversion(amount, currencyCode, satsAmount);
        return satsAmount;
      }
      
      get().setSatsAmount(0);
      return 0;
    }
  },
  
  updateSatoshiConversion: (fiatAmount, fiatCurrency, satsAmount) => {
    const { btcPrice, exchangeRates } = get();
    const btcAmount = satsAmount / 100000000;
    const exchangeRate = exchangeRates[fiatCurrency] || 1;
    
    set({
      satoshiConversion: {
        fiatAmount,
        fiatCurrency,
        satsAmount,
        btcAmount,
        exchangeRate,
        timestamp: Date.now(),
      }
    });
  },
  
  resetRates: () => {
    set({
      satsAmount: 0,
      satoshiConversion: null,
    });
  },
}); 
