import axios from "axios"
import { toast } from "sonner"
import { useState, useRef } from "react"
import { useNavigate } from "react-router"
import { Plus, Upload, HelpCircle, Download } from "lucide-react"

import refreshIcon from "../assets/icons/rotate.svg"
import { ImportHelpModal } from "../components/modals/import-help-modal"
import { ConfigurablePage } from "../components/custom/configurable-page.tsx"
import type { DynamicToolbarProps } from "../components/custom/dynamic-toolbar.tsx"
import { columns } from "../components/common/medical-products-page/medical-products-table-config.tsx"
import { useProducts, useDeleteProduct, useImportExcel } from "../hooks/api/use-medical-products.ts"

const MedicalProductsPage = () => {
  const navigate = useNavigate()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [globalFilter, setGlobalFilter] = useState("")
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false)

  const { data: products, isLoading, refetch } = useProducts()
  // const deleteProduct = useDeleteProduct() // Unused
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

  const handleExport = async () => {
    try {
      const baseUrl = import.meta.env.BASE_URL || "http://localhost:7777"
      const response = await axios.get(`${baseUrl}/medical-products/export-excel`, { responseType: "blob" })

      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement("a")
      link.href = url

      // Get filename from header or generate default
      const contentDisposition = response.headers["content-disposition"]
      let filename = `medical_products_${new Date().toISOString().split("T")[0]}.xlsx`

      if (contentDisposition) {
        const matches = contentDisposition.match(/filename="?([^"]+)"?/)
        if (matches && matches[1]) {
          filename = matches[1]
        }
      }

      link.setAttribute("download", filename)
      document.body.appendChild(link)
      link.click()
      link.parentNode?.removeChild(link)
    } catch (error) {
      console.error("Export error:", error)
      toast.error("Помилка експорту файлу")
    }
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
          icon: <Download className="w-3.5 h-3.5" />,
          onClick: () => fileInputRef.current?.click(),
          variant: "default",
          disabled: importExcel.isPending,
        },
        {
          label: "",
          icon: <HelpCircle className="w-4 h-4 text-muted-foreground" />,
          onClick: () => setIsHelpModalOpen(true),
          variant: "default",
          className: "px-2",
          title: "Інструкція з імпорту",
        },
        {
          label: "Експорт",
          icon: <Upload className="w-3.5 h-3.5" />,
          onClick: handleExport,
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

  // Custom actions that override default modal behavior
  const customActions = {
    create: () => {
      navigate("/medical-products/create")
      return false // Prevent default modal
    },
    copy: (row: any) => {
      if (row) {
        navigate("/medical-products/create", { state: { copyFrom: row } })
      }
      return false
    },
    edit: (row: any) => {
      if (row?.id) {
        navigate(`/medical-products/${row.id}`)
      }
      return false
    },
    refresh: () => {
      refetch()
      return false // Prevent default page reload
    },
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
        customActions={customActions}
      />
      <ImportHelpModal open={isHelpModalOpen} onOpenChange={setIsHelpModalOpen} />
    </div>
  )
}

export default MedicalProductsPage
