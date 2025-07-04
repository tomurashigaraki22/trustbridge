'use client';

import React, { useEffect, useState } from 'react';
import { useUserData } from "@/hooks/useUserData";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { ArrowLeft } from 'lucide-react';
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
}

interface Props {
    params: Promise<{ id: string }>;
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

const EditTradingBotClient = ({ id }: { id: string }) => {
    const router = useRouter();
    const { userData, isLoading: userDataLoading } = useUserData();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState<TradingBot>({
        id: parseInt(id),
        name: '',
        description: '',
        min_roi: 0,
        max_roi: 0,
        duration_days: 0,
        price_amount: 0,
        price_currency: 'USD',
        status: 'active'
    });

    useEffect(() => {
        if (!userDataLoading && !userData?.user?.is_admin) {
            router.push('/dashboard');
            return;
        }

        if (!userDataLoading && userData?.user?.is_admin) {
            fetchBot();
        }
    }, [userData, userDataLoading, router, id]);

    const fetchBot = async () => {
        try {
            const response = await fetch(`/api/admin/trading-bots/${id}`, {
                headers: {
                    'Authorization': `Bearer ${Cookies.get('auth-token')}`
                }
            });
            const data = await response.json();
            if (data.success) setFormData(data.bot);
        } catch (error) {
            console.error('Failed to fetch bot:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            const response = await fetch('/api/admin/trading-bots', {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${Cookies.get('auth-token')}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                router.push('/admin/bots');
            }
        } catch (error) {
            console.error('Failed to update bot:', error);
        } finally {
            setSaving(false);
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
                <div className="max-w-3xl mx-auto">
                    <button
                        onClick={() => router.push('/admin/bots')}
                        className="flex items-center gap-2 text-gray-400 hover:text-white mb-6"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back to Bots
                    </button>

                    <h1 className="text-2xl font-bold mb-8">Edit Trading Bot</h1>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">
                                Bot Name
                            </label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                className="w-full bg-[#1A1A1A] border border-gray-800 rounded-lg px-4 py-2"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">
                                Description
                            </label>
                            <textarea
                                value={formData.description}
                                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                className="w-full bg-[#1A1A1A] border border-gray-800 rounded-lg px-4 py-2 h-24"
                                required
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">
                                    Minimum ROI (%)
                                </label>
                                <input
                                    type="number"
                                    value={formData.min_roi}
                                    onChange={(e) => setFormData(prev => ({ ...prev, min_roi: parseFloat(e.target.value) }))}
                                    className="w-full bg-[#1A1A1A] border border-gray-800 rounded-lg px-4 py-2"
                                    step="0.01"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">
                                    Maximum ROI (%)
                                </label>
                                <input
                                    type="number"
                                    value={formData.max_roi}
                                    onChange={(e) => setFormData(prev => ({ ...prev, max_roi: parseFloat(e.target.value) }))}
                                    className="w-full bg-[#1A1A1A] border border-gray-800 rounded-lg px-4 py-2"
                                    step="0.01"
                                    required
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">
                                    Duration (Days)
                                </label>
                                <input
                                    type="number"
                                    value={formData.duration_days}
                                    onChange={(e) => setFormData(prev => ({ ...prev, duration_days: parseInt(e.target.value) }))}
                                    className="w-full bg-[#1A1A1A] border border-gray-800 rounded-lg px-4 py-2"
                                    min="1"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">
                                    Price Amount
                                </label>
                                <input
                                    type="number"
                                    value={formData.price_amount}
                                    onChange={(e) => setFormData(prev => ({ ...prev, price_amount: parseFloat(e.target.value) }))}
                                    className="w-full bg-[#1A1A1A] border border-gray-800 rounded-lg px-4 py-2"
                                    step="0.01"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">
                                Status
                            </label>
                            <select
                                value={formData.status}
                                onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                                className="w-full bg-[#1A1A1A] border border-gray-800 rounded-lg px-4 py-2"
                            >
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                            </select>
                        </div>

                        <div className="flex justify-end">
                            <button
                                type="submit"
                                disabled={saving}
                                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                            >
                                {saving ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default async function EditTradingBot({ params, searchParams }: Props) {
    const resolvedParams = await params;
    await searchParams;  

    return <EditTradingBotClient id={resolvedParams.id} />;
}