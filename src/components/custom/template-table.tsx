import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  useReactTable,
  type SortingState,
  type ColumnFiltersState,
} from '@tanstack/react-table'
import { Button } from '@/components/ui/button'
import { ChevronUp, ChevronDown, ArrowLeft, ArrowRight } from 'lucide-react'
import { Checkbox } from '@/components/ui/checkbox'
import { Folder, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useState, type Dispatch, type SetStateAction } from 'react'

interface TemplateTableProps<TData> {
  columns: ColumnDef<TData>[]
  data: TData[]
  selectedRow?: TData | null
  onRowSelect?: (row: TData) => void
  pageSizeOptions?: number[]
  defaultPageSize?: number
  searchPlaceholder?: string
  globalFilter?: string
  setGlobalFilter: Dispatch<SetStateAction<string>>
}

export function TemplateTable<TData>({
  columns,
  data,
  selectedRow,
  onRowSelect,
  pageSizeOptions = [10, 20, 50],
  defaultPageSize = 10,
  globalFilter,
  setGlobalFilter,
}: TemplateTableProps<TData>) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onGlobalFilterChange: setGlobalFilter,
    state: {
      sorting,
      columnFilters,
      globalFilter,
      pagination: {
        pageIndex: 0,
        pageSize: defaultPageSize,
      },
    },
    initialState: {
      pagination: {
        pageSize: defaultPageSize,
      },
    },
    globalFilterFn: 'includesString',
  })

  return (
    <div className="flex flex-col h-full text-sm rounded-sm overflow-hidden">
      <div className="flex-1 overflow-auto border border-neutral-800 bg-white max-h-[calc(100vh-200px)]">
        {/* === ТАБЛИЦЯ === */}
        <table className="w-full border-collapse text-[13px]">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="bg-neutral-300 border [&>*:not(:last-child)]:border-r-neutral-800 px-2 py-1 text-left font-medium"
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    {{
                      asc: <ChevronUp className="w-3 h-3 ml-1 inline" />,
                      desc: <ChevronDown className="w-3 h-3 ml-1 inline" />,
                    }[header.column.getIsSorted() as string] ?? null}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => {
              const isSelected = selectedRow === row.original
              return (
                <tr
                  key={row.id}
                  className={cn(
                    'border-b border-neutral-800 cursor-pointer hover:bg-white',
                    isSelected && 'bg-primary-50'
                  )}
                  onClick={() => onRowSelect?.(row.original)}
                >
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      className={cn('not-last:border-r border-neutral-800 px-2 py-1', isSelected && 'bg-primary-50')}
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* === СТАТУС-БАР === */}
      <div className="flex items-center justify-between p-2 bg-neutral-200 border-x border-b border-neutral-800">
        <span className="text-xs text-gray-600">
          Всього записів: {data.length}
          {/* {table.getFilteredRowModel().rows.length} з {data.length} записів */}
        </span>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xs">Рядків на сторінці:</span>
            <select
              value={table.getState().pagination.pageSize}
              onChange={(e) => {
                table.setPageSize(Number(e.target.value))
              }}
              className="h-6 px-2 text-xs border border-neutral-800 rounded-sm bg-neutral-100"
            >
              {pageSizeOptions.map((pageSize) => (
                <option key={pageSize} value={pageSize}>
                  {pageSize}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs">
              Сторінка {table.getState().pagination.pageIndex + 1} з {table.getPageCount()}
            </span>

            <Button
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="h-6 px-2 text-xs"
            >
              <ArrowLeft className="w-3 h-3" />
            </Button>

            <Button
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="h-6 px-2 text-xs"
            >
              <ArrowRight className="w-3 h-3" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
