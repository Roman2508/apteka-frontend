import { useParams, useNavigate, useSearchParams } from "react-router"
import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { ConfigurablePage } from "../components/custom/configurable-page"
import type { DynamicToolbarProps, ToolbarItem } from "../components/custom/dynamic-toolbar"
import { useScanStore } from "../stores/scan.store"
import { AcceptanceModal } from "../components/custom/scan/acceptance-modal"
import { DiscrepancyModal } from "../components/custom/scan/discrepancy-modal"
import { api } from "@/lib/api-client"
import { toast } from "sonner"
import { type ColumnDef } from "@tanstack/react-table"

// Types
interface DocumentItem {
  id: number
  medicalProduct: {
    id: number
    name: string
    dosage_value: string
    dosage_unit: string
    form: string
    photos: { id: number; filePath: string }[]
  }
  barcode: string
  batch_number: string
  expiry_date: string
  quantity_expected: number
  quantity_scanned: number
  quantity_accepted: number
  price: number
  is_discrepancy: boolean
  discrepancies?: { id: number; reason: string; quantity: number }[]
}

interface DocumentDetails {
  id: number
  document_number: string
  document_date: string
  status: string
  counterparty: { name: string }
  warehouse: { name: string }
  items: DocumentItem[]
}

const ReceivingVerificationPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [document, setDocument] = useState<DocumentDetails | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  // Scanning state
  const [isScanningMode, setIsScanningMode] = useState(false)
  const [scannedItem, setScannedItem] = useState<DocumentItem | null>(null)

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
      const { data } = await api.get<DocumentDetails>(`/documents/${id}`)
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

  const columns: ColumnDef<DocumentItem>[] = [
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
        return `${p.name} ${p.dosage_value || ""}${p.dosage_unit} (${p.form})`
      },
    },
    {
      accessorKey: "batch_number",
      header: "Серія",
    },
    {
      accessorKey: "expiry_date",
      header: "Термін придатності",
      cell: ({ row }) => new Date(row.original.expiry_date).toLocaleDateString(),
    },
    {
      accessorKey: "quantity_expected",
      header: "Очікувано",
    },
    {
      accessorKey: "quantity_scanned",
      header: "Відскановано",
    },
    {
      accessorKey: "quantity_accepted",
      header: "Прийнято",
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

  const topToolbar: DynamicToolbarProps = {
    title: `Приймання: ${document?.document_number || "..."}`,
    items: toolbarItems,
  }

  return (
    <>
      <div className="h-[calc(100vh-65px)] flex flex-col">
        {/* Helper Header Info */}
        {document && (
          <div className="bg-white p-4 grid grid-cols-4 gap-4 border-b text-sm">
            <div>
              <span className="text-gray-500 block">Постачальник</span>
              <span className="font-medium">{document.counterparty.name}</span>
            </div>
            <div>
              <span className="text-gray-500 block">Склад</span>
              <span className="font-medium">{document.warehouse.name}</span>
            </div>
            <div>
              <span className="text-gray-500 block">Дата</span>
              <span className="font-medium">{new Date(document.document_date).toLocaleDateString()}</span>
            </div>
            <div>
              <span className="text-gray-500 block">Статус</span>
              <span className="font-medium">{document.status}</span>
            </div>
          </div>
        )}

        {isScanningMode && (
          <div className="bg-blue-50 p-2 text-center text-blue-700 animate-in fade-in">Очікування сканування товару...</div>
        )}

        <ConfigurablePage
          data={
            document?.items.filter((item) => {
              const mode = searchParams.get("mode")
              if (mode === "accepted") return item.quantity_accepted > 0
              if (mode === "discrepancy") return item.is_discrepancy
              return true
            }) || []
          }
          columns={columns}
          topToolbar={topToolbar}
          isLoading={isLoading}
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
