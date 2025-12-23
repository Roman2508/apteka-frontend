import type { UserType } from "./user.types"
import type { PharmacyType } from "./pharmacy.types"
import type { WarehouseType } from "./warehouse.types"
import type { CounterpartyType } from "./counterparty.types"
import type { ProductBatchType } from "./product-batch.types"
import type { MedicalProductType } from "./medical-product.types"
import type { IncomingDiscrepancyType } from "./incoming-discrepancy.types"

export type DocumentType = {
  id: number
  document_number: string
  external_number: string
  document_date: string
  type: DocumentTypeType
  status: DocumentStatusType

  counterparty: CounterpartyType
  counterpartyId: number

  pharmacy: PharmacyType
  pharmacyId: number

  warehouse: WarehouseType
  warehouseId: number

  user: UserType
  userId: number

  expected_total: number
  actual_total: number

  scanned_at: string
  completed_at: string

  items: DocumentItemType[]
  discrepancies: IncomingDiscrepancyType[]

  createdAt: string
}

export type DocumentItemType = {
  id: number
  document: DocumentType
  documentId: number

  medicalProduct: MedicalProductType
  medicalProductId: number

  barcode: string
  batch_number: string
  expiry_date: string
  quantity_expected: number
  price: number

  quantity_scanned: number
  quantity_accepted: number

  batch: ProductBatchType
  batchId: number

  is_discrepancy: boolean

  discrepancies?: IncomingDiscrepancyType[]
}

export type DocumentTypeType = "incoming" | "outgoing" | "internal"

export type DocumentStatusType = "draft" | "in_process" | "completed" | "partially" | "cancelled"
