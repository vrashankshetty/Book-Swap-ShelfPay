"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { userApi } from "@/lib/api"
import type { User } from "@/lib/types"

export function useUser() {
  const queryClient = useQueryClient()

  const getProfileQuery = useQuery({
    queryKey: ["userProfile"],
    queryFn: userApi.getProfile,
  })

  const getDashoard = useQuery({
    queryKey: ["userDashboard"],
    queryFn: userApi.getDashoard,
  })

  const updateProfileMutation = useMutation({
    mutationFn: (userData: Partial<User>) => userApi.updateProfile(userData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userProfile"] })
    },
  })

  

  return {
    getProfileQuery,
    getDashoard,
    updateProfile: updateProfileMutation.mutate,
  }
}
