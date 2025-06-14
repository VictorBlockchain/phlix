"use client"
import { Home, Play, Upload, User, ArrowLeftRight, Compass } from "lucide-react"
import { usePathname } from "next/navigation"
import { useState } from "react"

interface NavItem {
  label: string
  href: string
  icon: any
  highlight?: boolean
  onClick?: () => void
}

export default function MobileNav() {
  const pathname = usePathname()
  const [pressedButton, setPressedButton] = useState<string | null>(null)
  const isOnHomePage = pathname === "/"

  // Function to handle middle button click
  const handleMiddleButtonClick = () => {
    if (isOnHomePage) {
      // If on home page, trigger random video play
      const event = new CustomEvent('playRandomVideo')
      window.dispatchEvent(event)
    } else {
      // If not on home page, navigate to home
      window.location.href = "/"
    }
  }

  const navItems: NavItem[] = [
    {
      label: "Swap",
      href: "https://pump.fun",
      icon: ArrowLeftRight,
    },
    {
      label: "Discover",
      href: "/discover",
      icon: Compass,
    },
    {
      label: isOnHomePage ? "Play" : "Home",
      href: "/",
      icon: isOnHomePage ? Play : Home,
      highlight: true,
      onClick: handleMiddleButtonClick,
    },
    {
      label: "Create",
      href: "/create",
      icon: Upload,
    },
    {
      label: "Profile",
      href: "/profile",
      icon: User,
    },
  ]

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-zinc-950/90 backdrop-blur-md border-t border-zinc-800">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-500/50 to-transparent"></div>
      <nav className="flex justify-around items-end h-16 px-2 relative">
        {navItems.map((item, index) => {
          const isActive = pathname === item.href
          const isMiddle = index === 2 // Middle button is now at index 2

          // Handle different types of clicks
          const isExternalLink = item.href.startsWith('http')
          const handleClick = (e: React.MouseEvent) => {
            if (item.onClick) {
              e.preventDefault()
              item.onClick()
            } else if (isExternalLink) {
              e.preventDefault()
              window.open(item.href, '_blank', 'noopener,noreferrer')
            }
          }

          return (
            <a
              key={`${item.href}-${index}`}
              href={item.onClick ? "#" : item.href}
              onClick={handleClick}
              className={`flex flex-col items-center justify-center ${isMiddle ? "pb-1" : "w-full h-full"}`}
              onTouchStart={() => setPressedButton(item.href)}
              onTouchEnd={() => setPressedButton(null)}
            >
              {isMiddle ? (
                <div className="relative -mt-8 mb-1">
                  <div className="absolute -inset-1 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 rounded-full blur-md opacity-70 animate-pulse"></div>
                  <div
                    className={`relative flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-b from-amber-400 to-amber-600 shadow-lg ${
                      pressedButton === item.href ? "scale-95" : "scale-100"
                    } transition-all duration-200`}
                  >
                    <div className="absolute inset-1 bg-gradient-to-t from-amber-500 to-amber-300 rounded-full opacity-80"></div>
                    <div className="absolute inset-2 bg-gradient-to-b from-amber-400 to-amber-600 rounded-full flex items-center justify-center">
                      <item.icon className="h-7 w-7 text-black drop-shadow-md" />
                    </div>
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-white rounded-full shadow-md"></div>
                  </div>
                  <span className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs font-bold text-amber-400">
                    {item.label}
                  </span>
                </div>
              ) : (
                <>
                  <div
                    className={`relative ${
                      pressedButton === item.href ? "bg-zinc-700" : "bg-zinc-800"
                    } p-2 rounded-full mb-1 transition-all duration-200 ${
                      pressedButton === item.href ? "scale-90" : "scale-100"
                    }`}
                  >
                    <item.icon className={`h-5 w-5 ${isActive ? "text-amber-400" : "text-zinc-400"}`} />
                    {isActive && <span className="absolute -top-1 -right-1 w-2 h-2 bg-amber-300 rounded-full"></span>}
                  </div>
                  <span className={`text-xs ${isActive ? "text-amber-400 font-medium" : "text-zinc-400"}`}>
                    {item.label}
                  </span>
                </>
              )}
            </a>
          )
        })}

        {/* Add a decorative arc behind the middle button */}
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 w-24 h-12 bg-zinc-900 border-t border-x border-zinc-800 rounded-t-full z-[-1]"></div>
      </nav>
    </div>
  )
}
