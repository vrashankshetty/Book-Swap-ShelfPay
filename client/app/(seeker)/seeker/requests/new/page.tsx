"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Navbar from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { toast } from "@/hooks/use-toast"
import { Loader2, ArrowLeft } from "lucide-react"
import { useRequests } from "@/hooks/use-request"

export default function CreateRequestPage() {
  const router = useRouter()
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const { addRequest } = useRequests()
  const addRequestMutation = addRequest()

  const handleSubmit = async (e:any) => {
    e.preventDefault()
    if (!title.trim()) {
      toast({
        title: "Title required",
        description: "Please provide a title for your request.",
        variant: "destructive",
      })
      return
    }

    if (!description.trim()) {
        toast({
          title: "Description required",
          description: "Please provide a description for your request.",
          variant: "destructive",
        })
        return
      }
    try {
      await addRequestMutation.mutateAsync({ title,description})
      toast({
        title: "Request created",
        description: "Your book request has been submitted successfully.",
      })
      router.push("/seeker/requests")
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create your request. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Button variant="ghost" onClick={() => router.push("/seeker/requests")}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Requests
          </Button>
        </div>

        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Create Book Request</CardTitle>
            <CardDescription>
              Let the community know what book you're looking for. Be specific to get better responses.
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Request Title</Label>
                <Input
                  id="title"
                  placeholder="E.g., Looking for 'The Great Gatsby' in hardcover"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description (Optional)</Label>
                <Textarea
                  id="description"
                  placeholder="Provide more details about the book you're looking for, edition preferences, condition, etc."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={6}
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button type="button" variant="outline" onClick={() => router.push("/request")}>
                Cancel
              </Button>
              <Button type="submit" disabled={addRequestMutation.isPending}>
                {addRequestMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Submit Request
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </>
  )
}
