"use client"

import { useState, useEffect, useRef } from "react"
import { useInView } from "react-intersection-observer"
import VideoPlayer from "@/components/video-player"
import Header from "@/components/header"
import CharacterGuide from "@/components/character-guide"
import HorizontalVideoGrid from "@/components/horizontal-video-grid"
import TokenInfoSection from "@/components/token-info-section"
import Footer from "@/components/footer"
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

export default function Home() {
  const [headerVisible, setHeaderVisible] = useState(true)
  const [showGuide, setShowGuide] = useState(false)
  const [videos, setVideos] = useState<Video[]>([])
  const [featuredVideo, setFeaturedVideo] = useState<Video | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [shouldAutoPlay, setShouldAutoPlay] = useState(false)
  const [showAutoPlayNotification, setShowAutoPlayNotification] = useState(false)

  // Function to play a random video
  const playRandomVideo = () => {
    if (videos.length > 0) {
      const randomIndex = Math.floor(Math.random() * videos.length)
      const randomVideo = videos[randomIndex]
      setFeaturedVideo(randomVideo)
      setShouldAutoPlay(true)

      // Scroll to top to show the video player
      if (typeof window !== "undefined") {
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
    }
  }

  // Function to auto-play next video (excluding current one)
  const playNextRandomVideo = () => {
    if (videos.length <= 1) return // Need at least 2 videos for auto-play

    // Filter out the current video to avoid replaying the same one
    const availableVideos = videos.filter(video => video.id !== featuredVideo?.id)

    if (availableVideos.length > 0) {
      const randomIndex = Math.floor(Math.random() * availableVideos.length)
      const nextVideo = availableVideos[randomIndex]

      // Show auto-play notification
      setShowAutoPlayNotification(true)

      // Set the new video with auto-play enabled
      setFeaturedVideo(nextVideo)
      setShouldAutoPlay(true)

      // Hide notification after 3 seconds
      setTimeout(() => {
        setShowAutoPlayNotification(false)
      }, 3000)

      console.log(`Auto-playing: ${nextVideo.title}`)
    }
  }
  const lastScrollY = useRef(0)
  const { ref } = useInView({
    threshold: 0.1,
  })

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
          .limit(50)

        if (error) {
          console.error('Error fetching videos:', error)
          return
        }

        if (allVideos && allVideos.length > 0) {
          setVideos(allVideos as Video[])

          // Select a random video as featured
          const randomIndex = Math.floor(Math.random() * allVideos.length)
          setFeaturedVideo(allVideos[randomIndex] as Video)
        }
      } catch (error) {
        console.error('Error in fetchVideos:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchVideos()
  }, [])

  // Handle header visibility on scroll
  useEffect(() => {
    if (typeof window === "undefined") return

    const handleScroll = () => {
      const currentScrollY = window.scrollY
      if (currentScrollY > lastScrollY.current && currentScrollY > 80) {
        setHeaderVisible(false)
      } else {
        setHeaderVisible(true)
      }
      lastScrollY.current = currentScrollY
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Show guide after 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowGuide(true)
    }, 3000)

    return () => clearTimeout(timer)
  }, [])

  // Listen for random video play events from mobile nav
  useEffect(() => {
    if (typeof window === "undefined") return

    const handlePlayRandomVideo = () => {
      playRandomVideo()
    }

    window.addEventListener('playRandomVideo', handlePlayRandomVideo)

    return () => {
      window.removeEventListener('playRandomVideo', handlePlayRandomVideo)
    }
  }, [videos])

  // Reset autoPlay flag after video changes
  useEffect(() => {
    if (shouldAutoPlay && featuredVideo) {
      // Reset the flag after a short delay to allow the video player to use it
      const timer = setTimeout(() => {
        setShouldAutoPlay(false)
      }, 100)

      return () => clearTimeout(timer)
    }
  }, [featuredVideo, shouldAutoPlay])

  // Filter videos by category
  const getVideosByCategory = (category: string, limit: number = 6) => {
    return videos
      .filter(video => video.category === category)
      .slice(0, limit)
      .map(transformVideo)
  }

  // Get featured videos (creative category or random selection)
  const featuredVideos = videos.length > 0
    ? getVideosByCategory('creative', 6).length > 0
      ? getVideosByCategory('creative', 6)
      : videos.slice(0, 6).map(transformVideo)
    : []

  // Get videos by category
  const shortsVideos = getVideosByCategory('shorts', 6)
  const musicVideos = getVideosByCategory('music', 6)
  const artVideos = getVideosByCategory('art', 6)
  const encryptedVideos = getVideosByCategory('encrypted', 6)



  // Use a ref-based approach instead of direct DOM manipulation
  const detailsToggleRef = useRef<HTMLSpanElement>(null)
  const videoDetailsRef = useRef<HTMLDivElement>(null)
  const detailsArrowRef = useRef<SVGSVGElement>(null)
  const [detailsOpen, setDetailsOpen] = useState(false)

  useEffect(() => {
    // This will only run in the browser
    if (typeof window !== "undefined") {
      if (videoDetailsRef.current && detailsArrowRef.current) {
        const isHidden = videoDetailsRef.current.classList.contains("h-0")
        if (detailsToggleRef.current) {
          detailsToggleRef.current.textContent = isHidden ? "Details" : "Hide"
        }
        detailsArrowRef.current.style.transform = isHidden ? "rotate(0deg)" : "rotate(180deg)"
      }
    }
  }, [detailsOpen])

  // Then update the onClick handler to use the state
  const toggleDetails = () => {
    setDetailsOpen(!detailsOpen)
    if (videoDetailsRef.current) {
      videoDetailsRef.current.classList.toggle("h-0")
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-zinc-950 text-zinc-100 overflow-x-hidden">
      <Header visible={headerVisible} />

      {/* Character guide */}
      {showGuide && <CharacterGuide onClose={() => setShowGuide(false)} />}

      <main className="flex-1 pt-16 w-full">
        {/* Hero Video Player with enhanced styling */}
        <section ref={ref} className="relative w-full overflow-hidden mt-8 md:mt-16">
          {/* Decorative elements */}
          <div className="absolute -top-20 -left-20 w-64 h-64 rounded-full bg-purple-500/10 blur-3xl"></div>
          <div className="absolute -bottom-20 -right-20 w-64 h-64 rounded-full bg-cyan-500/10 blur-3xl"></div>

          <div className="aspect-video max-h-[80vh] w-full mx-auto relative">
            {/* Auto-play notification */}
            {showAutoPlayNotification && (
              <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-50 bg-gradient-to-r from-cyan-500/90 to-blue-500/90 backdrop-blur-sm text-white px-4 py-2 rounded-full shadow-lg shadow-cyan-500/20 animate-in slide-in-from-top-2 duration-300">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium">Auto-playing next video...</span>
                </div>
              </div>
            )}

            {isLoading ? (
              <div className="w-full h-full bg-zinc-800 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-zinc-400">Loading videos...</p>
                </div>
              </div>
            ) : featuredVideo ? (
              <VideoPlayer
                videoSrc={featuredVideo.video_url}
                poster={featuredVideo.thumbnail_url || "/placeholder.svg?height=720&width=1280"}
                title={`Featured: ${featuredVideo.title}`}
                autoPlay={shouldAutoPlay}
                onVideoEnd={playNextRandomVideo}
              />
            ) : (
              <div className="w-full h-full bg-zinc-800 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <p className="text-zinc-400 text-lg mb-2">No videos available</p>
                  <p className="text-zinc-500 text-sm">Upload some videos to get started!</p>
                </div>
              </div>
            )}
          </div>
          
          {/* Video details section styled like Pixar TV controls */}
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
                    {featuredVideo?.title || "No Video Selected"}
                  </h1>
                </div>

                <button
                  className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-800 hover:bg-zinc-700 border border-zinc-700/50 text-xs font-medium text-zinc-300 hover:text-white transition-all"
                  onClick={toggleDetails}
                >
                  <span ref={detailsToggleRef}>Details</span>
                  <svg
                    width="10"
                    height="6"
                    viewBox="0 0 10 6"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="transition-transform duration-300"
                    ref={detailsArrowRef}
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
                ref={videoDetailsRef}
                className={`overflow-hidden transition-all duration-300 ease-in-out ${detailsOpen ? "" : "h-0"}`}
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
                          src={featuredVideo?.profiles?.avatar_url || "/placeholder.svg?height=64&width=64"}
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
                          {featuredVideo?.profiles?.display_name || featuredVideo?.profiles?.username || "Unknown Creator"}
                        </h3>
                        {featuredVideo?.profiles?.is_verified && (
                          <div className="px-2 py-0.5 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full text-[10px] font-bold text-white shadow-sm shadow-cyan-500/20">
                            VERIFIED
                          </div>
                        )}
                      </div>
                      <div className="text-sm text-zinc-300 flex items-center gap-2 mt-0.5">
                        <span className="bg-zinc-800 px-2 py-0.5 rounded-full">
                          {featuredVideo?.creator_id ? `${featuredVideo.creator_id.slice(0, 4)}...${featuredVideo.creator_id.slice(-4)}` : "Unknown"}
                        </span>
                        <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></div>
                        <span>{featuredVideo?.created_at ? new Date(featuredVideo.created_at).toLocaleDateString() : "Unknown date"}</span>
                      </div>
                    </div>
                  </div>

                  {/* Video description - more vibrant */}
                  <div className="relative bg-gradient-to-br from-zinc-800/80 to-zinc-900/80 p-4 rounded-2xl border border-zinc-700/30 shadow-lg">
                    <div className="absolute top-0 right-0 w-20 h-20 bg-cyan-500/5 rounded-full blur-xl"></div>
                    <p className="text-zinc-100 text-sm leading-relaxed relative z-10">
                      {featuredVideo?.description || "No description available for this video."}
                    </p>
                    <div className="absolute -bottom-2 -right-2 w-6 h-6 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 opacity-60 blur-md"></div>
                  </div>

                  {/* Video metadata in a fun Pixar-styled display */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {[
                      {
                        label: "Category",
                        value: featuredVideo?.category || "Unknown",
                        icon: "📺",
                        color: "from-cyan-500 to-blue-500"
                      },
                      {
                        label: "Duration",
                        value: formatDuration(featuredVideo?.duration || 0),
                        icon: "⏱️",
                        color: "from-purple-500 to-pink-500"
                      },
                      {
                        label: "Views",
                        value: featuredVideo?.view_count?.toString() || "0",
                        icon: "�️",
                        color: "from-amber-500 to-orange-500"
                      },
                      {
                        label: "Uploaded",
                        value: featuredVideo?.created_at ? new Date(featuredVideo.created_at).toLocaleDateString() : "Unknown",
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
                    <button className="group flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 hover:from-cyan-500/30 hover:to-blue-500/30 rounded-full text-sm font-medium text-cyan-400 transition-all border border-cyan-500/30 hover:border-cyan-500/50 shadow-md shadow-cyan-500/5 hover:shadow-cyan-500/20">
                      <div className="w-6 h-6 rounded-full bg-cyan-500/20 flex items-center justify-center group-hover:scale-125 transition-transform">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path
                            d="M19 21L12 16L5 21V5C5 4.46957 5.21071 3.96086 5.58579 3.58579C5.96086 3.21071 6.46957 3 7 3"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                      Save
                    </button>

                    <button className="group flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 hover:from-purple-500/30 hover:to-pink-500/30 rounded-full text-sm font-medium text-purple-400 transition-all border border-purple-500/30 hover:border-purple-500/50 shadow-md shadow-purple-500/5 hover:shadow-purple-500/20">
                      <div className="w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center group-hover:scale-125 transition-transform">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path
                            d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M12 16V12"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M12 8V12"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                      Later
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Video Categories */}
        <div className="container mx-auto px-4 py-12 space-y-16">
          {/* Featured Videos */}
          <section>
            <div className="mb-8 relative">
              <div className="absolute -top-10 -left-10 w-40 h-40 rounded-full bg-cyan-500/5 blur-3xl"></div>
              <div className="absolute -bottom-10 -right-10 w-40 h-40 rounded-full bg-purple-500/5 blur-3xl"></div>

              <div className="relative z-10 flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
                  <span className="text-lg font-bold text-black">✨</span>
                </div>
                <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-cyan-300 to-blue-500 bg-clip-text text-transparent">
                  Featured Videos
                </h2>
              </div>

              <div className="h-1 w-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full shadow-sm shadow-cyan-500/20"></div>
              <p className="text-zinc-400 mt-2 max-w-2xl">
                Discover our curated selection of the most impressive AI-generated videos on the platform
              </p>
            </div>

            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="w-8 h-8 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : featuredVideos.length > 0 ? (
              <HorizontalVideoGrid videos={featuredVideos} />
            ) : (
              <div className="text-center py-12 text-zinc-500">
                <p>No featured videos available yet</p>
              </div>
            )}
          </section>

          {/* Shorts */}
          <section>
            <div className="mb-8 relative">
              <div className="absolute -top-10 -left-10 w-40 h-40 rounded-full bg-amber-500/5 blur-3xl"></div>
              <div className="absolute -bottom-10 -right-10 w-40 h-40 rounded-full bg-red-500/5 blur-3xl"></div>

              <div className="relative z-10 flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-500 to-red-600 flex items-center justify-center shadow-lg shadow-amber-500/20">
                  <span className="text-lg font-bold text-black">⚡</span>
                </div>
                <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-amber-300 to-red-500 bg-clip-text text-transparent">
                  Shorts
                </h2>
              </div>

              <div className="h-1 w-full bg-gradient-to-r from-amber-500 to-red-500 rounded-full shadow-sm shadow-amber-500/20"></div>
              <p className="text-zinc-400 mt-2 max-w-2xl">
                Quick AI-generated clips under 60 seconds - perfect for a quick creative boost
              </p>
            </div>

            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : shortsVideos.length > 0 ? (
              <HorizontalVideoGrid videos={shortsVideos} />
            ) : (
              <div className="text-center py-12 text-zinc-500">
                <p>No shorts videos available yet</p>
              </div>
            )}
          </section>

          {/* Music */}
          <section>
            <div className="mb-8 relative">
              <div className="absolute -top-10 -left-10 w-40 h-40 rounded-full bg-purple-500/5 blur-3xl"></div>
              <div className="absolute -bottom-10 -right-10 w-40 h-40 rounded-full bg-pink-500/5 blur-3xl"></div>

              <div className="relative z-10 flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center shadow-lg shadow-purple-500/20">
                  <span className="text-lg font-bold text-black">🎵</span>
                </div>
                <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-purple-300 to-pink-500 bg-clip-text text-transparent">
                  Music
                </h2>
              </div>

              <div className="h-1 w-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full shadow-sm shadow-purple-500/20"></div>
              <p className="text-zinc-400 mt-2 max-w-2xl">
                AI-generated music visualizations and audio-reactive experiences
              </p>
            </div>

            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : musicVideos.length > 0 ? (
              <HorizontalVideoGrid videos={musicVideos} />
            ) : (
              <div className="text-center py-12 text-zinc-500">
                <p>No music videos available yet</p>
              </div>
            )}
          </section>

          {/* Art */}
          <section>
            <div className="mb-8 relative">
              <div className="absolute -top-10 -left-10 w-40 h-40 rounded-full bg-emerald-500/5 blur-3xl"></div>
              <div className="absolute -bottom-10 -right-10 w-40 h-40 rounded-full bg-teal-500/5 blur-3xl"></div>

              <div className="relative z-10 flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                  <span className="text-lg font-bold text-black">🎨</span>
                </div>
                <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-emerald-300 to-teal-500 bg-clip-text text-transparent">
                  Art
                </h2>
              </div>

              <div className="h-1 w-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full shadow-sm shadow-emerald-500/20"></div>
              <p className="text-zinc-400 mt-2 max-w-2xl">
                Stunning AI-generated artistic creations and visual experiments
              </p>
            </div>

            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : artVideos.length > 0 ? (
              <HorizontalVideoGrid videos={artVideos} />
            ) : (
              <div className="text-center py-12 text-zinc-500">
                <p>No art videos available yet</p>
              </div>
            )}
          </section>

          {/* Encrypted */}
          <section>
            <div className="mb-8 relative">
              <div className="absolute -top-10 -left-10 w-40 h-40 rounded-full bg-zinc-500/5 blur-3xl"></div>
              <div className="absolute -bottom-10 -right-10 w-40 h-40 rounded-full bg-zinc-500/5 blur-3xl"></div>

              <div className="relative z-10 flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-zinc-500 to-zinc-600 flex items-center justify-center shadow-lg shadow-zinc-500/20">
                  <span className="text-lg font-bold text-black">🔒</span>
                </div>
                <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-zinc-300 to-zinc-500 bg-clip-text text-transparent">
                  Encrypted
                </h2>
              </div>

              <div className="h-1 w-full bg-gradient-to-r from-zinc-500 to-zinc-600 rounded-full shadow-sm shadow-zinc-500/20"></div>
              <p className="text-zinc-400 mt-2 max-w-2xl">
                Token-gated premium content available exclusively to NFT holders
              </p>
            </div>

            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="w-8 h-8 border-4 border-zinc-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : encryptedVideos.length > 0 ? (
              <HorizontalVideoGrid videos={encryptedVideos} />
            ) : (
              <div className="text-center py-12 text-zinc-500">
                <p>No encrypted videos available yet</p>
              </div>
            )}
          </section>
        </div>
      </main>

      {/* Token Info Section - positioned between main content and footer */}
      <div className="border-t border-zinc-800/50 mt-12">
        <TokenInfoSection />
      </div>

      <Footer />
    </div>
  )
}
