'use client';

import { useState, useEffect, useCallback } from "react"
import { useUserData } from "@/hooks/useUserData"
import { useRouter } from 'next/navigation';
import { AuthLayout } from "@/components/AuthLayout";
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import Cookies from "js-cookie"
import { useAuth } from '@/context/AuthContext';

export default function OTPPage() {
    const [otp, setOtp] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [resendLoading, setResendLoading] = useState(false);
    const { userData, refetch } = useUserData();
   
    const handleRefetch = useCallback(async () => {
        await refetch()
    }, [refetch])

    const generateAndSendOTP = async () => {
        try {
            setResendLoading(true);
            const response = await fetch('/api/auth/generate-otp', {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${Cookies.get("auth-token")}`,
                },
            });

            const data = await response.json();

            if (response.ok) {
                window.dispatchEvent(new CustomEvent('showNotification', {
                    detail: {
                        message: 'OTP sent to your email',
                        type: 'success'
                    }
                }));
            } else {
                throw new Error(data.error || 'Failed to send OTP');
            }
        } catch (error) {
            window.dispatchEvent(new CustomEvent('showNotification', {
                detail: {
                    message: error instanceof Error ? error.message : 'Failed to send OTP',
                    type: 'error'
                }
            }));
        } finally {
            setResendLoading(false);
        }
    };

    useEffect(() => {
        if(userData?.user && !userData.user.otp_code) {
            generateAndSendOTP();
        }
    }, [userData?.user]);

     

    useEffect(() => {
        const interval = setInterval(() => {
            handleRefetch()
        }, 5000)

        return () => clearInterval(interval)
    }, [handleRefetch])

    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const response = await fetch('/api/auth/verify-otp', {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${Cookies.get("auth-token")}`,
                },
                body: JSON.stringify({ otp }),
            });

            const data = await response.json();

            if (response.ok) {
                router.push('/dashboard');
            } else {
                setError(data.error || 'Invalid OTP');
            }
        } catch (error) {
            setError('Failed to verify OTP');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AuthLayout title="OTP Verification" subtitle="Enter the OTP code sent to your email" type="otp">
            <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                    <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/50 text-red-500 text-sm">
                        {error}
                    </div>
                )}

                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1.5">
                        OTP Code
                    </label>
                    <Input
                        type="text"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        placeholder="Enter OTP code"
                        required
                        maxLength={6}
                    />
                </div>

                <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full"
                >
                    {isLoading ? 'Verifying...' : 'Verify OTP'}
                </Button>

                <Button
                    type="button"
                    variant="outline"
                    onClick={generateAndSendOTP}
                    disabled={resendLoading}
                    className="w-full mt-2"
                >
                    {resendLoading ? 'Sending...' : 'Resend OTP'}
                </Button>
            </form>
        </AuthLayout>
    );
}