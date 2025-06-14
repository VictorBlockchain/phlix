"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { X, Send, Mic, ImageIcon, Maximize2, Minimize2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useChatToggle } from "@/hooks/use-chat-toggle"
import { cn } from "@/lib/utils"

interface Message {
  id: string
  content: string
  sender: "user" | "bot"
  timestamp: Date
}

export default function PersistentChat() {
  const { isOpen, closeChat } = useChatToggle()
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: "👋 Hi there! I'm Pixel, your BotBox assistant. How can I help you create amazing AI videos today?",
      sender: "bot",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [isExpanded, setIsExpanded] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const [activeTab, setActiveTab] = useState("chat")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Sample prompt templates
  const promptTemplates = [
    {
      title: "Cinematic Scene",
      prompt: "Create a cinematic scene of a futuristic city with flying cars and neon lights",
    },
    {
      title: "Character Animation",
      prompt: "Generate an animated character dancing in a colorful forest",
    },
    {
      title: "Abstract Visualization",
      prompt: "Create an abstract visualization of music with flowing colors and shapes",
    },
    {
      title: "Nature Timelapse",
      prompt: "Generate a timelapse of seasons changing in a forest landscape",
    },
  ]

  // Sample history items
  const historyItems = [
    {
      id: "hist1",
      prompt: "A robot exploring a post-apocalyptic city",
      date: "2 hours ago",
      thumbnail: "/placeholder.svg?height=60&width=80",
    },
    {
      id: "hist2",
      prompt: "Underwater scene with bioluminescent creatures",
      date: "Yesterday",
      thumbnail: "/placeholder.svg?height=60&width=80",
    },
    {
      id: "hist3",
      prompt: "Space station orbiting a colorful nebula",
      date: "3 days ago",
      thumbnail: "/placeholder.svg?height=60&width=80",
    },
  ]

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages])

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      sender: "user",
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsTyping(true)

    // Simulate bot response after a delay
    setTimeout(() => {
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: getBotResponse(input),
        sender: "bot",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, botMessage])
      setIsTyping(false)
    }, 1000)
  }

  const getBotResponse = (userInput: string): string => {
    const input = userInput.toLowerCase()

    if (input.includes("hello") || input.includes("hi")) {
      return "Hello! How can I help you create videos today?"
    } else if (
      input.includes("video") &&
      (input.includes("create") || input.includes("make") || input.includes("generate"))
    ) {
      return "I'd be happy to help you create a video! What style are you looking for? Cinematic, animated, abstract, or something else?"
    } else if (input.includes("help")) {
      return "I can help you create AI videos, browse templates, or answer questions about BotBox. What would you like to know?"
    } else {
      return "That sounds interesting! Would you like me to help you turn this into a video concept? I can suggest visual styles that might work well."
    }
  }

  const handleUseTemplate = (prompt: string) => {
    setInput(prompt)
    setActiveTab("chat")
  }

  const toggleExpand = () => {
    setIsExpanded(!isExpanded)
  }

  if (!isOpen) return null

  return (
    <div
      className={cn(
        "fixed bottom-16 md:bottom-4 right-4 z-40 bg-zinc-900 border border-zinc-800 rounded-xl shadow-xl shadow-purple-500/10 transition-all duration-300 flex flex-col",
        isExpanded ? "w-[90vw] md:w-[500px] h-[70vh]" : "w-[90vw] md:w-[380px] h-[400px]",
      )}
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-3 rounded-t-xl flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-white/90 flex items-center justify-center p-1">
            <img src="/placeholder.svg?height=32&width=32" alt="Pixel" className="w-full h-full object-contain" />
          </div>
          <div>
            <h3 className="font-bold text-black">Pixel</h3>
            <p className="text-[10px] text-white/70">BotBox Assistant</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 rounded-full bg-white/20 hover:bg-white/40 text-black"
            onClick={toggleExpand}
          >
            {isExpanded ? <Minimize2 className="h-3 w-3" /> : <Maximize2 className="h-3 w-3" />}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 rounded-full bg-white/20 hover:bg-white/40 text-black"
            onClick={closeChat}
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="chat" className="flex-1 flex flex-col" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 bg-zinc-800/50 rounded-none border-b border-zinc-700/50">
          <TabsTrigger value="chat" className="data-[state=active]:bg-zinc-900 data-[state=active]:text-purple-400">
            Chat
          </TabsTrigger>
          <TabsTrigger
            value="templates"
            className="data-[state=active]:bg-zinc-900 data-[state=active]:text-purple-400"
          >
            Templates
          </TabsTrigger>
          <TabsTrigger value="history" className="data-[state=active]:bg-zinc-900 data-[state=active]:text-purple-400">
            History
          </TabsTrigger>
        </TabsList>

        <TabsContent value="chat" className="flex-1 flex flex-col p-0 m-0">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div key={message.id} className={cn("flex", message.sender === "user" ? "justify-end" : "justify-start")}>
                <div
                  className={cn(
                    "max-w-[80%] rounded-2xl p-3",
                    message.sender === "user"
                      ? "bg-purple-600 text-white rounded-tr-none"
                      : "bg-zinc-800 text-white rounded-tl-none",
                  )}
                >
                  <p className="text-sm">{message.content}</p>
                  <p className="text-[10px] opacity-70 mt-1">
                    {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-zinc-800 text-white rounded-2xl rounded-tl-none p-3 max-w-[80%]">
                  <div className="flex space-x-1">
                    <div
                      className="w-2 h-2 bg-zinc-500 rounded-full animate-bounce"
                      style={{ animationDelay: "0ms" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-zinc-500 rounded-full animate-bounce"
                      style={{ animationDelay: "150ms" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-zinc-500 rounded-full animate-bounce"
                      style={{ animationDelay: "300ms" }}
                    ></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-3 border-t border-zinc-800">
            <form onSubmit={handleSendMessage} className="flex items-center gap-2">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full text-zinc-400 hover:text-purple-400"
              >
                <Mic className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full text-zinc-400 hover:text-purple-400"
              >
                <ImageIcon className="h-4 w-4" />
              </Button>
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask me to create a video..."
                className="flex-1 bg-zinc-800 border-zinc-700 focus-visible:ring-purple-500"
              />
              <Button
                type="submit"
                size="icon"
                className="h-8 w-8 rounded-full bg-purple-600 hover:bg-purple-700"
                disabled={!input.trim()}
              >
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </TabsContent>

        <TabsContent value="templates" className="flex-1 overflow-y-auto p-4 space-y-4 m-0">
          <h3 className="text-sm font-medium text-zinc-300 mb-2">Popular Templates</h3>
          <div className="grid grid-cols-1 gap-3">
            {promptTemplates.map((template, index) => (
              <div
                key={index}
                className="bg-zinc-800 rounded-lg p-3 border border-zinc-700/50 hover:border-purple-500/50 transition-colors cursor-pointer"
                onClick={() => handleUseTemplate(template.prompt)}
              >
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium text-sm">{template.title}</h4>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 px-2 text-xs text-purple-400 hover:text-purple-300"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleUseTemplate(template.prompt)
                    }}
                  >
                    Use
                  </Button>
                </div>
                <p className="text-xs text-zinc-400">{template.prompt}</p>
              </div>
            ))}
          </div>

          <h3 className="text-sm font-medium text-zinc-300 mt-4 mb-2">Style Modifiers</h3>
          <div className="flex flex-wrap gap-2">
            {["Cinematic", "Anime", "3D Render", "Pixel Art", "Watercolor", "Neon", "Retro"].map((style) => (
              <Button
                key={style}
                variant="outline"
                size="sm"
                className="h-7 text-xs border-zinc-700 hover:bg-zinc-800 hover:text-purple-400"
                onClick={() => setInput((prev) => `${prev}${prev ? ", " : ""}${style.toLowerCase()} style`)}
              >
                {style}
              </Button>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="history" className="flex-1 overflow-y-auto p-4 space-y-4 m-0">
          <h3 className="text-sm font-medium text-zinc-300 mb-2">Recent Generations</h3>
          <div className="space-y-3">
            {historyItems.map((item) => (
              <div
                key={item.id}
                className="flex gap-3 bg-zinc-800 rounded-lg p-2 border border-zinc-700/50 hover:border-purple-500/50 transition-colors cursor-pointer"
                onClick={() => handleUseTemplate(item.prompt)}
              >
                <div className="w-20 h-15 rounded overflow-hidden flex-shrink-0">
                  <img
                    src={item.thumbnail || "/placeholder.svg"}
                    alt={item.prompt}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-zinc-300 line-clamp-2">{item.prompt}</p>
                  <p className="text-[10px] text-zinc-500 mt-1">{item.date}</p>
                </div>
              </div>
            ))}
          </div>

          <Button
            variant="outline"
            size="sm"
            className="w-full mt-2 border-zinc-700 hover:bg-zinc-800 hover:text-purple-400 text-xs"
          >
            View All History
          </Button>
        </TabsContent>
      </Tabs>
    </div>
  )
}
