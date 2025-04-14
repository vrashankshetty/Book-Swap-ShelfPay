"use client"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Book, FileText, LogOut, Menu, User } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import Cookies
 from "js-cookie"
export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const router = useRouter();


  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const handleLogout= async ()=>{
    await Cookies.remove("userId");
    router.push("/");
  }

  return (
    <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <Book className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold">BookSwap</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-6 md:flex">
          <Link href="/how-it-works" className="text-sm font-medium transition-colors hover:text-primary">
            How It Works
          </Link>
          <Link
              href="/seeker/requests"
              className="flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium hover:bg-accent"
              onClick={() => setIsMenuOpen(false)}
            >
              <FileText className="h-4 w-4" />
              Requests
          </Link>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full bg-primary">
                  <div className="flex h-8 w-8 items-center justify-center  text-primary-foreground">
                    <User className="w-full" />
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/seeker/dashboard">Dashboard</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                <Button className="rounded-md px-4 py-2 text-sm font-medium hover:bg-accent" onClick={handleLogout}>
                   Log out
                </Button> 
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
        </nav>

        {/* Mobile Menu Button */}
        <Button variant="ghost" size="icon" className="md:hidden" onClick={toggleMenu}>
          <Menu className="h-6 w-6" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="container mx-auto px-4 pb-4 md:hidden">
          <nav className="flex flex-col space-y-4">
            <Link
              href="/how-it-works"
              className="rounded-md px-4 py-2 text-sm font-medium hover:bg-accent"
              onClick={() => setIsMenuOpen(false)}
            >
              How It Works
            </Link>
              <>
                <Link
                  href="/seeker/dashboard"
                  className="rounded-md px-4 py-2 text-sm font-medium hover:bg-accent"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <Button className="rounded-md px-4 py-2 text-sm font-medium hover:bg-accent" onClick={handleLogout}>
                   Log out
                </Button> 
              </>
          </nav>
        </div>
      )}
    </header>
  )
}
