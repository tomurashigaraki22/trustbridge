"use client"

import { useState } from "react"
import Cookies from "js-cookie"

export function SecuritySettings() {
    const [isLoading, setIsLoading] = useState(false)
    const [message, setMessage] = useState("")
    const [formData, setFormData] = useState({
        current_password: "",
        new_password: "",
        confirm_password: "",
    })

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setMessage("")

        if (formData.new_password !== formData.confirm_password) {
            setMessage("New passwords do not match")
            setIsLoading(false)
            return
        }

        try {
            const token = Cookies.get("auth-token")
            const response = await fetch("/api/user/password", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    current_password: formData.current_password,
                    new_password: formData.new_password,
                }),
            })

            const data = await response.json()

            if (data.success) {
                setMessage("Password updated successfully")
                setFormData({
                    current_password: "",
                    new_password: "",
                    confirm_password: "",
                })
            } else {
                throw new Error(data.error || "Failed to update password")
            }
        } catch (error) {
            setMessage(error instanceof Error ? error.message : "Failed to update password")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-[#121212] rounded-lg p-6">
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">
                            Current Password
                        </label>
                        <input
                            type="password"
                            name="current_password"
                            value={formData.current_password}
                            onChange={handleInputChange}
                            className="w-full bg-[#1A1A1A] rounded-lg px-4 py-2 text-white"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">
                            New Password
                        </label>
                        <input
                            type="password"
                            name="new_password"
                            value={formData.new_password}
                            onChange={handleInputChange}
                            className="w-full bg-[#1A1A1A] rounded-lg px-4 py-2 text-white"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">
                            Confirm New Password
                        </label>
                        <input
                            type="password"
                            name="confirm_password"
                            value={formData.confirm_password}
                            onChange={handleInputChange}
                            className="w-full bg-[#1A1A1A] rounded-lg px-4 py-2 text-white"
                            required
                        />
                    </div>
                </div>
            </div>

            {message && (
                <div className={`p-4 rounded-lg ${message.includes("success") ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"}`}>
                    {message}
                </div>
            )}

            <div className="flex justify-end">
                <button
                    type="submit"
                    disabled={isLoading}
                    className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg font-medium disabled:opacity-50"
                >
                    {isLoading ? "Updating..." : "Update Password"}
                </button>
            </div>
        </form>
    )
}