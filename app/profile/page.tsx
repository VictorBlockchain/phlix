"use client"

import { useState } from "react"
import Image from "next/image"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import VideoGrid from "@/components/video-grid"
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
  Twitter,
} from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

// Mock data for demonstration
const mockUser = {
  id: "1",
  name: "Alex Rodriguez",
  username: "@alexcreates",
  avatar: "/placeholder.svg?height=128&width=128",
  walletAddress: "0x71C7656EC7ab88b098defB751B7401B5f6d8976F",
  joinedDate: "March 2023",
  followers: 1240,
  following: 356,
  bio: "Digital creator and NFT enthusiast. Creating cinematic experiences in the digital realm.",
}

const mockVideos = [
  {
    id: "1",
    title: "Neon City Dreams",
    description: "A journey through a futuristic cityscape",
    thumbnail: "/placeholder.svg?height=720&width=1280",
    duration: "3:45",
    isNft: true,
    rarity: "rare",
    creator: mockUser.username,
    price: 0.5,
  },
  {
    id: "2",
    title: "Ocean Depths",
    description: "Exploring the mysteries of the deep sea",
    thumbnail: "/placeholder.svg?height=720&width=1280",
    duration: "4:20",
    isNft: true,
    rarity: "legendary",
    creator: mockUser.username,
    price: 2.5,
  },
  {
    id: "3",
    title: "Mountain Sunrise",
    description: "Timelapse of a beautiful mountain sunrise",
    thumbnail: "/placeholder.svg?height=720&width=1280",
    duration: "2:15",
    creator: mockUser.username,
  },
  {
    id: "4",
    title: "Urban Rhythms",
    description: "The pulse of city life captured in motion",
    thumbnail: "/placeholder.svg?height=720&width=1280",
    duration: "5:30",
    creator: mockUser.username,
  },
]

const mockPurchases = [
  {
    id: "101",
    title: "Cosmic Voyage",
    description: "An interstellar journey through galaxies",
    thumbnail: "/placeholder.svg?height=720&width=1280",
    duration: "6:15",
    isNft: true,
    rarity: "legendary",
    creator: "@cosmic_creator",
    purchaseDate: "2023-05-15",
    price: 1.2,
  },
  {
    id: "102",
    title: "Desert Mirage",
    description: "Surreal landscapes of desert environments",
    thumbnail: "/placeholder.svg?height=720&width=1280",
    duration: "4:45",
    isNft: true,
    rarity: "rare",
    creator: "@desert_visuals",
    purchaseDate: "2023-06-22",
    price: 0.8,
  },
]

const mockWatchHistory = [
  {
    id: "201",
    title: "Forest Whispers",
    description: "Ambient sounds and visuals from ancient forests",
    thumbnail: "/placeholder.svg?height=720&width=1280",
    duration: "8:30",
    creator: "@nature_sounds",
    watchedDate: "2023-07-01",
  },
  {
    id: "202",
    title: "Tokyo Nights",
    description: "Nightlife in the bustling streets of Tokyo",
    thumbnail: "/placeholder.svg?height=720&width=1280",
    duration: "7:15",
    creator: "@urban_explorer",
    watchedDate: "2023-07-03",
  },
  {
    id: "203",
    title: "Quantum Realms",
    description: "Visualization of quantum physics concepts",
    thumbnail: "/placeholder.svg?height=720&width=1280",
    duration: "5:45",
    creator: "@science_visuals",
    watchedDate: "2023-07-05",
  },
]

