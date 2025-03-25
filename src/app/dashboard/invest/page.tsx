"use client"

import { useState, useEffect, useCallback } from "react"
import { Sidebar } from "@/components/dashboard/Sidebar"
import { TopBar } from "@/components/dashboard/TopBar"
import { ChevronDown } from "lucide-react"
import { useRouter } from "next/navigation"
import { useUserData } from "@/hooks/useUserData"
import Cookies from "js-cookie"
import { InvestmentList } from "@/components/dashboard/InvestmentList"
// Type definitions
interface RawPackage extends InvestmentPackage {
    features: string[];
}
type Currency =
    | "BTC"
    | "ETH"
    | "USDT"
    | "BNB"
    | "XRP"
    | "ADA"
    | "DOGE"
    | "SOL"
    | "DOT"
    | "MATIC"
    | "LINK"
    | "UNI"
    | "AVAX"
    | "LTC"
    | "SHIB"

interface InvestmentPackage {
    id: number
    name: string
    min_amount_usd: number
    max_amount_usd: number
    duration_days: number
    min_roi: number
    max_roi: number
    risk_level: "low" | "medium" | "high"
    description: string
    features: string[]
    is_active: boolean
}

interface UserInvestment {
    id: number
    package_name: string
    amount_usd: number
    currency: string
    start_date: string
    end_date: string
    daily_roi: string      // Changed from string[] to string to match InvestmentList component
    current_value_usd: number
    auto_compound: boolean
    duration_days: number
    min_roi: number
    max_roi: number
    status: 'active' | 'completed' | 'cancelled';

}

