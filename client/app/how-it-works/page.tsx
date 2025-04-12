"use client"

import Navbar from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { BookOpen, Filter, RefreshCw, Calendar, Search, UserCircle, ArrowRight } from "lucide-react"
import Link from "next/link"
import { VIDEO_URL } from "@/constants"
export default function HowItWorks() {
 
  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <section className="mb-16">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl mb-6">
              How <span className="text-primary">BookSwap</span> Works
            </h1>
            <p className="max-w-2xl mx-auto text-xl text-muted-foreground mb-8">
              Our platform makes it easy to share, discover, and exchange books with people in your community.
            </p>
            <div className="flex justify-center gap-4">
              <Link href="/auth/register">
                <Button size="lg">Get Started</Button>
              </Link>
              <Link href="/books">
                <Button size="lg" variant="outline">
                  Browse Books
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Video Section */}
        <section className="mb-16">
          <div className="max-w-4xl mx-auto">
            <div className="rounded-xl overflow-hidden shadow-xl">
              <div className="relative pb-[56.25%] h-0">
              <iframe
                  className="absolute top-0 left-0 w-full h-full"
                  src={VIDEO_URL}
                  title="Tutorial Video"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            </div>
            <p className="text-center mt-4 text-muted-foreground">
              Watch our tutorial to see how easy it is to use BookSwap
            </p>
          </div>
        </section>

        {/* Process Section */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">The BookSwap Process</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our platform connects book owners with seekers for easy renting and exchanging. See how simple it is to
              get started.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
            <div className="space-y-8">
              <div className="flex gap-4 items-start">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/20 text-primary">
                  <UserCircle className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-2xl font-semibold mb-3">For Book Owners</h3>
                  <ul className="space-y-4 text-muted-foreground">
                    <li className="flex items-start gap-3">
                      <span className="bg-primary/20 text-primary rounded-full h-7 w-7 flex items-center justify-center shrink-0 mt-0.5">
                        1
                      </span>
                      <span>Create an account and set up your profile with your reading preferences and location</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="bg-primary/20 text-primary rounded-full h-7 w-7 flex items-center justify-center shrink-0 mt-0.5">
                        2
                      </span>
                      <span>List your books with details, photos, and condition information</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="bg-primary/20 text-primary rounded-full h-7 w-7 flex items-center justify-center shrink-0 mt-0.5">
                        3
                      </span>
                      <span>Set your preferences for rental duration, price, or exchange requirements</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="bg-primary/20 text-primary rounded-full h-7 w-7 flex items-center justify-center shrink-0 mt-0.5">
                        4
                      </span>
                      <span>
                        Connect with interested readers and arrange exchanges through our secure messaging system
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="space-y-8">
              <div className="flex gap-4 items-start">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/20 text-primary">
                  <BookOpen className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-2xl font-semibold mb-3">For Book Seekers</h3>
                  <ul className="space-y-4 text-muted-foreground">
                    <li className="flex items-start gap-3">
                      <span className="bg-primary/20 text-primary rounded-full h-7 w-7 flex items-center justify-center shrink-0 mt-0.5">
                        1
                      </span>
                      <span>Sign up and browse available books in your area using our interactive map</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="bg-primary/20 text-primary rounded-full h-7 w-7 flex items-center justify-center shrink-0 mt-0.5">
                        2
                      </span>
                      <span>Use advanced filters to find specific genres, authors, titles, or book conditions</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="bg-primary/20 text-primary rounded-full h-7 w-7 flex items-center justify-center shrink-0 mt-0.5">
                        3
                      </span>
                      <span>Contact book owners through our messaging system to discuss details</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="bg-primary/20 text-primary rounded-full h-7 w-7 flex items-center justify-center shrink-0 mt-0.5">
                        4
                      </span>
                      <span>Arrange rental terms or book exchanges and enjoy your new reading material</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Key Features</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              BookSwap offers a range of features designed to make book sharing simple, safe, and enjoyable.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-card rounded-xl p-6 shadow-sm">
              <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center mb-4">
                <Filter className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Advanced Filtering</h3>
              <p className="text-muted-foreground">
                Find exactly what you're looking for with our comprehensive search and filter system.
              </p>
            </div>

            <div className="bg-card rounded-xl p-6 shadow-sm">
              <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center mb-4">
                <RefreshCw className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Book Exchanges</h3>
              <p className="text-muted-foreground">
                Trade books with other readers in your area to refresh your collection without spending money.
              </p>
            </div>

            <div className="bg-card rounded-xl p-6 shadow-sm">
              <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center mb-4">
                <Calendar className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Flexible Rentals</h3>
              <p className="text-muted-foreground">
                Set your own rental terms, including duration and price, or opt for free community sharing.
              </p>
            </div>

            <div className="bg-card rounded-xl p-6 shadow-sm">
              <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center mb-4">
                <Search className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Local Search</h3>
              <p className="text-muted-foreground">
                Find books near you with our location-based search to minimize travel and maximize convenience.
              </p>
            </div>
          </div>
        </section>
        
      </div>
    </>
  )
}
