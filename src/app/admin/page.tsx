'use client';

import React from 'react';
import { useEffect, useState } from 'react';
import { useUserData } from "@/hooks/useUserData"
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { Users, Activity, DollarSign } from 'lucide-react';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { UserModal } from '@/components/admin/UserModal';
import { Search } from 'lucide-react';

// Add these interfaces after the imports
interface AdminStats {
    totalUsers: number;
    totalTransactions: number;
    totalVolume: number;
}

interface AdminUser {
    id: number;
    email: string;
    username?: string;
    first_name: string;
    last_name: string;
    phone_number: string;
    country: string;
    kyc_status: string;
    two_factor_enabled: boolean;
    last_login: string;
    login_ip: string;
    created_at: string;
    updated_at: string;
    is_admin: boolean;
    status: string;
    btc_balance: string;
    eth_balance: string;
    usdt_balance: string;
    bnb_balance: string;
    xrp_balance: string;
    ada_balance: string;
    doge_balance: string;
    sol_balance: string;
    dot_balance: string;
    matic_balance: string;
    link_balance: string;
    uni_balance: string;
    avax_balance: string;
    ltc_balance: string;
    shib_balance: string;
}

export default function AdminDashboard() {
    const router = useRouter();
    const { userData, isLoading: userDataLoading } = useUserData()
    const [stats, setStats] = useState<AdminStats | null>(null);
    const [users, setUsers] = useState<AdminUser[]>([]);
    const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
    
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const [loading, setLoading] = useState(true);
    const filteredUsers = users.filter(user => {
        const searchStr = searchTerm.toLowerCase();
        return (
            user.first_name?.toLowerCase().includes(searchStr) ||
            user.last_name?.toLowerCase().includes(searchStr) ||
            user.email?.toLowerCase().includes(searchStr)
        );
    });

    const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
    const paginatedUsers = filteredUsers.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    useEffect(() => {
        if (!userDataLoading && !userData?.user?.is_admin) {
            router.push('/dashboard');
            return;
        }

        if (!userDataLoading && userData?.user?.is_admin) {
            const fetchData = async () => {
                try {
                    const [statsRes, usersRes] = await Promise.all([
                        fetch('/api/admin/stats', {
                            headers: {
                                'Authorization': `Bearer ${Cookies.get('auth-token')}`
                            }
                        }),
                        fetch('/api/admin/users', {
                            headers: {
                                'Authorization': `Bearer ${Cookies.get('auth-token')}`
                            }
                        })
                    ]);

                    const statsData = await statsRes.json();
                    const usersData = await usersRes.json();

                    if (statsData.success) setStats(statsData.stats);
                    if (usersData.success) setUsers(usersData.users);
                } catch (error) {
                    console.error('Failed to fetch admin data:', error);
                } finally {
                    setLoading(false);
                }
            };

            fetchData();
        }
    }, [userData, userDataLoading, router]);

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
                    <h1 className="text-2xl font-bold mb-8">Admin Dashboard</h1>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <div className="bg-[#121212] p-6 rounded-lg">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-purple-500/20 rounded-lg">
                                    <Users className="h-6 w-6 text-purple-500" />
                                </div>
                                <div>
                                    <div className="text-sm text-gray-400">Total Users</div>
                                    <div className="text-2xl font-bold">{stats?.totalUsers}</div>
                                </div>
                            </div>
                        </div>
                        <div className="bg-[#121212] p-6 rounded-lg">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-orange-500/20 rounded-lg">
                                    <Activity className="h-6 w-6 text-orange-500" />
                                </div>
                                <div>
                                    <div className="text-sm text-gray-400">Total Transactions</div>
                                    <div className="text-2xl font-bold">{stats?.totalTransactions}</div>
                                </div>
                            </div>
                        </div>
                        <div className="bg-[#121212] p-6 rounded-lg">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-green-500/20 rounded-lg">
                                    <DollarSign className="h-6 w-6 text-green-500" />
                                </div>
                                <div>
                                    <div className="text-sm text-gray-400">Total Volume</div>
                                    <div className="text-2xl font-bold">
                                        ${Number(stats?.totalVolume).toLocaleString()}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-[#121212] rounded-lg overflow-hidden mb-8">
                    <div className="p-6 border-b border-gray-800 flex justify-between items-center">
                        <h2 className="text-xl font-semibold">Users</h2>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search users..."
                                value={searchTerm}
                                onChange={(e) => {
                                    setSearchTerm(e.target.value);
                                    setCurrentPage(1); // Reset to first page on search
                                }}
                                className="bg-[#1A1A1A] text-white pl-10 pr-4 py-2 rounded-lg w-64"
                            />
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-gray-800">
                                    <th className="text-left p-4 text-sm font-medium text-gray-400">User</th>
                                    <th className="text-left p-4 text-sm font-medium text-gray-400">Email</th>
                                    <th className="text-right p-4 text-sm font-medium text-gray-400">Balance</th> 
                                    <th className="text-right p-4 text-sm font-medium text-gray-400">Joined</th>
                                </tr>
                            </thead>
                            <tbody>
                                {paginatedUsers.map((user) => (
                                    <tr
                                        key={user.id}
                                        className="border-b border-gray-800/50 hover:bg-[#1A1A1A] cursor-pointer"
                                        onClick={() => setSelectedUser(user)}
                                    >
                                        <td className="p-4">
                                            {user.first_name} {user.last_name}
                                        </td>
                                        <td className="p-4">{user.email}</td>
                                        <td className="p-4 text-right">{Number(user.btc_balance).toFixed(2)}</td> 
                                        <td className="p-4 text-right">
                                            {new Date(user.created_at).toLocaleDateString()}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination Controls */}
                    <div className="p-4 border-t border-gray-800 flex items-center justify-between">
                        <div className="text-sm text-gray-400">
                            Showing {Math.min((currentPage - 1) * itemsPerPage + 1, filteredUsers.length)} to{' '}
                            {Math.min(currentPage * itemsPerPage, filteredUsers.length)} of {filteredUsers.length} users
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                                className={`px-3 py-1 rounded ${
                                    currentPage === 1
                                        ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                                        : 'bg-gray-800 text-white hover:bg-gray-700'
                                }`}
                            >
                                Previous
                            </button>
                            {Array.from({ length: totalPages }, (_, i) => i + 1)
                                .filter(page => {
                                    const distance = Math.abs(page - currentPage);
                                    return distance === 0 || distance === 1 || page === 1 || page === totalPages;
                                })
                                .map((page, index, array) => (
                                    <React.Fragment key={page}>
                                        {index > 0 && array[index - 1] !== page - 1 && (
                                            <span className="px-2 text-gray-500">...</span>
                                        )}
                                        <button
                                            onClick={() => setCurrentPage(page)}
                                            className={`px-3 py-1 rounded ${
                                                currentPage === page
                                                    ? 'bg-blue-600 text-white'
                                                    : 'bg-gray-800 text-white hover:bg-gray-700'
                                            }`}
                                        >
                                            {page}
                                        </button>
                                    </React.Fragment>
                                ))}
                            <button
                                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                disabled={currentPage === totalPages}
                                className={`px-3 py-1 rounded ${
                                    currentPage === totalPages
                                        ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                                        : 'bg-gray-800 text-white hover:bg-gray-700'
                                }`}
                            >
                                Next
                            </button>
                        </div>
                    </div>
                </div>

                {selectedUser && (
                    <UserModal
                        user={selectedUser}
                        onClose={() => {
                            setSelectedUser(null)
                            window.location.reload();
                        }}
                        onUpdate={() => {

                        }}
                    />
                )}
            </div>
        </div>
    );
}