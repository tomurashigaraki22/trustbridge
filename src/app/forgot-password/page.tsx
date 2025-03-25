"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { AuthLayout } from "@/components/AuthLayout"
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

export default function ForgotPassword() {
    const router = useRouter()
    const [step, setStep] = useState<'email' | 'otp'>('email')
    const [email, setEmail] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [message, setMessage] = useState("")
    const [error, setError] = useState("")

    const handleEmailSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setError("")
        setMessage("")

        try {
            const response = await fetch('/api/auth/forgot-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            })

            const data = await response.json()

            if (data.success) {
                setMessage("Reset code sent successfully!")
                setStep('otp')
            } else {
                throw new Error(data.error || "Failed to process request")
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : "Something went wrong")
        } finally {
            setIsLoading(false)
        }
    }

    const handleOtpSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        router.push(`/reset-password?email=${encodeURIComponent(email)}`)
    }

    return (
        <AuthLayout
            title={step === 'email' ? "Reset your password" : "Enter reset code"}
            subtitle={
                step === 'email' 
                    ? "Enter your email to receive a password reset code"
                    : "Enter the code sent to your email"
            }
            type="forgot-password"
        >
            {step === 'email' ? (
                <form onSubmit={handleEmailSubmit} className="space-y-4">
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
                        <Input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email"
                            required
                        />
                    </div>

                    <Button
                        type="submit"
                        disabled={isLoading}
                        className="w-full mt-6"
                    >
                        {isLoading ? "Sending..." : "Send Reset Code"}
                    </Button>
                </form>
            ) : (
                <form onSubmit={handleOtpSubmit} className="space-y-4">
                    <div className="text-sm text-gray-400 mb-4">
                        We've sent a reset code to <span className="text-white">{email}</span>
                    </div>

                    <Button
                        type="submit"
                        className="w-full mt-6"
                    >
                        Continue to Reset Password
                    </Button>

                    <button
                        type="button"
                        onClick={() => setStep('email')}
                        className="w-full text-sm text-gray-400 hover:text-white"
                    >
                        Use a different email address
                    </button>
                </form>
            )}
        </AuthLayout>
    )
}