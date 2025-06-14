"use client"

import { useState, useCallback, useRef } from "react"
import { useDropzone } from "react-dropzone"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Progress } from "@/components/ui/progress"
import {
  Sparkles,
  Upload,
  Video,
  Image as ImageIcon,
  X,
  CheckCircle,
  AlertCircle,
  Film,
  Music,
  Heart,
  Palette,
  Camera,
  Smile,
  Lock,
  Zap
} from "lucide-react"
import Header from "@/components/header"
import { supabase, uploadFile, getPublicUrl, createVideo } from "@/lib/supabase"
import { useUser } from "@/hooks/use-user"
import { toast } from "sonner"

// Video categories from discover page
const VIDEO_CATEGORIES = {
  creative: { label: "Creative", icon: Sparkles },
  shorts: { label: "Shorts", icon: Zap },
  comedy: { label: "Comedy", icon: Smile },
  encrypted: { label: "Encrypted", icon: Lock },
  music: { label: "Music", icon: Music },
  art: { label: "Art", icon: Palette },
  film: { label: "Film", icon: Film },
  romance: { label: "Romance", icon: Heart },
  anime: { label: "Anime", icon: Camera },
  cartoon: { label: "Cartoon", icon: Camera },
} as const

type VideoCategory = keyof typeof VIDEO_CATEGORIES

interface VideoMetadata {
  duration: number
  size: number
  type: string
  width?: number
  height?: number
}

interface UploadState {
  video: File | null
  thumbnail: File | null
  videoMetadata: VideoMetadata | null
  videoPreviewUrl: string | null
  thumbnailPreviewUrl: string | null
}

