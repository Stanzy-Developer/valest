import { create } from 'zustand';

interface RatesState {
  rates: Record<string, number>;
  setRates: (rates: Record<string, number>) => void;
}

export const useRates = create<RatesState>((set) => ({
  rates: {},
  setRates: (rates) => set({ rates }),
})); 
