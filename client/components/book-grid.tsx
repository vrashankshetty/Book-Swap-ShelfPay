"use client"

import type { Book } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Edit, MoreVertical, Trash } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import { useState } from "react"
import { useBooks } from "@/hooks/use-books"
import DialogDeleteScreen from "./dialogs/delete-info"

interface BookGridProps {
  isManageable?: boolean
  books: Book[]
}

export default function BookGrid({ isManageable = false,books }: BookGridProps) {
  const { toast } = useToast()
  const [isDialogOpen,setIsDialogOpen] = useState(false);
  const deleteBook = useBooks().deleteBook()
  const [deleteBookId, setDeleteBookId] = useState<number | undefined>(undefined)

  const handleActionClick = () => {
    setIsDialogOpen(true)
  }


  const handleDeleteBook = async() => {
    try{
      if(deleteBookId){
        await deleteBook.mutateAsync(deleteBookId);
        setDeleteBookId(undefined);
        toast({
          title: "Book deleted",
          description: "The book has been successfully deleted.",
        })
        setIsDialogOpen(false);
      }else{
        toast({
          title: "Error",
          description: "Failed to delete the book.",
          variant: "destructive",
        })
      }
    }catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete the book.",
        variant: "destructive",
      })
    }
  }

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
          <Link href={`/owner/books/${book.$loki}`}>
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
              {isManageable && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="-mr-2">
                      <MoreVertical className="h-4 w-4" />
                      <span className="sr-only">Open menu</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link href={`/owner/books/edit/${book.$loki}`}>
                        <Edit className="mr-2 h-4 w-4" />
                        <span>Edit</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => {
                        setDeleteBookId(book.$loki)
                        handleActionClick()
                      }}
                      className="text-destructive focus:text-destructive"
                    >
                      <Trash className="mr-2 h-4 w-4" />
                      <span>Delete</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
            <div className="mt-2 flex items-center text-xs text-muted-foreground">
              <span>{book.city}</span>
              <span className="mx-2">•</span>
              <span>{book.genre}</span>
            </div>
          </div>
        </div>
      ))}
      <DialogDeleteScreen isDialogOpen={isDialogOpen}  setIsDialogOpen={setIsDialogOpen} onSubmit={handleDeleteBook}/>
    </div>
  )
}
