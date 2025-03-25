"use client"

import { useCallback, useEffect, useState } from "react"
import { Sidebar } from "@/components/dashboard/Sidebar"
import { TopBar } from "@/components/dashboard/TopBar"
import { Download, Eye, EyeOff, RefreshCw } from "lucide-react"
import { useUserData } from "@/hooks/useUserData"
import { useCryptoData } from "@/hooks/useCryptoData"
import Link from "next/link"
import { useRouter } from "next/navigation"
import Cookies from "js-cookie"
import jsPDF from "jspdf"
import "jspdf-autotable"

interface AutoTableOptions {
    startY: number;
    head: string[][];
    body: (string | number)[][];
    headStyles: {
        fillColor: number[];
    };
}

export default function PortfolioPage() {
    const [showBalance, setShowBalance] = useState(true)
    const { userData, refetch, totalBalance } = useUserData()
    const { calculateUserAssetValue } = useCryptoData()
    const [isRefetching, setIsRefetching] = useState(false)
    const [btcValue, setBtcValue] = useState(0)
    const router = useRouter()
    const fetchBtcBalance = () => {
        const btcValue = calculateUserAssetValue(totalBalance, "bitcoin")

        setBtcValue(btcValue && Number((totalBalance / btcValue).toFixed(6)))
    }

    const handleRefetch = useCallback(async () => {
        setIsRefetching(true)
        await refetch()
        fetchBtcBalance()
        setIsRefetching(false)
    }, [refetch])

    useEffect(() => {
        fetchBtcBalance()
    }, [totalBalance, calculateUserAssetValue])

    useEffect(() => {
        const interval = setInterval(() => {
            handleRefetch()
        }, 5000)

        return () => clearInterval(interval)
    }, [])

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
        .map((asset) => {
            const priceUsd = asset.balance
            return { ...asset, priceUsd }
        })
        .sort((a, b) => b.priceUsd - a.priceUsd)


    interface Transaction {
        created_at: string;
        type: string;
        currency: string;
        amount: number;
        status: string;
    }

    interface Statement {
        transactions: Transaction[];
    }

    interface ApiResponse {
        success: boolean;
        statement: Statement;
    }

    const downloadStatement = async () => {
        try {
            const endDate = new Date().toISOString()
            const startDate = new Date()
            startDate.setFullYear(startDate.getFullYear() - 1)

            const response = await fetch("/api/transactions/statement", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${Cookies.get("auth-token")}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    startDate: startDate.toISOString(),
                    endDate,
                }),
            })

            const data: ApiResponse = await response.json();

            if (data.success) {
                // Add this type declaration at the top of the file
                interface ExtendedJsPDF extends jsPDF {
                    autoTable: (options: AutoTableOptions) => void;
                }

                const doc = new jsPDF() as ExtendedJsPDF;
                // Header
                doc.setFontSize(20)
                doc.text("Account Statement", 105, 20, { align: "center" })

                // Period
                doc.setFontSize(12)
                doc.text(
                    `Period: ${new Date(startDate).toLocaleDateString()} - ${new Date(endDate).toLocaleDateString()}`,
                    20,
                    35,
                )

                // Account Summary
                doc.setFontSize(16)
                doc.text("Account Summary", 20, 50)

                doc.setFontSize(12)
                doc.text(`Total Balance: $${totalBalance.toLocaleString()}`, 20, 60)
                doc.text(`BTC Equivalent: ${btcValue} BTC`, 20, 70);
                // Then update both autoTable calls
                doc.autoTable({
                    startY: 85,
                    head: [["Asset", "Currency", "Balance"]],
                    body: assets.map((asset) => [asset.name, "USD", `$${asset.priceUsd.toLocaleString()}`]),
                    headStyles: { fillColor: [139, 92, 246] },
                });
                // Transactions
                doc.addPage()
                doc.setFontSize(16)
                doc.text("Transaction History", 20, 20)
                    ; doc.autoTable({
                        startY: 30,
                        head: [["Date", "Type", "Currency", "Amount", "Status"]],
                        body: data.statement.transactions.map((tx: Transaction) => [
                            new Date(tx.created_at).toLocaleDateString(),
                            tx.type.toUpperCase(),
                            tx.currency,
                            tx.amount,
                            tx.status.charAt(0).toUpperCase() + tx.status.slice(1),
                        ]),
                        headStyles: { fillColor: [139, 92, 246] },
                    })

                // Footer
                const pageCount = doc.getNumberOfPages()
                for (let i = 1; i <= pageCount; i++) {
                    doc.setPage(i)
                    doc.setFontSize(10)
                    doc.text(
                        `Generated on ${new Date().toLocaleString()} - Page ${i} of ${pageCount}`,
                        105,
                        doc.internal.pageSize.height - 10,
                        { align: "center" },
                    )
                }

                doc.save(`account-statement-${new Date().toLocaleDateString("en-US")}.pdf`)
            }
        } catch (error) {
            console.error("Failed to generate statement:", error)
        }
    }
    const ViewPortfolio = (selectedCrypto: string) => {
        router.push(`/dashboard/portfolio/${selectedCrypto}`)
    }

    return (
        <div className="min-h-screen bg-[#111111] text-white pb-[5rem]">
            <div className="flex flex-col lg:flex-row">
                <Sidebar />
                <div className="flex-1 ">
                    <TopBar title="Portfolio" notices={userData?.notices} />
                    <div className="flex flex-col lg:flex-row">
                        <div className="flex-1 w-full lg:max-w-[calc(100%-320px)] p-4 lg:p-8">
                            <div className="bg-[#121212] flex lg:flex-row justify-between md:items-center px-[1rem] lg:px-[1.5rem] rounded-[1rem] py-4 lg:py-[1.5rem] mb-8">
                                <div className="flex flex-col gap-2 mb-4 lg:mb-0">
                                    <div className="text-sm text-gray-400">Total asset value</div>
                                    <div className="flex items-center gap-2">
                                        <div className="text-4xl font-bold tracking-tight">
                                            {showBalance
                                                ? `$ ${totalBalance.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                                                : "$ ••••••••••"}
                                        </div>
                                    </div>
                                    <div className="text-sm text-gray-400">≈ {btcValue} BTC</div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <button
                                        onClick={handleRefetch}
                                        disabled={isRefetching}
                                        className="rounded-full bg-white/20 p-3 hover:bg-gray-700/50"
                                    >
                                        <RefreshCw className={`h-4 w-4 ${isRefetching ? "animate-spin" : ""}`} />
                                    </button>
                                    <button
                                        className="rounded-full bg-white/20 p-3 hover:bg-gray-700/50"
                                        onClick={() => setShowBalance(!showBalance)}
                                    >
                                        {showBalance ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </button>
                                </div>
                            </div>

                            <div className="bg-[#121212] rounded-[1rem] overflow-hidden">
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="border-b border-gray-800">
                                                <th className="text-left p-4 text-sm font-medium text-gray-400">Asset</th>
                                                <th className="text-right p-4 text-sm font-medium text-gray-400">Balance</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {assets.map((asset) => (
                                                <tr
                                                    key={asset.name}
                                                    onClick={() => ViewPortfolio(asset.name)}
                                                    className="cursor-pointer  border-b border-gray-800/50 hover:bg-[#1A1A1A]"
                                                >
                                                    <td className="p-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-500/20">
                                                                <span className="text-lg text-orange-500">{asset.name.charAt(0)}</span>
                                                            </div>
                                                            <span className="font-medium">{asset.name}</span>
                                                        </div>
                                                    </td>
                                                    <td className="p-4 text-right">
                                                        $
                                                        {asset.priceUsd.toLocaleString("en-US", {
                                                            minimumFractionDigits: 2,
                                                            maximumFractionDigits: 2,
                                                        })}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>

                        <div className="w-full lg:w-80 border-t lg:border-l border-gray-800/50 p-4 lg:p-5">
                            <div className="mb-8">
                                <div className="mb-4 text-lg font-medium">Quick Actions</div>
                                <div className="grid gap-3">
                                    <button
                                        onClick={downloadStatement}
                                        className="flex w-full items-center justify-center gap-2 rounded-lg bg-orange-500 py-3 text-sm font-medium transition-colors hover:bg-orange-600"
                                    >
                                        <Download className="h-4 w-4" />
                                        Download Statement
                                    </button>
                                    <Link
                                        href="/dashboard/transactions/send"
                                        className="flex items-center justify-center gap-2 rounded-lg bg-[#121212] py-3 text-sm font-medium transition-colors hover:bg-[#1A1A1A]"
                                    > Send
                                    </Link>
                                    <Link
                                        href="/dashboard/transactions/deposit"
                                        className="flex items-center justify-center gap-2 rounded-lg bg-[#121212] py-3 text-sm font-medium transition-colors hover:bg-[#1A1A1A]"
                                    >
                                        Deposit
                                    </Link>
                                    {process.env.NEXT_PUBLIC_SHOW_SWAP !== "false" && (
                                    <Link
                                        href="/dashboard/transactions/swap"
                                        className="flex items-center justify-center gap-2 rounded-lg bg-[#121212] py-3 text-sm font-medium transition-colors hover:bg-[#1A1A1A]"
                                    >
                                        Swap
                                    </Link>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

