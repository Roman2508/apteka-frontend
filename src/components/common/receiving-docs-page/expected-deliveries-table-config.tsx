import { formatDate } from "@/helpers/format-date"
import { type ColumnDef } from "@tanstack/react-table"

export type ExpectedDelivery = {
  id: string
  createdAt: string
  document_number: string
  counterparty: { id: number; name: string }
  items: any[]
}

// export const data: ExpectedDelivery[] = [
//   {
//     id: "1",
//     date: "01.01.2022",
//     number: "11-U146299160-1",
//     counterparty: { id: 1, name: "БаДМ ТОВ" },
//     count: 10,
//     sum: "1000",
//   },
//   {
//     id: "2",
//     date: "01.01.2022",
//     number: "11-U146299160-2",
//     counterparty: { id: 2, name: "Фарма ТОВ" },
//     count: 20,
//     sum: "2000",
//   },
//   {
//     id: "3",
//     date: "01.01.2022",
//     number: "11-U146299160-3",
//     counterparty: { id: 3, name: "БаДМ ТОВ" },
//     count: 30,
//     sum: "3000",
//   },
//   {
//     id: "4",
//     date: "01.01.2022",
//     number: "11-U146299160-4",
//     counterparty: { id: 4, name: "БаДМ ТОВ" },
//     count: 40,
//     sum: "4000",
//   },
// ]

export const expectedDeliveriesTableColumns: ColumnDef<ExpectedDelivery>[] = [
  {
    accessorKey: "document",
    header: "Документ надходження",
    cell: ({ row }) => {
      const doc = row.original
      console.log(doc)
      return `Надходження товарів послуг №${doc.document_number} від ${formatDate(doc.createdAt)}`
    },
  },
  {
    accessorKey: "document_number",
    header: "Вхідний номер",
  },
  {
    accessorKey: "date",
    header: "Вхідна дата",
    cell: ({ row }) => {
      const doc = row.original
      return formatDate(doc.createdAt, "long")
    },
  },
  {
    accessorKey: "counterparty",
    header: "Контрагент",
    cell: ({ row }) => {
      const document = row.original
      return document.counterparty.name
    },
  },
  {
    accessorKey: "count",
    header: "Кількість",
    cell: ({ row }) => {
      const doc = row.original
      return doc.items ? doc.items.length : 0
    },
  },
  {
    accessorKey: "sum",
    header: "Сума",
    cell: ({ row }) => {
      const doc = row.original
      return doc.items?.length ? doc.items.reduce((acc, item) => acc + Number(item.price), 0).toFixed(2) : 0
    },
  },
]
