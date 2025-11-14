import * as React from "react";
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { Folder, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface DataTableProps<TData> {
  columns: ColumnDef<TData>[];
  data: TData[];
  selectedRow?: TData | null;
  onRowSelect?: (row: TData) => void;
}

export function DataTable<TData>({
  columns,
  data,
  selectedRow,
  onRowSelect,
}: DataTableProps<TData>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="flex flex-col h-full rounded-[4px] overflow-hidden">
      {/* === ТАБЛИЦЯ === */}
      <div className="flex-1 overflow-auto border border-[#C0C0C0] bg-white">
        <table className="w-full border-collapse text-[13px]">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="bg-[#F0F0F0] border [&>*:not(:last-child)]:border-r-[#C0C0C0] px-2 py-1 text-left font-medium"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
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
                    "border-b border-[#C0C0C0] cursor-pointer",
                    isSelected && "bg-[#FFFFCC]"
                  )}
                  onClick={() => onRowSelect?.(row.original)}
                >
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      className={cn(
                        "border-r border-b-[#C0C0C0] px-2 py-1",
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

      {/* === СТАТУС-БАР === */}
      <div className="h-6 bg-[#E6E6E6] border-b border-x border-[#C0C0C0] flex items-center px-2 text-xs text-gray-700">
        <span>
          Всього елементів: <strong>73</strong>. Показано: <strong>20</strong>
        </span>
      </div>
    </div>
  );
}
