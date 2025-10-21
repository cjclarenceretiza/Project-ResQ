"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Menu } from "lucide-react"
import { useState } from "react"

export function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <nav className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#ff4500] rounded-lg flex items-center justify-center">
              <span className="text-[#ff4500]-foreground font-bold text-lg">R</span>
            </div>
            <span className="font-bold text-xl">ResQ</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-sm font-medium hover:text-[#ff4500] transition-colors">
              Home
            </Link>
            <Link href="/missions" className="text-sm font-medium hover:text-[#ff4500] transition-colors">
              Missions
            </Link>
            <Link href="/donate" className="text-sm font-medium hover:text-[#ff4500] transition-colors">
              Donate
            </Link>
            <Link href="/map" className="text-sm font-medium hover:text-[#ff4500] transition-colors">
              Map
            </Link>
          </div>

          {/* CTA Button */}
          <div className="hidden md:block">
            <Link href="/missions/create">
              <Button className="bg-[#ff4500] text-[#ff4500]-foreground hover:bg-[#ff4500]/90">Create Mission</Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            <Menu className="w-6 h-6" />
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 space-y-3">
            <Link href="/" className="block text-sm font-medium hover:text-[#ff4500] transition-colors">
              Home
            </Link>
            <Link href="/missions" className="block text-sm font-medium hover:text-[#ff4500] transition-colors">
              Missions
            </Link>
            <Link href="/donate" className="block text-sm font-medium hover:text-[#ff4500] transition-colors">
              Donate
            </Link>
            <Link href="/map" className="block text-sm font-medium hover:text-[#ff4500] transition-colors">
              Map
            </Link>
            <Link href="/missions/create">
              <Button className="w-full bg-[#ff4500] text-[#ff4500]-foreground hover:bg-[#ff4500]/90">Create Mission</Button>
            </Link>
          </div>
        )}
      </div>
    </nav>
  )
}
