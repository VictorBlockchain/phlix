"use client"

import { useState, useRef, useEffect } from "react"
import { useWallet } from "@solana/wallet-adapter-react"
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui"
import { User, LogOut, Copy, Check } from "lucide-react"
import { useUser, getAvatarUrl } from "@/hooks/use-user"

interface WalletConnectProps {
  className?: string
  iconOnly?: boolean
}

export function WalletConnect({ className = "", iconOnly = false }: WalletConnectProps) {
  const { disconnect } = useWallet()
  const { profile, walletAddress } = useUser()
  const [isLoading, setIsLoading] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [addressCopied, setAddressCopied] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Debug logging
  console.log("WalletConnect render:", {
    profile,
    walletAddress,
    iconOnly,
    avatarUrl: profile ? getAvatarUrl(profile, 36) : 'no profile'
  })

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleDisconnect = async () => {
    try {
      setIsLoading(true)
      await disconnect()
      setIsDropdownOpen(false)
    } catch (error) {
      console.error("Failed to disconnect wallet:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCopyAddress = async () => {
    if (walletAddress) {
      try {
        await navigator.clipboard.writeText(walletAddress)
        setAddressCopied(true)
        setTimeout(() => setAddressCopied(false), 2000)
      } catch (error) {
        console.error("Failed to copy address:", error)
      }
    }
  }

  const formatAddress = (address: string) => {
    return `${address.slice(0, 4)}...${address.slice(-4)}`
  }

  // For mobile menu - show nothing (no wallet UI on mobile)
  if (!iconOnly) {
    return null
  }

  // Only show avatar when wallet is connected
  if (!walletAddress) {
    return (
      <div className={`hidden md:block ${className}`}>
        <div className="w-9 h-9 rounded-full bg-zinc-800 flex items-center justify-center text-xs text-zinc-400">
          No Wallet
        </div>
      </div>
    )
  }

  return (
    <div className={`hidden md:block relative ${className}`} ref={dropdownRef}>
      <button
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="w-9 h-9 rounded-full overflow-hidden hover:ring-2 hover:ring-zinc-600 transition-all"
      >
        <img
          src={getAvatarUrl(profile, 36)}
          alt={profile?.display_name || profile?.username || "User"}
          className="w-full h-full object-cover"
        />
      </button>

      {/* Dropdown Menu */}
      {isDropdownOpen && (
        <div className="absolute right-0 top-full mt-2 w-56 bg-zinc-900 border border-zinc-700 rounded-lg shadow-xl shadow-black/20 z-50">
          <div className="p-3">
            {/* Wallet Section */}
            {walletAddress ? (
              <div className="mb-3">
                <div className="flex items-center gap-2 mb-2">
                  <p className="text-xs text-zinc-400 font-mono flex-1">
                    {formatAddress(walletAddress)}
                  </p>
                  <button
                    onClick={handleCopyAddress}
                    className="p-1 hover:bg-zinc-700 rounded transition-colors"
                    title="Copy address"
                  >
                    {addressCopied ? (
                      <Check className="h-3 w-3 text-green-400" />
                    ) : (
                      <Copy className="h-3 w-3 text-zinc-400" />
                    )}
                  </button>
                </div>
                <button
                  onClick={handleDisconnect}
                  disabled={isLoading}
                  className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-400 hover:bg-red-950/20 rounded-md transition-colors disabled:opacity-50 mb-2"
                >
                  <LogOut className="h-4 w-4" />
                  {isLoading ? "Disconnecting..." : "Disconnect Wallet"}
                </button>
              </div>
            ) : (
              <div className="mb-3">
                <WalletMultiButton className="!w-full !h-9 !text-sm !bg-gradient-to-r !from-blue-500 !to-purple-600 hover:!from-blue-600 hover:!to-purple-700 !border-0 !rounded-md" />
              </div>
            )}

            {/* Profile Link */}
            <a
              href="/profile"
              className="flex items-center gap-3 px-3 py-2 text-sm text-zinc-300 hover:bg-zinc-800 rounded-md transition-colors"
              onClick={() => setIsDropdownOpen(false)}
            >
              <User className="h-4 w-4" />
              View Profile
            </a>
          </div>
        </div>
      )}
    </div>
  )
}


