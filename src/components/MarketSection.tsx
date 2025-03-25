import Link from 'next/link'

export function MarketSection() {
    const markets = [
        { name: 'Forex', icon: '💱' },
        { name: 'Stocks', icon: '📈' },
        { name: 'Commodities', icon: '🛢️' },
        { name: 'FxOptions', icon: '🔄' },
        { name: 'Cryptocurrencies', icon: '₿' },
        { name: 'Indices', icon: '📊' },
        { name: 'ETFs', icon: '📉' },
        { name: 'Bonds', icon: '💵' },
    ]

    return (
        <div className="bg-[#fff]/50 text-black rounded-lg py-20">
            <div className="container mx-auto px-4">
                <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Trading Conditions & Charges</h2>
                <div className="grid md:grid-cols-4 gap-8 mb-12">
                    {markets.map((market) => (
                        <div key={market.name} className="bg-[#030614] text-white backdrop-blur-sm rounded-xl p-6 text-center hover:bg-black/40 transition-all">
                            <span className="text-4xl mb-4 block">{market.icon}</span>
                            <h3 className="text-xl font-semibold">{market.name}</h3>
                        </div>
                    ))}
                </div>
           
            </div>
        </div>
    )
}