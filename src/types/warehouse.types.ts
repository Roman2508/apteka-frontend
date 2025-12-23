import type { DocumentType } from "./document.types"
import type { PharmacyType } from "./pharmacy.types"
import type { WriteOffType } from "./write-off.types"
import type { InventoryType } from "./inventory.types"

export type WarehouseType = {
  id: number
  pharmacy: PharmacyType
  pharmacyId: number
  name: string
  inventory: InventoryType[]
  documents: DocumentType[]
  writeOffs: WriteOffType[]
  createdAt: string
}
