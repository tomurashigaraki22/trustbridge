"use client"

import { useState, useEffect, useMemo } from "react"
import { Sidebar } from "@/components/dashboard/Sidebar"
import { TopBar } from "@/components/dashboard/TopBar"
import { Clock, X, AlertCircle } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import Cookies from "js-cookie"
import { useUserData } from "@/hooks/useUserData"
import { useCryptoData } from "@/hooks/useCryptoData"
import { getCryptoName } from "@/lib/getCryptoName"
interface TradingData {
  timestamp: string;
  change: number;
  balance: number;
}

interface SessionData {
  [key: number]: TradingData[];
}

interface CryptoAsset {
  symbol: string;
  name: string;
  balance: number;
  priceUsd: number;
  gasFee: number;
}
interface TradingBot {
  id: number
  name: string
  description: string
  min_roi: number
  max_roi: number
  duration_days: number
  price_amount: number
  price_currency: string
}

interface TradingSession {
  id: number
  bot_id: number
  bot_name: string
  initial_amount: number
  currency: string
  start_date: string
  end_date: string
  status: string
  current_profit: number
  trading_data_url: string
}

export default function AITradingPage() {
  const router = useRouter()
  const [showBuyModal, setShowBuyModal] = useState(false)
  const [selectedBot, setSelectedBot] = useState<TradingBot | null>(null)
  const [amount, setAmount] = useState("")
  const [availableBots, setAvailableBots] = useState<TradingBot[]>([])
  const [runningSessions, setRunningSessions] = useState<TradingSession[]>([])
  const [error, setError] = useState("")
  const [totalProfit, setTotalProfit] = useState(0)
  const [totalInvested, setTotalInvested] = useState(0)
  const [mytotalInvested, setmyTotalInvested] = useState(0)
  const [isUSD, setIsUSD] = useState(true)
  const [selectedCrypto, setSelectedCrypto] = useState<CryptoAsset | null>(null);
  const [sessionProfits, setSessionProfits] = useState<{ [key: string]: number }>({});
  const [sessionAmountProfits, setSessionAmountProfits] = useState<{ [key: string]: number }>({});
  const [sessionData, setSessionData] = useState<SessionData>({});
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { userData } = useUserData()
  const { cryptoData } = useCryptoData()

  useEffect(() => {
    fetchData()
    const interval = setInterval(fetchData, 5000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {

    const profit = Object.values(sessionProfits).reduce((acc, curr) => acc + curr, 0);
    setTotalProfit(Number(profit.toFixed(2)));

    const invested = Object.values(sessionAmountProfits).reduce((acc, curr) => acc + curr, 0);
    setTotalInvested(Number(invested.toFixed(2)));
  }, [sessionProfits, sessionAmountProfits]);

  useEffect(() => {
    const newSessionProfits: Record<string, number> = {};
    const newSessionAmountProfits: Record<string, number> = {};

    runningSessions.forEach((session) => {
        const records = sessionData[session.id] ?? [];
        const now = Date.now();

        let filteredRecords = records.filter((d: TradingData) => {
            const timestamp = new Date(d.timestamp).getTime();
            return now - timestamp > 0 && now - timestamp <= 60000;
        });

        if (filteredRecords.length === 0) {
            filteredRecords = records.slice(-5); // Show last 5 timestamps if no valid records
        }

        const recentData = filteredRecords.slice(-1)[0]; // Get the most recent record

        newSessionProfits[session.id.toString()] = recentData?.change ?? 0;
        newSessionAmountProfits[session.id.toString()] = recentData?.balance ?? 0;
    });

    setSessionProfits(newSessionProfits);
    setSessionAmountProfits(newSessionAmountProfits);
}, [sessionData, runningSessions]);
  const fetchData = async () => {
    try {
      const [botsRes, sessionsRes] = await Promise.all([
        fetch("/api/trading/bots", {
          headers: {
            Authorization: `Bearer ${Cookies.get("auth-token")}`,
          },
        }),
        fetch("/api/trading/sessions", {
          headers: {
            Authorization: `Bearer ${Cookies.get("auth-token")}`,
          },
        }),
      ])

      const botsData = await botsRes.json()
      const sessionsData = await sessionsRes.json()

      if (botsData.bots) {
        setAvailableBots(botsData.bots)
      }

      if (sessionsData.sessions) {
        setRunningSessions(sessionsData.sessions)
        calculateTotals(sessionsData.sessions)

        const tradingDataPromises = sessionsData.sessions.map(async (session: TradingSession) => {
          const response = await fetch(`/api/trading/sessions/${session.id}`, {
            headers: {
              Authorization: `Bearer ${Cookies.get("auth-token")}`,
            },
          })
          const data = await response.json()
          if (data?.session?.trading_data) {
            const latestProfit =
              data.session.trading_data
                .filter((d: TradingData) => {
                  const now = Date.now()
                  const timestamp = new Date(d.timestamp).getTime()
                  return now - timestamp > 0 && now - timestamp <= 60000
                })
                .slice(-1)
                .map((d: TradingData) => d.change)[0] || 0

            const latestAmountProfit =
              data.session.trading_data
                .filter((d: TradingData) => {
                  const now = Date.now()
                  const timestamp = new Date(d.timestamp).getTime()
                  return now - timestamp > 0 && now - timestamp <= 60000
                })
                .slice(-1)
                .map((d: TradingData) => d.balance)[0] || 0


            setSessionProfits((prev) => ({
              ...prev,
              [session.id]: latestProfit,
            }))

            setSessionAmountProfits((prev) => ({
              ...prev,
              [session.id]: latestAmountProfit,
            }))
          }
          console.log(data)
          return { id: session.id, data: data?.session?.trading_data }
        })

        const tradingDataResults = await Promise.all(tradingDataPromises)
        const newSessionData = tradingDataResults.reduce((acc, { id, data }) => {
          acc[id] = data
          return acc
        }, {})
        setSessionData(newSessionData)
      }
    } catch (error) {
      console.error("Failed to fetch data:", error)
      setError("Failed to load trading data")
    }
  }
  console.log(sessionProfits)

  const calculateTotals = (sessions: TradingSession[]) => {
    let invested = 0
    sessions.forEach((session) => {
      invested += Number.parseFloat(session.initial_amount.toString())
    })
    setmyTotalInvested(invested)
  }

  const availableCoins = useMemo(() => {
    if (!userData?.user || !cryptoData) return []

    return Object.entries(userData.user)
      .filter(([key]) => key.endsWith("_balance"))
      .map(([key, balance]) => {
        const symbol = key.replace("_balance", "").toUpperCase()
        const cryptosymbol = getCryptoName(symbol, "lowercase-hyphen")
        const priceUsd = cryptoData[cryptosymbol]?.priceUsd || 0
        const name = cryptoData[symbol.toLowerCase()]?.name || symbol
        return {
          symbol,
          name,
          balance: Number(balance || 0),
          priceUsd: Number(priceUsd),
          gasFee: Number((1 / Number(priceUsd || 1)).toFixed(8)),
        }
      })
      .filter((coin) => coin.balance > 0)
  }, [userData, cryptoData])

  const cryptoAmount = isUSD ? Number(amount) / (selectedCrypto?.priceUsd || 1) : Number(amount)
  const usdAmount = isUSD ? Number(amount) : Number(amount) * (selectedCrypto?.priceUsd || 1)

  const handleBotPurchase = async () => {
    if (!selectedBot || !amount || !selectedCrypto) return
    setIsSubmitting(true)

    try {
      const response = await fetch("/api/trading/start", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Cookies.get("auth-token")}`,
        },
        body: JSON.stringify({
          botId: selectedBot.id,
          amount: isUSD ? usdAmount : cryptoAmount,
          currency: selectedCrypto.symbol,
          cryptoAmount: cryptoAmount,
          usdAmount: usdAmount,
        }),
      })

      const data = await response.json()
      if (data.success) {
        fetchData()
        setShowBuyModal(false)
        setSelectedBot(null)
        setAmount("")
        setSelectedCrypto(null)
      } else {
        throw new Error(data.error || "Failed to start trading")
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to start trading")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#111111] text-white pb-[5rem]">
      <div className="flex flex-col lg:flex-row">
        <Sidebar />
        <div className="flex-1 ">
          <TopBar title="AI Trading" notices={userData?.notices} />
          <div className="p-4 lg:p-8">
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div className="bg-[#121212] rounded-[1rem] p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">Total Invested</h2>
                </div>
                <div className="text-3xl font-bold mb-2">
                  ${mytotalInvested.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
              </div>

              <div className="bg-[#121212] rounded-[1rem] p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">Total Profit</h2>
                  <span className={totalProfit >= 0 ? "text-green-500" : "text-red-500"}>
                    {Number(totalProfit) >= 0 ? "+" : ""}
                    {totalProfit}%
                  </span>
                </div>
                <div className="text-3xl font-bold mb-2">${(totalInvested * (1 + totalProfit / 100)).toFixed(2)}</div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <button
                onClick={() => setShowBuyModal(true)}
                className="bg-orange-500 hover:bg-orange-600 py-3 px-4 rounded-lg font-medium"
              >
                Buy Trading Bot
              </button>
              <Link
                href="/dashboard/Aitrading/history"
                className="bg-[#121212] hover:bg-[#1A1A1A] py-3 px-4 rounded-lg font-medium text-center"
              >
                Trading History
              </Link>
            </div>

            <div className="bg-[#121212] rounded-[1rem] p-6 mb-6">
              <h3 className="text-xl font-semibold mb-4">Active Trading Sessions</h3>
              <div className="space-y-4">
                {runningSessions.map((session) => {
                  const recentData = (() => {
                    const records = sessionData[session.id] ?? [];
                    const now = Date.now();
                
                    let filteredRecords = records.filter((d: TradingData) => {
                        const timestamp = new Date(d.timestamp).getTime();
                        return now - timestamp > 0 && now - timestamp <= 60000;
                    });
                
                    if (filteredRecords.length === 0) {
                        filteredRecords = records.slice(-5); // Show last 5 timestamps if no valid records
                    }
                
                    return filteredRecords
                        .slice(-1) // Get the last record
                        .map((d: TradingData) => d.change);
                })();


                  return (
                    <div
                      key={session.id}
                      onClick={() => router.push(`/dashboard/Aitrading/${session.id}`)}
                      className="bg-[#1A1A1A] p-4 rounded-lg space-y-4 cursor-pointer hover:bg-[#242424] transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">{session.bot_name}</div>
                          <div className="text-sm text-gray-400 flex items-center gap-2">
                            <Clock size={14} />
                            {new Date(session.start_date).toLocaleDateString()}
                            {" - "}
                            {new Date(session.end_date).toLocaleDateString()}
                          </div>
                        </div>

                        <div
                          className={`text-lg ${(recentData?.[0] || 0) >= 0
                            ? "text-green-500"
                            : "text-red-500"
                            }`}
                        >
                          {(recentData?.[0] || 0) >= 0 ? "+" : ""}
                          {recentData}%
                        </div>
                      </div>

                    </div>
                  )
                })}
                {runningSessions.length === 0 && (
                  <div className="text-gray-400 text-center py-4">No active trading sessions</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Purchase Modal */}
      {showBuyModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-[#121212] rounded-[1rem] p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold">Purchase Trading Bot</h3>
              <button onClick={() => setShowBuyModal(false)} className="text-gray-400 hover:text-white">
                <X size={24} />
              </button>
            </div>

            <div className="space-y-4">
              {error && (
                <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-4 rounded-lg mb-6 flex items-center gap-2">
                  <AlertCircle size={20} />
                  {error}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Select Bot</label>
                <select
                  className="w-full bg-[#1A1A1A] rounded-lg px-4 py-2 text-white"
                  onChange={(e) => {
                    const bot = availableBots.find((b) => b.id === Number.parseInt(e.target.value))
                    setSelectedBot(bot || null)
                  }}
                  value={selectedBot?.id || ""}
                >
                  <option value="">Select a bot</option>
                  {availableBots.map((bot) => (
                    <option key={bot.id} value={bot.id}>
                      {bot.name} - ${Number(bot.price_amount).toFixed(2)}
                    </option>
                  ))}
                </select>
              </div>

              {selectedBot && (
                <>
                  <div className="bg-[#1A1A1A] p-4 rounded-lg">
                    <div className="text-sm text-gray-400 mb-2">Expected ROI</div>
                    <div className="text-green-500 font-medium">
                      {selectedBot.min_roi}% - {selectedBot.max_roi}%
                    </div>
                    <div className="text-sm text-gray-400 mt-2">Duration</div>
                    <div>{selectedBot.duration_days} days</div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1.5">Select Payment Method</label>
                    <select
                      className="w-full bg-[#1A1A1A] rounded-lg px-4 py-2 text-white"
                      onChange={(e) => {
                        const coin = availableCoins.find((c) => c.symbol === e.target.value)
                        setSelectedCrypto(coin || null)
                      }}
                      value={selectedCrypto?.symbol || ""}
                    >
                      <option value="">Select a wallet</option>
                      {availableCoins.map((coin) => (
                        <option key={coin.symbol} value={coin.symbol}>
                          {coin.name} - Balance: ${coin.balance.toFixed(2)} ({coin.symbol})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="relative">
                    <label className="block text-sm font-medium text-gray-300 mb-1.5">
                      Investment Amount
                      <button onClick={() => setIsUSD(!isUSD)} className="ml-2 text-orange-500 text-xs">
                        Switch to {isUSD ? selectedCrypto?.symbol || "Crypto" : "USD"}
                      </button>
                    </label>
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="w-full bg-[#1A1A1A] rounded-lg px-4 py-2 text-white pr-24"
                      placeholder={`Min: $${selectedBot.price_amount}`}
                      min={selectedBot.price_amount}
                      step="0.01"
                    />
                    {amount && (
                      <div className="absolute right-3   transform -translate-y-[1.6rem] text-sm text-gray-400">
                        ≈ {isUSD ? `${cryptoAmount.toFixed(8)} ${selectedCrypto?.symbol}` : `$${usdAmount.toFixed(2)}`}
                      </div>
                    )}
                  </div>

                  {selectedCrypto && (
                    <div className="bg-[#1A1A1A] p-4 rounded-lg space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Network Fee</span>
                        <span>
                          {selectedCrypto.gasFee} {selectedCrypto.symbol}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Total</span>
                        <span>
                          {(cryptoAmount + selectedCrypto.gasFee).toFixed(8)} {selectedCrypto.symbol}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Total (USD)</span>
                        <span>${((cryptoAmount + selectedCrypto.gasFee) * selectedCrypto.priceUsd).toFixed(2)}</span>
                      </div>
                    </div>
                  )}
                </>
              )}

              <button
                onClick={handleBotPurchase}
                disabled={
                  !selectedBot ||
                  !amount ||
                  !selectedCrypto ||
                  Number.parseFloat(amount) < selectedBot?.price_amount ||
                  isSubmitting
                }
                className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-orange-500/50 disabled:cursor-not-allowed py-3 rounded-lg font-medium mt-4"
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                    Processing...
                  </div>
                ) : (
                  "Start Trading"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

