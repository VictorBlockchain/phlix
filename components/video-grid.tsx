import Link from "next/link"
import Image from "next/image"
import { Play, Lock, Star, Shield } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface Video {
  id: string
  title: string
  description: string
  thumbnail: string
  duration: string
  isNft?: boolean
  tokenGated?: boolean
  rarity?: "common" | "rare" | "legendary"
  creator?: string
  price?: number
}

interface VideoGridProps {
  videos: Video[]
  title?: string
}

export default function VideoGrid({ videos, title }: VideoGridProps) {
  return (
    <div className="space-y-6">
      {title && <h2 className="text-xl md:text-2xl font-semibold">{title}</h2>}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {videos.map((video) => (
          <Link
            key={video.id}
            href={`/video/${video.id}`}
            className="group relative overflow-hidden rounded-xl transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-cyan-500/10"
          >
            {/* Card with 3D effect */}
            <div
              className="aspect-video relative overflow-hidden rounded-xl bg-zinc-900 border border-zinc-800 group-hover:border-cyan-500/50 transition-all duration-300"
              style={{
                transformStyle: "preserve-3d",
                perspective: "1000px",
              }}
            >
              {/* Thumbnail with parallax effect */}
              <div className="absolute inset-0 group-hover:scale-[1.05] transition-transform duration-700">
                <Image
                  src={video.thumbnail || "/placeholder.svg"}
                  alt={video.title}
                  fill
                  className="object-cover transition-all duration-700 group-hover:brightness-110"
                />
              </div>

              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/90 via-zinc-950/40 to-transparent opacity-80 group-hover:opacity-70 transition-opacity duration-300"></div>

              {/* NFT badge */}
              {video.isNft && (
                <div className="absolute top-2 left-2 flex items-center gap-1">
                  <Badge
                    className={cn(
                      "px-2 py-0.5 text-[10px] font-medium border-0",
                      video.rarity === "legendary"
                        ? "bg-gradient-to-r from-amber-500 to-yellow-300 text-black"
                        : video.rarity === "rare"
                          ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                          : "bg-gradient-to-r from-cyan-500 to-blue-500 text-white",
                    )}
                  >
                    {video.rarity === "legendary" ? "LEGENDARY NFT" : video.rarity === "rare" ? "RARE NFT" : "NFT"}
                  </Badge>
                </div>
              )}

              {/* Token gated indicator */}
              {video.tokenGated && (
                <div className="absolute top-2 right-2">
                  <div className="w-6 h-6 rounded-full bg-zinc-900/80 backdrop-blur-sm flex items-center justify-center border border-zinc-700">
                    <Lock className="h-3 w-3 text-amber-400" />
                  </div>
                </div>
              )}

              {/* Duration badge */}
              <div className="absolute bottom-2 right-2 bg-black/70 backdrop-blur-sm px-2 py-0.5 rounded text-xs font-medium">
                {video.duration}
              </div>

              {/* Play button with glow effect */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="rounded-full bg-cyan-500/80 p-3 shadow-lg shadow-cyan-500/50 backdrop-blur-sm transform group-hover:scale-110 transition-transform duration-300">
                  <Play className="h-6 w-6 text-black" fill="currentColor" />
                </div>
              </div>

              {/* Creator and price info */}
              {(video.creator || video.price) && (
                <div className="absolute bottom-2 left-2 flex items-center gap-2">
                  {video.creator && (
                    <div className="flex items-center gap-1 bg-black/50 backdrop-blur-sm rounded-full px-2 py-0.5">
                      <div className="w-4 h-4 rounded-full bg-purple-500 flex items-center justify-center">
                        <Shield className="h-2 w-2 text-white" />
                      </div>
                      <span className="text-[10px] text-white font-medium">{video.creator}</span>
                    </div>
                  )}

                  {video.price && (
                    <div className="flex items-center gap-1 bg-black/50 backdrop-blur-sm rounded-full px-2 py-0.5">
                      <div className="w-3 h-3 rounded-full bg-amber-500 flex items-center justify-center">
                        <span className="text-[8px] font-bold text-black">$</span>
                      </div>
                      <span className="text-[10px] text-white font-medium">{video.price}</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Video info */}
            <div className="mt-3 px-1">
              <div className="flex items-start justify-between">
                <h3 className="font-medium text-sm line-clamp-1 group-hover:text-cyan-400 transition-colors">
                  {video.title}
                </h3>
                {video.isNft && (
                  <div className="flex items-center gap-0.5 text-amber-400">
                    <Star className="h-3 w-3 fill-amber-400" />
                    <span className="text-[10px] font-medium">4.9</span>
                  </div>
                )}
              </div>
              <p className="text-zinc-400 text-xs line-clamp-1 mt-0.5">{video.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
