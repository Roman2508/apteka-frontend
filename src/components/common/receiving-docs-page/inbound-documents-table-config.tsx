import { type ColumnDef } from "@tanstack/react-table"

import type { DocumentType } from "@/types/document.types"

export const inboundDocumentsTableColumns: ColumnDef<DocumentType>[] = [
  {
    accessorKey: "document_date",
    header: "Дата",
  },
  {
    accessorKey: "document_number",
    header: "Номер",
  },
  {
    accessorKey: "status",
    header: "Статус",
  },
  {
    accessorKey: "actual_total",
    header: "Сума",
  },
  {
    accessorKey: "counterparty.name",
    header: "Контрагент",
  },
  {
    accessorKey: "items.length",
    header: "К-ть найменувань",
  },
]
