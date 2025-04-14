"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { toast } from "@/hooks/use-toast"
import { Loader2, ArrowLeft, Clock, User, MessageSquare } from "lucide-react"
import { useRequests } from "@/hooks/use-request"
import { formatDistanceToNow, format, set } from "date-fns"
import Loading from "@/components/loader"
import Error from "@/components/error"

export default function RequestDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [response, setResponse] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const id = Number(params.id)

  // Get request details and mutation functions
  const { getRequestById, updateRequest } = useRequests()
  const { data, isLoading, isError } = getRequestById(id)
  const updateRequestMutation = updateRequest()


  // Handle owner's response submission
  const handleSubmitResponse = async () => {
    if (!response.trim()) {
      toast({
        title: "Response required",
        description: "Please enter your response before submitting.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)
    try {
      await updateRequestMutation.mutateAsync({ id, response })
      toast({
        title: "Response submitted",
        description: "Your response has been sent to the requester.",
      })
      setResponse("")
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit your response. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  useEffect(()=>{
    setResponse(data?.request?.response || "")
  },[data])

  
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

  console.log(request)
  return (
    <>
      {request &&
      <>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Button variant="ghost" onClick={() => router.push("/owner/requests")}>
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

                {request.responded && (
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
                          Responded {formatDistanceToNow(new Date(request.respondedAt), { addSuffix: true })}
                        </p>
                      </div>
                    </div>
                  </>
                )}
              </CardContent>


                <CardFooter className="flex-col items-start gap-4">
                  <Separator />
                  {!request.canRespond?
                  <div>
                    This request has been responded to by the owner. You can no longer respond to this request.
                  </div>
                  :<div className="w-full">
                    <h3 className="text-lg font-semibold mb-2">Your Response</h3>
                    <Textarea
                      value={response}
                      onChange={(e) => setResponse(e.target.value)}
                      placeholder="Write your response to this request..."
                      className="mb-4"
                      rows={6}
                    />
                    <Button onClick={handleSubmitResponse} disabled={isSubmitting || !request.canRespond} className="w-full sm:w-auto">
                      {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Submit Response
                    </Button>
                  </div>}
                </CardFooter>
            
            </Card>
          </div>
        </div>
      </div>
      </>
      }
    </>
  )
}
