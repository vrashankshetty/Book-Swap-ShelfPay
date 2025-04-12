"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { authApi } from "@/lib/api"
import type { User } from "@/lib/types"
import { useAuth } from "@/components/auth-provider"

export function useAuthMutations() {
  const queryClient = useQueryClient()
  const { login: authLogin, register: authRegister } = useAuth()

  const login = useMutation({
    mutationFn: async ({
      email,
      password,
    }: {
      email: string
      password: string
    }) => {
      const data = await authApi.login(email, password)
      return data
    },
    onSuccess: async (data, variables) => {
      await authLogin(variables.email, variables.password)
      queryClient.invalidateQueries({ queryKey: ["userDashboard"] })
    },
  })

  const register = useMutation({
    mutationFn: async (userData: User) => {
      const data = await authApi.register(userData)
      return data
    },
    onSuccess: async (data, variables) => {
      await authRegister(variables)
      queryClient.invalidateQueries({ queryKey: ["userDashboard"] })
    },
  })

  
  return {
    login,
    register,
  }
}
