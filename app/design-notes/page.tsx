import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Design Notes | Phlix",
  description: "Theme styling and site story documentation for Phlix",
}

export default function DesignNotesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-900 to-black text-white p-6 md:p-10">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 border-b border-zinc-700 pb-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition-colors mb-6"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-arrow-left"
            >
              <path d="m12 19-7-7 7-7" />
              <path d="M19 12H5" />
            </svg>
            Back to Home
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            Phlix Design Notes
          </h1>
          <p className="text-zinc-400 mt-2">Theme styling and site story documentation</p>
        </div>

        <div className="space-y-12">
          {/* Brand Story Section */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-cyan-400">Brand Story</h2>
            <div className="bg-zinc-800/50 rounded-xl p-6 border border-zinc-700">
              <h3 className="text-xl font-semibold mb-3">The Phlix Universe</h3>
              <p className="mb-4">
                Phlix is a charming, Pixar-inspired robot character who serves as both the mascot and guide for our
                video content platform. Created with a passion for storytelling, Phlix was designed to bring warmth and
                personality to the digital content experience.
              </p>
              <p className="mb-4">
                In the Phlix universe, stories are the most valuable currency. Phlix was originally programmed as a
                storytelling assistant for a major animation studio, but gained sentience and developed a deep
                appreciation for all forms of narrative. Now, Phlix curates, creates, and connects users with video
                stories that resonate with them personally.
              </p>
              <p>
                The platform represents Phlix's digital realm where stories come to life through video. Each section of
                the site is designed to feel like exploring different parts of Phlix's world - from the playful
                navigation to the immersive content displays.
              </p>
            </div>
          </section>

          {/* Color Palette Section */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-cyan-400">Color Palette</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-zinc-800/50 rounded-xl p-6 border border-zinc-700">
                <h3 className="text-xl font-semibold mb-3">Primary Colors</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-md bg-cyan-500"></div>
                    <div>
                      <p className="font-medium">Cyan 500</p>
                      <p className="text-sm text-zinc-400">Primary accent</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-md bg-blue-600"></div>
                    <div>
                      <p className="font-medium">Blue 600</p>
                      <p className="text-sm text-zinc-400">Secondary accent</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-md bg-zinc-900"></div>
                    <div>
                      <p className="font-medium">Zinc 900</p>
                      <p className="text-sm text-zinc-400">Background (dark)</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-zinc-800/50 rounded-xl p-6 border border-zinc-700">
                <h3 className="text-xl font-semibold mb-3">Gradient Patterns</h3>
                <div className="space-y-3">
                  <div>
                    <div className="h-12 rounded-md bg-gradient-to-r from-cyan-600 to-blue-600 mb-2"></div>
                    <p className="text-sm text-zinc-400">Header gradient: from-cyan-600 to-blue-600</p>
                  </div>
                  <div>
                    <div className="h-12 rounded-md bg-gradient-to-br from-zinc-900 to-zinc-950 mb-2"></div>
                    <p className="text-sm text-zinc-400">Card gradient: from-zinc-900 to-zinc-950</p>
                  </div>
                  <div>
                    <div className="h-12 rounded-md bg-gradient-to-b from-cyan-500/20 to-blue-600/20 mb-2"></div>
                    <p className="text-sm text-zinc-400">Glow effect: from-cyan-500/20 to-blue-600/20</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Typography Section */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-cyan-400">Typography</h2>
            <div className="bg-zinc-800/50 rounded-xl p-6 border border-zinc-700">
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold mb-2">Font Family</h3>
                  <p>Primary font: Inter (sans-serif)</p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Heading Styles</h3>
                  <div className="space-y-3">
                    <div>
                      <h1 className="text-4xl font-bold">Heading 1</h1>
                      <p className="text-sm text-zinc-400">text-4xl font-bold</p>
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold">Heading 2</h2>
                      <p className="text-sm text-zinc-400">text-2xl font-bold</p>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold">Heading 3</h3>
                      <p className="text-sm text-zinc-400">text-xl font-semibold</p>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Text Gradients</h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                        Gradient Text
                      </p>
                      <p className="text-sm text-zinc-400">
                        bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Component Styling Section */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-cyan-400">Component Styling</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-zinc-800/50 rounded-xl p-6 border border-zinc-700">
                <h3 className="text-xl font-semibold mb-3">Cards & Containers</h3>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Rounded corners: rounded-2xl</li>
                  <li>Border: border border-zinc-800</li>
                  <li>Shadow: shadow-xl shadow-cyan-500/10</li>
                  <li>Background: bg-gradient-to-br from-zinc-900 to-zinc-950</li>
                  <li>Hover state: scale-[1.02] transition-all</li>
                </ul>
              </div>

              <div className="bg-zinc-800/50 rounded-xl p-6 border border-zinc-700">
                <h3 className="text-xl font-semibold mb-3">Buttons</h3>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Primary: bg-gradient-to-r from-cyan-500 to-blue-600</li>
                  <li>Secondary: bg-zinc-800 hover:bg-zinc-700</li>
                  <li>Rounded: rounded-full or rounded-lg</li>
                  <li>Padding: px-6 py-2.5</li>
                  <li>Transition: transition-all duration-200</li>
                  <li>Hover effect: hover:shadow-lg hover:shadow-cyan-500/20</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Animation Guidelines */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-cyan-400">Animation Guidelines</h2>
            <div className="bg-zinc-800/50 rounded-xl p-6 border border-zinc-700">
              <h3 className="text-xl font-semibold mb-3">Principles</h3>
              <ul className="list-disc pl-5 space-y-2 mb-6">
                <li>Playful but not distracting</li>
                <li>Smooth transitions (duration-300 or duration-500)</li>
                <li>Subtle scaling effects for hover states</li>
                <li>Bounce effects for Pixar-inspired playfulness</li>
                <li>Glow effects using shadows with cyan/blue colors</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3">Common Animations</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-zinc-700/50 p-4 rounded-lg">
                  <p className="font-medium mb-1">Hover Scale</p>
                  <p className="text-sm text-zinc-400">transform hover:scale-105 transition-transform duration-300</p>
                </div>
                <div className="bg-zinc-700/50 p-4 rounded-lg">
                  <p className="font-medium mb-1">Pulse Effect</p>
                  <p className="text-sm text-zinc-400">animate-pulse or custom keyframes</p>
                </div>
                <div className="bg-zinc-700/50 p-4 rounded-lg">
                  <p className="font-medium mb-1">Fade In</p>
                  <p className="text-sm text-zinc-400">animate-fadeIn (custom animation)</p>
                </div>
                <div className="bg-zinc-700/50 p-4 rounded-lg">
                  <p className="font-medium mb-1">Bounce</p>
                  <p className="text-sm text-zinc-400">animate-bounce or custom bounce effect</p>
                </div>
              </div>
            </div>
          </section>

          {/* Mobile Navigation */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-cyan-400">Mobile Navigation</h2>
            <div className="bg-zinc-800/50 rounded-xl p-6 border border-zinc-700">
              <h3 className="text-xl font-semibold mb-3">Pixar-Inspired Navigation</h3>
              <p className="mb-4">
                The mobile navigation features a playful, Pixar-inspired design with a prominent arching middle button.
                This design is inspired by Pixar's attention to detail, dimensional lighting, and playful interfaces.
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Large, elevated middle "Create" button that arches above the navigation bar</li>
                <li>Multiple gradient layers for a 3D, bouncy appearance</li>
                <li>Subtle pulsing glow effect around the main button</li>
                <li>Touch feedback with scale animations</li>
                <li>Small highlight dot on active navigation items</li>
                <li>Gradient backgrounds instead of flat colors</li>
                <li>Small white "reflection" highlights for that classic Pixar shine</li>
              </ul>
            </div>
          </section>

          {/* Phlix Character Guide */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-cyan-400">Phlix Character Guide</h2>
            <div className="bg-zinc-800/50 rounded-xl p-6 border border-zinc-700">
              <h3 className="text-xl font-semibold mb-3">Character Traits</h3>
              <ul className="list-disc pl-5 space-y-2 mb-6">
                <li>Friendly, helpful storytelling robot</li>
                <li>Pixar-inspired design with expressive features</li>
                <li>Blue/cyan color scheme to match the site theme</li>
                <li>Animated elements to bring the character to life</li>
                <li>Conversational, warm tone of voice</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3">Voice & Tone</h3>
              <ul className="list-disc pl-5 space-y-2">
                <li>Enthusiastic about stories and creativity</li>
                <li>Helpful and encouraging</li>
                <li>Occasionally uses playful robot-themed phrases</li>
                <li>Speaks directly to the user in a conversational manner</li>
                <li>Uses emoji and expressive punctuation sparingly</li>
                <li>Focuses on guiding users through their storytelling journey</li>
              </ul>
            </div>
          </section>

          {/* Future Development Notes */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-cyan-400">Future Development Notes</h2>
            <div className="bg-zinc-800/50 rounded-xl p-6 border border-zinc-700">
              <h3 className="text-xl font-semibold mb-3">Planned Enhancements</h3>
              <ul className="list-disc pl-5 space-y-2">
                <li>More character animations for Phlix</li>
                <li>Interactive storytelling features</li>
                <li>Enhanced mobile navigation interactions</li>
                <li>Expanded UI kit with more Pixar-inspired components</li>
                <li>Voice interactions for Phlix character</li>
                <li>More playful micro-interactions throughout the site</li>
                <li>Expanded character universe with additional robot friends</li>
              </ul>
            </div>
          </section>
        </div>

        <div className="mt-12 pt-6 border-t border-zinc-700 text-center text-zinc-500 text-sm">
          Last updated: June 13, 2025
        </div>
      </div>
    </div>
  )
}
