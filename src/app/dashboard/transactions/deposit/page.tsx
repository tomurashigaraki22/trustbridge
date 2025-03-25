"use client"

import { use, useEffect, useState } from "react"
import { Sidebar } from "@/components/dashboard/Sidebar"
import { TopBar } from "@/components/dashboard/TopBar"
import { Copy } from "lucide-react"
import Cookies from "js-cookie"
import QRCode from "react-qr-code"
 import { useRouter } from 'next/navigation'
import { useUserData } from "@/hooks/useUserData"

interface CryptoOption {
    symbol: string
    name: string
    address: string
    balance: number
}

interface UserWallet {
    currency: string;
    address: string;
}

interface UserData {
    user: {
        btc_balance: number;
        eth_balance: number;
        usdt_balance: number;
        bnb_balance: number;
        xrp_balance: number;
        ada_balance: number;
        doge_balance: number;
        sol_balance: number;
        dot_balance: number;
        matic_balance: number;
        link_balance: number;
        uni_balance: number;
        avax_balance: number;
        ltc_balance: number;
        shib_balance: number;
    };
    wallets: UserWallet[];
}

const generateCryptoOptions = (userData: UserData): CryptoOption[] => {
    if (!userData?.user || !userData?.wallets) return []

    console.log(userData.wallets)
    const balances = [
        { name: "BTC", balance: Number(userData.user.btc_balance || "0") },
        { name: "ETH", balance: Number(userData.user.eth_balance || "0") },
        { name: "USDT", balance: Number(userData.user.usdt_balance || "0") },
        { name: "BNB", balance: Number(userData.user.bnb_balance || "0") }
    ]




    return balances.map(coin => ({
        symbol: coin.name,
        name: coin.name,
        address: userData.wallets
            .filter((wallet: UserWallet) => wallet.currency === coin.name)
            .map((wallet: UserWallet) => wallet.address)[0] || '',
        balance: coin.balance
    })).filter(coin => coin.address);
}

export default function DepositPage({ searchParams }: { searchParams: Promise<{ symbol: string }> }) {
    const router = useRouter()
    const resolvedParams = use(searchParams)
    const { userData, isLoading, refetch } = useUserData()
    const [cryptoOptions, setCryptoOptions] = useState<CryptoOption[]>([])

    useEffect(() => {
        if (userData) {
            const options = generateCryptoOptions(userData)
            console.log(options)
            setCryptoOptions(options)
        }
    }, [userData])

    const [copied, setCopied] = useState(false)
    const [selectedCrypto, setSelectedCrypto] = useState<CryptoOption | null>(null)

    useEffect(() => {
        if (cryptoOptions.length > 0) {
            console.log(cryptoOptions)
            const initialCrypto = cryptoOptions.find(c => c.symbol === resolvedParams.symbol) || cryptoOptions[0]
            setSelectedCrypto(initialCrypto)
        }
    }, [cryptoOptions, resolvedParams.symbol])

    const copyToClipboard = () => {
        if (selectedCrypto?.address) {
            navigator.clipboard.writeText(selectedCrypto.address)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        }
    }

    // Add isSubmitting state
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Add amount state
    const [amount, setAmount] = useState("");

    const handleConfirmDeposit = async () => {
        if (!amount) {
             return;
        }

        try {
            setIsSubmitting(true);
            const token = Cookies.get("auth-token")
            const response = await fetch('/api/transactions/deposit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    amount: parseFloat(amount),
                    currency: selectedCrypto?.symbol,
                    address: selectedCrypto?.address,
                })
            });

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.error || 'Failed to create deposit');
            }

            await refetch();
            router.push(`/dashboard/transactions/success?amount=${amount}&symbol=${selectedCrypto?.symbol}&type=deposit`);
        } catch (error) {
            console.error('Deposit creation failed:', error);
        } finally {
            setIsSubmitting(false);
        }
    }


    return (
        <div className="min-h-screen bg-[#111111] text-white pb-[5rem]">
            <div className="flex flex-col lg:flex-row">
                <Sidebar />
                <div className="flex-1 ">
                    <TopBar title="Deposit" />
                    {isLoading || !selectedCrypto ? (
                        <div>Loading...</div>
                    ) : (
                        <div className="p-4 lg:p-8 max-w-6xl mx-auto">
                            <div className="bg-[#121212] rounded-[1rem] p-6">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-lg font-bold">Deposit {selectedCrypto.name}</h2>
                                    
                                    <select
                                        value={selectedCrypto.symbol}
                                        onChange={(event) => {
                                            const value = event.target.value;
                                            const crypto = cryptoOptions.find((c) => c.symbol === value);
                                            if (crypto) setSelectedCrypto(crypto);
                                        }}
                                        className="bg-[#1A1A1A] text-white px-3 py-2 rounded-lg"
                                    >
                                        {cryptoOptions.map((crypto) => (
                                            <option key={crypto.symbol} value={crypto.symbol}>
                                                {crypto.symbol}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="flex justify-center mb-8">
                                    <div className="bg-white p-4 rounded-lg">
                                        <QRCode
                                            value={selectedCrypto.address}
                                            size={200}
                                            style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="bg-[#1A1A1A] p-4 rounded-lg">
                                        <div className="text-sm text-gray-400 mb-2">Wallet Address</div>
                                        <div className="flex items-center justify-between gap-4">
                                            <div className="font-mono text-sm break-all">{selectedCrypto.address}</div>
                                            <button
                                                onClick={copyToClipboard}
                                                className="shrink-0 p-2 hover:bg-white/5 rounded-lg transition-colors"
                                            >
                                                <Copy size={20} className={copied ? "text-green-500" : "text-gray-400"} />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="bg-[#1A1A1A] p-4 rounded-lg">
                                        <div className="text-sm text-gray-400 mb-2">Network</div>
                                        <div className="font-medium">{selectedCrypto.name} Network ({selectedCrypto.symbol})</div>
                                    </div>

                                     <div className="bg-[#1A1A1A] p-4 rounded-lg">
                                        <div className="text-sm text-gray-400 mb-2">Amount (USD)</div>
                                        <input
                                            type="number"
                                            value={amount}
                                            onChange={(e) => setAmount(e.target.value)}
                                            placeholder={`Enter ${selectedCrypto?.symbol} amount in USD`}
                                            className="w-full bg-[#242424] text-white px-3 py-2 rounded-lg"
                                            required
                                        />
                                    </div>

                                    <div className="bg-orange-500/20 text-orange-500 p-4 rounded-lg text-sm">
                                        Only send {selectedCrypto.symbol} to this address. Sending any other asset may result in permanent loss.
                                    </div>

                                    <button
                                        onClick={handleConfirmDeposit}
                                        disabled={isSubmitting}
                                        className="w-full bg-orange-500 hover:bg-orange-600 py-3 rounded-lg font-medium transition-colors mt-6"
                                    >
                                        {isSubmitting ? "Processing..." : `I Have Sent ${selectedCrypto?.symbol}`}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}