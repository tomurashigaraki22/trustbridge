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
  supply: string;
  maxSupply: string | null;
}

interface CryptoData {
  [key: string]: CryptoAsset;
}

interface CacheData {
  data: CryptoData;
  timestamp: number;
}

interface BinanceTickerData {
  symbol: string;
  priceChange: string;
  priceChangePercent: string;
  lastPrice: string;
  volume: string;
  quoteVolume: string;
}

interface KrakenTickerData {
  [key: string]: {
    c: string[];  // Last trade price
    v: string[];  // Volume
    p: string[];  // Price
  };
}

interface KucoinTickerData {
  data: {
    symbol: string;
    last: string;
    changeRate: string;
    volValue: string;
  };
}

export function useCryptoData(specificCoin?: string) {
  const [cryptoData, setCryptoData] = useState<CryptoData>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const CACHE_DURATION = 60000;
  const STORAGE_KEY = specificCoin 
    ? `crypto_data_${specificCoin}`
    : 'crypto_data_all';

  const getCachedData = (): CacheData | null => {
    const cached = localStorage.getItem(STORAGE_KEY);
    return cached ? JSON.parse(cached) : null;
  };

  const setCachedData = (data: CryptoData) => {
    const cacheData: CacheData = {
      data,
      timestamp: Date.now()
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cacheData));
  };

  const isCacheValid = (cache: CacheData): boolean => {
    return Date.now() - cache.timestamp < CACHE_DURATION;
  };

  const fetchFromCoinGecko = async () => {
    const url = specificCoin 
      ? `https://api.coingecko.com/api/v3/coins/${specificCoin}?localization=false&tickers=false&community_data=false&developer_data=false`
      : 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&sparkline=false';
    
    const response = await fetch(url);
    if (!response.ok) throw new Error('CoinGecko API failed');
    return await response.json();
  };

  const fetchFromBinance = async () => {
    const url = specificCoin 
      ? `https://api.binance.com/api/v3/ticker/24hr?symbol=${specificCoin.toUpperCase()}USDT`
      : 'https://api.binance.com/api/v3/ticker/24hr';
    
    const response = await fetch(url);
    if (!response.ok) throw new Error('Binance API failed');
    return await response.json();
  };

  const fetchFromKraken = async () => {
    const pair = specificCoin 
      ? `${specificCoin.toUpperCase()}USD`
      : 'BTCUSD,ETHUSD,USDTUSD';
    const url = `https://api.kraken.com/0/public/Ticker?pair=${pair}`;
    
    const response = await fetch(url);
    if (!response.ok) throw new Error('Kraken API failed');
    return await response.json();
  };

  const fetchFromKucoin = async () => {
    const symbol = specificCoin 
      ? `${specificCoin.toUpperCase()}-USDT`
      : null;
    const url = symbol
      ? `https://api.kucoin.com/api/v1/market/orderbook/level1?symbol=${symbol}`
      : 'https://api.kucoin.com/api/v1/market/allTickers';
    
    const response = await fetch(url);
    if (!response.ok) throw new Error('Kucoin API failed');
    return await response.json();
  };

  const formatData = (data: any, source: string): CryptoData => {
    let formattedData: CryptoData = {};

    switch (source) {
      case 'coingecko':
        if (specificCoin) {
          formattedData[specificCoin.toLowerCase()] = {
            id: data.id || specificCoin.toLowerCase(),
            rank: data.market_cap_rank?.toString() || '0',
            symbol: data.symbol.toLowerCase(),
            name: data.name,
            priceUsd: data.current_price?.toString() || data.market_data?.current_price?.usd?.toString() || '0',
            changePercent24Hr: data.price_change_percentage_24h?.toString() || '0',
            marketCapUsd: data.market_cap?.toString() || data.market_data?.market_cap?.usd?.toString() || '0',
            volumeUsd24Hr: data.total_volume?.toString() || data.market_data?.total_volume?.usd?.toString() || '0',
            supply: data.circulating_supply?.toString() || data.market_data?.circulating_supply?.toString() || '0',
            maxSupply: data.max_supply?.toString() || data.market_data?.max_supply?.toString() || null
          };
        } else {
          data.forEach((coin: any) => {
            formattedData[coin.id] = {
              id: coin.id,
              rank: coin.market_cap_rank?.toString() || '0',
              symbol: coin.symbol.toLowerCase(),
              name: coin.name,
              priceUsd: coin.current_price?.toString() || '0',
              changePercent24Hr: coin.price_change_percentage_24h?.toString() || '0',
              marketCapUsd: coin.market_cap?.toString() || '0',
              volumeUsd24Hr: coin.total_volume?.toString() || '0',
              supply: coin.circulating_supply?.toString() || '0',
              maxSupply: coin.max_supply?.toString() || null
            };
          });
        }
        break;

      case 'binance':
        if (specificCoin) {
          const pair = `${specificCoin.toUpperCase()}USD`;
          const tickerData = data.result[pair];
          formattedData[specificCoin.toLowerCase()] = {
            id: specificCoin.toLowerCase(),
            rank: '0',
            symbol: specificCoin.toLowerCase(),
            name: specificCoin.toUpperCase(),
            priceUsd: tickerData.c[0],
            changePercent24Hr: ((parseFloat(tickerData.p[1]) - parseFloat(tickerData.p[0])) / parseFloat(tickerData.p[0]) * 100).toString(),
            marketCapUsd: '0',
            volumeUsd24Hr: tickerData.v[1],
            supply: '0',
            maxSupply: null
          };
        }
        break;

      case 'kraken':
        if (specificCoin) {
          const pair = `${specificCoin.toUpperCase()}USD`;
          const tickerData = data.result[pair];
          formattedData[specificCoin.toLowerCase()] = {
            id: specificCoin.toLowerCase(),
            rank: '0',
            symbol: specificCoin.toLowerCase(),
            name: specificCoin.toUpperCase(),
            priceUsd: tickerData.c[0],
            changePercent24Hr: ((parseFloat(tickerData.p[1]) - parseFloat(tickerData.p[0])) / parseFloat(tickerData.p[0]) * 100).toString(),
            marketCapUsd: '0',
            volumeUsd24Hr: tickerData.v[1],
            supply: '0',
            maxSupply: null
          };
        }
        break;

      case 'kucoin':
        if (specificCoin) {
          const tickerData = data.data;
          formattedData[specificCoin.toLowerCase()] = {
            id: specificCoin.toLowerCase(),
            rank: '0',
            symbol: specificCoin.toLowerCase(),
            name: specificCoin.toUpperCase(),
            priceUsd: tickerData.last,
            changePercent24Hr: tickerData.changeRate,
            marketCapUsd: '0',
            volumeUsd24Hr: tickerData.volValue,
            supply: '0',
            maxSupply: null
          };
        }
        break;
    }

    return formattedData;
  };

  const fetchCryptoData = async () => {
    try {
      const cached = getCachedData();
      if (cached && isCacheValid(cached)) {
        const timeLeft = CACHE_DURATION - (Date.now() - cached.timestamp);
        console.log(`📦 Using cached data - Expires in ${Math.round(timeLeft / 1000)}s`);
        setCryptoData(cached.data);
        setIsLoading(false);
        return;
      }

      const apis = [
        { name: 'coingecko', fetch: fetchFromCoinGecko },
        { name: 'binance', fetch: fetchFromBinance },
        { name: 'kraken', fetch: fetchFromKraken },
        { name: 'kucoin', fetch: fetchFromKucoin }
      ];

      for (const api of apis) {
        try {
          console.log(`🔄 Trying ${api.name} API...`);
          const result = await api.fetch();
          const formattedData = formatData(result, api.name);
          
          if (Object.keys(formattedData).length > 0) {
            console.log(`✅ Using ${api.name} API - Cache expires in ${CACHE_DURATION / 1000}s`);
            setCryptoData(formattedData);
            setCachedData(formattedData);
            setError(null);
            break;
          }
        } catch (err) {
          console.error(`❌ ${api.name} API failed:`, err);
          continue;
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'All APIs failed');
      const cached = getCachedData();
      if (cached) {
        setCryptoData(cached.data);
      }
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
    const interval = setInterval(fetchCryptoData, 60000); 
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