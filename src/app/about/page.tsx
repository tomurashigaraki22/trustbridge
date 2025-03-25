"use client";

import { motion } from "framer-motion";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const features = [
    {
        title: "Global Trading Platform",
        description: "Access worldwide markets with our advanced trading platform, supporting traders from over 150 countries.",
        list: [
            "24/7 cryptocurrency trading",
            "Multi-currency support",
            "Real-time market data"
        ],
    },
    {
        title: "Security First",
        description: "Your security is our top priority. We implement industry-leading security measures to protect your assets.",
        list: [
            "Multi-factor authentication",
            "Cold storage for crypto assets",
            "Regular security audits"
        ],
    },
    {
        title: "Professional Support",
        description: "Our dedicated team of experts provides round-the-clock support to assist you with any trading needs.",
        list: [
            "24/7 customer support",
            "Personal account managers",
            "Educational resources"
        ],
    }
];

export default function AboutPage() {
    return (
        <>
            <Header />
            <div className="py-20 relative overflow-hidden bg-[#030614] min-h-screen">
                <div className="container mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-center mb-16"
                    >
                        <span className="text-[#8B5CF6] mb-4 block">ABOUT US</span>
                        <h1 className="text-4xl md:text-5xl font-bold mb-6">Leading The Future of Digital Trading</h1>
                        <p className="text-gray-400 max-w-4xl mx-auto">
                            Since our establishment, we've been at the forefront of digital asset trading,
                            providing innovative solutions for both retail and institutional investors.
                            Our platform combines cutting-edge technology with exceptional service to deliver
                            a superior trading experience.
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-3 gap-8 mb-16">
                        {features.map((feature) => (
                            <motion.div
                                key={feature.title}
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                whileHover={{ scale: 1.02 }}
                                className="backdrop-blur-xl bg-gradient-to-br from-[#121212]/60 to-[#121212]/40 
                                rounded-2xl p-8 relative overflow-hidden border border-gray-800/50 hover:border-[#8B5CF6]/50 
                                shadow-lg hover:shadow-[#8B5CF6]/20 transition-all duration-300"
                            >
                                <div className="relative z-10">
                                    <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                                        {feature.title}
                                    </h3>
                                    <p className="text-gray-400 mb-6">{feature.description}</p>
                                    <ul className="space-y-4">
                                        {feature.list.map((item, i) => (
                                            <motion.li
                                                key={i}
                                                className="flex items-center gap-3 group"
                                                whileHover={{ x: 4 }}
                                            >
                                                <span className="w-2 h-2 bg-[#8B5CF6] rounded-full group-hover:scale-125 transition-transform" />
                                                <span className="text-gray-300 group-hover:text-white transition-colors">{item}</span>
                                            </motion.li>
                                        ))}
                                    </ul>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        className="text-center"
                    >
                        <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
                        <p className="text-gray-400 max-w-4xl mx-auto">
                            To provide a secure, efficient, and user-friendly platform for trading digital assets,
                            while maintaining the highest standards of security and customer service. We're committed
                            to making cryptocurrency trading accessible to everyone, from beginners to professional traders.
                        </p>
                    </motion.div>
                </div>
            </div>
            <Footer />
        </>
    );
}