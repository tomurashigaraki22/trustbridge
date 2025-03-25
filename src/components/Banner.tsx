"use client"

import { useState, useEffect } from "react"
import { Bitcoin, DollarSign } from "lucide-react"
import { CryptoTicker } from "./CryptoTicker"
import { CryptoCards } from "./CryptoCards"
import { Testimonials } from "./Testimonials"
import { Possibilities } from "./Possibilities"
import { CryptoTable } from "./CryptoTable"
import { WhySwissApp } from "./WhySwissApp"
import Image from "next/image"
import Link from "next/link"
import { MarketSection } from "./MarketSection"
import { InvestmentPackages } from "./InvestmentPackages"

const cryptoOptions = [
    { value: "BTC", label: "Bitcoin", icon: Bitcoin, color: "#f7931a" },
    { value: "USDT", label: "Tether", icon: DollarSign, color: "#26a17b" },
]

export function Banner() {

    useEffect(() => {
        // Replace technical analysis with market overview widget
        const marketScript = document.createElement('script')
        marketScript.src = "https://s3.tradingview.com/external-embedding/embed-widget-market-overview.js"
        marketScript.type = 'text/javascript'
        marketScript.async = true
        marketScript.innerHTML = `
            {
                "colorTheme": "dark",
                "dateRange": "1Y",
                "showChart": true,
                "locale": "en",
                "largeChartUrl": "",
                "isTransparent": true,
                "showSymbolLogo": true,
                "width": "100%",
                "height": "400",
                "plotLineColorGrowing": "rgba(41, 98, 255, 1)",
                "plotLineColorFalling": "rgba(41, 98, 255, 1)",
                "gridLineColor": "rgba(42, 46, 57, 0)",
                "scaleFontColor": "rgba(120, 123, 134, 1)",
                "belowLineFillColorGrowing": "rgba(41, 98, 255, 0.12)",
                "belowLineFillColorFalling": "rgba(41, 98, 255, 0.12)",
                "symbolActiveColor": "rgba(41, 98, 255, 0.12)",
                "tabs": [
                    {
                        "title": "Crypto",
                        "symbols": [
                            {
                                "s": "BINANCE:BTCUSDT",
                                "d": "Bitcoin / TetherUS"
                            },
                            {
                                "s": "BINANCE:ETHUSDT",
                                "d": "Ethereum / TetherUS"
                            },
                            {
                                "s": "BINANCE:LTCUSDT",
                                "d": "Litecoin / TetherUS"
                            },
                            {
                                "s": "BINANCE:BNBUSDT",
                                "d": "Binance Coin / TetherUS"
                            }
                        ]
                    }
                ]
            }`
        document.getElementById('tradingview-market')?.appendChild(marketScript)

        return () => {
            document.getElementById('tradingview-market')?.removeChild(marketScript)
        }
    }, [])

    return (
        <div className="bg-[#030614] text-white relative overflow-hidden">

            {/* main banner  */}
            <div className="px-4 md:px-8 lg:px-12 py-16 md:py-24 lg:py-32 relative  bg-[#040614] max-w-[1440px] mx-auto">
                <Image
                    src="/bg.png"
                    alt="Background"
                    fill
                    className="object-cover object-center opacity-10"
                    priority
                />

                {/* Flex container for side-by-side layout on PC */}
                <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
                    {/* Text content */}
                    <div className="w-full lg:w-1/2 text-center lg:text-left">
                        <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold mb-8 leading-tight tracking-tight font-sans">
                            A World-Class<br />
                            <span className="bg-gradient-to-r from-[#f7931a] to-[#f7931a]/70 text-transparent bg-clip-text">
                                Trading Experience
                            </span>
                        </h1>
                        <p className="text-gray-300 text-lg md:text-xl max-w-2xl lg:max-w-none mx-auto leading-relaxed font-light">
                            Be empowered to trade the financial markets. Get advanced tools,
                            personalized support, and uncompromising security.
                        </p>
                        <Link
                            href="/register"
                            className="inline-block bg-[#f7931a] text-white px-8 py-4 rounded-lg hover:bg-[#f7931a]/90 transition-colors mt-8 text-lg font-medium"
                        >
                            Start Trading Now
                        </Link>
                    </div>

                    {/* Market widget */}
                    <div className="w-full lg:w-1/2">
                        <div className="bg-black/30 backdrop-blur-sm rounded-xl p-4 h-[350px] md:h-[400px]">
                            <div id="tradingview-market" className="h-full w-full">
                                <div className="tradingview-widget-container">
                                    <div className="tradingview-widget-container__widget"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* end of main banner */}
            <div className="container mx-auto px-4 py-8 md:py-16 relative">

                {/* Keep existing components */}
                <CryptoTicker />
                <Possibilities />
                <InvestmentPackages />
                <CryptoTable />
                <MarketSection />
                <CryptoCards />
                <WhySwissApp />
                <Testimonials />
            </div>
        </div>
    )
}

