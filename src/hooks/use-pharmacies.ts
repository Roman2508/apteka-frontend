import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { api } from "../lib/api-client"

export interface Pharmacy {
  id: number
  number: string
  address: string
  chain: {
    id: number
    name: string
  }
  owner: {
    id: number
    username: string
    full_name?: string
    role: string
  }
}

export interface CreatePharmacyDto {
  number: string
  address: string
  chainId: number
  ownerId: number
}

// Fetch all pharmacies
export const usePharmacies = () => {
  return useQuery({
    queryKey: ["pharmacy"],
    queryFn: async () => {
      const response = await api.get<Pharmacy[]>("/pharmacy")
      return response.data
    },
  })
}

// Fetch single pharmacy
export const usePharmacy = (id: number | string) => {
  return useQuery({
    queryKey: ["pharmacy", id],
    queryFn: async () => {
      const response = await api.get<Pharmacy>(`/pharmacy/${id}`)
      return response.data
    },
    enabled: !!id,
  })
}

// Create pharmacy
export const useCreatePharmacy = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: CreatePharmacyDto) => {
      const response = await api.post<Pharmacy>("/pharmacy", data)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pharmacy"] })
    },
  })
}

// Update pharmacy
export const useUpdatePharmacy = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<CreatePharmacyDto> }) => {
      const response = await api.patch<Pharmacy>(`/pharmacy/${id}`, data)
      return response.data
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["pharmacy"] })
      queryClient.invalidateQueries({ queryKey: ["pharmacy", variables.id] })
    },
  })
}

// Delete pharmacy
export const useDeletePharmacy = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/pharmacy/${id}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pharmacy"] })
    },
  })
}
