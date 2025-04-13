'use client';

import React, { useEffect, useState } from 'react';
import { useUserData } from "@/hooks/useUserData";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { Search } from 'lucide-react';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { UserModal } from '@/components/admin/UserModal';

// Add this interface after the imports
interface AdminUser {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    phone_number: string;
    country: string;
    kyc_status: string;
    two_factor_enabled: boolean;
    btc_balance: string;
    eth_balance: string;
    is_admin: boolean;
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
    status: string;
    created_at: string;
    updated_at: string;
    last_login: string;
    login_ip: string;
}

export default function AdminUsersPage() {
    const router = useRouter();
    const { userData, isLoading: userDataLoading } = useUserData();
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [users, setUsers] = useState<AdminUser[]>([]);
    const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);

    const [loading, setLoading] = useState(true);
    const itemsPerPage = 20;

    useEffect(() => {
        if (!userDataLoading && !userData?.user?.is_admin) {
            router.push('/dashboard');
            return;
        }

        if (!userDataLoading && userData?.user?.is_admin) {
            fetchUsers();
        }
    }, [userData, userDataLoading, router]);

    const fetchUsers = async () => {
        try {
            const response = await fetch('/api/admin/users', {
                headers: {
                    'Authorization': `Bearer ${Cookies.get('auth-token')}`
                }
            });
            const data = await response.json();
            if (data.success) setUsers(data.users);
        } catch (error) {
            console.error('Failed to fetch users:', error);
        } finally {
            setLoading(false);
        }
    };

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
                        <h1 className="text-2xl font-bold">Users Management</h1>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search users..."
                                value={searchTerm}
                                onChange={(e) => {
                                    setSearchTerm(e.target.value);
                                    setCurrentPage(1);
                                }}
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
                                        <th className="text-left p-4 text-sm font-medium text-gray-400">Email</th>
                                        <th className="text-right p-4 text-sm font-medium text-gray-400">Balance</th> 
                                        <th className="text-right p-4 text-sm font-medium text-gray-400">Status</th>
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
                                            <td className="p-4 text-right">{Number(user.btc_balance).toFixed(8)}</td>
                                            <td className="p-4 text-right">{Number(user.usdt_balance).toFixed(2)}</td>
                                            <td className="p-4 text-right">
                                                <span className={`px-2 py-1 rounded text-xs ${user.status == "active" ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'
                                                    }`}>
                                                    {user.status == "active" ? 'Active' : 'Inactive'}
                                                </span>
                                            </td>
                                            <td className="p-4 text-right">
                                                {new Date(user.created_at).toLocaleDateString()}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="p-4 border-t border-gray-800 flex items-center justify-between">
                            <div className="text-sm text-gray-400">
                                Showing {Math.min((currentPage - 1) * itemsPerPage + 1, filteredUsers.length)} to{' '}
                                {Math.min(currentPage * itemsPerPage, filteredUsers.length)} of {filteredUsers.length} users
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                    disabled={currentPage === 1}
                                    className={`px-3 py-1 rounded ${currentPage === 1
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
                                                className={`px-3 py-1 rounded ${currentPage === page
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
                                    className={`px-3 py-1 rounded ${currentPage === totalPages
                                            ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                                            : 'bg-gray-800 text-white hover:bg-gray-700'
                                        }`}
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {selectedUser && (
                    <UserModal
                        user={selectedUser}
                        onClose={() => {
                            setSelectedUser(null);
                            fetchUsers(); // Refresh the users list after modal closes
                        }}
                        onUpdate={fetchUsers}
                    />
                )}
            </div>
        </div>
    );
}