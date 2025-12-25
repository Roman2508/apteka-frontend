import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"

import { api } from "@/lib/api-client"
import type { ProductBatchType } from "@/types/product-batch.types"

export type CreateProductBatchDto = {
  productId: string
  supplierId: string
  batch_number: string
  manufacture_date: string
  expiry_date: string
  purchase_price: number
}

export type UpdateProductBatchDto = { id: number } & CreateProductBatchDto

export const useProductBatches = () => {
  return useQuery({
    queryKey: ["product-batch"],
    queryFn: async () => {
      const response = await api.get<ProductBatchType[]>("/product-batch")
      return response.data
    },
  })
}

export const useCreateProductBatch = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: CreateProductBatchDto) => {
      const response = await api.post<ProductBatchType>("/product-batch", data)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["product-batch"] })
    },
  })
}

export const useUpdateProductBatch = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: UpdateProductBatchDto }) => {
      const response = await api.patch<ProductBatchType>(`/product-batch/${id}`, data)
      return response.data
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["product-batch"] })
      queryClient.invalidateQueries({ queryKey: ["product-batch", variables.id] })
    },
  })
}

// Delete user
export const useDeleteProductBatch = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/product-batch/${id}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["product-batch"] })
    },
  })
}
