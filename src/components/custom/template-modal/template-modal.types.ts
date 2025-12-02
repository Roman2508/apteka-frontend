// --- Types ---

export type ModalItemType = "input" | "text" | "custom" | "table" | "tabs"

export interface ModalItem {
  type: ModalItemType
  content: React.ReactNode
  label?: string
  span?: number // grid column span (default: 1)
  className?: string
}

export interface ModalRow {
  type: "row"
  items: ModalItem[]
  className?: string // custom styling for the row container
  cols?: number // number of columns in this row (default: based on items or 1)
}

export interface ModalSection {
  type: "section"
  title?: string
  rows: ModalRow[]
  className?: string
}

export type ModalContentItem = ModalRow | ModalSection

export type TemplateModalFooter = {
  cancelText?: string
  confirmText?: string
  onConfirm?: () => void
  onCancel?: () => void
  customActions?: React.ReactNode
  hideCancel?: boolean
  hideConfirm?: boolean
}
