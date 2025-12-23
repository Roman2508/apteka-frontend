import type { SaleType } from "./sale.types"
import type { User } from "@/hooks/api/use-users"
import type { DocumentType } from "./document.types"
import type { WarehouseType } from "./warehouse.types"
import type { UserSessionType, UserType } from "./user.types"

export type PharmacyChainType = {
  id: number
  name: string
  edrpou_code: string
  pharmacies: PharmacyType[]
  createdAt: string
}

export type PharmacyType = {
  id: number
  number: string
  address: string

  chain: PharmacyChainType
  chainId: number

  owner: User
  ownerId: number

  staff: PharmacyStaffType[]
  warehouses: WarehouseType[]
  documents: DocumentType[]
  sales: SaleType[]
  sessions: UserSessionType[]

  createdAt: string
  updatedAt: string
}

export type PharmacyStaffType = {
  id: number
  pharmacy: PharmacyType
  pharmacyId: number
  user: UserType
  userId: number
  role_in_pharmacy: string
  createdAt: string
  updatedAt: string
}
