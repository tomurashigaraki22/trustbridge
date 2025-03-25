'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    BarChart2,
    Eye,
    UserCircle,
    Wallet,
    LogOut,
    X,
    ChartCandlestickIcon,
    Coins,
    Home,
    HistoryIcon,
    Headphones,
    LockKeyholeIcon,
    TrendingUp,
    BanknoteIcon
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useSidebar } from '@/context/SidebarContext';
import Logo from '../ui/Logo';
import { Menu } from 'lucide-react';
import { Package2Icon, Users } from 'lucide-react';

export function Sidebar() {
    const { isOpen, toggle } = useSidebar();
    const pathname = usePathname();
    const { logout } = useAuth();

    const menuItems = [
        { icon: Home, label: 'Home', href: '/dashboard' },
        { icon: Package2Icon, label: 'Packages', href: '/dashboard/invest' },
        { icon: BanknoteIcon, label: 'Deposit', href: '/dashboard/transactions/deposit' },
        { icon: Wallet, label: 'Withdraw', href: '/dashboard/transactions/send' },
        { icon: TrendingUp, label: 'My Investments', href: '/dashboard/transactions/investments' },
        { icon: HistoryIcon, label: 'Transactions', href: '/dashboard/transactions' },
        { icon: Users, label: 'KYC', href: '/dashboard/kyc' },
        { icon: UserCircle, label: 'Profile', href: '/dashboard/profile' },
    ];

    return (
        <>


            {/* Sidebar */}
            <div className={`
                fixed   md:relative md:pt-[10rem] inset-y-0 left-0 w-[20rem]  border-r border-[#444]  bg-[#111111] z-50
                transform transition-transform duration-300 ease-in-out
                ${isOpen ? 'translate-x-0' : '-translate-x-full'}
                md:translate-x-0
            `}>
                <div className="flex justify-between items-center p-4 md:hidden">
                    <Logo />
                    <button onClick={toggle} className="text-gray-400 hover:text-white">
                        <X size={24} />
                    </button>
                </div>

                <div className="grid grid-cols-2 w-full p-4 gap-4">
                    {menuItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => {
                                if (window.innerWidth < 768) toggle();
                            }}
                            className={`aspect-square flex flex-col items-center justify-center rounded-2xl transition-all
                                ${pathname === item.href
                                    ? 'bg-black text-white'
                                    : 'text-gray-400 hover:text-white hover:bg-black/30'
                                }`}
                        >
                            <item.icon size={32} className="mb-2" />
                            <span className="text-sm font-medium">{item.label}</span>
                        </Link>
                    ))}
                </div>
            </div>


        </>
    );
}