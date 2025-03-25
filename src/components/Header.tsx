"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useAuth } from "@/context/AuthContext"
import { Menu, X, ChevronDown } from "lucide-react"
import Logo from "./ui/Logo"
import Image from "next/image"

export function Header() {
  const { isAuthenticated, logout } = useAuth()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [currentLang, setCurrentLang] = useState('en')
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)

  const marketItems = [
    { title: 'Forex', href: '/markets/forex' },
    { title: 'Stocks', href: '/markets/stocks' },
    { title: 'Commodities', href: '/markets/commodities' },
    { title: 'Cryptocurrencies', href: '/markets/crypto' },
    { title: 'Indices', href: '/markets/indices' },
    { title: 'ETFs', href: '/markets/etfs' },
    { title: 'Bonds', href: '/markets/bonds' },
  ]

  const tradingItems = [
    { title: 'Trading Conditions', href: '/trading/conditions' },
    { title: 'Trading Platforms', href: '/trading/platforms' },
    { title: 'Account Types', href: '/trading/accounts' },
    { title: 'Safety of Funds', href: '/trading/safety' },
  ]

  const toggleDropdown = (menu: string) => {
    setActiveDropdown(activeDropdown === menu ? null : menu)
  }

  return (
    <header className="bg-[#0D1117] border-b z-50 border-gray-800">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link href="/" className="flex items-center">
            <Logo />
          </Link>

          <button
            className="md:hidden text-white"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          <div className={`${isMenuOpen ? 'block' : 'hidden'} md:flex flex-col md:flex-row absolute md:relative top-full left-0 w-full md:w-auto bg-[#0D1117] md:bg-transparent z-50`}>
            <div className="flex flex-col md:flex-row md:items-center md:space-x-6 p-4 md:p-0">
              <Link href="/" className="text-white hover:text-blue-400 py-2 md:py-0">
                Home
              </Link>
              <Link href="/about" className="text-white hover:text-blue-400 py-2 md:py-0">
                About Us
              </Link>

              {/* Markets Dropdown */}
              <div className="relative">
                <button
                  onClick={() => toggleDropdown('markets')}
                  className="text-white hover:text-blue-400 py-2 md:py-0 w-full text-left flex items-center justify-between md:inline-flex"
                >
                  Markets
                  <ChevronDown className={`ml-1 w-4 h-4 transition-transform ${activeDropdown === 'markets' ? 'rotate-180' : ''}`} />
                </button>
                <div className={`${activeDropdown === 'markets' ? 'block' : 'hidden'} md:absolute md:top-full left-0 mt-2 w-48 bg-[#0D1117] border border-gray-800 rounded-lg overflow-hidden`}>
                  {marketItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="block px-4 py-2 text-white hover:bg-gray-800"
                    >
                      {item.title}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Trading Info Dropdown */}
              <div className="relative">
                <button
                  onClick={() => toggleDropdown('trading')}
                  className="text-white hover:text-blue-400 py-2 md:py-0 w-full text-left flex items-center justify-between md:inline-flex"
                >
                  Trading Info
                  <ChevronDown className={`ml-1 w-4 h-4 transition-transform ${activeDropdown === 'trading' ? 'rotate-180' : ''}`} />
                </button>
                <div className={`${activeDropdown === 'trading' ? 'block' : 'hidden'} md:absolute md:top-full left-0 mt-2 w-48 bg-[#0D1117] border border-gray-800 rounded-lg overflow-hidden`}>
                  {tradingItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="block px-4 py-2 text-white hover:bg-gray-800"
                    >
                      {item.title}
                    </Link>
                  ))}
                </div>
              </div>

              <Link href="/dashboard/support" className="text-white hover:text-blue-400 py-2 md:py-0">
                Contact
              </Link>
            </div>

            <div className="flex flex-col md:flex-row md:items-center md:ml-6 p-4 md:p-0 space-y-4 md:space-y-0 md:space-x-4 border-t md:border-0 border-gray-800">
              <Link href="/login" className="text-blue-400 hover:text-blue-300 text-center">
                Login
              </Link>
              <Link href="/register" className="bg-[#f7931a] text-white px-4 py-2 rounded hover:bg-[#f7931a]/90 transition-colors text-center">
                Register Now
              </Link>
              <div className="flex items-center space-x-1">
                <div id="google_translate_element"></div>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </header>
  )
}

