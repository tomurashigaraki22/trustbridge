"use client"

import { useState, useEffect, useCallback } from "react"
import { Sidebar } from "@/components/dashboard/Sidebar"
import { TopBar } from "@/components/dashboard/TopBar"
import { useUserData } from "@/hooks/useUserData"
import { useAuth } from "@/context/AuthContext"
import { NotificationModal } from "@/components/notifications/NotificationModal"


interface Notice {
    id: number;
    title: string;
    message: string;
    created_at: string;
    is_read: boolean;
    type: string;

}

export default function NotificationsPage() {
    const { userData, refetch } = useUserData()
    const { markNoticesAsRead } = useAuth()
    const [selectedNotice, setSelectedNotice] = useState<Notice | null>(null)

    const handleRefetch = useCallback(async () => {
        await refetch()
    }, [refetch])

    useEffect(() => {
        const interval = setInterval(() => {
            handleRefetch()
        }, 5000)

        return () => clearInterval(interval)
    }, [handleRefetch])

    const handleNoticeClick = (notice: Notice) => {
        setSelectedNotice(notice)
        if (!notice.is_read) {
            markNoticesAsRead([notice.id])
        }
    }

    return (
        <div className="min-h-screen bg-[#111111] text-white">
            <div className="flex flex-col lg:flex-row">
                <Sidebar />
                <div className="flex-1 ">
                    <TopBar title="Notifications" notices={userData?.notices} />
                    <div className="p-4 lg:p-8">
                        <div className="bg-[#121212] rounded-[1rem] p-6">
                            <div className="space-y-4">
                                {userData?.notices && userData.notices.length > 0 ? (
                                    userData.notices.map((notice) => (
                                        <div
                                            key={notice.id}
                                            onClick={() => handleNoticeClick(notice)}
                                            className={`p-4 rounded-lg cursor-pointer transition-colors ${!notice.is_read
                                                ? 'bg-purple-500/10 hover:bg-purple-500/20'
                                                : 'bg-[#1A1A1A] hover:bg-[#242424]'
                                                }`}
                                        >
                                            <div className="flex items-start gap-3">
                                                <div className={`mt-1 w-2 h-2 rounded-full ${!notice.is_read ? 'bg-purple-500' : 'bg-gray-500'
                                                    }`} />
                                                <div className="flex-1">
                                                    <div className="flex justify-between items-start">
                                                        <div className="font-medium">{notice.title}</div>
                                                        <div className="text-xs text-gray-500">
                                                            {new Date(notice.created_at).toLocaleString()}
                                                        </div>
                                                    </div>
                                                    <p className="text-gray-400 mt-1">{notice.message}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center text-gray-400 py-8">
                                        No notifications
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <NotificationModal
                notice={selectedNotice}
                onClose={() => setSelectedNotice(null)}
            />
        </div>
    )
}