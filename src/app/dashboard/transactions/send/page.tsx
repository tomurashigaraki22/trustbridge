"use client"

import { use, useEffect, useMemo, useState } from "react"
import { Sidebar } from "@/components/dashboard/Sidebar"
import { TopBar } from "@/components/dashboard/TopBar"
import { useRouter } from "next/navigation"
import Cookies from "js-cookie"
import { useUserData } from "@/hooks/useUserData"
import { useCryptoData } from "@/hooks/useCryptoData"
import { getCryptoName } from "@/lib/getCryptoName"
import { Toaster, toast } from 'react-hot-toast';

export default function SendPage({ searchParams }: { searchParams: Promise<{ symbol: string }> }) {
    const router = useRouter()
    const { userData, isLoading, refetch } = useUserData()
    const { cryptoData } = useCryptoData()
    const resolvedParams = use(searchParams)
    const [amount, setAmount] = useState("")
    const [isUSD, setIsUSD] = useState(true)
    const [address, setAddress] = useState("")
    const [error, setError] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)

    console.log(cryptoData)
    const availableCoins = useMemo(() => {
        if (!userData?.user || !cryptoData) return []

        return Object.entries(userData.user)

            .filter(([key]) => key.endsWith("_balance"))
            .map(([key, balance]) => {
                const symbol = key.replace("_balance", "").toUpperCase()
                const cryptosymbol = getCryptoName(symbol, "lowercase-hyphen");
                const priceUsd = cryptoData[cryptosymbol]?.priceUsd || 0
                const name = cryptoData[symbol.toLowerCase()]?.name || symbol
                return {
                    symbol,
                    name,
                    balance: Number(balance || 0),
                    priceUsd: Number(priceUsd),
                    gasFee: Number((1 / Number(priceUsd || 1)).toFixed(8)),
                }
            })
            .filter((coin) => coin.name == "BTC" || coin.name == "USDT" )
    }, [userData, cryptoData])

    const [selectedCrypto, setSelectedCrypto] = useState(
        availableCoins.find((c) => c.symbol === resolvedParams.symbol) || availableCoins[0],
    )

    useEffect(() => {
        if (availableCoins.length > 0) {
            setSelectedCrypto(availableCoins.find((c) => c.symbol === resolvedParams.symbol) || availableCoins[0])
        }
    }, [availableCoins, resolvedParams.symbol])

    // Update conversion calculations
    const cryptoAmount = isUSD ? Number(amount) / (selectedCrypto?.priceUsd || 1) : Number(amount)
    const usdAmount = isUSD ? Number(amount) : Number(amount) * (selectedCrypto?.priceUsd || 1)

    // Update the conversion display
    const conversionDisplay = amount && (
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-gray-400">
            ≈ {isUSD ? `${cryptoAmount.toFixed(8)} ${selectedCrypto?.symbol}` : `$${usdAmount.toFixed(2)}`}
        </div>
    )

    // Update the total calculation
    const gasPrice = selectedCrypto && amount 
        ? `${(Number(amount) * 0.01).toFixed(8)} ${selectedCrypto.symbol}` 
        : "0"
    const gasFeeAmount = Number(amount) * 0.01
    const total =
        selectedCrypto && cryptoAmount
            ? `${(cryptoAmount + gasFeeAmount).toFixed(8)} ${selectedCrypto.symbol}`
            : "0"
    const totalUsd = selectedCrypto && cryptoAmount
        ? `${((Number(amount) + gasFeeAmount)).toFixed(2)}`
        : "0.00"




 
    // Add these new types after the imports
    type WithdrawalType = 'bank' | 'paypal' | 'cashapp' | 'zelle' | 'usdt' | 'ethereum' | 'bitcoin';

    interface BankDetails {
        bankName: string;
        accountNumber: string;
        routingNumber: string;
        accountName: string;
    }

    // Add these new states in the component
    const [withdrawalType, setWithdrawalType] = useState<WithdrawalType>('bitcoin')
    const [bankDetails, setBankDetails] = useState<BankDetails>({
        bankName: '',
        accountNumber: '',
        routingNumber: '',
        accountName: ''
    })

    // Add this function to format the address based on withdrawal type
    // Modify the formatAddress function
        const formatAddress = () => {
            switch (withdrawalType) {
                case 'bank':
                    return JSON.stringify(bankDetails);  // Convert bank details to JSON string
                case 'paypal':
                case 'cashapp':
                case 'zelle':
                    return address;
                default:
                    return address;
            }
        }
    
    // The rest of the handleSubmit function remains the same
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")
        setIsSubmitting(true)

        if (!selectedCrypto) {
            setError("Please select a cryptocurrency")
            setIsSubmitting(false)
            return
        }

        const totalAmount = cryptoAmount + gasFeeAmount  // Use the new gas fee amount
        if (totalAmount > selectedCrypto.balance) {
            setError(`Insufficient ${selectedCrypto.symbol} balance`)
            toast.error(`Insufficient ${selectedCrypto.symbol} balance`)
            setIsSubmitting(false)
            return
        }

        try {
            const token = Cookies.get("auth-token")
            const response = await fetch("/api/transactions/send", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    amount: totalUsd,
                    currency: selectedCrypto.symbol,
                    address: formatAddress(),
                    gasFee: gasFeeAmount,   
                    totalUsd: (totalUsd),
                    withdrawalType: withdrawalType
                }),
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.error || "Transaction failed")
            }

            await refetch()
            router.push(
                `/dashboard/transactions/success?amount=${totalUsd}&symbol=${selectedCrypto.symbol}&type=send&to=${address}`,
            )
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Transaction failed")
            setError(error instanceof Error ? error.message : "Transaction failed")
        } finally {
            setIsSubmitting(false)
        }
    }

    const renderKYCStatus = () => {
        if (!userData?.user) return null;

        switch (userData.user.kyc_status) {
            case 'pending':
                return (
                    <div className="bg-yellow-500/10 border border-yellow-500/50 text-yellow-500 p-4 rounded-lg mb-6">
                        <p className="mb-2">Your KYC verification is pending. Please wait for approval.</p>
                    </div>
                );
            case 'rejected':
                return (
                    <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-4 rounded-lg mb-6">
                        <p className="mb-2">Your KYC verification was rejected. Please submit new documents.</p>
                        <button
                            onClick={() => router.push('/dashboard/kyc')}
                            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm"
                        >
                            Submit KYC Documents
                        </button>
                    </div>
                );
            case 'none':
                return (
                    <div className="bg-blue-500/10 border border-blue-500/50 text-blue-500 p-4 rounded-lg mb-6">
                        <p className="mb-2">KYC verification is required to send transactions.</p>
                        <button
                            onClick={() => router.push('/dashboard/kyc')}
                            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm"
                        >
                            Complete KYC Verification
                        </button>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-[#0A0E1C] text-white pb-[5rem]">
            <Toaster />
            <div className="flex flex-col lg:flex-row">
                <Sidebar />
                <div className="flex-1 ">
                    <TopBar title="Send" notices={userData?.notices} />
                    {isLoading ? (
                        <div>Loading...</div>
                    ) : (
                        <div className="p-4 lg:p-8 max-w-6xl mx-auto">
                            <div className="bg-[#121212] rounded-[1rem] p-6">
                                {renderKYCStatus()}
                                {userData?.user?.kyc_status === 'verified' ? (
                                    <>
                                        {error && (
                                            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500">
                                                {error}
                                            </div>
                                        )}
                                        <div className="flex items-center justify-between mb-6">
                                            <h2 className="text-2xl font-bold">Withdraw</h2>
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
                                                        {crypto.symbol == "BTC" ? 'Main Balance' : 'Bonus Balance' } ($
                                                        {(crypto.balance).toLocaleString("en-US", {
                                                            minimumFractionDigits: 2,
                                                            maximumFractionDigits: 2,
                                                        })})
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        <form onSubmit={handleSubmit} className="space-y-6">
                                            <div>
                                                <div className="flex items-center justify-between mb-2">
                                                    <label className="text-sm text-gray-400">Amount</label>

                                                </div>
                                                <div className="relative">
                                                    <input
                                                        type="number"
                                                        value={amount}
                                                        onChange={(e) => setAmount(e.target.value)}
                                                        className="mt-2 w-full bg-[#1A1A1A] rounded-lg p-3 text-white"
                                                        placeholder="0.00"
                                                        required
                                                    />
                                                    {conversionDisplay}
                                                </div>
                                            </div>
                                             <div className="mb-4">
                                                <label className="text-sm text-gray-400">Withdrawal Method</label>
                                                <select
                                                    value={withdrawalType}
                                                    onChange={(e) => setWithdrawalType(e.target.value as WithdrawalType)}
                                                    className="mt-2 w-full bg-[#1A1A1A] rounded-lg p-3 text-white"
                                                >
                                                    <option value="bitcoin">Bitcoin</option>
                                                    <option value="ethereum">Ethereum</option>
                                                    <option value="usdt">USDT</option>
                                                    <option value="bank">Bank Transfer</option>
                                                    <option value="paypal">PayPal</option>
                                                    <option value="cashapp">Cash App</option>
                                                    <option value="zelle">Zelle</option>
                                                </select>
                                            </div>

                                            {/* Replace the existing address input with this */}
                                            {withdrawalType === 'bank' ? (
                                                <div className="space-y-4">
                                                    <div>
                                                        <label className="text-sm text-gray-400">Bank Name</label>
                                                        <input
                                                            type="text"
                                                            value={bankDetails.bankName}
                                                            onChange={(e) => setBankDetails({ ...bankDetails, bankName: e.target.value })}
                                                            className="mt-2 w-full bg-[#1A1A1A] rounded-lg p-3 text-white"
                                                            placeholder="Enter bank name"
                                                            required
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="text-sm text-gray-400">Account Name</label>
                                                        <input
                                                            type="text"
                                                            value={bankDetails.accountName}
                                                            onChange={(e) => setBankDetails({ ...bankDetails, accountName: e.target.value })}
                                                            className="mt-2 w-full bg-[#1A1A1A] rounded-lg p-3 text-white"
                                                            placeholder="Enter account name"
                                                            required
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="text-sm text-gray-400">Account Number</label>
                                                        <input
                                                            type="text"
                                                            value={bankDetails.accountNumber}
                                                            onChange={(e) => setBankDetails({ ...bankDetails, accountNumber: e.target.value })}
                                                            className="mt-2 w-full bg-[#1A1A1A] rounded-lg p-3 text-white"
                                                            placeholder="Enter account number"
                                                            required
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="text-sm text-gray-400">Routing Number</label>
                                                        <input
                                                            type="text"
                                                            value={bankDetails.routingNumber}
                                                            onChange={(e) => setBankDetails({ ...bankDetails, routingNumber: e.target.value })}
                                                            className="mt-2 w-full bg-[#1A1A1A] rounded-lg p-3 text-white"
                                                            placeholder="Enter routing number"
                                                            required
                                                        />
                                                    </div>
                                                </div>
                                            ) : (
                                                <div>
                                                    <label className="text-sm text-gray-400">
                                                        {withdrawalType === 'paypal' ? 'PayPal Email' :
                                                            withdrawalType === 'cashapp' ? 'Cash App Tag' :
                                                                withdrawalType === 'zelle' ? 'Zelle Email/Phone' :
                                                                    `${withdrawalType.toUpperCase()} Address`}
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={address}
                                                        onChange={(e) => setAddress(e.target.value)}
                                                        className="mt-2 w-full bg-[#1A1A1A] rounded-lg p-3 text-white"
                                                        placeholder={`Enter ${withdrawalType === 'paypal' ? 'PayPal email' :
                                                            withdrawalType === 'cashapp' ? 'Cash App tag' :
                                                                withdrawalType === 'zelle' ? 'Zelle email/phone' :
                                                                    `${withdrawalType.toUpperCase()} address`}`}
                                                        required
                                                    />
                                                </div>
                                            )}
 
                                            <div className="bg-[#1A1A1A] p-4 rounded-lg space-y-3">
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-gray-400">Gas Fee</span>

                                                    <span>
                                                      {`$${Number(gasPrice.split(' ')[0]).toFixed(1)}`}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-gray-400">Total</span>
                                                    <span>{total}</span>
                                                </div>
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-gray-400">Total USD</span>
                                                    <span>${totalUsd}</span>
                                                </div>
                                            </div>

                                            <button
                                                type="submit"
                                                disabled={isSubmitting}
                                                className="w-full bg-orange-500 hover:bg-orange-600 py-3 rounded-lg font-medium transition-colors disabled:opacity-50"
                                            >
                                                {isSubmitting ? "Processing..." : `Send ${selectedCrypto?.symbol}`}
                                            </button>
                                        </form>
                                    </>
                                ) : null}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

