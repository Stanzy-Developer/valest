"use client";

import { ReactNode, createContext, useRef, useContext } from "react";
import { usePaymentStore } from "./index";
import { type StoreApi, useStore } from "zustand";
import { type PaymentStore } from "./index";

// Create a React Context for the Zustand store
const PaymentStoreContext = createContext<StoreApi<PaymentStore> | null>(null);

// Provider component that makes the store available to any child component
export function PaymentStoreProvider({ children }: { children: ReactNode }) {
  // Fix: Initialize the ref with the store
  const storeRef = useRef<StoreApi<PaymentStore>>(usePaymentStore);

  return (
    <PaymentStoreContext.Provider value={storeRef.current}>
      {children}
    </PaymentStoreContext.Provider>
  );
}

// Hook to use the payment store in components
export function usePayment<T>(selector: (state: PaymentStore) => T): T {
  const store = useContext(PaymentStoreContext);

  if (!store) {
    throw new Error("usePayment must be used within PaymentStoreProvider");
  }

  return useStore(store, selector);
}

// Convenience hooks for specific parts of the store
export function usePaymentForm() {
  return usePayment((state) => ({
    formData: state.formData,
    formErrors: state.formErrors,
    formValid: state.formValid,
    selectedCurrency: state.selectedCurrency,
    setFormField: state.setFormField,
    setFormData: state.setFormData,
    validateForm: state.validateForm,
    resetForm: state.resetForm,
    setSelectedCurrency: state.setSelectedCurrency,
  }));
}

export function useInvoice() {
  return usePayment((state) => ({
    invoice: state.invoice,
    invoiceLoading: state.invoiceLoading,
    invoiceError: state.invoiceError,
    qrCodeUrl: state.qrCodeUrl,
    isPolling: state.isPolling,
    setInvoice: state.setInvoice,
    setInvoiceLoading: state.setInvoiceLoading,
    setInvoiceError: state.setInvoiceError,
    setInvoiceStatus: state.setInvoiceStatus,
    startPolling: state.startPolling,
    stopPolling: state.stopPolling,
    resetInvoice: state.resetInvoice,
  }));
}

export function useRates() {
  return usePayment((state) => ({
    cryptoData: state.cryptoData,
    btcPrice: state.btcPrice,
    satsAmount: state.satsAmount,
    exchangeRates: state.exchangeRates,
    dataSource: state.dataSource,
    ratesLoading: state.ratesLoading,
    ratesError: state.ratesError,
    satoshiConversion: state.satoshiConversion,
    calculateSatsAmount: state.calculateSatsAmount,
    setCryptoData: state.setCryptoData,
    setBtcPrice: state.setBtcPrice,
    setSatsAmount: state.setSatsAmount,
    setExchangeRates: state.setExchangeRates,
    setDataSource: state.setDataSource,
  }));
}

export function useUi() {
  return usePayment((state) => ({
    stage: state.stage,
    loading: state.loading,
    error: state.error,
    navigationHistory: state.navigationHistory,
    setStage: state.setStage,
    setLoading: state.setLoading,
    setError: state.setError,
    goBack: state.goBack,
    resetUi: state.resetUi,
  }));
}
