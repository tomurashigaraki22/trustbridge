"use client"

import { use, useCallback, useEffect } from "react"
import { Sidebar } from "@/components/dashboard/Sidebar"
import { TopBar } from "@/components/dashboard/TopBar"
import { CheckCircle, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useUserData } from "@/hooks/useUserData"

type TransactionType = "deposit" | "send" | "swap" | "p2p" | "investment" | "trading"
interface TransactionParams {
  symbol?: string;
  amount?: string;
  to?: string;
  fromSymbol?: string;
  toSymbol?: string;
  toAmount?: string;
}

const getTransactionMessage = (type: TransactionType, params: TransactionParams) => {
  switch (type) {
    case "deposit":
      return `Your ${params.symbol} deposit has been initiated`
    case "investment":
      return `Your ${params.symbol} Investment with a profit of $${params.amount} has been completed`
    case "trading":
      return `Your ${params.symbol} Trade has been closed successfully, Profits has been sent to your account`
    case "send":
      return `Successfully sent $${params.amount} in ${params.symbol} to ${params.to}`
    case "swap":
      return `Successfully swapped $ ${params.amount} from ${params.fromSymbol} to ${params.toSymbol}`
    case "p2p":
      return `P2P transfer of $ ${params.amount} in ${params.symbol} to ${params.to} completed`
    default:
      return "Transaction completed successfully"
  }
}
export default function SuccessPage({ searchParams }: {
  searchParams: Promise<{
    type: TransactionType
    symbol?: string
    amount?: string
    to?: string
    fromSymbol?: string
    toSymbol?: string
    toAmount?: string
  }>
}) {
  const params = use(searchParams)
  const { userData, refetch } = useUserData()
 
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
    <div className="min-h-screen bg-white text-white pb-[5rem]">
      <div className="flex flex-col lg:flex-row">
        <Sidebar />
        <div className="flex-1 ">
          <TopBar title="Transaction Success" notices={userData?.notices} />
          <div className="p-4 lg:p-8 max-w-6xl mx-auto">
            <div className="bg-[#121212] rounded-[1rem] p-6 text-center">
              <div className="flex justify-center mb-6">
                <div className="rounded-full bg-green-500/20 p-4">
                  <CheckCircle size={48} className="text-green-500" />
                </div>
              </div>

              <h2 className="text-2xl font-bold mb-2">Success!</h2>
              <p className="text-gray-400 mb-8">
                {getTransactionMessage(params.type, params)}
              </p>

              <div className="space-y-4">
                <Link
                  href="/dashboard/portfolio"
                  className="block w-full bg-orange-500 hover:bg-orange-600 py-3 rounded-lg font-medium transition-colors"
                >
                  View Portfolio
                </Link>
                <Link
                  href="/dashboard"
                  className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
                >
                  <ArrowLeft size={20} />
                  Back to Dashboard
                </Link>
              </div>

              {params.type === "deposit" && (
                <div className="mt-8 bg-[#1A1A1A] rounded-lg p-4 text-left">
                  <p className="text-sm text-gray-400">
                    Note: Your deposit will be credited to your account after network confirmation.
                    This usually takes 10-30 minutes depending on network congestion.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}