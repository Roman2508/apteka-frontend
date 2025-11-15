import * as React from "react";
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
} from "@tanstack/react-table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ChevronUp, ChevronDown, Search } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Folder, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface TemplateTableProps<TData> {
  columns: ColumnDef<TData>[];
  data: TData[];
  selectedRow?: TData | null;
  onRowSelect?: (row: TData) => void;
  pageSizeOptions?: number[];
  defaultPageSize?: number;
  searchPlaceholder?: string;
}

export function TemplateTable<TData>({
  columns,
  data,
  selectedRow,
  onRowSelect,
  pageSizeOptions = [10, 20, 50],
  defaultPageSize = 10,
  searchPlaceholder = "Пошук...",
}: TemplateTableProps<TData>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [globalFilter, setGlobalFilter] = React.useState("");

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
    globalFilterFn: "includesString", // Пошук по рядку
  });

  return (
    <div className="flex flex-col h-full font-1c text-sm">
      {/* === ПОШУК === */}
      <div className="flex items-center gap-2 p-2 bg-[#F5F5F5] border-b border-[#C0C0C0]">
        <Input
          placeholder={searchPlaceholder}
          value={globalFilter ?? ""}
          onChange={(event) => setGlobalFilter(String(event.target.value))}
          className="h-7 w-64 max-w-full"
        />
        <Search className="w-4 h-4 text-gray-500" />
        <div className="flex-1" />
        <span className="text-xs text-gray-600">
          {table.getFilteredRowModel().rows.length} з {data.length} записів
        </span>
      </div>

      {/* === ТАБЛИЦЯ === */}
      <div className="flex-1 overflow-auto border border-[#C0C0C0] bg-white">
        <table className="w-full border-collapse">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="bg-[#F0F0F0] border border-[#C0C0C0] px-2 py-1 text-left font-medium relative"
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
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
              const isSelected = selectedRow === row.original;
              return (
                <tr
                  key={row.id}
                  className={cn(
                    "border-b border-[#C0C0C0] cursor-pointer hover:bg-[#F9F9F9]",
                    isSelected && "bg-[#FFFFCC]"
                  )}
                  onClick={() => onRowSelect?.(row.original)}
                >
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      className={cn(
                        "border-r border-[#C0C0C0] px-2 py-1",
                        isSelected && "bg-[#FFFFCC]"
                      )}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* === ПАГИНАЦІЯ === */}
      <div className="flex items-center justify-between p-2 bg-[#F5F5F5] border-t border-[#C0C0C0]">
        <div className="flex items-center gap-2">
          <span className="text-xs">Рядків на сторінці:</span>
          <select
            value={table.getState().pagination.pageSize}
            onChange={(e) => {
              table.setPageSize(Number(e.target.value));
            }}
            className="h-6 px-2 text-xs border border-[#C0C0C0] rounded-none bg-white"
          >
            {pageSizeOptions.map((pageSize) => (
              <option key={pageSize} value={pageSize}>
                {pageSize}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-1">
          <Button
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="h-6 px-2 text-xs"
          >
            ←
          </Button>
          <Button
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="h-6 px-2 text-xs"
          >
            →
          </Button>
          <span className="text-xs">
            Сторінка {table.getState().pagination.pageIndex + 1} з{" "}
            {table.getPageCount()}
          </span>
        </div>
      </div>

      {/* === СТАТУС-БАР === */}
      <div className="h-6 bg-[#E6E6E6] border-t border-[#C0C0C0] flex items-center px-2 text-xs text-gray-700">
        <span>
          Поточні виклки: <strong>0</strong> Накопичені виклки:{" "}
          <strong>{data.length}</strong>
        </span>
      </div>
    </div>
  );
}
