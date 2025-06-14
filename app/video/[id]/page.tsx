"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { ThumbsUp, ThumbsDown, Eye, Share2, Download, Flag, ChevronDown, ChevronUp, MessageCircle, Film } from "lucide-react"
import VideoPlayer from "@/components/video-player"
import Header from "@/components/header"
import VideoGrid from "@/components/video-grid"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { supabase } from "@/lib/supabase"
import { useUser } from "@/hooks/use-user"
import { toast } from "sonner"

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

interface Comment {
  id: string
  content: string
  created_at: string
  like_count: number
  user_id: string
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

// Helper function to format view count
function formatViewCount(count: number): string {
  if (count >= 1000000) {
    return `${(count / 1000000).toFixed(1)}M`
  } else if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}K`
  }
  return count.toString()
}

// Helper function to transform video for VideoGrid
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

export default function VideoPage() {
  const params = useParams()
  const videoId = params.id as string
  const { profile, isConnected } = useUser()
  
  const [video, setVideo] = useState<Video | null>(null)
  const [comments, setComments] = useState<Comment[]>([])
  const [creatorVideos, setCreatorVideos] = useState<Video[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showDetails, setShowDetails] = useState(false)
  const [newComment, setNewComment] = useState("")
  const [isSubmittingComment, setIsSubmittingComment] = useState(false)
  const [hasLiked, setHasLiked] = useState(false)
  const [hasDisliked, setHasDisliked] = useState(false)
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0)
  const [autoPlay, setAutoPlay] = useState(false)
  const [activeTab, setActiveTab] = useState("comments")

  // Fetch video data
  useEffect(() => {
    const fetchVideo = async () => {
      if (!videoId) return

      try {
        setIsLoading(true)

        // Fetch video details
        const { data: videoData, error: videoError } = await supabase
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
          .eq('id', videoId)
          .single()

        if (videoError) {
          console.error('Error fetching video:', videoError)
          toast.error('Video not found')
          return
        }

        setVideo(videoData as Video)

        // Increment view count
        await supabase
          .from('videos')
          .update({ view_count: (videoData.view_count || 0) + 1 })
          .eq('id', videoId)

        // Fetch comments
        const { data: commentsData, error: commentsError } = await supabase
          .from('comments')
          .select(`
            *,
            profiles:user_id (
              username,
              display_name,
              avatar_url,
              is_verified
            )
          `)
          .eq('video_id', videoId)
          .order('created_at', { ascending: false })

        if (!commentsError && commentsData) {
          setComments(commentsData as Comment[])
        }

        // Fetch more videos from the same creator
        const { data: creatorVideosData, error: creatorVideosError } = await supabase
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
          .eq('creator_id', videoData.creator_id)
          .neq('id', videoId)
          .eq('is_public', true)
          .order('created_at', { ascending: false })
          .limit(12)

        if (!creatorVideosError && creatorVideosData) {
          setCreatorVideos(creatorVideosData as Video[])
        }

        // Check if user has liked/disliked (if logged in)
        if (isConnected && profile) {
          const { data: likeData } = await supabase
            .from('likes')
            .select('*')
            .eq('video_id', videoId)
            .eq('user_id', profile.id)
            .single()

          if (likeData) {
            setHasLiked(true)
          }
        }

      } catch (error) {
        console.error('Error in fetchVideo:', error)
        toast.error('Failed to load video')
      } finally {
        setIsLoading(false)
      }
    }

    fetchVideo()
  }, [videoId, isConnected, profile])

  // Handle like/dislike
  const handleLike = async () => {
    if (!isConnected || !profile || !video) {
      toast.error('Please connect your wallet to like videos')
      return
    }

    try {
      if (hasLiked) {
        // Remove like
        await supabase
          .from('likes')
          .delete()
          .eq('video_id', videoId)
          .eq('user_id', profile.id)

        setHasLiked(false)
        setVideo(prev => prev ? { ...prev, like_count: prev.like_count - 1 } : null)
      } else {
        // Add like
        await supabase
          .from('likes')
          .insert({
            video_id: videoId,
            user_id: profile.id
          })

        setHasLiked(true)
        setVideo(prev => prev ? { ...prev, like_count: prev.like_count + 1 } : null)
      }
    } catch (error) {
      console.error('Error handling like:', error)
      toast.error('Failed to update like')
    }
  }

  // Handle comment submission
  const handleSubmitComment = async () => {
    if (!isConnected || !profile) {
      toast.error('Please connect your wallet to comment')
      return
    }

    if (!newComment.trim()) {
      toast.error('Please enter a comment')
      return
    }

    try {
      setIsSubmittingComment(true)

      const { data: commentData, error } = await supabase
        .from('comments')
        .insert({
          video_id: videoId,
          user_id: profile.id,
          content: newComment.trim()
        })
        .select(`
          *,
          profiles:user_id (
            username,
            display_name,
            avatar_url,
            is_verified
          )
        `)
        .single()

      if (error) {
        console.error('Error submitting comment:', error)
        toast.error('Failed to submit comment')
        return
      }

      // Add new comment to the top of the list
      setComments(prev => [commentData as Comment, ...prev])
      setNewComment("")
      toast.success('Comment added successfully')

    } catch (error) {
      console.error('Error in handleSubmitComment:', error)
      toast.error('Failed to submit comment')
    } finally {
      setIsSubmittingComment(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black">
        <Header visible={true} />
        <div className="flex items-center justify-center h-[80vh]">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-zinc-400">Loading video...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!video) {
    return (
      <div className="min-h-screen bg-black">
        <Header visible={true} />
        <div className="flex items-center justify-center h-[80vh]">
          <div className="text-center">
            <p className="text-zinc-400 text-lg mb-2">Video not found</p>
            <p className="text-zinc-500 text-sm">The video you're looking for doesn't exist or has been removed.</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Animated background */}
      <div className="fixed inset-0 bg-gradient-to-br from-zinc-950 via-black to-zinc-950">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(120,119,198,0.1),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(255,119,198,0.1),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_40%_40%,rgba(120,219,255,0.1),transparent_50%)]"></div>
      </div>

      <Header visible={true} />

      <main className="relative z-10 pt-20">
        {/* Full-width cinematic video player */}
        <div className="relative">
          {/* Video container with cinematic aspect ratio */}
          <div className="aspect-video max-h-[85vh] w-full mx-auto relative">
            <VideoPlayer
              videoSrc={video.video_url}
              poster={video.thumbnail_url || "/placeholder.svg?height=720&width=1280"}
              title={video.title}
            />
          </div>

          <div className="max-w-full mx-auto relative -mt-2">
            {/* TV-like control panel */}
            <div className="bg-gradient-to-b from-zinc-800 to-zinc-900 rounded-b-xl border-x border-b border-zinc-700/50 shadow-lg overflow-hidden">
              {/* Control buttons row */}
              <div className="flex items-center px-4 py-3 border-b border-zinc-700/30">
                <div className="flex items-center gap-3 flex-1">
                  {/* Pixar-styled buttons */}
                  <div className="flex items-center gap-2">
                    <button className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-400 transition-colors"></button>
                    <button className="w-3 h-3 rounded-full bg-amber-500 hover:bg-amber-400 transition-colors"></button>
                    <button className="w-3 h-3 rounded-full bg-green-500 hover:bg-green-400 transition-colors"></button>
                  </div>

                  <div className="h-5 w-px bg-zinc-700/50"></div>

                  <h1 className="text-xl font-bold bg-gradient-to-r from-white via-cyan-200 to-white bg-clip-text text-transparent ml-2">
                    {video.title}
                  </h1>
                </div>

                <button
                  className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-800 hover:bg-zinc-700 border border-zinc-700/50 text-xs font-medium text-zinc-300 hover:text-white transition-all"
                  onClick={() => setShowDetails(!showDetails)}
                >
                  <span>Details</span>
                  <svg
                    width="10"
                    height="6"
                    viewBox="0 0 10 6"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className={`transition-transform duration-300 ${showDetails ? 'rotate-180' : ''}`}
                  >
                    <path
                      d="M1 1L5 5L9 1"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </div>

              {/* Expandable details section */}
              <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${showDetails ? "" : "h-0"}`}
              >
                <div className="p-4 space-y-6 relative">
                  {/* Playful background elements */}
                  <div className="absolute -top-4 right-10 w-20 h-20 rounded-full bg-purple-500/10 blur-xl animate-pulse"></div>
                  <div className="absolute bottom-10 left-20 w-24 h-24 rounded-full bg-cyan-500/10 blur-xl animate-pulse-slow"></div>

                  {/* Creator info with avatar - more playful style */}
                  <div className="flex items-center gap-4 bg-gradient-to-r from-zinc-800/50 via-zinc-800/80 to-zinc-800/50 p-3 rounded-2xl border border-zinc-700/30 transform hover:scale-[1.02] transition-transform">
                    <div className="relative">
                      <div className="w-16 h-16 rounded-full overflow-hidden border-4 border-cyan-500/50 animate-border-pulse shadow-lg shadow-cyan-500/20">
                        <img
                          src={video.profiles.avatar_url || "/placeholder.svg?height=64&width=64"}
                          alt="Creator"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.src = "/placeholder.svg?height=64&width=64"
                          }}
                        />
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center justify-center animate-bounce-gentle">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path
                            d="M20 6L9 17L4 12"
                            stroke="white"
                            strokeWidth="3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-lg text-white">
                          {video.profiles.display_name || video.profiles.username}
                        </h3>
                        {video.profiles.is_verified && (
                          <div className="px-2 py-0.5 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full text-[10px] font-bold text-white shadow-sm shadow-cyan-500/20">
                            VERIFIED
                          </div>
                        )}
                      </div>
                      <div className="text-sm text-zinc-300 flex items-center gap-2 mt-0.5">
                        <span className="bg-zinc-800 px-2 py-0.5 rounded-full">
                          {video.creator_id.slice(0, 4)}...{video.creator_id.slice(-4)}
                        </span>
                        <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></div>
                        <span>{new Date(video.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>

                  {/* Video description - more vibrant */}
                  <div className="relative bg-gradient-to-br from-zinc-800/80 to-zinc-900/80 p-4 rounded-2xl border border-zinc-700/30 shadow-lg">
                    <div className="absolute top-0 right-0 w-20 h-20 bg-cyan-500/5 rounded-full blur-xl"></div>
                    <p className="text-zinc-100 text-sm leading-relaxed relative z-10">
                      {video.description || "No description available for this video."}
                    </p>
                    <div className="absolute -bottom-2 -right-2 w-6 h-6 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 opacity-60 blur-md"></div>
                  </div>

                  {/* Video metadata in a fun Pixar-styled display */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {[
                      {
                        label: "Category",
                        value: video.category,
                        icon: "📺",
                        color: "from-cyan-500 to-blue-500"
                      },
                      {
                        label: "Duration",
                        value: formatDuration(video.duration),
                        icon: "⏱️",
                        color: "from-purple-500 to-pink-500"
                      },
                      {
                        label: "Views",
                        value: formatViewCount(video.view_count),
                        icon: "👁️",
                        color: "from-amber-500 to-orange-500"
                      },
                      {
                        label: "Uploaded",
                        value: new Date(video.created_at).toLocaleDateString(),
                        icon: "🎬",
                        color: "from-emerald-500 to-green-500"
                      },
                    ].map((item, index) => (
                      <div
                        key={index}
                        className="bg-gradient-to-br from-zinc-800/50 to-zinc-900/80 rounded-xl p-3 border border-zinc-700/30 transform hover:scale-110 hover:rotate-1 transition-all duration-300 shadow-lg group"
                      >
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-8 h-8 rounded-full bg-gradient-to-r ${item.color} flex items-center justify-center text-lg shadow-md group-hover:animate-bounce-gentle`}
                          >
                            {item.icon}
                          </div>
                          <div>
                            <div className="text-[10px] uppercase text-zinc-400 group-hover:text-zinc-300 transition-colors">
                              {item.label}
                            </div>
                            <div className="text-sm font-bold text-white">{item.value}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Action buttons row - more playful */}
                  <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                    <button
                      onClick={handleLike}
                      className={`group flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all border shadow-md ${
                        hasLiked
                          ? 'bg-gradient-to-r from-cyan-500/30 to-blue-500/30 border-cyan-500/50 text-cyan-300 shadow-cyan-500/20'
                          : 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 hover:from-cyan-500/30 hover:to-blue-500/30 text-cyan-400 border-cyan-500/30 hover:border-cyan-500/50 shadow-cyan-500/5 hover:shadow-cyan-500/20'
                      }`}
                    >
                      <div className="w-6 h-6 rounded-full bg-cyan-500/20 flex items-center justify-center group-hover:scale-125 transition-transform">
                        <ThumbsUp className="w-3.5 h-3.5" />
                      </div>
                      {video.like_count}
                    </button>

                    <button className="group flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 hover:from-purple-500/30 hover:to-pink-500/30 rounded-full text-sm font-medium text-purple-400 transition-all border border-purple-500/30 hover:border-purple-500/50 shadow-md shadow-purple-500/5 hover:shadow-purple-500/20">
                      <div className="w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center group-hover:scale-125 transition-transform">
                        <Share2 className="w-3.5 h-3.5" />
                      </div>
                      Share
                    </button>

                    <button className="group flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500/20 to-green-500/20 hover:from-emerald-500/30 hover:to-green-500/30 rounded-full text-sm font-medium text-emerald-400 transition-all border border-emerald-500/30 hover:border-emerald-500/50 shadow-md shadow-emerald-500/5 hover:shadow-emerald-500/20">
                      <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center group-hover:scale-125 transition-transform">
                        <Download className="w-3.5 h-3.5" />
                      </div>
                      Download
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Content sections with magical spacing */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">

          
          {/* Tabbed interface for Comments and Related Videos */}
          <Tabs defaultValue="comments" className="space-y-8" onValueChange={setActiveTab}>
            {/* Tab Navigation */}
            <div className="flex justify-center">
              <TabsList className="bg-gradient-to-r from-zinc-900 via-zinc-800 to-zinc-900 border border-cyan-500/30 rounded-full p-1.5 flex gap-1 shadow-xl shadow-cyan-500/20 backdrop-blur-sm h-auto animate-glow relative">
                <TabsTrigger
                  value="comments"
                  className="w-12 h-12 rounded-full flex items-center justify-center group relative data-[state=active]:bg-gradient-to-br data-[state=active]:from-cyan-400 data-[state=active]:to-blue-600 data-[state=active]:shadow-lg data-[state=active]:shadow-cyan-500/30 transition-all duration-300"
                  aria-label="Comments"
                >
                  <MessageCircle className="h-5 w-5 group-data-[state=active]:text-white text-zinc-400 group-hover:text-zinc-200 transition-colors" />

                  {activeTab === "comments" && (
                    <span className="absolute -bottom-9 left-1/2 transform -translate-x-1/2 text-xs text-cyan-400 font-medium">
                      Comments
                    </span>
                  )}
                </TabsTrigger>

                <TabsTrigger
                  value="more-videos"
                  className="w-12 h-12 rounded-full flex items-center justify-center group relative data-[state=active]:bg-gradient-to-br data-[state=active]:from-cyan-400 data-[state=active]:to-blue-600 data-[state=active]:shadow-lg data-[state=active]:shadow-cyan-500/30 transition-all duration-300"
                  aria-label="More Videos"
                >
                  <Film className="h-5 w-5 group-data-[state=active]:text-white text-zinc-400 group-hover:text-zinc-200 transition-colors" />

                  {activeTab === "more-videos" && (
                    <span className="absolute -bottom-9 left-1/2 transform -translate-x-1/2 text-xs text-cyan-400 font-medium">
                      More Videos
                    </span>
                  )}
                </TabsTrigger>
              </TabsList>
            </div>

            {/* Comments Tab Content */}
            <TabsContent value="comments" className="pt-4">
              <section className="relative">
                <div className="absolute -top-10 -left-10 w-40 h-40 rounded-full bg-pink-500/5 blur-3xl"></div>
                <div className="absolute -bottom-10 -right-10 w-40 h-40 rounded-full bg-blue-500/5 blur-3xl"></div>

                <div className="relative bg-gradient-to-br from-zinc-900/80 via-zinc-800/50 to-zinc-900/80 backdrop-blur-xl rounded-3xl border border-white/10 p-8 shadow-2xl shadow-black/20">
                  {/* Comments header */}
                  <div className="flex items-center gap-3 mb-8">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 flex items-center justify-center shadow-lg shadow-pink-500/20">
                      <span className="text-lg font-bold text-white">💬</span>
                    </div>
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-pink-300 to-purple-500 bg-clip-text text-transparent">
                      Comments
                    </h2>
                    <div className="bg-pink-500/20 rounded-full px-3 py-1 border border-pink-500/30">
                      <span className="text-pink-300 font-medium text-sm">{comments.length}</span>
                    </div>
                  </div>

                  {/* Add Comment Section */}
                  {isConnected ? (
                    <div className="mb-8 space-y-4">
                      <div className="flex gap-4">
                        <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-cyan-500/30 shadow-lg shadow-cyan-500/20 flex-shrink-0">
                          <img
                            src={profile?.avatar_url || "/placeholder.svg?height=48&width=48"}
                            alt="Your avatar"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <div className="relative">
                            <textarea
                              placeholder="Share your thoughts on this magical creation..."
                              value={newComment}
                              onChange={(e) => setNewComment(e.target.value)}
                              className="w-full min-h-[100px] bg-zinc-800/50 border border-zinc-600/50 rounded-2xl px-4 py-3 text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 resize-none backdrop-blur-sm transition-all duration-300"
                            />
                            <div className="absolute bottom-3 right-3 text-xs text-zinc-500">
                              {newComment.length}/500
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-end gap-3 pl-16">
                        <button
                          onClick={() => setNewComment("")}
                          disabled={!newComment.trim()}
                          className="px-6 py-2 rounded-full text-zinc-400 hover:text-white transition-colors disabled:opacity-50"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleSubmitComment}
                          disabled={isSubmittingComment || !newComment.trim()}
                          className="group relative overflow-hidden rounded-full px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-medium shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
                        >
                          <span className="relative z-10">
                            {isSubmittingComment ? "Posting..." : "Comment"}
                          </span>
                          <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="mb-8 bg-gradient-to-r from-zinc-800/50 to-zinc-700/50 rounded-2xl p-6 border border-zinc-600/30 text-center">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 flex items-center justify-center mx-auto mb-4">
                        <span className="text-2xl">🔐</span>
                      </div>
                      <p className="text-zinc-300 font-medium mb-2">Connect your wallet to join the conversation</p>
                      <p className="text-zinc-500 text-sm">Share your thoughts and connect with other creators</p>
                    </div>
                  )}

                  {/* Comments List */}
                  <div className="space-y-6">
                    {comments.map((comment, index) => (
                      <div key={comment.id} className="group">
                        <div className="flex gap-4">
                          <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-zinc-600/30 group-hover:border-cyan-500/30 transition-colors flex-shrink-0">
                            <img
                              src={comment.profiles.avatar_url || "/placeholder.svg?height=40&width=40"}
                              alt={comment.profiles.username}
                              className="w-full h-full object-cover"
                            />
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="bg-zinc-800/30 rounded-2xl p-4 group-hover:bg-zinc-800/50 transition-colors">
                              <div className="flex items-center gap-2 mb-2">
                                <span className="font-semibold text-white text-sm">
                                  {comment.profiles.display_name || comment.profiles.username}
                                </span>
                                {comment.profiles.is_verified && (
                                  <div className="w-4 h-4 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 flex items-center justify-center">
                                    <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                  </div>
                                )}
                                <span className="text-xs text-zinc-500">
                                  {new Date(comment.created_at).toLocaleDateString()}
                                </span>
                              </div>

                              <p className="text-zinc-200 leading-relaxed mb-3">{comment.content}</p>

                              <div className="flex items-center gap-4">
                                <button className="group/like flex items-center gap-2 text-xs text-zinc-400 hover:text-cyan-300 transition-colors">
                                  <div className="w-6 h-6 rounded-full bg-zinc-700/50 group-hover/like:bg-cyan-500/20 flex items-center justify-center transition-colors">
                                    <ThumbsUp className="h-3 w-3" />
                                  </div>
                                  <span>{comment.like_count}</span>
                                </button>
                                <button className="text-xs text-zinc-400 hover:text-purple-300 transition-colors font-medium">
                                  Reply
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Separator line */}
                        {index < comments.length - 1 && (
                          <div className="ml-14 mt-6 h-px bg-gradient-to-r from-transparent via-zinc-700/50 to-transparent"></div>
                        )}
                      </div>
                    ))}

                    {comments.length === 0 && (
                      <div className="text-center py-12">
                        <div className="w-20 h-20 rounded-full bg-gradient-to-r from-zinc-800/50 to-zinc-700/50 border border-zinc-600/30 flex items-center justify-center mx-auto mb-4">
                          <span className="text-3xl">💭</span>
                        </div>
                        <p className="text-zinc-400 font-medium mb-2">No comments yet</p>
                        <p className="text-zinc-500 text-sm">Be the first to share your thoughts!</p>
                      </div>
                    )}
                  </div>
                </div>
              </section>
            </TabsContent>

            {/* More Videos Tab Content */}
            <TabsContent value="more-videos" className="pt-4">
              <section className="relative">
                <div className="absolute -top-10 -left-10 w-40 h-40 rounded-full bg-emerald-500/5 blur-3xl"></div>
                <div className="absolute -bottom-10 -right-10 w-40 h-40 rounded-full bg-teal-500/5 blur-3xl"></div>

                <div className="relative bg-gradient-to-br from-zinc-900/80 via-zinc-800/50 to-zinc-900/80 backdrop-blur-xl rounded-3xl border border-white/10 p-8 shadow-2xl shadow-black/20">
                  {/* Section header */}
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                        <span className="text-lg font-bold text-white">🎬</span>
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold bg-gradient-to-r from-emerald-300 to-teal-500 bg-clip-text text-transparent">
                          More from {video.profiles.display_name || video.profiles.username}
                        </h2>
                        <p className="text-sm text-zinc-400">
                          Discover more amazing content from this creator
                        </p>
                      </div>
                    </div>

                    {/* Autoplay toggle with magical styling */}
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <span className="text-sm text-zinc-400 group-hover:text-emerald-300 transition-colors">Autoplay</span>
                      <div className="relative">
                        <input
                          type="checkbox"
                          checked={autoPlay}
                          onChange={(e) => setAutoPlay(e.target.checked)}
                          className="sr-only"
                        />
                        <div className={`w-12 h-6 rounded-full border-2 transition-all duration-300 ${
                          autoPlay
                            ? 'bg-gradient-to-r from-emerald-500 to-teal-600 border-emerald-400 shadow-lg shadow-emerald-500/25'
                            : 'bg-zinc-700 border-zinc-600'
                        }`}>
                          <div className={`w-4 h-4 rounded-full bg-white transition-all duration-300 transform ${
                            autoPlay ? 'translate-x-7' : 'translate-x-1'
                          } mt-0.5`}></div>
                        </div>
                      </div>
                    </label>
                  </div>

                  {/* Related Videos Grid - Full Width */}
                  {creatorVideos.length > 0 ? (
                    <div className="space-y-6">
                      {/* Transform videos for VideoGrid component */}
                      <VideoGrid videos={creatorVideos.map(transformVideo)} />
                    </div>
                  ) : (
                    <div className="text-center py-16">
                      <div className="w-24 h-24 rounded-full bg-gradient-to-r from-zinc-800/50 to-zinc-700/50 border border-zinc-600/30 flex items-center justify-center mx-auto mb-6">
                        <span className="text-4xl">🎭</span>
                      </div>
                      <h3 className="text-xl font-bold text-zinc-300 mb-2">No other videos yet</h3>
                      <p className="text-zinc-500">This creator is just getting started on their magical journey!</p>
                    </div>
                  )}
                </div>
              </section>
            </TabsContent>
          </Tabs>


        </div>
      </main>
    </div>
  )
}
