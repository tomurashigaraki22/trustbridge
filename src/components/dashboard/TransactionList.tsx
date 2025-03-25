"use client"

import { useState } from "react"
import { ArrowDown, ArrowUp, Download } from "lucide-react"
import html2canvas from "html2canvas"

interface Transaction {
    id: number
    user_id: number
    type: 'deposit' | 'withdrawal' | 'transfer' | 'trade' | 'p2p' | 'others'
    currency: string
    amount: number
    fee: string
    status: 'pending' | 'completed' | 'failed' | 'cancelled'
    from_address: string
    to_address: string
    tx_hash: string
    description: string
    created_at: string
    updated_at: string
}

interface TransactionListProps {
    transactions: Transaction[]
    number?: number
}

export function TransactionList({ transactions, number }: TransactionListProps) {
    const [selectedTx, setSelectedTx] = useState<Transaction | null>(null)
    const [activeType, setActiveType] = useState<'deposit' | 'withdrawal' | null>(null)

    const filteredTransactions = activeType
        ? transactions.filter(tx => tx.type === activeType)
        : transactions

    const displayedTransactions = number
        ? filteredTransactions.slice(0, number)
        : filteredTransactions

    const formatDate = (dateString: string) => {
        const date = new Date(dateString)
        const day = date.getDate()
        const suffix = (day: number) => {
            if (day > 3 && day < 21) return 'th'
            switch (day % 10) {
                case 1: return 'st'
                case 2: return 'nd'
                case 3: return 'rd'
                default: return 'th'
            }
        }
        return date.toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        }).replace(/\d+/, day + suffix(day))
    }

    const downloadReceipt = async () => {
        if (!selectedTx) return
        const receipt = document.getElementById('transaction-receipt')
        if (receipt) {
            // Temporarily remove background from status badge
            const statusBadge = receipt.querySelector('[data-status-badge]')
            const originalClass = statusBadge?.className
            if (statusBadge) {
                statusBadge.className = statusBadge.className.replace(/bg-[^/\s]+-500\/20/g, '')
            }

            const canvas = await html2canvas(receipt, {
                backgroundColor: '#121212',
                scale: 2
            })

            // Restore original styling
            if (statusBadge && originalClass) {
                statusBadge.className = originalClass
            }

            const link = document.createElement('a')
            link.download = `transaction-${selectedTx.id}.png`
            link.href = canvas.toDataURL('image/png')
            link.click()
        }
    }

    return (
        <div >
            <div className="flex gap-2 mb-4">
                <button
                    onClick={() => setActiveType(activeType === 'deposit' ? null : 'deposit')}
                    className={`px-4 py-2 rounded-lg transition-colors ${activeType === 'deposit'
                            ? 'bg-green-500 text-white'
                            : 'bg-[#1E1E1E] text-gray-400 hover:bg-[#2E2E2E]'
                        }`}
                >
                    Deposit
                </button>
                <button
                    onClick={() => setActiveType(activeType === 'withdrawal' ? null : 'withdrawal')}
                    className={`px-4 py-2 rounded-lg transition-colors ${activeType === 'withdrawal'
                            ? 'bg-red-500 text-white'
                            : 'bg-[#1E1E1E] text-gray-400 hover:bg-[#2E2E2E]'
                        }`}
                >
                    Withdrawal
                </button>
            </div>

            <div className="space-y-2 cursor-pointer border-t border-[#444]">
                {displayedTransactions.map((tx) => (
                    <div
                        key={tx.id}
                        onClick={() => setSelectedTx(tx)}
                        className="flex items-center  justify-between rounded-lg bg-[#121212] p-4 cursor-pointer hover:bg-[#1A1A1A] transition-colors"
                    >
                        <div className="flex items-center gap-4">
                            <div className={`rounded-lg ${tx.status === "completed" ? "bg-green-500/20" : tx.status === "pending" ? "bg-orange-500/20" : "bg-red-500/20"} p-2`}>
                                {tx.status === "completed" ? (
                                    <ArrowUp className="h-5 w-5 text-green-500" />
                                ) : tx.status === "pending" ? (
                                    <ArrowDown className="h-5 w-5 text-orange-500" />
                                ) : (
                                    <ArrowDown className="h-5 w-5 text-red-500" />
                                )}
                            </div>
                            <div>
                                <div className="font-medium text-sm">{tx.type} - {tx.description}</div>
                                <div className="text-sm text-gray-400">{formatDate(tx.created_at)}</div>
                            </div>
                        </div>
                        <div className="text-right flex flex-col">
                            <div className={`${tx.status === "completed" ? "text-green-500" : tx.status === "pending" ? "text-orange-500" : "text-red-500"}`}>
                                {Number(tx.amount) === 0 ? '' : '$' + Number(tx.amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </div>
                            <div className="flex flex-col justify-end items-end">
                                <div className={`md:flex rounded-full text-end px-3 py-1 text-xs ${tx.status === "completed" ? "bg-green-500/20" : tx.status === "pending" ? "bg-orange-500/20" : "bg-red-500/20"}`}>
                                    {tx.status}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}

                {selectedTx && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                        <div className="bg-[#121212] rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
                            <div id="transaction-receipt" className="p-6 space-y-6">
                                <div className="text-center">
                                    <div className={`mx-auto w-12 h-12 rounded-full flex items-center justify-center mb-4 ${selectedTx.status === "completed" ? "bg-green-500/20" : selectedTx.status === "pending" ? "bg-orange-500/20" : "bg-red-500/20"}`}>
                                        {selectedTx.status === "completed" ? (
                                            <ArrowUp className="h-6 w-6 text-green-500" />
                                        ) : selectedTx.status === "pending" ? (
                                            <ArrowDown className="h-6 w-6 text-orange-500" />
                                        ) : (
                                            <ArrowDown className="h-6 w-6 text-red-500" />
                                        )}
                                    </div>
                                    <h3 className="text-xl font-bold mb-1">{selectedTx.type}</h3>
                                    <div className="text-2xl font-bold mb-2">
                                        ${Number(selectedTx.amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                    </div>
                                    <div className="flex justify-center">
                                        <div className={`inline-flex items-center justify-center h-7 rounded-full px-4 text-sm font-medium ${selectedTx.status === "completed"
                                            ? "bg-green-500/20 text-green-500"
                                            : selectedTx.status === "pending"
                                                ? "bg-orange-500/20 text-orange-500"
                                                : "bg-red-500/20 text-red-500"
                                            }`} data-status-badge>
                                            {selectedTx.status}
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4 border-t border-b border-gray-800 py-4">
                                    <div className="flex justify-between">
                                        <span className="text-gray-400">Date</span>
                                        <span>{formatDate(selectedTx.created_at)}</span>
                                    </div>
                                    {selectedTx.tx_hash && (
                                        <div className="flex justify-between">
                                            <span className="text-gray-400">Transaction Hash</span>
                                            <span className="text-sm font-mono">{selectedTx.tx_hash}</span>
                                        </div>
                                    )}
                                    {selectedTx.from_address && (
                                        <div className="flex justify-between">
                                            <span className="text-gray-400">From</span>
                                            <span className="text-sm font-mono">{selectedTx.from_address}</span>
                                        </div>
                                    )}
                                    {selectedTx.to_address && (
                                        <div className="flex justify-between">
                                            <span className="text-gray-400">To</span>
                                            <span className="text-sm font-mono">{selectedTx.to_address}</span>
                                        </div>
                                    )}
                                    {selectedTx.fee && (
                                        <div className="flex justify-between">
                                            <span className="text-gray-400">Fee</span>
                                            <span>${selectedTx.fee}</span>
                                        </div>
                                    )}
                                </div>

                                <div className="text-sm text-gray-400">
                                    {selectedTx.description}
                                </div>
                            </div>

                            <div className="border-t border-gray-800 p-4 flex justify-end gap-4">
                                <button
                                    onClick={downloadReceipt}
                                    className="flex items-center gap-2 bg-purple-500 hover:bg-purple-600 px-4 py-2 rounded-lg transition-colors"
                                >
                                    <Download className="h-4 w-4" />
                                    Download Receipt
                                </button>
                                <button
                                    onClick={() => setSelectedTx(null)}
                                    className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}