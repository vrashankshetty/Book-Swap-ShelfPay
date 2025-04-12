"use client"

import type { Book } from "@/lib/types"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import Link from "next/link"


interface BookGridProps {
  isManageable?: boolean
  books: Book[]
}

export default function RecentBookGrid({ isManageable = false,books }: BookGridProps) {
  const getStatusVariant = (status: string) => {
    switch (status) {
      case "available":
        return "available"
      case "rented":
        return "rented"
      case "exchanged":
        return "exchanged"
      default:
        return "default"
    }
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {books?.map((book:Book) => (
        <div key={book.$loki} className="overflow-hidden rounded-lg border bg-card shadow-sm">
          <Link href={`/books/${book.$loki}`}>
            <div className="relative">
              <Image
                src={book.coverImage || "/placeholder.svg"}
                alt={book.title}
                width={400}
                height={600}
                className="aspect-[2/3] w-full object-cover"
              />
              <Badge
                variant={getStatusVariant(book.status)}
                className="absolute right-2 top-2"
              >
                {book.status.charAt(0).toUpperCase() + book.status.slice(1)}
              </Badge>
            </div>
          </Link>
          <div className="p-4">
            <div className="flex items-start justify-between">
              <div>
                <Link href={`/books/${book.$loki}`}>
                  <h3 className="font-bold hover:text-primary">{book.title}</h3>
                </Link>
                <p className="text-sm text-muted-foreground">{book.author}</p>
              </div>
            </div>
            <div className="mt-2 flex items-center text-xs text-muted-foreground">
              <span>{book.city}</span>
              <span className="mx-2">•</span>
              <span>{book.genre}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
