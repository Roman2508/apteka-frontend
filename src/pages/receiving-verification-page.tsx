import { toast } from "sonner"
import { useForm } from "react-hook-form"
import { type ColumnDef } from "@tanstack/react-table"
import { useState, useEffect, useCallback } from "react"
import { useParams, useNavigate, useSearchParams } from "react-router"

import { api } from "@/lib/api-client"
import { Button } from "@/components/ui/button"
import { formatDate } from "@/helpers/format-date"
import { useScanStore } from "../stores/scan.store"
import { ConfigurablePage } from "../components/custom/configurable-page"
import { TemplateFormItem } from "@/components/custom/template-form-item"
import type { DocumentItemType, DocumentType } from "@/types/document.types"
import { AcceptanceModal } from "../components/custom/scan/acceptance-modal"
import { DiscrepancyModal } from "../components/custom/scan/discrepancy-modal"
import { transformMedicalProductForm } from "@/helpers/transform-medical-product-form"
import type { DynamicToolbarProps, ToolbarItem } from "../components/custom/dynamic-toolbar"

const ReceivingVerificationPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const [document, setDocument] = useState<DocumentType | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [globalFilter, setGlobalFilter] = useState("")

  // Scanning state
  const [isScanningMode, setIsScanningMode] = useState(false)
  const [scannedItem, setScannedItem] = useState<DocumentItemType | null>(null)

  // Modals
  const [acceptanceModalOpen, setAcceptanceModalOpen] = useState(false)
  const [discrepancyModalOpen, setDiscrepancyModalOpen] = useState(false)

  const { connect, disconnect, updateStatus, scannedData, clearScannedData } = useScanStore()

  // WebSocket connection
  useEffect(() => {
    connect()
    return () => disconnect()
  }, [connect, disconnect])

  // Update backend status
  useEffect(() => {
    if (isScanningMode) {
      updateStatus("ready", window.location.pathname)
    } else {
      updateStatus("not-ready", window.location.pathname)
    }
  }, [isScanningMode, updateStatus])

  // Handle incoming scan
  useEffect(() => {
    if (scannedData && isScanningMode && document) {
      handleScan(scannedData)
      clearScannedData()
    }
  }, [scannedData, isScanningMode, document])

  // Fetch document
  const fetchDocument = useCallback(async () => {
    if (!id) return
    setIsLoading(true)
    try {
      const { data } = await api.get<DocumentType>(`/documents/${id}`)
      setDocument(data)
    } catch (e) {
      console.error(e)
      toast.error("Помилка завантаження документу")
    } finally {
      setIsLoading(false)
    }
  }, [id])

  useEffect(() => {
    fetchDocument()
  }, [fetchDocument])

  const handleScan = async (data: any) => {
    // Data expected: { batch_id: string, quantity: number }
    if (!document || !id) return

    const batchId = data.batch_id
    if (!batchId) {
      toast.error("Невірний формат QR коду")
      return
    }

    try {
      const res = await api.post(`/documents/${id}/validate-product`, { batchNumber: batchId })
      const item = res.data
      setScannedItem(item)
      setAcceptanceModalOpen(true)
    } catch (e: any) {
      console.error(e)
      toast.error(e.response?.data?.message || "Товар не знайдено або помилка")
    }
  }

  const handleAcceptItem = async (qty: number = 1) => {
    if (!scannedItem) return
    try {
      await api.post(`/documents/items/${scannedItem.id}/accept`, { quantity: qty })
      toast.success("Товар прийнято")
      setAcceptanceModalOpen(false)
      setScannedItem(null)
      fetchDocument() // Refresh data
    } catch (e: any) {
      console.error(e)
      toast.error(e.response?.data?.message || "Помилка прийняття товару")
    }
  }

  const submitDiscrepancy = async (data: any) => {
    if (!scannedItem) return
    try {
      await api.post(`/documents/discrepancy`, data)
      toast.success("Невідповідність зафіксовано")
      setDiscrepancyModalOpen(false)
      setScannedItem(null)
      fetchDocument()
    } catch (e: any) {
      console.error(e)
      toast.error(e.response?.data?.message || "Помилка фіксації невідповідності")
    }
  }

  const handleComplete = async () => {
    if (!confirm("Завершити приймання?")) return
    try {
      await api.post(`/documents/${id}/complete`)
      toast.success("Приймання завершено")
      navigate("/receiving-docs?tab=inbound-documents")
    } catch (e: any) {
      toast.error(e.response?.data?.message || "Помилка завершення")
    }
  }

  const handleCancelDiscrepancy = async (discrepancyId: number) => {
    if (!confirm("Скасувати невідповідність?")) return
    try {
      await api.post(`/documents/discrepancy/${discrepancyId}/cancel`)
      toast.success("Невідповідність скасовано")
      fetchDocument()
    } catch (e: any) {
      toast.error(e.response?.data?.message || "Помилка скасування")
    }
  }

  const handleCreateReturn = async () => {
    if (!confirm("Створити документ на повернення?")) return
    try {
      await api.post(`/documents/${id}/return`)
      toast.success("Документ на повернення створено")
      // Maybe navigate to it? Or stay here?
    } catch (e: any) {
      toast.error(e.response?.data?.message || "Помилка створення повернення")
    }
  }

  const mode = searchParams.get("mode") || "all"
  
  const columns: ColumnDef<DocumentItemType>[] = [
    {
      accessorKey: "id",
      header: "ID",
      cell: ({ row }) => {
        const item = row.original
        if (item.quantity_accepted >= item.quantity_expected) return <div className="text-green-600">✅ {item.id}</div>
        if (item.is_discrepancy) return <div className="text-red-600">⚠️ {item.id}</div>
        return item.id
      },
    },
    {
      accessorKey: "medicalProduct.name",
      header: "Назва товару",
      cell: ({ row }) => {
        const p = row.original.medicalProduct
        return `${p.name} ${p.dosage_value || ""}${p.dosage_unit} (${transformMedicalProductForm(p.form)})`
      },
    },
    {
      accessorKey: "medicalProduct.manufacturer.name",
      header: "Виробник",
      cell: ({ row }) => {
        const p = row.original.medicalProduct
        return p?.manufacturer?.name ? p.manufacturer.name : "-"
      },
    },
    {
      accessorKey: "batch.batch_number",
      header: "Серія",
      cell: ({ row }) => {
        const batch = row.original.batch
        return batch?.batch_number ? `${batch.batch_number} ${batch.manufacture_date}` : "-"
      },
    },
    {
      accessorKey: "quantity_expected",
      header: "Кількість упаковок",
    },
    {
      accessorKey: "medicalProduct.vat_rate",
      header: "ПДВ",
    },
    {
      accessorKey: "price",
      header: "Ціна",
    },
  ]

  if (mode === "discrepancy") {
    columns.push({
      id: "actions",
      header: "Дії",
      cell: ({ row }) => {
        const discrepancies = row.original.discrepancies
        if (!discrepancies || !discrepancies.length) return null
        return (
          <Button size="sm" variant="outline" onClick={() => handleCancelDiscrepancy(discrepancies[0].id)}>
            Скасувати
          </Button>
        )
      },
    })
  }

  const toolbarItems: ToolbarItem[][] = []

  if (mode === "all") {
    toolbarItems.push([
      {
        label: "Сканувати",
        onClick: () => setIsScanningMode(!isScanningMode),
        variant: isScanningMode ? "primary" : "default",
        icon: isScanningMode ? <span className="animate-pulse">🔴</span> : undefined,
      },
      {
        label: "Завершити приймання",
        onClick: handleComplete,
        variant: "outline",
      },
    ])
  }

  if (mode === "discrepancy") {
    toolbarItems.push([
      {
        label: "Оформити повернення",
        onClick: handleCreateReturn,
        variant: "default",
      },
    ])
  }

  const form = useForm<DocumentType>({})

  const topToolbar: DynamicToolbarProps = {
    title: `Надходження товарів: №${document?.document_number || "..."} від ${formatDate(
      document?.document_date,
      "long",
    )}`,
    items: [
      ...toolbarItems,
      [
        {
          type: "custom",
          content: (
            <div className="flex items-center gap-2 mr-10 mt-4">
              <TemplateFormItem
                readOnly
                type="text"
                label="Номер"
                placeholder="Номер"
                name="document_number"
                control={form.control}
                staticValue={document?.document_number}
                className="grid-cols-[80px_1fr] items-center py-0"
              />
            </div>
          ),
        },
        {
          type: "custom",
          content: (
            <div className="flex items-center gap-2 mt-4">
              <TemplateFormItem
                readOnly
                type="date"
                label="Від"
                placeholder="Від"
                name="document_date"
                control={form.control}
                className="grid-cols-[80px_1fr] items-center py-0"
                staticValue={formatDate(document?.document_date, "input")}
              />
            </div>
          ),
        },
      ],
      [
        {
          type: "custom",
          content: (
            <div className="flex items-center gap-2 mr-10 mt-1">
              <TemplateFormItem
                readOnly
                type="text"
                label="Контрагент"
                name="counterparty"
                placeholder="Контрагент"
                control={form.control}
                staticValue={document?.counterparty.name}
                className="grid-cols-[80px_1fr] items-center py-0"
              />
            </div>
          ),
        },
        {
          type: "custom",
          content: (
            <div className="flex items-center gap-2 mt-1">
              <TemplateFormItem
                readOnly
                name="chain"
                type="text"
                label="Організація"
                control={form.control}
                placeholder="Організація"
                staticValue={document?.pharmacy.chain.name}
                className="grid-cols-[80px_1fr] items-center py-0"
              />
            </div>
          ),
        },
      ],
      [
        {
          type: "custom",
          content: (
            <div className="flex items-center gap-2 mr-10 mt-1 mb-4">
              <TemplateFormItem
                readOnly
                type="text"
                label="Склад"
                name="warehouse"
                placeholder="Склад"
                control={form.control}
                staticValue={document?.warehouse.name}
                className="grid-cols-[80px_1fr] items-center py-0"
              />
            </div>
          ),
        },
        {
          type: "custom",
          content: (
            <div className="flex items-center gap-2 mt-1 mb-4">
              <TemplateFormItem
                readOnly
                name="inn"
                type="text"
                label="Підрозділ"
                placeholder="Підрозділ"
                control={form.control}
                className="grid-cols-[80px_1fr] items-center py-0"
                staticValue={`Аптека ${document?.pharmacy.number} - ${document?.pharmacy.address}`}
              />
            </div>
          ),
        },
      ],
    ],
  }

  const documentData =
    document?.items.filter((item) => {
      const mode = searchParams.get("mode")
      if (mode === "accepted") return item.quantity_accepted > 0
      if (mode === "discrepancy") return item.is_discrepancy
      return true
    }) || []

  return (
    <>
      <div className="h-[calc(100vh-65px)] flex flex-col">
        {isScanningMode && (
          <div className="bg-blue-50 p-2 mb-2 text-center text-blue-700 animate-in fade-in">
            Очікування сканування товару...
          </div>
        )}

        <ConfigurablePage
          data={documentData}
          columns={columns}
          topToolbar={topToolbar}
          isLoading={isLoading}
          globalFilter={globalFilter}
          setGlobalFilter={setGlobalFilter}
          hideActions={["create", "copy", "edit", "mark_delete", "delete"]}
        />
      </div>

      {/* Modals */}
      {scannedItem && (
        <AcceptanceModal
          isOpen={acceptanceModalOpen}
          onClose={() => {
            setAcceptanceModalOpen(false)
            setScannedItem(null)
          }}
          item={scannedItem}
          onAccept={handleAcceptItem}
          onDiscrepancy={() => {
            setAcceptanceModalOpen(false)
            setDiscrepancyModalOpen(true)
          }}
        />
      )}

      {scannedItem && (
        <DiscrepancyModal
          isOpen={discrepancyModalOpen}
          onClose={() => {
            setDiscrepancyModalOpen(false)
            setScannedItem(null)
          }}
          item={scannedItem}
          onSubmit={submitDiscrepancy}
        />
      )}
    </>
  )
}

export default ReceivingVerificationPage
