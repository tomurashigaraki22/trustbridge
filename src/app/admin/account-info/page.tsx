'use client';

import React, { useEffect, useState } from 'react';
import { useUserData } from "@/hooks/useUserData";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import Select from 'react-select';
import { Pencil, Trash2 } from 'lucide-react';

interface User {
    id: number;
    email: string;
    username: string;
}

interface AccountInfo {
    id: number;
    user_id: number;
    title: string;
    message: string;
    priority: string;
    created_at: string;
    username: string;
    email: string;
}

export default function AccountInfoPage() {
    const router = useRouter();
    const { userData, isLoading: userDataLoading } = useUserData();
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [formData, setFormData] = useState({
        title: '',
        message: '',
        priority: 'normal'
    });
    const [wordCount, setWordCount] = useState(0);
    const [accountInfos, setAccountInfos] = useState<AccountInfo[]>([]);
    const [editInfo, setEditInfo] = useState<AccountInfo | null>(null);
    const [showEditModal, setShowEditModal] = useState(false);

    useEffect(() => {
        if (!userDataLoading && !userData?.user?.is_admin) {
            router.push('/dashboard');
            return;
        }

        if (!userDataLoading && userData?.user?.is_admin) {
            const initializeData = async () => {
                setLoading(true);
                try {
                    await Promise.all([fetchUsers(), fetchAccountInfos()]);
                } finally {
                    setLoading(false);
                }
            };

            initializeData();
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
        }
    };

    const fetchAccountInfos = async () => {
        try {
            const response = await fetch('/api/admin/account-info', {
                headers: {
                    'Authorization': `Bearer ${Cookies.get('auth-token')}`
                }
            });
            const data = await response.json();
            if (data.success) setAccountInfos(data.accountInfos);
        } catch (error) {
            console.error('Failed to fetch account infos:', error);
        }
    };

    const handleMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const words = e.target.value.trim().split(/\s+/).length;
        if (words <= 50) {
            setFormData(prev => ({ ...prev, message: e.target.value }));
            setWordCount(words);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedUser) return;

        setSending(true);
        try {
            const response = await fetch('/api/admin/account-info/send', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${Cookies.get('auth-token')}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    userId: selectedUser.id,
                    ...formData
                })
            });

            if (response.ok) {
                setSelectedUser(null);
                setFormData({
                    title: '',
                    message: '',
                    priority: 'normal'
                });
                setWordCount(0);
                await fetchAccountInfos(); // Refresh the list after successful submission
                alert('Account information sent successfully!');
            }
        } catch (error) {
            console.error('Failed to send account info:', error);
            alert('Failed to send account information');
        } finally {
            setSending(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure you want to delete this information?')) return;

        try {
            const response = await fetch(`/api/admin/account-info/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${Cookies.get('auth-token')}`
                }
            });

            if (response.ok) {
                setAccountInfos(prev => prev.filter(info => info.id !== id));
            }
        } catch (error) {
            console.error('Failed to delete account info:', error);
        }
    };

    const handleEdit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editInfo) return;

        try {
            const response = await fetch(`/api/admin/account-info/${editInfo.id}`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${Cookies.get('auth-token')}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    title: editInfo.title,
                    message: editInfo.message,
                    priority: editInfo.priority
                })
            });

            if (response.ok) {
                setAccountInfos(prev => prev.map(info =>
                    info.id === editInfo.id ? editInfo : info
                ));
                setShowEditModal(false);
                setEditInfo(null);
            }
        } catch (error) {
            console.error('Failed to update account info:', error);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#111111] text-white flex items-center justify-center">
                Loading...
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#111111] text-white">
            <AdminSidebar />
            <div className="md:ml-64 p-6">
                <div className="max-w-6xl mx-auto">
                    <h1 className="text-2xl font-bold mb-8">Account Information Management</h1>

                    {/* New Information Form */}
                    <div className="mb-12 bg-[#1A1A1A] p-6 rounded-lg">
                        <h2 className="text-xl font-semibold mb-6">Send New Information</h2>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">
                                    Select User
                                </label>
                                <Select
                                    options={users.map(user => ({
                                        value: user,
                                        label: `${user.username} (${user.email})`
                                    }))}
                                    onChange={(option) => setSelectedUser(option?.value || null)}
                                    className="text-black"
                                    value={selectedUser ? {
                                        value: selectedUser,
                                        label: `${selectedUser.username} (${selectedUser.email})`
                                    } : null}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">
                                    Priority
                                </label>
                                <select
                                    value={formData.priority}
                                    onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value }))}
                                    className="w-full bg-[#1A1A1A] border border-gray-800 rounded-lg px-4 py-2 text-white"
                                    required
                                >
                                    <option value="normal">Normal</option>
                                    <option value="urgent">Urgent</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">
                                    Title
                                </label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                                    className="w-full bg-[#1A1A1A] border border-gray-800 rounded-lg px-4 py-2"
                                    required
                                />
                            </div>

                            <div>
                                <div className="flex justify-between items-center mb-2">
                                    <label className="text-sm font-medium text-gray-400">
                                        Message
                                    </label>
                                    <span className="text-sm text-gray-400">
                                        {wordCount}/50 words
                                    </span>
                                </div>
                                <textarea
                                    value={formData.message}
                                    onChange={handleMessageChange}
                                    className="w-full bg-[#1A1A1A] border border-gray-800 rounded-lg px-4 py-2 h-32"
                                    required
                                />
                            </div>

                            <div className="flex justify-end">
                                <button
                                    type="submit"
                                    disabled={sending || !selectedUser}
                                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                                >
                                    {sending ? 'Sending...' : 'Send Information'}
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Account Info List */}
                    <div className="bg-[#1A1A1A] p-6 rounded-lg">
                        <h2 className="text-xl font-semibold mb-6">Account Information List</h2>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-gray-800">
                                        <th className="px-6 py-3 text-left">User</th>
                                        <th className="px-6 py-3 text-left">Title</th>
                                        <th className="px-6 py-3 text-left">Priority</th>
                                        <th className="px-6 py-3 text-left">Date</th>
                                        <th className="px-6 py-3 text-left">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {accountInfos.map(info => (
                                        <tr key={info.id} className="border-b border-gray-800">
                                            <td className="px-6 py-4">{info.username}</td>
                                            <td className="px-6 py-4">{info.title}</td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2 py-1 rounded text-sm ${info.priority === 'urgent'
                                                        ? 'bg-red-500/20 text-red-400'
                                                        : 'bg-blue-500/20 text-blue-400'
                                                    }`}>
                                                    {info.priority}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                {new Date(info.created_at).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex gap-3">
                                                    <button
                                                        onClick={() => {
                                                            setEditInfo(info);
                                                            setShowEditModal(true);
                                                        }}
                                                        className="text-blue-400 hover:text-blue-300"
                                                    >
                                                        <Pencil size={16} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(info.id)}
                                                        className="text-red-400 hover:text-red-300"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Edit Modal */}
                    {showEditModal && editInfo && (
                        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
                            <div className="bg-[#1A1A1A] p-6 rounded-lg w-full max-w-md">
                                <h3 className="text-lg font-semibold mb-4">Edit Account Information</h3>
                                <form onSubmit={handleEdit} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-400 mb-2">
                                            Title
                                        </label>
                                        <input
                                            type="text"
                                            value={editInfo.title}
                                            onChange={(e) => setEditInfo(prev => ({ ...prev!, title: e.target.value }))}
                                            className="w-full bg-[#2A2A2A] border border-gray-800 rounded-lg px-4 py-2"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-400 mb-2">
                                            Priority
                                        </label>
                                        <select
                                            value={editInfo.priority}
                                            onChange={(e) => setEditInfo(prev => ({ ...prev!, priority: e.target.value }))}
                                            className="w-full bg-[#2A2A2A] border border-gray-800 rounded-lg px-4 py-2"
                                            required
                                        >
                                            <option value="normal">Normal</option>
                                            <option value="urgent">Urgent</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-400 mb-2">
                                            Message
                                        </label>
                                        <textarea
                                            value={editInfo.message}
                                            onChange={(e) => setEditInfo(prev => ({ ...prev!, message: e.target.value }))}
                                            className="w-full bg-[#2A2A2A] border border-gray-800 rounded-lg px-4 py-2 h-32"
                                            required
                                        /></div>

                                    <div className="flex justify-end gap-3 mt-6">
                                        <button
                                            type="button"
                                            onClick={() => setShowEditModal(false)}
                                            className="px-4 py-2 text-gray-400 hover:text-white"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                        >
                                            Save Changes
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}