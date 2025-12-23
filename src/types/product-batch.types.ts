import type { SaleItemType } from "./sale.types"
import type { WriteOffType } from "./write-off.types"
import type { InventoryType } from "./inventory.types"
import type { DocumentItemType } from "./document.types"
import type { CounterpartyType } from "./counterparty.types"
import type { MedicalProductType } from "./medical-product.types"

export type ProductBatchType = {
  id: number
  product: MedicalProductType
  productId: number
  supplier: CounterpartyType
  supplierId: number
  batch_number: string
  manufacture_date: string
  expiry_date: string
  purchase_price: number
  inventory: InventoryType[]
  documentItems: DocumentItemType[]
  saleItems: SaleItemType[]
  writeOffs: WriteOffType[]
  createdAt: string
}
