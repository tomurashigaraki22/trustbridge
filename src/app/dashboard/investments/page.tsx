"use client"

import { useState, useEffect } from "react"
import { Sidebar } from "@/components/dashboard/Sidebar"
import { TopBar } from "@/components/dashboard/TopBar"
import { InvestmentList } from "@/components/dashboard/InvestmentList"
import Cookies from "js-cookie"
import { useUserData } from "@/hooks/useUserData"

export default function InvestmentsPage() {
    const [investments, setInvestments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { userData } = useUserData()

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
                setError(err instanceof Error ? err.message : "Failed to load investments");
            } finally {
                setLoading(false);
            }
        };

        fetchInvestments();
    }, []);

    return (
        <div className="min-h-screen bg-[#0A0E1C] text-white pb-[5rem]">
            <div className="flex flex-col lg:flex-row">
                <Sidebar />
                <div className="flex-1 ">
                    <TopBar title="All Investments"  notices={userData?.notices} />
                    <div className="p-4 lg:p-8">
                        {loading ? (
                            <div className="text-center py-8">Loading investments...</div>
                        ) : error ? (
                            <div className="text-center text-red-500 py-8">{error}</div>
                        ) : (
                            <InvestmentList investments={investments} />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}