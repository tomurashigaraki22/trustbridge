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

    const todayPercentage = cumulativePercentage;

    return (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center">
            <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 max-w-md w-full mx-4 relative">
                <button
                    onClick={() => setSelectedInvestment(null)}
                    className="absolute top-4 right-4 text-gray-500 hover:text-red-500 transition-colors text-lg font-bold"
                >
                    &times;
                </button>

                <h3 className="text-2xl font-semibold text-gray-800 mb-6">
                    {selectedInvestment.package_name}
                </h3>

                <div className="space-y-4 text-sm text-gray-700">
                    <div className="flex justify-between">
                        <span>Amount</span>
                        <span className="font-medium">${selectedInvestment.amount_usd.toLocaleString()} - {selectedInvestment.currency}</span>
                    </div>

                    <div className="flex justify-between">
                        <span>Accumulative Profit</span>
                        <span className="font-medium">{todayPercentage.toFixed(2)}%</span>
                    </div>

                    <div className="flex justify-between">
                        <span>Current Value</span>
                        <span className="font-medium">${formattedAmount}</span>
                    </div>

                    <div className="flex justify-between">
                        <span>Duration</span>
                        <span>{selectedInvestment.duration_days} days</span>
                    </div>

                    <div className="flex justify-between">
                        <span>ROI Range</span>
                        <span className="text-green-600 font-medium">
                            {selectedInvestment.min_roi}% - {selectedInvestment.max_roi}%
                        </span>
                    </div>

                    <div className="flex justify-between">
                        <span>Auto-compound</span>
                        <span>{selectedInvestment.auto_compound ? 'Yes' : 'No'}</span>
                    </div>

                    <div className="flex justify-between">
                        <span>Start Date</span>
                        <span>{new Date(selectedInvestment.start_date).toLocaleDateString()}</span>
                    </div>

                    <div className="flex justify-between">
                        <span>End Date</span>
                        <span>{new Date(selectedInvestment.end_date).toLocaleDateString()}</span>
                    </div>
                </div>

                {selectedInvestment.status !== 'completed' && daysPassed >= dailyRoi.length && (
                    <button
                        onClick={() => handleClaimProfit(selectedInvestment.id)}
                        className="mt-6 w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition-colors"
                    >
                        Claim Profit
                    </button>
                )}

                {selectedInvestment.status === 'completed' && (
                    <div className="mt-6 w-full text-center bg-gray-100 text-gray-600 font-medium py-3 rounded-lg">
                        Investment Completed
                    </div>
                )}
            </div>
        </div>
    );
})()}

        </>
    );
}