import type { WarehouseType } from "./warehouse.types"
import type { ProductBatchType } from "./product-batch.types"

export type InventoryType = {
  id: number

  warehouse: WarehouseType
  warehouseId: number

  batch: ProductBatchType
  batchId: number

  quantity: number
  reserved_quantity: number
  updatedAt: string
}
