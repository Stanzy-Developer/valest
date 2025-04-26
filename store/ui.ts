import { create } from 'zustand';
import { PAYMENT_STAGES, type PaymentStage } from '@/components/payment-flow/data';

interface UIState {
  stage: PaymentStage;
  error: string | null;
  setStage: (stage: PaymentStage) => void;
  setError: (error: string | null) => void;
}

export const useUi = create<UIState>((set) => ({
  stage: PAYMENT_STAGES.FORM,
  error: null,
  setStage: (stage) => set({ stage }),
  setError: (error) => set({ error }),
})); 
