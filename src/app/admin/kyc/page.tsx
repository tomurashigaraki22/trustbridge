'use client';

import { useEffect, useState } from 'react';
import { useUserData } from "@/hooks/useUserData";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { Search } from 'lucide-react';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { KYCModal } from '@/components/admin/KYCModal';

interface KYCDocument {
    id: number;
    user_id: number;
    document_type: string;
    document_number: string;
    document_front_url: string;
    document_back_url: string;
    status: 'pending' | 'verified' | 'rejected';
    created_at: string;
    user: {
        first_name: string;
        last_name: string;
        email: string;
    };
}

export default function AdminKYCPage() {
    const router = useRouter();
    const { userData, isLoading: userDataLoading } = useUserData();
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [kycDocuments, setKYCDocuments] = useState<KYCDocument[]>([]);
    const [selectedDocument, setSelectedDocument] = useState<KYCDocument | null>(null);
    const [loading, setLoading] = useState(true);
    const itemsPerPage = 20;

    useEffect(() => {
        if (!userDataLoading && !userData?.user?.is_admin) {
            router.push('/dashboard');
            console.log('User is not an admin');
            return;
        }

        if (!userDataLoading && userData?.user?.is_admin) {
            fetchKYCDocuments();
        }
    }, [userData, userDataLoading, router]);

    const fetchKYCDocuments = async () => {
        try {
            const response = await fetch('/api/admin/kyc', {
                headers: {
                    'Authorization': `Bearer ${Cookies.get('auth-token')}`
                }
            });
            const data = await response.json();
            if (data.success) setKYCDocuments(data.documents);
        } catch (error) {
            console.error('Failed to fetch KYC documents:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredDocuments = kycDocuments.filter(doc => {
        const searchStr = searchTerm.toLowerCase();
        return (
            doc.user.first_name?.toLowerCase().includes(searchStr) ||
            doc.user.last_name?.toLowerCase().includes(searchStr) ||
            doc.user.email?.toLowerCase().includes(searchStr) ||
            doc.document_number?.toLowerCase().includes(searchStr)
        );
    });

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'verified':
                return 'bg-green-500/20 text-green-500';
            case 'rejected':
                return 'bg-red-500/20 text-red-500';
            default:
                return 'bg-yellow-500/20 text-yellow-500';
        }
    };

    if (loading) {
        return <div className="min-h-screen bg-[#111111] text-white flex items-center justify-center">
            Loading...
        </div>;
    }

    // Add pagination calculations
    const totalPages = Math.ceil(filteredDocuments.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentDocuments = filteredDocuments.slice(startIndex, endIndex);

    // Add pagination controls
    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    return (
        <div className="min-h-screen bg-[#111111] text-white">
            <AdminSidebar />
            <div className="md:ml-64 p-6">
                <div className="max-w-7xl mx-auto">
                    <div className="flex justify-between items-center mb-8">
                        <h1 className="text-2xl font-bold">KYC Management</h1>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search KYC documents..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="bg-[#1A1A1A] text-white pl-10 pr-4 py-2 rounded-lg w-64"
                            />
                        </div>
                    </div>

                    <div className="bg-[#121212] rounded-lg overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-gray-800">
                                        <th className="text-left p-4 text-sm font-medium text-gray-400">User</th>
                                        <th className="text-left p-4 text-sm font-medium text-gray-400">Document Type</th>
                                        <th className="text-left p-4 text-sm font-medium text-gray-400">Document Number</th>
                                        <th className="text-center p-4 text-sm font-medium text-gray-400">Status</th>
                                        <th className="text-right p-4 text-sm font-medium text-gray-400">Submitted</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentDocuments.map((doc) => (
                                        <tr
                                            key={doc.id}
                                            className="border-b border-gray-800/50 hover:bg-[#1A1A1A] cursor-pointer"
                                            onClick={() => setSelectedDocument(doc)}
                                        >
                                            <td className="p-4">
                                                {doc.user.first_name} {doc.user.last_name}
                                                <div className="text-sm text-gray-400">{doc.user.email}</div>
                                            </td>
                                            <td className="p-4">{doc.document_type}</td>
                                            <td className="p-4">{doc.document_number}</td>
                                            <td className="p-4 text-center">
                                                <span className={`px-2 py-1 rounded text-xs ${getStatusColor(doc.status)}`}>
                                                    {doc.status.charAt(0).toUpperCase() + doc.status.slice(1)}
                                                </span>
                                            </td>
                                            <td className="p-4 text-right">
                                                {new Date(doc.created_at).toLocaleDateString()}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                         {totalPages > 1 && (
                            <div className="flex items-center justify-between px-4 py-3 border-t border-gray-800">
                                <div className="flex items-center text-sm text-gray-400">
                                    Showing {startIndex + 1} to {Math.min(endIndex, filteredDocuments.length)} of {filteredDocuments.length} entries
                                </div>
                                <div className="flex gap-1">
                                    <button
                                        onClick={() => handlePageChange(currentPage - 1)}
                                        disabled={currentPage === 1}
                                        className="px-3 py-1 rounded bg-[#1A1A1A] text-sm disabled:opacity-50"
                                    >
                                        Previous
                                    </button>
                                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                        <button
                                            key={page}
                                            onClick={() => handlePageChange(page)}
                                            className={`px-3 py-1 rounded text-sm ${
                                                currentPage === page 
                                                    ? 'bg-blue-600 text-white' 
                                                    : 'bg-[#1A1A1A] hover:bg-[#242424]'
                                            }`}
                                        >
                                            {page}
                                        </button>
                                    ))}
                                    <button
                                        onClick={() => handlePageChange(currentPage + 1)}
                                        disabled={currentPage === totalPages}
                                        className="px-3 py-1 rounded bg-[#1A1A1A] text-sm disabled:opacity-50"
                                    >
                                        Next
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {selectedDocument && (
                    <KYCModal
                        document={selectedDocument}
                        onClose={() => {
                            setSelectedDocument(null);
                            fetchKYCDocuments();
                        }}
                        onUpdate={fetchKYCDocuments}
                    />
                )}
            </div>
        </div>
    );
}