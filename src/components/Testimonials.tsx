"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";

const testimonials = [
    {
        id: 1,
        name: "Robert Fox",
        role: "Investor",
        image: "https://avatar.iran.liara.run/public",
        content: "I've tested numerous wallet apps, but this one is leaps and bounds ahead of the competition. It's phenomenal.",
        rating: 5
    },
    {
        id: 2,
        name: "Jenny Wilson",
        role: "Crypto Enthusiast",
        image: "https://avatar.iran.liara.run/public",
        content: "This crypto wallet app is incredibly user-friendly and secure. Managing my cryptocurrencies has never been easier!",
        rating: 5
    },
    {
        id: 3,
        name: "Alex Morgan",
        role: "Day Trader",
        image: "https://avatar.iran.liara.run/public",
        content: "The real-time tracking and security features are outstanding. Best crypto platform I've used so far.",
        rating: 5
    }
];

export function Testimonials() {
    const [currentIndex, setCurrentIndex] = useState(0);

    const handleNext = () => {
        setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    };

    const handlePrev = () => {
        setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    };

    return (
        <div className="py-20 md:bg-black/30 rounded-[1rem] relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute top-40 right-20 w-72 h-72 bg-[#8B5CF6]/20 rounded-full blur-[120px]" />
            <div className="absolute bottom-40 left-20 w-72 h-72 bg-[#8B5CF6]/10 rounded-full blur-[120px]" />

            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-[#8B5CF6] mb-4">TESTIMONIAL</h2>
                    <h3 className="text-4xl md:text-5xl font-bold">
                        Over 400 companies have already<br />Tried Blockchain
                    </h3>
                </div>

                <div className="max-w-5xl mx-auto relative">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentIndex}
                            initial={{ opacity: 0, x: 100 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -100 }}
                            transition={{ duration: 0.5 }}
                            className="backdrop-blur-xl bg-[#2a2a2a]/30 p-8 md:p-12 rounded-2xl"
                        >
                            <div className="grid md:grid-cols-2 gap-8">
                                {[0, 1].map((offset) => {
                                    const testimonial = testimonials[(currentIndex + offset) % testimonials.length];
                                    return (
                                        <div key={testimonial.id} className="relative">
                                            <div className="flex items-center gap-4 mb-6">
                                                <img
                                                    src={testimonial.image}
                                                    alt={testimonial.name}
                                                    className="w-12 h-12 rounded-full"
                                                />
                                                <div>
                                                    <h4 className="font-bold">{testimonial.name}</h4>
                                                    <p className="text-sm text-gray-400">{testimonial.role}</p>
                                                </div>
                                                <div className="ml-auto flex">
                                                    {[...Array(testimonial.rating)].map((_, i) => (
                                                        <Star key={i} size={16} className="text-yellow-500 fill-yellow-500" />
                                                    ))}
                                                </div>
                                            </div>
                                            <p className="text-lg text-gray-300">{testimonial.content}</p>
                                        </div>
                                    );
                                })}
                            </div>
                        </motion.div>
                    </AnimatePresence>

                    <button
                        onClick={handlePrev}
                        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-6 w-12 h-12 bg-[#8B5CF6] rounded-full flex items-center justify-center transform transition-transform hover:scale-110"
                    >
                        <ChevronLeft className="w-6 h-6" />
                    </button>
                    <button
                        onClick={handleNext}
                        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-6 w-12 h-12 bg-[#8B5CF6] rounded-full flex items-center justify-center transform transition-transform hover:scale-110"
                    >
                        <ChevronRight className="w-6 h-6" />
                    </button>
                </div>
            </div>
        </div>
    );
}