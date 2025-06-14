"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

import Header from "@/components/header"
import {
  Copy,
  CheckCheck,
  ExternalLink,
  Film,
  Wallet,
  ShoppingBag,
  History,
  Star,
  Sparkles,
  Edit,
  Camera,

  Trash2,
  MoreVertical,
} from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useUser, getAvatarUrl } from "@/hooks/use-user"
import { supabase } from "@/lib/supabase"
import { toast } from "sonner"

// Types for video data
interface Video {
  id: string
  creator_id: string
  title: string
  description: string | null
  category: string
  video_url: string
  thumbnail_url: string | null
  duration: number | null
  view_count: number
  like_count: number
  comment_count: number
  is_nft: boolean
  nft_id: string | null
  created_at: string
  updated_at: string
  creator?: {
    id: string
    username: string
    display_name: string | null
    avatar_url: string | null
    is_verified: boolean
  }
  nft?: {
    id: string
    rarity: "common" | "rare" | "legendary"
    current_price: number | null
    is_for_sale: boolean
  }
}

// Helper function to format duration
const formatDuration = (seconds: number | null): string => {
  if (!seconds) return '0:00'
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
}

export default function ProfilePage() {
  const { profile, isLoading, walletAddress, refreshProfile } = useUser()
  const [copied, setCopied] = useState(false)
  const [activeTab, setActiveTab] = useState("created")
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isEditVideoModalOpen, setIsEditVideoModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null)
  const [userVideos, setUserVideos] = useState<Video[]>([])
  const [videosLoading, setVideosLoading] = useState(true)
  const [editForm, setEditForm] = useState({
    title: '',
    description: '',
    category: '',
    thumbnail: null as File | null,
  })
  const [profileForm, setProfileForm] = useState({
    username: '',
    bio: '',
    avatar: null as File | null,
  })
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)

  // Fetch user's videos
  useEffect(() => {
    if (profile?.id) {
      fetchUserVideos()
    }
  }, [profile?.id])

  // Cleanup avatar preview URL
  useEffect(() => {
    return () => {
      if (avatarPreview) {
        URL.revokeObjectURL(avatarPreview)
      }
    }
  }, [avatarPreview])

  const fetchUserVideos = async () => {
    if (!profile?.id) return

    try {
      setVideosLoading(true)

      const { data, error } = await supabase
        .from('videos')
        .select(`
          *,
          creator:profiles!creator_id (
            id,
            username,
            display_name,
            avatar_url,
            is_verified
          )
        `)
        .eq('creator_id', profile.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setUserVideos(data || [])
    } catch (error) {
      console.error('Error fetching user videos:', error)
      toast.error('Failed to load videos')
    } finally {
      setVideosLoading(false)
    }
  }

  const copyWalletAddress = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard && walletAddress) {
      navigator.clipboard.writeText(walletAddress)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleEditVideo = (video: Video) => {
    setSelectedVideo(video)
    setEditForm({
      title: video.title,
      description: video.description || '',
      category: video.category,
      thumbnail: null,
    })
    setIsEditVideoModalOpen(true)
  }

  const handleDeleteVideo = (video: Video) => {
    setSelectedVideo(video)
    setIsDeleteModalOpen(true)
  }

  const saveVideoChanges = async () => {
    if (!selectedVideo) return

    try {
      let thumbnailUrl = selectedVideo.thumbnail_url

      // Upload new thumbnail if provided
      if (editForm.thumbnail) {
        const fileExt = editForm.thumbnail.name.split('.').pop()
        const fileName = `${selectedVideo.id}-${Date.now()}.${fileExt}`

        const { error: uploadError } = await supabase.storage
          .from('images')
          .upload(`thumbnails/${fileName}`, editForm.thumbnail, {
            cacheControl: '3600',
            upsert: true
          })

        if (uploadError) throw uploadError

        const { data: { publicUrl } } = supabase.storage
          .from('images')
          .getPublicUrl(`thumbnails/${fileName}`)

        thumbnailUrl = publicUrl
      }

      const { error } = await supabase
        .from('videos')
        .update({
          title: editForm.title,
          description: editForm.description,
          category: editForm.category,
          thumbnail_url: thumbnailUrl,
          updated_at: new Date().toISOString(),
        })
        .eq('id', selectedVideo.id)

      if (error) throw error

      toast.success('Video updated successfully')
      setIsEditVideoModalOpen(false)
      fetchUserVideos() // Refresh the videos
    } catch (error) {
      console.error('Error updating video:', error)
      toast.error('Failed to update video')
    }
  }

  const deleteVideo = async () => {
    if (!selectedVideo) return

    try {
      const { error } = await supabase
        .from('videos')
        .delete()
        .eq('id', selectedVideo.id)

      if (error) throw error

      toast.success('Video deleted successfully')
      setIsDeleteModalOpen(false)
      fetchUserVideos() // Refresh the videos
    } catch (error) {
      console.error('Error deleting video:', error)
      toast.error('Failed to delete video')
    }
  }

  const saveProfileChanges = async () => {
    if (!profile) return

    try {
      let avatarUrl = profile.avatar_url

      // Upload new avatar if provided
      if (profileForm.avatar) {
        const fileExt = profileForm.avatar.name.split('.').pop()
        const fileName = `${profile.id}-${Date.now()}.${fileExt}`

        const { error: uploadError } = await supabase.storage
          .from('avatars')
          .upload(`${fileName}`, profileForm.avatar, {
            cacheControl: '3600',
            upsert: true
          })

        if (uploadError) throw uploadError

        const { data: { publicUrl } } = supabase.storage
          .from('avatars')
          .getPublicUrl(fileName)

        avatarUrl = publicUrl
      }

      const { error } = await supabase
        .from('profiles')
        .update({
          username: profileForm.username || profile.username,
          bio: profileForm.bio || profile.bio,
          avatar_url: avatarUrl,
          updated_at: new Date().toISOString(),
        })
        .eq('id', profile.id)

      if (error) throw error

      toast.success('Profile updated successfully')
      setIsEditModalOpen(false)
      setAvatarPreview(null) // Clear preview
      // Refresh the profile to show updated info
      await refreshProfile()
    } catch (error) {
      console.error('Error updating profile:', error)
      toast.error('Failed to update profile')
    }
  }

  // Tab labels for accessibility and tooltips
  const tabLabels = {
    created: "Videos",
    nfts: "NFTs",
    forsale: "Store",
    purchases: "Purchases",
    history: "History",
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-zinc-400">Loading profile...</p>
        </div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Profile Not Found</h1>
          <p className="text-zinc-400">Please connect your wallet to view your profile.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-zinc-950">
      <Header visible={true} />

      <main className="max-w-7xl mx-auto px-4 py-8 pt-20 pb-24">
        {/* Profile Header */}
        <div className="mb-8">
          <Card className="border-zinc-800 bg-gradient-to-b from-zinc-900 to-zinc-950">
            <CardContent className="p-8">
              <div className="flex flex-col items-center text-center">
                {/* Avatar with Pixar-inspired styling */}
                <div className="relative mb-6">
                  <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-8 border-amber-500/30 shadow-xl shadow-amber-500/30 bg-gradient-to-b from-amber-300/20 to-amber-700/20">
                    <Image
                      src={getAvatarUrl(profile, 160)}
                      alt={profile.display_name || profile.username}
                      width={160}
                      height={160}
                      className="object-cover"
                    />
                  </div>
                  <div className="absolute -bottom-2 left-1/2 -translate-x-1/2">
                    <Badge className="bg-gradient-to-r from-amber-500 to-yellow-300 text-black border-none px-3 py-1 text-sm shadow-lg">
                      <Star className="h-4 w-4 mr-1 fill-black" />
                      {profile.is_creator ? 'Creator' : 'Member'}
                    </Badge>
                  </div>
                </div>

                {/* User Info - Centered */}
                <div className="w-full max-w-md">
                  <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-amber-200 via-amber-400 to-amber-200 bg-clip-text text-transparent">
                    {profile.username}
                  </h1>

                  {/* Wallet Address - Centered */}
                  {walletAddress && (
                    <div className="mt-4 flex justify-center">
                      <div className="bg-zinc-900/80 backdrop-blur-sm rounded-full border border-amber-500/30 px-4 py-2 flex items-center gap-2 text-sm shadow-lg shadow-amber-500/10">
                        <Wallet className="h-4 w-4 text-amber-500" />
                        <span className="text-zinc-300">
                          <span className="text-xs text-amber-500/70 mr-1">sol:</span>
                          {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
                        </span>
                        <button
                          onClick={copyWalletAddress}
                          className="text-amber-500 hover:text-amber-400 transition-colors"
                        >
                          {copied ? <CheckCheck className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                        </button>
                        <a
                          href={`https://explorer.solana.com/address/${walletAddress}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-amber-500 hover:text-amber-400 transition-colors"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      </div>
                    </div>
                  )}

                  {/* Bio - Centered */}
                  <p className="mt-4 text-zinc-300 max-w-lg mx-auto">{profile.bio || 'No bio available'}</p>
                  <p className="mt-1 text-sm text-zinc-500">
                    Joined {new Date(profile.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                  </p>

                  {/* Stats - Centered in a row */}
                  <div className="mt-6 flex justify-center gap-8">
                    <div className="text-center">
                      <p className="text-2xl font-bold bg-gradient-to-r from-amber-200 to-amber-400 bg-clip-text text-transparent">
                        {profile.follower_count.toLocaleString()}
                      </p>
                      <p className="text-xs text-zinc-400">Followers</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold bg-gradient-to-r from-amber-200 to-amber-400 bg-clip-text text-transparent">
                        {profile.following_count.toLocaleString()}
                      </p>
                      <p className="text-xs text-zinc-400">Following</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold bg-gradient-to-r from-amber-200 to-amber-400 bg-clip-text text-transparent">
                        {profile.video_count}
                      </p>
                      <p className="text-xs text-zinc-400">Videos</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold bg-gradient-to-r from-amber-200 to-amber-400 bg-clip-text text-transparent">
                        {profile.nft_count}
                      </p>
                      <p className="text-xs text-zinc-400">NFTs</p>
                    </div>
                  </div>

                  {/* Action Buttons - Centered */}
                  <div className="mt-6 flex justify-center gap-3">
                    <Button
                      variant="outline"
                      className="border-cyan-500/30 text-cyan-400 hover:bg-cyan-950/20 rounded-full px-6"
                      onClick={() => {
                        // Initialize form with current profile data
                        setProfileForm({
                          username: profile?.username || '',
                          bio: profile?.bio || '',
                          avatar: null,
                        })
                        setAvatarPreview(null)
                        setIsEditModalOpen(true)
                      }}
                    >
                      <Edit className="mr-2 h-4 w-4" /> Edit Profile
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Content Tabs */}
        <Tabs defaultValue="created" className="space-y-6" onValueChange={setActiveTab}>
          <div className="flex justify-center mb-8">
            <TabsList className="bg-gradient-to-r from-zinc-900 via-zinc-800 to-zinc-900 border border-cyan-500/30 rounded-full p-1.5 flex gap-1 shadow-xl shadow-cyan-500/20 backdrop-blur-sm h-auto animate-glow relative">
              <TabsTrigger
                value="created"
                className="w-12 h-12 rounded-full flex items-center justify-center group relative data-[state=active]:bg-gradient-to-br data-[state=active]:from-cyan-400 data-[state=active]:to-blue-600 data-[state=active]:shadow-lg data-[state=active]:shadow-cyan-500/30 transition-all duration-300"
                aria-label={tabLabels.created}
              >
                <Film className="h-5 w-5 group-data-[state=active]:text-white text-zinc-400 group-hover:text-zinc-200 transition-colors" />
                <span className="sr-only">{tabLabels.created}</span>
                {activeTab === "created" && (
                  <span className="absolute -bottom-9 left-1/2 transform -translate-x-1/2 text-xs text-cyan-400 font-medium">
                    {tabLabels.created}
                  </span>
                )}
              </TabsTrigger>

              <TabsTrigger
                value="nfts"
                className="w-12 h-12 rounded-full flex items-center justify-center group relative data-[state=active]:bg-gradient-to-br data-[state=active]:from-cyan-400 data-[state=active]:to-blue-600 data-[state=active]:shadow-lg data-[state=active]:shadow-cyan-500/30 transition-all duration-300"
                aria-label={tabLabels.nfts}
              >
                <Sparkles className="h-5 w-5 group-data-[state=active]:text-white text-zinc-400 group-hover:text-zinc-200 transition-colors" />
                <span className="sr-only">{tabLabels.nfts}</span>
                {activeTab === "nfts" && (
                  <span className="absolute -bottom-9 left-1/2 transform -translate-x-1/2 text-xs text-cyan-400 font-medium">
                    {tabLabels.nfts}
                  </span>
                )}
              </TabsTrigger>

              <TabsTrigger
                value="forsale"
                className="w-12 h-12 rounded-full flex items-center justify-center group relative data-[state=active]:bg-gradient-to-br data-[state=active]:from-cyan-400 data-[state=active]:to-blue-600 data-[state=active]:shadow-lg data-[state=active]:shadow-cyan-500/30 transition-all duration-300"
                aria-label={tabLabels.forsale}
              >
                <ShoppingBag className="h-5 w-5 group-data-[state=active]:text-white text-zinc-400 group-hover:text-zinc-200 transition-colors" />
                <span className="sr-only">{tabLabels.forsale}</span>
                {activeTab === "forsale" && (
                  <span className="absolute -bottom-9 left-1/2 transform -translate-x-1/2 text-xs text-cyan-400 font-medium">
                    {tabLabels.forsale}
                  </span>
                )}
              </TabsTrigger>

              <TabsTrigger
                value="purchases"
                className="w-12 h-12 rounded-full flex items-center justify-center group relative data-[state=active]:bg-gradient-to-br data-[state=active]:from-cyan-400 data-[state=active]:to-blue-600 data-[state=active]:shadow-lg data-[state=active]:shadow-cyan-500/30 transition-all duration-300"
                aria-label={tabLabels.purchases}
              >
                <Wallet className="h-5 w-5 group-data-[state=active]:text-white text-zinc-400 group-hover:text-zinc-200 transition-colors" />
                <span className="sr-only">{tabLabels.purchases}</span>
                {activeTab === "purchases" && (
                  <span className="absolute -bottom-9 left-1/2 transform -translate-x-1/2 text-xs text-cyan-400 font-medium">
                    {tabLabels.purchases}
                  </span>
                )}
              </TabsTrigger>

              <TabsTrigger
                value="history"
                className="w-12 h-12 rounded-full flex items-center justify-center group relative data-[state=active]:bg-gradient-to-br data-[state=active]:from-cyan-400 data-[state=active]:to-blue-600 data-[state=active]:shadow-lg data-[state=active]:shadow-cyan-500/30 transition-all duration-300"
                aria-label={tabLabels.history}
              >
                <History className="h-5 w-5 group-data-[state=active]:text-white text-zinc-400 group-hover:text-zinc-200 transition-colors" />
                <span className="sr-only">{tabLabels.history}</span>
                {activeTab === "history" && (
                  <span className="absolute -bottom-9 left-1/2 transform -translate-x-1/2 text-xs text-cyan-400 font-medium">
                    {tabLabels.history}
                  </span>
                )}
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="created" className="pt-4">
            <div className="space-y-6">
              {videosLoading ? (
                <div className="text-center py-16">
                  <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-zinc-400">Loading videos...</p>
                </div>
              ) : userVideos.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {userVideos.map((video) => (
                    <div key={video.id} className="group relative bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden hover:border-cyan-500/30 transition-colors">
                      <div className="aspect-video relative cursor-pointer" onClick={() => window.location.href = `/video/${video.id}`}>
                        <Image
                          src={video.thumbnail_url || "/placeholder.svg?height=360&width=640"}
                          alt={video.title}
                          fill
                          className="object-cover"
                        />
                        <div className="absolute bottom-2 right-2 bg-black/70 backdrop-blur-sm px-2 py-0.5 rounded text-xs font-medium">
                          {formatDuration(video.duration)}
                        </div>
                        {video.is_nft && (
                          <div className="absolute top-2 left-2">
                            <Badge className="bg-gradient-to-r from-amber-500 to-yellow-300 text-black border-0">
                              NFT
                            </Badge>
                          </div>
                        )}

                        {/* Video Management Dropdown */}
                        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity" onClick={(e) => e.stopPropagation()}>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button size="sm" variant="ghost" className="h-8 w-8 p-0 bg-black/50 hover:bg-black/70">
                                <MoreVertical className="h-4 w-4 text-white" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="bg-zinc-900 border-zinc-700">
                              <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleEditVideo(video); }} className="text-cyan-400 hover:bg-zinc-800">
                                <Edit className="mr-2 h-4 w-4" />
                                Edit Video
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleDeleteVideo(video); }} className="text-red-400 hover:bg-zinc-800">
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete Video
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>

                      <div className="p-4">
                        <h3 className="font-medium text-white mb-1 line-clamp-2">{video.title}</h3>
                        <p className="text-zinc-400 text-sm line-clamp-2 mb-2">{video.description}</p>
                        <div className="flex items-center justify-between text-xs text-zinc-500">
                          <span>{video.view_count} views</span>
                          <span>{new Date(video.created_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <Film className="h-16 w-16 text-zinc-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-zinc-300 mb-2">No videos yet</h3>
                  <p className="text-zinc-500">Start creating amazing content!</p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="nfts" className="pt-4">
            <div className="space-y-6">
              {videosLoading ? (
                <div className="text-center py-16">
                  <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-zinc-400">Loading NFTs...</p>
                </div>
              ) : userVideos.filter(video => video.is_nft).length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {userVideos.filter(video => video.is_nft).map((video) => (
                    <div key={video.id} className="group relative bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden hover:border-cyan-500/30 transition-colors">
                      <div className="aspect-video relative">
                        <Image
                          src={video.thumbnail_url || "/placeholder.svg?height=360&width=640"}
                          alt={video.title}
                          fill
                          className="object-cover"
                        />
                        <div className="absolute bottom-2 right-2 bg-black/70 backdrop-blur-sm px-2 py-0.5 rounded text-xs font-medium">
                          {formatDuration(video.duration)}
                        </div>
                        <div className="absolute top-2 left-2">
                          <Badge className={`border-0 ${
                            video.nft?.rarity === 'legendary'
                              ? 'bg-gradient-to-r from-amber-500 to-yellow-300 text-black'
                              : video.nft?.rarity === 'rare'
                              ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                              : 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white'
                          }`}>
                            {video.nft?.rarity?.toUpperCase() || 'COMMON'} NFT
                          </Badge>
                        </div>
                        {video.nft?.current_price && (
                          <div className="absolute top-2 right-2">
                            <Badge className="bg-green-500 text-black border-0">
                              {video.nft.current_price} SOL
                            </Badge>
                          </div>
                        )}
                      </div>

                      <div className="p-4">
                        <h3 className="font-medium text-white mb-1 line-clamp-2">{video.title}</h3>
                        <p className="text-zinc-400 text-sm line-clamp-2 mb-2">{video.description}</p>
                        <div className="flex items-center justify-between text-xs text-zinc-500">
                          <span>{video.view_count} views</span>
                          <span>{new Date(video.created_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <Sparkles className="h-16 w-16 text-zinc-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-zinc-300 mb-2">No NFTs yet</h3>
                  <p className="text-zinc-500">Mint your videos as NFTs to showcase them here!</p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="forsale" className="pt-4">
            <div className="space-y-6">
              {videosLoading ? (
                <div className="text-center py-16">
                  <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-zinc-400">Loading marketplace items...</p>
                </div>
              ) : userVideos.filter(video => video.is_nft && video.nft?.is_for_sale).length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {userVideos.filter(video => video.is_nft && video.nft?.is_for_sale).map((video) => (
                    <div key={video.id} className="group relative bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden hover:border-cyan-500/30 transition-colors">
                      <div className="aspect-video relative">
                        <Image
                          src={video.thumbnail_url || "/placeholder.svg?height=360&width=640"}
                          alt={video.title}
                          fill
                          className="object-cover"
                        />
                        <div className="absolute bottom-2 right-2 bg-black/70 backdrop-blur-sm px-2 py-0.5 rounded text-xs font-medium">
                          {formatDuration(video.duration)}
                        </div>
                        <div className="absolute top-2 left-2">
                          <Badge className="bg-green-500 text-black border-0">
                            FOR SALE
                          </Badge>
                        </div>
                        <div className="absolute top-2 right-2">
                          <Badge className="bg-amber-500 text-black border-0">
                            {video.nft?.current_price} SOL
                          </Badge>
                        </div>
                      </div>

                      <div className="p-4">
                        <h3 className="font-medium text-white mb-1 line-clamp-2">{video.title}</h3>
                        <p className="text-zinc-400 text-sm line-clamp-2 mb-2">{video.description}</p>
                        <div className="flex items-center justify-between text-xs text-zinc-500">
                          <span>{video.view_count} views</span>
                          <span>{new Date(video.created_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <ShoppingBag className="h-16 w-16 text-zinc-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-zinc-300 mb-2">No items for sale</h3>
                  <p className="text-zinc-500">List your NFT videos for sale to showcase them here!</p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="purchases" className="pt-4">
            <div className="text-center py-16">
              <Wallet className="h-16 w-16 text-zinc-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-zinc-300 mb-2">Purchases coming soon</h3>
              <p className="text-zinc-500">Your NFT purchases will be displayed here.</p>
            </div>
          </TabsContent>

          <TabsContent value="history" className="pt-4">
            <div className="text-center py-16">
              <History className="h-16 w-16 text-zinc-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-zinc-300 mb-2">Watch history coming soon</h3>
              <p className="text-zinc-500">Your viewing history will be displayed here.</p>
            </div>
          </TabsContent>
        </Tabs>
      </main>

      {/* Edit Video Modal */}
      <Dialog open={isEditVideoModalOpen} onOpenChange={setIsEditVideoModalOpen}>
        <DialogContent className="bg-gradient-to-b from-zinc-900 to-zinc-950 border-2 border-cyan-500/30 text-white sm:max-w-md rounded-3xl shadow-xl shadow-cyan-500/20">
          <div className="bg-gradient-to-r from-cyan-600 to-blue-600 p-6 -m-6 mb-6 rounded-t-3xl">
            <DialogTitle className="text-xl font-bold text-white flex items-center gap-2">
              <Edit className="h-5 w-5" />
              Edit Video
            </DialogTitle>
            <DialogDescription className="text-cyan-200/70 text-sm">
              Update your video information
            </DialogDescription>
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="videoTitle" className="text-cyan-300 font-medium">Title</Label>
              <Input
                id="videoTitle"
                value={editForm.title}
                onChange={(e) => setEditForm(prev => ({ ...prev, title: e.target.value }))}
                className="bg-zinc-800/50 border-cyan-500/20 rounded-xl mt-1"
              />
            </div>

            <div>
              <Label htmlFor="videoDescription" className="text-cyan-300 font-medium">Description</Label>
              <Textarea
                id="videoDescription"
                value={editForm.description}
                onChange={(e) => setEditForm(prev => ({ ...prev, description: e.target.value }))}
                className="bg-zinc-800/50 border-cyan-500/20 rounded-xl mt-1 min-h-[80px]"
              />
            </div>

            <div>
              <Label htmlFor="videoThumbnail" className="text-cyan-300 font-medium">Thumbnail Image</Label>
              <div className="mt-1">
                {selectedVideo?.thumbnail_url && (
                  <div className="mb-2">
                    <img
                      src={selectedVideo.thumbnail_url}
                      alt="Current thumbnail"
                      className="w-32 h-18 object-cover rounded-lg border border-zinc-600"
                    />
                    <p className="text-xs text-zinc-500 mt-1">Current thumbnail</p>
                  </div>
                )}
                <Input
                  id="videoThumbnail"
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0] || null
                    setEditForm(prev => ({ ...prev, thumbnail: file }))
                  }}
                  className="bg-zinc-800/50 border-cyan-500/20 rounded-xl"
                />
                <p className="text-xs text-zinc-500 mt-1">Upload a new thumbnail image (optional)</p>
              </div>
            </div>

            <div>
              <Label htmlFor="videoCategory" className="text-cyan-300 font-medium">Category</Label>
              <select
                id="videoCategory"
                value={editForm.category}
                onChange={(e) => setEditForm(prev => ({ ...prev, category: e.target.value }))}
                className="w-full bg-zinc-800/50 border border-cyan-500/20 rounded-xl mt-1 p-3 text-white"
              >
                <option value="creative">Creative</option>
                <option value="shorts">Shorts</option>
                <option value="music">Music</option>
                <option value="art">Art</option>
                <option value="comedy">Comedy</option>
                <option value="film">Film</option>
                <option value="anime">Anime</option>
                <option value="cartoon">Cartoon</option>
                <option value="romance">Romance</option>
                <option value="encrypted">Encrypted</option>
              </select>
            </div>
          </div>

          <div className="flex gap-3 justify-end mt-6">
            <Button
              variant="outline"
              onClick={() => setIsEditVideoModalOpen(false)}
              className="border-cyan-500/30 text-cyan-400 hover:bg-cyan-950/20"
            >
              Cancel
            </Button>
            <Button
              onClick={saveVideoChanges}
              className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700"
            >
              Save Changes
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Video Modal */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent className="bg-gradient-to-b from-zinc-900 to-zinc-950 border-2 border-red-500/30 text-white sm:max-w-md rounded-3xl shadow-xl shadow-red-500/20">
          <div className="bg-gradient-to-r from-red-600 to-red-700 p-6 -m-6 mb-6 rounded-t-3xl">
            <DialogTitle className="text-xl font-bold text-white flex items-center gap-2">
              <Trash2 className="h-5 w-5" />
              Delete Video
            </DialogTitle>
            <DialogDescription className="text-red-200/70 text-sm">
              This action cannot be undone
            </DialogDescription>
          </div>

          <div className="space-y-4">
            <p className="text-zinc-300">
              Are you sure you want to delete "{selectedVideo?.title}"? This will permanently remove the video and all associated data.
            </p>
          </div>

          <div className="flex gap-3 justify-end mt-6">
            <Button
              variant="outline"
              onClick={() => setIsDeleteModalOpen(false)}
              className="border-zinc-500/30 text-zinc-400 hover:bg-zinc-800"
            >
              Cancel
            </Button>
            <Button
              onClick={deleteVideo}
              className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700"
            >
              Delete Video
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Profile Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="bg-gradient-to-b from-zinc-900 to-zinc-950 border-2 border-cyan-500/30 text-white sm:max-w-md rounded-3xl shadow-xl shadow-cyan-500/20">
          <div className="bg-gradient-to-r from-cyan-600 to-blue-600 p-6 -m-6 mb-6 rounded-t-3xl">
            <DialogTitle className="text-xl font-bold text-white flex items-center gap-2">
              <Edit className="h-5 w-5" />
              Edit Profile
            </DialogTitle>
            <DialogDescription className="text-cyan-200/70 text-sm">
              Update your profile information
            </DialogDescription>
          </div>

          <div className="space-y-4">
            {/* Avatar Upload */}
            <div className="flex flex-col items-center">
              <div className="relative mb-2">
                <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-cyan-500/30 shadow-lg shadow-cyan-500/20">
                  <Image
                    src={avatarPreview || getAvatarUrl(profile!, 80)}
                    alt="Profile Avatar"
                    width={80}
                    height={80}
                    className="object-cover"
                  />
                </div>
                <label htmlFor="avatarUpload" className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center justify-center shadow-lg cursor-pointer hover:from-cyan-400 hover:to-blue-400 transition-colors">
                  <Camera className="h-4 w-4 text-white" />
                </label>
                <input
                  id="avatarUpload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0] || null
                    setProfileForm(prev => ({ ...prev, avatar: file }))

                    // Create preview URL
                    if (file) {
                      const previewUrl = URL.createObjectURL(file)
                      setAvatarPreview(previewUrl)
                    } else {
                      setAvatarPreview(null)
                    }
                  }}
                />
              </div>
              <p className="text-xs text-cyan-400">Click to upload a new avatar</p>
              {profileForm.avatar && (
                <p className="text-xs text-green-400 mt-1">New avatar selected: {profileForm.avatar.name}</p>
              )}
            </div>

            {/* Form Fields */}
            <div>
              <Label htmlFor="username" className="text-cyan-300 font-medium">Username</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-cyan-500">@</span>
                <Input
                  id="username"
                  value={profileForm.username}
                  onChange={(e) => setProfileForm(prev => ({ ...prev, username: e.target.value }))}
                  className="bg-zinc-800/50 border-cyan-500/20 rounded-xl pl-8 mt-1"
                  placeholder={profile?.username}
                />
              </div>
            </div>



            <div>
              <Label htmlFor="bio" className="text-cyan-300 font-medium">Bio</Label>
              <Textarea
                id="bio"
                value={profileForm.bio}
                onChange={(e) => setProfileForm(prev => ({ ...prev, bio: e.target.value }))}
                className="bg-zinc-800/50 border-cyan-500/20 rounded-xl mt-1 min-h-[80px]"
                placeholder={profile?.bio || 'Tell us about yourself...'}
              />
            </div>
          </div>

          <div className="flex gap-3 justify-end mt-6">
            <Button
              variant="outline"
              onClick={() => setIsEditModalOpen(false)}
              className="border-cyan-500/30 text-cyan-400 hover:bg-cyan-950/20"
            >
              Cancel
            </Button>
            <Button
              className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700"
              onClick={saveProfileChanges}
            >
              Save Changes
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
