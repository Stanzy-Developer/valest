import { createAPI, APIError } from './api';

// Exchange rate API types
export interface ExchangeRates {
  base: string;
  rates: Record<string, number>;
  timestamp: number;
}

export interface ExchangeRateResponse {
  base: string;
  rates: Record<string, number>;
  timestamp: number;
  success: boolean;
}

// Default exchange rates (fallback)
export const defaultExchangeRates: Record<string, number> = {
  XAF: 655.957,
  EUR: 0.92,
  NGN: 1560.0,
  GHS: 14.08,
  USD: 1.0,
};

// Create exchange rates API instance
const exchangeAPI = createAPI({
  baseUrl: 'https://open.er-api.com/v6',
});

/**
 * Fetch latest exchange rates
 */
export async function fetchExchangeRates(base: string = 'USD'): Promise<ExchangeRates> {
  try {
    const response = await exchangeAPI.get<ExchangeRateResponse>(`/latest/${base}`);
    
    return {
      base: response.base,
      rates: response.rates,
      timestamp: response.timestamp,
    };
  } catch (error) {
    console.warn('Using fallback exchange rates:', error);
    
    // Return fallback rates
    return {
      base: 'USD',
      rates: defaultExchangeRates,
      timestamp: Date.now(),
    };
  }
}

/**
 * Convert amount between currencies
 */
export function convertCurrency(
  amount: number,
  from: string,
  to: string,
  rates: Record<string, number>
): number {
  // If currencies are the same, return original amount
  if (from === to) return amount;
  
  // Get rates for both currencies (relative to USD)
  const fromRate = rates[from];
  const toRate = rates[to];
  
  if (!fromRate || !toRate) {
    throw new APIError(
      `Exchange rate not available for ${!fromRate ? from : to}`,
      400
    );
  }
  
  // Convert to USD first, then to target currency
  const amountInUSD = amount / fromRate;
  return amountInUSD * toRate;
}

/**
 * Format currency amount
 */
export function formatCurrency(
  amount: number,
  currency: string,
  locale: string = 'en-US'
): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
} 
