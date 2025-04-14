"use client"

import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { toast } from "@/hooks/use-toast"
import { Loader2, ArrowLeft, Clock, User, MessageSquare } from "lucide-react"
import Link from "next/link"
import { useRequests } from "@/hooks/use-request"
import { formatDistanceToNow, format } from "date-fns"
import Loading from "@/components/loader"
import Error from "@/components/error"

export default function RequestDetailPage() {
  const params = useParams()
  const router = useRouter() 
  const id = Number(params.id)


  const { getRequestById, deleteRequest } = useRequests()
  const { data, isLoading, isError } = getRequestById(id)
  const deleteRequestMutation = deleteRequest()



  // Handle request deletion
  const handleDeleteRequest = async () => {
    if (confirm("Are you sure you want to delete this request?")) {
      try {
        await deleteRequestMutation.mutateAsync(id)
        toast({
          title: "Request deleted",
          description: "Your request has been deleted successfully.",
        })
        router.push("/seeker/requests")
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete the request. Please try again.",
          variant: "destructive",
        })
      }
    }
  }

  // Loading state
  if (isLoading) {
    return (
     <Loading/>
    )
  }

  // Error state
  if (isError || !data) {
    return (
      <Error message="Failed to load request details" />
    )
  }

  const request = data.request


  return (
    <>
     {request &&
      <>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Button variant="ghost" onClick={() => router.push("/seeker/requests")}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Requests
          </Button>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-2xl">{request.title}</CardTitle>
                    <CardDescription className="flex items-center mt-2">
                      <User className="h-4 w-4 mr-1" /> {request.user.name}
                    </CardDescription>
                  </div>
                  <Badge variant={request.respond ? "default" : "secondary"}>
                    {request.respond ? "Responded" : "Pending"}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent>
                <div className="flex items-center text-sm text-muted-foreground mb-4">
                  <Clock className="h-4 w-4 mr-1" />
                  <span>Posted {formatDistanceToNow(new Date(request.createdAt), { addSuffix: true })}</span>
                </div>

                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-2">Request Details</h3>
                  <p className="whitespace-pre-wrap">{request.description || "No description provided."}</p>
                </div>

                {request.respond && (
                  <>
                    <Separator className="my-6" />
                    <div>
                      <div className="flex items-center mb-2">
                        <MessageSquare className="h-5 w-5 mr-2 text-primary" />
                        <h3 className="text-lg font-semibold">Owner's Response</h3>
                      </div>
                      <div className="bg-secondary/50 p-4 rounded-lg">
                        <p className="whitespace-pre-wrap">{request.response}</p>
                        <p className="text-sm text-muted-foreground mt-2">
                          Responded By {request.owner.name}
                        </p>
                      </div>
                    </div>
                  </>
                )}
              </CardContent>

             
                <CardFooter>
                  <Button
                    variant="destructive"
                    onClick={handleDeleteRequest}
                    disabled={deleteRequestMutation.isPending}
                  >
                    {deleteRequestMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Delete Request
                  </Button>
                </CardFooter>
              
            </Card>
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle>Request Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="text-sm font-semibold mb-1">Status</h4>
                  <Badge
                    variant={request.respond ? "default" : "secondary"}
                    className="w-full flex justify-center py-1"
                  >
                    {request.respond ? "Responded" : "Awaiting Response"}
                  </Badge>
                </div>

                <div>
                  <h4 className="text-sm font-semibold mb-1">Created On</h4>
                  <p className="text-sm text-muted-foreground">{format(new Date(request.createdAt), "PPP")}</p>
                </div>

                <div>
                  <h4 className="text-sm font-semibold mb-1">Request ID</h4>
                  <p className="text-sm text-muted-foreground">#{request.id}</p>
                </div>
              </CardContent>
            </Card>

            
          </div>
        </div>
      </div>
      </>
     }
    </>
  )
}
