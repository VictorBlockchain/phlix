"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Search, Menu, X, Sparkles, Clock, TvIcon, Home, Compass, User, Settings } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"
import { useChatToggle } from "@/hooks/use-chat-toggle"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { WalletConnect } from "@/components/wallet-connect"

interface HeaderProps {
  visible: boolean
}

export default function Header({ visible }: HeaderProps) {
  const [searchOpen, setSearchOpen] = useState(false)
  const [scrollPosition, setScrollPosition] = useState(0)
  const { toggleChat } = useChatToggle()

  // Track scroll position for parallax effect
  useEffect(() => {
    if (typeof window === "undefined") return

    const handleScroll = () => {
      setScrollPosition(window.scrollY)
    }
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        visible ? "translate-y-0" : "-translate-y-full",
      )}
    >
      {/* Decorative top border with gradient */}
      <div className="h-1 bg-gradient-to-r from-blue-500 via-purple-400 to-blue-300"></div>

      {/* Glassmorphism background with subtle pattern */}
      <div
        className="absolute inset-0 bg-zinc-950/80 backdrop-blur-md z-[-1] overflow-hidden"
        style={{
          backgroundImage: `radial-gradient(circle at 50% 50%, rgba(56, 189, 248, 0.03) 0%, transparent 25%)`,
        }}
      >
        {/* Animated floating particles */}
        <div className="absolute top-1/4 left-1/4 w-32 h-32 rounded-full bg-blue-500/5 blur-xl animate-float-slow"></div>
        <div className="absolute top-1/3 right-1/3 w-24 h-24 rounded-full bg-purple-500/5 blur-xl animate-float-medium"></div>
        <div className="absolute bottom-1/4 right-1/4 w-40 h-40 rounded-full bg-blue-500/5 blur-xl animate-float-fast"></div>
      </div>

      {/* Search Modal */}
      <Dialog open={searchOpen} onOpenChange={setSearchOpen}>
        <DialogContent className="bg-zinc-900 border border-zinc-800 text-white sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold bg-gradient-to-r from-blue-300 to-purple-500 bg-clip-text text-transparent">
              Search Phlix
            </DialogTitle>
          </DialogHeader>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-zinc-500" />
            <Input
              autoFocus
              placeholder="Search videos, creators, collections..."
              className="pl-9 bg-zinc-800 border-zinc-700 focus-visible:ring-purple-500"
            />
          </div>
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium text-zinc-400 mb-2">Recent Searches</h4>
              <div className="space-y-2">
                {["cyberpunk city", "abstract animation", "robot character"].map((term) => (
                  <div
                    key={term}
                    className="flex items-center justify-between p-2 hover:bg-zinc-800 rounded-md cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-zinc-500" />
                      <span className="text-sm">{term}</span>
                    </div>
                    <X className="h-4 w-4 text-zinc-500 hover:text-zinc-300" />
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-sm font-medium text-zinc-400 mb-2">Trending</h4>
              <div className="flex flex-wrap gap-2">
                {["AI landscapes", "character animation", "abstract art", "cyberpunk", "neon city"].map((tag) => (
                  <div
                    key={tag}
                    className="px-3 py-1 bg-zinc-800 hover:bg-zinc-700 rounded-full text-xs cursor-pointer"
                  >
                    {tag}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <div className="container mx-auto px-4 h-16 flex items-center">
        {/* Left section - Logo */}
        <div className="flex-1">
          <Link href="/" className="flex items-center group w-fit">
            <div className="flex flex-col">
              <div className="flex items-center">
                <span className="font-bold text-xl font-serif tracking-wide flex items-center">
                  <span className="mr-1 inline-flex items-center justify-center">
                    <TvIcon className="h-4 w-4 text-amber-400" />
                  </span>
                  <span className="bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 bg-clip-text text-transparent">
                    Ph
                  </span>
                  <span className="text-white">lix</span>
                </span>
              </div>
              <span className="text-[10px] text-blue-400/80 -mt-1 tracking-wider">Ai Video NFT's</span>
            </div>
          </Link>
        </div>

        {/* Center section - Navigation */}
        <div className="flex-1 flex justify-center">
          <nav className="hidden md:flex items-center space-x-6">
            <Link
              href="/"
              className="text-sm font-medium hover:text-blue-400 transition-colors flex items-center gap-2 group"
            >
              <Home className="h-4 w-4 text-zinc-400 group-hover:text-blue-400 transition-colors" />
              <span className="bg-gradient-to-r from-white to-white bg-[length:0%_1px] group-hover:bg-[length:100%_1px] bg-no-repeat bg-bottom transition-all duration-300">
                Home
              </span>
            </Link>
            <Link
              href="/discover"
              className="text-sm font-medium hover:text-blue-400 transition-colors flex items-center gap-2 group"
            >
              <Compass className="h-4 w-4 text-zinc-400 group-hover:text-blue-400 transition-colors" />
              <span className="bg-gradient-to-r from-white to-white bg-[length:0%_1px] group-hover:bg-[length:100%_1px] bg-no-repeat bg-bottom transition-all duration-300">
                Discover
              </span>
            </Link>
            <Link
              href="/create"
              className="text-sm font-medium hover:text-blue-400 transition-colors flex items-center gap-2 group"
            >
              <Sparkles className="h-4 w-4 text-zinc-400 group-hover:text-blue-300 transition-colors" />
              <span className="bg-gradient-to-r from-blue-400 to-blue-400 bg-[length:0%_1px] group-hover:bg-[length:100%_1px] bg-no-repeat bg-bottom transition-all duration-300">
                Create
              </span>
            </Link>
          </nav>
        </div>

        {/* Right section - Actions */}
        <div className="flex-1 flex items-center justify-end gap-4">
          {/* Search button that opens modal */}
          <button
            onClick={() => setSearchOpen(true)}
            className="flex items-center justify-center w-9 h-9 rounded-full bg-zinc-800/50 hover:bg-zinc-800 transition-colors border border-zinc-700/50 text-zinc-400 hover:text-white"
          >
            <Search className="h-4 w-4" />
          </button>

          {/* Custom styled wallet button */}
          <WalletConnect iconOnly={true} />

          {/* Mobile menu button */}
          <Sheet>
            <SheetTrigger asChild>
              <button className="md:hidden flex items-center justify-center w-9 h-9 rounded-full bg-zinc-800/50 hover:bg-zinc-800 transition-colors border border-zinc-700/50 text-zinc-400 hover:text-white">
                <Menu className="h-5 w-5" />
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-zinc-900/95 backdrop-blur-xl text-zinc-100 border-zinc-800">
              <div className="flex flex-col h-full">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-8 mt-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-600 flex items-center justify-center">
                        <span className="font-bold text-black">P</span>
                      </div>
                      <span className="font-bold text-lg">Phlix</span>
                    </div>
                  </div>
                  <nav className="flex flex-col gap-4">
                    <Link href="/" className="text-lg font-medium hover:text-blue-400 transition-colors flex items-center gap-3">
                      <Home className="h-5 w-5 text-blue-400" />
                      Home
                    </Link>
                    <Link href="/discover" className="text-lg font-medium hover:text-blue-400 transition-colors flex items-center gap-3">
                      <Compass className="h-5 w-5 text-blue-400" />
                      Discover
                    </Link>
                    <Link
                      href="/create"
                      className="text-lg font-medium hover:text-blue-400 transition-colors flex items-center gap-3"
                    >
                      <Sparkles className="h-5 w-5 text-blue-400" />
                      Create
                    </Link>
                    <Link href="/profile" className="text-lg font-medium hover:text-blue-400 transition-colors flex items-center gap-3">
                      <User className="h-5 w-5 text-zinc-400" />
                      Profile
                    </Link>
                    {/* <Link href="/settings" className="text-lg font-medium hover:text-blue-400 transition-colors flex items-center gap-3">
                      <Settings className="h-5 w-5 text-zinc-400" />
                      Settings
                    </Link> */}
                  </nav>
                </div>
                
                <div className="py-4">
                  <WalletConnect iconOnly={false} />
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
