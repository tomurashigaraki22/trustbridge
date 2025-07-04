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
        { icon: TrendingUp, label: 'My Investments', href: '/dashboard/investments' },
        { icon: HistoryIcon, label: 'Transactions', href: '/dashboard/transactions' },
        { icon: Users, label: 'KYC', href: '/dashboard/kyc' },
        { icon: UserCircle, label: 'Profile', href: '/dashboard/profile' },
    ];

    return (
        <>


            {/* Sidebar */}
            <div className={`
                fixed   md:relative md:pt-[10rem] inset-y-0 left-0 w-[20rem]  border-r border-[#444]  bg-[#0A0E1C] z-50
                transform transition-transform duration-300 ease-in-out
                ${isOpen ? 'translate-x-0' : '-translate-x-full'}
                md:translate-x-0
            `}>
                <div className="p-4 hidden md:flex fixed top-5 left-1">
                    <Logo />
                </div>
                <div className="flex justify-between items-center p-4 md:hidden">
                    <Logo />
                    <button onClick={toggle} className="text-gray-400 hover:text-white">
                        <X size={24} />
                    </button>
                </div>


                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 px-4 py-6">
  {menuItems.map((item) => {
    const isActive = pathname === item.href;

    return (
      <Link
        key={item.href}
        href={item.href}
        onClick={() => {
          if (window.innerWidth < 768) toggle();
        }}
        className={`
          aspect-square flex flex-col items-center justify-center rounded-2xl border-2 transition-all duration-300
          ${isActive
            ? 'bg-[#113D2F] border-[#22C55E] text-[#22C55E]'
            : 'bg-[#0D2D23] border-[#1f402f] text-gray-300 hover:border-[#22C55E] hover:text-white hover:bg-[#154734]'
          }
        `}
      >
        <item.icon size={28} className="mb-2" />
        <span className="text-sm font-medium text-center">{item.label}</span>
      </Link>
    );
  })}
</div>


            </div>


        </>
    );
}