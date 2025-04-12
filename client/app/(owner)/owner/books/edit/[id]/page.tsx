"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { useBooks } from "@/hooks/use-books"

// Define the validation schema with Zod
const bookSchema = z.object({
  title: z.string().min(1, "Title is required"),
  author: z.string().min(1, "Author is required"),
  genre: z.string().min(1, "Genre is required"),
  status: z.string().min(1, "Status is required"),
  city: z.string().min(1, "City is required"),
  contact: z.string().min(1, "Contact number is required"),
  description: z.string().optional(),
})

type BookFormData = z.infer<typeof bookSchema>

export default function EditBookPage() {
  const { toast } = useToast()
  const router = useRouter()
  const params = useParams()
  const bookId = params.id as string
  const { getBookById, updateBook } = useBooks()
  const {data,isLoading,isError} =  getBookById(parseInt(bookId))
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<Partial<Record<keyof BookFormData, string>>>({})
  
  const [formData, setFormData] = useState<BookFormData>({
    title: "",
    author: "",
    genre: "",
    status: "",
    city: "",
    contact: "",
    description: "",
  })

  // Fetch book data
  useEffect(() => {
    if (!data?.book) return;
  
    const { title, author, genre, status, city, contact, description } = data.book;
  
    setFormData({
      title: title || "",
      author: author || "",
      genre: genre || "",
      status: status || "",
      city: city || "",
      contact: contact || "",
      description: description || "",
    });
  }, [data?.book]); 
  




  // Handle input changes
  const handleChange = (field: keyof BookFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      const validatedData = bookSchema.parse(formData)
      const form = new FormData()
      Object.entries(validatedData).forEach(([key, value]) => {
        if (value) form.append(key, value)
      })
      
      const fileInput = document.getElementById("cover") as HTMLInputElement
      if (fileInput?.files?.[0]) {
        form.append("coverImage", fileInput.files[0])
      }
      
      await updateBook().mutate({id:parseInt(bookId) as number,bookData:form})
      toast({
        title: "Book Updated",
        description: "Your book has been successfully updated.",
      })
      
      router.push("/owner/books")
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Partial<Record<keyof BookFormData, string>> = {}
        error.errors.forEach((err) => {
          if (err.path[0]) {
            fieldErrors[err.path[0] as keyof BookFormData] = err.message
          }
        })
        setErrors(fieldErrors)
        toast({
          title: "Validation Error",
          description: "Please check the form for errors.",
          variant: "destructive",
        })
      } else {
        toast({
          title: "Error",
          description: "Failed to update book. Please try again.",
          variant: "destructive",
        })
        console.error("Error updating book:", error)
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto max-w-3xl px-4 py-8">
        <Card>
          <CardContent className="flex items-center justify-center py-16">
            <p>Loading book data...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto max-w-3xl px-4 py-8">
      <h1 className="mb-6 text-3xl font-bold">Edit Book</h1>

      <Card>
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>Book Details</CardTitle>
            <CardDescription>Update the details of your book</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleChange("title", e.target.value)}
                    placeholder="Enter book title"
                    className={errors.title ? "border-red-500" : ""}
                  />
                  {errors.title && <p className="text-sm text-red-500">{errors.title}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="author">Author</Label>
                  <Input
                    id="author"
                    value={formData.author}
                    onChange={(e) => handleChange("author", e.target.value)}
                    placeholder="Enter author name"
                    className={errors.author ? "border-red-500" : ""}
                  />
                  {errors.author && <p className="text-sm text-red-500">{errors.author}</p>}
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="genre">Genre</Label>
                  <Select
                      value={formData.genre}
                      onValueChange={(value) => {
                        if (value) handleChange("genre", value.toLocaleLowerCase());
                      }}
                    >
                      <SelectTrigger id="genre" className={errors.genre ? "border-red-500" : ""}>
                        <SelectValue placeholder="Select genre" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="fiction">Fiction</SelectItem>
                        <SelectItem value="non-fiction">Non-Fiction</SelectItem>
                        <SelectItem value="mystery">Mystery</SelectItem>
                        <SelectItem value="sci-fi">Science Fiction</SelectItem>
                        <SelectItem value="fantasy">Fantasy</SelectItem>
                        <SelectItem value="biography">Biography</SelectItem>
                        <SelectItem value="history">History</SelectItem>
                        <SelectItem value="self-help">Self-Help</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  {errors.genre && <p className="text-sm text-red-500">{errors.genre}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select value={formData.status}
                   onValueChange={(value) => {
                    if (value) handleChange("status", value.toLocaleLowerCase());
                  }}
                  >
                    <SelectTrigger id="status" className={errors.status ? "border-red-500" : ""}>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="available">Available</SelectItem>
                      <SelectItem value="rented">Rented</SelectItem>
                      <SelectItem value="exchanged">Exchanged</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.status && <p className="text-sm text-red-500">{errors.status}</p>}
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => handleChange("city", e.target.value)}
                    placeholder="Enter your city"
                    className={errors.city ? "border-red-500" : ""}
                  />
                  {errors.city && <p className="text-sm text-red-500">{errors.city}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contact">Contact Number</Label>
                  <Input
                    id="contact"
                    value={formData.contact}
                    onChange={(e) => handleChange("contact", e.target.value)}
                    placeholder="Enter contact number"
                    className={errors.contact ? "border-red-500" : ""}
                  />
                  {errors.contact && <p className="text-sm text-red-500">{errors.contact}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description || ""}
                  onChange={(e) => handleChange("description", e.target.value)}
                  placeholder="Enter book description"
                  rows={4}
                  className={errors.description ? "border-red-500" : ""}
                />
                {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="cover">Cover Image</Label>
                <div className="flex items-center gap-4">
                  <Input id="cover" type="file" accept="image/*" className="cursor-pointer" />
                </div>
                <p className="text-sm text-muted-foreground">Upload a new cover image (optional, max 5MB)</p>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end gap-4 border-t px-6 py-4">
            <Button type="button" variant="outline" onClick={() => router.back()}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Updating..." : "Update Book"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}