"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import Link from "next/link";

interface RawPackage {
    id: string;
    name: string;
    description: string;
    min_amount_usd: number;
    max_amount_usd: number;
    duration_days: number;
    min_roi: number;
    max_roi: number;
    risk_level: "low" | "medium" | "high";
    features: string[] | string;
}

interface Package extends Omit<RawPackage, 'features'> {
    features: string[];
}

export function InvestmentPackages() {
    const [investmentPackages, setInvestmentPackages] = useState<Package[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchPackages = async () => {
            try {
                const response = await fetch("/api/investments", {
                    headers: {
                    },
                })

                if (!response.ok) throw new Error("Failed to fetch investment packages")

                const data = await response.json()
                if (data.success) {
                    const transformedPackages = data.packages.map((pkg: RawPackage) => ({
                        ...pkg,
                        features: Array.isArray(pkg.features)
                            ? pkg.features
                            : typeof pkg.features === "string"
                                ? JSON.parse(pkg.features)
                                : []
                    })) as Package[]
                    setInvestmentPackages(transformedPackages)
                } else {
                    throw new Error(data.error || "Failed to fetch investment packages")
                }
            } catch (err) {
                setError(err instanceof Error ? err.message : "Failed to load packages")
            } finally {
                setLoading(false)
            }
        }

        fetchPackages();
    }, []);

    if (loading) {
        return (
            <div className="py-20 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#f7931a] mx-auto"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="py-20 text-center text-red-500">
                <p>{error}</p>
            </div>
        );
    }

    return (
        <div className="py-20">
            <div className="text-center mb-16">
                <h2 className="text-4xl font-bold mb-6">Investment Packages</h2>
                <p className="text-gray-400 max-w-2xl mx-auto">
                    Choose from our range of investment packages designed to meet your financial goals
                </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {investmentPackages.map((pkg) => (
                    <motion.div
                        key={pkg.id}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        whileHover={{ scale: 1.02 }}
                        className="backdrop-blur-xl bg-gradient-to-br from-[#121212]/60 to-[#121212]/40 
                        rounded-2xl p-8 border border-gray-800/50 hover:border-[#f7931a]/50 
                        transition-all duration-300 relative"
                    >
                        {pkg.risk_level === "low" && (
                            <div className="absolute top-4 right-4 bg-green-500/20 text-green-500 px-3 py-1 rounded-full text-sm">
                                Recommended
                            </div>
                        )}

                        <h3 className="text-2xl font-bold mb-4">{pkg.name}</h3>
                        <p className="text-gray-400 mb-6">{pkg.description}</p>

                        <div className="mb-6">
                            <div className="text-3xl font-bold text-[#f7931a] mb-2">
                                {pkg.min_roi}% - {pkg.max_roi}%
                            </div>
                            <div className="text-sm text-gray-400">
                                Expected ROI
                            </div>
                        </div>

                        <div className="space-y-4 mb-8">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-400">Min Investment</span>
                                <span className="font-medium">
                                    ${pkg.min_amount_usd.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                                </span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-400">Max Investment</span>
                                <span className="font-medium">
                                    ${pkg.max_amount_usd.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                                </span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-400">Duration</span>
                                <span className="font-medium">{pkg.duration_days} days</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-400">Risk Level</span>
                                <span className={`
                                    ${pkg.risk_level === "low" ? "text-green-500" : ""}
                                    ${pkg.risk_level === "medium" ? "text-yellow-500" : ""}
                                    ${pkg.risk_level === "high" ? "text-red-500" : ""}
                                `}>
                                    {pkg.risk_level}
                                </span>
                            </div>
                        </div>

                        <ul className="space-y-3 mb-8">
                            {pkg.features.map((feature, index) => (
                                <li key={index} className="flex items-center gap-3 text-sm">
                                    <Check className="w-5 h-5 text-[#f7931a]" />
                                    <span className="text-gray-300">{feature}</span>
                                </li>
                            ))}
                        </ul>

                        <Link href={'/dashboard/investment'} className="flex  text-center  justify-center items-center w-full bg-[#f7931a] text-white py-3 rounded-lg hover:bg-[#f7931a]/90 transition-colors">
                            Choose Plan
                        </Link>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}