"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Navbar from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Loader2, Plus, BookOpen, MessageSquare } from "lucide-react"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"
import Loading from "@/components/loader"
import Error from "@/components/error"
import { Request } from "@/lib/types"
import { useRequests } from "@/hooks/use-request"

export default function RequestsPage() {
  const router = useRouter()
  const { getUserRequests } = useRequests()
  const userRequests = getUserRequests()

  const handleCreateRequest = () => {
    router.push("/seeker/requests/new")
  }

  // Loading states
  if (userRequests.isLoading) {
    return <Loading/>
  }

  // Error states
  if (userRequests.isError) {
    return <Error message="Failed to load requests" />
  }

  return (
    <>
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Book Requests</h1>
            <Button onClick={handleCreateRequest}>
              <Plus className="mr-2 h-4 w-4" /> Create Request
            </Button>
        </div>
          <div className="space-y-4">
            {userRequests.data?.requests?.length === 0 ? (
              <div className="text-center py-12">
                <BookOpen className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-xl font-medium">No requests yet</h3>
                <p className="text-muted-foreground mt-2">You haven't made any book requests yet.</p>
                <Button onClick={handleCreateRequest} className="mt-4">
                  <Plus className="mr-2 h-4 w-4" /> Create Your First Request
                </Button>
              </div>
            ) : (
                userRequests.data?.requests?.map((request:Request) => (
                <Card className="w-full" key={request.id}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-xl">{request.title}</CardTitle>
                          <CardDescription>
                            Requested At {formatDistanceToNow(new Date(request.createdAt), { addSuffix: true })}
                          </CardDescription>
                        </div>
                        <Badge variant={request.respond ? "default" : "secondary"}>{request.respond ? "Responded" : "Pending"}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                   
                    </CardContent>
                    <CardFooter className="flex justify-end">
                      <Link href={`/seeker/requests/${request.id}`}>
                        <Button variant="outline">View Details</Button>
                      </Link>
                    </CardFooter>
                  </Card>
              ))
            )}
          </div>
      </div>
    </>
  )
}

