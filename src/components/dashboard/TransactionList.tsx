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
<div>
    {/* Toggle Buttons */}
    <div className="flex gap-3 mb-6">
        <button
            onClick={() => setActiveType(activeType === 'deposit' ? null : 'deposit')}
            className={`px-5 py-2 rounded-lg font-medium transition-colors duration-200 shadow-sm border ${
                activeType === 'deposit'
                    ? 'bg-green-500 text-black border-green-500'
                    : 'bg-white text-black hover:bg-[#2E2E2E] hover:text-white border-gray-300'
            }`}
        >
            Deposit
        </button>
        <button
            onClick={() => setActiveType(activeType === 'withdrawal' ? null : 'withdrawal')}
            className={`px-5 py-2 rounded-lg font-medium transition-colors duration-200 shadow-sm border ${
                activeType === 'withdrawal'
                    ? 'bg-red-500 text-black border-red-500'
                    : 'bg-white text-black hover:bg-[#2E2E2E] hover:text-white border-gray-300'
            }`}
        >
            Withdrawal
        </button>
    </div>

    {/* Transaction List */}
    <div className="space-y-3 border-t border-[#444] pt-4">
        {displayedTransactions.map((tx) => (
            <div
                key={tx.id}
                onClick={() => setSelectedTx(tx)}
                className="flex items-center justify-between rounded-xl bg-white p-4 group hover:bg-[#1A1A1A] transition-colors duration-200 shadow-sm cursor-pointer"
            >
                <div className="flex items-center gap-4">
                    <div
                        className={`p-2 rounded-lg ${
                            tx.status === 'completed'
                                ? 'bg-green-500/20'
                                : tx.status === 'pending'
                                ? 'bg-orange-500/20'
                                : 'bg-red-500/20'
                        }`}
                    >
                        {tx.status === 'completed' ? (
                            <ArrowUp className="h-5 w-5 text-green-500" />
                        ) : tx.status === 'pending' ? (
                            <ArrowDown className="h-5 w-5 text-orange-500" />
                        ) : (
                            <ArrowDown className="h-5 w-5 text-red-500" />
                        )}
                    </div>
                    <div>
                        <div className="text-sm font-semibold text-black group-hover:text-white capitalize">
                            {tx.type} - {tx.description}
                        </div>
                        <div className="text-xs text-black group-hover:text-white">
                            {formatDate(tx.created_at)}
                        </div>
                    </div>
                </div>
                <div className="flex flex-col items-end text-right gap-1">
                    <div
                        className={`text-sm font-semibold ${
                            tx.status === 'completed'
                                ? 'text-green-500'
                                : tx.status === 'pending'
                                ? 'text-orange-500'
                                : 'text-red-500'
                        }`}
                    >
                        {Number(tx.amount) === 0
                            ? ''
                            : `$${Number(tx.amount).toLocaleString('en-US', {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2,
                              })}`}
                    </div>
                    <div
                        className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${
                            tx.status === 'completed'
                                ? 'bg-green-500/20 text-green-500'
                                : tx.status === 'pending'
                                ? 'bg-orange-500/20 text-orange-500'
                                : 'bg-red-500/20 text-red-500'
                        }`}
                    >
                        {tx.status}
                    </div>
                </div>
            </div>
        ))}

        {/* Receipt Modal */}
        {selectedTx && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                <div className="bg-[#121212] rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-xl">
                    <div id="transaction-receipt" className="p-6 space-y-6">
                        <div className="text-center">
                            <div
                                className={`w-12 h-12 mx-auto mb-4 flex items-center justify-center rounded-full ${
                                    selectedTx.status === 'completed'
                                        ? 'bg-green-500/20'
                                        : selectedTx.status === 'pending'
                                        ? 'bg-orange-500/20'
                                        : 'bg-red-500/20'
                                }`}
                            >
                                {selectedTx.status === 'completed' ? (
                                    <ArrowUp className="h-6 w-6 text-green-500" />
                                ) : selectedTx.status === 'pending' ? (
                                    <ArrowDown className="h-6 w-6 text-orange-500" />
                                ) : (
                                    <ArrowDown className="h-6 w-6 text-red-500" />
                                )}
                            </div>
                            <h3 className="text-xl font-bold text-white mb-1">{selectedTx.type}</h3>
                            <div className="text-2xl font-bold text-white mb-2">
                                ${Number(selectedTx.amount).toLocaleString('en-US', {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                })}
                            </div>
                            <div className="flex justify-center">
                                <div
                                    className={`inline-flex h-7 items-center justify-center rounded-full px-4 text-sm font-medium capitalize ${
                                        selectedTx.status === 'completed'
                                            ? 'bg-green-500/20 text-green-500'
                                            : selectedTx.status === 'pending'
                                            ? 'bg-orange-500/20 text-orange-500'
                                            : 'bg-red-500/20 text-red-500'
                                    }`}
                                >
                                    {selectedTx.status}
                                </div>
                            </div>
                        </div>

                        {/* Transaction Details */}
                        <div className="space-y-4 border-t border-b border-gray-700 py-4 text-sm text-white">
                            <div className="flex justify-between">
                                <span className="text-gray-400">Date</span>
                                <span>{formatDate(selectedTx.created_at)}</span>
                            </div>
                            {selectedTx.tx_hash && (
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Transaction Hash</span>
                                    <span className="font-mono text-xs">{selectedTx.tx_hash}</span>
                                </div>
                            )}
                            {selectedTx.from_address && (
                                <div className="flex justify-between">
                                    <span className="text-gray-400">From</span>
                                    <span className="font-mono text-xs">{selectedTx.from_address}</span>
                                </div>
                            )}
                            {selectedTx.to_address && (
                                <div className="flex justify-between">
                                    <span className="text-gray-400">To</span>
                                    <span className="font-mono text-xs">{selectedTx.to_address}</span>
                                </div>
                            )}
                            {selectedTx.fee && (
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Fee</span>
                                    <span>${selectedTx.fee}</span>
                                </div>
                            )}
                        </div>

                        {/* Description */}
                        <div className="text-sm text-gray-300">{selectedTx.description}</div>
                    </div>

                    {/* Modal Actions */}
                    <div className="border-t border-gray-700 p-4 flex justify-end gap-3">
                        <button
                            onClick={downloadReceipt}
                            className="flex items-center gap-2 bg-purple-500 hover:bg-purple-600 px-4 py-2 rounded-lg text-white text-sm font-medium transition-colors"
                        >
                            <Download className="h-4 w-4" />
                            Download Receipt
                        </button>
                        <button
                            onClick={() => setSelectedTx(null)}
                            className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg text-sm font-medium transition-colors"
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