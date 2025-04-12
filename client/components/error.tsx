"use client"

import { AlertTriangle, Home, RefreshCw } from "lucide-react"
import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface ErrorProps {
  message:string
}

export default function Error({ message }: ErrorProps) {

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
      <div className="text-center max-w-md">
        <AlertTriangle className="h-16 w-16 text-rose-500 mx-auto" />
        <h2 className="mt-4 text-2xl font-bold text-gray-900">Something went wrong</h2>
        <p className="mt-2 text-gray-600">
          We apologize for the inconvenience. An error occurred while processing your request.
        </p>
        <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
          <Button variant="outline" asChild>
            <Link href="/" className="flex items-center gap-2">
              <Home className="h-4 w-4" />
              Go home
            </Link>
          </Button>
        </div>
        {message}
      </div>
    </div>
  )
}
