import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { createPaymentSlice, PaymentSlice } from './slices/paymentSlice';
import { createInvoiceSlice, InvoiceData, InvoiceSlice } from './slices/invoiceSlice';
import { createRatesSlice, RatesSlice } from './slices/ratesSlice';
import { createUiSlice, PaymentStage, UiSlice } from './slices/uiSlice';

// Define the combined store type
export interface PaymentStore extends 
  PaymentSlice, 
  InvoiceSlice, 
  RatesSlice,
  UiSlice {
  // Additional actions that operate across slices
  reset: () => void;
}

// Create the combined store with persistence
export const usePaymentStore = create<PaymentStore>()(
  persist(
    (...a) => ({
      ...createPaymentSlice(...a),
      ...createInvoiceSlice(...a),
      ...createRatesSlice(...a),
      ...createUiSlice(...a),
      
      // Global reset function
      reset: () => {
        const [, get] = a;
        // Reset all slices
        get().resetForm();
        get().resetInvoice();
        get().resetRates();
        get().resetUi();
      },
    }),
    {
      name: 'payment-store',
      storage: createJSONStorage(() => sessionStorage), // Use sessionStorage
      partialize: (state) => ({
        // Only persist necessary parts of the state
        // This helps avoid localStorage size limitations
        formData: state.formData,
        selectedCurrency: state.selectedCurrency,
        invoice: state.invoice,
        stage: state.stage,
        // Don't persist large datasets or sensitive info
        // cryptoData, exchangeRates, etc. will be fetched fresh on load
      }),
    }
  )
);

// Export store types
export type { 
  PaymentSlice, 
  InvoiceSlice, 
  InvoiceData,
  RatesSlice,
  UiSlice,
  PaymentStage,
};

// Re-export for convenience
export { 
  paymentFormSchema,
  type PaymentFormData 
} from './slices/paymentSlice'; 
