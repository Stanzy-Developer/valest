import { create } from 'zustand';

interface Invoice {
  id: string;
  amount: number;
  currency: string;
  status: 'pending' | 'paid' | 'expired';
  createdAt: string;
}

interface InvoiceState {
  invoice: Invoice | null;
  setInvoice: (invoice: Invoice | null) => void;
}

export const useInvoice = create<InvoiceState>((set) => ({
  invoice: null,
  setInvoice: (invoice) => set({ invoice }),
})); 