export default function InvestPage() {
    const router = useRouter()
    const { userData, refetch } = useUserData()

    const [investmentPackages, setInvestmentPackages] = useState<InvestmentPackage[]>([])
    const [userInvestments, setUserInvestments] = useState<UserInvestment[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const [selectedCurrency, setSelectedCurrency] = useState<Currency>("BTC")
    const [showCurrencyDropdown, setShowCurrencyDropdown] = useState(false)
    const [autoCompound, setAutoCompound] = useState(false)
    const [showConfirm, setShowConfirm] = useState(false)
    const [selectedPackage, setSelectedPackage] = useState<InvestmentPackage | null>(null)
    const [amount, setAmount] = useState("")
    const [errorMessage, setErrorMessage] = useState<string | null>(null)

    const handleRefetch = useCallback(async () => {
        await refetch()
    }, [refetch])


    useEffect(() => {
        const interval = setInterval(() => {
            handleRefetch()
        }, 5000)
        return () => clearInterval(interval)
    }, [handleRefetch])

    const assets = [
        { name: "BTC", balance: Number(userData?.user.btc_balance || "0") },
        { name: "ETH", balance: Number(userData?.user.eth_balance || "0") },
        { name: "USDT", balance: Number(userData?.user.usdt_balance || "0") },
        { name: "BNB", balance: Number(userData?.user.bnb_balance || "0") },
        { name: "XRP", balance: Number(userData?.user.xrp_balance || "0") },
        { name: "ADA", balance: Number(userData?.user.ada_balance || "0") },
        { name: "DOGE", balance: Number(userData?.user.doge_balance || "0") },
        { name: "SOL", balance: Number(userData?.user.sol_balance || "0") },
        { name: "DOT", balance: Number(userData?.user.dot_balance || "0") },
        { name: "MATIC", balance: Number(userData?.user.matic_balance || "0") },
        { name: "LINK", balance: Number(userData?.user.link_balance || "0") },
        { name: "UNI", balance: Number(userData?.user.uni_balance || "0") },
        { name: "AVAX", balance: Number(userData?.user.avax_balance || "0") },
        { name: "LTC", balance: Number(userData?.user.ltc_balance || "0") },
        { name: "SHIB", balance: Number(userData?.user.shib_balance || "0") },
    ]
        .map((asset) => ({
            ...asset,
            balance: Number(asset.balance),
            formattedBalance: Number(asset.balance).toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 6,
            }),
        }))
        


    useEffect(() => {
        const fetchPackages = async () => {
            try {
                const token = Cookies.get("auth-token")
                const response = await fetch("/api/investments", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                })

                if (!response.ok) throw new Error("Failed to fetch investment packages")

                const data = await response.json()
                if (data.success) {
                    const transformedPackages = data.packages.map((pkg: RawPackage) => ({
                        ...pkg,
                        features: Array.isArray(pkg.features)
                            ? pkg.features
                            : typeof pkg.features === "string"
                                ? JSON.parse(pkg.features)
                                : [],
                    }))
                    setInvestmentPackages(transformedPackages)
                } else {
                    throw new Error(data.error || "Failed to fetch investment packages")
                }
            } catch (err) {
                setError(err instanceof Error ? err.message : "Failed to load packages")
            } finally {
                setLoading(false)
            }
        }

        const fetchUserInvestments = async () => {
            try {
                const token = Cookies.get("auth-token")
                const response = await fetch("/api/investments/user", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                })

                if (!response.ok) throw new Error("Failed to fetch user investments")

                const data = await response.json()
                if (data.success) {
                    setUserInvestments(data.investments)
                } else {
                    throw new Error(data.error || "Failed to fetch user investments")
                }
            } catch (err) {
                setError(err instanceof Error ? err.message : "Failed to load user investments")
            }
        }

        fetchPackages()
        fetchUserInvestments()
    }, [])

    const handleInvest = (pkg: InvestmentPackage) => {
        setSelectedPackage(pkg)
        setShowConfirm(true)
    }

    const confirmInvestment = async () => {
        if (!amount || !selectedPackage || !selectedCurrency) {
            setErrorMessage("Please fill in all fields")
            return
        }

        const amountNum = Number.parseFloat(amount)
        if (isNaN(amountNum)) {
            setErrorMessage("Please enter a valid amount")
            return
        }

        const minAmount = selectedPackage.min_amount_usd
        const maxAmount = selectedPackage.max_amount_usd

        if (amountNum < minAmount) {
            setErrorMessage(
                `Amount is below the minimum of $${minAmount.toLocaleString("en-US", { minimumFractionDigits: 2 })}`,
            )
            return
        }

        if (amountNum > maxAmount) {
            setErrorMessage(
                `Amount is above the maximum of $${maxAmount.toLocaleString("en-US", { minimumFractionDigits: 2 })}`,
            )
            return
        }

        try {
            const token = Cookies.get("auth-token")

            const response = await fetch("/api/investments", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    packageId: selectedPackage.id,
                    amountUsd: amountNum,
                    currency: selectedCurrency,
                    autoCompound,
                }),
            })

            const data = await response.json()

            if (data.success) {
                router.push(
                    `/dashboard/transactions/success?type=investment&package=${selectedPackage.name}&amount=${amount}&currency=${selectedCurrency}&autoCompound=${autoCompound}`,
                )
            } else {
                throw new Error(data.error || "Investment failed")
            }
        } catch (error) {
            setErrorMessage(error instanceof Error ? error.message : "Investment failed")
        }
    }

    return (
        <div className="min-h-screen bg-[#111111] text-white pb-[5rem]">
            <div className="flex flex-col lg:flex-row">
                <Sidebar />
                <div className="flex-1 ">
                    <TopBar title="Investment" notices={userData?.notices} />
                    <div className="p-4 lg:p-8">
                        {/* Active Investments */}
                    
                        {/* Investment Packages */}
                        <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-semibold">Investment Packages</h2>
                                <button
                                    onClick={() => router.push('/dashboard/investments')}
                                    className="text-orange-500 hover:text-orange-600"
                                >
                                    View Recent
                                </button>
                            </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {loading ? (
                                <div className="col-span-full text-center py-8">Loading packages...</div>
                            ) : error ? (
                                <div className="col-span-full text-center text-red-500 py-8">{error}</div>
                            ) : (
                                investmentPackages.map((pkg) => (
                                    <div key={pkg.id} className="bg-[#000] rounded-[1rem] p-6 relative overflow-hidden">
                                        {pkg.risk_level === "low" && (
                                            <div className="absolute top-4 right-4 bg-green-500/20 text-green-500 px-3 py-1 rounded-full text-sm">
                                                Recommended
                                            </div>
                                        )}

                                        <h3 className="text-xl font-semibold mb-2">{pkg.name}</h3>
                                        <p className="text-gray-400 text-sm mb-4">{pkg.description}</p>

                                        <div className="space-y-3 mb-6">
                                            <div className="flex justify-between">
                                                <span className="text-gray-400">Min Amount</span>
                                                <span>${pkg.min_amount_usd.toLocaleString("en-US", { minimumFractionDigits: 2 })}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-400">Max Amount</span>
                                                <span>${pkg.max_amount_usd.toLocaleString("en-US", { minimumFractionDigits: 2 })}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-400">Duration</span>
                                                <span>{pkg.duration_days} days</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-400">Expected ROI</span>
                                                <span className="text-green-500">
                                                    {pkg.min_roi}% - {pkg.max_roi}%
                                                </span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-400">Risk Level</span>
                                                <span
                                                    className={`
                            ${pkg.risk_level === "low" ? "text-green-500" : ""}
                            ${pkg.risk_level === "medium" ? "text-yellow-500" : ""}
                            ${pkg.risk_level === "high" ? "text-red-500" : ""}
                          `}
                                                >
                                                    {pkg.risk_level}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="mb-6">
                                            <h4 className="text-sm font-medium mb-2">Features:</h4>
                                            <ul className="space-y-2">
                                                {pkg.features.map((feature, index) => (
                                                    <li key={index} className="text-sm text-gray-400 flex items-center gap-2">
                                                        <div className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                                                        {feature}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>

                                        <button
                                            onClick={() => handleInvest(pkg)}
                                            className="w-full bg-orange-500 hover:bg-orange-600 py-3 rounded-lg font-medium"
                                        >
                                            Invest Now
                                        </button>
                                    </div>
                                ))
                            )}
                        </div>
                        <div className="bg-[#121212] rounded-[1rem] p-6 mb-6">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-semibold">Recent Investments</h2>
                                <button
                                    onClick={() => router.push('/dashboard/investments')}
                                    className="text-orange-500 hover:text-orange-600"
                                >
                                    View All
                                </button>
                            </div>
                            <InvestmentList investments={userInvestments} limit={3} />
                        </div>

                        {/* Investment Modal */}
                        {showConfirm && selectedPackage && (
                            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
                                <div className="bg-[#121212] rounded-[1rem] p-6 max-w-md w-full mx-4">
                                    <h3 className="text-xl font-semibold mb-4">Confirm Investment</h3>
                                    {errorMessage && (
                                        <div className="mb-4 p-3 bg-red-500/10 border border-red-500 rounded-lg text-red-500">
                                            {errorMessage}
                                        </div>
                                    )}
                                    <div className="space-y-4 mb-6">
                                        <div>
                                            <label className="text-sm text-gray-400">Select Wallet</label>
                                            <div className="relative mt-1">
                                                <button
                                                    onClick={() => setShowCurrencyDropdown(!showCurrencyDropdown)}
                                                    className="w-full bg-[#1A1A1A] rounded-lg p-3 flex items-center justify-between"
                                                >
                                                    <div className="flex items-center gap-2">
                                                        <span>Account Balance</span>
                                                        <span className="text-gray-400">
                                                            (Balance: {assets.find((a) => a.name === selectedCurrency)?.formattedBalance || "0.00"})
                                                        </span>
                                                    </div>
                                                    <ChevronDown size={20} className="text-gray-400" />
                                                </button>

                                                {showCurrencyDropdown && (
                                                    <div className="absolute top-full left-0 mt-2 w-full bg-[#1A1A1A] rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto">
                                                        {assets.filter(assets => assets.name == 'BTC').map((asset) => (
                                                            <button
                                                                key={asset.name}
                                                                onClick={() => {
                                                                    setSelectedCurrency(asset.name as Currency)
                                                                    setShowCurrencyDropdown(false)
                                                                    setErrorMessage(null)
                                                                }}
                                                                className="w-full p-3 text-left hover:bg-[#242424] first:rounded-t-lg last:rounded-b-lg flex items-center justify-between"
                                                            >
                                                                <span>Account Balance</span>
                                                                <span className="text-gray-400">{asset.formattedBalance}</span>
                                                            </button>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <div>
                                            <label className="text-sm text-gray-400">Amount (USD)</label>
                                            <input
                                                type="number"
                                                value={amount}
                                                onChange={(e) => {
                                                    setAmount(e.target.value)
                                                    setErrorMessage(null)
                                                }}
                                                placeholder={`Min: ${selectedPackage.min_amount_usd.toLocaleString("en-US", { minimumFractionDigits: 2 })} - Max: ${selectedPackage.max_amount_usd.toLocaleString("en-US", { minimumFractionDigits: 2 })}`}
                                                className="mt-1 w-full bg-[#1A1A1A] rounded-lg p-3 text-white"
                                                required
                                                step="any"
                                            />
                                        </div>
                                        <div className="text-sm text-gray-400">
                                            <div className="flex justify-between mb-2">
                                                <span>Package:</span>
                                                <span className="text-white">{selectedPackage.name}</span>
                                            </div>
                                            <div className="flex justify-between mb-2">
                                                <span>Duration:</span>
                                                <span className="text-white">{selectedPackage.duration_days} days</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span>Expected ROI:</span>
                                                <span className="text-green-500">
                                                    {selectedPackage.min_roi}% - {selectedPackage.max_roi}%
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="checkbox"
                                                id="autoCompound"
                                                checked={autoCompound}
                                                onChange={(e) => setAutoCompound(e.target.checked)}
                                                className="rounded bg-[#1A1A1A] border-gray-600"
                                            />
                                            <label htmlFor="autoCompound" className="text-sm text-gray-400">
                                                Enable auto-compound
                                            </label>
                                        </div>
                                    </div>
                                    <div className="flex gap-4">
                                        <button
                                            onClick={() => {
                                                setShowConfirm(false)
                                                setErrorMessage(null)
                                            }}
                                            className="flex-1 bg-[#1A1A1A] hover:bg-[#242424] py-3 rounded-lg font-medium"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={confirmInvestment}
                                            className="flex-1 bg-orange-500 hover:bg-orange-600 py-3 rounded-lg font-medium"
                                        >
                                            Confirm
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

