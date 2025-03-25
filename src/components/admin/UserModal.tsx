import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import Cookies from 'js-cookie';

interface User {
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


interface Transaction {
    id: number;
    type: string;
    amount: number;
    status: string;
    currency: string;
    created_at: string;

}

interface Investment {
    id: number;
    package_name: string;
    amount_usd: number;
    status: string;
    start_date: string;
    end_date: string;
    created_at: string;
    plan_name: string;
}

interface Bot {
    id: number;
    name: string;
    status: string;
    created_at: string;
    bot_name: string;
    initial_amount: number;
}

interface UserModalProps {
    user: User;
    onClose: () => void;
    onUpdate: () => void;
}

export function UserModal({ user, onClose, onUpdate }: UserModalProps) {
    const [activeTab, setActiveTab] = useState('profile');
    const [status, setStatus] = useState(user.status);
    const [kycStatus, setKycStatus] = useState(user.kyc_status);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [investments, setInvestments] = useState<Investment[]>([]);
    const [showNotification, setShowNotification] = useState(false);
    const [bots, setBots] = useState<Bot[]>([]);
    const [balances, setBalances] = useState({
        btc: user.btc_balance || "0",
        eth: user.eth_balance || "0",
        usdt: user.usdt_balance || "0",
        bnb: user.bnb_balance || "0",
        xrp: user.xrp_balance || "0",
        ada: user.ada_balance || "0",
        doge: user.doge_balance || "0",
        sol: user.sol_balance || "0",
        dot: user.dot_balance || "0",
        matic: user.matic_balance || "0",
        link: user.link_balance || "0",
        uni: user.uni_balance || "0",
        avax: user.avax_balance || "0",
        ltc: user.ltc_balance || "0",
        shib: user.shib_balance || "0",
    });

    console.log(bots)

    useEffect(() => {
        if (activeTab === 'transactions') {
            fetchTransactions();
        } else if (activeTab === 'investments') {
            fetchInvestments();
        } else if (activeTab === 'bots') {
            fetchBots();
        }
    }, [activeTab, user.id]);

    const fetchTransactions = async () => {
        try {
            const res = await fetch(`/api/admin/users/${user.id}/transactions`, {
                headers: {
                    'Authorization': `Bearer ${Cookies.get('auth-token')}`
                }
            });
            const data = await res.json();
            if (data.success) {
                setTransactions(data.transactions);
            }
        } catch (error) {
            console.error('Failed to fetch transactions:', error);
        }
    };

    const fetchInvestments = async () => {
        try {
            const res = await fetch(`/api/admin/users/${user.id}/investments`, {
                headers: {
                    'Authorization': `Bearer ${Cookies.get('auth-token')}`
                }
            });
            const data = await res.json();
            if (data.success) {
                setInvestments(data.investments);
            }
        } catch (error) {
            console.error('Failed to fetch investments:', error);
        }
    };

    const fetchBots = async () => {
        try {
            const res = await fetch(`/api/admin/users/${user.id}/bots`, {
                headers: {
                    'Authorization': `Bearer ${Cookies.get('auth-token')}`
                }
            });
            const data = await res.json();
            if (data.success) {
                setBots(data.sessions);
            }
        } catch (error) {
            console.error('Failed to fetch bots:', error);
        }
    };

    const updateUserStatus = async () => {
        try {
            const res = await fetch(`/api/admin/users/${user.id}/status`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${Cookies.get('auth-token')}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ status }),
            });

