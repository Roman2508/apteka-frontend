import { useMemo, useRef } from "react"
import { type ColumnDef } from "@tanstack/react-table"
import { Download, HelpCircle, Upload } from "lucide-react"

import {
  type Pharmacy,
  usePharmacies,
  useCreatePharmacy,
  useDeletePharmacy,
  useUpdatePharmacy,
} from "@/hooks/api/use-pharmacies"
import { useUsers } from "@/hooks/api/use-users"
import { formatDate } from "@/helpers/format-date"
import { usePharmacyChains } from "@/hooks/api/use-pharmacy-chains"
import { ConfigurablePage, type ConfigurablePageRef } from "@/components/custom/configurable-page"

const PharmaciesPage = () => {
  const { data: pharmacies, isLoading } = usePharmacies()
  const createMutation = useCreatePharmacy()
  const updateMutation = useUpdatePharmacy()
  const deleteMutation = useDeletePharmacy()

  const { data: users } = useUsers()
  const { data: chains } = usePharmacyChains()

  const pageRef = useRef<ConfigurablePageRef>(null)

  const handleEntitySave = async (data: Pharmacy, mode: "create" | "edit" | "copy") => {
    try {
      const { id, ...rest } = data
      if (mode === "create" || mode === "copy") {
        // @ts-ignore
        await createMutation.mutateAsync(rest)
      } else if (mode === "edit") {
        await updateMutation.mutateAsync({ id, data: rest })
      }
    } catch (error) {
      console.error("Failed to save pharmacy chain:", error)
      alert("Помилка при збереженні мережі")
    }
  }

  const customActions = {
    delete: (row: Pharmacy | null) => {
      if (row) {
        if (confirm("Ви впевнені, що хочете видалити цю мережу?")) {
          deleteMutation.mutate(row.id)
        }
      }
      return false // prevent default delete
    },
  }

  const columns: ColumnDef<Pharmacy>[] = useMemo(
    () => [
      {
        accessorKey: "number",
        header: "Номер",
        meta: { form: { type: "text", required: true, placeholder: "Введіть номер" } },
      },
      {
        accessorKey: "chainId",
        header: "Мережа",
        meta: {
          form: {
            type: "select",
            required: true,
            options: chains?.map((chain) => ({ label: chain.name, value: chain.id })) || [],
            placeholder: "Виберіть",
          },
        },
        cell: ({ row }) => {
          return row?.original?.chain?.name ? row?.original?.chain?.name : "-"
        },
      },
      {
        accessorKey: "address",
        header: "Адреса",
        meta: { form: { type: "text", required: true, placeholder: "Введіть адресу" } },
      },
      {
        accessorKey: "ownerId",
        header: "Зав.аптеки",
        meta: {
          form: {
            type: "select",
            required: true,
            options: users?.map((user) => ({ label: user.full_name, value: user.id })) || [],
            placeholder: "Виберіть",
          },
        },
        cell: ({ row }) => {
          return row?.original?.owner?.full_name ? row.original.owner.full_name : "-"
        },
      },
      {
        accessorKey: "createdAt",
        header: "Дата створення",
        cell: ({ getValue }) => {
          const date = getValue<string>()
          if (date) return formatDate(date, "long")
          return "-"
        },
        meta: { form: { hidden: true, type: "text", placeholder: "Дата створення", readonly: true } },
      },
    ],
    [chains, users],
  )

  return (
    <ConfigurablePage
      ref={pageRef}
      data={pharmacies || []}
      columns={columns}
      isLoading={isLoading}
      onEntitySave={handleEntitySave}
      customActions={customActions}
      topToolbar={{
        title: "Аптечні пункти",
        items: [
          [
            {
              label: "Додати аптечний пункт",
              onClick: () => pageRef.current?.openModal("create"),
              variant: "primary",
            },
            {
              label: "Завантажити з файлу",
              icon: <Download className="w-3.5 h-3.5" />,
              // onClick: () => fileInputRef.current?.click(),
              variant: "default",
              // disabled: importExcel.isPending,
            },
            {
              label: "",
              icon: <HelpCircle className="w-4 h-4 text-muted-foreground" />,
              // onClick: () => setIsHelpModalOpen(true),
              variant: "default",
              className: "px-2",
              title: "Інструкція з імпорту",
            },
            {
              label: "Експорт",
              icon: <Upload className="w-3.5 h-3.5" />,
              // onClick: handleExport,
              variant: "default",
            },
          ],
        ],
      }}
    />
  )
}

export default PharmaciesPage
