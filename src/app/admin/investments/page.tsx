'use client';

import React, { useEffect, useState } from 'react';
import { useUserData } from "@/hooks/useUserData";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import {   Pencil } from 'lucide-react';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
interface InvestmentPackage {
    id: number
    name: string
    min_amount_usd: number
    max_amount_usd: number
    duration_days: number
    min_roi: number
    max_roi: number
    risk_level: "low" | "medium" | "high"
    description: string
    features: string[]
    is_active: boolean
}
export default function AdminInvestmentsPage() {
    const router = useRouter();
    const { userData, isLoading: userDataLoading } = useUserData();
    const [packages, setPackages] = useState<InvestmentPackage[]>([]);
    const [loading, setLoading] = useState(true);
 
    useEffect(() => {
        if (!userDataLoading && !userData?.user?.is_admin) {
            router.push('/dashboard');
            return;
        }

        if (!userDataLoading && userData?.user?.is_admin) {
            fetchPackages();
        }
    }, [userData, userDataLoading, router]);

    const fetchPackages = async () => {
        try {
            const response = await fetch('/api/admin/investment-packages', {
                headers: {
                    'Authorization': `Bearer ${Cookies.get('auth-token')}`
                }
            });
            const data = await response.json();
            if (data.success) setPackages(data.packages);
        } catch (error) {
            console.error('Failed to fetch investment packages:', error);
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
                            <h1 className="text-2xl font-bold">Investment Packages</h1>
                            <div className="flex gap-4">
                                <button
                                    onClick={() => router.push('/admin/investments/recent')}
                                    className="text-sm text-gray-400 hover:text-white"
                                >
                                    View Recent Investments
                                </button>
                            </div>
                        </div>
  
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {packages.map((pkg) => (
                            <div key={pkg.id} className="bg-[#121212] rounded-lg p-6">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="text-lg font-semibold">{pkg.name}</h3>
                                        <p className="text-gray-400 text-sm mt-1">{pkg.description}</p>
                                    </div>
                                    <button
                                        onClick={() => router.push(`/admin/investments/edit/${pkg.id}`)}
                                        className="p-2 hover:bg-gray-800 rounded-lg"
                                    >
                                        <Pencil className="h-4 w-4 text-gray-400" />
                                    </button>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-400">Minimum Investment</span>
                                        <span>${pkg.min_amount_usd.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-400">Maximum Investment</span>
                                        <span>${pkg.max_amount_usd.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-400">Duration</span>
                                        <span>{pkg.duration_days} days</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-400">ROI</span>
                                        <span className="text-green-500">{pkg.max_roi}%</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-400">Status</span>
                                        <span className={`px-2 py-1 rounded-full text-xs ${
                                            pkg.is_active 
                                                ? 'bg-green-500/20 text-green-500'
                                                : 'bg-gray-500/20 text-gray-500'
                                        }`}>
                                            {pkg.is_active ? 'Active' : 'Inactive'}
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