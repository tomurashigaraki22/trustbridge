"use client"

import { useState, useEffect, use } from "react"
import { Sidebar } from "@/components/dashboard/Sidebar"
import { TopBar } from "@/components/dashboard/TopBar"
import { Clock } from "lucide-react"
import dynamic from "next/dynamic"
import Cookies from "js-cookie"
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false })
import type { ApexOptions } from 'apexcharts'
import { useRouter } from "next/navigation"

interface TradingData {
    id: number;
    timestamp: string;
    change: number;
    balance: number;
    recentData: number;
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


interface SessionData {
    [key: number]: TradingData[];
}

export default function BotDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = use(params)
    const [session, setSession] = useState<TradingSession | null>(null)
    const [sessionData, setSessionData] = useState<SessionData>({});
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState("")
    const [isClosing, setIsClosing] = useState(false)

    console.log(sessionData)

    const router = useRouter();
    // Add chart type state
    const [chartType] = useState("price")

    const chartOptions: ApexOptions = {
        chart: {
            type: "candlestick",
            height: 300,
            toolbar: { show: false },
            background: "transparent",
        },
        theme: {
            mode: "dark",
        },
        xaxis: {
            type: "datetime",
            labels: {
                style: {
                    colors: "#fff",
                },
                datetimeFormatter: {
                    year: "yyyy",
                    month: "MMM 'yy",
                    day: "dd MMM",
                    hour: "HH:mm",
                },
            },
        },
        yaxis: {
            tooltip: {
                enabled: true,
            },
            labels: {
                style: {
                    colors: "#fff",
                },
            },
        },
        tooltip: {
            enabled: true,
            theme: "dark",
        },
        grid: {
            borderColor: "#ffffff1a",
        },
        plotOptions: {
            candlestick: {
                colors: {
                    upward: "#26a69a",
                    downward: "#ef5350",
                },
            },
        },
        stroke: {
            curve: "smooth",
            width: chartType === "price" ? 2 : 1,
        },
    } as ApexOptions

