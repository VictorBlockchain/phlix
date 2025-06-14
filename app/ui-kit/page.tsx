"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  Palette,
  Type,
  Square,
  Copy,
  Check,
  Search,
  Info,
  AlertCircle,
  CheckCircle,
  XCircle,
  Loader2,
  Plus,
  MessageSquare,
  Download,
  Edit,
  Film,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { ScrollArea } from "@/components/ui/scroll-area"

// Custom icon components
function Twitter(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
    </svg>
  )
}

function Facebook(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  )
}

function Github(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </svg>
  )
}

function BotMessage({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mt-6 bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 flex items-start gap-3">
      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 flex items-center justify-center flex-shrink-0 mt-1">
        <Film className="h-4 w-4 text-white" />
      </div>
      <div>
        <p className="text-amber-400 font-medium">{title}</p>
        <div className="text-zinc-400 text-sm">{children}</div>
      </div>
    </div>
  )
}

export default function UIKitPage() {
  const [copied, setCopied] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopied(id)
    setTimeout(() => setCopied(null), 2000)
  }

  const simulateLoading = () => {
    setIsLoading(true)
    setTimeout(() => setIsLoading(false), 2000)
  }

  const sections = [
    { id: "colors", name: "Colors", icon: <Palette className="h-4 w-4" /> },
    { id: "typography", name: "Typography", icon: <Type className="h-4 w-4" /> },
    { id: "buttons", name: "Buttons", icon: <Square className="h-4 w-4" /> },
    { id: "inputs", name: "Inputs", icon: <Edit className="h-4 w-4" /> },
    { id: "cards", name: "Cards", icon: <Square className="h-4 w-4" /> },
    { id: "dialogs", name: "Dialogs", icon: <MessageSquare className="h-4 w-4" /> },
    { id: "alerts", name: "Alerts", icon: <AlertCircle className="h-4 w-4" /> },
  ]

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 pt-16">
      {/* Floating Bot Character */}
      <div className="fixed bottom-8 right-8 z-50 hidden lg:block">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 p-0.5 shadow-lg shadow-cyan-500/30 animate-float-slow">
          <div className="w-full h-full bg-zinc-950 rounded-xl flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-cyan-400"
            >
              <rect x="2" y="4" width="20" height="16" rx="2" />
              <path d="M9 9h.01" />
              <path d="M15 9h.01" />
              <path d="M9 13h6" />
            </svg>
          </div>
        </div>
        <div className="mt-2 bg-zinc-900 rounded-xl p-3 border border-cyan-500/20 shadow-lg max-w-xs">
          <p className="text-xs text-cyan-300">Need help? Click on any component to see more details!</p>
        </div>
      </div>
      {/* Header */}
      <header className="bg-gradient-to-r from-zinc-900 via-zinc-950 to-zinc-900 border-b border-amber-500/20 py-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl"></div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-600 p-0.5 shadow-lg shadow-amber-500/20 animate-pulse-slow">
                <div className="w-full h-full bg-zinc-950 rounded-xl flex items-center justify-center">
                  <Film className="h-8 w-8 text-amber-400" />
                </div>
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-amber-300 via-amber-400 to-amber-300 bg-clip-text text-transparent font-serif">
                  Phlix UI Kit
                </h1>
                <p className="text-zinc-400 mt-2 max-w-2xl">
                  A comprehensive collection of UI components designed with a cinematic interface. Use this as a
                  reference for consistent design implementation.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                onClick={() => router.back()}
                className="border-amber-500/20 hover:border-amber-500/40 hover:bg-amber-500/5 transition-all rounded-xl"
              >
                Back to App
              </Button>
              <Button className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 rounded-xl shadow-lg shadow-amber-500/20 hover:shadow-amber-500/30 transition-all">
                <Download className="mr-2 h-4 w-4" /> Download UI Kit
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Navigation */}
          <aside className="lg:w-64 flex-shrink-0">
            <div className="sticky top-20 bg-gradient-to-br from-zinc-900 to-zinc-950 backdrop-blur-sm rounded-2xl border-2 border-amber-500/10 overflow-hidden shadow-lg shadow-amber-500/5">
              <div className="p-4 border-b border-amber-500/10 flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 flex items-center justify-center">
                  <Plus className="h-4 w-4 text-white" />
                </div>
                <h2 className="font-semibold text-amber-50">Components</h2>
              </div>
              <ScrollArea className="h-[calc(100vh-180px)]">
                <nav className="p-2">
                  <ul className="space-y-1">
                    {sections.map((section) => (
                      <li key={section.id}>
                        <a
                          href={`#${section.id}`}
                          className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-amber-500/10 transition-colors text-sm group"
                        >
                          <div className="w-5 h-5 rounded-md bg-zinc-800 group-hover:bg-amber-500/20 flex items-center justify-center transition-colors">
                            {section.icon}
                          </div>
                          {section.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                </nav>
              </ScrollArea>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 space-y-16">
            {/* Colors Section */}
            <section id="colors" className="scroll-mt-20">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-amber-500/20 to-amber-600/20 flex items-center justify-center">
                  <Palette className="h-5 w-5 text-amber-400" />
                </div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-amber-300 to-amber-400 bg-clip-text text-transparent">
                  Colors
                </h2>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                <div className="space-y-2">
                  <div className="h-20 rounded-lg bg-amber-500 flex items-end p-2 text-black">
                    <span className="font-medium">primary</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-zinc-400">amber-500</span>
                    <button
                      onClick={() => copyToClipboard("amber-500", "amber-500")}
                      className="text-zinc-400 hover:text-white"
                    >
                      {copied === "amber-500" ? (
                        <Check className="h-4 w-4 text-green-500" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="h-20 rounded-lg bg-zinc-800 flex items-end p-2 text-white">
                    <span className="font-medium">background</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-zinc-400">zinc-800</span>
                    <button
                      onClick={() => copyToClipboard("zinc-800", "zinc-800")}
                      className="text-zinc-400 hover:text-white"
                    >
                      {copied === "zinc-800" ? (
                        <Check className="h-4 w-4 text-green-500" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="h-20 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 flex items-end p-2 text-black">
                    <span className="font-medium">gradient</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-zinc-400 truncate max-w-[80%]">amber gradient</span>
                    <button
                      onClick={() => copyToClipboard("from-amber-500 to-amber-600", "amber-gradient")}
                      className="text-zinc-400 hover:text-white"
                    >
                      {copied === "amber-gradient" ? (
                        <Check className="h-4 w-4 text-green-500" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              <BotMessage title="Phlix Assistant">
                <p>
                  These color components are designed to create a consistent visual language across your interface. The
                  amber gradients are particularly effective for interactive elements.
                </p>
              </BotMessage>
            </section>

            {/* Typography Section */}
            <section id="typography" className="scroll-mt-20">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-amber-500/20 to-amber-600/20 flex items-center justify-center">
                  <Type className="h-5 w-5 text-amber-400" />
                </div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-amber-300 to-amber-400 bg-clip-text text-transparent">
                  Typography
                </h2>
              </div>

              <div className="bg-gradient-to-br from-zinc-900 to-zinc-950 rounded-2xl border-2 border-amber-500/10 p-6 shadow-lg shadow-amber-500/5 relative overflow-hidden">
                <div className="absolute -top-12 -right-12 w-24 h-24 rounded-full bg-gradient-to-br from-amber-400/10 to-amber-600/10 blur-xl"></div>
                <div className="absolute -bottom-8 -left-8 w-16 h-16 rounded-full bg-gradient-to-br from-amber-400/10 to-amber-600/10 blur-xl"></div>

                <div className="relative z-10 space-y-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
                    <h1 className="text-4xl font-bold">Heading 1</h1>
                    <div className="flex items-center gap-2">
                      <code className="px-2 py-1 rounded bg-zinc-800 text-xs">text-4xl font-bold</code>
                      <button
                        onClick={() => copyToClipboard("text-4xl font-bold", "h1")}
                        className="text-zinc-400 hover:text-white"
                      >
                        {copied === "h1" ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
                    <h2 className="text-3xl font-bold">Heading 2</h2>
                    <div className="flex items-center gap-2">
                      <code className="px-2 py-1 rounded bg-zinc-800 text-xs">text-3xl font-bold</code>
                      <button
                        onClick={() => copyToClipboard("text-3xl font-bold", "h2")}
                        className="text-zinc-400 hover:text-white"
                      >
                        {copied === "h2" ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
                    <p className="text-base">Regular paragraph text</p>
                    <div className="flex items-center gap-2">
                      <code className="px-2 py-1 rounded bg-zinc-800 text-xs">text-base</code>
                      <button
                        onClick={() => copyToClipboard("text-base", "p")}
                        className="text-zinc-400 hover:text-white"
                      >
                        {copied === "p" ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <BotMessage title="Phlix Assistant">
                <p>
                  Typography is key to a cinematic experience. Use these styles to create a friendly and engaging
                  interface. The text gradients add a touch of magic!
                </p>
              </BotMessage>
            </section>

            {/* Buttons Section */}
            <section id="buttons" className="scroll-mt-20">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-amber-500/20 to-amber-600/20 flex items-center justify-center">
                  <Square className="h-5 w-5 text-amber-400" />
                </div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-amber-300 to-amber-400 bg-clip-text text-transparent">
                  Buttons
                </h2>
              </div>

              <div className="bg-gradient-to-br from-zinc-900 to-zinc-950 rounded-2xl border-2 border-amber-500/10 p-6 shadow-lg shadow-amber-500/5 relative overflow-hidden">
                <div className="absolute -top-12 -right-12 w-24 h-24 rounded-full bg-gradient-to-br from-amber-400/10 to-amber-600/10 blur-xl"></div>
                <div className="absolute -bottom-8 -left-8 w-16 h-16 rounded-full bg-gradient-to-br from-amber-400/10 to-amber-600/10 blur-xl"></div>

                <div className="relative z-10">
                  <h3 className="text-lg font-medium mb-4">Standard Buttons</h3>
                  <div className="flex flex-wrap gap-4">
                    <Button className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 rounded-xl shadow-lg shadow-amber-500/20 hover:shadow-amber-500/30 transition-all">
                      Default
                    </Button>
                    <Button variant="secondary" className="rounded-xl">
                      Secondary
                    </Button>
                    <Button variant="destructive" className="rounded-xl">
                      Destructive
                    </Button>
                    <Button variant="outline" className="rounded-xl">
                      Outline
                    </Button>
                  </div>

                  <h3 className="text-lg font-medium mt-8 mb-4">Button with Icons</h3>
                  <div className="flex flex-wrap gap-4">
                    <Button className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 rounded-xl shadow-lg shadow-amber-500/20 hover:shadow-amber-500/30 transition-all">
                      <Plus className="mr-2 h-4 w-4" /> Create
                    </Button>
                    <Button variant="outline" className="rounded-xl">
                      <Download className="mr-2 h-4 w-4" /> Download
                    </Button>
                    <Button
                      onClick={simulateLoading}
                      disabled={isLoading}
                      className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 rounded-xl shadow-lg shadow-amber-500/20 hover:shadow-amber-500/30 transition-all"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Loading
                        </>
                      ) : (
                        "Click to Load"
                      )}
                    </Button>
                  </div>
                </div>
              </div>

              <BotMessage title="Phlix Assistant">
                <p>
                  Buttons are the primary way users interact with your interface. Use these styles to create clear and
                  engaging calls to action.
                </p>
              </BotMessage>
            </section>

            {/* Inputs Section */}
            <section id="inputs" className="scroll-mt-20">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-amber-500/20 to-amber-600/20 flex items-center justify-center">
                  <Edit className="h-5 w-5 text-amber-400" />
                </div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-amber-300 to-amber-400 bg-clip-text text-transparent">
                  Inputs
                </h2>
              </div>

              <div className="bg-gradient-to-br from-zinc-900 to-zinc-950 rounded-2xl border-2 border-amber-500/10 p-6 shadow-lg shadow-amber-500/5 relative overflow-hidden">
                <div className="absolute -top-12 -right-12 w-24 h-24 rounded-full bg-gradient-to-br from-amber-400/10 to-amber-600/10 blur-xl"></div>
                <div className="absolute -bottom-8 -left-8 w-16 h-16 rounded-full bg-gradient-to-br from-amber-400/10 to-amber-600/10 blur-xl"></div>

                <div className="relative z-10">
                  <h3 className="text-lg font-medium mb-4">Text Input</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <Label htmlFor="default">Default Input</Label>
                      <Input
                        id="default"
                        placeholder="Enter text..."
                        className="bg-zinc-800/50 border-2 border-amber-500/20 rounded-xl transition-all focus:border-amber-500/50"
                      />
                    </div>

                    <div className="space-y-3">
                      <Label htmlFor="with-icon">Input with Icon</Label>
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-zinc-400" />
                        <Input
                          id="with-icon"
                          placeholder="Search..."
                          className="bg-zinc-800/50 border-2 border-amber-500/20 rounded-xl pl-10 transition-all focus:border-amber-500/50"
                        />
                      </div>
                    </div>
                  </div>

                  <h3 className="text-lg font-medium mt-8 mb-4">Textarea</h3>
                  <div className="space-y-3">
                    <Label htmlFor="textarea">Message</Label>
                    <Textarea
                      id="textarea"
                      placeholder="Type your message here..."
                      className="bg-zinc-800/50 border-2 border-amber-500/20 rounded-xl transition-all focus:border-amber-500/50 min-h-[100px]"
                    />
                  </div>

                  <h3 className="text-lg font-medium mt-8 mb-4">Checkbox & Switch</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <Checkbox id="terms" className="border-amber-500/50 text-amber-500 rounded-md" />
                        <Label htmlFor="terms">Accept terms and conditions</Label>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <Switch id="notifications" className="bg-zinc-700 data-[state=checked]:bg-amber-500" />
                        <Label htmlFor="notifications">Enable notifications</Label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <BotMessage title="Phlix Assistant">
                <p>
                  Inputs are the way your interface gathers information. Use these styles to create a clear and engaging
                  input experience.
                </p>
              </BotMessage>
            </section>

            {/* Cards Section */}
            <section id="cards" className="scroll-mt-20">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-amber-500/20 to-amber-600/20 flex items-center justify-center">
                  <Square className="h-5 w-5 text-amber-400" />
                </div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-amber-300 to-amber-400 bg-clip-text text-transparent">
                  Cards
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-gradient-to-br from-zinc-900 to-zinc-950 border-2 border-amber-500/10 rounded-2xl shadow-lg shadow-amber-500/5 overflow-hidden">
                  <CardHeader>
                    <CardTitle className="text-amber-400">Basic Card</CardTitle>
                    <CardDescription>A simple card with title and description</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p>This is the content area of the card where you can put any information.</p>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="ghost" className="hover:bg-amber-500/10 rounded-xl">
                      Cancel
                    </Button>
                    <Button className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 rounded-xl shadow-lg shadow-amber-500/20 hover:shadow-amber-500/30 transition-all">
                      Save
                    </Button>
                  </CardFooter>
                </Card>

                <Card className="bg-gradient-to-br from-zinc-900 to-zinc-950 border-2 border-amber-500/10 rounded-2xl shadow-lg shadow-amber-500/5 overflow-hidden">
                  <div className="aspect-video relative">
                    <img
                      src="/placeholder.svg?height=250&width=500"
                      alt="Card cover"
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <CardHeader>
                    <CardTitle className="text-amber-400">Card with Image</CardTitle>
                    <CardDescription>A card with a cover image</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p>Cards can include images, videos, or other media at the top.</p>
                  </CardContent>
                  <CardFooter>
                    <Button className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 rounded-xl shadow-lg shadow-amber-500/20 hover:shadow-amber-500/30 transition-all">
                      Learn More
                    </Button>
                  </CardFooter>
                </Card>
              </div>

              <BotMessage title="Phlix Assistant">
                <p>
                  Cards are a great way to display information in a structured way. Use these styles to create clear and
                  engaging cards.
                </p>
              </BotMessage>
            </section>

            {/* Dialogs Section */}
            <section id="dialogs" className="scroll-mt-20">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-amber-500/20 to-amber-600/20 flex items-center justify-center">
                  <MessageSquare className="h-5 w-5 text-amber-400" />
                </div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-amber-300 to-amber-400 bg-clip-text text-transparent">
                  Dialogs
                </h2>
              </div>

              <div className="bg-gradient-to-br from-zinc-900 to-zinc-950 rounded-2xl border-2 border-amber-500/10 p-6 shadow-lg shadow-amber-500/5 relative overflow-hidden">
                <div className="absolute -top-12 -right-12 w-24 h-24 rounded-full bg-gradient-to-br from-amber-400/10 to-amber-600/10 blur-xl"></div>
                <div className="absolute -bottom-8 -left-8 w-16 h-16 rounded-full bg-gradient-to-br from-amber-400/10 to-amber-600/10 blur-xl"></div>

                <div className="relative z-10">
                  <h3 className="text-lg font-medium mb-4">Modal Dialog</h3>
                  <div className="flex flex-wrap gap-4">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 rounded-xl shadow-lg shadow-amber-500/20 hover:shadow-amber-500/30 transition-all">
                          Open Dialog
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="bg-zinc-900 border-zinc-800 rounded-xl">
                        <DialogHeader>
                          <DialogTitle className="text-amber-400">Dialog Title</DialogTitle>
                          <DialogDescription>
                            This is a description of the dialog content and purpose.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="py-4">
                          <p>Dialog content goes here. This can include forms, information, or any other content.</p>
                        </div>
                        <DialogFooter>
                          <Button variant="ghost" className="hover:bg-amber-500/10 rounded-xl">
                            Cancel
                          </Button>
                          <Button className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 rounded-xl shadow-lg shadow-amber-500/20 hover:shadow-amber-500/30 transition-all">
                            Continue
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </div>

              <BotMessage title="Phlix Assistant">
                <p>
                  Dialogs are a great way to display information in a structured way. Use these styles to create clear
                  and engaging dialogs.
                </p>
              </BotMessage>
            </section>

            {/* Alerts Section */}
            <section id="alerts" className="scroll-mt-20">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-amber-500/20 to-amber-600/20 flex items-center justify-center">
                  <AlertCircle className="h-5 w-5 text-amber-400" />
                </div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-amber-300 to-amber-400 bg-clip-text text-transparent">
                  Alerts
                </h2>
              </div>

              <div className="space-y-4">
                <Alert className="bg-gradient-to-br from-zinc-900 to-zinc-950 border-2 border-amber-500/10 rounded-2xl shadow-lg shadow-amber-500/5 relative overflow-hidden">
                  <Info className="h-4 w-4 text-amber-400" />
                  <AlertTitle className="text-amber-400">Information</AlertTitle>
                  <AlertDescription className="text-zinc-400">
                    This is an informational alert to notify users about something important.
                  </AlertDescription>
                </Alert>

                <Alert
                  variant="destructive"
                  className="bg-gradient-to-br from-zinc-900 to-zinc-950 border-2 border-red-500/10 rounded-2xl shadow-lg shadow-red-500/5 relative overflow-hidden"
                >
                  <XCircle className="h-4 w-4 text-red-400" />
                  <AlertTitle className="text-red-400">Error</AlertTitle>
                  <AlertDescription className="text-zinc-400">
                    There was an error processing your request. Please try again.
                  </AlertDescription>
                </Alert>

                <Alert className="border-green-500/10 bg-green-500/5 bg-gradient-to-br from-zinc-900 to-zinc-950 rounded-2xl shadow-lg shadow-green-500/5 relative overflow-hidden">
                  <CheckCircle className="h-4 w-4 text-green-400" />
                  <AlertTitle className="text-green-400">Success</AlertTitle>
                  <AlertDescription className="text-zinc-400">
                    Your changes have been saved successfully.
                  </AlertDescription>
                </Alert>
              </div>

              <BotMessage title="Phlix Assistant">
                <p>
                  Alerts are a great way to display information in a structured way. Use these styles to create clear
                  and engaging alerts.
                </p>
              </BotMessage>
            </section>
          </main>
        </div>
      </div>
    </div>
  )
}
