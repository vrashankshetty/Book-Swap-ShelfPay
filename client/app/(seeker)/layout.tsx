import Navbar from "@/components/seeker-navbar"
import type React from "react"



export default function SeekerMainLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="flex min-h-screen flex-col">
       <Navbar />
       <main className="flex-1">{children}</main>
    </div>
            
  )
}



