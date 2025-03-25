"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Cookies from "js-cookie"
 
interface User {
    email: string;
    username: string;
    first_name: string;
    last_name: string;
    phone_number: string;
    country: string;
    profile_image?: string;
}

interface UserDataProps {
    user: User;
}

export function AccountDetails({ userData }: { userData: UserDataProps }) {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [message, setMessage] = useState("")
    const [formData, setFormData] = useState({
        email: "",
        username: "",
        first_name: "",
        last_name: "",
        phone_number: "",
        country: "",
    })

    useEffect(() => {
        if (userData?.user) {
            setFormData({
                email: userData.user.email || "",
                username: userData.user.username || "",
                first_name: userData.user.first_name || "",
                last_name: userData.user.last_name || "",
                phone_number: userData.user.phone_number || "",
                country: userData.user.country || "",
            })
        }
    }, [userData?.user])
 
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

   

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setMessage("")

        try {
            const token = Cookies.get("auth-token")
            const imageUrl = userData?.user?.profile_image
 

            const response = await fetch("/api/user/profile", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ ...formData, profile_image: imageUrl }),
            })

            const data = await response.json()

            if (data.success) {
                setMessage("Profile updated successfully")
                router.refresh()
            } else {
                throw new Error(data.error || "Failed to update profile")
            }
        } catch (error) {
            setMessage(error instanceof Error ? error.message : "Failed to update profile")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-[#121212] rounded-lg p-6">
               

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">
                            First Name
                        </label>
                        <input
                            type="text"
                            name="first_name"
                            value={formData.first_name}
                            onChange={handleInputChange}
                            className="w-full bg-[#1A1A1A] rounded-lg px-4 py-2 text-white"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">
                            Last Name
                        </label>
                        <input
                            type="text"
                            name="last_name"
                            value={formData.last_name}
                            onChange={handleInputChange}
                            className="w-full bg-[#1A1A1A] rounded-lg px-4 py-2 text-white"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">
                            Email
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            className="w-full bg-[#1A1A1A] rounded-lg px-4 py-2 text-white"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">
                            Username
                        </label>
                        <input
                            type="text"
                            name="username"
                            readOnly
                            value={formData.username}
                            onChange={handleInputChange}
                            className="w-full bg-[#1A1A1A] rounded-lg px-4 py-2 text-white"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">
                            Phone Number
                        </label>
                        <input
                            type="tel"
                            name="phone_number"
                            value={formData.phone_number}
                            onChange={handleInputChange}
                            className="w-full bg-[#1A1A1A] rounded-lg px-4 py-2 text-white"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">
                            Country
                        </label>
                        <input
                            type="text"
                            name="country"
                            value={formData.country}
                            onChange={handleInputChange}
                            className="w-full bg-[#1A1A1A] rounded-lg px-4 py-2 text-white"
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
                    {isLoading ? "Saving..." : "Save Changes"}
                </button>
            </div>
        </form>
    )
}