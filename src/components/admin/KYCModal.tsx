'use client';

import { useState } from 'react';
import Cookies from 'js-cookie';
import { X } from 'lucide-react';

interface KYCDocument {
    id: number;
    user_id: number;
    document_type: string;
    document_number: string;
    document_front_url: string;
    document_back_url: string;
    status: string;
    created_at: string;
    user: {
        first_name: string;
        last_name: string;
        email: string;
    };
}

interface Props {
    document: KYCDocument;
    onClose: () => void;
    onUpdate: () => void;
}

export function KYCModal({ document, onClose, onUpdate }: Props) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [status, setStatus] = useState(document.status);

    const handleUpdateStatus = async () => {
        setLoading(true);
        setError('');

        try {
            const response = await fetch('/api/admin/kyc/update-status', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${Cookies.get('auth-token')}`
                },
                body: JSON.stringify({
                    documentId: document.id,
                    status
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to update status');
            }

            onUpdate();
            onClose();
        } catch (error) {
            setError(error instanceof Error ? error.message : 'Failed to update status');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-[#121212] rounded-lg max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b border-gray-800 flex justify-between items-center">
                    <h2 className="text-xl font-semibold">Review KYC Document</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white">
                        <X className="h-6 w-6" />
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    {error && (
                        <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/50 text-red-500">
                            {error}
                        </div>
                    )}

                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <h3 className="text-lg font-medium mb-4">Front Document</h3>
                            <a
                                href={document.document_front_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className=" aspect-[3/2] text-center items-center flex flex-col justify-center bg-[#1A1A1A] rounded-lg overflow-hidden hover:opacity-80 transition-opacity"
                            >
                                View Front Document
                            </a>
                        </div>
                        <div>
                            <h3 className="text-lg font-medium mb-4">Back Document</h3>
                            <a
                                href={document.document_back_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className=" aspect-[3/2] text-center items-center flex flex-col justify-center bg-[#1A1A1A] rounded-lg overflow-hidden hover:opacity-80 transition-opacity"
                            >
                                View Back Document

                            </a>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Status</label>
                            <select
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                                className="w-full bg-[#1A1A1A] border border-gray-800 rounded-lg px-4 py-2"
                            >
                                <option value="pending">Pending</option>
                                <option value="verified">Verified</option>
                                <option value="rejected">Rejected</option>
                            </select>
                        </div>

                        <button
                            onClick={handleUpdateStatus}
                            disabled={loading}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg disabled:opacity-50"
                        >
                            {loading ? 'Updating...' : 'Update Status'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}