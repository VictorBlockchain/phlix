import { createClient } from '@supabase/supabase-js'
import { Database } from './database.types'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  },
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  }
})

// Storage bucket names
export const STORAGE_BUCKETS = {
  VIDEOS: process.env.NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET_VIDEOS || 'videos',
  IMAGES: process.env.NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET_IMAGES || 'images',
  AVATARS: process.env.NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET_AVATARS || 'avatars',
} as const

// Helper functions for file uploads
export const uploadFile = async (
  bucket: keyof typeof STORAGE_BUCKETS,
  path: string,
  file: File,
  options?: { cacheControl?: string; upsert?: boolean }
) => {
  const { data, error } = await supabase.storage
    .from(STORAGE_BUCKETS[bucket])
    .upload(path, file, {
      cacheControl: options?.cacheControl || '3600',
      upsert: options?.upsert || false
    })

  if (error) {
    throw new Error(`Upload failed: ${error.message}`)
  }

  return data
}

export const getPublicUrl = (bucket: keyof typeof STORAGE_BUCKETS, path: string) => {
  const { data } = supabase.storage
    .from(STORAGE_BUCKETS[bucket])
    .getPublicUrl(path)

  return data.publicUrl
}

export const deleteFile = async (bucket: keyof typeof STORAGE_BUCKETS, path: string) => {
  const { error } = await supabase.storage
    .from(STORAGE_BUCKETS[bucket])
    .remove([path])

  if (error) {
    throw new Error(`Delete failed: ${error.message}`)
  }
}

// Real-time subscriptions
export const subscribeToVideoUpdates = (callback: (payload: any) => void) => {
  return supabase
    .channel('video-updates')
    .on('postgres_changes', 
      { event: '*', schema: 'public', table: 'videos' }, 
      callback
    )
    .subscribe()
}

export const subscribeToMessages = (conversationId: string, callback: (payload: any) => void) => {
  return supabase
    .channel(`messages-${conversationId}`)
    .on('postgres_changes', 
      { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'messages',
        filter: `conversation_id=eq.${conversationId}`
      }, 
      callback
    )
    .subscribe()
}

export const subscribeToNotifications = (userId: string, callback: (payload: any) => void) => {
  return supabase
    .channel(`notifications-${userId}`)
    .on('postgres_changes', 
      { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'notifications',
        filter: `user_id=eq.${userId}`
      }, 
      callback
    )
    .subscribe()
}

// Auth helpers
export const signUp = async (email: string, password: string, metadata?: any) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: metadata
    }
  })

  if (error) {
    throw new Error(`Sign up failed: ${error.message}`)
  }

  return data
}

export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  })

  if (error) {
    throw new Error(`Sign in failed: ${error.message}`)
  }

  return data
}

export const signOut = async () => {
  const { error } = await supabase.auth.signOut()

  if (error) {
    throw new Error(`Sign out failed: ${error.message}`)
  }
}

export const getCurrentUser = async () => {
  const { data: { user }, error } = await supabase.auth.getUser()

  if (error) {
    throw new Error(`Get user failed: ${error.message}`)
  }

  return user
}

// Database helpers
export const getProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()

  if (error) {
    throw new Error(`Get profile failed: ${error.message}`)
  }

  return data
}

export const updateProfile = async (userId: string, updates: any) => {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
    .select()
    .single()

  if (error) {
    throw new Error(`Update profile failed: ${error.message}`)
  }

  return data
}

export const getVideos = async (filters?: {
  category?: string
  isPublic?: boolean
  creatorId?: string
  limit?: number
  offset?: number
}) => {
  let query = supabase
    .from('videos')
    .select(`
      *,
      creator:profiles(id, username, display_name, avatar_url, is_verified),
      nft:nfts(*)
    `)

  if (filters?.category) {
    query = query.eq('category', filters.category)
  }

  if (filters?.isPublic !== undefined) {
    query = query.eq('is_public', filters.isPublic)
  }

  if (filters?.creatorId) {
    query = query.eq('creator_id', filters.creatorId)
  }

  query = query
    .order('created_at', { ascending: false })
    .limit(filters?.limit || 20)

  if (filters?.offset) {
    query = query.range(filters.offset, filters.offset + (filters.limit || 20) - 1)
  }

  const { data, error } = await query

  if (error) {
    throw new Error(`Get videos failed: ${error.message}`)
  }

  return data
}

export const createVideo = async (videoData: any) => {
  const { data, error } = await supabase
    .from('videos')
    .insert(videoData)
    .select()
    .single()

  if (error) {
    throw new Error(`Create video failed: ${error.message}`)
  }

  return data
}

export const getConversations = async (userId: string) => {
  const { data, error } = await supabase
    .from('conversations')
    .select(`
      *,
      last_message:messages(content, created_at, sender:profiles(username, display_name, avatar_url))
    `)
    .contains('participant_ids', [userId])
    .order('last_message_at', { ascending: false })

  if (error) {
    throw new Error(`Get conversations failed: ${error.message}`)
  }

  return data
}

export const getMessages = async (conversationId: string, limit = 50) => {
  const { data, error } = await supabase
    .from('messages')
    .select(`
      *,
      sender:profiles(id, username, display_name, avatar_url)
    `)
    .eq('conversation_id', conversationId)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) {
    throw new Error(`Get messages failed: ${error.message}`)
  }

  return data?.reverse() || []
}

export const sendMessage = async (messageData: any) => {
  const { data, error } = await supabase
    .from('messages')
    .insert(messageData)
    .select()
    .single()

  if (error) {
    throw new Error(`Send message failed: ${error.message}`)
  }

  return data
}
