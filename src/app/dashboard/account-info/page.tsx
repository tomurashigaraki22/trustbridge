'use client';

import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { Sidebar } from "@/components/dashboard/Sidebar";
import { TopBar } from "@/components/dashboard/TopBar";
import { useUserData } from "@/hooks/useUserData";

interface AccountInfo {
    id: number;
    title: string;
    message: string;
    priority: string;
    created_at: string;
}

export default function AccountInfoPage() {
    const [accountInfos, setAccountInfos] = useState<AccountInfo[]>([]);
    const [loading, setLoading] = useState(true);
    const { userData } = useUserData();

    useEffect(() => {
        const fetchAccountInfo = async () => {
            try {
                const response = await fetch('/api/account/info', {
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
    }, []);

    return (
        <div className="min-h-screen bg-[#111111] text-white">
            <div className="flex">
                <Sidebar />
                <div className="flex-1 ">
                    <TopBar title="Account Information" notices={userData?.notices} />
                    <div className="p-6">
                        <div className="  mx-auto">
                            {loading ? (
                                <div className="space-y-4">
                                    {[...Array(3)].map((_, i) => (
                                        <div key={i} className="animate-pulse bg-[#121212] rounded-[1rem] p-4 h-32" />
                                    ))}
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {accountInfos.map((info) => (
                                        <div
                                            key={info.id}
                                            className={`p-6 rounded-lg ${info.priority === 'urgent'
                                                    ? 'bg-red-500/10 border border-red-500/20'
                                                    : 'bg-blue-500/20 border border-gray-800'
                                                }`}
                                        >
                                            <div className="flex items-center justify-between mb-3">
                                                <h3 className="text-lg font-medium">{info.title}</h3>
                                                <span className={`text-sm px-3 py-1 rounded-full ${info.priority === 'urgent'
                                                        ? 'bg-red-500/20 text-red-400'
                                                        : 'bg-blue-500/20 text-blue-400'
                                                    }`}>
                                                    {info.priority}
                                                </span>
                                            </div>
                                            <p className="text-gray-400">{info.message}</p>
                                            <div className="mt-3 text-sm text-gray-500">
                                                {new Date(info.created_at).toLocaleString()}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}