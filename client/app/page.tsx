"use client"
import Navbar from "@/components/navbar"
import RecentBookGrid from "@/components/recent-book-grid"
import { Button } from "@/components/ui/button"
import { useBooks } from "@/hooks/use-books"
import { Loader2 } from "lucide-react"
import { VIDEO_URL } from "@/constants"
import Link from "next/link"
import { useEffect, useState } from "react"

export default function Home() {
  const { data, isLoading, isError } = useBooks().getRecentBooks()
  const [recentData, setRecentData] = useState([])

  useEffect(() => {
    if (data?.books) {
      setRecentData(data?.books)
    }
  }, [data?.books])
  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <section className="mb-12 mt-8">
          <div className="flex flex-col items-center justify-center text-center">
            <h1 className="mb-4 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
              Discover and Share
              <span className="block text-primary">Books You Love</span>
            </h1>
            <p className="mb-8 max-w-2xl text-lg text-muted-foreground">
              Join our community of book lovers to find, rent, or exchange books with people in your city.
            </p>
            {/* YouTube Video Embed */}
            <div className="w-full max-w-3xl mx-auto mb-8 rounded-xl overflow-hidden shadow-lg">
              <div className="relative pb-[56.25%] h-0">
              <iframe
                className="absolute top-0 left-0 w-full h-full"
                src={`${VIDEO_URL}?autoplay=1&mute=1`}
                title="Tutorial Video"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-12">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-bold">Recently Added Books</h2>
            <Link href="/books">
              <Button variant="link">View all</Button>
            </Link>
          </div>
          {isLoading && (
            <div className="text-center">
              <Loader2 className="h-16 w-16 animate-spin text-primary mx-auto" />
              <h2 className="mt-4 text-xl font-semibold text-gray-500">Loading</h2>
            </div>
          )}
          {isError && <div className="text-center">Error fetching books</div>}
          {!isLoading && !isError && data?.books.length === 0 && <div>No books found</div>}
          <RecentBookGrid books={recentData} />
        </section>

        <section className="mb-12 rounded-xl bg-secondary p-8">
          <div className="grid gap-8 md:grid-cols-2">
            <div>
              <h2 className="mb-4 text-3xl font-bold">Share Your Books</h2>
              <p className="mb-6 text-muted-foreground">
                Have books collecting dust on your shelf? List them on BookSwap and connect with readers in your
                community.
              </p>
              <Link href="/auth/register">
                <Button size="lg">Get Started</Button>
              </Link>
            </div>
            <div className="flex items-center justify-center">
              <div className="relative h-64 w-64">
                <div className="absolute left-0 top-0 h-full w-full rotate-[-6deg] rounded-lg bg-primary/20"></div>
                <div className="absolute left-4 top-4 h-full w-full rotate-[-3deg] rounded-lg bg-primary/30"></div>
                <div className="absolute left-8 top-8 h-full w-full rounded-lg bg-primary/40"></div>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-12">
          <div className="mb-6">
            <h2 className="text-2xl font-bold">How It Works</h2>
          </div>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-lg bg-card p-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/20 text-primary">
                1
              </div>
              <h3 className="mb-2 text-xl font-semibold">Create an Account</h3>
              <p className="text-muted-foreground">Sign up as a book owner or seeker to get started.</p>
            </div>
            <div className="rounded-lg bg-card p-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/20 text-primary">
                2
              </div>
              <h3 className="mb-2 text-xl font-semibold">List or Browse Books</h3>
              <p className="text-muted-foreground">Add your books to share or browse available books in your area.</p>
            </div>
            <div className="rounded-lg bg-card p-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/20 text-primary">
                3
              </div>
              <h3 className="mb-2 text-xl font-semibold">Connect & Exchange</h3>
              <p className="text-muted-foreground">Contact book owners and arrange to rent or exchange books.</p>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}
