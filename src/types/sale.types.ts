import type { UserType } from "./user.types"
import type { PharmacyType } from "./pharmacy.types"
import type { CounterpartyType } from "./counterparty.types"
import type { ProductBatchType } from "./product-batch.types"

export type SaleType = {
  id: number
  document_number: string
  sale_date: string

  pharmacy: PharmacyType
  pharmacyId: number

  user: UserType
  userId: number

  customer: CounterpartyType
  customerId: number

  total_amount: number
  payment_method: string

  items: SaleItemType[]

  createdAt: string
}

export type SaleItemType = {
  id: number
  sale: SaleType
  saleId: number

  batch: ProductBatchType
  batchId: number

  quantity: number
  price: number
  discount: number
}
