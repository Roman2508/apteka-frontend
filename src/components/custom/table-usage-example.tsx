import { useState } from "react";
import { Checkbox } from "../ui/checkbox";
import { TemplateTable } from "./template-table";
import { ChevronRight, Folder } from "lucide-react";
import { cn } from "@/lib/utils";

type Counterparty = {
  id: string;
  code: string;
  name: string;
  address: string;
  edrpou: string;
  type: string;
  active: boolean;
  isGroup?: boolean;
};

const data: Counterparty[] = [
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
    code: "00000003",
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
    id: "2",
    code: "",
    name: "Група: Постачальники",
    address: "",
    edrpou: "",
    type: "",
    active: false,
    isGroup: true,
  },
];

const columns = [
  // {
  //   id: "select",
  //   header: () => <div className="w-4" />,
  //   cell: () => <Checkbox className="translate-y-[1px]" />,
  //   enableSorting: false, // Вимкнути сортування для чекбокса
  // },
  {
    accessorKey: "code",
    header: "Код",
    cell: ({ row }: any) => {
      const isGroup = row.original.isGroup;
      return (
        <div className="flex items-center gap-1">
          {isGroup && <Folder className="w-4 h-4 text-[#808080]" />}
          {isGroup && <ChevronRight className="w-3 h-3" />}
          <span className={cn(isGroup && "font-medium")}>
            {row.original.code}
          </span>
        </div>
      );
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
];

export default function TableUsageExample() {
  const [selectedRow, setSelectedRow] = useState<Counterparty | null>(null);

  return (
    <div className="h-full">
      <TemplateTable
        columns={columns}
        data={data}
        selectedRow={selectedRow}
        onRowSelect={setSelectedRow}
        pageSizeOptions={[5, 10, 20]}
        defaultPageSize={5}
        searchPlaceholder="Пошук по контрагентах..."
      />
    </div>
  );
}
