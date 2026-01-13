import { useNavigate } from "react-router"
import { useMutation, useQuery } from "@tanstack/react-query"

import { api } from "../../lib/api-client"
import { useAuthStore } from "../../stores/auth.store"

interface LoginCredentials {
  username: string
  password: string
}

export const useLogin = () => {
  const navigate = useNavigate()
  const setAuth = useAuthStore((state) => state.setAuth)

  return useMutation({
    mutationFn: async (credentials: LoginCredentials) => {
      const response = await api.post("/auth/login", credentials)
      return response.data
    },
    onSuccess: (data) => {
      setAuth({
        user: data.user,
        token: data.access_token,
        session: data.session,
      })
      navigate("/sale-registration")
    },
  })
}

export const useLogout = () => {
  const navigate = useNavigate()
  const { session, user, logout: clearAuth } = useAuthStore()

  return useMutation({
    mutationFn: async () => {
      if (!session) return
      await api.post("/auth/logout", { sessionId: session.id })
    },
    onSuccess: () => {
      clearAuth()
      navigate("/auth")
    },
    onError: () => {
      // Force logout on error
      clearAuth()
      navigate("/auth")
    },
  })
}

export const useProfile = () => {
  const { setAuth, token } = useAuthStore()

  return useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const response = await api.get("/auth/me")
      return response.data
    },
    enabled: !!token,
    retry: false,
  })
}

export const useCheckSetup = () => {
  return useQuery({
    queryKey: ["setup-required"],
    queryFn: async () => {
      const response = await api.get("/auth/setup-required")
      return response.data as { setupRequired: boolean }
    },
    retry: false,
  })
}

export const useSetup = () => {
  const setAuth = useAuthStore((state) => state.setAuth)

  return useMutation({
    mutationFn: async (data: any) => {
      const response = await api.post("/auth/setup", data)
      return response.data
    },
  })
}
