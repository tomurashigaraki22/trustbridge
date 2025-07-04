'use client';

import React, { useEffect, useState } from 'react';
import { useUserData } from "@/hooks/useUserData";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { Search, ChevronDown } from 'lucide-react';
import { AdminSidebar } from '@/components/admin/AdminSidebar';

interface Transaction {
    id: number;
    user_email: string;
    transaction_id: string;
    amount: string;
    currency: string;
    type: string;
    status: string;
    created_at: string;
}

export default function AdminDepositsPage() {
    const router = useRouter();
    const { userData, isLoading: userDataLoading } = useUserData();
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedStatus, setSelectedStatus] = useState<string>('all');
    const itemsPerPage = 20;
    const statusTypes = ['all', 'pending', 'completed', 'failed', 'cancelled'];

    useEffect(() => {
        if (!userDataLoading && !userData?.user?.is_admin) {
            router.push('/dashboard');
            return;
        }

        if (!userDataLoading && userData?.user?.is_admin) {
            fetchTransactions();
        }
    }, [userData, userDataLoading, router]);

    const fetchTransactions = async () => {
        try {
            const response = await fetch('/api/admin/transactions', {
                headers: {
                    'Authorization': `Bearer ${Cookies.get('auth-token')}`
                }
            });
            const data = await response.json();
            if (data.success) {
                const depositTransactions = data.transactions.filter(
                    (tx: Transaction) => tx.type === 'deposit'
                );
                setTransactions(depositTransactions);
            }
        } catch (error) {
            console.error('Failed to fetch transactions:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredTransactions = transactions.filter(tx => {
        const searchStr = searchTerm.toLowerCase();
        const matchesSearch = (
            tx.user_email?.toLowerCase().includes(searchStr) ||
            tx.transaction_id?.toLowerCase().includes(searchStr) ||
            tx.currency?.toLowerCase().includes(searchStr)
        );
        const matchesStatus = selectedStatus === 'all' || tx.status === selectedStatus;

        return matchesSearch && matchesStatus;
    });

    const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
    const paginatedTransactions = filteredTransactions.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'completed':
                return 'bg-green-500/20 text-green-500';
            case 'pending':
                return 'bg-yellow-500/20 text-yellow-500';
            case 'failed':
                return 'bg-red-500/20 text-red-500';
            case 'cancelled':
                return 'bg-gray-500/20 text-gray-500';
            default:
                return 'bg-gray-500/20 text-gray-500';
        }
    };

    const updateTransactionStatus = async (txId: number, newStatus: string) => {
        try {
            const response = await fetch('/api/admin/transactions', {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${Cookies.get('auth-token')}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ transaction_id: txId, status: newStatus })
            });

            if (response.ok) {
                fetchTransactions();
            }
        } catch (error) {
            console.error('Failed to update transaction status:', error);
        }
    };

    if (loading) {
        return <div className="min-h-screen bg-[#0A0E1C] text-white flex items-center justify-center">
            Loading...
        </div>;
    }

    return (
        <div className="min-h-screen bg-[#0A0E1C] text-white">
            <AdminSidebar />
            <div className="md:ml-64 p-6">
                <div className="max-w-7xl mx-auto">
                    <div className="flex justify-between items-center mb-8">
                        <h1 className="text-2xl font-bold">Deposits</h1>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search deposits..."
                                value={searchTerm}
                                onChange={(e) => {
                                    setSearchTerm(e.target.value);
                                    setCurrentPage(1);
                                }}
                                className="bg-[#1A1A1A] text-white pl-10 pr-4 py-2 rounded-lg w-64"
                            />
                        </div>
                    </div>
                    <div className="flex gap-4 mb-6">
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-400">Status:</span>
                            <select
                                value={selectedStatus}
                                onChange={(e) => setSelectedStatus(e.target.value)}
                                className="bg-[#1A1A1A] text-white px-3 py-1.5 rounded-lg text-sm"
                            >
                                {statusTypes.map(status => (
                                    <option key={status} value={status}>
                                        {status.charAt(0).toUpperCase() + status.slice(1)}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className="bg-[#121212] rounded-lg overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-gray-800">
                                        <th className="text-left p-4 text-sm font-medium text-gray-400">Transaction ID</th>
                                        <th className="text-left p-4 text-sm font-medium text-gray-400">User</th>
                                        <th className="text-right p-4 text-sm font-medium text-gray-400">Amount</th>
                                        <th className="text-right p-4 text-sm font-medium text-gray-400">Currency</th>
                                        <th className="text-right p-4 text-sm font-medium text-gray-400">Status</th>
                                        <th className="text-right p-4 text-sm font-medium text-gray-400">Date</th>
                                        <th className="text-right p-4 text-sm font-medium text-gray-400">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {paginatedTransactions.map((tx) => (
                                        <tr
                                            key={tx.id}
                                            className="border-b border-gray-800/50 hover:bg-[#1A1A1A]"
                                        >
                                            <td className="p-4 font-mono text-sm">
                                                {tx.id}
                                            </td>
                                            <td className="p-4">{tx.user_email}</td>
                                            <td className="p-4 text-right">
                                                {Number(tx.amount).toFixed(tx.currency === 'USDT' ? 2 : 1)}
                                            </td>
                                            <td className="p-4 text-right">{tx.currency}</td>
                                            <td className="p-4 text-right">
                                                <span className={`px-2 py-1 rounded text-xs ${getStatusColor(tx.status)}`}>
                                                    {tx.status}
                                                </span>
                                            </td>
                                            <td className="p-4 text-right">
                                                {new Date(tx.created_at).toLocaleString()}
                                            </td>
                                            <td className="p-4 text-right">
                                                <div className="relative inline-block">
                                                    <select
                                                        value={tx.status}
                                                        onChange={(e) => updateTransactionStatus(tx.id, e.target.value)}
                                                        className={`px-2 py-1 rounded text-xs appearance-none cursor-pointer pr-8 ${getStatusColor(tx.status)} bg-opacity-20`}
                                                    >
                                                        <option value="pending" className="bg-[#1A1A1A] text-yellow-500">Pending</option>
                                                        <option value="completed" className="bg-[#1A1A1A] text-green-500">Completed</option>
                                                        <option value="failed" className="bg-[#1A1A1A] text-red-500">Failed</option>
                                                        <option value="cancelled" className="bg-[#1A1A1A] text-gray-500">Cancelled</option>
                                                    </select>
                                                    <ChevronDown className="absolute right-1 top-1/2 -translate-y-1/2 h-3 w-3" />
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="p-4 border-t border-gray-800 flex items-center justify-between">
                            <div className="text-sm text-gray-400">
                                Showing {Math.min((currentPage - 1) * itemsPerPage + 1, filteredTransactions.length)} to{' '}
                                {Math.min(currentPage * itemsPerPage, filteredTransactions.length)} of {filteredTransactions.length} deposits
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                    disabled={currentPage === 1}
                                    className={`px-3 py-1 rounded ${currentPage === 1
                                        ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                                        : 'bg-gray-800 text-white hover:bg-gray-700'
                                        }`}
                                >
                                    Previous
                                </button>
                                {Array.from({ length: totalPages }, (_, i) => i + 1)
                                    .filter(page => {
                                        const distance = Math.abs(page - currentPage);
                                        return distance === 0 || distance === 1 || page === 1 || page === totalPages;
                                    })
                                    .map((page, index, array) => (
                                        <React.Fragment key={page}>
                                            {index > 0 && array[index - 1] !== page - 1 && (
                                                <span className="px-2 text-gray-500">...</span>
                                            )}
                                            <button
                                                onClick={() => setCurrentPage(page)}
                                                className={`px-3 py-1 rounded ${currentPage === page
                                                    ? 'bg-blue-600 text-white'
                                                    : 'bg-gray-800 text-white hover:bg-gray-700'
                                                    }`}
                                            >
                                                {page}
                                            </button>
                                        </React.Fragment>
                                    ))}
                                <button
                                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                    disabled={currentPage === totalPages}
                                    className={`px-3 py-1 rounded ${currentPage === totalPages
                                        ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                                        : 'bg-gray-800 text-white hover:bg-gray-700'
                                        }`}
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}