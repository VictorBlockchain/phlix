import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import MobileNav from "@/components/mobile-nav"
import { ThemeProvider } from "next-themes"
import { WalletProvider } from "@/components/wallet-provider"
import { UserProvider } from "@/hooks/use-user"
import { Toaster } from "@/components/ui/sonner"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Phlix - Ai Video NFT Marketplace",
  description: "Mint, share, and discover AI-generated videos with Phlix",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={inter.className}>
        <WalletProvider>
          <UserProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="dark"
              enableSystem={false}
              disableTransitionOnChange
            >
              {children}
              <MobileNav />
              <Toaster />
            </ThemeProvider>
          </UserProvider>
        </WalletProvider>
      </body>
    </html>
  )
}
