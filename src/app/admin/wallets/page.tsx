'use client';

import React, { useEffect, useState } from 'react';
import { useUserData } from "@/hooks/useUserData";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { Edit, Star, StarOff } from 'lucide-react';

interface WalletAddress {
    id: number;
    user_id: number;
    currency: string;
    address: string;
    label: string;
    is_default: boolean;
    created_at: string;
    username?: string;
    user_email?: string;
}

export default function WalletAddressesPage() {
    const router = useRouter();
    const { userData, isLoading: userDataLoading } = useUserData();
    const [wallets, setWallets] = useState<WalletAddress[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!userDataLoading && !userData?.user?.is_admin) {
            router.push('/dashboard');
            return;
        }

        if (!userDataLoading && userData?.user?.is_admin) {
            fetchWallets();
        }
    }, [userData, userDataLoading, router]);

    const fetchWallets = async () => {
        try {
            const response = await fetch('/api/admin/wallets', {
                headers: {
                    'Authorization': `Bearer ${Cookies.get('auth-token')}`
                }
            });
            const data = await response.json();
            if (data.success) setWallets(data.wallets);
        } catch (error) {
            console.error('Failed to fetch wallets:', error);
        } finally {
            setLoading(false);
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
                    <h1 className="text-2xl font-bold mb-8">Wallet Addresses</h1>

                    <div className="bg-[#121212] rounded-lg overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-[#1A1A1A]">
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400">Currency</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400">Address</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400">Label</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400">Default</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400">Created At</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-800">
                                    {wallets.map((wallet) => (
                                        <tr key={wallet.id} className="hover:bg-[#1A1A1A]">

                                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                {wallet.currency.toUpperCase()}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                <div className="max-w-xs truncate">
                                                    {wallet.address}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                {wallet.label}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {wallet.is_default ? (
                                                    <Star className="h-4 w-4 text-yellow-500" />
                                                ) : (
                                                    <StarOff className="h-4 w-4 text-gray-500" />
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                {new Date(wallet.created_at).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <button
                                                    onClick={() => router.push(`/admin/wallets/edit/${wallet.id}`)}
                                                    className="p-2 hover:bg-gray-800 rounded-lg"
                                                >
                                                    <Edit className="h-4 w-4 text-gray-400" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}