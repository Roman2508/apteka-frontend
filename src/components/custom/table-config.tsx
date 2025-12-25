import { Checkbox } from "@/components/ui/checkbox"
import { ChevronRight, Folder } from "lucide-react"
import { cn } from "@/lib/utils"
import { type ColumnDef } from "@tanstack/react-table"

/* Видалити !!! */
/* Видалити !!! */
/* Видалити !!! */

export type Counterparty = {
  id: string
  code: string
  name: string
  address: string
  edrpou: string
  type: string
  active: boolean
  isGroup?: boolean
}

export const data: Counterparty[] = [
  {
    id: "1",
    code: "00000001",
    name: 'ТОВ "БаДМ"',
    address: "м. Дніпро, вул. Каштанова, 5",
    edrpou: "12345678",
    type: "Постачальник",
    active: true,
  },
  {
    id: "2",
    code: "00000002",
    name: 'ТОВ "БаДМ"',
    address: "м. Дніпро, вул. Каштанова, 5",
    edrpou: "12345678",
    type: "Постачальник",
    active: true,
  },
  {
    id: "3",
    code: "00000003",
    name: 'ТОВ "БаДМ"',
    address: "м. Дніпро, вул. Каштанова, 5",
    edrpou: "12345678",
    type: "Постачальник",
    active: true,
  },
  {
    id: "4",
    code: "00000004",
    name: 'ТОВ "БаДМ"',
    address: "м. Дніпро, вул. Каштанова, 5",
    edrpou: "12345678",
    type: "Постачальник",
    active: true,
  },
  {
    id: "5",
    code: "00000005",
    name: 'ТОВ "БаДМ"',
    address: "м. Дніпро, вул. Каштанова, 5",
    edrpou: "12345678",
    type: "Постачальник",
    active: true,
  },
  {
    id: "6",
    code: "00000006",
    name: 'ТОВ "БаДМ"',
    address: "м. Дніпро, вул. Каштанова, 5",
    edrpou: "12345678",
    type: "Постачальник",
    active: true,
  },

  {
    id: "7",
    code: "00000001",
    name: 'ТОВ "БаДМ"',
    address: "м. Дніпро, вул. Каштанова, 5",
    edrpou: "12345678",
    type: "Постачальник",
    active: true,
  },
  {
    id: "8",
    code: "00000002",
    name: 'ТОВ "БаДМ"',
    address: "м. Дніпро, вул. Каштанова, 5",
    edrpou: "12345678",
    type: "Постачальник",
    active: true,
  },
  {
    id: "9",
    code: "00000003",
    name: 'ТОВ "БаДМ"',
    address: "м. Дніпро, вул. Каштанова, 5",
    edrpou: "12345678",
    type: "Постачальник",
    active: true,
  },
  {
    id: "10",
    code: "00000004",
    name: 'ТОВ "БаДМ"',
    address: "м. Дніпро, вул. Каштанова, 5",
    edrpou: "12345678",
    type: "Постачальник",
    active: true,
  },
  {
    id: "11",
    code: "00000005",
    name: 'ТОВ "БаДМ"',
    address: "м. Дніпро, вул. Каштанова, 5",
    edrpou: "12345678",
    type: "Постачальник",
    active: true,
  },
  {
    id: "12",
    code: "00000006",
    name: 'ТОВ "БаДМ"',
    address: "м. Дніпро, вул. Каштанова, 5",
    edrpou: "12345678",
    type: "Постачальник",
    active: true,
  },

  {
    id: "13",
    code: "00000001",
    name: 'ТОВ "БаДМ"',
    address: "м. Дніпро, вул. Каштанова, 5",
    edrpou: "12345678",
    type: "Постачальник",
    active: true,
  },
  {
    id: "14",
    code: "00000002",
    name: 'ТОВ "БаДМ"',
    address: "м. Дніпро, вул. Каштанова, 5",
    edrpou: "12345678",
    type: "Постачальник",
    active: true,
  },
  {
    id: "15",
    code: "00000002",
    name: 'ТОВ "БаДМ"',
    address: "м. Дніпро, вул. Каштанова, 5",
    edrpou: "12345678",
    type: "Постачальник",
    active: true,
  },
  {
    id: "16",
    code: "00000002",
    name: 'ТОВ "БаДМ"',
    address: "м. Дніпро, вул. Каштанова, 5",
    edrpou: "12345678",
    type: "Постачальник",
    active: true,
  },
  {
    id: "17",
    code: "00000002",
    name: 'ТОВ "БаДМ"',
    address: "м. Дніпро, вул. Каштанова, 5",
    edrpou: "12345678",
    type: "Постачальник",
    active: true,
  },
  {
    id: "18",
    code: "00000002",
    name: 'ТОВ "БаДМ"',
    address: "м. Дніпро, вул. Каштанова, 5",
    edrpou: "12345678",
    type: "Постачальник",
    active: true,
  },
  {
    id: "19",
    code: "00000002",
    name: 'ТОВ "БаДМ"',
    address: "м. Дніпро, вул. Каштанова, 5",
    edrpou: "12345678",
    type: "Постачальник",
    active: true,
  },
  {
    id: "20",
    code: "00000002",
    name: 'ТОВ "БаДМ"',
    address: "м. Дніпро, вул. Каштанова, 5",
    edrpou: "12345678",
    type: "Постачальник",
    active: true,
  },
  {
    id: "21",
    code: "00000002",
    name: 'ТОВ "БаДМ"',
    address: "м. Дніпро, вул. Каштанова, 5",
    edrpou: "12345678",
    type: "Постачальник",
    active: true,
  },
  {
    id: "22",
    code: "00000002",
    name: 'ТОВ "БаДМ"',
    address: "м. Дніпро, вул. Каштанова, 5",
    edrpou: "12345678",
    type: "Постачальник",
    active: true,
  },
  {
    id: "23",
    code: "00000002",
    name: 'ТОВ "БаДМ"',
    address: "м. Дніпро, вул. Каштанова, 5",
    edrpou: "12345678",
    type: "Постачальник",
    active: true,
  },
  {
    id: "24",
    code: "00000002",
    name: 'ТОВ "БаДМ"',
    address: "м. Дніпро, вул. Каштанова, 5",
    edrpou: "12345678",
    type: "Постачальник",
    active: true,
  },
  {
    id: "25",
    code: "00000002",
    name: 'ТОВ "БаДМ"',
    address: "м. Дніпро, вул. Каштанова, 5",
    edrpou: "12345678",
    type: "Постачальник",
    active: true,
  },
  {
    id: "26",
    code: "00000002",
    name: 'ТОВ "БаДМ"',
    address: "м. Дніпро, вул. Каштанова, 5",
    edrpou: "12345678",
    type: "Постачальник",
    active: true,
  },
  {
    id: "27",
    code: "00000002",
    name: 'ТОВ "БаДМ"',
    address: "м. Дніпро, вул. Каштанова, 5",
    edrpou: "12345678",
    type: "Постачальник",
    active: true,
  },
  {
    id: "28",
    code: "00000002",
    name: 'ТОВ "БаДМ"',
    address: "м. Дніпро, вул. Каштанова, 5",
    edrpou: "12345678",
    type: "Постачальник",
    active: true,
  },
]

export const columns: ColumnDef<Counterparty>[] = [
  //   {
  //     id: "select",
  //     header: () => <div className="w-4" />,
  //     cell: () => <Checkbox className="translate-y-[1px]" />,
  //     enableSorting: false, // Вимкнути сортування для чекбокса
  //   },
  {
    accessorKey: "code",
    header: "Код",
    cell: ({ row }: any) => {
      const isGroup = row.original.isGroup
      return (
        <div className="flex items-center gap-1">
          {isGroup && <Folder className="w-4 h-4 text-neutral-900" />}
          {isGroup && <ChevronRight className="w-3 h-3" />}
          <span className={cn(isGroup && "font-medium")}>{row.original.code}</span>
        </div>
      )
    },
  },
  {
    accessorKey: "name",
    header: "Найменування",
  },
  {
    accessorKey: "address",
    header: "Адреса",
  },
  {
    accessorKey: "edrpou",
    header: "ЄДРПОУ",
  },
  {
    accessorKey: "type",
    header: "Тип контрагента",
  },
  {
    accessorKey: "active",
    header: "Активний",
    cell: ({ row }: any) => (row.original.active ? "Так" : ""),
  },
]
