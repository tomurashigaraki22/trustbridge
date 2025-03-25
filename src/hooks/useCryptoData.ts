import { useState, useEffect } from 'react';

interface CryptoAsset {
  id: string;
  rank: string;
  symbol: string;
  name: string;
  priceUsd: string;
  changePercent24Hr: string;
  marketCapUsd: string;
  volumeUsd24Hr: string;
  volume24hUsd: string
  vwap24hUsd: string
  changePercent24h: string
  supply: string
  maxSupply: string | null
}

interface CryptoData {
  [key: string]: CryptoAsset;
}

export function useCryptoData(specificCoin?: string) {
  const [cryptoData, setCryptoData] = useState<CryptoData>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCryptoData = async () => {
    try {
      const url = specificCoin 
        ? `https://api.coincap.io/v2/assets/${specificCoin}`
        : 'https://api.coincap.io/v2/assets';

      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch crypto data');

      const result = await response.json();
      
      if (specificCoin) {
        setCryptoData({ [specificCoin]: result.data });
      } else {
        const formattedData: CryptoData = {};
        result.data.forEach((asset: CryptoAsset) => {
          formattedData[asset.id] = asset;
        });
        setCryptoData(formattedData);
      }
      
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const calculateUserAssetValue = (balance: number, coinId: string): number => {
    if (!cryptoData[coinId]) return 0;
    return parseFloat(cryptoData[coinId].priceUsd);
  };

  useEffect(() => {
    fetchCryptoData();
    const interval = setInterval(fetchCryptoData, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, [specificCoin]);

  return {
    cryptoData,
    isLoading,
    error,
    refetch: fetchCryptoData,
    calculateUserAssetValue
  };
}