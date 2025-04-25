"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useCryptoData } from "@/hooks/useCryptoData";

interface CryptoItemProps {
  crypto: {
    id: string;
    symbol: string;
    priceUsd: string;
    changePercent24Hr: string;
  };
}

export function CryptoTicker() {
  const { cryptoData, isLoading, error } = useCryptoData();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  const cryptoArray = Object.values(cryptoData);

  return (
    <div className="bg-[#000] text-white py-4 overflow-hidden">
      <div className="container mx-auto">
        <div className="flex items-center space-x-4 animate-ticker">
          {cryptoArray.map((crypto) => (
            <CryptoItem key={crypto.id} crypto={crypto} />
          ))}
        </div>
      </div>
    </div>
  );
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