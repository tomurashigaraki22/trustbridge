'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie'
import { Sidebar } from '@/components/dashboard/Sidebar';
import { TopBar } from '@/components/dashboard/TopBar';
import { Button } from '@/components/ui/Button';
import { useUserData } from "@/hooks/useUserData"

const DOCUMENT_TYPES = {
    1: 'Passport',
    2: 'National ID'
};

export default function KYCPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [documentType, setDocumentType] = useState('1');
    const [documentNumber, setDocumentNumber] = useState('');
    const [frontFile, setFrontFile] = useState<File | null>(null);
    const [backFile, setBackFile] = useState<File | null>(null);
    const { refreshUserData } = useAuth();
    const { userData, refetch, totalBalance } = useUserData()

    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            if (!frontFile || !backFile) {
                throw new Error('Both front and back documents are required');
            }

            const formData = new FormData();
            formData.append('frontFile', frontFile);
            formData.append('backFile', backFile);
            formData.append('documentType', documentType);
            formData.append('documentNumber', documentNumber);

            const response = await fetch('/api/kyc/submit', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${Cookies.get('auth-token')}`
                },
                body: formData
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to submit KYC');
            }

            await refreshUserData();
            router.push('/dashboard');

        } catch (error) {
            setError(error instanceof Error ? error.message : 'Failed to submit KYC');
        } finally {
            setIsLoading(false);
        }
    };

    const renderKYCStatus = () => {
        switch (userData?.user?.kyc_status) {
            case 'pending':
                return (
                    <div className="mb-6 p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/50 text-yellow-500">
                        Your KYC verification is pending. We'll review your documents and update you soon.
                    </div>
                );
            case 'verified':
                return (
                    <div className="mb-6 p-4 rounded-lg bg-green-500/10 border border-green-500/50 text-green-500">
                        Your KYC verification has been approved. You now have full access to all features.
                    </div>
                );
            case 'rejected':
                return (
                    <div className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/50 text-red-500">
                        Your KYC verification was rejected. Please submit new documents.
                    </div>
                );
            default:
                return (
                    <div className="mb-6 p-4 rounded-lg bg-blue-500/10 border border-blue-500/50 text-blue-500">
                        Please submit your KYC documents to verify your identity.
                    </div>
                );
        }
    };

    const shouldShowForm = userData?.user?.kyc_status === 'none' || userData?.user?.kyc_status === 'rejected';

    return (
        <div className="min-h-screen bg-[#111111] text-white">
            <div className="flex flex-col lg:flex-row">
                <Sidebar />
                <div className="flex-1 ">
                    <TopBar title="KYC Verification" />
                    <div className="p-4 lg:p-8">
                        <div className="max-w-7xl mx-auto bg-[#121212] rounded-[1rem] p-6">
                            <h2 className="text-2xl font-semibold mb-6">KYC Verification</h2>

                            {renderKYCStatus()}

                            {shouldShowForm ? (
                                <>
                                    {error && (
                                        <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/50 text-red-500">
                                            {error}
                                        </div>
                                    )}

                                    <form onSubmit={handleSubmit} className="space-y-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-300 mb-1.5">
                                                Document Type
                                            </label>
                                            <select
                                                value={documentType}
                                                onChange={(e) => setDocumentType(e.target.value)}
                                                className="w-full bg-[#1A1A1A] border border-[#333] rounded-lg px-4 py-2.5"
                                                required
                                            >
                                                {Object.entries(DOCUMENT_TYPES).map(([value, label]) => (
                                                    <option key={value} value={value}>{label}</option>
                                                ))}
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-300 mb-1.5">
                                                Document Number
                                            </label>
                                            <input
                                                type="text"
                                                value={documentNumber}
                                                onChange={(e) => setDocumentNumber(e.target.value)}
                                                className="w-full bg-[#1A1A1A] border border-[#333] rounded-lg px-4 py-2.5"
                                                required
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-300 mb-1.5">
                                                Front of Document
                                            </label>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) => setFrontFile(e.target.files?.[0] || null)}
                                                className="w-full bg-[#1A1A1A] border border-[#333] rounded-lg px-4 py-2.5"
                                                required
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-300 mb-1.5">
                                                Back of Document
                                            </label>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) => setBackFile(e.target.files?.[0] || null)}
                                                className="w-full bg-[#1A1A1A] border border-[#333] rounded-lg px-4 py-2.5"
                                                required
                                            />
                                        </div>

                                        <Button
                                            type="submit"
                                            disabled={isLoading}
                                            className="w-full"
                                        >
                                            {isLoading ? 'Submitting...' : 'Submit KYC Documents'}
                                        </Button>
                                    </form>
                                </>
                            ) : null}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}