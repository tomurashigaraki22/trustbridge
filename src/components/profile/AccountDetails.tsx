"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Cookies from "js-cookie"
import { Camera, MapPin, Mail, Phone, Edit3, X } from 'lucide-react'
import Image from 'next/image'

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
    const [showEditModal, setShowEditModal] = useState(false)
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
                setShowEditModal(false)
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
        <div className="max-w-4xl mx-auto">
            {/* Profile Header */}
            <div className="relative h-48 bg-gradient-to-r from-orange-500 to-purple-600 rounded-t-2xl">
                <div className="absolute -bottom-16 left-8">
                    <div className="relative">
                        <div className="w-32 h-32 rounded-full border-4 border-[#121212] bg-[#1A1A1A] overflow-hidden">
                            {userData?.user?.profile_image ? (
                                <Image
                                    src={userData.user.profile_image}
                                    alt="Profile"
                                    fill
                                    className="object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                    <span className="text-4xl text-gray-400">
                                        {formData.first_name?.[0]?.toUpperCase() || formData.username?.[0]?.toUpperCase()}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                <button
                    onClick={() => setShowEditModal(true)}
                    className="absolute bottom-4 right-4 bg-orange-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-orange-600 transition-colors"
                >
                    <Edit3 size={18} />
                    Edit Profile
                </button>
            </div>

            {/* Profile Info */}
            <div className="bg-[#121212] rounded-b-2xl px-8 pt-20 pb-8">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold mb-1">
                        {formData.first_name} {formData.last_name}
                    </h1>
                    <p className="text-gray-400">@{formData.username}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-300">
                    <div className="flex items-center gap-3">
                        <Mail size={18} className="text-gray-400" />
                        {formData.email}
                    </div>
                    <div className="flex items-center gap-3">
                        <Phone size={18} className="text-gray-400" />
                        {formData.phone_number || 'Not provided'}
                    </div>
                    <div className="flex items-center gap-3">
                        <MapPin size={18} className="text-gray-400" />
                        {formData.country || 'Not provided'}
                    </div>
                </div>
            </div>

            {/* Edit Modal */}
            {showEditModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-[#121212] rounded-2xl w-full max-w-2xl">
                        <div className="flex items-center justify-between p-6 border-b border-gray-800">
                            <h2 className="text-xl font-bold">Edit Profile</h2>
                            <button
                                onClick={() => setShowEditModal(false)}
                                className="text-gray-400 hover:text-white"
                            >
                                <X size={24} />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6">
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

                            {message && (
                                <div className={`mt-4 p-4 rounded-lg ${message.includes("success") ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"}`}>
                                    {message}
                                </div>
                            )}

                            <div className="flex justify-end mt-6">
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg font-medium disabled:opacity-50"
                                >
                                    {isLoading ? "Saving..." : "Save Changes"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}