"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, User, BookOpen, Calendar } from "lucide-react"
import Image from "next/image"
import { useBooks } from "@/hooks/use-books"
import Loading from "@/components/loader"
import Error from "@/components/error"
import { type Usable, use } from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import DialogLoginScreen from "@/components/dialogs/login-info"

export default function BookDetailPage({ params }: { params: Usable<{ id: string }> }) {
  const { id: bookId } = use(params)
  const { data, isLoading, isError } = useBooks().getBookById(Number.parseInt(bookId))
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const router = useRouter()

  const handleActionClick = () => {
    setIsDialogOpen(true)
  }

  const handleContinueToLogin = () => {
    setIsDialogOpen(false)
    router.push("/auth/login")
  }

  if (isLoading) {
    return (
      <div>
        <Loading />
      </div>
    )
  }
  if (isError) {
    return (
      <div>
        <Error message="Error fetching!!" />
      </div>
    )
  }

  return (
    data?.book && (
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

            </div>
          </div>

          <div className="md:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <div>
            <h1 className="mb-2 text-3xl font-bold">{data?.book.title}</h1>
            <p className="mb-6 text-xl text-muted-foreground">{data?.book.author}</p>
            </div>
            <div className="flex flex-row gap-2">
              <Button className="mb-4 w-full" onClick={()=>handleActionClick()}>
                  For Rent @ $5
                </Button>
                <Button className="mb-4 w-full" onClick={()=>handleActionClick()}>
                  Exchange
              </Button>
            </div>
            </div>

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
                <p>{data?.book.description}</p>
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
        <DialogLoginScreen isDialogOpen={isDialogOpen} setIsDialogOpen={setIsDialogOpen} onSubmit={handleContinueToLogin}/>
      </div>
    )
  )
}
