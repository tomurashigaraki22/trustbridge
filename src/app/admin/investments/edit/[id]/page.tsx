'use client';

import React, { useEffect, useState } from 'react';
import { useUserData } from "@/hooks/useUserData";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { ArrowLeft, Plus } from 'lucide-react';

interface InvestmentPackage {
    id: number;
    name: string;
    description: string;
    duration_days: number;
    min_roi: number;
    max_roi: number;
    risk_level: string;
    features: string;
    min_amount_usd: number;
    max_amount_usd: number;
    is_active: boolean;
}



interface Props {
    params: Promise<{ id: string }>;
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}
function EditInvestmentPackageClient({ id }: { id: string }) {
    const router = useRouter();
    const { userData, isLoading: userDataLoading } = useUserData();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState<InvestmentPackage>({
        id: parseInt(id),
        name: '',
        description: '',
        duration_days: 0,
        min_roi: 0,
        max_roi: 0,
        risk_level: 'low',
        features: '',
        min_amount_usd: 0,
        max_amount_usd: 0,
        is_active: true
    });

    // Update featuresList state initialization
    const [featuresList, setFeaturesList] = useState<string[]>([]);

    useEffect(() => {
        if (!userDataLoading && !userData?.user?.is_admin) {
            router.push('/dashboard');
            return;
        }

        if (!userDataLoading && userData?.user?.is_admin) {
            fetchPackage();
        }
    }, [userData, userDataLoading, router, id]);

    useEffect(() => {
        // Convert features string to array when formData changes
        if (formData.features) {
            try {
                const parsedFeatures = JSON.parse(formData.features);
                setFeaturesList(Array.isArray(parsedFeatures) ? parsedFeatures : []);
            } catch {
                // If parsing fails, try splitting by comma as fallback
                setFeaturesList(formData.features.split(',').map(f => f.trim()));
            }
        }
    }, [formData.features]);

    const handleFeatureChange = (index: number, value: string) => {
        const newFeatures = [...featuresList];
        newFeatures[index] = value;
        setFeaturesList(newFeatures);
        setFormData(prev => ({
            ...prev,
            features: JSON.stringify(newFeatures.filter(f => f.trim()))
        }));
    };


    const handleAddFeature = () => {
        setFeaturesList(prev => [...prev, '']);
    };



    const handleRemoveFeature = (index: number) => {
        setFeaturesList(prev => {
            const newFeatures = prev.filter((_, i) => i !== index);
            setFormData(prevForm => ({
                ...prevForm,
                features: newFeatures.filter(f => f.trim()).join(',')
            }));
            return newFeatures;
        });
    };
    // Update the useEffect dependency
    useEffect(() => {
        if (!userDataLoading && !userData?.user?.is_admin) {
            router.push('/dashboard');
            return;
        }

        if (!userDataLoading && userData?.user?.is_admin) {
            fetchPackage();
        }
    }, [userData, userDataLoading, router, id]);

    const fetchPackage = async () => {
        try {
            const response = await fetch(`/api/admin/investment-packages/${id}`, {
                headers: {
                    'Authorization': `Bearer ${Cookies.get('auth-token')}`
                }
            });
            const data = await response.json();
            if (data.success) setFormData(data.package);
        } catch (error) {
            console.error('Failed to fetch package:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            const response = await fetch('/api/admin/investment-packages', {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${Cookies.get('auth-token')}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                router.push('/admin/investments');
            }
        } catch (error) {
            console.error('Failed to update package:', error);
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
                        onClick={() => router.push('/admin/investments')}
                        className="flex items-center gap-2 text-gray-400 hover:text-white mb-6"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back to Packages
                    </button>

                    <h1 className="text-2xl font-bold mb-8">Edit Investment Package</h1>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">
                                    Package Name
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
                                    Risk Level
                                </label>
                                <select
                                    value={formData.risk_level}
                                    onChange={(e) => setFormData(prev => ({ ...prev, risk_level: e.target.value }))}
                                    className="w-full bg-[#1A1A1A] border border-gray-800 rounded-lg px-4 py-2"
                                >
                                    <option value="low">Low</option>
                                    <option value="medium">Medium</option>
                                    <option value="high">High</option>
                                </select>
                            </div>
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
                                    Features
                                </label>
                                <div className="space-y-2">
                                    {featuresList.map((feature, index) => (
                                        <div key={index} className="flex gap-2">
                                            <input
                                                type="text"
                                                value={feature}
                                                onChange={(e) => handleFeatureChange(index, e.target.value)}
                                                className="flex-1 bg-[#1A1A1A] border border-gray-800 rounded-lg px-4 py-2"
                                                placeholder="Enter feature"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveFeature(index)}
                                                className="px-3 py-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500/20"
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    ))}
                                    <button
                                        type="button"
                                        onClick={handleAddFeature}
                                        className="w-full px-4 py-2 bg-gray-800 text-gray-400 rounded-lg hover:bg-gray-700 hover:text-white flex items-center justify-center gap-2"
                                    >
                                        <Plus className="h-4 w-4" />
                                        Add Feature
                                    </button>
                                </div>
                            </div>
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
                                    Minimum Amount (USD)
                                </label>
                                <input
                                    type="number"
                                    value={formData.min_amount_usd}
                                    onChange={(e) => setFormData(prev => ({ ...prev, min_amount_usd: parseFloat(e.target.value) }))}
                                    className="w-full bg-[#1A1A1A] border border-gray-800 rounded-lg px-4 py-2"
                                    step="0.01"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">
                                    Maximum Amount (USD)
                                </label>
                                <input
                                    type="number"
                                    value={formData.max_amount_usd}
                                    onChange={(e) => setFormData(prev => ({ ...prev, max_amount_usd: parseFloat(e.target.value) }))}
                                    className="w-full bg-[#1A1A1A] border border-gray-800 rounded-lg px-4 py-2"
                                    step="0.01"
                                    required
                                />
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <input
                                type="checkbox"
                                id="is_active"
                                checked={formData.is_active}
                                onChange={(e) => setFormData(prev => ({ ...prev, is_active: e.target.checked }))}
                                className="w-4 h-4 rounded border-gray-800"
                            />
                            <label htmlFor="is_active" className="text-sm font-medium text-gray-400">
                                Package is active
                            </label>
                        </div>

                        <div className="flex justify-end gap-4">
                            <button
                                type="button"
                                onClick={() => router.push('/admin/investments')}
                                className="px-4 py-2 text-gray-400 hover:text-white"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={saving}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
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


export default async function EditInvestmentPackage({ params, searchParams }: Props) {
    const resolvedParams = await params;
    await searchParams;

    return <EditInvestmentPackageClient id={resolvedParams.id} />;
}