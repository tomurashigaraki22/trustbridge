"use client"

import { use, useEffect, useMemo, useState } from "react"
import { Sidebar } from "@/components/dashboard/Sidebar"
import { TopBar } from "@/components/dashboard/TopBar"
import { ArrowDownUp } from "lucide-react"
import { useRouter } from "next/navigation"
import Cookies from "js-cookie"
import { useUserData } from "@/hooks/useUserData"
import { useCryptoData } from "@/hooks/useCryptoData"
import { getCryptoName } from "@/lib/getCryptoName"

export default function SwapPage({ searchParams }: { searchParams: Promise<{ symbol: string }> }) {
    const router = useRouter()
    const { userData, isLoading, refetch } = useUserData()
    const { cryptoData } = useCryptoData()
    const resolvedParams = use(searchParams)
    const [amount, setAmount] = useState("")
    const [error, setError] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)

    const availableCoins = useMemo(() => {
        if (!userData?.user || !cryptoData) return []

        return Object.entries(userData.user)
            .filter(([key]) => key.endsWith("_balance"))
            .map(([key, balance]) => {
                const symbol = key.replace("_balance", "").toUpperCase()
                const cryptosymbol = getCryptoName(symbol, "lowercase-hyphen")
                const priceUsd = cryptoData[cryptosymbol]?.priceUsd || 0
                const name = cryptoData[symbol.toLowerCase()]?.name || symbol
                return {
                    symbol,
                    name,
                    balance: Number(balance || 0),
                    priceUsd: Number(priceUsd),
                }
            })
    }, [userData, cryptoData])

    const [fromCrypto, setFromCrypto] = useState(
        availableCoins.find((c) => c.symbol === resolvedParams.symbol) || availableCoins[0]
    )
    const [toCrypto, setToCrypto] = useState(availableCoins[1])

    useEffect(() => {
        if (availableCoins.length > 0) {
            setFromCrypto(availableCoins.find((c) => c.symbol === resolvedParams.symbol) || availableCoins[0])
            setToCrypto(availableCoins[1])
        }
    }, [availableCoins, resolvedParams.symbol])

    const usdAmount = Number(amount)
    const fee = usdAmount * 0.001 // 0.1% fee
    const finalAmount = usdAmount - fee

    const handleSwitch = () => {
        const temp = fromCrypto
        setFromCrypto(toCrypto)
        setToCrypto(temp)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")
        setIsSubmitting(true)

        if (!fromCrypto || !toCrypto) {
            setError("Please select cryptocurrencies")
            setIsSubmitting(false)
            return
        }

        const fromCryptoAmount = usdAmount; 
        if (fromCryptoAmount > fromCrypto.balance) {
            setError(`Insufficient ${fromCrypto.symbol} balance`)
            setIsSubmitting(false)
            return
        }

        try {
            const token = Cookies.get("auth-token")
            const response = await fetch("/api/transactions/swap", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    fromAmount: fromCryptoAmount.toFixed(8),
                    fromCurrency: fromCrypto.symbol,
                    toCurrency: toCrypto.symbol,
                    toAmount: (finalAmount).toFixed(8),
                    fee: (fee),
                    usdAmount: amount
                }),
            })

            const data = await response.json()
            if (!response.ok) {
                throw new Error(data.error || "Swap failed")
            }

            await refetch()
            router.push(`/dashboard/transactions/success?amount=${Number(amount)}&toAmount=${(finalAmount).toFixed(8)}&fromSymbol=${fromCrypto.symbol}&toSymbol=${toCrypto.symbol}&type=swap`)
        } catch (error) {
            setError(error instanceof Error ? error.message : "Swap failed")
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="min-h-screen bg-[#111111] text-white pb-[5rem]">
            <div className="flex flex-col lg:flex-row">
                <Sidebar />
                <div className="flex-1 ">
                    <TopBar title="Swap" notices={userData?.notices} />
                    {isLoading ? (
                        <div>Loading...</div>
                    ) : (
                        <div className="p-4 lg:p-8 max-w-6xl mx-auto">
                            <div className="bg-[#121212] rounded-[1rem] p-6">
                                {error && (
                                    <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500">
                                        {error}
                                    </div>
                                )}

                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="space-y-4">
                                        <div className="bg-[#1A1A1A] p-4 rounded-lg">
                                            <div className="flex items-center justify-between mb-2">
                                                <label className="text-sm text-gray-400">From</label>
                                                <select
                                                    value={fromCrypto?.symbol}
                                                    onChange={(event) => {
                                                        const value = event.target.value;
                                                        const crypto = availableCoins.find((c) => c.symbol === value);
                                                        if (crypto) setFromCrypto(crypto);
                                                    }}
                                                    className="bg-[#1A1A1A] text-white px-3 py-2 rounded-lg shadow-xl"
                                                >
                                                    {availableCoins.map((crypto) => (
                                                        <option key={crypto.symbol} value={crypto.symbol}>
                                                            {crypto.symbol} (Balance: ${(crypto.balance).toFixed(2)})
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div className="relative">
                                                <input
                                                    type="number"
                                                    value={amount}
                                                    onChange={(e) => setAmount(e.target.value)}
                                                    className="w-full bg-[#242424] rounded-lg p-3 text-white"
                                                    placeholder="0.00"
                                                    required
                                                />
                                                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-gray-400">
                                                    USD
                                                </div>
                                            </div>
                                        </div>

                                        <button
                                            type="button"
                                            onClick={handleSwitch}
                                            className="mx-auto block p-2 hover:bg-[#242424] rounded-full transition-colors"
                                        >
                                            <ArrowDownUp className="h-6 w-6" />
                                        </button>

                                        <div className="bg-[#1A1A1A] p-4 rounded-lg">
                                            <div className="flex items-center justify-between mb-2">
                                                <label className="text-sm text-gray-400">To</label>
                                                <select
                                                    value={toCrypto?.symbol}
                                                    onChange={(event) => {
                                                        const value = event.target.value;
                                                        const crypto = availableCoins.find((c) => c.symbol === value);
                                                        if (crypto) setToCrypto(crypto);
                                                    }}
                                                    className="bg-[#1A1A1A] text-white px-3 py-2 rounded-lg shadow-xl"
                                                >
                                                    {availableCoins.map((crypto) => (
                                                        <option key={crypto.symbol} value={crypto.symbol}>
                                                            {crypto.symbol} (Balance: ${(crypto.balance).toFixed(2)})
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div className="w-full bg-[#242424] rounded-lg p-3 text-white">
                                                ${finalAmount.toFixed(2)}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-[#1A1A1A] p-4 rounded-lg space-y-3">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-400">Rate</span>
                                            <span>1 USD = 1 USD</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-400">Fee (0.1%)</span>
                                            <span>${fee.toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-400">You will receive</span>
                                            <span>${finalAmount.toFixed(2)}</span>
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="w-full bg-orange-500 hover:bg-orange-600 py-3 rounded-lg font-medium transition-colors disabled:opacity-50"
                                    >
                                        {isSubmitting ? "Processing..." : "Swap"}
                                    </button>
                                </form>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}