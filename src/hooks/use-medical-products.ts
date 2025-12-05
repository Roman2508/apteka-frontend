import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { api } from "../lib/api-client"

export interface MedicalProduct {
  id: number
  name: string
  brand_name?: string
  form: string
  dosage_value?: number
  dosage_unit: string
  barcode?: string
  inn?: string
  atc_code?: string
  registration_number?: string
  in_national_list: boolean
  in_reimbursed_program: boolean
  subpackages_per_package?: number
  subpackage_type?: string
  shelf_life_value?: number
  shelf_life_unit?: string
  retail_price: number
  vat_rate: number
  manufacturerId?: number
  manufacturer?: { id: number; name: string }
  photos: { id: number; filePath: string; order: number }[]
}

export interface CreateMedicalProductDto {
  name: string
  brand_name?: string
  form: string
  dosage_value?: number
  dosage_unit?: string
  barcode?: string
  inn?: string
  atc_code?: string
  registration_number?: string
  in_national_list?: boolean
  in_reimbursed_program?: boolean
  subpackages_per_package?: number
  subpackage_type?: string
  shelf_life_value?: number
  shelf_life_unit?: string
  retail_price: number
  vat_rate?: number
  manufacturerId?: number
}

// Fetch all products
export const useProducts = () => {
  return useQuery({
    queryKey: ["medical-products"],
    queryFn: async () => {
      const response = await api.get<MedicalProduct[]>("/medical-products")
      return response.data
    },
  })
}

// Fetch single product
export const useProduct = (id: number | string) => {
  return useQuery({
    queryKey: ["medical-products", id],
    queryFn: async () => {
      const response = await api.get<MedicalProduct>(`/medical-products/${id}`)
      return response.data
    },
    enabled: !!id && id !== "create",
  })
}

// Create product
export const useCreateProduct = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: CreateMedicalProductDto) => {
      const response = await api.post<MedicalProduct>("/medical-products", data)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["medical-products"] })
    },
  })
}

// Update product
export const useUpdateProduct = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<CreateMedicalProductDto> }) => {
      const response = await api.patch<MedicalProduct>(`/medical-products/${id}`, data)
      return response.data
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["medical-products"] })
      queryClient.invalidateQueries({ queryKey: ["medical-products", variables.id] })
    },
  })
}

// Delete product
export const useDeleteProduct = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/medical-products/${id}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["medical-products"] })
    },
  })
}

// Upload photos
export const useUploadPhotos = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, files }: { id: number; files: File[] }) => {
      const formData = new FormData()
      files.forEach((file) => formData.append("photos", file))
      const response = await api.post(`/medical-products/${id}/photos`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      return response.data
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["medical-products", variables.id] })
    },
  })
}

// Delete photo
export const useDeletePhoto = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ productId, photoId }: { productId: number; photoId: number }) => {
      await api.delete(`/medical-products/${productId}/photos/${photoId}`)
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["medical-products", variables.productId] })
    },
  })
}

// Import from Excel
export const useImportExcel = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData()
      formData.append("file", file)
      const response = await api.post("/medical-products/import-excel", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      return response.data as { success: number; failed: number; errors: string[] }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["medical-products"] })
    },
  })
}
