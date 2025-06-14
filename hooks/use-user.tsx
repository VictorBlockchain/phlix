"use client"

import { createContext, useContext, useEffect, useState, ReactNode } from "react"
import { useWallet } from "@solana/wallet-adapter-react"
import { supabase } from "@/lib/supabase"

interface UserProfile {
  id: string
  username: string
  display_name: string | null
  bio: string | null
  avatar_url: string | null
  banner_url: string | null
  wallet_address: string | null
  is_verified: boolean
  is_creator: boolean
  follower_count: number
  following_count: number
  video_count: number
  nft_count: number
  total_earnings: number
  social_links: any
  preferences: any
  created_at: string
  updated_at: string
}

interface UserContextType {
  profile: UserProfile | null
  isLoading: boolean
  isConnected: boolean
  walletAddress: string | null
  refreshProfile: () => Promise<void>
  ensureProfileInDatabase: () => Promise<boolean>
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export function UserProvider({ children }: { children: ReactNode }) {
  const { connected, publicKey } = useWallet()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const refreshProfile = async () => {
    console.log("refreshProfile called:", { connected, publicKey: publicKey?.toBase58() })

    if (!connected || !publicKey) {
      console.log("No wallet connected, clearing profile")
      setProfile(null)
      setIsLoading(false)
      return
    }

    try {
      setIsLoading(true)
      const walletAddress = publicKey.toBase58()

      let existingProfile = null

      // Try to find user profile by wallet address or ID
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .or(`wallet_address.eq.${walletAddress},id.eq.${walletAddress}`)
          .single()

        if (!error && data) {
          existingProfile = data
        }
      } catch (dbError) {
        console.log("Database not available for profile lookup")
      }

      if (existingProfile) {
        setProfile(existingProfile)
      } else {
        // Create a temporary profile using wallet address as ID
        const tempProfile: UserProfile = {
          id: walletAddress, // Use wallet address as the user ID
          username: `user_${walletAddress.slice(0, 8)}`,
          display_name: null,
          bio: null,
          avatar_url: null,
          banner_url: null,
          wallet_address: walletAddress,
          is_verified: false,
          is_creator: false,
          follower_count: 0,
          following_count: 0,
          video_count: 0,
          nft_count: 0,
          total_earnings: 0,
          social_links: {},
          preferences: {},
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }

        console.log("Created temp profile:", tempProfile)

        // Try to create in database - this is required for video uploads
        try {
          const { data: createdProfile, error: createError } = await supabase
            .from('profiles')
            .insert(tempProfile)
            .select()
            .single()

          if (!createError && createdProfile) {
            console.log("Profile created in database:", createdProfile)
            setProfile(createdProfile)
          } else {
            console.error("Failed to create profile in database:", createError)
            // Use temporary profile - it will work for display but not for database operations
            setProfile(tempProfile)
          }
        } catch (dbError) {
          console.error("Database error creating profile:", dbError)
          // Use temporary profile - it will work for display but not for database operations
          setProfile(tempProfile)
        }
      }
    } catch (error) {
      console.error("Error in refreshProfile:", error)
      setProfile(null)
    } finally {
      setIsLoading(false)
    }
  }

  // Refresh profile when wallet connects/disconnects
  useEffect(() => {
    console.log("Wallet state changed:", { connected, publicKey: publicKey?.toBase58() })
    refreshProfile()
  }, [connected, publicKey])

  const ensureProfileInDatabase = async (): Promise<boolean> => {
    if (!connected || !publicKey) return false

    try {
      const walletAddress = publicKey.toBase58()

      // Check if profile exists
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('*')
        .or(`wallet_address.eq.${walletAddress},id.eq.${walletAddress}`)
        .single()

      if (existingProfile) return true

      // Create profile if it doesn't exist
      const tempProfile: UserProfile = {
        id: walletAddress,
        username: `user_${walletAddress.slice(0, 8)}`,
        display_name: null,
        bio: null,
        avatar_url: null,
        banner_url: null,
        wallet_address: walletAddress,
        is_verified: false,
        is_creator: false,
        follower_count: 0,
        following_count: 0,
        video_count: 0,
        nft_count: 0,
        total_earnings: 0,
        social_links: {},
        preferences: {},
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }

      const { error } = await supabase
        .from('profiles')
        .insert(tempProfile)

      if (!error) {
        await refreshProfile()
        return true
      }

      return false
    } catch (error) {
      console.error("Error ensuring profile in database:", error)
      return false
    }
  }

  const value: UserContextType = {
    profile,
    isLoading,
    isConnected: connected,
    walletAddress: publicKey?.toBase58() || null,
    refreshProfile,
    ensureProfileInDatabase,
  }

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider')
  }
  return context
}

// Helper function to get avatar URL with fallback
export function getAvatarUrl(profile: UserProfile | null, size: number = 40): string {
  if (profile?.avatar_url) {
    return profile.avatar_url
  }
  
  // Generate a placeholder avatar based on username or wallet address
  const identifier = profile?.username || profile?.wallet_address || 'user'

  return `data:image/svg+xml,${encodeURIComponent(`
    <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#60a5fa;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#a855f7;stop-opacity:1" />
        </linearGradient>
      </defs>
      <circle cx="${size/2}" cy="${size/2}" r="${size/2}" fill="url(#grad)" />
      <text x="50%" y="50%" text-anchor="middle" dy="0.35em" fill="white" font-family="system-ui" font-size="${size * 0.4}" font-weight="bold">
        ${identifier.charAt(0).toUpperCase()}
      </text>
    </svg>
  `)}`
}
