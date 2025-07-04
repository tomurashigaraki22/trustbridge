"use client"

import { useState, useEffect } from "react"
import { MessageSquare, Heart, Share2, RefreshCw } from "lucide-react"
import { Sidebar } from "@/components/dashboard/Sidebar"
import { TopBar } from "@/components/dashboard/TopBar"
import { useUserData } from "@/hooks/useUserData"
import Link from "next/link"
import Cookies from "js-cookie"
import Image from "next/image"

interface Post {
  id: number
  user: {
    username: string
    avatar: string
  }
  content: string
  image?: string
  likes: number
  comments: number
  timestamp: string
  liked: boolean
}

export default function SocialPage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isRefetching, setIsRefetching] = useState(false)
  const { userData } = useUserData()

  const fetchPosts = async () => {
    try {
      const response = await fetch("/api/social/posts", {
        headers: {
          Authorization: `Bearer ${Cookies.get("auth-token")}`,
        },
      })
      const data = await response.json()
      if (data.success) {
        setPosts(data.posts)
      }
    } catch (error) {
      console.error("Failed to fetch posts:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleRefresh = async () => {
    setIsRefetching(true)
    await fetchPosts()
    setIsRefetching(false)
  }

  const handleLike = async (postId: number) => {
    try {
      const response = await fetch(`/api/social/posts/${postId}/like`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${Cookies.get("auth-token")}`,
        },
      })
      if (response.ok) {
        setPosts(posts.map(post => 
          post.id === postId 
            ? { ...post, likes: post.liked ? post.likes - 1 : post.likes + 1, liked: !post.liked }
            : post
        ))
      }
    } catch (error) {
      console.error("Failed to like post:", error)
    }
  }

  useEffect(() => {
    fetchPosts()
  }, [])

  return (
    <div className="min-h-screen bg-[#0A0E1C] text-white pb-[5rem]">
      <div className="flex flex-col lg:flex-row">
        <Sidebar />
        <div className="flex-1 ">
          <TopBar title="Crypto Social" notices={userData?.notices} />
          
          <div className="p-4 lg:p-8">
            {/* Create Post Section */}
            <div className="bg-[#121212] rounded-[1rem] p-6 mb-8">
              <textarea 
                placeholder="Share your crypto thoughts..."
                className="w-full bg-[#1A1A1A] rounded-lg p-4 text-white resize-none focus:outline-none focus:ring-2 focus:ring-orange-500"
                rows={3}
              />
              <div className="flex justify-end mt-4">
                <button className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600">
                  Post
                </button>
              </div>
            </div>

            {/* Posts Feed */}
            <div className="space-y-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">Latest Posts</h2>
                <button
                  onClick={handleRefresh}
                  disabled={isRefetching}
                  className="rounded-full bg-white/20 p-3 hover:bg-gray-700/50"
                >
                  <RefreshCw className={`h-4 w-4 ${isRefetching ? "animate-spin" : ""}`} />
                </button>
              </div>

              {isLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="bg-[#121212] rounded-[1rem] p-6 animate-pulse">
                      <div className="h-4 bg-gray-700/50 rounded w-3/4 mb-4" />
                      <div className="h-4 bg-gray-700/50 rounded w-1/2" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-6">
                  {posts.map((post) => (
                    <div key={post.id} className="bg-[#121212] rounded-[1rem] p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <Image
                          src={post.user.avatar}
                          alt={post.user.username}
                          width={40}
                          height={40}
                          className="rounded-full"
                        />
                        <div>
                          <div className="font-medium">{post.user.username}</div>
                          <div className="text-sm text-gray-400">
                            {new Date(post.timestamp).toLocaleString()}
                          </div>
                        </div>
                      </div>
                      
                      <p className="text-gray-200 mb-4">{post.content}</p>
                      
                      {post.image && (
                        <Image
                          src={post.image}
                          alt="Post image"
                          width={600}
                          height={400}
                          className="rounded-lg mb-4"
                        />
                      )}

                      <div className="flex items-center gap-6 text-gray-400">
                        <button 
                          onClick={() => handleLike(post.id)}
                          className={`flex items-center gap-2 hover:text-gray-200 ${post.liked ? 'text-orange-500' : ''}`}
                        >
                          <Heart className="h-5 w-5" />
                          <span>{post.likes}</span>
                        </button>
                        <button className="flex items-center gap-2 hover:text-gray-200">
                          <MessageSquare className="h-5 w-5" />
                          <span>{post.comments}</span>
                        </button>
                        <button className="flex items-center gap-2 hover:text-gray-200">
                          <Share2 className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}