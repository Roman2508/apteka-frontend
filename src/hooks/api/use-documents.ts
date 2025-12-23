import { useQuery } from "@tanstack/react-query"

import { api } from "@/lib/api-client"

interface ProfileFilters {
  type?: string | null
  status?: string | null
  hasDiscrepancy?: boolean | null
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
