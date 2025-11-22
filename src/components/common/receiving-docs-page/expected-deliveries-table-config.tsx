import { type ColumnDef } from "@tanstack/react-table"

export type ExpectedDelivery = {
  id: string
  date: string
  number: string
  counterparty: { id: number; name: string }
  count: number
  sum: string
}

export const data: ExpectedDelivery[] = [
  {
    id: "1",
    date: "01.01.2022",
    number: "11-U146299160-1",
    counterparty: { id: 1, name: "БаДМ ТОВ" },
    count: 10,
    sum: "1000",
  },
  {
    id: "2",
    date: "01.01.2022",
    number: "11-U146299160-2",
    counterparty: { id: 2, name: "Фарма ТОВ" },
    count: 20,
    sum: "2000",
  },
  {
    id: "3",
    date: "01.01.2022",
    number: "11-U146299160-3",
    counterparty: { id: 3, name: "БаДМ ТОВ" },
    count: 30,
    sum: "3000",
  },
  {
    id: "4",
    date: "01.01.2022",
    number: "11-U146299160-4",
    counterparty: { id: 4, name: "БаДМ ТОВ" },
    count: 40,
    sum: "4000",
  },
]

export const expectedDeliveriesTableColumns: ColumnDef<ExpectedDelivery>[] = [
  {
    accessorKey: "document",
    header: "Документ надходження",
    cell: ({ row }) => {
      const doc = row.original
      return `Надходження товарыв послуг ${doc.number} від ${doc.date}`
    },
  },
  {
    accessorKey: "number",
    header: "Вхідний номер",
  },
  {
    accessorKey: "date",
    header: "Вхідна дата",
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
  },
  {
    accessorKey: "sum",
    header: "Сума",
  },
]
