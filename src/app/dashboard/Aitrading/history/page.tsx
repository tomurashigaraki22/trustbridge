"use client"

import { useState, useEffect } from "react"
import { Sidebar } from "@/components/dashboard/Sidebar"
import { TopBar } from "@/components/dashboard/TopBar"
import { Clock } from "lucide-react"
import Cookies from "js-cookie"
import Link from "next/link"

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
}

export default function TradingHistoryPage() {
    const [sessions, setSessions] = useState<TradingSession[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState("")

    useEffect(() => {
        fetchSessions()
    }, [])

    const fetchSessions = async () => {
        try {
            const response = await fetch("/api/trading/sessions?status=completed", {
                headers: {
                    Authorization: `Bearer ${Cookies.get("auth-token")}`,
                },
            })
            const data = await response.json()
            if (data.sessions) {
                setSessions(data.sessions)
            }
        } catch (error) {
            console.error(error)
            setError("Failed to load trading history")
        } finally {
            setIsLoading(false)
        }
    }

    if (isLoading) return <div>Loading...</div>
    if (error) return <div>{error}</div>

    return (
        <div className="min-h-screen bg-[#111111] text-white pb-[5rem]">
            <div className="flex flex-col lg:flex-row">
                <Sidebar />
                <div className="flex-1 ">
                    <TopBar title="Trading History" />
                    <div className="p-4 lg:p-8">
                        <div className="bg-[#121212] rounded-[1rem] p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-semibold">Completed Sessions</h2>
                                <Link
                                    href="/dashboard/Aitrading"
                                    className="text-sm text-gray-400 hover:text-white"
                                >
                                    Back to Active Trading
                                </Link>
                            </div>

                            <div className="space-y-4">
                                {sessions.map((session) => (
                                    <Link
                                        key={session.id}
                                        href={`/dashboard/Aitrading/${session.id}`}
                                    >
                                        <div className="bg-[#1A1A1A] p-4 rounded-lg hover:bg-[#242424] transition-colors">
                                            <div className="flex justify-between items-center">
                                                <div>
                                                    <div className="font-medium">{session.bot_name}</div>
                                                    <div className="text-sm text-gray-400 flex items-center gap-2">
                                                        <Clock size={14} />
                                                        {new Date(session.end_date).toLocaleDateString()}
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <div className={`text-lg ${session.current_profit >= 0 ? "text-green-500" : "text-red-500"}`}>
                                                        {session.current_profit >= 0 ? "+" : ""}{session.current_profit}%
                                                    </div>
                                                    <div className="text-sm text-gray-400">
                                                        {session.currency} {session.initial_amount}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                ))}

                                {sessions.length === 0 && (
                                    <div className="text-center text-gray-400 py-8">
                                        No completed trading sessions found
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}