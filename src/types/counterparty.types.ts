import type { SaleType } from "./sale.types"
import type { DocumentType } from "./document.types"
import type { ProductBatchType } from "./product-batch.types"
import type { MedicalProductType } from "./medical-product.types"

export type CounterpartyType = {
  id: number
  name: string
  type: CounterpartyTypeType
  edrpou_code: string
  address: string
  iban: string
  phone: string
  contact_person: string
  note: string
  manufacturedProducts?: MedicalProductType[]
  suppliedBatches?: ProductBatchType[]
  documentsAsCounterparty?: DocumentType[]
  salesAsCustomer?: SaleType[]
  createdAt: string
  updatedAt: string
}

export type CounterpartyTypeType = "supplier" | "manufacturer" | "insurer" | "individual"
