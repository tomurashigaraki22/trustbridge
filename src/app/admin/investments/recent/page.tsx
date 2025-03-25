'use client';

import React, { useEffect, useState } from 'react';
import { useUserData } from "@/hooks/useUserData";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { ArrowLeft } from 'lucide-react';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { X } from 'lucide-react';
 
interface RecentInvestment {
    id: number;
    user_id: number;
    package_id: number;
    amount_usd: number;
    currency: string;
    start_date: string;
    end_date: string;
    daily_roi: number;
    auto_compound: boolean;
    status: string;
    user_email: string;
    username: string;
    package_name: string;
}

export default function RecentInvestmentsPage() {
    const router = useRouter();
    const { userData, isLoading: userDataLoading } = useUserData();
    const [investments, setInvestments] = useState<RecentInvestment[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedInvestment, setSelectedInvestment] = useState<RecentInvestment | null>(null);

    useEffect(() => {
        if (!userDataLoading && !userData?.user?.is_admin) {
            router.push('/dashboard');
            return;
        }

        if (!userDataLoading && userData?.user?.is_admin) {
            fetchInvestments();
        }
    }, [userData, userDataLoading, router]);

    const fetchInvestments = async () => {
        try {
            const response = await fetch('/api/admin/recent-investments', {
                headers: {
                    'Authorization': `Bearer ${Cookies.get('auth-token')}`
                }
            });
            const data = await response.json();
            if (data.success) setInvestments(data.investments);
        } catch (error) {
            console.error('Failed to fetch recent investments:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="min-h-screen bg-[#111111] text-white flex items-center justify-center">
            Loading...
        </div>;
    }
 
    // Update the table row to be clickable
    return (
        <div className="min-h-screen bg-[#111111] text-white">
            <AdminSidebar />
            <div className="md:ml-64 p-6">
                <div className="max-w-7xl mx-auto">
                    <button
                        onClick={() => router.push('/admin/investments')}
                        className="flex items-center gap-2 text-gray-400 hover:text-white mb-6"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back to Packages
                    </button>

                    <h1 className="text-2xl font-bold mb-8">Recent Investments</h1>

                    <div className="bg-[#121212] rounded-lg overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-[#1A1A1A]">
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400">User</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400">Package</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400">Amount</th>
                                         <th className="px-6 py-3 text-left text-xs font-medium text-gray-400">Start Date</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400">End Date</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-800">
                                    {investments.map((investment) => (
                                        <tr 
                                            key={investment.id} 
                                            className="hover:bg-[#1A1A1A] cursor-pointer"
                                            onClick={() => setSelectedInvestment(investment)}
                                        >
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div>
                                                    <div className="text-sm">{investment.username}</div>
                                                    <div className="text-xs text-gray-400">{investment.user_email}</div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                {investment.package_name}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                ${investment.amount_usd.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                                            </td>
                                          
                                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                {new Date(investment.start_date).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                {new Date(investment.end_date).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 py-1 text-xs rounded-full ${
                                                    investment.status === 'active' 
                                                        ? 'bg-green-500/20 text-green-500'
                                                        : investment.status === 'completed'
                                                        ? 'bg-blue-500/20 text-blue-500'
                                                        : 'bg-gray-500/20 text-gray-500'
                                                }`}>
                                                    {investment.status.charAt(0).toUpperCase() + investment.status.slice(1)}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Add modal at the root level */}
            {selectedInvestment && (
                <div 
                    className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
                    onClick={(e) => {
                        if (e.target === e.currentTarget) {
                            setSelectedInvestment(null);
                        }
                    }}
                >
                    <div className="relative w-full max-w-3xl mx-4">
                        <div className="relative w-full rounded-[1rem] bg-[#121212] p-6">
                            <button 
                                onClick={() => setSelectedInvestment(null)}
                                className="absolute right-4 top-4 p-2 hover:bg-gray-800 rounded-lg"
                            >
                                <X className="h-4 w-4 text-gray-400" />
                            </button>
                            
                            <h3 className="text-lg font-semibold mb-4">Investment Details</h3>
                            
                            <div className="grid grid-cols-2 gap-4 mb-6">
                                <div>
                                    <p className="text-sm text-gray-400">Investor</p>
                                    <p className="text-sm">{selectedInvestment.username}</p>
                                    <p className="text-xs text-gray-400">{selectedInvestment.user_email}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-400">Package</p>
                                    <p className="text-sm">{selectedInvestment.package_name}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-400">Amount</p>
                                    <p className="text-sm">${selectedInvestment.amount_usd.toLocaleString("en-US", { minimumFractionDigits: 2 })}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-400">Daily ROI Pattern</p>
                                    <p className="text-sm">{selectedInvestment.daily_roi}%</p>
                                </div>
                            </div>

                             
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}