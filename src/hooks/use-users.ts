import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { api } from "../lib/api-client"

export interface User {
  id: number
  username: string
  full_name?: string
  email?: string
  role: "admin" | "director" | "pharmacist" | "senior_pharmacist"
  is_active: boolean
  createdAt: string
  updatedAt: string
  ownedPharmacy?: {
    id: number
    number: string
    address: string
    chain?: {
      id: number
      name: string
    }
  }
}

export interface CreateUserDto {
  username: string
  full_name?: string
  email?: string
  role: "admin" | "director" | "pharmacist" | "senior_pharmacist"
  password: string
  is_active?: boolean
  pharmacyChainId?: number
  pharmacyNumber?: string
  pharmacyAddress?: string
}

export interface UpdateUserDto {
  username?: string
  full_name?: string
  email?: string
  role?: "admin" | "director" | "pharmacist" | "senior_pharmacist"
  password?: string
  is_active?: boolean
  pharmacyChainId?: number
  pharmacyNumber?: string
  pharmacyAddress?: string
}

// Fetch all users with optional chain filter
export const useUsers = (chainId?: number) => {
  return useQuery({
    queryKey: ["users", chainId],
    queryFn: async () => {
      const params = chainId ? `?chainId=${chainId}` : ""
      const response = await api.get<User[]>(`/users${params}`)
      return response.data
    },
  })
}

// Fetch single user
export const useUser = (id: number | string) => {
  return useQuery({
    queryKey: ["users", id],
    queryFn: async () => {
      const response = await api.get<User>(`/users/${id}`)
      return response.data
    },
    enabled: !!id,
  })
}

// Create user
export const useCreateUser = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: CreateUserDto) => {
      const response = await api.post<User>("/users", data)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] })
      queryClient.invalidateQueries({ queryKey: ["pharmacy-chains"] })
    },
  })
}

// Update user
export const useUpdateUser = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: UpdateUserDto }) => {
      const response = await api.patch<User>(`/users/${id}`, data)
      return response.data
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["users"] })
      queryClient.invalidateQueries({ queryKey: ["users", variables.id] })
    },
  })
}

// Delete user
export const useDeleteUser = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/users/${id}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] })
      queryClient.invalidateQueries({ queryKey: ["pharmacy-chains"] })
    },
  })
}
