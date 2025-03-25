"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { useAuth } from "@/context/AuthContext"
import { Menu, X, ChevronDown } from "lucide-react"
import Logo from "./ui/Logo"

export function Header() {
  const { isAuthenticated, logout } = useAuth()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [currentLang, setCurrentLang] = useState("en")
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const marketItems = [
    { title: "Forex", href: "/markets/forex" },
    { title: "Stocks", href: "/markets/stocks" },
    { title: "Commodities", href: "/markets/commodities" },
    { title: "Cryptocurrencies", href: "/markets/crypto" },
    { title: "Indices", href: "/markets/indices" },
    { title: "ETFs", href: "/markets/etfs" },
    { title: "Bonds", href: "/markets/bonds" },
  ]

  const tradingItems = [
    { title: "Trading Conditions", href: "/trading/conditions" },
    { title: "Trading Platforms", href: "/trading/platforms" },
    { title: "Account Types", href: "/trading/accounts" },
    { title: "Safety of Funds", href: "/trading/safety" },
  ]

  const toggleDropdown = (menu: string) => {
    setActiveDropdown(activeDropdown === menu ? null : menu)
  }

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false)
      }

      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        !(event.target as Element).closest("[data-dropdown-toggle]")
      ) {
        setActiveDropdown(null)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Close menu when window is resized to desktop size
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMenuOpen(false)
      }
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  // Close mobile menu when a link is clicked
  const handleLinkClick = () => {
    setIsMenuOpen(false)
    setActiveDropdown(null)
  }

  return (
    <header className="bg-[#0D1117] border-b z-50 border-gray-800 sticky top-0">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link href="/" className="flex items-center">
            <Logo />
          </Link>

          <button
            className="md:hidden text-white"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          <div
            ref={menuRef}
            className={`${
              isMenuOpen ? "flex" : "hidden"
            } md:flex flex-col md:flex-row  fixed md:relative top-[69px] md:top-0 left-0 w-full md:w-auto bg-[#0D1117] md:bg-transparent z-50 border-t border-gray-800 md:border-0 h-[calc(100vh-69px)] md:h-auto overflow-y-auto md:overflow-visible`}
          >
            <div className="flex flex-col md:flex-row md:items-center md:space-x-6 p-4 md:p-0">
              <Link href="/" className="text-white hover:text-blue-400 py-2 md:py-0" onClick={handleLinkClick}>
                Home
              </Link>
              <Link href="/about" className="text-white hover:text-blue-400 py-2 md:py-0" onClick={handleLinkClick}>
                About Us
              </Link>

              {/* Markets Dropdown */}
              <div className="relative" ref={dropdownRef}>
                <button
                  data-dropdown-toggle="markets"
                  onClick={() => toggleDropdown("markets")}
                  className="text-white hover:text-blue-400 py-2 md:py-0 w-full text-left flex items-center justify-between md:inline-flex"
                  aria-expanded={activeDropdown === "markets"}
                >
                  Markets
                  <ChevronDown
                    className={`ml-1 w-4 h-4 transition-transform ${activeDropdown === "markets" ? "rotate-180" : ""}`}
                  />
                </button>
                <div
                  className={`${
                    activeDropdown === "markets" ? "block" : "hidden"
                  } md:absolute md:top-full left-0 mt-2 w-full md:w-48 bg-[#161b22] md:bg-[#0D1117] md:border md:border-gray-800 md:rounded-lg overflow-hidden`}
                >
                  {marketItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="block px-4 py-2 text-white hover:bg-gray-800"
                      onClick={handleLinkClick}
                    >
                      {item.title}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Trading Info Dropdown */}
              <div className="relative" ref={dropdownRef}>
                <button
                  data-dropdown-toggle="trading"
                  onClick={() => toggleDropdown("trading")}
                  className="text-white hover:text-blue-400 py-2 md:py-0 w-full text-left flex items-center justify-between md:inline-flex"
                  aria-expanded={activeDropdown === "trading"}
                >
                  Trading Info
                  <ChevronDown
                    className={`ml-1 w-4 h-4 transition-transform ${activeDropdown === "trading" ? "rotate-180" : ""}`}
                  />
                </button>
                <div
                  className={`${
                    activeDropdown === "trading" ? "block" : "hidden"
                  } md:absolute md:top-full left-0 mt-2 w-full md:w-48 bg-[#161b22] md:bg-[#0D1117] md:border md:border-gray-800 md:rounded-lg overflow-hidden`}
                >
                  {tradingItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="block px-4 py-2 text-white hover:bg-gray-800"
                      onClick={handleLinkClick}
                    >
                      {item.title}
                    </Link>
                  ))}
                </div>
              </div>

              <Link
                href="/support"
                className="text-white hover:text-blue-400 py-2 md:py-0"
                onClick={handleLinkClick}
              >
                Contact
              </Link>
            </div>

            <div className="flex flex-col md:flex-row md:items-center md:ml-auto p-4 md:pl-[2rem] md:p-0 space-y-4 md:space-y-0 md:space-x-4 border-t md:border-0 border-gray-800 mt-4 md:mt-0">
              <Link href="/login" className="text-blue-400 hover:text-blue-300 text-center" onClick={handleLinkClick}>
                Login
              </Link>
              <Link
                href="/register"
                className="bg-[#f7931a] text-white px-4 py-2 rounded hover:bg-[#f7931a]/90 transition-colors text-center"
                onClick={handleLinkClick}
              >
                Register Now
              </Link>
              <div className="flex items-center justify-center md:justify-start space-x-1">
                <div id="google_translate_element"></div>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </header>
  )
}

