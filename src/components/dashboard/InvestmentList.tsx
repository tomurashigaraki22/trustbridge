import { useState } from 'react';
import Cookies from "js-cookie"
import { useRouter } from 'next/navigation';

interface UserInvestment {
    id: number;
    package_name: string;
    amount_usd: number;
    currency: string;
    start_date: string;
    end_date: string;
    daily_roi: string;  
    auto_compound: boolean;
    duration_days: number;
    min_roi: number;
    max_roi: number;
    status: 'active' | 'completed' | 'cancelled';
}

interface InvestmentListProps {
    investments: UserInvestment[];
    limit?: number;
}

export function InvestmentList({ investments, limit }: InvestmentListProps) {
    const [selectedInvestment, setSelectedInvestment] = useState<UserInvestment | null>(null);
    const displayedInvestments = limit ? investments.slice(0, limit) : investments;
    const [mypackage, setPackage] = useState('');
    const [profit, setProfit] = useState<number>(0);


 
    const router = useRouter();
    const handleClaimProfit = async (investmentId: number) => {
        try {
            const token = Cookies.get("auth-token");
            const response = await fetch('/api/investments/claim', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ investmentId }),
            });

            if (!response.ok) {
                throw new Error('Failed to claim profit');
            }

            router.push(
                `/dashboard/transactions/success?amount=${profit}&symbol=${mypackage}&type=investment`,
            )
        } catch (error) {
            console.error('Failed to claim profit:', error);
        }
    };
    return (
        <>
            <div className="space-y-4">
                {displayedInvestments.map((investment) => {


                    const currentDate = new Date();
                    const startDate = new Date(investment.start_date);
                    const daysPassed = Math.floor((currentDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
                    const dailyRoi = JSON.parse(investment.daily_roi);
                    const currentStage = daysPassed < dailyRoi.length ?
                        `+${(dailyRoi[daysPassed])}%` :
                        'Click to Claim';
                    const initialAmount = investment.amount_usd;


                    let totalAccumulatedAmount = Number(initialAmount);

                    for (let i = 0; i <= daysPassed && i < dailyRoi.length; i++) {
                        const dailyReturn = Number(dailyRoi[i]);
                        totalAccumulatedAmount = totalAccumulatedAmount + ((totalAccumulatedAmount * dailyReturn) / 100);
                    }


                    return (
                        <div
                        key={investment.id}
                        className="bg-white rounded-xl p-5 shadow-sm group cursor-pointer transition-colors duration-300 hover:bg-gray-900"
                        onClick={() => {
                            setSelectedInvestment(investment);
                            setPackage(investment?.package_name);
                            setProfit(parseFloat(totalAccumulatedAmount.toFixed(2)));
                        }}
                        >
                        <div className="flex justify-between items-start mb-3">
                            <div>
                            <h3 className="text-lg font-semibold text-black group-hover:text-white capitalize">
                                {investment.package_name}
                            </h3>
                            <p className="text-sm text-gray-600 group-hover:text-gray-200">
                                ${investment.amount_usd.toLocaleString()} <span className="uppercase">({investment.currency})</span>
                            </p>
                            </div>
                            <span
                            className={`text-sm font-medium ${
                                investment.status === 'completed'
                                ? 'text-green-500'
                                : investment.status === 'cancelled'
                                ? 'text-red-500'
                                : 'text-yellow-500'
                            }`}
                            >
                            {investment.status === 'completed'
                                ? 'Claimed'
                                : investment.status === 'cancelled'
                                ? 'Cancelled'
                                : currentStage}
                            </span>
                        </div>

                        <div className="flex gap-6 text-sm text-gray-600 group-hover:text-gray-200">
                            <div>
                            <span className="font-medium">Start:</span>{' '}
                            {new Date(investment.start_date).toLocaleDateString()}
                            </div>
                            <div>
                            <span className="font-medium">End:</span>{' '}
                            {new Date(investment.end_date).toLocaleDateString()}
                            </div>
                        </div>
                        </div>

                    )
                }
                )}
            </div>

            {/* Investment Details Modal */}
            {selectedInvestment && (() => {
                const currentDate = new Date();
                const startDate = new Date(selectedInvestment.start_date);
                const daysPassed = Math.floor((currentDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
                const dailyRoi = JSON.parse(selectedInvestment.daily_roi);
                let cumulativePercentage = 0;
                const initialAmount = selectedInvestment.amount_usd;

                for (let i = 0; i <= daysPassed && i < dailyRoi.length; i++) {
                    cumulativePercentage += dailyRoi[i] * (i + 1);
                }

                let totalAccumulatedAmount = Number(initialAmount);

                for (let i = 0; i <= daysPassed && i < dailyRoi.length; i++) {
                    const dailyReturn = Number(dailyRoi[i]);
                    totalAccumulatedAmount = totalAccumulatedAmount + ((totalAccumulatedAmount * dailyReturn) / 100);
                }
                const formattedAmount = totalAccumulatedAmount.toLocaleString('en-US', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                });
                const todayPercentage = (cumulativePercentage);

                return (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
                        <div className="bg-[#121212] rounded-[1rem] p-6 max-w-md w-full mx-4">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-xl font-semibold">{selectedInvestment.package_name}</h3>
                                <button
                                    onClick={() => setSelectedInvestment(null)}
                                    className="text-black hover:text-black"
                                >
                                    ✕
                                </button>
                            </div>
                            <div className="space-y-4">
                                <div className="flex justify-between">
                                    <span className="text-black">Amount</span>
                                    <span>${selectedInvestment.amount_usd.toLocaleString()} -  {selectedInvestment.currency}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-black">Accumulative Profit</span>
                                    <span>{todayPercentage} %</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-black">Current Value</span>
                                    <span>${formattedAmount}</span>
                                </div>

                                <div className="flex justify-between">
                                    <span className="text-black">Duration</span>
                                    <span>{selectedInvestment.duration_days} days</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-black">ROI Range</span>
                                    <span className="text-green-500">{selectedInvestment.min_roi}% - {selectedInvestment.max_roi}%</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-black">Auto-compound</span>
                                    <span>{selectedInvestment.auto_compound ? 'Yes' : 'No'}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-black">Start Date</span>
                                    <span>{new Date(selectedInvestment.start_date).toLocaleDateString()}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-black">End Date</span>
                                    <span>{new Date(selectedInvestment.end_date).toLocaleDateString()}</span>
                                </div>
                                {selectedInvestment.status !== 'completed' && daysPassed >= dailyRoi.length && (
                                    <button
                                        onClick={() => handleClaimProfit(selectedInvestment.id)}
                                        className="w-full bg-green-500 hover:bg-green-600 text-black py-2 rounded-lg mt-4"
                                    >
                                        Claim Profit
                                    </button>
                                )
                                }

                                {
                                    selectedInvestment.status === 'completed' && (
                                        <div className="w-full text-center bg-gray-700 text-black py-2 rounded-lg mt-4">
                                            Investment Completed
                                        </div>
                                    )
                                }
                            </div>
                        </div>
                    </div>
                );
            })()}
        </>
    );
}