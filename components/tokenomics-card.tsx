"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Coins, TrendingUp, Users, ShieldCheck, Sparkles } from "lucide-react"

export default function TokenomicsCard() {
  const [activeTab, setActiveTab] = useState("overview")

  return (
    <Card className="bg-zinc-900/50 border border-zinc-800 overflow-hidden">
      <div className="relative">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-500 via-amber-300 to-amber-500"></div>
        <div className="absolute -top-24 -left-24 w-48 h-48 rounded-full bg-amber-500/10 blur-3xl"></div>
        <div className="absolute -bottom-24 -right-24 w-48 h-48 rounded-full bg-amber-500/10 blur-3xl"></div>

        <Tabs defaultValue="overview" className="w-full" onValueChange={setActiveTab}>
          <div className="px-6 pt-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-amber-400 to-amber-600 flex items-center justify-center">
                <span className="text-sm font-bold text-black">$</span>
              </div>
              <h3 className="text-xl font-bold bg-gradient-to-r from-amber-400 to-amber-200 bg-clip-text text-transparent">
                AIVID Token
              </h3>
            </div>

            <TabsList className="grid grid-cols-4 bg-zinc-800/50">
              <TabsTrigger
                value="overview"
                className={
                  activeTab === "overview" ? "data-[state=active]:bg-amber-500 data-[state=active]:text-black" : ""
                }
              >
                Overview
              </TabsTrigger>
              <TabsTrigger
                value="utility"
                className={
                  activeTab === "utility" ? "data-[state=active]:bg-amber-500 data-[state=active]:text-black" : ""
                }
              >
                Utility
              </TabsTrigger>
              <TabsTrigger
                value="staking"
                className={
                  activeTab === "staking" ? "data-[state=active]:bg-amber-500 data-[state=active]:text-black" : ""
                }
              >
                Staking
              </TabsTrigger>
              <TabsTrigger
                value="governance"
                className={
                  activeTab === "governance" ? "data-[state=active]:bg-amber-500 data-[state=active]:text-black" : ""
                }
              >
                Governance
              </TabsTrigger>
            </TabsList>
          </div>

          <CardContent className="p-6">
            <TabsContent value="overview" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="bg-zinc-800/50 rounded-xl p-4 border border-zinc-700/50">
                  <div className="flex items-center gap-2 mb-2">
                    <Coins className="h-4 w-4 text-amber-400" />
                    <h4 className="font-medium text-sm">Total Supply</h4>
                  </div>
                  <p className="text-2xl font-bold text-white">100,000,000</p>
                  <p className="text-xs text-zinc-400 mt-1">AIVID Tokens</p>
                </div>

                <div className="bg-zinc-800/50 rounded-xl p-4 border border-zinc-700/50">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="h-4 w-4 text-green-400" />
                    <h4 className="font-medium text-sm">Current Price</h4>
                  </div>
                  <p className="text-2xl font-bold text-white">$0.42</p>
                  <p className="text-xs text-green-400 mt-1">+5.3% (24h)</p>
                </div>

                <div className="bg-zinc-800/50 rounded-xl p-4 border border-zinc-700/50">
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="h-4 w-4 text-blue-400" />
                    <h4 className="font-medium text-sm">Holders</h4>
                  </div>
                  <p className="text-2xl font-bold text-white">12,458</p>
                  <p className="text-xs text-zinc-400 mt-1">Unique Addresses</p>
                </div>
              </div>

              <div className="bg-zinc-800/30 rounded-xl p-4 border border-zinc-700/30">
                <h4 className="font-medium mb-2">Token Distribution</h4>
                <div className="h-6 w-full rounded-full overflow-hidden bg-zinc-700/50 mb-4">
                  <div className="flex h-full">
                    <div className="h-full bg-amber-500 w-[30%]" style={{ width: "30%" }}></div>
                    <div className="h-full bg-cyan-500 w-[25%]" style={{ width: "25%" }}></div>
                    <div className="h-full bg-purple-500 w-[20%]" style={{ width: "20%" }}></div>
                    <div className="h-full bg-green-500 w-[15%]" style={{ width: "15%" }}></div>
                    <div className="h-full bg-blue-500 w-[10%]" style={{ width: "10%" }}></div>
                  </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-2 text-xs">
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                    <span className="text-zinc-300">Community (30%)</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-cyan-500"></div>
                    <span className="text-zinc-300">Team (25%)</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                    <span className="text-zinc-300">Treasury (20%)</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    <span className="text-zinc-300">Staking (15%)</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                    <span className="text-zinc-300">Partnerships (10%)</span>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="utility" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-zinc-800/50 rounded-xl p-4 border border-zinc-700/50">
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-amber-400" />
                    Access Premium Content
                  </h4>
                  <p className="text-sm text-zinc-300">
                    Unlock exclusive AI-generated videos and premium features with AIVID tokens.
                  </p>
                </div>

                <div className="bg-zinc-800/50 rounded-xl p-4 border border-zinc-700/50">
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-amber-400" />
                    Create & Mint
                  </h4>
                  <p className="text-sm text-zinc-300">
                    Use tokens to generate your own AI videos and mint them as NFTs on the platform.
                  </p>
                </div>

                <div className="bg-zinc-800/50 rounded-xl p-4 border border-zinc-700/50">
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-amber-400" />
                    Trading & Marketplace
                  </h4>
                  <p className="text-sm text-zinc-300">
                    Buy, sell and trade AI-generated video NFTs using AIVID tokens with reduced fees.
                  </p>
                </div>

                <div className="bg-zinc-800/50 rounded-xl p-4 border border-zinc-700/50">
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <Users className="h-4 w-4 text-amber-400" />
                    Community Rewards
                  </h4>
                  <p className="text-sm text-zinc-300">
                    Earn tokens by participating in the community, curating content, and referring users.
                  </p>
                </div>
              </div>

              <div className="mt-4 flex justify-center">
                <Button className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-black font-medium">
                  <Coins className="mr-2 h-4 w-4" /> Get AIVID Tokens
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="staking" className="mt-0">
              <div className="bg-zinc-800/50 rounded-xl p-4 border border-zinc-700/50 mb-4">
                <h4 className="font-medium mb-2">Staking Rewards</h4>
                <p className="text-sm text-zinc-300 mb-4">
                  Stake your AIVID tokens to earn passive income and unlock platform benefits.
                </p>

                <div className="grid grid-cols-3 gap-2 mb-4">
                  <div className="bg-zinc-700/50 rounded-lg p-3 text-center">
                    <p className="text-xs text-zinc-400">1 Month</p>
                    <p className="text-lg font-bold text-amber-400">4% APY</p>
                  </div>
                  <div className="bg-zinc-700/50 rounded-lg p-3 text-center">
                    <p className="text-xs text-zinc-400">3 Months</p>
                    <p className="text-lg font-bold text-amber-400">8% APY</p>
                  </div>
                  <div className="bg-zinc-700/50 rounded-lg p-3 text-center">
                    <p className="text-xs text-zinc-400">6 Months</p>
                    <p className="text-lg font-bold text-amber-400">15% APY</p>
                  </div>
                </div>

                <Button className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-black font-medium">
                  Stake Your Tokens
                </Button>
              </div>

              <div className="bg-zinc-800/30 rounded-xl p-4 border border-zinc-700/30">
                <h4 className="font-medium mb-2">Your Staking Stats</h4>
                <p className="text-sm text-zinc-400 mb-4">Connect your wallet to view your staking statistics</p>

                <Button variant="outline" className="w-full border-amber-500/30 text-amber-400 hover:bg-amber-950/20">
                  Connect Wallet
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="governance" className="mt-0">
              <div className="bg-zinc-800/50 rounded-xl p-4 border border-zinc-700/50 mb-4">
                <h4 className="font-medium mb-2">Community Governance</h4>
                <p className="text-sm text-zinc-300 mb-4">
                  AIVID token holders can vote on platform decisions and feature proposals.
                </p>

                <div className="space-y-3 mb-4">
                  <div className="bg-zinc-700/50 rounded-lg p-3">
                    <div className="flex justify-between items-center mb-1">
                      <h5 className="text-sm font-medium">Add Music Generation</h5>
                      <span className="text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full">Active</span>
                    </div>
                    <p className="text-xs text-zinc-400 mb-2">Proposal to add AI music generation to video creation</p>
                    <div className="flex justify-between text-xs text-zinc-400">
                      <span>Votes: 1,245</span>
                      <span>Ends in 2 days</span>
                    </div>
                  </div>

                  <div className="bg-zinc-700/50 rounded-lg p-3">
                    <div className="flex justify-between items-center mb-1">
                      <h5 className="text-sm font-medium">Reduce Minting Fees</h5>
                      <span className="text-xs bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded-full">Pending</span>
                    </div>
                    <p className="text-xs text-zinc-400 mb-2">Proposal to reduce NFT minting fees by 20%</p>
                    <div className="flex justify-between text-xs text-zinc-400">
                      <span>Votes: 892</span>
                      <span>Starts in 1 day</span>
                    </div>
                  </div>
                </div>

                <Button className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-medium">
                  View All Proposals
                </Button>
              </div>
            </TabsContent>
          </CardContent>
        </Tabs>
      </div>
    </Card>
  )
}
