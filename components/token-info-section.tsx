"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Coins, TrendingUp, Shield, Sparkles, ChevronRight, BarChart3, Zap, Users, Play, Heart, Crown, Tv } from "lucide-react"

export default function TokenInfoSection() {
  const [activeTab, setActiveTab] = useState("overview")

  return (
    <div className="container mx-auto px-4" style={{ marginBottom: '133px' }}>
    <section className="py-20 relative overflow-hidden bg-gradient-to-b from-zinc-950 to-zinc-900">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-500/0 via-amber-500 to-amber-500/0"></div>
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full bg-gradient-to-r from-amber-500/20 to-amber-600/20 blur-xl"></div>

      <div className="absolute -top-40 -left-40 w-80 h-80 rounded-full bg-amber-500/10 blur-[100px]"></div>
      <div className="absolute -bottom-40 -right-40 w-80 h-80 rounded-full bg-amber-500/10 blur-[100px]"></div>

      <div className="container mx-auto px-4">
        <div className="text-center mb-16 relative">
          <div className="inline-block">
            <h2 className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-amber-300 to-amber-500 bg-clip-text text-transparent mb-6">
              Phlix Token
            </h2>
            <div className="flex items-center justify-center gap-2 mb-8">
              <div className="h-1 w-16 bg-amber-500/30 rounded-full"></div>
              <div className="px-3 py-1 bg-amber-500/10 rounded-full border border-amber-500/20 text-amber-400 text-sm font-medium">
                $PHLIX
              </div>
              <div className="h-1 w-16 bg-amber-500/30 rounded-full"></div>
            </div>
          </div>

          {/* Main value proposition */}
          <div className="max-w-4xl mx-auto space-y-6">
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
              Turn your AI generated videos into NFTs
            </h3>
            <p className="text-zinc-300 text-lg md:text-xl leading-relaxed">
              Powered by the Phlix token
            </p>

            {/* Netflix comparison */}
            <div className="bg-gradient-to-r from-zinc-900/50 to-zinc-800/50 rounded-2xl p-6 border border-zinc-700/50 backdrop-blur-sm">
              <div className="flex items-center justify-center gap-3 mb-4">
                <Tv className="h-8 w-8 text-amber-400" />
                <span className="text-xl font-bold text-white">It's like Netflix for AI generated content</span>
              </div>
              <p className="text-amber-400 font-medium text-lg">24/7 creative videos</p>
              <Button className="mt-3 w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-black font-medium h-12 rounded-xl shadow-lg shadow-amber-500/20 group relative overflow-hidden">
                  <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-amber-400/0 via-amber-400/30 to-amber-400/0 animate-shimmer"></span>
                  <span className="relative flex items-center justify-center">
                    <span className="mr-2">Buy $PHLIX Tokens</span>
                    <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </Button>
            </div>

            {/* Key features */}
            <div className="grid md:grid-cols-2 gap-6 mt-8">
              <div className="bg-zinc-900/30 rounded-xl p-6 border border-zinc-700/30">
                <div className="flex items-center gap-3 mb-3">
                  <Crown className="h-6 w-6 text-amber-400" />
                  <h4 className="text-lg font-semibold text-white">Own Your Videos as NFTs</h4>
                </div>
                <p className="text-zinc-400">
                  Transform your AI-generated videos into valuable NFTs and build your digital collection
                </p>
              </div>
              
              <div className="bg-zinc-900/30 rounded-xl p-6 border border-zinc-700/30">
                <div className="flex items-center gap-3 mb-3">
                  <Heart className="h-6 w-6 text-amber-400" />
                  <h4 className="text-lg font-semibold text-white">Follow Your Favorite Creators</h4>
                </div>
                <p className="text-zinc-400">
                  Discover and support talented AI video creators in the Phlix community
                </p>
              </div>
            </div>
          </div>
        </div>
        
      </div>
    </section>
    </div>
  )
}
