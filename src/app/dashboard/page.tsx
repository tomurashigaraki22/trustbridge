"use client"

import { useState, useEffect, useCallback } from "react"
import { Eye, EyeOff, HistoryIcon, RefreshCw, Users, Gift, Sprout, CircleDollarSign } from "lucide-react"
import { Sidebar } from "@/components/dashboard/Sidebar"
import { TopBar } from "@/components/dashboard/TopBar"
import { useUserData } from "@/hooks/useUserData"
import { useCryptoData } from "@/hooks/useCryptoData"
import Link from "next/link"
import { Coins, Wallet } from 'lucide-react';
import { TransactionList } from "@/components/dashboard/TransactionList"
import { useRouter } from "next/navigation"
import Cookies from "js-cookie"
import { InvestmentList } from "@/components/dashboard/InvestmentList"
import { TradingChart } from "@/components/trading/TradingChart"
import { AccountInfo } from "@/components/dashboard/AccountInfo";



export default function DashboardPage() {
  const [showBalance, setShowBalance] = useState(true)
  const toggleBalance = () => setShowBalance(!showBalance)
  const { userData, refetch, isLoading, totalBalance } = useUserData()
  const { calculateUserAssetValue } = useCryptoData()
  const [btcValue, setBtcValue] = useState(0)
  const [isRefetching, setIsRefetching] = useState(false)
  const [investments, setInvestments] = useState([]);

  const router = useRouter();

  useEffect(
    () => {
      if (userData?.user) {
        if (userData?.user?.otp_status == 'pending') {
          router.push("/dashboard/otp")
        }

      }
    }, [userData?.user]
  )
  const balances = [
    { name: "BTC", balance: Number(userData?.user.btc_balance || "0") },
    { name: "ETH", balance: Number(userData?.user.eth_balance || "0") },
    { name: "USDT", balance: Number(userData?.user.usdt_balance || "0") },
    { name: "BNB", balance: Number(userData?.user.bnb_balance || "0") },
    { name: "XRP", balance: Number(userData?.user.xrp_balance || "0") },
    { name: "ADA", balance: Number(userData?.user.ada_balance || "0") },
    { name: "DOGE", balance: Number(userData?.user.doge_balance || "0") },
    { name: "SOL", balance: Number(userData?.user.sol_balance || "0") },
    { name: "DOT", balance: Number(userData?.user.dot_balance || "0") },
    { name: "MATIC", balance: Number(userData?.user.matic_balance || "0") },
    { name: "LINK", balance: Number(userData?.user.link_balance || "0") },
    { name: "UNI", balance: Number(userData?.user.uni_balance || "0") },
    { name: "AVAX", balance: Number(userData?.user.avax_balance || "0") },
    { name: "LTC", balance: Number(userData?.user.ltc_balance || "0") },
    { name: "SHIB", balance: Number(userData?.user.shib_balance || "0") },
  ]

  const topAssets = balances
    .sort((a, b) => b.balance - a.balance)
    .slice(0, 6)
    .map((asset) => ({
      name: asset.name,
      value: asset.balance,
      icon: asset.name.charAt(0),
      iconBg: "bg-purple-500/20",
      iconColor: "text-purple-500",
    }))

  useEffect(() => {
    const fetchInvestments = async () => {
      try {
        const token = Cookies.get("auth-token");
        const response = await fetch("/api/investments/user", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) throw new Error("Failed to fetch investments");

        const data = await response.json();
        if (data.success) {
          setInvestments(data.investments);
        } else {
          throw new Error(data.error || "Failed to fetch investments");
        }
      } catch (err) {
        console.error(err instanceof Error ? err.message : "Failed to load investments");
      }
    };

    fetchInvestments();
  }, []);

  const fetchBtcBalance = () => {
    const btcValue = calculateUserAssetValue(totalBalance, "bitcoin")

    setBtcValue(btcValue && Number((totalBalance / btcValue).toFixed(6)))

  }

  const handleRefetch = useCallback(async () => {
    setIsRefetching(true)
    await refetch()
    fetchBtcBalance()
    setIsRefetching(false)
  }, [refetch])


  useEffect(() => {
    fetchBtcBalance()
  }, [totalBalance, calculateUserAssetValue])


  useEffect(() => {
    const interval = setInterval(() => {
      handleRefetch();
    }, 5000)

    return () => clearInterval(interval)
  }, [])



  const [activeSession, setActiveSession] = useState<number | null>(null);

  const fetchActiveSession = async () => {
    try {
      const response = await fetch("/api/trading/sessions?status=active", {
        headers: {
          Authorization: `Bearer ${Cookies.get("auth-token")}`,
        },
      });
      const data = await response.json();
      if (data.sessions && data.sessions.length > 0) {
        setActiveSession(data.sessions[0].id);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchActiveSession();
  }, []);




  return (
    <div className="min-h-screen bg-[#0A0E1C] text-white">
      <div className="flex flex-col lg:flex-row">
        <Sidebar />
        <div className="flex-1">
          <TopBar title="Dashboard" notices={userData?.notices} />

          {/* Main Content */}
          <div className="p-4 ">
            {/* Account Balance Card */}

            <div className="bg-[#1E1E1E] rounded-2xl md:p-6 shadow-md border border-[#2a2a2a]">
  <div className="px-6 pt-6 pb-4">
    <div className="flex flex-col gap-2">
      <div className="text-sm font-medium text-gray-400 tracking-wide">ACCOUNT BALANCE</div>
      <div className="text-3xl font-bold text-white">
        {isLoading ? (
          <div className="h-8 w-48 animate-pulse rounded-md bg-gray-700/50" />
        ) : (
          showBalance
            ? `${totalBalance.toLocaleString("en-US", { style: "currency", currency: "USD" })}`
            : "$••••••••••"
        )}
      </div>
    </div>
  </div>

              {/* Account Stats Grid */}
              <div className="grid md:grid-cols-2 gap-4 mb-6 p-[1rem]">
                <div className="bg-[#383838] rounded-[1rem] p-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-400 text-sm">TOTAL DEPOSIT</span>
                    <CircleDollarSign className="h-6 w-6 text-gray-400" />
                  </div>
                  <div className="text-xl font-bold">
                    ${(userData?.user?.total_deposit.toLocaleString("en-US", { style: "currency", currency: "USD" }) || 0)}
                  </div>
                </div>

                <div className="bg-[#383838] rounded-[1rem] p-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-400 text-sm">TOTAL PROFIT</span>
                    <Sprout className="h-6 w-6 text-gray-400" />
                  </div>
                  <div className="text-xl font-bold">
                    ${(userData?.user?.total_profit.toLocaleString("en-US", { style: "currency", currency: "USD" }) || 0)}
                  </div>
                </div>

                <div className="bg-[#383838] rounded-[1rem] p-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-400 text-sm">TOTAL BONUS</span>
                    <Gift className="h-6 w-6 text-gray-400" />
                  </div>
                  <div className="text-xl font-bold">
                    ${(userData?.user?.usdt_balance.toLocaleString("en-US", { style: "currency", currency: "USD" }) || 0)}
                  </div>
                </div>

                <div className="bg-[#383838] rounded-[1rem] p-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-400 text-sm">WITHDRAWALS</span>
                    <Wallet className="h-6 w-6 text-gray-400" />
                  </div>
                  <div className="text-xl font-bold">
                    ${(userData?.user?.total_withdrawals.toLocaleString("en-US", { style: "currency", currency: "USD" }) || 0)}
                  </div>
                </div>
              </div>
            </div>
            {/* Recent Transactions */}
            <div className="bg-[#1E1E1E] rounded-[1rem] mt-5  p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-medium">Recent Transactions</h2>
                <Link href="/dashboard/transactions" className="text-sm text-gray-400">
                  View All
                </Link>
              </div>
              <TransactionList transactions={userData?.transactions || []} number={5} />
            </div>

            <div className="bg-[#1E1E1E] rounded-[1rem] mt-5  p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-medium">Active Investments</h2>
                <Link href="/dashboard/investments" className="text-sm text-gray-400">
                  View All
                </Link>
              </div>
              <InvestmentList investments={investments} limit={3} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

