"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, User, BookOpen, Calendar } from "lucide-react"
import Image from "next/image"
import { useBooks } from "@/hooks/use-books"
import Loading from "@/components/loader"
import Error from "@/components/error"
import { Usable, use, useState } from "react"
import DialogRentScreen from "@/components/dialogs/rent-info"
import { toast } from "sonner"
import { useToast } from "@/hooks/use-toast"

type status = "available"|"rented"|"exchanged";

export default function BookDetailPage({ params }: { params: Usable<{ id: string }> }) {
  const {id:bookId} = use(params);
  const {getBookById,toggleBookStatus} = useBooks();
  const {data,isLoading,isError,refetch} = getBookById(parseInt(bookId));
  const [status,setStatus]  = useState<status>("available");
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const {toast} = useToast();

  if (isLoading) {
    return <div><Loading/></div>
  }
  if (isError) {
    return <div><Error message="Error fetching!!"/></div>
  }




  const handleActionClick = (status:status) => {
    setStatus(status);
    setIsDialogOpen(true)
  }

  const handleContinueToLogin = async(status:status) => {
    try{
      const success = toggleBookStatus().isSuccess
      toggleBookStatus().mutate({id:bookId,status:status});
        toast({
          title: "Book Status Updated",
          description: "Successfully Performed the action!",
        })
        refetch();
    } 
    catch(e){
      toast({
        title: "Error",
        description: "Failed to update status. Please try again.",
        variant: "destructive",
      })
    }
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
          </div>
        </div>

        <div className="md:col-span-2">
          <div className="mb-4 flex items-center justify-between">
          <div>
          <h1 className="mb-2 text-3xl font-bold">{data?.book.title}</h1>
          <p className="mb-6 text-xl text-muted-foreground">{data?.book.author}</p>
          </div>
          <div className="flex flex-row gap-2">
            <Button className={`mb-4 w-full`} disabled={data?.book.status!="available"} onClick={()=>handleActionClick("rented")}>
                For Rent @ $5
              </Button>
              <Button className="mb-4 w-full" disabled={data?.book.status!="available"} onClick={()=>handleActionClick("exchanged")}>
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
       <DialogRentScreen isDialogOpen={isDialogOpen} setIsDialogOpen={setIsDialogOpen} onSubmit={()=>handleContinueToLogin(status)}/>
    </div>)
  )
}
