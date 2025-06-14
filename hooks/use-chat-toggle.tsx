"use client"

import { create } from "zustand"

interface ChatState {
  isOpen: boolean
  toggleChat: () => void
  openChat: () => void
  closeChat: () => void
}

export const useChatToggle = create<ChatState>((set) => ({
  isOpen: false,
  toggleChat: () => set((state) => ({ isOpen: !state.isOpen })),
  openChat: () => set({ isOpen: true }),
  closeChat: () => set({ isOpen: false }),
}))
