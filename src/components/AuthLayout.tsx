"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Logo from "./ui/Logo";
import { useAuth } from "@/context/AuthContext";

interface AuthLayoutProps {
    children: React.ReactNode;
    title: string;
    subtitle: string;
    type: "login" | "register" | "reset-password" | "forgot-password" | "otp";
}

export function AuthLayout({ children, title, subtitle, type }: AuthLayoutProps) {
    const { logout } = useAuth();

    return (
        <div className="min-h-screen bg-white flex items-center justify-center p-4 relative">
            {/* Light accent gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#8B5CF6]/10 via-transparent to-transparent" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-2xl z-10"
            >
                <div className="bg-white rounded-2xl p-8 md:p-12 shadow-xl border border-gray-200">
                    <div className="mb-8 text-center">
                        <Link href="/" className="inline-block mb-6">
                            <Logo />
                        </Link>
                        <h1 className="text-2xl font-bold mb-2 text-gray-900">
                            {title}
                        </h1>
                        <p className="text-gray-500">{subtitle}</p>
                    </div>

                    {children}

                    <div className="mt-6 text-center text-sm text-gray-500">
                        {type === "login" ? (
                            <>
                                Don't have an account?{" "}
                                <Link
                                    href="/register"
                                    className="text-[#8B5CF6] hover:text-[#8B5CF6]/80 font-medium"
                                >
                                    Sign up
                                </Link>
                            </>
                        ) : type === "otp" ? (
                            <button
                                onClick={logout}
                                className="text-[#8B5CF6] hover:text-[#8B5CF6]/80 font-medium"
                            >
                                Logout
                            </button>
                        ) : (
                            <>
                                Already have an account?{" "}
                                <Link
                                    href="/login"
                                    className="text-[#8B5CF6] hover:text-[#8B5CF6]/80 font-medium"
                                >
                                    Sign in
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
