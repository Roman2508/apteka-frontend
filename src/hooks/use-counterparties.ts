import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { api as apiClient } from "../lib/api-client"

export type CounterpartyType = "supplier" | "manufacturer" | "insurer" | "individual"

export interface Counterparty {
  id: number
  name: string
  type: CounterpartyType
  edrpou_code?: string
  address?: string
  iban?: string
  phone?: string
  contact_person?: string
  note?: string
  createdAt: string
  updatedAt: string
}

export type CreateCounterpartyDto = Omit<Counterparty, "id" | "createdAt" | "updatedAt">
export type UpdateCounterpartyDto = Partial<CreateCounterpartyDto>

export const useCounterparties = () => {
  return useQuery({
    queryKey: ["counterparties"],
    queryFn: async () => {
      const response = await apiClient.get<Counterparty[]>("/counterparties")
      return response.data
    },
  })
}

export const useCounterparty = (id: number) => {
  return useQuery({
    queryKey: ["counterparties", id],
    queryFn: async () => {
      const response = await apiClient.get<Counterparty>(`/counterparties/${id}`)
      return response.data
    },
    enabled: !!id,
  })
}

export const useCreateCounterparty = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data: CreateCounterpartyDto) => {
      const response = await apiClient.post<Counterparty>("/counterparties", data)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["counterparties"] })
    },
  })
}

export const useUpdateCounterparty = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: UpdateCounterpartyDto }) => {
      const response = await apiClient.patch<Counterparty>(`/counterparties/${id}`, data)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["counterparties"] })
    },
  })
}

export const useDeleteCounterparty = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: number) => {
      await apiClient.delete(`/counterparties/${id}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["counterparties"] })
    },
  })
}
