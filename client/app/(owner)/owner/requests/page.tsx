"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { BookOpen, MessageSquare } from "lucide-react"
import Link from "next/link"
import { useRequests } from "@/hooks/use-request"
import { formatDistanceToNow } from "date-fns"
import Loading from "@/components/loader"
import Error from "@/components/error"
import { Request } from "@/lib/types"

export default function RequestsPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("all")

  // Load requests based on user role
  const { getAllRequests, getAllMyRequests } = useRequests()
  const allRequests = getAllRequests()
  const myRequests = getAllMyRequests()


  // Loading states
  if (allRequests.isLoading || myRequests.isLoading) {
    return (
    <Loading/>
    )
  }

  // Error states
  if (allRequests.isError || myRequests.isError) {
    return (
      <Error message="Failed to load requests" />
    )
  }

  return (
    <>
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Book Requests</h1>
        </div>
          <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
            <TabsList className="grid w-full max-w-md grid-cols-2 mb-8">
              <TabsTrigger value="all">All Requests</TabsTrigger>
              <TabsTrigger value="responded">My Responses</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-4">
              {allRequests.data?.requests?.length === 0 ? (
                <div className="text-center py-12">
                  <BookOpen className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-xl font-medium">No requests available</h3>
                  <p className="text-muted-foreground mt-2">There are no book requests at the moment.</p>
                </div>
              ) : (
                allRequests.data?.requests?.map((request:Request) => (
                  <RequestCard key={request.id} request={request} isOwner={true} responded={request.respond} />
                ))
              )}
            </TabsContent>

            <TabsContent value="responded" className="space-y-4">
              {myRequests.data?.requests?.length === 0 ? (
                <div className="text-center py-12">
                  <MessageSquare className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-xl font-medium">No responses yet</h3>
                  <p className="text-muted-foreground mt-2">You haven't responded to any requests yet.</p>
                </div>
              ) : (
                myRequests.data?.requests?.map((request:Request) => (
                  <RequestCard key={request.id} request={request} isOwner={true} responded={true} />
                ))
              )}
            </TabsContent>
          </Tabs>
      </div>
    </>
  )
}

// RequestCard component for displaying individual requests
function RequestCard({ request, isOwner, responded }:{
  request: Request
  isOwner: boolean
  responded: boolean
}) {
  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl">{request.title}</CardTitle>
            <CardDescription>
              Requested by {request.user?.name} • {formatDistanceToNow(new Date(request.createdAt), { addSuffix: true })}
            </CardDescription>
          </div>
          <Badge variant={responded ? "default" : "secondary"}>{responded ? "Responded" : "Pending"}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <p className="line-clamp-2 text-muted-foreground">{request.description || "No description provided."}</p>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Link href={`/owner/requests/${request.id}`}>
          <Button variant="outline">View Details</Button>
        </Link>
      </CardFooter>
    </Card>
  )
}
