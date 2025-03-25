"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface CryptoData {
  id: string;
  symbol: string;
  name: string;
  priceUsd: string;
  changePercent24Hr: string;
}

interface ApiResponse {
  data: CryptoData[];
}

export function CryptoCards() {
  const [cryptoData, setCryptoData] = useState<CryptoData[]>([]);

  useEffect(() => {
    const fetchCryptoData = async () => {
      try {
        const response = await fetch("https://api.coincap.io/v2/assets?limit=4");
        
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
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 py-[3rem] lg:grid-cols-4 gap-6">
      {cryptoData.map((crypto) => (
        <motion.div
          key={crypto.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          whileHover={{
            scale: 1.05, // Scale the card slightly on hover
            transition: { duration: 0.2 }
          }}
          className="text-center backdrop-blur-sm bg-[#121212]/40 p-4 md:px-6 py-[2rem] rounded-[1rem] border border-gray-800/50 relative overflow-hidden"
        >
          <div className="absolute top-40 left-50 w-80 md:w-80 h-36 md:h-72 bg-[#8B5CF6]/10 rounded-full blur-[150px] md:blur-[120px]" />

          <div className="bg-[#2a2a2a] w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-[#f7931a] text-lg md:text-xl font-bold">
              {crypto.symbol.toUpperCase()}
            </span>
          </div>

          <h3 className="text-lg md:text-xl font-bold mb-2">{crypto.name}</h3>
          <p className="text-gray-400 text-sm md:text-base">
            Price: ${parseFloat(crypto.priceUsd).toFixed(2)}
          </p>
          <p
            className={`text-sm ${
              parseFloat(crypto.changePercent24Hr) >= 0 ? "text-green-500" : "text-red-500"
            }`}
          >
            24h Change: {parseFloat(crypto.changePercent24Hr).toFixed(2)}%
          </p>
        </motion.div>
      ))}
    </div>
  );
}