            if (res.ok) {
                onUpdate();
            }
        } catch (error) {
            console.error('Failed to update user status:', error);
        }
    };

    const updateBalance = async (currency: string, amount: number) => {
        try {
            const res = await fetch(`/api/admin/users/${user.id}/balance`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${Cookies.get('auth-token')}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ currency, amount }),
            });

            if (res.ok) {
                onUpdate();
            }
        } catch (error) {
            console.error('Failed to update balance:', error);
        }
    };

    const handleDeleteUser = async () => {
        if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
            try {
                const res = await fetch(`/api/admin/users/${user.id}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${Cookies.get('auth-token')}`,
                    },
                });

                if (res.ok) {
                    onClose();
                    onUpdate();
                } else {
                    throw new Error('Failed to delete user');
                }
            } catch (error) {
                console.error('Failed to delete user:', error);
            }
        }
    };

    const updateKycStatus = async () => {
        try {
            const res = await fetch(`/api/admin/users/${user.id}/kyc`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${Cookies.get('auth-token')}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ kyc_status: kycStatus }),
            });

            if (res.ok) {
                onUpdate();
                setShowNotification(true);
                setTimeout(() => setShowNotification(false), 3000); // Hide after 3 seconds
            }
        } catch (error) {
            console.error('Failed to update KYC status:', error);
        }
    };
    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            {showNotification && (
                <div className="fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50">
                    KYC Status updated successfully
                </div>
            )}
            <div className="bg-[#121212] rounded-lg w-full max-w-3xl max-h-[90vh] overflow-hidden">
                <div className="flex items-center justify-between p-6 border-b border-gray-800">
                    <h2 className="text-xl font-semibold">User Details</h2>
                    <div className="flex items-center gap-4">
                        <button
                            onClick={handleDeleteUser}
                            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm"
                        >
                            Delete User
                        </button>
                        <button onClick={onClose} className="text-gray-400 hover:text-white">
                            <X className="h-6 w-6" />
                        </button>
                    </div>
                </div>

                <div className="border-b border-gray-800">
                    <div className="flex">
                        {['Profile', 'Balances', 'Transactions', 'Investments', 'Bots'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab.toLowerCase())}
                                className={`px-6 py-3 text-sm font-medium ${activeTab === tab.toLowerCase()
                                    ? 'border-b-2 border-orange-500 text-white'
                                    : 'text-gray-400 hover:text-white'
                                    }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="p-6 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 180px)' }}>
                    {activeTab === 'profile' && (
                        <div className="space-y-8">
                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">ID</label>
                                    <div className="bg-[#1A1A1A] text-white rounded-lg px-4 py-2">{user.id}</div>
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">Email</label>
                                    <div className="bg-[#1A1A1A] text-white rounded-lg px-4 py-2">{user.email}</div>
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">Username</label>
                                    <div className="bg-[#1A1A1A] text-white rounded-lg px-4 py-2">{user.username || 'N/A'}</div>
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">Full Name</label>
                                    <div className="bg-[#1A1A1A] text-white rounded-lg px-4 py-2">
                                        {user.first_name} {user.last_name}
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">Phone Number</label>
                                    <div className="bg-[#1A1A1A] text-white rounded-lg px-4 py-2">{user.phone_number}</div>
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">Country</label>
                                    <div className="bg-[#1A1A1A] text-white rounded-lg px-4 py-2">{user.country}</div>
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">KYC Status</label>
                                    <div className="flex items-center gap-2">
                                        <select
                                            value={kycStatus}
                                            onChange={(e) => setKycStatus(e.target.value)}
                                            className="bg-[#1A1A1A] text-white rounded-lg px-4 py-2 flex-1"
                                        >
                                            {['none', 'pending', 'verified', 'rejected'].map((s) => (
                                                <option key={s} value={s}>
                                                    {s.charAt(0).toUpperCase() + s.slice(1)}
                                                </option>
                                            ))}
                                        </select>
                                        <button
                                            onClick={updateKycStatus}
                                            className="bg-orange-500 text-white px-4 py-2 rounded-lg"
                                        >
                                            Update
                                        </button>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">2FA Status</label>
                                    <div className="bg-[#1A1A1A] text-white rounded-lg px-4 py-2">
                                        {user.two_factor_enabled ? 'Enabled' : 'Disabled'}
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">Last Login</label>
                                    <div className="bg-[#1A1A1A] text-white rounded-lg px-4 py-2">
                                        {new Date(user.last_login).toLocaleString()}
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">Login IP</label>
                                    <div className="bg-[#1A1A1A] text-white rounded-lg px-4 py-2">{user.login_ip}</div>
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">Created At</label>
                                    <div className="bg-[#1A1A1A] text-white rounded-lg px-4 py-2">
                                        {new Date(user.created_at).toLocaleString()}
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">Updated At</label>
                                    <div className="bg-[#1A1A1A] text-white rounded-lg px-4 py-2">
                                        {new Date(user.updated_at).toLocaleString()}
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">Admin Status</label>
                                    <div className="bg-[#1A1A1A] text-white rounded-lg px4 py-2">
                                        {user.is_admin ? 'Admin' : 'User'}
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-lg font-medium mb-4">Account Status</h3>
                                <select
                                    value={status}
                                    onChange={(e) => setStatus(e.target.value)}
                                    className="bg-[#1A1A1A] text-white rounded-lg px-4 py-2 w-full"
                                >
                                    {['active', 'suspended', 'pending', 'blocked'].map((s) => (
                                        <option key={s} value={s}>
                                            {s.charAt(0).toUpperCase() + s.slice(1)}
                                        </option>
                                    ))}
                                </select>
                                <button
                                    onClick={updateUserStatus}
                                    className="mt-2 bg-orange-500 text-white px-4 py-2 rounded-lg"
                                >
                                    Update Status
                                </button>
                            </div>
                        </div>
                    )}

                    {activeTab === 'balances' && (
                        <div className="space-y-6">
                            {Object.entries(balances).map(([currency, amount]) => (
                                <div key={currency} className="flex items-center gap-4">
                                    <span className="uppercase w-20">{currency}</span>
                                    <input
                                        type="number"
                                        value={amount}
                                        onChange={(e) => setBalances(prev => ({
                                            ...prev,
                                            [currency]: e.target.value
                                        }))}
                                        className="bg-[#1A1A1A] text-white rounded-lg px-4 py-2"
                                    />
                                    <button
                                        onClick={() => updateBalance(currency, Number(amount))}
                                        className="bg-orange-500 text-white px-4 py-2 rounded-lg"
                                    >
                                        Update
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}

                    {activeTab === 'transactions' && (
                        <div className="space-y-4">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-gray-800">
                                        <th className="text-left p-4 text-sm font-medium text-gray-400">Date</th>
                                        <th className="text-left p-4 text-sm font-medium text-gray-400">Type</th>
                                        <th className="text-left p-4 text-sm font-medium text-gray-400">Amount</th>
                                        <th className="text-left p-4 text-sm font-medium text-gray-400">Currency</th>
                                        <th className="text-left p-4 text-sm font-medium text-gray-400">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {transactions.map((tx) => (
                                        <tr key={tx.id} className="border-b border-gray-800/50">
                                            <td className="p-4">{new Date(tx.created_at).toLocaleString()}</td>
                                            <td className="p-4">{tx.type}</td>
                                            <td className="p-4">{tx.amount}</td>
                                            <td className="p-4">{tx.currency}</td>
                                            <td className="p-4">
                                                <span className={`px-2 py-1 rounded-full text-xs ${tx.status === 'completed' ? 'bg-green-500/20 text-green-500' :
                                                    tx.status === 'pending' ? 'bg-yellow-500/20 text-yellow-500' :
                                                        'bg-red-500/20 text-red-500'
                                                    }`}>
                                                    {tx.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {activeTab === 'investments' && (
                        <div className="space-y-4">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-gray-800">
                                        <th className="text-left p-4 text-sm font-medium text-gray-400">Date</th>
                                        <th className="text-left p-4 text-sm font-medium text-gray-400">Plan</th>
                                        <th className="text-left p-4 text-sm font-medium text-gray-400">Amount</th>
                                        <th className="text-left p-4 text-sm font-medium text-gray-400">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {investments.map((inv) => (
                                        <tr key={inv.id} className="border-b border-gray-800/50">
                                            <td className="p-4">{new Date(inv.created_at).toLocaleString()}</td>
                                            <td className="p-4">{inv.plan_name}</td>
                                            <td className="p-4">${inv.amount_usd}</td>
                                            <td className="p-4">
                                                <span className={`px-2 py-1 rounded-full text-xs ${inv.status === 'active' ? 'bg-green-500/20 text-green-500' :
                                                    inv.status === 'completed' ? 'bg-green-500/20 text-green-500' :
                                                        'bg-red-500/20 text-red-500'
                                                    }`}>
                                                    {inv.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {activeTab === 'bots' && (
                        <div className="space-y-4">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-gray-800">
                                        <th className="text-left p-4 text-sm font-medium text-gray-400">Name</th>
                                        <th className="text-left p-4 text-sm font-medium text-gray-400">Amount</th>
                                        <th className="text-left p-4 text-sm font-medium text-gray-400">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {bots && bots.map((bot) => (
                                        <tr key={bot.id} className="border-b border-gray-800/50">
                                            <td className="p-4">{bot.bot_name}</td>
                                            <td className="p-4">${bot.initial_amount}</td>
                                            <td className="p-4">
                                                <span className={`px-2 py-1 rounded-full text-xs ${bot.status === 'active' ? 'bg-green-500/20 text-green-500' :
                                                    bot.status === 'completed' ? 'bg-yellow-500/20 text-yellow-500' :
                                                        'bg-red-500/20 text-red-500'
                                                    }`}>
                                                    {bot.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}