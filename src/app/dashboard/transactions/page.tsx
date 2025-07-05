"use client"

import { useEffect, useCallback } from "react"
import { Sidebar } from "@/components/dashboard/Sidebar"
import { TopBar } from "@/components/dashboard/TopBar"
import { useUserData } from "@/hooks/useUserData"
import { TransactionList } from "@/components/dashboard/TransactionList"



export default function DashboardPage() {
  const { userData, refetch } = useUserData()

  useEffect(() => {
    console.log(userData?.user)
  }, [userData])


  const handleRefetch = useCallback(async () => {
    await refetch()
  }, [refetch])



  useEffect(() => {
    const interval = setInterval(() => {
      handleRefetch();
    }, 5000)

    return () => clearInterval(interval)
  }, [])



  return (
    <div className="min-h-screen bg-[#fff] text-white pb-[5rem]">
      <div className="flex flex-col lg:flex-row">
        <Sidebar />
        <div className="flex-1 ">
          <TopBar title="Transactions" notices={userData?.notices} />
          <div className="flex flex-col lg:flex-row">
            <div className="flex-1 w-full  p-4 lg:p-8">

              <div>

                <div className="space-y-2">
                  <TransactionList transactions={userData?.transactions || []} />

                </div>
              </div>
            </div>


          </div>
        </div>
      </div>
    </div>
  )
}

