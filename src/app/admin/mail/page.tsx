'use client';

import React, { useEffect, useState } from 'react';
import { useUserData } from "@/hooks/useUserData";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import Select from 'react-select';

interface User {
    id: number;
    email: string;
    username: string;
    first_name: string;
    last_name: string;
}

export default function MailPage() {
    const router = useRouter();
    const { userData, isLoading: userDataLoading } = useUserData();
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
    const [manualEmails, setManualEmails] = useState('');
    const [subject, setSubject] = useState('');
    const [body, setBody] = useState('');
    const [showTemplateHelp, setShowTemplateHelp] = useState(false);

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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSending(true);

        const recipients = [
            ...selectedUsers.map(user => user.email),
            ...manualEmails.split(',').map(email => email.trim()).filter(email => email)
        ];

        try {
            const response = await fetch('/api/admin/mail/send', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${Cookies.get('auth-token')}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    recipients,
                    selectedUserIds: selectedUsers.map(user => user.id),
                    subject,
                    body
                })
            });

            if (response.ok) {
                setSelectedUsers([]);
                setManualEmails('');
                setSubject('');
                setBody('');
                alert('Emails sent successfully!');
            }
        } catch (error) {
            console.error('Failed to send emails:', error);
            alert('Failed to send emails');
        } finally {
            setSending(false);
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
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-2xl font-bold mb-8">Send Mail</h1>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">
                                Select Users
                            </label>
                            <Select
                                isMulti
                                options={users.map(user => ({
                                    value: user,
                                    label: `${user.username} (${user.email})`
                                }))}
                                onChange={(selected) => setSelectedUsers(selected.map(option => option.value))}
                                className="text-black"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">
                                Additional Emails (comma-separated)
                            </label>
                            <input
                                type="text"
                                value={manualEmails}
                                onChange={(e) => setManualEmails(e.target.value)}
                                placeholder="email1@example.com, email2@example.com"
                                className="w-full bg-[#1A1A1A] border border-gray-800 rounded-lg px-4 py-2"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">
                                Subject
                            </label>
                            <input
                                type="text"
                                value={subject}
                                onChange={(e) => setSubject(e.target.value)}
                                className="w-full bg-[#1A1A1A] border border-gray-800 rounded-lg px-4 py-2"
                                required
                            />
                        </div>

                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <label className="text-sm font-medium text-gray-400">
                                    Email Body
                                </label>
                                <button
                                    type="button"
                                    onClick={() => setShowTemplateHelp(!showTemplateHelp)}
                                    className="text-sm text-blue-500 hover:text-blue-400"
                                >
                                    Show Template Variables
                                </button>
                            </div>
                            {showTemplateHelp && (
                                <div className="mb-2 p-3 bg-gray-800 rounded-lg text-sm">
                                    Available variables:
                                    <ul className="list-disc list-inside mt-1">
                                        <li>{`{username} - User's username`}</li>
                                        <li>{`{first_name} - User's first name`}</li>
                                        <li>{`{last_name} - User's last name`}</li>
                                    </ul>
                                </div>
                            )}
                            <textarea
                                value={body}
                                onChange={(e) => setBody(e.target.value)}
                                className="w-full bg-[#1A1A1A] border border-gray-800 rounded-lg px-4 py-2 h-48"
                                required
                            />
                        </div>

                        <div className="flex justify-end">
                            <button
                                type="submit"
                                disabled={sending}
                                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                            >
                                {sending ? 'Sending...' : 'Send Email'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}