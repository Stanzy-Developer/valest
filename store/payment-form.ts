import { create } from 'zustand';

interface PaymentFormData {
  amount: string;
  currency: string;
  satsAmount?: number;
}

interface PaymentFormState {
  formData: PaymentFormData | null;
  setFormData: (data: PaymentFormData) => void;
}

export const usePaymentForm = create<PaymentFormState>((set) => ({
  formData: null,
  setFormData: (formData) => set({ formData }),
})); 
