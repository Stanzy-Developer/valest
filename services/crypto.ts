import { CoinGeckoResponse, CryptoData } from '@/components/payment-flow/data';

export async function fetchCryptoData(): Promise<CryptoData[]> {
  const response = await fetch(
    "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false&price_change_percentage=24h",
    {
      headers: {
        Accept: "application/json",
      },
      cache: "no-store",
      next: { revalidate: 300 },
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch cryptocurrency data: ${response.status}`);
  }

  const data = (await response.json()) as CoinGeckoResponse[];

  return data.map((coin) => ({
    id: coin.id,
    symbol: coin.symbol.toUpperCase(),
    name: coin.name,
    price: coin.current_price,
    priceChangePercentage24h: coin.price_change_percentage_24h,
  }));
}

export async function convertAmountToBtc(amount: string, currencyCode: string, exchangeRates: Record<string, number>, btcPrice: number): Promise<number> {
  if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
    return 0;
  }

  try {
    const response = await fetch(
      `https://api.coinconvert.net/convert/${currencyCode}/BTC?amount=${amount}`,
      { cache: "no-store" }
    );

    if (response.ok) {
      const data = await response.json();
      if (data.status === "success" && data.BTC) {
        return Math.round(data.BTC * 100000000);
      }
    }

    // Fallback to manual calculation
    if (exchangeRates[currencyCode] && btcPrice) {
      const amountInUsd = Number(amount) / exchangeRates[currencyCode];
      const btcAmount = amountInUsd / btcPrice;
      return Math.round(btcAmount * 100000000);
    }
  } catch (error) {
    console.error("Error converting to BTC:", error);
  }

  return 0;
}