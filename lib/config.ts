// Application configuration constants

// File upload limits (in MB)
export const FILE_LIMITS = {
  // Video upload limit - change this value to adjust max video size
  VIDEO_MAX_SIZE_MB: 50,
  
  // Image upload limits
  IMAGE_MAX_SIZE_MB: 10,
  AVATAR_MAX_SIZE_MB: 5,
  THUMBNAIL_MAX_SIZE_MB: 10,
  
  // General file limit
  GENERAL_MAX_SIZE_MB: 25,
} as const

// Supported file formats
export const SUPPORTED_FORMATS = {
  VIDEO: ['video/mp4', 'video/webm', 'video/ogg', 'video/avi', 'video/mov', 'video/quicktime'],
  IMAGE: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'],
} as const

// Video quality recommendations
export const VIDEO_RECOMMENDATIONS = {
  MAX_RESOLUTION: '1920x1080',
  RECOMMENDED_RESOLUTION: '1280x720',
  MAX_DURATION_MINUTES: 30,
  RECOMMENDED_BITRATE: '2-5 Mbps',
  RECOMMENDED_CODEC: 'H.264',
} as const

// Helper function to get file size limit based on type
export const getFileSizeLimit = (fileType: string): number => {
  if (fileType.startsWith('video/')) {
    return FILE_LIMITS.VIDEO_MAX_SIZE_MB
  }
  if (fileType.startsWith('image/')) {
    return FILE_LIMITS.IMAGE_MAX_SIZE_MB
  }
  return FILE_LIMITS.GENERAL_MAX_SIZE_MB
}

// Helper function to format file size
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// Helper function to convert MB to bytes
export const mbToBytes = (mb: number): number => mb * 1024 * 1024

// Helper function to convert bytes to MB
export const bytesToMB = (bytes: number): number => bytes / (1024 * 1024)
