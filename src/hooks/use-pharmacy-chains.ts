import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { api } from "../lib/api-client"

export interface PharmacyChain {
  id: number
  name: string
  edrpou_code?: string
  createdAt: string
  pharmacyCount?: number
  userCount?: number
  pharmacies?: {
    id: number
    number: string
    address: string
    owner: {
      id: number
      username: string
      full_name?: string
      role: string
    }
  }[]
}

export interface CreatePharmacyChainDto {
  name: string
  edrpou_code?: string
}

// Fetch all pharmacy chains
export const usePharmacyChains = () => {
  return useQuery({
    queryKey: ["pharmacy-chains"],
    queryFn: async () => {
      const response = await api.get<PharmacyChain[]>("/pharmacy-chains")
      return response.data
    },
  })
}

// Fetch single pharmacy chain
export const usePharmacyChain = (id: number | string) => {
  return useQuery({
    queryKey: ["pharmacy-chains", id],
    queryFn: async () => {
      const response = await api.get<PharmacyChain>(`/pharmacy-chains/${id}`)
      return response.data
    },
    enabled: !!id,
  })
}

// Create pharmacy chain
export const useCreatePharmacyChain = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: CreatePharmacyChainDto) => {
      const response = await api.post<PharmacyChain>("/pharmacy-chains", data)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pharmacy-chains"] })
    },
  })
}

// Update pharmacy chain
export const useUpdatePharmacyChain = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<CreatePharmacyChainDto> }) => {
      const response = await api.patch<PharmacyChain>(`/pharmacy-chains/${id}`, data)
      return response.data
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["pharmacy-chains"] })
      queryClient.invalidateQueries({ queryKey: ["pharmacy-chains", variables.id] })
    },
  })
}

// Delete pharmacy chain
export const useDeletePharmacyChain = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/pharmacy-chains/${id}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pharmacy-chains"] })
    },
  })
}
