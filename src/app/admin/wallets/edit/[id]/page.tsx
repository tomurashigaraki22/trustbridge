'use client';

import React, { useEffect, useState } from 'react';
import { useUserData } from "@/hooks/useUserData";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { ArrowLeft } from 'lucide-react';
import { AdminSidebar } from '@/components/admin/AdminSidebar';

interface WalletAddress {
    id: number;
    currency: string;
    address: string;
    label: string;
    is_default: boolean;
    created_at: string;
}

interface Props {
    params: Promise<{ id: string }>;
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}
function EditWalletPageClient({ id }: { id: string }) {


    const router = useRouter();
    const { userData, isLoading: userDataLoading } = useUserData();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState<WalletAddress>({
        id: parseInt(id),
        currency: '',
        address: '',
        label: '',
        is_default: false,
        created_at: new Date().toISOString()
    });

    useEffect(() => {
        if (!userDataLoading && !userData?.user?.is_admin) {
            router.push('/dashboard');
            return;
        }

        if (!userDataLoading && userData?.user?.is_admin) {
            fetchWallet();
        }
    }, [userData, userDataLoading, router, id]);

    const fetchWallet = async () => {
        try {
            const response = await fetch(`/api/admin/wallets/${id}`, {
                headers: {
                    'Authorization': `Bearer ${Cookies.get('auth-token')}`
                }
            });
            const data = await response.json();
            if (data.success) setFormData(data.wallet);
        } catch (error) {
            console.error('Failed to fetch wallet:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            const response = await fetch(`/api/admin/wallets/${id}`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${Cookies.get('auth-token')}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                router.push('/admin/wallets');
            }
        } catch (error) {
            console.error('Failed to update wallet:', error);
        } finally {
            setSaving(false);
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
                <div className="max-w-3xl mx-auto">
                    <button
                        onClick={() => router.push('/admin/wallets')}
                        className="flex items-center gap-2 text-gray-400 hover:text-white mb-6"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back to Wallets
                    </button>

                    <h1 className="text-2xl font-bold mb-8">Edit Wallet Address</h1>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">
                                Label
                            </label>
                            <input
                                type="text"
                                value={formData.label}
                                onChange={(e) => setFormData(prev => ({ ...prev, label: e.target.value }))}
                                className="w-full bg-[#1A1A1A] border border-gray-800 rounded-lg px-4 py-2"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">
                                Currency
                            </label>
                            <input
                                type="text"
                                value={formData.currency}
                                onChange={(e) => setFormData(prev => ({ ...prev, currency: e.target.value }))}
                                className="w-full bg-[#1A1A1A] border border-gray-800 rounded-lg px-4 py-2"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">
                                Address
                            </label>
                            <input
                                type="text"
                                value={formData.address}
                                onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                                className="w-full bg-[#1A1A1A] border border-gray-800 rounded-lg px-4 py-2"
                                required
                            />
                        </div>

                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                id="is_default"
                                checked={formData.is_default}
                                onChange={(e) => setFormData(prev => ({ ...prev, is_default: e.target.checked }))}
                                className="mr-2"
                            />
                            <label htmlFor="is_default" className="text-sm text-gray-400">
                                Set as Default Address
                            </label>
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
}

export default async function EditWalletPage({ params, searchParams }: Props) {
    const resolvedParams = await params;
    await searchParams;  

    return <EditWalletPageClient id={resolvedParams.id} />;
}