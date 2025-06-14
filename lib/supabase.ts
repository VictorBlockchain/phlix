import { createClient } from '@supabase/supabase-js'
import { Database } from './database.types'
import { FILE_LIMITS, SUPPORTED_FORMATS, getFileSizeLimit, formatFileSize, mbToBytes } from './config'

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
  options?: { cacheControl?: string; upsert?: boolean; maxSizeMB?: number }
) => {
  // Use configuration-based size limits
  const maxSizeMB = options?.maxSizeMB || getFileSizeLimit(file.type)
  const maxSizeBytes = mbToBytes(maxSizeMB)

  // Check file size
  if (file.size > maxSizeBytes) {
    const fileType = file.type.startsWith('video/') ? 'video' :
                    file.type.startsWith('image/') ? 'image' : 'file'
    throw new Error(`${fileType} size (${formatFileSize(file.size)}) exceeds maximum allowed size of ${maxSizeMB}MB`)
  }

  const { data, error } = await supabase.storage
    .from(STORAGE_BUCKETS[bucket])
    .upload(path, file, {
      cacheControl: options?.cacheControl || '3600',
      upsert: options?.upsert || false
    })

  if (error) {
    // Provide more helpful error messages
    if (error.message.includes('exceeded the maximum allowed size')) {
      throw new Error(`File too large. Maximum size allowed is ${maxSizeMB}MB. Please compress your file and try again.`)
    }
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

// Enhanced upload with file size checking and progress
export const uploadVideoFile = async (
  bucket: keyof typeof STORAGE_BUCKETS,
  path: string,
  file: File,
  options?: {
    cacheControl?: string
    upsert?: boolean
    onProgress?: (progress: number) => void
    maxSizeMB?: number
  }
) => {
  const maxSizeMB = options?.maxSizeMB || FILE_LIMITS.VIDEO_MAX_SIZE_MB
  const maxSizeBytes = mbToBytes(maxSizeMB)

  // Check file size
  if (file.size > maxSizeBytes) {
    throw new Error(`File size (${formatFileSize(file.size)}) exceeds maximum allowed size of ${maxSizeMB}MB. Please compress your video or choose a smaller file.`)
  }

  // Check file type
  if (!file.type.startsWith('video/')) {
    throw new Error('Please select a valid video file')
  }

  // Check if format is supported
  if (!SUPPORTED_FORMATS.VIDEO.includes(file.type)) {
    throw new Error(`Unsupported video format. Please use: ${SUPPORTED_FORMATS.VIDEO.map(f => f.split('/')[1].toUpperCase()).join(', ')}`)
  }

  // Use regular upload for all files under 50MB
  const { data, error } = await supabase.storage
    .from(STORAGE_BUCKETS[bucket])
    .upload(path, file, {
      cacheControl: options?.cacheControl || '3600',
      upsert: options?.upsert || false
    })

  if (error) {
    // Provide more specific error messages
    if (error.message.includes('exceeded the maximum allowed size')) {
      throw new Error(`File too large. Maximum size allowed is ${maxSizeMB}MB. Your file is ${(file.size / 1024 / 1024).toFixed(1)}MB.`)
    }
    throw new Error(`Upload failed: ${error.message}`)
  }

  options?.onProgress?.(100)
  return data

}

// Enhanced file validation with detailed error info
export const validateFile = (file: File, maxSizeMB?: number): {
  valid: boolean
  error?: string
  fileType: 'video' | 'image' | 'file'
  maxSize: number
} => {
  const fileType = file.type.startsWith('video/') ? 'video' :
                  file.type.startsWith('image/') ? 'image' : 'file'

  const maxSize = maxSizeMB || getFileSizeLimit(file.type)
  const maxSizeBytes = mbToBytes(maxSize)

  // Check file type for videos
  if (fileType === 'video' && !file.type.startsWith('video/')) {
    return {
      valid: false,
      error: 'Please select a valid video file',
      fileType,
      maxSize
    }
  }

  // Check file size
  if (file.size > maxSizeBytes) {
    return {
      valid: false,
      error: `${fileType} size (${formatFileSize(file.size)}) exceeds maximum allowed size of ${maxSize}MB`,
      fileType,
      maxSize
    }
  }

  // Check supported formats
  const supportedFormats = fileType === 'video' ? SUPPORTED_FORMATS.VIDEO :
                          fileType === 'image' ? SUPPORTED_FORMATS.IMAGE : []

  if (supportedFormats.length > 0 && !supportedFormats.includes(file.type)) {
    const formatNames = supportedFormats.map(f => f.split('/')[1].toUpperCase()).join(', ')
    return {
      valid: false,
      error: `Unsupported ${fileType} format. Please use: ${formatNames}`,
      fileType,
      maxSize
    }
  }

  return { valid: true, fileType, maxSize }
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
