"use client"

import {  useEffect, useState } from "react"
import { Sidebar } from "@/components/dashboard/Sidebar"
import { TopBar } from "@/components/dashboard/TopBar"
import {  Copy, Check } from 'lucide-react'
 import { useRouter } from "next/navigation"
import Cookies from "js-cookie"
import { useUserData } from "@/hooks/useUserData"
import { useCryptoData } from "@/hooks/useCryptoData"
import { getCryptoName } from "@/lib/getCryptoName"

export default function P2PPage() {
    const router = useRouter()
    const { userData, isLoading, refetch } = useUserData()
    const { cryptoData } = useCryptoData()
    const [recipientTag, setRecipientTag] = useState("")
    const [amount, setAmount] = useState("")
    const [isUSD] = useState(true)
    const [error, setError] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [copied, setCopied] = useState(false)

    const availableCoins = Object.entries(userData?.user || {})
        .filter(([key]) => key.endsWith("_balance"))
        .map(([key, balance]) => {
            const symbol = key.replace("_balance", "").toUpperCase()
            const cryptosymbol = getCryptoName(symbol, "lowercase-hyphen")
            const priceUsd = cryptoData[cryptosymbol]?.priceUsd || 0
            return {
                symbol,
                balance: Number(balance || 0),
                priceUsd: Number(priceUsd)
            }
        })
        .filter((coin) => coin.balance > 0)

    const [selectedCrypto, setSelectedCrypto] = useState<typeof availableCoins[0] | null>(null)

    useEffect(() => {
        if (availableCoins.length > 0 && !selectedCrypto) {
            setSelectedCrypto(availableCoins[0])
        }
    }, [availableCoins, selectedCrypto])

    const cryptoAmount = isUSD ? Number(amount) / (selectedCrypto?.priceUsd || 1) : Number(amount)
    const usdAmount = isUSD ? Number(amount) : Number(amount) * (selectedCrypto?.priceUsd || 1)
    const mainAmount = isUSD ? Number(amount) : Number(amount)

    const copyToClipboard = async () => {
        if (userData?.user.username) {
            await navigator.clipboard.writeText(userData.user.username)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")
        setIsSubmitting(true)

        if (!selectedCrypto) {
            setError("Please select a cryptocurrency")
            setIsSubmitting(false)
            return
        }


        console.log(usdAmount)
        try {
            const token = Cookies.get("auth-token")
            const response = await fetch("/api/transactions/p2p", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    recipientTag,
                    amount: cryptoAmount,
                    currency: selectedCrypto.symbol,
                    mainAmount
                }),
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.error || "Transaction failed")
            }

            await refetch()
            router.push(
                `/dashboard/transactions/success?amount=${mainAmount}&symbol=${selectedCrypto.symbol}&type=p2p&to=${recipientTag}`,
            )
        } catch (error) {
            setError(error instanceof Error ? error.message : "Transaction failed")
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="min-h-screen bg-[#111111] text-white pb-[5rem]">
            <div className="flex flex-col lg:flex-row">
                <Sidebar />
                <div className="flex-1 ">
                    <TopBar title="P2P Transfer" notices={userData?.notices} />
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

                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-2xl font-bold">Send to User</h2>
                                    <select
                                        value={selectedCrypto?.symbol}
                                        onChange={(event) => {
                                            const value = event.target.value;
                                            const crypto = availableCoins.find((c) => c.symbol === value);
                                            if (crypto) setSelectedCrypto(crypto);
                                        }}
                                        className="bg-[#1A1A1A] text-white px-3 py-2 rounded-lg"
                                    >
                                        {availableCoins.map((crypto) => (
                                            <option key={crypto.symbol} value={crypto.symbol}>
                                                {crypto.symbol} ($
                                                {crypto.balance.toLocaleString("en-US", {
                                                    minimumFractionDigits: 2,
                                                    maximumFractionDigits: 2,
                                                })})
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="bg-[#1A1A1A] p-4 rounded-lg mb-6">
                                    <div className="text-sm text-gray-400 mb-2">Your Transfer Tag</div>
                                    <div className="flex items-center gap-2">
                                        <code className="bg-[#242424] px-3 py-2 rounded flex-1">
                                            {userData?.user.username || '...'}
                                        </code>
                                        <button
                                            onClick={copyToClipboard}
                                            className="p-2 hover:bg-[#2A2A2A] rounded"
                                        >
                                            {copied ? <Check size={20} className="text-green-500" /> : <Copy size={20} />}
                                        </button>
                                    </div>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div>
                                        <div className="flex items-center justify-between mb-2">
                                            <label className="text-sm text-gray-400">
                                                Recipient Tag
                                            </label>
                                        </div>
                                        <input
                                            type="text"
                                            value={recipientTag}
                                            onChange={(e) => setRecipientTag(e.target.value)}
                                            className="w-full bg-[#1A1A1A] rounded-lg border border-gray-800 px-4 py-2.5 focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                                            placeholder="Enter recipient's tag"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <div className="flex items-center justify-between mb-2">
                                            <label className="text-sm text-gray-400">Amount</label>

                                        </div>
                                        <div className="relative">
                                            <input
                                                type="number"
                                                value={amount}
                                                onChange={(e) => setAmount(e.target.value)}
                                                className="w-full bg-[#1A1A1A] rounded-lg border border-gray-800 px-4 py-2.5 focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                                                placeholder="0.00"
                                                required
                                                step="any"
                                            />
                                            {amount && (
                                                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-gray-400">
                                                    ≈ {isUSD ? `${cryptoAmount.toFixed(8)} ${selectedCrypto?.symbol}` : `$${usdAmount.toFixed(2)}`}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-50 disabled:hover:bg-orange-500 rounded-lg px-4 py-3 text-white font-medium"
                                    >
                                        {isSubmitting ? 'Processing...' : 'Send'}
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