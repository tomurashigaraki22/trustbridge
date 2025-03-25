"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

interface DepositNotification {
    country: string;
    amount: number;
    action: string;
}

export function Snackbar() {
    const [notification, setNotification] = useState<DepositNotification | null>(null);
    const [show, setShow] = useState(false);

    const countries = ["USA", "UK", "Canada", "Australia", "Germany", "France", "Japan", "China", "India", "Turkey", "Maurice", "Sudan", "Macedonia", "Tunisia", "Sierra Leone", "Guernsey", "Armenia"];
    
    const actions = [
        "just deposited",
        "just withdrew",
        "just invested",
        "just closed a trade of"
    ];

    useEffect(() => {
        const showNotification = () => {
            const randomCountry = countries[Math.floor(Math.random() * countries.length)];
            const randomAmount = Math.floor(Math.random() * (1000000 - 10000 + 1)) + 10000;
            const randomAction = actions[Math.floor(Math.random() * actions.length)];

            setNotification({ 
                country: randomCountry, 
                amount: randomAmount,
                action: randomAction 
            });
            setShow(true);

            setTimeout(() => {
                setShow(false);
            }, 3000);
        };

        const interval = setInterval(showNotification, 5000);
        return () => clearInterval(interval);
    }, []);

    return (
        <AnimatePresence>
            {show && notification && (
                <motion.div
                    initial={{ opacity: 0, y: 50, x: "100%" }}
                    animate={{ opacity: 1, y: 0, x: 0 }}
                    exit={{ opacity: 0, y: 50, x: "100%" }}
                    transition={{ type: "spring", stiffness: 200, damping: 20 }}
                    className="fixed bottom-0 right-0 md:bottom-4 md:right-4 bg-gradient-to-r from-[#8B5CF6] to-purple-700 
                             text-white px-6 py-[1rem] md:py-3 md:rounded-lg shadow-lg z-50 flex items-center gap-3
                             w-full md:w-auto"
                >
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                    <p className="text-lg font-bold md:text-sm md:font-medium">
                        Someone in {notification.country} {notification.action} ${notification.amount.toLocaleString()}.00
                    </p>
                </motion.div>
            )}
        </AnimatePresence>
    );
}