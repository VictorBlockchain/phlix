"use client"

import { useState, useEffect, useMemo } from "react"
import { Search, Film } from "lucide-react"
import { Input } from "@/components/ui/input"
import HorizontalVideoGrid from "@/components/horizontal-video-grid"
import Header from "@/components/header"
import { supabase } from "@/lib/supabase"

interface Video {
  id: string
  title: string
  description: string | null
  category: string
  video_url: string
  thumbnail_url: string | null
  duration: number | null
  creator_id: string
  view_count: number
  like_count: number
  is_nft: boolean
  created_at: string
  profiles: {
    username: string
    display_name: string | null
    avatar_url: string | null
    is_verified: boolean
  }
}

// Helper function to format duration
function formatDuration(seconds: number | null): string {
  if (!seconds) return "0:00"
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

// Helper function to transform database video to component format
function transformVideo(video: Video) {
  return {
    id: video.id,
    title: video.title,
    description: video.description || "No description available",
    thumbnail: video.thumbnail_url || "/placeholder.svg?height=720&width=1280",
    duration: formatDuration(video.duration),
    creator: video.profiles.display_name || video.profiles.username,
    isNft: video.is_nft,
    rarity: video.is_nft ? "rare" as const : undefined,
    views: video.view_count,
    likes: video.like_count,
    videoUrl: video.video_url,
    creatorAvatar: video.profiles.avatar_url,
    isVerified: video.profiles.is_verified,
  }
}

export default function DiscoverPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [videos, setVideos] = useState<Video[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Fetch videos from database
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setIsLoading(true)

        // Fetch all videos with creator profiles
        const { data: allVideos, error } = await supabase
          .from('videos')
          .select(`
            *,
            profiles:creator_id (
              username,
              display_name,
              avatar_url,
              is_verified
            )
          `)
          .eq('is_public', true)
          .order('created_at', { ascending: false })

        if (error) {
          console.error('Error fetching videos:', error)
          return
        }

        if (allVideos && allVideos.length > 0) {
          setVideos(allVideos as Video[])
        }
      } catch (error) {
        console.error('Error in fetchVideos:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchVideos()
  }, [])



  // Get search results when user is searching
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return []

    return videos
      .filter(video =>
        video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        video.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        video.profiles.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        video.profiles.display_name?.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .map(transformVideo)
  }, [videos, searchQuery])

  // Get videos by category for the rows
  const getVideosByCategory = (category: string) => {
    return videos
      .filter(video => video.category === category)
      .map(transformVideo)
  }

  // All categories for the rows
  const categoryRows = [
    { key: 'creative', label: 'Creative', icon: '✨', gradient: 'from-cyan-500 to-blue-600' },
    { key: 'shorts', label: 'Shorts', icon: '⚡', gradient: 'from-amber-500 to-red-600' },
    { key: 'music', label: 'Music', icon: '🎵', gradient: 'from-purple-500 to-pink-600' },
    { key: 'art', label: 'Art', icon: '🎨', gradient: 'from-emerald-500 to-teal-600' },
    { key: 'comedy', label: 'Comedy', icon: '😄', gradient: 'from-yellow-500 to-orange-600' },
    { key: 'film', label: 'Film', icon: '🎬', gradient: 'from-indigo-500 to-purple-600' },
    { key: 'anime', label: 'Anime', icon: '🌸', gradient: 'from-pink-500 to-rose-600' },
    { key: 'cartoon', label: 'Cartoon', icon: '🎭', gradient: 'from-green-500 to-emerald-600' },
    { key: 'romance', label: 'Romance', icon: '💕', gradient: 'from-rose-500 to-pink-600' },
    { key: 'encrypted', label: 'Encrypted', icon: '🔒', gradient: 'from-zinc-500 to-zinc-600' },
  ]

  return (
    <div className="min-h-screen bg-zinc-950">
      <Header visible={true} />
      
      <main className="container mx-auto px-4 pt-24 pb-20">
        {/* Page Header */}
        <div className="text-center mb-12">
          <div className="relative inline-block">
            {/* Decorative elements */}
            <div className="absolute -top-8 -left-8 w-16 h-16 rounded-full bg-cyan-500/10 blur-2xl"></div>
            <div className="absolute -bottom-8 -right-8 w-16 h-16 rounded-full bg-purple-500/10 blur-2xl"></div>
            
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-cyan-300 via-blue-400 to-purple-500 bg-clip-text text-transparent mb-4">
              Discover
            </h1>
            <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
              Explore amazing AI-generated videos across different categories and find your next favorite creator
            </p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
            <div className="relative bg-zinc-900/80 backdrop-blur-sm border border-zinc-800 rounded-2xl p-1">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-zinc-400" />
                <Input
                  placeholder="Search videos, creators, collections..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 pr-4 py-4 bg-transparent border-0 text-white placeholder:text-zinc-400 focus-visible:ring-2 focus-visible:ring-cyan-500/50 text-lg"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Content Sections */}
        <div className="space-y-16">
          {isLoading ? (
            <div className="text-center py-16">
              <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-zinc-400">Loading videos...</p>
            </div>
          ) : (
            <>
              {/* Search Results Section (when searching) */}
              {searchQuery.trim() && (
                <section className="relative">
                  <div className="absolute -top-10 -left-10 w-40 h-40 rounded-full bg-cyan-500/5 blur-3xl"></div>
                  <div className="absolute -bottom-10 -right-10 w-40 h-40 rounded-full bg-purple-500/5 blur-3xl"></div>

                  <div className="relative z-10 flex items-center gap-3 mb-8">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
                      <Search className="h-5 w-5 text-white" />
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-cyan-300 to-purple-500 bg-clip-text text-transparent">
                      Search Results for "{searchQuery}"
                    </h2>
                  </div>

                  {searchResults.length > 0 ? (
                    <HorizontalVideoGrid videos={searchResults} />
                  ) : (
                    <div className="text-center py-16">
                      <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-zinc-800 flex items-center justify-center">
                        <Search className="h-10 w-10 text-zinc-400" />
                      </div>
                      <h3 className="text-xl font-semibold text-zinc-300 mb-2">No results found</h3>
                      <p className="text-zinc-500">
                        No videos match "{searchQuery}". Try a different search term.
                      </p>
                    </div>
                  )}
                </section>
              )}

              {/* Category Rows (like home page) */}
              {!searchQuery.trim() && categoryRows.map((categoryRow) => {
                const categoryVideos = getVideosByCategory(categoryRow.key)

                if (categoryVideos.length === 0) return null

                return (
                  <section key={categoryRow.key} className="relative">
                    <div className="absolute -top-10 -left-10 w-40 h-40 rounded-full bg-cyan-500/5 blur-3xl"></div>
                    <div className="absolute -bottom-10 -right-10 w-40 h-40 rounded-full bg-purple-500/5 blur-3xl"></div>

                    <div className="relative z-10 flex items-center gap-3 mb-8">
                      <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${categoryRow.gradient} flex items-center justify-center shadow-lg shadow-cyan-500/20`}>
                        <span className="text-lg font-bold text-white">{categoryRow.icon}</span>
                      </div>
                      <h2 className={`text-2xl md:text-3xl font-bold bg-gradient-to-r ${categoryRow.gradient} bg-clip-text text-transparent`}>
                        {categoryRow.label}
                      </h2>
                    </div>

                    <div className={`h-1 w-full bg-gradient-to-r ${categoryRow.gradient} rounded-full shadow-sm shadow-cyan-500/20 mb-6`}></div>

                    <HorizontalVideoGrid videos={categoryVideos} />
                  </section>
                )
              })}

              {/* Empty state when no videos at all */}
              {!searchQuery.trim() && videos.length === 0 && (
                <div className="text-center py-20">
                  <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-zinc-800 flex items-center justify-center">
                    <Film className="h-12 w-12 text-zinc-400" />
                  </div>
                  <h3 className="text-2xl font-semibold text-zinc-300 mb-4">No videos available yet</h3>
                  <p className="text-zinc-500 max-w-md mx-auto">
                    Be the first to upload amazing AI-generated content to Phlix!
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  )
}
