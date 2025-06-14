"use client"

import { AlertTriangle, X, FileVideo, Zap, Settings } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { FILE_LIMITS, formatFileSize, VIDEO_RECOMMENDATIONS } from "@/lib/config"

interface FileSizeErrorModalProps {
  isOpen: boolean
  onClose: () => void
  fileName: string
  fileSize: number
  maxSize: number
  fileType: 'video' | 'image' | 'file'
}

export function FileSizeErrorModal({
  isOpen,
  onClose,
  fileName,
  fileSize,
  maxSize,
  fileType
}: FileSizeErrorModalProps) {
  const fileSizeMB = (fileSize / (1024 * 1024)).toFixed(1)
  const isVideo = fileType === 'video'

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gradient-to-b from-zinc-900 to-zinc-950 border-2 border-red-500/30 text-white sm:max-w-md rounded-3xl shadow-xl shadow-red-500/20 p-0 overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full bg-red-500/10 blur-3xl"></div>
        <div className="absolute -bottom-20 -left-20 w-40 h-40 rounded-full bg-red-500/10 blur-3xl"></div>

        {/* Header */}
        <div className="bg-gradient-to-r from-red-600 to-red-700 p-6 relative">
          <div className="absolute top-0 left-0 right-0 h-1 bg-white/20"></div>
          <div className="flex items-center gap-4 pr-8">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-red-300 to-red-500 p-0.5 shadow-lg shadow-red-500/30">
              <div className="w-full h-full rounded-full bg-zinc-900 flex items-center justify-center">
                <AlertTriangle className="h-6 w-6 text-red-400" />
              </div>
            </div>
            <div>
              <DialogTitle className="text-xl font-bold text-white">File Too Large</DialogTitle>
              <DialogDescription className="text-red-200/70 text-sm">
                {isVideo ? 'Video' : 'File'} exceeds size limit
              </DialogDescription>
            </div>
          </div>

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/30 hover:bg-black/50 backdrop-blur-sm flex items-center justify-center text-white/70 hover:text-white transition-colors"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* File Info */}
          <div className="bg-zinc-800/50 rounded-xl p-4 border border-red-500/20">
            <div className="flex items-center gap-3 mb-3">
              <FileVideo className="h-5 w-5 text-red-400" />
              <span className="font-medium text-red-300">File Details</span>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-zinc-400">File name:</span>
                <span className="text-white font-mono text-xs truncate max-w-32" title={fileName}>
                  {fileName}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Current size:</span>
                <span className="text-red-400 font-bold">{fileSizeMB} MB</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Maximum allowed:</span>
                <span className="text-green-400 font-bold">{maxSize} MB</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Exceeds by:</span>
                <span className="text-red-400 font-bold">
                  {(parseFloat(fileSizeMB) - maxSize).toFixed(1)} MB
                </span>
              </div>
            </div>
          </div>

          {/* Video-specific recommendations */}
          {isVideo && (
            <div className="bg-cyan-900/20 rounded-xl p-4 border border-cyan-500/20">
              <div className="flex items-center gap-3 mb-3">
                <Zap className="h-5 w-5 text-cyan-400" />
                <span className="font-medium text-cyan-300">Compression Tips</span>
              </div>
              <ul className="space-y-2 text-sm text-zinc-300">
                <li className="flex items-start gap-2">
                  <span className="text-cyan-400 mt-1">•</span>
                  <span>Reduce resolution to {VIDEO_RECOMMENDATIONS.RECOMMENDED_RESOLUTION} or lower</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-cyan-400 mt-1">•</span>
                  <span>Use {VIDEO_RECOMMENDATIONS.RECOMMENDED_CODEC} codec for better compression</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-cyan-400 mt-1">•</span>
                  <span>Lower bitrate to {VIDEO_RECOMMENDATIONS.RECOMMENDED_BITRATE}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-cyan-400 mt-1">•</span>
                  <span>Trim unnecessary content to reduce duration</span>
                </li>
              </ul>
            </div>
          )}

          {/* Current limit info */}
          <div className="bg-amber-900/20 rounded-xl p-4 border border-amber-500/20">
            <div className="flex items-center gap-3 mb-2">
              <Settings className="h-5 w-5 text-amber-400" />
              <span className="font-medium text-amber-300">Current Limits</span>
            </div>
            <div className="text-sm text-zinc-300">
              <div className="flex justify-between mb-1">
                <span>Videos:</span>
                <span className="text-amber-400">{FILE_LIMITS.VIDEO_MAX_SIZE_MB} MB</span>
              </div>
              <div className="flex justify-between mb-1">
                <span>Images:</span>
                <span className="text-amber-400">{FILE_LIMITS.IMAGE_MAX_SIZE_MB} MB</span>
              </div>
              <div className="flex justify-between">
                <span>Other files:</span>
                <span className="text-amber-400">{FILE_LIMITS.GENERAL_MAX_SIZE_MB} MB</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-red-500/10 p-6 bg-zinc-900/50">
          <Button
            onClick={onClose}
            className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 rounded-xl py-3 text-white font-medium shadow-lg shadow-red-500/20"
          >
            Choose Different File
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
