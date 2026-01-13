import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

export const useInventory = (warehouseId: string) => {
  return useQuery({
    queryKey: ["inventory", { warehouseId }],
    queryFn: async () => {
      const response = await api.get(`/inventory/${warehouseId}`)
      return response.data
    },
    enabled: !!warehouseId,
  })
}
