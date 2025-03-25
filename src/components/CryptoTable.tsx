"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TrendingUp, TrendingDown } from "lucide-react";

interface CryptoData {
  id: string;
  symbol: string;
  name: string;
  priceUsd: string;
  changePercent24Hr: string;
  marketCapUsd: string;
  volumeUsd24Hr: string;
}

interface ApiResponse {
  data: CryptoData[];
}

export function CryptoTable() {
  const [cryptoData, setCryptoData] = useState<CryptoData[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchCryptoData = async () => {
      try {
        const response = await fetch("https://api.coincap.io/v2/assets?limit=5");
        
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
    const interval = setInterval(fetchCryptoData, 30000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % cryptoData.length);
    }, 3000); // Rotate every 3 seconds

    return () => clearInterval(timer);
  }, [cryptoData.length]);

  return (
    <div className="w-full overflow-x-auto pb-[5rem]">
      <div className="min-w-[768px] bg-[#121212]/40 backdrop-blur-xl rounded-lg border border-gray-800/50">
        {/* Table Header */}
        <div className="grid grid-cols-4 gap-4 p-4 border-b border-gray-800/50 bg-black/20">
          <div className="text-gray-400">Asset</div>
          <div className="text-right text-gray-400">Price</div>
          <div className="text-right text-gray-400">Market Cap</div>
          <div className="text-right text-gray-400">24h Change</div>
        </div>

        {/* Ticker Display */}
        <div className="relative h-[400px] overflow-hidden">
        <AnimatePresence mode="popLayout">
          {cryptoData && cryptoData.map((crypto, index) => (
            <motion.div
              key={crypto.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ 
                opacity: 1, 
                y: 0,
                background: index === currentIndex ? "rgba(139, 92, 246, 0.05)" : "transparent"
              }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-4 gap-4 p-4 border-b border-gray-800/10 hover:bg-[#8B5CF6]/5 transition-colors"
            >
              {/* Asset Column */}
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#2a2a2a] flex items-center justify-center">
                  <span className="text-[#8B5CF6] text-sm font-bold">
                    {crypto.symbol.charAt(0)}
                  </span>
                </div>
                <div>
                  <div className="font-medium">{crypto.name}</div>
                  <div className="text-gray-400 text-sm">{crypto.symbol}</div>
                </div>
              </div>

              {/* Price Column */}
              <div className="text-right self-center">
                ${Number(parseFloat(crypto.priceUsd).toFixed(2)).toLocaleString()}
              </div>

              {/* Market Cap Column */}
              <div className="text-right self-center hidden md:block text-gray-400">
                ${Number(parseFloat(crypto.marketCapUsd).toFixed(0)).toLocaleString()}
              </div>

              {/* 24h Change Column */}
              <div className="text-right self-center flex items-center justify-end gap-1">
                {parseFloat(crypto.changePercent24Hr) >= 0 ? (
                  <>
                    <TrendingUp className="w-4 h-4 text-green-500" />
                    <span className="text-green-500">
                      {parseFloat(crypto.changePercent24Hr).toFixed(2)}%
                    </span>
                  </>
                ) : (
                  <>
                    <TrendingDown className="w-4 h-4 text-red-500" />
                    <span className="text-red-500">
                      {parseFloat(crypto.changePercent24Hr).toFixed(2)}%
                    </span>
                  </>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
    </div>
  );
}