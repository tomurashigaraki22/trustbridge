"use client"

import { useState } from "react"
import { Sidebar } from "@/components/dashboard/Sidebar"
import { TopBar } from "@/components/dashboard/TopBar"
import { AccountDetails } from "@/components/profile/AccountDetails"
import { SecuritySettings } from "@/components/profile/SecuritySettings"
import { useUserData } from "@/hooks/useUserData"

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("account")
  const { userData } = useUserData()

  const tabs = [
    { id: "account", label: "Account Details" },
    { id: "security", label: "Security" },
  ]

  return (
    <div className="min-h-screen bg-[#111111] text-white pb-[5rem]">
      <div className="flex flex-col lg:flex-row">
        <Sidebar />
        <div className="flex-1 ">
          <TopBar title="Profile Settings" notices={userData?.notices} />
          <div className="p-4 lg:p-8">
            <div className="mb-6">
              <div className="border-b border-gray-800">
                <nav className="-mb-px flex space-x-8">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`
                                                py-4 px-1 border-b-2 font-medium text-sm
                                                ${activeTab === tab.id
                          ? "border-orange-500 text-orange-500"
                          : "border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300"
                        }
                                            `}
                    >
                      {tab.label}
                    </button>
                  ))}
                </nav>
              </div>
            </div>

            <div className="mt-6">
              {activeTab === "account" && <AccountDetails userData={userData} />}
              {activeTab === "security" && <SecuritySettings />}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}