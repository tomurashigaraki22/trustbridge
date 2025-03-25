"use client";

import { useState } from "react";
import { AuthLayout } from "@/components/AuthLayout";
 import Link from "next/link";
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export default function Login() {
    const { login, isLoading } = useAuth();
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        
        try {
            await login(formData.email, formData.password);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to login');
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    return (
        <AuthLayout 
            title="Welcome back" 
            subtitle="Sign in to your account"
            type="login"
        >
            <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                    <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/50 text-red-500 text-sm">
                        {error}
                    </div>
                )}

                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1.5">
                        Email address
                    </label>
                    <Input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Enter your email"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1.5">
                        Password
                    </label>
                    <Input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Enter your password"
                        required
                    />
                </div>

                <div className="flex items-center justify-between">
                    <label className="flex items-center">
                        <input type="checkbox" className="w-4 h-4 rounded border-gray-800 text-[#8B5CF6] focus:ring-[#8B5CF6]" />
                        <span className="ml-2 text-sm text-gray-400">Remember me</span>
                    </label>
                    <Link href="/forgot-password" className="text-sm text-[#8B5CF6] hover:text-[#8B5CF6]/80">
                        Forgot password?
                    </Link>
                </div>

                <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full"
                >
                    {isLoading ? "Signing in..." : "Sign in"}
                </Button>
            </form>
        </AuthLayout>
    );
}