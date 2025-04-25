"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TrendingUp, TrendingDown } from "lucide-react";
import { useCryptoData } from "@/hooks/useCryptoData";

export function CryptoTable() {
  const { cryptoData, isLoading, error } = useCryptoData();
  const [currentIndex, setCurrentIndex] = useState(0);

  // Convert object to array and take first 5 items
  const cryptoArray = Object.values(cryptoData).slice(0, 5);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % cryptoArray.length);
    }, 3000);

    return () => clearInterval(timer);
  }, [cryptoArray.length]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="w-full overflow-x-auto pb-[5rem]">
      <div className="min-w-[768px] bg-[#121212]/40 backdrop-blur-xl rounded-lg border border-gray-800/50">
        <div className="grid grid-cols-4 gap-4 p-4 border-b border-gray-800/50 bg-black/20">
          <div className="text-gray-400">Asset</div>
          <div className="text-right text-gray-400">Price</div>
          <div className="text-right text-gray-400">Market Cap</div>
          <div className="text-right text-gray-400">24h Change</div>
        </div>

        <div className="relative h-[400px] overflow-hidden">
          <AnimatePresence mode="popLayout">
            {cryptoArray.map((crypto, index) => (
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

                <div className="text-right self-center">
                  ${Number(parseFloat(crypto.priceUsd).toFixed(2)).toLocaleString()}
                </div>

                <div className="text-right self-center hidden md:block text-gray-400">
                  ${Number(parseFloat(crypto.marketCapUsd).toFixed(0)).toLocaleString()}
                </div>

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