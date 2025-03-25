'use client';

import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';

interface AccountInfo {
    id: number;
    title: string;
    message: string;
    priority: string;
    created_at: string;
}

interface AccountInfoProps {
    limit?: number;
}

export function AccountInfo({ limit }: AccountInfoProps) {
    const [accountInfos, setAccountInfos] = useState<AccountInfo[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const fetchAccountInfo = async () => {
            try {
                const response = await fetch(`/api/account/info${limit ? `?limit=${limit}` : ''}`, {
                    headers: {
                        'Authorization': `Bearer ${Cookies.get('auth-token')}`
                    }
                });
                const data = await response.json();
                if (data.success) {
                    setAccountInfos(data.accountInfos);
                }
            } catch (error) {
                console.error('Failed to fetch account info:', error);
            } finally {
                setLoading(false);
            }
        };

        // Initial fetch
        fetchAccountInfo();

        // Set up interval for periodic checks
        const interval = setInterval(fetchAccountInfo, 5000);

        // Cleanup interval on component unmount
        return () => clearInterval(interval);
    }, [limit]);

    if (loading) {
        return <div className="animate-pulse bg-[#121212] rounded-[1rem] p-4 h-32"></div>;
    }

    if (accountInfos.length === 0) {
        return null;
    }

    return (
        <div className="bg-[#121212] rounded-[1rem] p-4">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-medium">Account Information</h2>
                <button
                    onClick={() => router.push('/dashboard/account-info')}
                    className="text-sm text-orange-500 hover:text-orange-400"
                >
                    View All
                </button>
            </div>
            <div className="space-y-4">
                {accountInfos.slice(0, limit).map((info) => (
                    <div
                        key={info.id}
                        className={`p-4 rounded-lg ${info.priority === 'urgent'
                                ? 'bg-red-500/10 border border-red-500/20'
                                : 'bg-purple-500/10 border border-purple-500'
                            }`}
                    >
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="font-medium">{info.title}</h3>
                            <span className={`text-xs px-2 py-1 rounded ${info.priority === 'urgent'
                                    ? 'bg-red-500/20 text-red-400'
                                    : 'bg-purple-500/20 text-purple-500'
                                }`}>
                                {info.priority}
                            </span>
                        </div>
                        <p className="text-gray-400 text-sm">{info.message}</p>
                        <div className="mt-2 text-xs text-gray-500">
                            {new Date(info.created_at).toLocaleDateString()}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}