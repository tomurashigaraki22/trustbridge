"use client"

import { useState, useEffect } from "react"
import dynamic from "next/dynamic"
import Cookies from "js-cookie"
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false })
import type { ApexOptions } from 'apexcharts'

interface TradingChartProps {
    sessionId: string | number
    height?: string | number
}

interface TradingData {
    timestamp: string;
    balance: number;
    change: number;
}

interface ChartError {
    message: string;
}

export function TradingChart({ sessionId, height = "400px" }: TradingChartProps) {
    const [sessionData, setSessionData] = useState<TradingData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<ChartError | null>(null);

    const chartOptions: ApexOptions = {
        chart: {
            type: "candlestick",
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
    } as ApexOptions

    useEffect(() => {
        fetchChartData()
        const interval = setInterval(fetchChartData, 5000)
        return () => clearInterval(interval)
    }, [sessionId])

    const fetchChartData = async () => {
        try {
            const response = await fetch(`/api/trading/chart/${sessionId}`, {
                headers: {
                    Authorization: `Bearer ${Cookies.get("auth-token")}`,
                },
            });
            const data = await response.json();
            if (data.tradingData) {
                setSessionData(data.tradingData);
            }
        } catch (err) {
            setError({ message: err instanceof Error ? err.message : 'Failed to fetch chart data' });
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) return <div>Loading chart...</div>
    if (error) return <div>error</div>

    return (
        <div style={{ height }}>
            <Chart
                options={chartOptions}
                series={[
                    {
                        name: "Price",
                        data: sessionData
                            .filter((d: TradingData) => {
                                const now = Date.now();
                                const timestamp = new Date(d.timestamp).getTime();
                                return now - timestamp > 0 && now - timestamp <= 80000;
                            })
                            .sort((a: TradingData, b: TradingData) =>
                                new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
                            )
                            .map((d: TradingData) => ({
                                x: new Date(new Date(d.timestamp).setHours(new Date(d.timestamp).getHours() + 1)),
                                y: [
                                    parseFloat(d.balance.toFixed(2)),
                                    parseFloat((d.balance * (1 + Math.abs(d.change / 100))).toFixed(2)),
                                    parseFloat((d.balance * (1 - Math.abs(d.change / 100))).toFixed(2)),
                                    parseFloat((d.balance * (1 + (d.change / 100))).toFixed(2))
                                ]
                            }))
                    }
                ]}
                type="candlestick"
                height="100%"
            />
        </div>
    );
}