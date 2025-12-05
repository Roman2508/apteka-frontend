import { Plus, Upload, Trash2 } from "lucide-react"
import { useState, useEffect, useCallback, useRef } from "react"
import { toast } from "sonner"

import editIcon from "../assets/icons/pencil.svg"
import refreshIcon from "../assets/icons/rotate.svg"
import createIcon from "../assets/icons/file-copy.svg"
import { ConfigurablePage } from "../components/custom/configurable-page.tsx"
import type { DynamicToolbarProps } from "../components/custom/dynamic-toolbar.tsx"
import { columns } from "../components/common/medical-products-page/medical-products-table-config.tsx"
import { useNavigate } from "react-router"
import { useProducts, useDeleteProduct, useImportExcel } from "../hooks/use-medical-products"

const MedicalProductsPage = () => {
  const navigate = useNavigate()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [globalFilter, setGlobalFilter] = useState("")
  const { data: products, isLoading, refetch } = useProducts()
  const deleteProduct = useDeleteProduct()
  const importExcel = useImportExcel()

  const tableData = products || []

  const handleExcelUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    importExcel.mutate(file, {
      onSuccess: (result) => {
        toast.success(`Імпорт завершено: ${result.success} успішно, ${result.failed} помилок`)
        if (result.errors.length > 0) {
          console.error("Import errors:", result.errors)
        }
      },
      onError: (error: any) => {
        toast.error(error.response?.data?.message || "Помилка імпорту")
      },
    })

    // Reset input
    event.target.value = ""
  }

  const topToolbarConfig: DynamicToolbarProps = {
    title: "Управління номенклатурою",
    hideActionsMenu: true,
  }

  const innerToolbarConfig: DynamicToolbarProps = {
    search: {
      value: globalFilter,
      onChange: setGlobalFilter,
      placeholder: "Пошук (Shift+F)",
    },
    items: [
      [
        {
          label: "Створити",
          icon: <Plus className="w-3.5 h-3.5" />,
          onClick: () => navigate("/medical-products/create"),
          variant: "primary",
        },
        {
          label: "Завантажити з файлу",
          icon: <Upload className="w-3.5 h-3.5" />,
          onClick: () => fileInputRef.current?.click(),
          variant: "default",
          disabled: importExcel.isPending,
        },
        {
          label: "Експорт",
          icon: null,
          onClick: () => toast.info("Функція експорту в розробці"),
          variant: "default",
        },
        {
          label: "",
          icon: <img src={refreshIcon} className="w-4 h-4" />,
          onClick: () => refetch(),
          variant: "default",
        },
      ],
    ],
  }

  return (
    <div className="h-[calc(100vh-65px)] flex flex-col">
      <input ref={fileInputRef} type="file" accept=".xlsx,.xls" onChange={handleExcelUpload} className="hidden" />
      <ConfigurablePage
        data={tableData}
        columns={columns}
        topToolbar={topToolbarConfig}
        innerToolbar={innerToolbarConfig}
        globalFilter={globalFilter}
        setGlobalFilter={setGlobalFilter}
        isLoading={isLoading || importExcel.isPending}
      />
    </div>
  )
}

export default MedicalProductsPage
