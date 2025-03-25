"use client";

import { motion } from "framer-motion";
 
const features = [
    {
        title: "Flexibility",
        description: "We've worked with over 400 companies to build blockchain solutions for their business.",
        list: [
            "Blockchain solutions for their business.",
            "Crypto space with its remarkable journey",
            "Stay tuned to blockchain news"
        ],
    },
    {
        title: "Transference",
        description: "We've worked with over 400 companies to build blockchain solutions for their business.",
        subDescription: "We've worked with over 400 companies to build",
    },
    {
        title: "Secure & Safe",
        description: "We've worked with over 400 companies to build blockchain solutions for their business.",
        subDescription: "We've worked with over 400 companies to build",
    }
];

export function WhySwissApp() {
    return (
        <div className="py-20 relative overflow-hidden">
            <div className="container mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <span className="text-[#8B5CF6] mb-4 block">ABOUT {process.env.NEXT_PUBLIC_APP_NAME}</span>
                    <h2 className="text-4xl md:text-5xl font-bold mb-6">Why {process.env.NEXT_PUBLIC_APP_NAME}?</h2>
                    <p className="text-gray-400 max-w-6xl mx-auto">
                        We've worked with over 400 companies to build blockchain solutions
                        for their business, and we are still growing.
                    </p>
                </motion.div>

                <div className="grid md:grid-cols-2 gap-8">
                    {features.map((feature, index) => (
                        <motion.div
                            key={feature.title}
                            initial={{ opacity: 1,  }}
                            whileInView={{ opacity: 1, y: 0 }}
                            whileHover={{ scale: 1.02 }}
                             className={`backdrop-blur-xl bg-gradient-to-br from-[#121212]/60 to-[#121212]/40 
                            rounded-2xl p-8 relative overflow-hidden border border-gray-800/50 hover:border-[#8B5CF6]/50 
                            shadow-lg hover:shadow-[#8B5CF6]/20 transition-all duration-300
                            ${index === 2 ? "md:col-span-2" : ""}`}
                        >
                            <div className="relative z-10">
                                <h3 className="text-2xl md:text-3xl font-bold mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                                    {feature.title}
                                </h3>
                                <p className="text-gray-400 mb-6 leading-relaxed">{feature.description}</p>

                                {feature.list && (
                                    <ul className="space-y-4 mb-6">
                                        {feature.list.map((item, i) => (
                                            <motion.li 
                                                key={i} 
                                                className="flex items-center gap-3 group"
                                                whileHover={{ x: 4 }}
                                                transition={{ duration: 0.2 }}
                                            >
                                                <span className="w-2 h-2 bg-[#8B5CF6] rounded-full group-hover:scale-125 transition-transform" />
                                                <span className="text-gray-300 group-hover:text-white transition-colors">{item}</span>
                                            </motion.li>
                                        ))}
                                    </ul>
                                )}

                                {feature.subDescription && (
                                    <p className="text-gray-500 italic">{feature.subDescription}</p>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}