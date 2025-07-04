"use client"

import { useEffect, useState, useCallback, use } from "react"
import { Sidebar } from "@/components/dashboard/Sidebar"
import { TopBar } from "@/components/dashboard/TopBar"
import { ArrowDown, ArrowUp, Wallet } from "lucide-react"
import { useUserData } from "@/hooks/useUserData"
import { useCryptoData } from "@/hooks/useCryptoData"
import dynamic from "next/dynamic"
import Link from "next/link"
import { getCryptoName } from "@/lib/getCryptoName"
import { ApexOptions } from "apexcharts"

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false })


interface CoinDetailsProps {
    params: Promise<{
        symbol: string
    }>
}

interface ChartData {
    timestamp: string;
    price: number;
}

interface ChartSeries {
    name: string;
    data: [number, number][];
}

export default function CoinDetails({ params }: CoinDetailsProps) {
    const { symbol } = use(params)
    const { userData } = useUserData()
    const { cryptoData } = useCryptoData()
    const [timeFrame, setTimeFrame] = useState("1D")

    // Update the type annotation where the any is used
    const [chartData, setChartData] = useState<ChartData[]>([]);
    const [isLoading, setIsLoading] = useState(true)


    const getInterval = (timeFrame: string) => {
        switch (timeFrame) {
            case "1H":
                return "m5"
            case "1D":
                return "m30"
            case "1W":
                return "h2"
            case "1M":
                return "h12"
            case "1Y":
                return "d1"
            case "All":
                return "d1"
            default:
                return "m30"
        }
    }

    // Add this interface with the other interfaces at the top
    interface CoinCapDataPoint {
        time: number;
        priceUsd: string;
    }

    interface CoinCapResponse {
        data: CoinCapDataPoint[];
    }

    const fetchCoinData = useCallback(async () => {
        try {
            setIsLoading(true)
            const cryptoId = getCryptoName(symbol, "lowercase-hyphen")
            const interval = getInterval(timeFrame)
            const res = await fetch(`https://api.coincap.io/v2/assets/${cryptoId}/history?interval=${interval}`)
            const response: CoinCapResponse = await res.json()
            setChartData(
                response.data.map((point) => ({
                    timestamp: new Date(point.time).toISOString(),
                    price: Number.parseFloat(point.priceUsd)
                }))
            )
        } catch (error) {
            console.error("Error fetching coin data:", error)
        } finally {
            setIsLoading(false)
        }
    }, [symbol, timeFrame])

    useEffect(() => {
        fetchCoinData()
    }, [fetchCoinData])

    const cryptoName = getCryptoName(symbol, "lowercase-hyphen")
    const cryptoInfo = cryptoData[cryptoName]
    const balance = userData?.user[`${symbol.toLowerCase()}_balance` as keyof typeof userData.user] || 0
    const value = Number(balance) * Number(cryptoInfo?.priceUsd || 0)

    const chartOptions: ApexOptions = {
        chart: {
            type: "area" as const,  // explicitly type as "area"
            height: 350,
            toolbar: {
                show: false,
            },
            background: "transparent",
        },
        dataLabels: {
            enabled: false,
        },
        stroke: {
            curve: "smooth",
            width: 2,
        },
        fill: {
            type: "gradient",
            gradient: {
                shadeIntensity: 1,
                opacityFrom: 0.7,
                opacityTo: 0.2,
                stops: [0, 90, 100],
            },
        },
        xaxis: {
            type: "datetime",
            labels: {
                style: {
                    colors: "#9ca3af",
                },
            },
        },
        yaxis: {
            labels: {
                style: {
                    colors: "#9ca3af",
                },
                formatter: (value: number) => `$${value.toFixed(2)}`,
            },
        },
        tooltip: {
            theme: "dark",
            x: {
                format: "dd MMM yyyy",
            },
        },
        grid: {
            borderColor: "#374151",
        },
        theme: {
            mode: "dark",
        },
    }

    const timeFrames = ["1H", "1D", "1W", "1M", "1Y", "All"]

    return (
        <div className="min-h-screen bg-[#0A0E1C] text-white pb-[5rem]">
            <div className="flex flex-col lg:flex-row">
                <Sidebar />
                <div className="flex-1 ">
                    <TopBar title={`${symbol} Details`} notices={userData?.notices} />
                    <div className="flex flex-col lg:flex-row">
                        <div className="flex-1 w-full lg:max-w-[calc(100%-320px)] p-4 lg:p-8">
                            <div className="grid gap-4 md:grid-cols-3 mb-8">
                                <div className="bg-[#121212] p-6 rounded-[1rem]">
                                    <div className="text-sm text-gray-400 mb-2">Balance</div>
                                    <div className="text-2xl font-bold">
                                        ${Number(balance).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                    </div>
                                    <div className="text-sm text-gray-400">
                                        {Number(value).toFixed(6)} {symbol}
                                    </div>
                                </div>
                                <div className="bg-[#121212] p-6 rounded-[1rem]">
                                    <div className="text-sm text-gray-400 mb-2">Current Price</div>
                                    <div className="text-2xl font-bold">
                                        ${Number(cryptoInfo?.priceUsd || 0).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                                    </div>
                                    <div
                                        className={`text-sm flex items-center gap-1 ${Number(cryptoInfo?.changePercent24Hr || 0) >= 0 ? "text-green-500" : "text-red-500"}`}
                                    >
                                        {Number(cryptoInfo?.changePercent24Hr || 0) >= 0 ? (
                                            <ArrowUp className="h-4 w-4" />
                                        ) : (
                                            <ArrowDown className="h-4 w-4" />
                                        )}
                                        {Math.abs(Number(cryptoInfo?.changePercent24Hr || 0)).toFixed(2)}%
                                    </div>
                                </div>
                                <div className="bg-[#121212] p-6 rounded-[1rem]">
                                    <div className="text-sm text-gray-400 mb-2">Market Cap</div>
                                    <div className="text-2xl font-bold">
                                        ${Number(cryptoInfo?.marketCapUsd || 0).toLocaleString("en-US", { maximumFractionDigits: 0 })}
                                    </div>
                                    <div className="text-sm text-gray-400">Rank #{cryptoInfo?.rank || "-"}</div>
                                </div>
                            </div>

                            <div className="bg-[#121212] rounded-[1rem] p-6">
                                <div className="flex flex-wrap gap-2 mb-4">
                                    {timeFrames.map((tf) => (
                                        <button
                                            key={tf}
                                            onClick={() => setTimeFrame(tf)}
                                            className={`px-4 py-2 rounded-lg text-sm font-medium ${timeFrame === tf ? "bg-orange-500" : "bg-[#1A1A1A] hover:bg-[#242424]"
                                                }`}
                                        >
                                            {tf}
                                        </button>
                                    ))}
                                </div>
                                {isLoading ? (
                                    <div className="h-[350px] flex items-center justify-center">Loading...</div>
                                ) : (
                                    <Chart
                                        options={chartOptions}
                                        series={[{
                                            name: symbol,
                                            data: chartData.map(point => [
                                                new Date(point.timestamp).getTime(),
                                                point.price
                                            ])
                                        }] as ChartSeries[]}
                                        type="area"
                                        height={350}
                                    />
                                )}
                            </div>
                        </div>

                        <div className="w-full lg:w-80 border-t lg:border-l border-gray-800/50 p-4 lg:p-5">
                            <div className="mb-8">
                                <div className="mb-4 text-lg font-medium">Quick Actions</div>
                                <div className="grid gap-3">
                                    <Link
                                        href={`/dashboard/transactions/send?symbol=${symbol}`}
                                        className="flex w-full items-center justify-center gap-2 rounded-lg bg-orange-500 py-3 text-sm font-medium transition-colors hover:bg-orange-600"
                                    >
                                        <Wallet className="h-4 w-4" />
                                        Send {symbol}
                                    </Link>

                                    {process.env.NEXT_PUBLIC_SHOW_SWAP !== "false" && (

                                        <Link
                                            href={`/dashboard/transactions/swap?symbol=${symbol}`}
                                            className="flex items-center justify-center gap-2 rounded-lg bg-[#121212] py-3 text-sm font-medium transition-colors hover:bg-[#1A1A1A]"
                                        >
                                            Swap {symbol}
                                        </Link>
                                    )}

                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="text-lg font-medium">Asset Information</div>
                                <div className="bg-[#121212] rounded-lg p-4 space-y-3">
                                    <div>
                                        <div className="text-sm text-gray-400">Volume (24h)</div>
                                        <div>
                                            ${Number(cryptoInfo?.volumeUsd24Hr || 0).toLocaleString("en-US", { maximumFractionDigits: 0 })}
                                        </div>
                                    </div>
                                    <div>
                                        <div className="text-sm text-gray-400">Supply</div>
                                        <div>
                                            {Number(cryptoInfo?.supply || 0).toLocaleString("en-US", { maximumFractionDigits: 0 })} {symbol}
                                        </div>
                                    </div>
                                    <div>
                                        <div className="text-sm text-gray-400">Max Supply</div>
                                        <div>
                                            {cryptoInfo?.maxSupply
                                                ? Number(cryptoInfo.maxSupply).toLocaleString("en-US", { maximumFractionDigits: 0 })
                                                : "Unlimited"}{" "}
                                            {symbol}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

