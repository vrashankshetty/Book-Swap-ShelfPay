"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { requestsApi } from "@/lib/api"
import type { Request } from "@/lib/types"

export function useRequests() {
  const queryClient = useQueryClient()

  const getAllRequests = () =>
    useQuery({
      queryKey: ["all-requests"],
      queryFn: requestsApi.getAllRequests,
    })

  const getAllMyRequests = () =>
    useQuery({
      queryKey: ["my-requests"],
      queryFn: requestsApi.getAllMyRequests,
    })

  const getUserRequests = () =>
    useQuery({
      queryKey: ["user-requests"],
      queryFn: requestsApi.getUserRequests,
    })

  const getRequestByIdQuery = (id: number) =>
    useQuery({
      queryKey: ["request", id],
      queryFn: () => requestsApi.getRequestById(id),
      enabled: !!id,
    })

  const addRequestMutation = useMutation({
    mutationFn: (data: { title: string,description:string }) => requestsApi.addRequest(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["all-requests"] })
      queryClient.invalidateQueries({ queryKey: ["my-requests"] })
      queryClient.invalidateQueries({ queryKey: ["user-requests"] })
    },
  })

  const updateRequestMutation = useMutation({
    mutationFn: ({ id, response }: { id: number; response: string }) =>
      requestsApi.updateRequest(id, response),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["all-requests"] })
      queryClient.invalidateQueries({ queryKey: ["my-requests"] })
      queryClient.invalidateQueries({ queryKey: ["user-requests"] })
      queryClient.invalidateQueries({ queryKey: ["request", variables.id] })
    },
  })

  const deleteRequestMutation = useMutation({
    mutationFn: (id: number) => requestsApi.deleteRequest(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["all-requests"] })
      queryClient.invalidateQueries({ queryKey: ["my-requests"] })
      queryClient.invalidateQueries({ queryKey: ["user-requests"] })
    },
  })

  return {
    getAllRequests: () => getAllRequests(),
    getAllMyRequests: () => getAllMyRequests(),
    getUserRequests: () => getUserRequests(),
    getRequestById: (id: number) => getRequestByIdQuery(id),
    addRequest: () => addRequestMutation,
    updateRequest: () => updateRequestMutation,
    deleteRequest: () => deleteRequestMutation,
  }
}
