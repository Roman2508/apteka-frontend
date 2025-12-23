import type { UserType } from "./user.types"
import type { WarehouseType } from "./warehouse.types"
import type { ProductBatchType } from "./product-batch.types"

export type WriteOffType = {
  id: number

  warehouse: WarehouseType
  warehouseId: number

  batch: ProductBatchType
  batchId: number

  user: UserType
  userId: number

  quantity: number
  reason: string
  write_off_date: string

  createdAt: string
}
