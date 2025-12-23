import type { DocumentItemType } from "./document.types"

export type IncomingDiscrepancyType = {
  id: number
  documentItemId: number
  documentItem: DocumentItemType

  documentId: number
  document: DocumentType

  reason: DiscrepancyReasonType
  quantity: number
  comment: string
  photo_url: string
  createdAt: string
}

export type DiscrepancyReasonType =
  | "expired"
  | "damaged"
  | "wrong_batch"
  | "wrong_product"
  | "quantity_mismatch"
  | "no_series"
  | "other"
