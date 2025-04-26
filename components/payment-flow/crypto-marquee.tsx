"use client";
import { usePaymentStore } from "@/store/payment";
import { Key } from "react";

// Define an interface for the coin data
interface CryptoCoin {
  id: Key;
  symbol: string;
  priceChangePercentage24h: number;
}

export function CryptoMarquee() {
  const { cryptoData, loading, error } = usePaymentStore();

  if (loading) {
    return (
      <div className="w-full overflow-hidden mb-6">
        <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground animate-pulse">
          <span>Loading cryptocurrency data...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full overflow-hidden mb-6">
        <div className="flex items-center justify-center gap-1 text-xs text-amber-500">
          <span>{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full overflow-hidden mb-6">
      <div className="relative w-full overflow-hidden">
        <div className="animate-marquee">
          {cryptoData.map((coin: CryptoCoin) => (
            <div
              key={coin.id}
              className="inline-flex items-center gap-1 text-xs px-2"
            >
              <span className="font-medium">{coin.symbol}</span>
              <span
                className={`${
                  coin.priceChangePercentage24h >= 0
                    ? "text-green-500"
                    : "text-red-500"
                }`}
              >
                {coin.priceChangePercentage24h >= 0 ? "+" : ""}
                {coin.priceChangePercentage24h.toFixed(2)}%
              </span>
            </div>
          ))}
          {/* Duplicate for continuous scrolling effect */}
          {cryptoData.map((coin: CryptoCoin) => (
            <div
              key={`${coin.id}-dup`}
              className="inline-flex items-center gap-1 text-xs px-2"
            >
              <span className="font-medium">{coin.symbol}</span>
              <span
                className={`${
                  coin.priceChangePercentage24h >= 0
                    ? "text-green-500"
                    : "text-red-500"
                }`}
              >
                {coin.priceChangePercentage24h >= 0 ? "+" : ""}
                {coin.priceChangePercentage24h.toFixed(2)}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}