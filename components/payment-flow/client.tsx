"use client";

import { useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { PaymentForm } from "./payment-form";
import { QRCode } from "./qr-code";
import { SuccessView } from "./success-view";
import { usePaymentStore } from "@/store/payment";
import { fetchCryptoData } from "@/services/crypto";
import { fallbackCryptoData } from "./data";

export default function PaymentFlowClient() {
  const {
    stage,
    setCryptoData,
    setLoading,
    setError,
    setBtcPrice,
    setExchangeRates,
    setDataSource,
  } = usePaymentStore();

  // Fetch exchange rates
  useEffect(() => {
    const fetchExchangeRates = async () => {
      try {
        const response = await fetch("https://open.er-api.com/v6/latest/USD", {
          cache: "no-store",
        });

        if (!response.ok) {
          console.warn("Using fallback exchange rates");
          const fallbackRates: Record<string, number> = {
            XAF: 655.957,
            EUR: 0.92,
            NGN: 1560.0,
            GHS: 14.08,
            USD: 1.0,
          };

          setExchangeRates(fallbackRates);
          setDataSource("fallback");
          return;
        }

        const data = await response.json();
        setExchangeRates(data.rates);
      } catch (err) {
        console.error("Error fetching exchange rates:", err);
        const fallbackRates: Record<string, number> = {
          XAF: 655.957,
          EUR: 0.92,
          NGN: 1560.0,
          GHS: 14.08,
          USD: 1.0,
        };

        setExchangeRates(fallbackRates);
        setDataSource("fallback");
      }
    };

    fetchExchangeRates();
    const interval = setInterval(fetchExchangeRates, 3600000);
    return () => clearInterval(interval);
  }, [setExchangeRates, setDataSource]);

  // Fetch cryptocurrency data
  useEffect(() => {
    const getCryptoData = async () => {
      try {
        setLoading(true);
        const formattedData = await fetchCryptoData();
        setCryptoData(formattedData);

        // Store Bitcoin price for conversion
        const bitcoin = formattedData.find((coin) => coin.id === "bitcoin");
        if (bitcoin) {
          setBtcPrice(bitcoin.price);
        }

        setError(null);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching crypto data:", err);
        setCryptoData(fallbackCryptoData);
        setBtcPrice(fallbackCryptoData[0].price);
        setError("Using estimated prices - CoinGecko API unavailable");
        setDataSource("fallback");
        setLoading(false);
      }
    };

    getCryptoData();
    const interval = setInterval(getCryptoData, 120000);
    return () => clearInterval(interval);
  }, [setCryptoData, setLoading, setError, setBtcPrice, setDataSource]);

  return (
    <div className="w-full max-w-md mx-auto h-full">
      <Card className="w-full h-full">
        <CardContent className="pt-6">
          {stage === "form" && <PaymentForm />}
          {stage === "qrcode" && <QRCode />}
          {stage === "success" && <SuccessView />}
        </CardContent>
      </Card>
    </div>
  );
}
