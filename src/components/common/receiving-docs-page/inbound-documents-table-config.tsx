import { type ColumnDef } from "@tanstack/react-table"

export type InboundDocument = {
  id: string
  date: string
  number: string
  status: string
  sum: string
  type: string
  action: "Переміщення товарів" | "Надходження товарів"
}

export const data: InboundDocument[] = [
  {
    id: "1",
    date: "01.01.2022",
    number: "1123-003887",
    status: "Прийнятий",
    sum: "1000",
    type: "Прибутковий ордер на товари",
    action: "Переміщення товарів",
  },
  {
    id: "2",
    date: "01.01.2022",
    number: "1123-003888",
    status: "Прийнятий",
    sum: "1000",
    type: "Прибутковий ордер на товари",
    action: "Надходження товарів",
  },
  {
    id: "3",
    date: "01.01.2022",
    number: "1123-003889",
    status: "Прийнятий",
    sum: "1000",
    type: "Прибутковий ордер на товари",
    action: "Переміщення товарів",
  },
  {
    id: "4",
    date: "01.01.2022",
    number: "1123-003890",
    status: "Прийнятий",
    sum: "1000",
    type: "Прибутковий ордер на товари",
    action: "Переміщення товарів",
  },
  {
    id: "5",
    date: "01.01.2022",
    number: "1123-003891",
    status: "Прийнятий",
    sum: "1000",
    type: "Прибутковий ордер на товари",
    action: "Надходження товарів",
  },
  {
    id: "6",
    date: "01.01.2022",
    number: "1123-003892",
    status: "Прийнятий",
    sum: "1000",
    type: "Прибутковий ордер на товари",
    action: "Надходження товарів",
  },

  {
    id: "7",
    date: "01.01.2022",
    number: "1123-003893",
    status: "Прийнятий",
    sum: "1000",
    type: "Прибутковий ордер на товари",
    action: "Надходження товарів",
  },
  {
    id: "8",
    date: "01.01.2022",
    number: "1123-003894",
    status: "Прийнятий",
    sum: "1000",
    type: "Прибутковий ордер на товари",
    action: "Надходження товарів",
  },
]

export const inboundDocumentsTableColumns: ColumnDef<InboundDocument>[] = [
  {
    accessorKey: "date",
    header: "Дата",
  },
  {
    accessorKey: "number",
    header: "Номер",
  },
  {
    accessorKey: "status",
    header: "Статус",
  },
  {
    accessorKey: "sum",
    header: "Сума",
  },
  {
    accessorKey: "type",
    header: "Тип документа",
  },
  {
    accessorKey: "action",
    header: "Розпорядження",
  },
]
