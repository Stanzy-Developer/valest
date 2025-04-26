import { StateCreator } from 'zustand';
import { z } from 'zod';
import { Currency, currencies } from '@/components/payment-flow/data';

// Define the payment validation schema
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
  reference: z.string().optional(),
});

export type PaymentFormData = z.infer<typeof paymentFormSchema>;

// Define the payment state slice
export interface PaymentSlice {
  // Form data
  formData: PaymentFormData;
  formErrors: Record<string, string>;
  formValid: boolean;
  
  // Selected currency
  selectedCurrency: Currency;
  
  // Actions
  setFormField: <K extends keyof PaymentFormData>(field: K, value: PaymentFormData[K]) => void;
  setFormData: (data: Partial<PaymentFormData>) => void;
  validateForm: () => boolean;
  resetForm: () => void;
  setSelectedCurrency: (currency: Currency) => void;
}

// Initial form data
const initialFormData: PaymentFormData = {
  amount: "",
  currency: "XAF",
  phoneNumber: "",
  motif: "",
  email: "",
  reference: "",
};

// Create the payment slice
export const createPaymentSlice: StateCreator<PaymentSlice> = (set, get) => ({
  // State
  formData: initialFormData,
  formErrors: {},
  formValid: false,
  selectedCurrency: currencies[0],
  
  // Actions
  setFormField: (field, value) => {
    set((state) => ({
      formData: { ...state.formData, [field]: value },
    }));
    get().validateForm();
  },
  
  setFormData: (data) => {
    set((state) => ({
      formData: { ...state.formData, ...data },
    }));
    get().validateForm();
  },
  
  validateForm: () => {
    const { formData } = get();
    const result = paymentFormSchema.safeParse(formData);
    
    if (!result.success) {
      const formattedErrors: Record<string, string> = {};
      result.error.errors.forEach((error) => {
        const path = error.path.join('.');
        formattedErrors[path] = error.message;
      });
      
      set({ formErrors: formattedErrors, formValid: false });
      return false;
    }
    
    set({ formErrors: {}, formValid: true });
    return true;
  },
  
  resetForm: () => {
    set({
      formData: initialFormData,
      formErrors: {},
      formValid: false,
    });
  },
  
  setSelectedCurrency: (currency) => {
    set({ 
      selectedCurrency: currency,
      formData: { 
        ...get().formData, 
        currency: currency.code 
      }
    });
  },
}); 
