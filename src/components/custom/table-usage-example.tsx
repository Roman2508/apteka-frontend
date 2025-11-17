import { useState } from 'react'
import { Checkbox } from '../ui/checkbox'
import { ChevronRight, Folder } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

import { cn } from '@/lib/utils'
import { PageToolbar } from './page-toolbar'
import { TemplateTable } from './template-table'

type Counterparty = {
  id: string
  code: string
  name: string
  address: string
  edrpou: string
  type: string
  active: boolean
  isGroup?: boolean
}

const data: Counterparty[] = [
  {
    id: '1',
    code: '00000001',
    name: 'ТОВ "БаДМ"',
    address: 'м. Дніпро, вул. Каштанова, 5',
    edrpou: '12345678',
    type: 'Постачальник',
    active: true,
  },
  {
    id: '2',
    code: '00000002',
    name: 'ТОВ "БаДМ"',
    address: 'м. Дніпро, вул. Каштанова, 5',
    edrpou: '12345678',
    type: 'Постачальник',
    active: true,
  },
  {
    id: '3',
    code: '00000003',
    name: 'ТОВ "БаДМ"',
    address: 'м. Дніпро, вул. Каштанова, 5',
    edrpou: '12345678',
    type: 'Постачальник',
    active: true,
  },
  {
    id: '4',
    code: '00000004',
    name: 'ТОВ "БаДМ"',
    address: 'м. Дніпро, вул. Каштанова, 5',
    edrpou: '12345678',
    type: 'Постачальник',
    active: true,
  },
  {
    id: '5',
    code: '00000005',
    name: 'ТОВ "БаДМ"',
    address: 'м. Дніпро, вул. Каштанова, 5',
    edrpou: '12345678',
    type: 'Постачальник',
    active: true,
  },
  {
    id: '6',
    code: '00000006',
    name: 'ТОВ "БаДМ"',
    address: 'м. Дніпро, вул. Каштанова, 5',
    edrpou: '12345678',
    type: 'Постачальник',
    active: true,
  },
  {
    id: '2',
    code: '',
    name: 'Група: Постачальники',
    address: '',
    edrpou: '',
    type: '',
    active: false,
    isGroup: true,
  },
]

const columns = [
  // {
  //   id: "select",
  //   header: () => <div className="w-4" />,
  //   cell: () => <Checkbox className="translate-y-[1px]" />,
  //   enableSorting: false, // Вимкнути сортування для чекбокса
  // },
  {
    accessorKey: 'code',
    header: 'Код',
    cell: ({ row }: any) => {
      const isGroup = row.original.isGroup
      return (
        <div className="flex items-center gap-1">
          {isGroup && <Folder className="w-4 h-4 text-neutral-900" />}
          {isGroup && <ChevronRight className="w-3 h-3" />}
          <span className={cn(isGroup && 'font-medium')}>{row.original.code}</span>
        </div>
      )
    },
  },
  {
    accessorKey: 'name',
    header: 'Найменування',
  },
  {
    accessorKey: 'address',
    header: 'Адреса',
  },
  {
    accessorKey: 'edrpou',
    header: 'ЄДРПОУ',
  },
  {
    accessorKey: 'type',
    header: 'Тип контрагента',
  },
  {
    accessorKey: 'active',
    header: 'Активний',
    cell: ({ row }: any) => (row.original.active ? 'Так' : ''),
  },
]

export default function TableUsageExample() {
  const [selectedRow, setSelectedRow] = useState<Counterparty | null>(null)
  const [globalFilter, setGlobalFilter] = useState('')

  return (
    <div className="h-full">
      <PageToolbar globalFilter={globalFilter} setGlobalFilter={setGlobalFilter} />

      <Tabs defaultValue="account" className="h-[calc(100%-90px)]">
        <TabsList className="relative top-[1px]">
          <TabsTrigger value="tab1">Документи відвантаження</TabsTrigger>
          <TabsTrigger value="tab2">Переміщення товарів</TabsTrigger>
          <TabsTrigger value="tab3">Реалізація товарів</TabsTrigger>
          <TabsTrigger value="tab4">Повернення товарів</TabsTrigger>
        </TabsList>

        <TabsContent value="tab1">
          <TemplateTable
            columns={columns}
            data={data}
            selectedRow={selectedRow}
            onRowSelect={setSelectedRow}
            pageSizeOptions={[20, 50, 100]}
            defaultPageSize={20}
            globalFilter={globalFilter}
            setGlobalFilter={setGlobalFilter}
          />
        </TabsContent>

        <TabsContent value="tab2">
          <TemplateTable
            columns={columns}
            data={data}
            selectedRow={selectedRow}
            onRowSelect={setSelectedRow}
            pageSizeOptions={[20, 50, 100]}
            defaultPageSize={20}
            globalFilter={globalFilter}
            setGlobalFilter={setGlobalFilter}
          />
        </TabsContent>

        <TabsContent value="tab3">
          <TemplateTable
            columns={columns}
            data={data}
            selectedRow={selectedRow}
            onRowSelect={setSelectedRow}
            pageSizeOptions={[20, 50, 100]}
            defaultPageSize={20}
            globalFilter={globalFilter}
            setGlobalFilter={setGlobalFilter}
          />
        </TabsContent>

        <TabsContent value="tab4">
          <TemplateTable
            columns={columns}
            data={data}
            selectedRow={selectedRow}
            onRowSelect={setSelectedRow}
            pageSizeOptions={[20, 50, 100]}
            defaultPageSize={20}
            globalFilter={globalFilter}
            setGlobalFilter={setGlobalFilter}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}
