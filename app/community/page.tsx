"use client"

import { useState } from "react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { TrendingUp, Calendar, Search, MessageSquare, Heart, Share2, User, Users } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function CommunityPage() {
  const [activeTab, setActiveTab] = useState("trending")

  const featuredCreators = [
    {
      id: "1",
      name: "PixelMaster",
      avatar: "/placeholder.svg?height=100&width=100",
      role: "3D Artist",
      followers: 1245,
      videos: 32,
    },
    {
      id: "2",
      name: "NeuralArtist",
      avatar: "/placeholder.svg?height=100&width=100",
      role: "Animation Expert",
      followers: 876,
      videos: 18,
    },
    {
      id: "3",
      name: "TechnoCreative",
      avatar: "/placeholder.svg?height=100&width=100",
      role: "VFX Designer",
      followers: 2103,
      videos: 45,
    },
    {
      id: "4",
      name: "CyberVision",
      avatar: "/placeholder.svg?height=100&width=100",
      role: "Concept Artist",
      followers: 543,
      videos: 12,
    },
  ]

  const communityPosts = [
    {
      id: "1",
      user: {
        name: "PixelMaster",
        avatar: "/placeholder.svg?height=50&width=50",
      },
      title: "Created this cyberpunk cityscape using the new BotBox v2 model",
      content:
        "I've been experimenting with the new BotBox v2 model and the results are incredible! Check out this cyberpunk cityscape I generated with just a few prompts.",
      image: "/placeholder.svg?height=400&width=600",
      likes: 124,
      comments: 32,
      shares: 18,
      time: "2 hours ago",
      tags: ["cyberpunk", "cityscape", "botboxv2"],
    },
    {
      id: "2",
      user: {
        name: "NeuralArtist",
        avatar: "/placeholder.svg?height=50&width=50",
      },
      title: "Tutorial: How to create seamless looping animations",
      content:
        "In this tutorial, I'll show you how to create perfect looping animations using BotBox. The key is in the prompt engineering and parameter settings.",
      image: "/placeholder.svg?height=400&width=600",
      likes: 89,
      comments: 24,
      shares: 42,
      time: "5 hours ago",
      tags: ["tutorial", "animation", "loops"],
    },
    {
      id: "3",
      user: {
        name: "TechnoCreative",
        avatar: "/placeholder.svg?height=50&width=50",
      },
      title: "Just minted my first BotBox NFT collection!",
      content:
        "After weeks of generating and curating, I've finally minted my first collection of AI-generated videos as NFTs. The process was surprisingly smooth!",
      image: "/placeholder.svg?height=400&width=600",
      likes: 215,
      comments: 56,
      shares: 28,
      time: "1 day ago",
      tags: ["nft", "collection", "minting"],
    },
  ]

  const upcomingEvents = [
    {
      id: "1",
      title: "BotBox Creator Workshop",
      date: "June 15, 2023",
      time: "2:00 PM UTC",
      attendees: 156,
      image: "/placeholder.svg?height=200&width=400",
    },
    {
      id: "2",
      title: "AI Video Art Competition",
      date: "June 20, 2023",
      time: "All Day",
      attendees: 324,
      image: "/placeholder.svg?height=200&width=400",
    },
    {
      id: "3",
      title: "NFT Marketplace Launch Party",
      date: "June 25, 2023",
      time: "6:00 PM UTC",
      attendees: 512,
      image: "/placeholder.svg?height=200&width=400",
    },
  ]

  return (
    <div className="min-h-screen pt-16 bg-zinc-950">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 bg-clip-text text-transparent">
              BotBox Community
            </h1>
            <p className="text-zinc-400 mt-1">Connect with creators, share your work, and get inspired</p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-zinc-500" />
              <Input
                placeholder="Search community..."
                className="pl-9 bg-zinc-900 border-zinc-800 focus-visible:ring-amber-500 w-full md:w-[250px]"
              />
            </div>
            <Button className="bg-amber-600 hover:bg-amber-700">Create Post</Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Community feed tabs */}
            <div className="bg-zinc-900 rounded-lg border border-zinc-800 overflow-hidden">
              <Tabs defaultValue="trending" value={activeTab} onValueChange={setActiveTab}>
                <div className="border-b border-zinc-800 px-4">
                  <TabsList className="bg-transparent border-b-0 h-14">
                    <TabsTrigger
                      value="trending"
                      className="data-[state=active]:bg-transparent data-[state=active]:text-amber-400 data-[state=active]:border-b-2 data-[state=active]:border-amber-400 rounded-none h-14"
                    >
                      <TrendingUp className="mr-2 h-4 w-4" /> Trending
                    </TabsTrigger>
                    <TabsTrigger
                      value="latest"
                      className="data-[state=active]:bg-transparent data-[state=active]:text-amber-400 data-[state=active]:border-b-2 data-[state=active]:border-amber-400 rounded-none h-14"
                    >
                      <Calendar className="mr-2 h-4 w-4" /> Latest
                    </TabsTrigger>
                  </TabsList>
                </div>

                <TabsContent value="trending" className="p-0 m-0">
                  <div className="p-4 space-y-6">
                    {communityPosts.map((post) => (
                      <Card key={post.id} className="bg-zinc-800 border-zinc-700">
                        <CardHeader className="pb-2">
                          <div className="flex items-center gap-3">
                            <Avatar>
                              <AvatarImage src={post.user.avatar || "/placeholder.svg"} alt={post.user.name} />
                              <AvatarFallback>{post.user.name.substring(0, 2)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium text-white">{post.user.name}</div>
                              <div className="text-xs text-zinc-400">{post.time}</div>
                            </div>
                          </div>
                          <h3 className="text-lg font-medium mt-2">{post.title}</h3>
                        </CardHeader>
                        <CardContent className="pb-2">
                          <p className="text-zinc-300 mb-4">{post.content}</p>
                          <div className="rounded-lg overflow-hidden">
                            <img
                              src={post.image || "/placeholder.svg"}
                              alt={post.title}
                              className="w-full h-auto object-cover"
                            />
                          </div>
                          <div className="flex flex-wrap gap-2 mt-4">
                            {post.tags.map((tag) => (
                              <Badge
                                key={tag}
                                variant="outline"
                                className="bg-zinc-700 hover:bg-zinc-600 text-zinc-300"
                              >
                                #{tag}
                              </Badge>
                            ))}
                          </div>
                        </CardContent>
                        <CardFooter className="border-t border-zinc-700 pt-3">
                          <div className="flex items-center justify-between w-full">
                            <Button variant="ghost" size="sm" className="text-zinc-400 hover:text-amber-400">
                              <Heart className="h-4 w-4 mr-1" /> {post.likes}
                            </Button>
                            <Button variant="ghost" size="sm" className="text-zinc-400 hover:text-amber-400">
                              <MessageSquare className="h-4 w-4 mr-1" /> {post.comments}
                            </Button>
                            <Button variant="ghost" size="sm" className="text-zinc-400 hover:text-amber-400">
                              <Share2 className="h-4 w-4 mr-1" /> {post.shares}
                            </Button>
                          </div>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="latest" className="p-0 m-0">
                  <div className="p-4 text-center py-12">
                    <Calendar className="h-12 w-12 mx-auto text-zinc-500 mb-3" />
                    <h3 className="text-xl font-medium">Latest posts coming soon</h3>
                    <p className="text-zinc-400 mt-2">We're working on bringing you the freshest content</p>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Featured creators */}
            <div className="bg-zinc-900 rounded-lg border border-zinc-800 overflow-hidden">
              <div className="p-4 border-b border-zinc-800 flex items-center justify-between">
                <h2 className="font-medium text-white flex items-center">
                  <Users className="h-4 w-4 mr-2 text-amber-400" /> Featured Creators
                </h2>
                <Button variant="link" className="text-amber-400 p-0 h-auto">
                  View All
                </Button>
              </div>
              <div className="p-4">
                <div className="space-y-4">
                  {featuredCreators.map((creator) => (
                    <div key={creator.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={creator.avatar || "/placeholder.svg"} alt={creator.name} />
                          <AvatarFallback>{creator.name.substring(0, 2)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium text-white">{creator.name}</div>
                          <div className="text-xs text-zinc-400">{creator.role}</div>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 border-amber-500 text-amber-400 hover:bg-amber-500 hover:text-black"
                      >
                        Follow
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Upcoming events */}
            <div className="bg-zinc-900 rounded-lg border border-zinc-800 overflow-hidden">
              <div className="p-4 border-b border-zinc-800">
                <h2 className="font-medium text-white flex items-center">
                  <Calendar className="h-4 w-4 mr-2 text-amber-400" /> Upcoming Events
                </h2>
              </div>
              <div className="p-4">
                <div className="space-y-4">
                  {upcomingEvents.map((event) => (
                    <div key={event.id} className="space-y-2">
                      <div className="rounded-lg overflow-hidden">
                        <img
                          src={event.image || "/placeholder.svg"}
                          alt={event.title}
                          className="w-full h-32 object-cover"
                        />
                      </div>
                      <h3 className="font-medium text-white">{event.title}</h3>
                      <div className="flex items-center justify-between text-sm">
                        <div className="text-zinc-400">
                          {event.date} • {event.time}
                        </div>
                        <div className="text-amber-400 flex items-center">
                          <User className="h-3 w-3 mr-1" /> {event.attendees}
                        </div>
                      </div>
                      <Button className="w-full bg-zinc-800 hover:bg-zinc-700 mt-1">Join Event</Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
