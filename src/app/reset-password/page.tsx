"use client"

import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { AuthLayout } from "@/components/AuthLayout"
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

function ResetPasswordContent() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [formData, setFormData] = useState({
        otp: "",
        password: "",
        confirmPassword: ""
    })
    const [email, setEmail] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState("")
    const [message, setMessage] = useState("")

    useEffect(() => {
        const emailParam = searchParams.get('email')
        if (!emailParam) {
            router.push('/forgot-password')
            return
        }
        setEmail(emailParam)
    }, [searchParams, router])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setError("")
        setMessage("")

        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match")
            setIsLoading(false)
            return
        }

        try {
            const response = await fetch('/api/auth/reset-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: email,  
                    otp: formData.otp,
                    password: formData.password
                }),
            })

            const data = await response.json()

            if (data.success) {
                setMessage("Password reset successful!")
                setTimeout(() => router.push('/login'), 2000)
            } else {
                throw new Error(data.error || "Failed to reset password")
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : "Something went wrong")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <AuthLayout
            title="Reset your password"
            subtitle="Enter the code sent to your email and your new password"
            type="reset-password"
        >
            <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                    <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/50 text-red-500 text-sm">
                        {error}
                    </div>
                )}
                {message && (
                    <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/50 text-green-500 text-sm">
                        {message}
                    </div>
                )}

                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1.5">
                        Email address
                    </label>
                    <div className="p-2 bg-[#1A1A1A] rounded-lg text-gray-300">
                        {email}
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1.5">
                        Reset Code
                    </label>
                    <Input
                        type="number"
                        name="otp"
                        value={formData.otp}
                        onChange={handleChange}
                        placeholder="Enter the code from your email"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1.5">
                        New Password
                    </label>
                    <Input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Enter new password"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1.5">
                        Confirm New Password
                    </label>
                    <Input
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        placeholder="Confirm new password"
                        required
                    />
                </div>

                <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full mt-6"
                >
                    {isLoading ? "Resetting..." : "Reset Password"}
                </Button>
            </form>
        </AuthLayout>
    )
}

export default function ResetPassword() {
    return (
        <Suspense fallback={
            <AuthLayout
                title="Reset your password"
                subtitle="Enter the code sent to your email and your new password"
                type="reset-password"
            >
                <div className="flex items-center justify-center p-8">
                    Loading...
                </div>
            </AuthLayout>
        }>
            <ResetPasswordContent />
        </Suspense>
    )
}