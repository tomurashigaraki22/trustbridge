'use client';

import React, { useEffect, useState } from 'react';
import { useUserData } from "@/hooks/useUserData";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { ArrowLeft, X } from 'lucide-react';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { TradingChart } from '@/components/trading/TradingChart';

interface BotSession {
    id: number;
    user_id: number;
    bot_id: number;
    initial_amount: number;
    currency: string;
    start_date: string;
    end_date: string;
    status: string;
    trading_data_url: string;
    current_profit: number;
    user_email: string;
    username: string;
    bot_name: string;
}

export default function BotSessionsPage() {
    const router = useRouter();
    const { userData, isLoading: userDataLoading } = useUserData();
    const [sessions, setSessions] = useState<BotSession[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedSession, setSelectedSession] = useState<BotSession | null>(null);
    const [updating, setUpdating] = useState(false);

    useEffect(() => {
        if (!userDataLoading && !userData?.user?.is_admin) {
            router.push('/dashboard');
            return;
        }

        if (!userDataLoading && userData?.user?.is_admin) {
            fetchSessions();
        }
    }, [userData, userDataLoading, router]);

    const fetchSessions = async () => {
        try {
            const response = await fetch('/api/admin/bot-sessions', {
                headers: {
                    'Authorization': `Bearer ${Cookies.get('auth-token')}`
                }
            });
            const data = await response.json();
            if (data.success) setSessions(data.sessions);
        } catch (error) {
            console.error('Failed to fetch bot sessions:', error);
        } finally {
            setLoading(false);
        }
    };

    const updateSessionStatus = async (newStatus: string) => {
        setUpdating(true);
        try {
            const response = await fetch(`/api/admin/bot-sessions/${selectedSession?.id}`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${Cookies.get('auth-token')}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ status: newStatus })
            });

            if (response.ok) {
                // Update local state
                setSessions(prev => prev.map(session => 
                    session.id === selectedSession?.id 
                        ? { ...session, status: newStatus }
                        : session
                ));
                setSelectedSession(prev => prev ? { ...prev, status: newStatus } : null);
            }
        } catch (error) {
            console.error('Failed to update session status:', error);
        } finally {
            setUpdating(false);
        }
    };

    if (loading) {
        return <div className="min-h-screen bg-white text-white flex items-center justify-center">
            Loading...
        </div>;
    }

    return (
        <div className="min-h-screen bg-white text-white">
            <AdminSidebar />
            <div className="md:ml-64 p-6">
                <div className="max-w-7xl mx-auto">
                    <button
                        onClick={() => router.push('/admin/bots')}
                        className="flex items-center gap-2 text-gray-400 hover:text-white mb-6"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back to Bots
                    </button>

                    <h1 className="text-2xl font-bold mb-8">Bot Sessions</h1>

                    <div className="bg-[#121212] rounded-lg overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-[#1A1A1A]">
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400">User</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400">Bot</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400">Amount</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400">Profit</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400">Start Date</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400">End Date</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-800">
                                    {sessions.map((session) => (
                                        <tr 
                                            key={session.id} 
                                            className="hover:bg-[#1A1A1A] cursor-pointer"
                                            onClick={() => setSelectedSession(session)}
                                        >
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div>
                                                    <div className="text-sm">{session.username}</div>
                                                    <div className="text-xs text-gray-400">{session.user_email}</div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                {session.bot_name}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                ${session.initial_amount.toLocaleString("en-US", { minimumFractionDigits: 2 })} {session.currency}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                <span className={session.current_profit >= 0 ? 'text-green-500' : 'text-red-500'}>
                                                    {session.current_profit >= 0 ? '+' : ''}{session.current_profit}%
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                {new Date(session.start_date).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                {session.end_date ? new Date(session.end_date).toLocaleDateString() : '-'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 py-1 text-xs rounded-full ${
                                                    session.status === 'active' 
                                                        ? 'bg-green-500/20 text-green-500'
                                                        : session.status === 'completed'
                                                        ? 'bg-blue-500/20 text-blue-500'
                                                        : 'bg-gray-500/20 text-gray-500'
                                                }`}>
                                                    {session.status.charAt(0).toUpperCase() + session.status.slice(1)}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            {selectedSession && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
                    onClick={(e) => {
                        if (e.target === e.currentTarget) {
                            setSelectedSession(null);
                        }
                    }}
                >
                    <div className="relative w-full max-w-3xl mx-4">
                        <div className="relative w-full rounded-[1rem] bg-[#121212] p-6">
                            <button 
                                onClick={() => setSelectedSession(null)}
                                className="absolute right-4 top-4 p-2 hover:bg-gray-800 rounded-lg"
                            >
                                <X className="h-4 w-4 text-gray-400" />
                            </button>
                            
                            <h3 className="text-lg font-semibold mb-4">Session Details</h3>
                            
                            <div className="grid grid-cols-2 gap-4 mb-6">
                                <div>
                                    <p className="text-sm text-gray-400">User</p>
                                    <p className="text-sm">{selectedSession.username}</p>
                                    <p className="text-xs text-gray-400">{selectedSession.user_email}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-400">Bot</p>
                                    <p className="text-sm">{selectedSession.bot_name}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-400">Amount</p>
                                    <p className="text-sm">${selectedSession.initial_amount.toLocaleString("en-US", { minimumFractionDigits: 2 })} {selectedSession.currency}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-400">Current Profit</p>
                                    <p className={`text-sm ${selectedSession.current_profit >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                                        {selectedSession.current_profit >= 0 ? '+' : ''}{selectedSession.current_profit}%
                                    </p>
                                </div>
                            </div>

                            <div className="mb-6">
                                <p className="text-sm text-gray-400 mb-2">Status</p>
                                <select
                                    value={selectedSession.status}
                                    onChange={(e) => updateSessionStatus(e.target.value)}
                                    disabled={updating}
                                    className="bg-[#1A1A1A] border border-gray-800 rounded-lg px-4 py-2 text-sm w-full max-w-[200px]"
                                >
                                    <option value="active">Active</option>
                                    <option value="completed">Completed</option>
                                    <option value="failed">Failed</option>
                                </select>
                            </div>

                            <div className="relative w-full rounded-[1rem] bg-[#1A1A1A] p-4">
                                <TradingChart sessionId={selectedSession.id} height="300px" />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}