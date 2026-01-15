import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"

import { api } from "../../lib/api-client"

export const useInventoriesByWarehouseId = (warehouseId: string) => {
  return useQuery({
    queryKey: ["inventory", { warehouseId }],
    queryFn: async () => {
      const response = await api.get(`/inventory/warehouse/${warehouseId}`)
      return response.data
    },
    enabled: !!warehouseId,
  })
}
