import type { DocumentItemType } from "./document.types"
import type { CounterpartyType } from "./counterparty.types"
import type { ProductBatchType } from "./product-batch.types"

export type MedicalProductType = {
  id: number
  name: string
  brand_name: string
  form: MedicalProductForm
  dosage_value: number
  dosage_unit: string
  barcode: string
  inn: string
  atc_code: string
  registration_number: string
  in_national_list: boolean
  in_reimbursed_program: boolean
  subpackages_per_package: number
  subpackage_type: SubpackageType
  shelf_life_value: number
  shelf_life_unit: ShelfLifeUnit
  retail_price: number
  vat_rate: number
  manufacturer: CounterpartyType
  manufacturerId: number
  batches: ProductBatchType[]
  photos: MedicalProductPhotoType[]
  documentItems: DocumentItemType[]
  createdAt: string
  updatedAt: string
}

export type MedicalProductPhotoType = {
  id: number
  product: MedicalProductType
  productId: number
  filePath: string
  order: number // next item order number
  createdAt: string
}

export type MedicalProductForm =
  | "tablet"
  | "capsule"
  | "syrup"
  | "drops"
  | "ointment"
  | "spray"
  | "ampoule"
  | "suspension"
  | "powder"
  | "gel"
  | "cream"
  | "solution"
  | "other"

export type SubpackageType = "blister" | "ampoule" | "sachet" | "bottle" | "vial" | "tube" | "strip" | "piece"

export type ShelfLifeUnit = "days" | "months" | "years"
