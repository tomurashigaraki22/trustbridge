"use client";

import { motion } from "framer-motion";
import { notFound } from 'next/navigation';
import { use } from 'react';
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const tradingData = {
    conditions: {
        title: "Trading Conditions",
        description: "Experience premium trading conditions with competitive spreads, fast execution, and no hidden fees.",
        features: [
            "Spreads from 0.0 pips",
            "Commission-free trading",
            "Ultra-fast execution",
            "Leverage up to 1:500",
            "No requotes",
            "Negative balance protection"
        ],
        additionalInfo: [
            {
                title: "Competitive Spreads",
                description: "Trade with some of the lowest spreads in the industry, starting from 0.0 pips"
            },
            {
                title: "Fast Execution",
                description: "Advanced technology ensuring lightning-fast trade execution with no delays"
            },
            {
                title: "No Hidden Fees",
                description: "Transparent fee structure with no hidden charges or unexpected costs"
            }
        ]
    },
    platforms: {
        title: "Trading Platforms",
        description: "Access the markets through our advanced trading platforms, designed for both desktop and mobile trading.",
        features: [
            "Web Trading Platform",
            "Mobile Trading App",
            "MetaTrader 4 & 5",
            "Multi-device sync",
            "Advanced charting",
            "Trading automation"
        ],
        additionalInfo: [
            {
                title: "Web Platform",
                description: "Trade directly from your browser with our advanced web-based platform"
            },
            {
                title: "Mobile Trading",
                description: "Trade on-the-go with our powerful mobile trading application"
            },
            {
                title: "Desktop Solutions",
                description: "Professional trading platforms for advanced traders"
            }
        ]
    },
    accounts: {
        title: "Account Types",
        description: "Choose from our range of trading accounts designed to meet different trading needs and experience levels.",
        features: [
            "Standard Account",
            "Premium Account",
            "Professional Account",
            "Islamic Account",
            "Demo Account",
            "Institutional Solutions"
        ],
        additionalInfo: [
            {
                title: "Standard Account",
                description: "Perfect for beginners with low minimum deposit and standard features"
            },
            {
                title: "Premium Account",
                description: "Enhanced features with tighter spreads and dedicated support"
            },
            {
                title: "Professional Account",
                description: "Institutional-grade trading conditions for professional traders"
            }
        ]
    },
    safety: {
        title: "Safety of Funds",
        description: "Your security is our top priority. We implement industry-leading security measures to protect your funds and personal information.",
        features: [
            "Segregated client funds",
            "Top-tier bank partners",
            "Regular audits",
            "Advanced encryption",
            "Two-factor authentication",
            "24/7 fraud monitoring"
        ],
        additionalInfo: [
            {
                title: "Fund Security",
                description: "Client funds are held in segregated accounts at top-tier banks"
            },
            {
                title: "Data Protection",
                description: "State-of-the-art encryption protecting your personal information"
            },
            {
                title: "Regulatory Compliance",
                description: "Operating under strict regulatory guidelines and regular audits"
            }
        ]
    }
};

export default function TradingPage({ params }: { params: Promise<{ type: string }> }) {
    const resolvedParams = use(params);
    
    if (!tradingData[resolvedParams.type as keyof typeof tradingData]) {
        notFound();
    }

    const data = tradingData[resolvedParams.type as keyof typeof tradingData];

    return (
        <>
            <Header />
            <div className="py-20 relative overflow-hidden bg-[#030614] min-h-screen">
                <div className="container mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center mb-16"
                    >
                        <h1 className="text-4xl md:text-5xl font-bold mb-6">{data.title}</h1>
                        <p className="text-gray-400 max-w-4xl mx-auto text-lg">
                            {data.description}
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-2 gap-8">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="backdrop-blur-xl bg-gradient-to-br from-[#121212]/60 to-[#121212]/40 
                            rounded-2xl p-8 border border-gray-800/50"
                        >
                            <h2 className="text-2xl font-bold mb-6">Key Features</h2>
                            <ul className="space-y-4">
                                {data.features.map((feature, index) => (
                                    <motion.li
                                        key={index}
                                        className="flex items-center gap-3"
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                    >
                                        <span className="w-2 h-2 bg-[#8B5CF6] rounded-full" />
                                        <span className="text-gray-300">{feature}</span>
                                    </motion.li>
                                ))}
                            </ul>
                        </motion.div>

                        <div className="space-y-8">
                            {data.additionalInfo.map((info, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.2 }}
                                    className="backdrop-blur-xl bg-gradient-to-br from-[#121212]/60 to-[#121212]/40 
                                    rounded-2xl p-6 border border-gray-800/50"
                                >
                                    <h3 className="text-xl font-bold mb-3">{info.title}</h3>
                                    <p className="text-gray-400">{info.description}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}