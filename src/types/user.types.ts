import type { SaleType } from "./sale.types"
import type { DocumentType } from "./document.types"
import type { WriteOffType } from "./write-off.types"
import type { PharmacyStaffType, PharmacyType } from "./pharmacy.types"

export type UserType = {
  id: number
  username: string
  full_name: string
  email: string
  role: UserRoleType
  is_active: boolean

  ownedPharmacy: PharmacyType
  staffAssignments: PharmacyStaffType[]
  sessions: UserSessionType[]
  documentsCreated: DocumentType[]
  sales: SaleType[]
  writeOffs: WriteOffType[]
}

export type UserSessionType = {
  id: number
  user: UserType
  userId: number
  pharmacy: PharmacyType
  pharmacyId: number
  loginAt: string
  logoutAt: string
  auto_closed: boolean
  ip_address: string
  user_agent: string
}

export type UserRoleType = "admin" | "director" | "pharmacist" | "senior_pharmacist"
