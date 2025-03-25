"use client";

import { motion } from "framer-motion";
import { notFound } from 'next/navigation';
import { useEffect } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { use } from 'react';

const marketData = {
    forex: {
        title: "Forex Trading",
        description: "Trade the global foreign exchange market with competitive spreads and leverage up to 1:500. Access major, minor, and exotic currency pairs with advanced trading tools.",
        features: [
            "Access to 50+ currency pairs",
            "Competitive spreads from 0.1 pips",
            "Leverage up to 1:500",
            "24/5 market access",
            "Expert market analysis",
            "Advanced charting tools"
        ],
        symbol: "FX:EURUSD"
    },
    stocks: {
        title: "Stocks Trading",
        description: "Trade shares of the world's leading companies with competitive commissions. Access major stock exchanges and diversify your portfolio.",
        features: [
            "Access to global stock markets",
            "Real-time market data",
            "Zero commission trading",
            "Fractional shares available",
            "Pre and post-market trading",
            "Dividend tracking"
        ],
        symbol: "NASDAQ:AAPL"
    },
    commodities: {
        title: "Commodities Trading",
        description: "Trade a wide range of commodities including precious metals, energy products, and agricultural goods with competitive pricing.",
        features: [
            "Trade gold, silver, oil, and more",
            "Competitive spreads",
            "Real-time price updates",
            "Market analysis tools",
            "Multiple contract sizes",
            "Physical delivery options"
        ],
        symbol: "COMEX:GC1!"
    },
    crypto: {
        title: "Cryptocurrency Trading",
        description: "Trade popular cryptocurrencies with advanced tools and analysis. Access the crypto market 24/7 with secure wallet integration.",
        features: [
            "50+ cryptocurrency pairs",
            "24/7 trading availability",
            "Real-time market data",
            "Secure wallet integration",
            "Cold storage security",
            "Instant deposits and withdrawals"
        ],
        symbol: "BINANCE:BTCUSDT"
    },
    indices: {
        title: "Indices Trading",
        description: "Trade major global indices and track market performance across different regions and sectors.",
        features: [
            "Access to major world indices",
            "Competitive spreads",
            "Leverage available",
            "Real-time price updates",
            "Technical analysis tools",
            "Market news and updates"
        ],
        symbol: "FOREXCOM:SPXUSD"
    },
    etfs: {
        title: "ETFs Trading",
        description: "Trade Exchange-Traded Funds for diversified exposure to various markets, sectors, and asset classes.",
        features: [
            "Wide range of ETFs available",
            "Low transaction costs",
            "Portfolio diversification",
            "Real-time pricing",
            "Transparent holdings",
            "Flexible trading options"
        ],
        symbol: "AMEX:SPY"
    },
    bonds: {
        title: "Bonds Trading",
        description: "Access government and corporate bonds for stable income opportunities and portfolio diversification.",
        features: [
            "Government and corporate bonds",
            "Fixed income opportunities",
            "Regular interest payments",
            "Portfolio diversification",
            "Long-term investment options",
            "Secondary market trading"
        ],
        symbol: "TVC:US10Y"
    }
};

export default function MarketPage({ params }: { params: Promise<{ type: string }> }) {
    const resolvedParams = use(params);
    
    if (!marketData[resolvedParams.type as keyof typeof marketData]) {
        notFound();
    }

    const data = marketData[resolvedParams.type as keyof typeof marketData];
    
    useEffect(() => {
        const script = document.createElement('script');
        script.src = "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
        script.type = 'text/javascript';
        script.async = true;
        script.innerHTML = `
            {
                "autosize": true,
                "symbol": "${data.symbol}",
                "interval": "D",
                "timezone": "Etc/UTC",
                "theme": "dark",
                "style": "1",
                "locale": "en",
                "enable_publishing": false,
                "backgroundColor": "rgba(0, 0, 0, 0.5)",
                "gridColor": "rgba(255, 255, 255, 0.06)",
                "hide_top_toolbar": true,
                "hide_legend": true,
                "save_image": false,
                "calendar": false,
                "hide_volume": true,
                "support_host": "https://www.tradingview.com"
            }`;
        document.getElementById('tradingview-widget')?.appendChild(script);
    
        return () => {
            document.getElementById('tradingview-widget')?.removeChild(script);
        };
    }, [data.symbol]);

    return (
        <>
            <Header />
            <div className="py-20 relative overflow-hidden bg-[#030614] min-h-screen">
                <div className="container mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center mb-16"
                    >
                        <h1 className="text-4xl md:text-5xl font-bold mb-6">{data.title}</h1>
                        <p className="text-gray-400 max-w-4xl mx-auto text-lg">
                            {data.description}
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-2 gap-8">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="backdrop-blur-xl bg-gradient-to-br from-[#121212]/60 to-[#121212]/40 
                            rounded-2xl p-8 border border-gray-800/50"
                        >
                            <h2 className="text-2xl font-bold mb-6">Key Features</h2>
                            <ul className="space-y-4">
                                {data.features.map((feature, index) => (
                                    <motion.li
                                        key={index}
                                        className="flex items-center gap-3"
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                    >
                                        <span className="w-2 h-2 bg-[#8B5CF6] rounded-full" />
                                        <span className="text-gray-300">{feature}</span>
                                    </motion.li>
                                ))}
                            </ul>
                        </motion.div>

                        <div className="space-y-8">
                            <div className="bg-black/30 backdrop-blur-sm rounded-xl p-4 h-[400px]">
                                <div id="tradingview-widget" className="h-full w-full">
                                    <div className="tradingview-widget-container">
                                        <div className="tradingview-widget-container__widget"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}
