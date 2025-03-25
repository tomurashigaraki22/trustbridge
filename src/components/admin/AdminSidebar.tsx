import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Users, BarChart3, RefreshCcw, Send, Bot, Settings, LogOut, Mail, Info, Lock, HomeIcon } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';

export function AdminSidebar() {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();
    const { logout } = useAuth();

    const links = [
        { href: '/admin', label: 'Dashboard', icon: BarChart3 },
        { href: '/dashboard', label: 'Client Dashboard', icon: HomeIcon },
        { href: '/admin/users', label: 'Users', icon: Users },
        { href: '/admin/transactions', label: 'Transactions', icon: RefreshCcw },
        { href: '/admin/transactions/deposit', label: 'Deposits', icon: RefreshCcw },
        { href: '/admin/kyc', label: 'KYC', icon: Lock },
        { href: '/admin/transactions/withdrawals', label: 'Withdrawals', icon: RefreshCcw },
        { href: '/admin/investments/', label: 'Investment Plans', icon: Send },
        { href: '/admin/investments/recent', label: 'Recent Investments', icon: Send },
        { href: '/admin/bots', label: 'Bots', icon: Bot },
        { href: '/admin/bots/sessions', label: 'Recent Bots', icon: Bot },
        { href: '/admin/wallets', label: 'Wallet Address', icon: Settings },
        { href: '/admin/mail', label: 'Send Mail', icon: Mail },
        { href: '/admin/account-info', label: 'Send Account Memo', icon: Info },
    ];

    return (
        <>
            {/* Mobile Menu Button */}
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-[#121212] text-white"
            >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Sidebar */}
            <div className={`fixed inset-y-0 left-0 transform ${
                isOpen ? 'translate-x-0' : '-translate-x-full'
            } lg:translate-x-0 w-64 bg-[#121212] border-r border-gray-800 transition-transform duration-200 ease-in-out z-40`}>
                <div className="flex flex-col h-full">
                    <div className="p-6">
                        <h1 className="text-xl font-bold text-white">Admin Panel</h1>
                    </div>
                    <nav className="flex-1 p-4 overflow-y-auto">
                        {links.map((link) => {
                            const Icon = link.icon;
                            return (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    onClick={() => setIsOpen(false)}
                                    className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-colors mb-1 ${
                                        pathname === link.href 
                                        ? 'bg-orange-500 text-white' 
                                        : 'text-gray-400 hover:text-gray-100 hover:bg-gray-800'
                                    }`}
                                >
                                    <Icon className="h-5 w-5" />
                                    {link.label}
                                </Link>
                            );
                        })}
                    </nav>

                    <div className="flex-none p-4 mt-auto">
                        <button
                            onClick={logout}
                            className="flex items-center space-x-3 px-4 py-3 text-gray-400 hover:bg-white/5 rounded-lg w-full"
                        >
                            <LogOut size={20} />
                            <span>Logout</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Overlay */}
            {isOpen && (
                <div 
                    className="fixed inset-0 bg-black/50 lg:hidden z-30"
                    onClick={() => setIsOpen(false)}
                />
            )}
        </>
    );
}