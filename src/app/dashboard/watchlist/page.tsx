"use client"

import { Sidebar } from "@/components/dashboard/Sidebar"
import { TopBar } from "@/components/dashboard/TopBar"
import { ArrowDown, ArrowUp, Search } from "lucide-react"
import { useUserData } from "@/hooks/useUserData"
import { useCryptoData } from "@/hooks/useCryptoData"
import { Suspense, useState } from "react"
import { useRouter } from "next/navigation"
import { useSearchParams } from "next/navigation"

function WatchlistContent() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const { userData } = useUserData()
    const { cryptoData } = useCryptoData()
    const [searchTerm, setSearchTerm] = useState(searchParams.get("search") || "")

    const supportedCryptos = [
        "BTC", "ETH", "USDT", "BNB", "XRP", "ADA",
        "DOGE", "SOL", "DOT", "MATIC", "LINK", "UNI",
        "AVAX", "LTC", "SHIB"
    ]

    const cryptoList = supportedCryptos
        .map(symbol => {
            const cryptoInfo = Object.values(cryptoData).find(crypto => crypto.symbol === symbol)
            return cryptoInfo ? {
                mysymbol: symbol,
                ...cryptoInfo
            } : null
        })
        .filter((crypto): crypto is NonNullable<typeof crypto> => crypto !== null)
        .filter(crypto =>
            crypto.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
            crypto.name.toLowerCase().includes(searchTerm.toLowerCase())
        )

    const handleRowClick = (symbol: string) => {
        router.push(`/dashboard/portfolio/${symbol}`)
    }

    const handleSearch = (value: string) => {
        setSearchTerm(value)
        const params = new URLSearchParams(searchParams.toString())
        if (value) {
            params.set("search", value)
        } else {
            params.delete("search")
        }
        router.replace(`/dashboard/watchlist?${params.toString()}`)
    }

    return (
        <div className="min-h-screen bg-[#111111] text-white">
            <div className="flex flex-col lg:flex-row">
                <Sidebar />
                <div className="flex-1 ">
                    <TopBar title="Watchlist" notices={userData?.notices} />
                    <div className="p-4 lg:p-8">
                        <div className="mb-6">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search cryptocurrencies..."
                                    className="w-full rounded-lg bg-[#121212] py-2 pl-10 pr-4 text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
                                    value={searchTerm}
                                    onChange={(e) => handleSearch(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-gray-800">
                                        <th className="whitespace-nowrap px-4 py-3 text-left text-sm font-medium text-gray-400">Asset</th>
                                        <th className="whitespace-nowrap px-4 py-3 text-right text-sm font-medium text-gray-400">Price</th>
                                        <th className="whitespace-nowrap px-4 py-3 text-right text-sm font-medium text-gray-400">24h Change</th>
                                        <th className="whitespace-nowrap px-4 py-3 text-right text-sm font-medium text-gray-400">Market Cap</th>
                                        <th className="whitespace-nowrap px-4 py-3 text-right text-sm font-medium text-gray-400">Volume (24h)</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {cryptoList.map((crypto) => (
                                        <tr
                                            key={crypto!.symbol}
                                            onClick={() => handleRowClick(crypto!.symbol)}
                                            className="border-b border-gray-800/50 cursor-pointer hover:bg-[#121212] transition-colors"
                                        >
                                            <td className="whitespace-nowrap px-4 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-500/20">
                                                        <span className="text-lg text-purple-500">{crypto!.symbol.charAt(0)}</span>
                                                    </div>
                                                    <div>
                                                        <div className="font-medium">{crypto!.symbol}</div>
                                                        <div className="text-sm text-gray-400">{crypto!.name}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="whitespace-nowrap px-4 py-4 text-right">
                                                ${Number(crypto!.priceUsd).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                            </td>
                                            <td className="whitespace-nowrap px-4 py-4 text-right">
                                                <span className={`flex items-center justify-end gap-1 ${Number(crypto!.changePercent24Hr) >= 0 ? "text-green-500" : "text-red-500"}`}>
                                                    {Number(crypto!.changePercent24Hr) >= 0 ? (
                                                        <ArrowUp className="h-4 w-4" />
                                                    ) : (
                                                        <ArrowDown className="h-4 w-4" />
                                                    )}
                                                    {Math.abs(Number(crypto!.changePercent24Hr)).toFixed(2)}%
                                                </span>
                                            </td>
                                            <td className="whitespace-nowrap px-4 py-4 text-right">
                                                ${Number(crypto!.marketCapUsd).toLocaleString("en-US", { maximumFractionDigits: 0 })}
                                            </td>
                                            <td className="whitespace-nowrap px-4 py-4 text-right">
                                                ${Number(crypto!.volumeUsd24Hr).toLocaleString("en-US", { maximumFractionDigits: 0 })}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default function WatchlistPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-[#111111] text-white flex items-center justify-center">
                Loading...
            </div>
        }>
            <WatchlistContent />
        </Suspense>
    )
}