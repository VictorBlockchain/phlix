"use client"

import { useEffect } from "react"

interface CharacterGuideProps {
  onClose: () => void
}

export default function CharacterGuide({ onClose }: CharacterGuideProps) {
  // Auto-close the component on mount since we don't need it
  useEffect(() => {
    // Automatically close the component after a short delay
    const timer = setTimeout(() => {
      onClose()
    }, 100)

    return () => clearTimeout(timer)
  }, [onClose])

  // Return null - no UI will be rendered
  return null
}
