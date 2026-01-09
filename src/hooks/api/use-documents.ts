import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import { api } from "@/lib/api-client"
import type { DocumentType } from "@/types/document.types"

interface ProfileFilters {
  type?: string | null
  status?: string | null
  hasDiscrepancy?: boolean | null
}

interface CreateDocumentItemDto {
  id: number
  count: number
  price: number
  expiry_date: string
  bartcode: string
  batch_number: string
  batchId: string
}

export interface CreateDocumentDto {
  code: string
  counterpartyId: number
  counterpartyName: string
  count: number
  totalPrice: number
  userId: number
  items: CreateDocumentItemDto[]
}

export const useDocuments = (filters?: ProfileFilters) => {
  const { type, status, hasDiscrepancy } = filters || {}
  return useQuery({
    queryKey: ["receiving-docs", { type, status, hasDiscrepancy }],
    queryFn: async () => {
      const cleanParams = {
        ...(type && { type }),
        ...(status && { status }),
        ...(hasDiscrepancy !== null && hasDiscrepancy !== undefined && { hasDiscrepancy }),
      }

      const response = await api.get("/documents", { params: cleanParams })
      return response.data
    },
    enabled: !!type || !!status || hasDiscrepancy !== null || hasDiscrepancy !== undefined,
  })
}

export const useFullDocument = (id: string, type: string) => {
  return useQuery({
    queryKey: ["receiving-docs", { type, id }],
    queryFn: async () => {
      const response = await api.get(`/documents/${id}/${type}`)
      return response.data
    },
    enabled: !!id || !!type,
  })
}

export const useCreateExpectedDeliveries = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data: CreateDocumentDto) => {
      const response = await api.post<DocumentType>("/documents", data)
      return response.data
    },
    onSuccess: () => {
      toast.success("Накладну збережено!")
      // revalidate не працює, можливо проблема в hasDiscrepancy
      queryClient.invalidateQueries({
        queryKey: ["receiving-docs", { type: "incoming", status: "in_progress" }],
      })
    },
    onError: (error: any) => toast.error(error.response?.data?.message || "Помилка"),
  })
}

export const useDeleteExpectedDeliveries = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: number) => {
      const response = await api.delete(`/documents/${id}`)
      return response.data
    },
    onSuccess: () => {
      toast.success("Накладну видалено!")
      // revalidate не працює, можливо проблема в hasDiscrepancy
      queryClient.invalidateQueries({
        queryKey: ["receiving-docs", { type: "incoming", status: "in_progress" }],
      })
    },
    onError: (error: any) => toast.error(error.response?.data?.message || "Помилка"),
  })
}
