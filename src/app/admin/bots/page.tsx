'use client';

import React, { useEffect, useState } from 'react';
import { useUserData } from "@/hooks/useUserData";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { Pencil } from 'lucide-react';
import { AdminSidebar } from '@/components/admin/AdminSidebar';

interface TradingBot {
    id: number;
    name: string;
    description: string;
    min_roi: number;
    max_roi: number;
    duration_days: number;
    price_amount: number;
    price_currency: string;
    status: string;
    created_at: string;
}

export default function AdminBotsPage() {
    const router = useRouter();
    const { userData, isLoading: userDataLoading } = useUserData();
    const [bots, setBots] = useState<TradingBot[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!userDataLoading && !userData?.user?.is_admin) {
            router.push('/dashboard');
            return;
        }

        if (!userDataLoading && userData?.user?.is_admin) {
            fetchBots();
        }
    }, [userData, userDataLoading, router]);

    const fetchBots = async () => {
        try {
            const response = await fetch('/api/admin/trading-bots', {
                headers: {
                    'Authorization': `Bearer ${Cookies.get('auth-token')}`
                }
            });
            const data = await response.json();
            if (data.success) setBots(data.bots);
        } catch (error) {
            console.error('Failed to fetch trading bots:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="min-h-screen bg-[#111111] text-white flex items-center justify-center">
            Loading...
        </div>;
    }

    return (
        <div className="min-h-screen bg-[#111111] text-white">
            <AdminSidebar />
            <div className="md:ml-64 p-6">
                <div className="max-w-7xl mx-auto">
                    <div className="flex justify-between items-center mb-8">
                        <div className="space-y-1">
                            <h1 className="text-2xl font-bold">Trading Bots</h1>
                            <div className="flex gap-4">
                                <button
                                    onClick={() => router.push('/admin/bots/sessions')}
                                    className="text-sm text-gray-400 hover:text-white"
                                >
                                    View Active Sessions
                                </button>
                            </div>
                        </div>
              
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {bots.map((bot) => (
                            <div key={bot.id} className="bg-[#121212] rounded-lg p-6">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="text-lg font-semibold">{bot.name}</h3>
                                        <p className="text-gray-400 text-sm mt-1">{bot.description}</p>
                                    </div>
                                    <button
                                        onClick={() => router.push(`/admin/bots/edit/${bot.id}`)}
                                        className="p-2 hover:bg-gray-800 rounded-lg"
                                    >
                                        <Pencil className="h-4 w-4 text-gray-400" />
                                    </button>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-400">Price</span>
                                        <span>${bot.price_amount.toLocaleString("en-US", { minimumFractionDigits: 2 })} {bot.price_currency}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-400">ROI Range</span>
                                        <span>{bot.min_roi}% - {bot.max_roi}%</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-400">Duration</span>
                                        <span>{bot.duration_days} days</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-400">Status</span>
                                        <span className={`px-2 py-1 rounded-full text-xs ${
                                            bot.status === 'active' 
                                                ? 'bg-green-500/20 text-green-500'
                                                : 'bg-gray-500/20 text-gray-500'
                                        }`}>
                                            {bot.status.charAt(0).toUpperCase() + bot.status.slice(1)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}