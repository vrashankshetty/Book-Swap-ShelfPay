"use client"

import { useEffect, useState } from "react"
import type { Book } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Edit, MoreVertical, Search, Trash, X } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import { useInView } from "react-intersection-observer"
import { useBooks } from "@/hooks/use-books"
import Loading from "./loader"
import Error from "./error"

interface BookGridProps {
  isManageable?: boolean
  initialBooks?: Book[]
  pageSize?: number
}

export default function InfiniteScrollGlobalBooks({ isManageable = false, initialBooks = [], pageSize = 8 }: BookGridProps) {
  const { toast } = useToast()
  const { getInfiniteBooks, deleteBook } = useBooks()
  const deleteBookMutation = deleteBook()

  // Search state
  const [searchTitle, setSearchTitle] = useState("")
  const [selectedGenre, setSelectedGenre] = useState("")
  const [selectedCity, setSelectedCity] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("")

  // Set up intersection observer for infinite scrolling
  const { ref, inView } = useInView()

  // Use the infinite query from our custom hook with search parameters
  const { data, error, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, isError, refetch } =
    getInfiniteBooks(initialBooks, pageSize, searchTitle, selectedGenre=="Any"?"":selectedGenre, selectedCity=="Any"?"":selectedCity,selectedStatus=="Any"?"":selectedStatus)

  // Reset search filters
  const resetFilters = () => {
    setSearchTitle("")
    setSelectedGenre("")
    setSelectedCity("")
    setSelectedStatus("")
  }

  // Handle search input change with debounce
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTitle(e.target.value)
    // Refetch after user input
    setTimeout(() => {
      refetch()
    }, 300) // Add a small debounce delay
  }

  // Handle filter changes - refetch immediately when any filter changes
  useEffect(() => {
    refetch()
  }, [searchTitle, selectedGenre, selectedCity, selectedStatus, refetch])

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage()
    }
  }, [inView, fetchNextPage, hasNextPage, isFetchingNextPage])



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

  // Combine all books from all pages
  const allBooks = data?.pages.flatMap((page) => page.books) || []
  const uniqueCities = data?.pages[0]?.cities
  const uniqueGenres = data?.pages[0]?.genres
  const statuses = ["available", "rented", "exchanged"]

  if (isLoading) {
    return <Loading />
  }

  if (isError) {
    return <Error message={error?.message || "Failed to load books"} />
  }

  return (
    <div className="space-y-8">
      {/* Search and Filter Section */}
      <div className="rounded-lg border bg-card shadow-sm">
        <div className="p-6">
          <h2 className="text-2xl font-semibold mb-4">Browse Global Books</h2>

          <div className="grid gap-6 md:grid-cols-4">
            {/* Search Input */}
            <div className="md:col-span-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search by title or author..."
                  className="pl-10 h-12 text-base"
                  value={searchTitle}
                  onChange={handleSearchChange}
                />
              </div>
            </div>

            {/* Filters */}
            <div>
              <label className="text-sm font-medium mb-2 block">Genre</label>
              <Select value={selectedGenre} onValueChange={(value) => setSelectedGenre(value)}>
                <SelectTrigger className="h-10">
                  <SelectValue placeholder="Any genre" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Any">Any genre</SelectItem>
                  {uniqueGenres?.map((genre: string) => (
                    <SelectItem key={genre} value={genre}>
                      {genre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">City</label>
              <Select value={selectedCity} onValueChange={(value) => setSelectedCity(value)}>
                <SelectTrigger className="h-10">
                  <SelectValue placeholder="Any location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Any">Any location</SelectItem>
                  {uniqueCities?.map((city: string) => (
                    <SelectItem key={city} value={city}>
                      {city}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Status</label>
              <Select value={selectedStatus} onValueChange={(value) => setSelectedStatus(value)}>
                <SelectTrigger className="h-10">
                  <SelectValue placeholder="Any status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Any">Any status</SelectItem>
                  {statuses.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end">
              <Button variant="outline" className="h-10 w-full" onClick={resetFilters}>
                <X className="h-4 w-4 mr-2" />
                Reset Filters
              </Button>
            </div>
          </div>

          {/* Active filters */}
          {(searchTitle || selectedGenre || selectedCity || selectedStatus) && (
            <div className="mt-4 flex flex-wrap gap-2">
              {searchTitle && (
                <Badge variant="secondary" className="px-3 py-1 text-sm">
                  Search: {searchTitle}
                  <button className="ml-2" onClick={() => setSearchTitle("")}>
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}
              {selectedGenre && (
                <Badge variant="secondary" className="px-3 py-1 text-sm">
                  Genre: {selectedGenre}
                  <button className="ml-2" onClick={() => setSelectedGenre("")}>
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}
              {selectedCity && (
                <Badge variant="secondary" className="px-3 py-1 text-sm">
                  City: {selectedCity}
                  <button className="ml-2" onClick={() => setSelectedCity("")}>
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}
              {selectedStatus && (
                <Badge variant="secondary" className="px-3 py-1 text-sm">
                  Status: {selectedStatus.charAt(0).toUpperCase() + selectedStatus.slice(1)}
                  <button className="ml-2" onClick={() => setSelectedStatus("")}>
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Results count */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">
          {allBooks.length} {allBooks.length === 1 ? "book" : "books"} found
        </h3>
      </div>

      {/* Books Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {allBooks.map((book: Book) => (
          <div
            key={book.$loki}
            className="overflow-hidden rounded-lg border bg-card shadow-sm transition-all hover:shadow-md"
          >
            <Link href={`/books/${book.$loki}`}>
              <div className="relative">
                <Image
                  src={book.coverImage || "/placeholder.svg"}
                  alt={book.title}
                  width={400}
                  height={600}
                  className="aspect-[2/3] w-full object-cover"
                />
                <Badge variant={getStatusVariant(book.status)} className="absolute right-2 top-2">
                  {book.status.charAt(0).toUpperCase() + book.status.slice(1)}
                </Badge>
              </div>
            </Link>
            <div className="p-4">
              <div className="flex items-start justify-between">
                <div>
                  <Link href={`/books/${book.$loki}`}>
                    <h3 className="font-bold hover:text-primary line-clamp-1">{book.title}</h3>
                  </Link>
                  <p className="text-sm text-muted-foreground line-clamp-1">{book.author}</p>
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

      {/* No results message */}
      {allBooks.length === 0 && (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium mb-2">No books found</h3>
          <p className="text-muted-foreground">Try adjusting your search filters</p>
          <Button variant="outline" className="mt-4" onClick={resetFilters}>
            Clear all filters
          </Button>
        </div>
      )}

      {/* Loading indicator and intersection target */}
      {hasNextPage && (
        <div ref={ref} className="flex justify-center py-4">
          {isFetchingNextPage ? (
            <div className="flex items-center justify-center">
              <div className="h-6 w-6 animate-spin rounded-full border-b-2 border-primary"></div>
              <span className="ml-2">Loading more...</span>
            </div>
          ) : (
            <Button variant="outline" onClick={() => fetchNextPage()}>
              Load More
            </Button>
          )}
        </div>
      )}
    </div>
  )
}