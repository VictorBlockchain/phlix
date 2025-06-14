import Link from "next/link"

export default function Footer() {
  return (
    <footer className="border-t border-zinc-800 bg-zinc-950 py-8 px-4 md:px-8 hidden md:block">
      <div className="container mx-auto">
        {/* <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-semibold mb-4 text-zinc-300">AIVID</h3>
            <ul className="space-y-2 text-sm text-zinc-400">
              <li>
                <Link href="/about" className="hover:text-cyan-400 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/careers" className="hover:text-cyan-400 transition-colors">
                  Careers
                </Link>
              </li>
              <li>
                <Link href="/press" className="hover:text-cyan-400 transition-colors">
                  Press
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4 text-zinc-300">Support</h3>
            <ul className="space-y-2 text-sm text-zinc-400">
              <li>
                <Link href="/help" className="hover:text-cyan-400 transition-colors">
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-cyan-400 transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-cyan-400 transition-colors">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4 text-zinc-300">Legal</h3>
            <ul className="space-y-2 text-sm text-zinc-400">
              <li>
                <Link href="/terms" className="hover:text-cyan-400 transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-cyan-400 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/cookies" className="hover:text-cyan-400 transition-colors">
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4 text-zinc-300">Connect</h3>
            <ul className="space-y-2 text-sm text-zinc-400">
              <li>
                <Link href="https://twitter.com" className="hover:text-cyan-400 transition-colors">
                  Twitter
                </Link>
              </li>
              <li>
                <Link href="https://instagram.com" className="hover:text-cyan-400 transition-colors">
                  Instagram
                </Link>
              </li>
              <li>
                <Link href="https://discord.com" className="hover:text-cyan-400 transition-colors">
                  Discord
                </Link>
              </li>
            </ul>
          </div>
        </div> */}
        <div className="mt-8 pt-6 text-center text-xs text-zinc-500">
          <p>© {new Date().getFullYear()} Phlix. All rights reserved.</p>
          <p className="mt-1">AI-generated content for entertainment purposes.</p>
        </div>
      </div>
    </footer>
  )
}
