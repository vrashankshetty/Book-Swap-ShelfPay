import type React from "react"
import Navbar from "@/components/navbar-owner"


export default function OwnerMainLayout({
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



