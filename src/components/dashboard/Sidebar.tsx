'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Wallet,
  X,
  TrendingUp,
  Home,
  HistoryIcon,
  UserCircle,
  BanknoteIcon,
  Package2Icon,
  Users,
} from 'lucide-react';

import { useAuth } from '@/context/AuthContext';
import { useSidebar } from '@/context/SidebarContext';
import Logo from '../ui/Logo';

export function Sidebar() {
  const { isOpen, toggle } = useSidebar();
  const pathname = usePathname();
  const { logout } = useAuth();

  const menuItems = [
    { icon: Home, label: 'Home', href: '/dashboard', color: '#3B82F6' },        // Blue
    { icon: Package2Icon, label: 'Packages', href: '/dashboard/invest', color: '#A855F7' }, // Purple
    { icon: BanknoteIcon, label: 'Deposit', href: '/dashboard/transactions/deposit', color: '#10B981' }, // Emerald
    { icon: Wallet, label: 'Withdraw', href: '/dashboard/transactions/send', color: '#F59E0B' }, // Amber
    { icon: TrendingUp, label: 'My Investments', href: '/dashboard/investments', color: '#EF4444' }, // Red
    { icon: HistoryIcon, label: 'Transactions', href: '/dashboard/transactions', color: '#6366F1' }, // Indigo
    { icon: Users, label: 'KYC', href: '/dashboard/kyc', color: '#14B8A6' }, // Teal
    { icon: UserCircle, label: 'Profile', href: '/dashboard/profile', color: '#8B5CF6' }, // Violet
  ];

  return (
    <aside
      className={`
        fixed md:relative top-0 left-0 h-screen w-[20rem] z-50
        transform transition-transform duration-300 ease-in-out
        border-r border-[#d0e1f5]
        bg-white
        shadow-xl backdrop-blur-lg
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0
      `}
    >
      {/* Logo */}
      <div className="flex items-center justify-between px-6 py-5 md:justify-start md:pl-6 md:pt-6">
        <Logo />
        <button
          onClick={toggle}
          className="text-gray-600 md:hidden"
          aria-label="Close Sidebar"
        >
          <X size={24} />
        </button>
      </div>

      {/* Navigation */}
      <div className="grid grid-cols-2 gap-4 px-6 py-8">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;

          const styles = isActive
            ? {
                borderColor: item.color,
                backgroundColor: `${item.color}1A`, // 10% opacity
                color: item.color,
              }
            : {};

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => {
                if (window.innerWidth < 768) toggle();
              }}
              style={styles}
              className={`
                aspect-square flex flex-col items-center justify-center
                rounded-2xl text-center border-2 shadow-sm
                transition-all duration-300
                ${
                  isActive
                    ? ''
                    : 'border-gray-200 text-gray-700 hover:shadow-md'
                }
              `}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.borderColor = item.color;
                  e.currentTarget.style.color = item.color;
                  e.currentTarget.style.backgroundColor = `${item.color}0D`; // ~5% on hover
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.borderColor = 'rgb(229 231 235)'; // border-gray-200
                  e.currentTarget.style.color = '#374151'; // text-gray-700
                  e.currentTarget.style.backgroundColor = 'transparent';
                }
              }}
            >
              <item.icon size={28} className="mb-2" />
              <span className="text-sm font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </aside>
  );
}