    const handleCloseTrading = async () => {
        if (!session || isClosing) return

        setIsClosing(true)
        try {
            const response = await fetch(`/api/trading/sessions/${resolvedParams.id}`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${Cookies.get("auth-token")}`,
                },
            })

            const data = await response.json()
            if (data.success) {
                router.push(
                    `/dashboard/transactions/success?symbol=${session?.bot_name}&type=trading`,
                )
            } else {
                throw new Error(data.error || 'Failed to close trading')
            }
        } catch (error) {
            setError(error instanceof Error ? error.message : 'Failed to close trading')
        } finally {
            setIsClosing(false)
        }
    }

    useEffect(() => {
        fetchSessionData()
        const interval = setInterval(fetchSessionData, 5000)
        return () => clearInterval(interval)
    }, [resolvedParams.id])

    const fetchSessionData = async () => {
        try {
            const response = await fetch(`/api/trading/sessions/${resolvedParams.id}`, {
                headers: {
                    Authorization: `Bearer ${Cookies.get("auth-token")}`,
                },
            })
            const data = await response.json()

            if (data.session) {
                setSession(data.session)
                // Update this line to properly set the session data
                setSessionData({ [data.session.id]: data.session.trading_data || [] })
            }
        } catch (error) {
            console.error(error)
            setError("Failed to fetch session data")
        } finally {
            setIsLoading(false)
        }
    }

    const recentData = session ? (() => {
        const records = sessionData[session.id] ?? [];
        const now = Date.now();

        let filteredRecords = records.filter((d: TradingData) => {
            const timestamp = new Date(d.timestamp).getTime();
            return now - timestamp > 0 && now - timestamp <= 80000;
        });

        if (filteredRecords.length === 0) {
            filteredRecords = records.slice(-5); // Show last 5 timestamps if no valid records
        }

        return filteredRecords
            .sort((a: TradingData, b: TradingData) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
            .slice(0)[0]; // Get the most recent record
    })() : null;

    if (isLoading) return <div>Loading...</div>
    if (error) return <div>{error}</div>
    if (!session) return <div>Session not found</div>

    return (
        <div className="min-h-screen bg-[#0A0E1C] text-white pb-[5rem]">
            <div className="flex flex-col lg:flex-row">
                <Sidebar />
                <div className="flex-1 ">
                    <TopBar title={`Bot Details - ${session.bot_name}`} />
                    <div className="p-4 lg:p-8">
                        <div className="bg-[#121212] rounded-[1rem] p-6 mb-6">

                            <div className="flex justify-between items-center mb-6">
                                <div>
                                    <h2 className="text-2xl font-semibold">{session.bot_name}</h2>
                                    <div className="text-sm text-gray-400 flex items-center gap-2 mt-1">
                                        <Clock size={14} />
                                        Ends: {new Date(session.end_date).toLocaleDateString()}
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className={`text-lg ${(recentData?.change || 0) >= 0 ? "text-green-500" : "text-red-500"}`}>
                                        {(recentData?.change || 0) >= 0 ? "+" : ""}{recentData?.change || 0}%
                                    </div>
                                    <button
                                        onClick={handleCloseTrading}
                                        disabled={isClosing || session.status === 'completed'}
                                        className="bg-red-500 hover:bg-red-600 disabled:bg-red-500/50 disabled:cursor-not-allowed px-4 py-2 rounded-lg text-sm font-medium"
                                    >
                                        {isClosing ? 'Closing...' : 'Close Trading'}
                                    </button>
                                </div>
                            </div>
                            {
                                new Date(session.end_date) < new Date() && (
                                    <div className="bg-red-500 text-white p-4 rounded-lg mb-4">
                                        This trading session has ended, The chart and table shows the last set of records
                                    </div>
                                )
                            }
                            <div className="grid md:grid-cols-3 gap-4 mb-6">
                                <div className="bg-[#1A1A1A] p-4 rounded-lg">
                                    <div className="text-sm text-gray-400">Initial Investment</div>
                                    <div className="text-xl font-medium mt-1">
                                        ${session?.initial_amount}

                                    </div>
                                </div>
                                <div className="bg-[#1A1A1A] p-4 rounded-lg">
                                    <div className="text-sm text-gray-400">Current Balance</div>
                                    <div className="text-xl font-medium mt-1">
                                        ${recentData?.balance.toFixed(2) || session?.initial_amount.toFixed(2)}
                                    </div>
                                </div>
                                <div className="bg-[#1A1A1A] p-4 rounded-lg">
                                    <div className="text-sm text-gray-400">Currency</div>
                                    <div className="text-xl font-medium mt-1">{session.currency}</div>
                                </div>
                            </div>

                            <div className="h-[400px] mb-6">
                                <Chart
                                    options={chartOptions}
                                    series={[
                                        {
                                            name: "Price",
                                            data: (() => {
                                                const records = sessionData[session.id] ?? [];
                                                const now = Date.now();

                                                let filteredRecords = records.filter((d: TradingData) => {
                                                    const timestamp = new Date(d.timestamp).getTime();
                                                    return now - timestamp > 0 && now - timestamp <= 80000;
                                                });

                                                if (filteredRecords.length === 0) {
                                                    filteredRecords = records.slice(-15); // Show last 5 timestamps if no valid records
                                                }

                                                return filteredRecords
                                                    .sort((a: TradingData, b: TradingData) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
                                                    .map((d: TradingData) => ({
                                                        x: new Date(new Date(d.timestamp).setHours(new Date(d.timestamp).getHours() + 1)),
                                                        y: [
                                                            parseFloat(d.balance.toFixed(2)),
                                                            parseFloat((d.balance * (1 + Math.abs(d.change / 100))).toFixed(2)),
                                                            parseFloat((d.balance * (1 - Math.abs(d.change / 100))).toFixed(2)),
                                                            parseFloat((d.balance * (1 + (d.change / 100))).toFixed(2))
                                                        ]
                                                    }));
                                            })()
                                        }
                                    ]}
                                    type="candlestick"
                                    height="100%"
                                />
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="text-gray-400 text-sm">
                                            <th className="text-left p-2">Time</th>
                                            <th className="text-right p-2">Balance</th>
                                            <th className="text-right p-2">Change</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {(() => {
                                            const records = sessionData[session.id] ?? [];
                                            const now = Date.now();

                                            let filteredRecords = records.filter((d: TradingData) => {
                                                const timestamp = new Date(d.timestamp).getTime();
                                                return now - timestamp > 0 && now - timestamp <= 80000;
                                            });

                                            if (filteredRecords.length === 0) {
                                                filteredRecords = records.slice(-15); // Show last 5 timestamps if no valid records
                                            }

                                            return filteredRecords
                                                .sort((a: TradingData, b: TradingData) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
                                                .map((data: TradingData) => (
                                                    <tr key={data.id} className="border-t border-[#ffffff1a]">
                                                        <td className="p-2">
                                                            {new Date(data.timestamp).toLocaleString("en-US")}
                                                        </td>
                                                        <td className="text-right p-2">
                                                            ${data.balance.toFixed(2)}
                                                        </td>
                                                        <td className={`text-right p-2 ${data.change >= 0 ? "text-green-500" : "text-red-500"}`}>
                                                            {data.change >= 0 ? "+" : ""}{data.change}%
                                                        </td>
                                                    </tr>
                                                ));
                                        })()}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}