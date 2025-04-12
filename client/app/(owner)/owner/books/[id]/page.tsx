"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, User, BookOpen, Calendar } from "lucide-react"
import Image from "next/image"
import { useBooks } from "@/hooks/use-books"
import Loading from "@/components/loader"
import Error from "@/components/error"
import { Usable, use } from "react"

export default function BookDetailPage({ params }: { params: Usable<{ id: string }> }) {
  const {id:bookId} = use(params);
  // Fetch book details using the bookId
  const {data,isLoading,isError} = useBooks().getBookById(parseInt(bookId));
  if (isLoading) {
    return <div><Loading/></div>
  }
  if (isError) {
    return <div><Error message="Error fetching!!"/></div>
  }

  return (
    (data?.book
      &&
    <div className="container mx-auto px-4 py-8">
      <div className="grid gap-8 md:grid-cols-3">
        <div className="md:col-span-1">
          <div className="sticky top-24">
            <div className="relative mb-4 overflow-hidden rounded-lg">
              <Image
                src={`${data?.book.coverImage || "/placeholder.svg"}`}
                alt="Book Cover"
                width={400}
                height={600}
                className="w-full object-cover"
              />
              <Badge className="absolute right-2 top-2" variant={data?.book.status}>
                {(data?.book.status.charAt(0).toUpperCase() + data?.book.status.slice(1))}
              </Badge>
            </div>
            {/* <Button className="mb-4 w-full">Contact Owner</Button> */}
          </div>
        </div>

        <div className="md:col-span-2">
          <h1 className="mb-2 text-3xl font-bold">{data?.book.title}</h1>
          <p className="mb-6 text-xl text-muted-foreground">{data?.book.author}</p>

          <div className="mb-8 grid gap-4 sm:grid-cols-2">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-base">
                  <MapPin className="h-4 w-4" /> Location
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>{data?.book.city}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-base">
                  <User className="h-4 w-4" /> Owner
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>{data?.book.user.name}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-base">
                  <BookOpen className="h-4 w-4" /> Genre
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>{(data?.book.genre as string).toLocaleUpperCase()}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Calendar className="h-4 w-4" /> Listed
                </CardTitle>
              </CardHeader>
              <CardContent>
              <p>{new Date(data?.book.createdAt).toLocaleDateString()}</p>
              </CardContent>
            </Card>
          </div>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
               {data?.book.description}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
              <CardDescription>Reach out to the owner to arrange a rental or exchange</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-2">
                <span className="font-semibold">Phone:</span> {data?.book.contact}
              </p>
              <p>
                <span className="font-semibold">Email:</span> {data?.book.user.email}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>)
  )
}