export default function ProfilePage() {
  const [copied, setCopied] = useState(false)
  const [activeTab, setActiveTab] = useState("created")
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)

  const copyWalletAddress = () => {
    navigator.clipboard.writeText(mockUser.walletAddress)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // Tab labels for accessibility and tooltips
  const tabLabels = {
    created: "Videos",
    nfts: "NFTs",
    forsale: "Store",
    purchases: "Purchases",
    history: "History",
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
                      src="/placeholder.svg?height=160&width=160"
                      alt={mockUser.name}
                      width={160}
                      height={160}
                      className="object-cover"
                    />
                  </div>
                  <div className="absolute -bottom-2 left-1/2 -translate-x-1/2">
                    <Badge className="bg-gradient-to-r from-amber-500 to-yellow-300 text-black border-none px-3 py-1 text-sm shadow-lg">
                      <Star className="h-4 w-4 mr-1 fill-black" />
                      Creator
                    </Badge>
                  </div>
                </div>

                {/* User Info - Centered */}
                <div className="w-full max-w-md">
                  <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-amber-200 via-amber-400 to-amber-200 bg-clip-text text-transparent">
                    {mockUser.name}
                  </h1>
                  <p className="text-amber-500 font-medium text-lg">{mockUser.username}</p>

                  {/* Wallet Address - Centered */}
                  <div className="mt-4 flex justify-center">
                    <div className="bg-zinc-900/80 backdrop-blur-sm rounded-full border border-amber-500/30 px-4 py-2 flex items-center gap-2 text-sm shadow-lg shadow-amber-500/10">
                      <Wallet className="h-4 w-4 text-amber-500" />
                      <span className="text-zinc-300">
                        <span className="text-xs text-amber-500/70 mr-1">sui:</span>
                        {mockUser.walletAddress.slice(0, 6)}...{mockUser.walletAddress.slice(-4)}
                      </span>
                      <button
                        onClick={copyWalletAddress}
                        className="text-amber-500 hover:text-amber-400 transition-colors"
                      >
                        {copied ? <CheckCheck className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                      </button>
                      <a
                        href={`https://explorer.sui.io/address/${mockUser.walletAddress}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-amber-500 hover:text-amber-400 transition-colors"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </div>
                  </div>

                  {/* Bio - Centered */}
                  <p className="mt-4 text-zinc-300 max-w-lg mx-auto">{mockUser.bio}</p>
                  <p className="mt-1 text-sm text-zinc-500">Joined {mockUser.joinedDate}</p>

                  {/* Stats - Centered in a row */}
                  <div className="mt-6 flex justify-center gap-8">
                    <div className="text-center">
                      <p className="text-2xl font-bold bg-gradient-to-r from-amber-200 to-amber-400 bg-clip-text text-transparent">
                        {mockUser.followers.toLocaleString()}
                      </p>
                      <p className="text-xs text-zinc-400">Followers</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold bg-gradient-to-r from-amber-200 to-amber-400 bg-clip-text text-transparent">
                        {mockUser.following.toLocaleString()}
                      </p>
                      <p className="text-xs text-zinc-400">Following</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold bg-gradient-to-r from-amber-200 to-amber-400 bg-clip-text text-transparent">
                        {mockVideos.length}
                      </p>
                      <p className="text-xs text-zinc-400">Videos</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold bg-gradient-to-r from-amber-200 to-amber-400 bg-clip-text text-transparent">
                        {mockVideos.filter((v) => v.isNft).length}
                      </p>
                      <p className="text-xs text-zinc-400">NFTs</p>
                    </div>
                  </div>

                  {/* Action Buttons - Centered */}
                  <div className="mt-6 flex justify-center gap-3">
                    <Button
                      variant="outline"
                      className="border-amber-500/30 text-amber-400 hover:bg-amber-950/20 rounded-full px-6"
                    >
                      Follow
                    </Button>
                    <Button className="bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-600 hover:to-yellow-500 text-black rounded-full px-6 shadow-lg shadow-amber-500/20">
                      Message
                    </Button>
                    <Button
                      variant="outline"
                      className="border-cyan-500/30 text-cyan-400 hover:bg-cyan-950/20 rounded-full px-6"
                      onClick={() => setIsEditModalOpen(true)}
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
              <VideoGrid videos={mockVideos} />
            </div>
          </TabsContent>

          <TabsContent value="nfts" className="pt-4">
            <div className="space-y-6">
              <VideoGrid videos={mockVideos.filter((video) => video.isNft)} />
            </div>
          </TabsContent>

          <TabsContent value="forsale" className="pt-4">
            <div className="space-y-6">
              <VideoGrid videos={mockVideos.filter((video) => video.isNft && video.price)} />
            </div>
          </TabsContent>

          <TabsContent value="purchases" className="pt-4">
            <div className="space-y-6">
              {mockPurchases.map((purchase) => (
                <div key={purchase.id} className="bg-zinc-900 border border-zinc-800 rounded-lg p-3">
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="w-full md:w-48 aspect-video relative rounded-lg overflow-hidden">
                      <Image
                        src={purchase.thumbnail || "/placeholder.svg"}
                        alt={purchase.title}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute bottom-2 right-2 bg-black/70 backdrop-blur-sm px-2 py-0.5 rounded text-xs font-medium">
                        {purchase.duration}
                      </div>
                    </div>

                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-medium">{purchase.title}</h3>
                          <p className="text-zinc-400 text-sm">{purchase.description}</p>
                          <p className="text-zinc-500 text-xs mt-1">By {purchase.creator}</p>
                        </div>

                        <div className="flex flex-col items-end">
                          <Badge
                            className={
                              purchase.rarity === "legendary"
                                ? "bg-gradient-to-r from-amber-500 to-yellow-300 text-black border-0"
                                : "bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0"
                            }
                          >
                            {purchase.rarity === "legendary" ? "LEGENDARY NFT" : "RARE NFT"}
                          </Badge>
                          <p className="text-amber-500 font-medium mt-1">{purchase.price} ETH</p>
                          <p className="text-zinc-500 text-xs mt-1">
                            Purchased on {new Date(purchase.purchaseDate).toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      <div className="mt-4 flex gap-2">
                        <Button size="sm" className="bg-cyan-500 hover:bg-cyan-600 text-black">
                          Watch Now
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-cyan-500/30 text-cyan-400 hover:bg-cyan-950/20"
                        >
                          View Details
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="history" className="pt-4">
            <div className="space-y-6">
              {mockWatchHistory.map((video) => (
                <div key={video.id} className="bg-zinc-900 border border-zinc-800 rounded-lg p-3">
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="w-full md:w-48 aspect-video relative rounded-lg overflow-hidden">
                      <Image
                        src={video.thumbnail || "/placeholder.svg"}
                        alt={video.title}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute bottom-2 right-2 bg-black/70 backdrop-blur-sm px-2 py-0.5 rounded text-xs font-medium">
                        {video.duration}
                      </div>

                      {/* Progress bar */}
                      <div className="absolute bottom-0 left-0 right-0 h-1 bg-zinc-800">
                        <div className="h-full bg-cyan-500" style={{ width: `${Math.random() * 100}%` }}></div>
                      </div>
                    </div>

                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-medium">{video.title}</h3>
                          <p className="text-zinc-400 text-sm">{video.description}</p>
                          <p className="text-zinc-500 text-xs mt-1">By {video.creator}</p>
                        </div>

                        <div className="text-right">
                          <p className="text-zinc-500 text-xs">
                            Watched on {new Date(video.watchedDate).toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      <div className="mt-4 flex gap-2">
                        <Button size="sm" className="bg-cyan-500 hover:bg-cyan-600 text-black">
                          Watch Again
                        </Button>
                        <Button size="sm" variant="outline" className="border-zinc-700 text-zinc-400 hover:bg-zinc-800">
                          Remove from History
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </main>
      {/* Edit Profile Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="bg-gradient-to-b from-zinc-900 to-zinc-950 border-2 border-cyan-500/30 text-white sm:max-w-md rounded-3xl shadow-xl shadow-cyan-500/20 p-0 overflow-hidden flex flex-col max-h-[90vh]">
          {/* Decorative elements */}
          <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full bg-cyan-500/10 blur-3xl"></div>
          <div className="absolute -bottom-20 -left-20 w-40 h-40 rounded-full bg-cyan-500/10 blur-3xl"></div>

          {/* Bot-like header */}
          <div className="bg-gradient-to-r from-cyan-600 to-blue-600 p-4 sm:p-6 relative flex-shrink-0">
            <div className="absolute top-0 left-0 right-0 h-1 bg-white/20"></div>
            <div className="flex items-center gap-3 sm:gap-4 pr-8">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-cyan-300 to-cyan-500 p-0.5 shadow-lg shadow-cyan-500/30">
                <div className="w-full h-full rounded-full bg-zinc-900 flex items-center justify-center">
                  <Edit className="h-4 w-4 sm:h-5 sm:w-5 text-cyan-400" />
                </div>
              </div>
              <div>
                <DialogTitle className="text-lg sm:text-xl font-bold text-white">Edit Profile</DialogTitle>
                <DialogDescription className="text-cyan-200/70 text-xs sm:text-sm">
                  Update your profile information
                </DialogDescription>
              </div>
            </div>

            {/* Repositioned close button */}
            <div className="absolute top-4 right-4">
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="w-8 h-8 rounded-full bg-black/30 hover:bg-black/50 backdrop-blur-sm flex items-center justify-center text-white/70 hover:text-white transition-colors"
                aria-label="Close"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M18 6 6 18"></path>
                  <path d="m6 6 12 12"></path>
                </svg>
              </button>
            </div>
          </div>

          <div className="p-4 sm:p-6 space-y-4 sm:space-y-6 overflow-y-auto max-h-[60vh] sm:max-h-[70vh]">
            {/* Avatar Upload */}
            <div className="flex flex-col items-center">
              <div className="relative mb-2">
                <div className="w-20 h-20 sm:w-28 sm:h-28 rounded-full overflow-hidden border-4 border-cyan-500/30 shadow-lg shadow-cyan-500/20 bg-gradient-to-b from-cyan-300/20 to-cyan-700/20">
                  <Image
                    src={mockUser.avatar || "/placeholder.svg"}
                    alt="Profile Avatar"
                    width={112}
                    height={112}
                    className="object-cover"
                  />
                </div>
                <button className="absolute bottom-0 right-0 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 p-0.5 flex items-center justify-center text-black shadow-lg shadow-cyan-500/30 hover:from-cyan-400 hover:to-blue-400 transition-colors">
                  <div className="w-full h-full rounded-full bg-gradient-to-b from-cyan-400 to-cyan-600 flex items-center justify-center">
                    <Camera className="h-4 w-4 sm:h-5 sm:w-5 text-white drop-shadow-md" />
                  </div>
                </button>
              </div>
              <p className="text-xs text-cyan-400 mt-2">Click to upload a new avatar</p>
            </div>

            {/* Form Fields */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="username" className="text-cyan-300 font-medium block mb-1.5">
                  Username
                </Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-cyan-500">@</span>
                  <Input
                    id="username"
                    defaultValue={mockUser.username.replace("@", "")}
                    className="bg-zinc-800/50 border-2 border-cyan-500/20 rounded-xl pl-8 py-5 focus-visible:ring-cyan-500 focus-visible:border-cyan-500/50 placeholder:text-zinc-500"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="displayName" className="text-cyan-300 font-medium block mb-1.5">
                  Display Name
                </Label>
                <Input
                  id="displayName"
                  defaultValue={mockUser.name}
                  className="bg-zinc-800/50 border-2 border-cyan-500/20 rounded-xl py-5 focus-visible:ring-cyan-500 focus-visible:border-cyan-500/50 placeholder:text-zinc-500"
                />
              </div>

              <div>
                <Label htmlFor="bio" className="text-cyan-300 font-medium block mb-1.5">
                  Bio
                </Label>
                <Textarea
                  id="bio"
                  defaultValue={mockUser.bio}
                  className="bg-zinc-800/50 border-2 border-cyan-500/20 rounded-xl focus-visible:ring-cyan-500 focus-visible:border-cyan-500/50 min-h-[80px] placeholder:text-zinc-500"
                />
              </div>

              <div>
                <Label htmlFor="twitter" className="text-cyan-300 font-medium block mb-1.5">
                  Twitter
                </Label>
                <div className="relative">
                  <Twitter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-cyan-500" />
                  <Input
                    id="twitter"
                    placeholder="@username"
                    className="bg-zinc-800/50 border-2 border-cyan-500/20 rounded-xl pl-10 py-5 focus-visible:ring-cyan-500 focus-visible:border-cyan-500/50 placeholder:text-zinc-500"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-cyan-500/10 p-4 sm:p-6 bg-zinc-900/50 flex flex-col sm:flex-row gap-3 justify-end flex-shrink-0 sticky bottom-0">
            <Button
              variant="outline"
              onClick={() => setIsEditModalOpen(false)}
              className="border-2 border-cyan-500/30 text-cyan-400 hover:bg-cyan-950/20 rounded-xl py-5"
            >
              Cancel
            </Button>
            <Button
              className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 rounded-xl py-5 text-white font-medium shadow-lg shadow-cyan-500/20"
              onClick={() => {
                console.log("Saving profile changes with Sui wallet")
                setIsEditModalOpen(false)
              }}
            >
              Save Changes
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