export default function CreatePage() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "" as VideoCategory | "",
    isPublic: true,
    mintAsNft: false,
  })

  const [uploadState, setUploadState] = useState<UploadState>({
    video: null,
    thumbnail: null,
    videoMetadata: null,
    videoPreviewUrl: null,
    thumbnailPreviewUrl: null,
  })

  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [showNftModal, setShowNftModal] = useState(false)

  const { profile, isConnected, walletAddress } = useUser()
  const videoRef = useRef<HTMLVideoElement>(null)

  // Get video metadata
  const getVideoMetadata = (file: File): Promise<VideoMetadata> => {
    return new Promise((resolve) => {
      const video = document.createElement('video')
      video.preload = 'metadata'

      video.onloadedmetadata = () => {
        resolve({
          duration: Math.round(video.duration),
          size: file.size,
          type: file.type,
          width: video.videoWidth,
          height: video.videoHeight,
        })
        URL.revokeObjectURL(video.src)
      }

      video.src = URL.createObjectURL(file)
    })
  }

  // Video dropzone
  const onVideoDropAccepted = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (!file) return

    try {
      const metadata = await getVideoMetadata(file)
      const previewUrl = URL.createObjectURL(file)

      setUploadState(prev => ({
        ...prev,
        video: file,
        videoMetadata: metadata,
        videoPreviewUrl: previewUrl,
      }))

      toast.success(`Video loaded: ${Math.round(metadata.duration)}s, ${(metadata.size / 1024 / 1024).toFixed(1)}MB`)
    } catch (error) {
      toast.error("Failed to load video metadata")
      console.error(error)
    }
  }, [])

  const onVideoDropRejected = useCallback(() => {
    toast.error("Please upload a valid video file (MP4, WebM, MOV)")
  }, [])

  const { getRootProps: getVideoRootProps, getInputProps: getVideoInputProps, isDragActive: isVideoDragActive } = useDropzone({
    onDropAccepted: onVideoDropAccepted,
    onDropRejected: onVideoDropRejected,
    accept: {
      'video/*': ['.mp4', '.webm', '.mov', '.avi']
    },
    maxSize: 2 * 1024 * 1024 * 1024, // 2GB
    multiple: false
  })

  // Thumbnail dropzone
  const onThumbnailDropAccepted = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (!file) return

    // Check image dimensions (recommended: 1280x720 for 16:9 aspect ratio)
    const img = new Image()
    img.onload = () => {
      const aspectRatio = img.width / img.height
      if (Math.abs(aspectRatio - 16/9) > 0.1) {
        toast.warning("Recommended aspect ratio is 16:9 (1280x720px) for best results")
      }
      URL.revokeObjectURL(img.src)
    }
    img.src = URL.createObjectURL(file)

    const previewUrl = URL.createObjectURL(file)
    setUploadState(prev => ({
      ...prev,
      thumbnail: file,
      thumbnailPreviewUrl: previewUrl,
    }))

    toast.success("Thumbnail uploaded successfully")
  }, [])

  const onThumbnailDropRejected = useCallback(() => {
    toast.error("Please upload a valid image file (PNG, JPG, WebP)")
  }, [])

  const { getRootProps: getThumbnailRootProps, getInputProps: getThumbnailInputProps, isDragActive: isThumbnailDragActive } = useDropzone({
    onDropAccepted: onThumbnailDropAccepted,
    onDropRejected: onThumbnailDropRejected,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.webp', '.gif']
    },
    maxSize: 10 * 1024 * 1024, // 10MB
    multiple: false
  })

  // Handle form submission
  const handleUpload = async () => {
    if (!isConnected || !profile) {
      toast.error("Please connect your wallet to upload videos")
      return
    }

    if (!uploadState.video) {
      toast.error("Please select a video file")
      return
    }

    if (!formData.title.trim()) {
      toast.error("Please enter a video title")
      return
    }

    if (!formData.category) {
      toast.error("Please select a category")
      return
    }

    if (formData.mintAsNft) {
      setShowNftModal(true)
      return
    }

    await uploadVideo()
  }

  const uploadVideo = async () => {
    if (!uploadState.video || !profile) return

    setIsUploading(true)
    setUploadProgress(0)

    try {
      const videoId = crypto.randomUUID()
      const userId = profile.id

      // Upload video file
      setUploadProgress(20)
      const videoPath = `${userId}/${videoId}.${uploadState.video.name.split('.').pop()}`
      await uploadFile('VIDEOS', videoPath, uploadState.video)
      const videoUrl = getPublicUrl('VIDEOS', videoPath)

      // Upload thumbnail if provided
      let thumbnailUrl = null
      if (uploadState.thumbnail) {
        setUploadProgress(40)
        const thumbnailPath = `${userId}/${videoId}_thumb.${uploadState.thumbnail.name.split('.').pop()}`
        await uploadFile('IMAGES', thumbnailPath, uploadState.thumbnail)
        thumbnailUrl = getPublicUrl('IMAGES', thumbnailPath)
      }

      // Create video record in database
      setUploadProgress(80)
      const videoData = {
        id: videoId,
        creator_id: userId,
        title: formData.title,
        description: formData.description || null,
        category: formData.category as any,
        video_url: videoUrl,
        thumbnail_url: thumbnailUrl,
        duration: uploadState.videoMetadata?.duration || null,
        file_size: uploadState.videoMetadata?.size || null,
        resolution: uploadState.videoMetadata?.width && uploadState.videoMetadata?.height
          ? `${uploadState.videoMetadata.width}x${uploadState.videoMetadata.height}`
          : null,
        is_public: formData.isPublic,
        is_nft: formData.mintAsNft,
        processing_status: 'completed'
      }

      await createVideo(videoData)

      setUploadProgress(100)
      toast.success("Video uploaded successfully!")

      // Reset form
      setFormData({
        title: "",
        description: "",
        category: "",
        isPublic: true,
        mintAsNft: false,
      })
      setUploadState({
        video: null,
        thumbnail: null,
        videoMetadata: null,
        videoPreviewUrl: null,
        thumbnailPreviewUrl: null,
      })

    } catch (error) {
      console.error("Upload error:", error)
      toast.error("Failed to upload video. Please try again.")
    } finally {
      setIsUploading(false)
      setUploadProgress(0)
    }
  }

  return (
    <div className="min-h-screen pt-16 bg-zinc-950">
      <Header visible={true} />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-purple-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent">
            Upload Video
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left panel - Upload form */}
          <div className="lg:col-span-1 space-y-6">
            {/* Upload form */}
            <div className="bg-zinc-900 rounded-lg border border-zinc-800 p-4">
              <h2 className="text-lg font-medium mb-4 flex items-center">
                <Upload className="mr-2 h-5 w-5 text-purple-400" /> Upload Details
              </h2>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="title" className="text-sm text-zinc-400">
                    Title *
                  </Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Enter video title"
                    className="mt-1 bg-zinc-800 border-zinc-700 focus-visible:ring-purple-500"
                  />
                </div>

                <div>
                  <Label htmlFor="description" className="text-sm text-zinc-400">
                    Description
                  </Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Tell the story behind your video..."
                    className="mt-1 bg-zinc-800 border-zinc-700 focus-visible:ring-purple-500"
                    rows={4}
                  />
                </div>

                <div>
                  <Label htmlFor="category" className="text-sm text-zinc-400">
                    Category *
                  </Label>
                  <Select value={formData.category} onValueChange={(value: VideoCategory) => setFormData(prev => ({ ...prev, category: value }))}>
                    <SelectTrigger className="mt-1 bg-zinc-800 border-zinc-700 focus:ring-purple-500">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent className="bg-zinc-800 border-zinc-700">
                      {Object.entries(VIDEO_CATEGORIES).map(([key, { label, icon: Icon }]) => (
                        <SelectItem key={key} value={key} className="focus:bg-zinc-700">
                          <div className="flex items-center gap-2">
                            <Icon className="h-4 w-4" />
                            {label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Thumbnail Upload */}
                <div>
                  <Label className="text-sm text-zinc-400">
                    Thumbnail Image (Recommended: 1280x720px)
                  </Label>
                  <div
                    {...getThumbnailRootProps()}
                    className={`mt-1 border-2 border-dashed rounded-lg p-4 text-center transition-colors cursor-pointer ${
                      isThumbnailDragActive
                        ? 'border-purple-500 bg-purple-500/10'
                        : 'border-zinc-700 hover:bg-zinc-800/50'
                    }`}
                  >
                    <input {...getThumbnailInputProps()} />
                    {uploadState.thumbnailPreviewUrl ? (
                      <div className="space-y-2">
                        <div className="relative mx-auto w-32 h-18 rounded-lg overflow-hidden">
                          <img
                            src={uploadState.thumbnailPreviewUrl}
                            alt="Thumbnail preview"
                            className="w-full h-full object-cover"
                          />
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              setUploadState(prev => ({ ...prev, thumbnail: null, thumbnailPreviewUrl: null }))
                            }}
                            className="absolute top-1 right-1 p-1 bg-red-500 rounded-full hover:bg-red-600"
                          >
                            <X className="h-3 w-3 text-white" />
                          </button>
                        </div>
                        <p className="text-xs text-green-400">Thumbnail uploaded</p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <ImageIcon className="mx-auto h-10 w-10 text-zinc-500" />
                        <div className="text-sm text-zinc-400">
                          <span className="text-purple-400">Upload a file</span> or drag and drop
                        </div>
                        <p className="text-xs text-zinc-500">PNG, JPG, WebP up to 10MB</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Video Upload */}
                <div>
                  <Label className="text-sm text-zinc-400">
                    Video File *
                  </Label>
                  <div
                    {...getVideoRootProps()}
                    className={`mt-1 border-2 border-dashed rounded-lg p-4 text-center transition-colors cursor-pointer ${
                      isVideoDragActive
                        ? 'border-purple-500 bg-purple-500/10'
                        : 'border-zinc-700 hover:bg-zinc-800/50'
                    }`}
                  >
                    <input {...getVideoInputProps()} />
                    {uploadState.video ? (
                      <div className="space-y-2">
                        <div className="flex items-center justify-center gap-2">
                          <CheckCircle className="h-8 w-8 text-green-400" />
                          <div className="text-left">
                            <p className="text-sm font-medium text-green-400">{uploadState.video.name}</p>
                            {uploadState.videoMetadata && (
                              <p className="text-xs text-zinc-400">
                                {Math.round(uploadState.videoMetadata.duration)}s • {(uploadState.videoMetadata.size / 1024 / 1024).toFixed(1)}MB
                                {uploadState.videoMetadata.width && uploadState.videoMetadata.height &&
                                  ` • ${uploadState.videoMetadata.width}x${uploadState.videoMetadata.height}`
                                }
                              </p>
                            )}
                          </div>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            setUploadState(prev => ({
                              ...prev,
                              video: null,
                              videoMetadata: null,
                              videoPreviewUrl: null
                            }))
                          }}
                          className="text-xs text-red-400 hover:text-red-300"
                        >
                          Remove video
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <Video className="mx-auto h-10 w-10 text-zinc-500" />
                        <div className="text-sm text-zinc-400">
                          <span className="text-purple-400">Upload a file</span> or drag and drop
                        </div>
                        <p className="text-xs text-zinc-500">MP4, WebM, MOV up to 2GB</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Public/Private Toggle */}
                <div className="flex items-center justify-between pt-2">
                  <Label className="text-sm text-zinc-400">
                    Make video public
                  </Label>
                  <Switch
                    checked={formData.isPublic}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isPublic: checked }))}
                  />
                </div>

                {/* NFT Toggle */}
                <div className="flex items-center justify-between pt-2">
                  <Label className="text-sm text-zinc-400">
                    Mint as NFT
                  </Label>
                  <Switch
                    checked={formData.mintAsNft}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, mintAsNft: checked }))}
                  />
                </div>

                {/* Upload Progress */}
                {isUploading && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-zinc-400">Uploading...</span>
                      <span className="text-purple-400">{uploadProgress}%</span>
                    </div>
                    <Progress value={uploadProgress} className="h-2" />
                  </div>
                )}

                {/* Upload Button */}
                <div className="pt-2">
                  <Button
                    onClick={handleUpload}
                    disabled={isUploading || !uploadState.video || !formData.title.trim() || !formData.category}
                    className="w-full bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 disabled:opacity-50"
                  >
                    {isUploading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Sparkles className="mr-2 h-4 w-4" />
                        {formData.mintAsNft ? "Mint as NFT" : "Upload Video"}
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Right panel - Preview */}
          <div className="lg:col-span-2 space-y-6">
            {/* Video preview */}
            <div className="bg-zinc-900 rounded-lg border border-zinc-800 overflow-hidden">
              <div className="aspect-video relative bg-black flex items-center justify-center">
                {uploadState.videoPreviewUrl ? (
                  <video
                    ref={videoRef}
                    src={uploadState.videoPreviewUrl}
                    className="w-full h-full object-contain"
                    controls
                    poster={uploadState.thumbnailPreviewUrl || undefined}
                  />
                ) : isUploading ? (
                  <div className="text-center p-8">
                    <div className="w-24 h-24 rounded-full border-4 border-t-purple-500 border-r-purple-500 border-b-transparent border-l-transparent animate-spin mx-auto mb-4"></div>
                    <div className="text-lg font-medium mb-2">Uploading Your Video</div>
                    <div className="w-full max-w-xs mx-auto bg-zinc-800 rounded-full h-2.5 mb-2">
                      <div
                        className="bg-gradient-to-r from-purple-500 to-blue-500 h-2.5 rounded-full transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      ></div>
                    </div>
                    <div className="text-sm text-zinc-400">{uploadProgress}% Complete</div>
                  </div>
                ) : (
                  <div className="text-center p-8">
                    <Video className="h-16 w-16 text-zinc-700 mx-auto mb-4" />
                    <div className="text-lg font-medium mb-2">Video Preview</div>
                    <div className="text-sm text-zinc-400 max-w-md">Upload a video to see the preview here</div>
                  </div>
                )}
              </div>

              {uploadState.video && uploadState.videoMetadata && (
                <div className="p-4 border-t border-zinc-800">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">{uploadState.video.name}</h3>
                      <p className="text-sm text-zinc-400">
                        {Math.round(uploadState.videoMetadata.duration)}s • {(uploadState.videoMetadata.size / 1024 / 1024).toFixed(1)}MB
                        {uploadState.videoMetadata.width && uploadState.videoMetadata.height &&
                          ` • ${uploadState.videoMetadata.width}x${uploadState.videoMetadata.height}`
                        }
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-400" />
                      <span className="text-sm text-green-400">Ready to upload</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Upload Tips */}
            <div className="bg-zinc-900 rounded-lg border border-zinc-800 p-4">
              <h3 className="font-medium mb-3 flex items-center">
                <AlertCircle className="mr-2 h-5 w-5 text-blue-400" />
                Upload Tips
              </h3>
              <ul className="space-y-2 text-sm text-zinc-400">
                <li>• Recommended video formats: MP4, WebM, MOV</li>
                <li>• Optimal thumbnail size: 1280x720px (16:9 aspect ratio)</li>
                <li>• Maximum file size: 2GB for videos, 10MB for thumbnails</li>
                <li>• Videos will be publicly accessible unless marked private</li>
                <li>• NFT minting feature coming soon!</li>
              </ul>
            </div>
          </div>
        </div>

        {/* NFT Coming Soon Modal */}
        <Dialog open={showNftModal} onOpenChange={setShowNftModal}>
          <DialogContent className="bg-gradient-to-b from-zinc-900 to-zinc-950 border-2 border-purple-500/30 text-white sm:max-w-md rounded-3xl shadow-xl shadow-purple-500/20">
            <DialogHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center mb-4">
                <Sparkles className="h-8 w-8 text-white" />
              </div>
              <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                NFT Minting Coming Soon!
              </DialogTitle>
              <DialogDescription className="text-zinc-300 mt-4">
                We're working hard to bring you the ability to mint your videos as NFTs on the Sui blockchain.
                This feature will include:
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3 my-6">
              <div className="flex items-center gap-3 text-sm">
                <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                <span>Secure vault wallet storage</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                <span>Customizable royalty settings</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                <span>Rarity levels and collections</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                <span>Marketplace integration</span>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => {
                  setFormData(prev => ({ ...prev, mintAsNft: false }))
                  setShowNftModal(false)
                }}
                className="flex-1 border-zinc-700 hover:bg-zinc-800"
              >
                Upload as Regular Video
              </Button>
              <Button
                onClick={() => setShowNftModal(false)}
                className="flex-1 bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700"
              >
                Got It!
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
