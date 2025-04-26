import { StateCreator } from 'zustand';

// Define the invoice data structure
export interface InvoiceData {
  id: string;
  paymentRequest: string; // The Lightning invoice string
  amount: number; // Amount in satoshis
  amountCurrency: string;
  description: string;
  reference: string;
  expiresAt: string;
  status: 'pending' | 'paid' | 'expired' | 'failed';
  createdAt: string;
}

// Define the invoice state slice
export interface InvoiceSlice {
  // Invoice data
  invoice: InvoiceData | null;
  invoiceLoading: boolean;
  invoiceError: string | null;
  
  // QR code data
  qrCodeUrl: string | null;
  
  // Status polling
  isPolling: boolean;
  lastPolled: number | null;
  
  // Actions
  setInvoice: (invoice: InvoiceData | null) => void;
  setInvoiceLoading: (loading: boolean) => void;
  setInvoiceError: (error: string | null) => void;
  setQrCodeUrl: (url: string | null) => void;
  setInvoiceStatus: (status: InvoiceData['status']) => void;
  startPolling: () => void;
  stopPolling: () => void;
  resetInvoice: () => void;
}

// Create the invoice slice
export const createInvoiceSlice: StateCreator<InvoiceSlice> = (set, get) => ({
  // State
  invoice: null,
  invoiceLoading: false,
  invoiceError: null,
  qrCodeUrl: null,
  isPolling: false,
  lastPolled: null,
  
  // Actions
  setInvoice: (invoice) => {
    set({ invoice });
    
    // Generate QR code URL if invoice exists
    if (invoice?.paymentRequest) {
      // In a real implementation, we'd use a proper QR code generator
      // For now, we'll use a placeholder API
      const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(invoice.paymentRequest)}`;
      get().setQrCodeUrl(qrUrl);
    } else {
      get().setQrCodeUrl(null);
    }
  },
  
  setInvoiceLoading: (loading) => set({ invoiceLoading: loading }),
  
  setInvoiceError: (error) => set({ invoiceError: error }),
  
  setQrCodeUrl: (url) => set({ qrCodeUrl: url }),
  
  setInvoiceStatus: (status) => {
    set((state) => ({
      invoice: state.invoice ? { ...state.invoice, status } : null
    }));
    
    // Stop polling if invoice is in a final state
    if (status === 'paid' || status === 'expired' || status === 'failed') {
      get().stopPolling();
    }
  },
  
  startPolling: () => set({ isPolling: true, lastPolled: Date.now() }),
  
  stopPolling: () => set({ isPolling: false }),
  
  resetInvoice: () => {
    set({
      invoice: null,
      invoiceLoading: false,
      invoiceError: null,
      qrCodeUrl: null,
      isPolling: false,
      lastPolled: null,
    });
  },
}); 
