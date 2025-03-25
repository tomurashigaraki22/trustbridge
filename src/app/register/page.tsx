"use client";

import { useState,  useRef } from "react";
import { AuthLayout } from "@/components/AuthLayout";
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import countriesData from '@/data/countries.json';

export default function Register() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const { signup, isLoading } = useAuth();
    const [error, setError] = useState('');
    const [verificationCode, setVerificationCode] = useState('');
    const [generatedCode, setGeneratedCode] = useState('');
    const [showVerification, setShowVerification] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        first_name: '',
        last_name: '',
        phone_number: '',
        country: ''
    });

    // Generate random verification code
    const generateVerificationCode = () => {
        console.log('genrated')
        const code = Math.random().toString(36).substring(2, 8).toUpperCase();
        setGeneratedCode(code);
        setShowVerification(true);

        // Draw the code on canvas
        if (canvasRef.current) {
            const canvas = canvasRef.current;
            const ctx = canvas.getContext('2d');
            if (ctx) {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.fillStyle = '#1A1A1A';
                ctx.fillRect(0, 0, canvas.width, canvas.height);

                // Add noise
                for (let i = 0; i < 50; i++) {
                    ctx.fillStyle = `rgba(139, 92, 246, ${Math.random() * 0.5})`;
                    ctx.fillRect(
                        Math.random() * canvas.width,
                        Math.random() * canvas.height,
                        2,
                        2
                    );
                }

                // Draw text
                ctx.font = 'bold 24px monospace';
                ctx.fillStyle = '#8B5CF6';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';

                // Draw each character with slight rotation
                const chars = code.split('');
                chars.forEach((char, i) => {
                    const x = canvas.width / 2 - ((chars.length - 1) * 15) + (i * 30);
                    const y = canvas.height / 2;
                    ctx.save();
                    ctx.translate(x, y);
                    ctx.rotate((Math.random() - 0.5) * 0.5);
                    ctx.fillText(char, 0, 0);
                    ctx.restore();
                });

                // Add lines
                ctx.strokeStyle = 'rgba(139, 92, 246, 0.3)';
                ctx.lineWidth = 1;
                for (let i = 0; i < 3; i++) {
                    ctx.beginPath();
                    ctx.moveTo(0, Math.random() * canvas.height);
                    ctx.bezierCurveTo(
                        canvas.width / 3, Math.random() * canvas.height,
                        canvas.width * 2 / 3, Math.random() * canvas.height,
                        canvas.width, Math.random() * canvas.height
                    );
                    ctx.stroke();
                }
            }
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!showVerification) {
            setShowVerification(true);
            setTimeout(() => {
                generateVerificationCode();
            }, 0);
            return;
        }

        if (verificationCode !== generatedCode) {
            setError('Invalid verification code');
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        try {
            await signup(
                formData.email,
                formData.password,
                formData.first_name,
                formData.last_name,
                formData.phone_number,
                formData.country
            );
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to create account');
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
        <AuthLayout title="Create your account" subtitle="Start your crypto journey today" type="register">
            <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                    <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/50 text-red-500 text-sm">
                        {error}
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1.5">
                            First Name
                        </label>
                        <Input
                            type="text"
                            name="first_name"
                            value={formData.first_name}
                            onChange={handleChange}
                            placeholder="Enter your first name"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1.5">
                            Last Name
                        </label>
                        <Input
                            type="text"
                            name="last_name"
                            value={formData.last_name}
                            onChange={handleChange}
                            placeholder="Enter your last name"
                            required
                        />
                    </div>
                </div>

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
                        Phone Number
                    </label>
                    <Input
                        type="tel"
                        name="phone_number"
                        value={formData.phone_number}
                        onChange={handleChange}
                        placeholder="Enter your phone number"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1.5">
                        Country
                    </label>
                    <select
                        name="country"
                        value={formData.country}
                        onChange={(e) => handleChange(e as any)}
                        className="w-full bg-[#1A1A1A] text-white rounded-lg p-3 border border-gray-800 focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                        required
                    >
                        <option value="">Select your country</option>
                        {countriesData.countries.map((country) => (
                            <option key={country.code} value={country.name}>
                                {country.name}
                            </option>
                        ))}
                    </select>
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
                        placeholder="Create a password"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1.5">
                        Confirm Password
                    </label>
                    <Input
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        placeholder="Confirm your password"
                        required
                    />
                </div>

                {showVerification && (
                    <div className="space-y-4">
                        <div className="p-4 bg-purple-500/10 border border-purple-500/50 rounded-lg text-center">
                            <canvas
                                ref={canvasRef}
                                width="200"
                                height="80"
                                className="mx-auto mb-2"
                            />
                            <p className="text-sm text-gray-400">
                                Please enter the code shown above to verify you're human
                            </p>
                            <button
                                type="button"
                                onClick={generateVerificationCode}
                                className="text-sm text-purple-500 hover:text-purple-400 mt-2"
                            >
                                Generate new code
                            </button>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1.5">
                                Verification Code
                            </label>
                            <Input
                                type="text"
                                value={verificationCode}
                                onChange={(e) => setVerificationCode(e.target.value.toUpperCase())}
                                placeholder="Enter the code shown above"
                                required
                            />
                        </div>
                    </div>
                )}

                <div className="mt-2">
                    <label className="flex items-center">
                        <input
                            type="checkbox"
                            required
                            className="w-4 h-4 rounded border-gray-800 text-[#8B5CF6] focus:ring-[#8B5CF6]"
                        />
                        <span className="ml-2 text-sm text-gray-400">
                            I agree to the{" "}
                            <a href="/terms" className="text-[#8B5CF6] hover:text-[#8B5CF6]/80">
                                Terms of Service
                            </a>
                            {" "}and{" "}
                            <a href="/privacy" className="text-[#8B5CF6] hover:text-[#8B5CF6]/80">
                                Privacy Policy
                            </a>
                        </span>
                    </label>
                </div>

                <Button
                    type="submit"
                    disabled={isLoading}

                    className="w-full mt-6"
                >
                    {!showVerification
                        ? "Continue"
                        : isLoading
                            ? "Creating account..."
                            : "Create account"
                    }
                </Button>
            </form>
        </AuthLayout>
    );
}