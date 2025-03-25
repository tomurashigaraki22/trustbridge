"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface CryptoData {
  id: string;
  rank: string;
  symbol: string;
  name: string;
  supply: string;
  maxSupply: string | null;
  marketCapUsd: string;
  volumeUsd24Hr: string;
  priceUsd: string;
  changePercent24Hr: string;
  vwap24Hr: string;
  explorer: string;
}

interface ApiResponse {
  data: CryptoData[];
}

export function CryptoTicker() {
  const [cryptoData, setCryptoData] = useState<CryptoData[]>([]);

  useEffect(() => {
    const fetchCryptoData = async () => {
      try {
        const response = await fetch("https://api.coincap.io/v2/assets?limit=50");
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data: ApiResponse = await response.json();
        
        if (data && Array.isArray(data.data)) {
          setCryptoData(data.data);
        } else {
          console.log("Invalid data format received");
          setCryptoData([]);
        }
      } catch (error) {
        console.log("Error fetching crypto data:", error);
        setCryptoData([]);
      }
    };

    fetchCryptoData();
    const interval = setInterval(fetchCryptoData, 10000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-[#000] text-white py-4 overflow-hidden">
      <div className="container mx-auto">
        <div className="flex items-center space-x-4 animate-ticker">
          {Array.isArray(cryptoData) && cryptoData.map((crypto) => (
            <CryptoItem key={crypto.id} crypto={crypto} />
          ))}
        </div>
      </div>
    </div>
  );
}

interface CryptoItemProps {
  crypto: CryptoData;
}

function CryptoItem({ crypto }: CryptoItemProps) {
  return (
    <div className="flex items-center space-x-2 min-w-max">
      <span className="font-semibold">{crypto.symbol.toUpperCase()}</span>
      <AnimatePresence>
        <motion.span
          key={crypto.priceUsd}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="font-mono"
        >
          ${parseFloat(crypto.priceUsd).toFixed(2)}
        </motion.span>
      </AnimatePresence>
      <span
        className={`text-sm ${parseFloat(crypto.changePercent24Hr) >= 0 ? "text-green-500" : "text-red-500"
          }`}
      >
        {parseFloat(crypto.changePercent24Hr).toFixed(2)}%
      </span>
    </div>
  );
}