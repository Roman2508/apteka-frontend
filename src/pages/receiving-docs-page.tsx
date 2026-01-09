import { toast } from "sonner"
import { useState, useEffect, useCallback } from "react"
import { useSearchParams, useNavigate } from "react-router"

import { api } from "@/lib/api-client"
import editIcon from "../assets/icons/pencil.svg"
import { useScanStore } from "../stores/scan.store"
import { useAuthStore } from "../stores/auth.store"
import refreshIcon from "../assets/icons/rotate.svg"
import createIcon from "../assets/icons/file-copy.svg"
import { UsbScanModal } from "../components/modals/scan/usb-scan-modal.tsx"
import { ConfigurablePage } from "../components/custom/configurable-page.tsx"
import { VerificationModal } from "../components/modals/scan/verification-modal.tsx"
import type { DynamicToolbarProps } from "../components/custom/dynamic-toolbar.tsx"
import { data as initialData, columns } from "../components/custom/table-config.tsx" // Keeping for columns definition if needed
import {
  type CreateDocumentDto,
  useCreateExpectedDeliveries,
  useDeleteExpectedDeliveries,
} from "@/hooks/api/use-documents.ts"
import { inboundDocumentsTableColumns } from "../components/common/receiving-docs-page/inbound-documents-table-config.tsx"
import { expectedDeliveriesTableColumns } from "@/components/common/receiving-docs-page/expected-deliveries-table-config.tsx"
import type { DocumentType } from "@/types/document.types.ts"
// import { useDocuments } from "@/hooks/api/use-documents.ts"

// const getReceivingDocsParams = (tab: string | null) => {
//   switch (tab) {
//     case "inbound-documents":
//       return { type: "incoming", status: "completed" }
//     case "expected-deliveries":
//       return { type: "incoming", status: "in_process" }
//     case "quality-issues":
//       return { type: "incoming", status: "completed", hasDiscrepancy: true }
//     default:
//       return { type: "incoming", status: "in_process" }
//   }
// }

const ReceivingDocsPage = () => {
  const [globalFilter, setGlobalFilter] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [usbScanModalOpen, setUsbScanModalOpen] = useState(false)
  const [verificationModalOpen, setVerificationModalOpen] = useState(false)
  const [verificationData, setVerificationData] = useState<any>(null)
  const [selectedRow, setSelectedRow] = useState<any | null>(null)
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  const { user } = useAuthStore()
  const { connect, disconnect, updateStatus, scannedData, clearScannedData } = useScanStore()

  const createExpectedDeliveries = useCreateExpectedDeliveries()
  const deleteExpectedDeliveries = useDeleteExpectedDeliveries()

  // const { data: documents } = useDocuments(getReceivingDocsParams(searchParams.get("tab")))

  // Connect to WebSocket on mount
  useEffect(() => {
    connect()
    return () => {
      disconnect()
    }
  }, [connect, disconnect])

  // Send status updates when location changes
  useEffect(() => {
    const currentLocation = window.location.pathname + window.location.search
    const currentTab = searchParams.get("tab")

    if (currentTab === "expected-deliveries") {
      updateStatus("ready", currentLocation)
    } else {
      updateStatus("not-ready", currentLocation)
    }
  }, [searchParams, updateStatus])

  // Handle incoming scan data from mobile
  useEffect(() => {
    if (scannedData) {
      setVerificationData(scannedData)
      setVerificationModalOpen(true)
    }
  }, [scannedData])

  const [inboundDocs, setInboundDocs] = useState([])
  const [expectedDeliveries, setExpectedDeliveries] = useState([])
  const [qualityIssues, setQualityIssues] = useState([])

  const fetchTabData = useCallback(async (tabName: string | null) => {
    setIsLoading(true)
    try {
      if (tabName === "inbound-documents" || !tabName) {
        // Tab 1: incoming & completed
        const { data } = await api.get("/documents", { params: { type: "incoming", status: "completed" } })
        setInboundDocs(data)
      }
      //
      else if (tabName === "expected-deliveries") {
        // Tab 2: incoming & in_process
        const { data } = await api.get("/documents", { params: { type: "incoming", status: "in_process" } })
        setExpectedDeliveries(data)
      }
      //
      else if (tabName === "quality-issues") {
        // Tab 3: incoming & expected (completed?) with discrepancy
        // Prompt said: Document.type = incoming & Document.status = completed, ... related DocumentItems determined as return
        const { data } = await api.get("/documents", {
          params: { type: "incoming", status: "completed", hasDiscrepancy: "true" },
        })
        setQualityIssues(data)
      }
    } catch (e: any) {
      console.error(e)
      toast.error("Помилка завантаження даних")
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Initial load and tab change listener
  useEffect(() => {
    const currentTab = searchParams.get("tab") || "expected-deliveries"
    fetchTabData(currentTab)
    // if (searchParams.get("tab") === "inbound-documents") {
    //   setInboundDocs(documents)
    // }
    // if (searchParams.get("tab") === "expected-deliveries") {
    //   setExpectedDeliveries(documents)
    // }
    // if (searchParams.get("tab") === "quality-issues") {
    //   setQualityIssues(documents)
    // }
  }, [searchParams /* , documents  */, fetchTabData])

  const handleVerificationSave = (verificationData: CreateDocumentDto) => {
    if (!user || !user.id) {
      alert("Помилка!")
    }
    // Мініфікований JSON з QR-кода:
    // {"code":346564,"counterpartyId":1,"counterpartyName":"ТОВ Фарма","count":6,"totalPrice":2912,"userId":2,"items":[{"id":1,"count":4,"price":78,"expiry_date":"2027-11-30 00:00:00","bartcode":"54789654","batch_number":"BT-H4RC4T","batchId":1},{"id":1,"count":2,"price":1300,"expiry_date":"2025-12-22 15:30:45.123","bartcode":"445675453","batch_number":"132","batchId":2}]}

    const { counterpartyName, ...data } = verificationData
    createExpectedDeliveries.mutateAsync({ ...data, userId: user.id })

    // Refresh current tab data
    // const currentTab = searchParams.get("tab")
    // fetchTabData(currentTab)

    // Close modal and clear data
    setVerificationModalOpen(false)
    setVerificationData(null)
    clearScannedData()

    // toast.success("Накладну збережено!")
  }

  const handleUsbScan = (data: any) => {
    setVerificationData(data)
    setVerificationModalOpen(true)
  }

  const onSelectDocument = (row: any | null) => {
    if (!row?.id) return
    let type = "expected-deliveries"
    if (searchParams.get("tab") === "quality-issues") type = "inbound-documents"
    if (searchParams.get("tab") === "inbound-documents") type = "quality-issues"

    navigate(`/receiving-docs/${type}/${row.id}`)
  }

  const topToolbarConfig: DynamicToolbarProps = {
    title: "Документи прийому",
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
          label: "",
          icon: <img src={createIcon} className="w-4 h-4" />,
          onClick: () => alert("Створити clicked"),
          variant: "default",
        },
        {
          label: "",
          icon: <img src={editIcon} className="w-4 h-4" />,
          onClick: () => alert("Створити clicked"),
          variant: "default",
        },
        {
          label: "",
          icon: <img src={refreshIcon} className="w-4 h-4" />,
          onClick: () => alert("Створити clicked"),
          variant: "default",
        },
        {
          label: "Товар в аптеці",
          onClick: () => alert("Записати clicked"),
          variant: "default",
        },
        {
          label: "Розміщення",
          onClick: () => alert("Записати clicked"),
          variant: "default",
        },
      ],
    ],
  }

  const receivingDocsInnerToolbarConfig: DynamicToolbarProps = {
    search: {
      value: globalFilter,
      onChange: setGlobalFilter,
      placeholder: "Пошук (Shift+F)",
    },
    items: [
      [
        {
          label: "Сканувати накладну",
          onClick: () => setUsbScanModalOpen(true),
          variant: "primary",
        },
        {
          label: "Перевірити документ",
          onClick: () => onSelectDocument(selectedRow),
          variant: "default",
        },
      ],
    ],
  }

  const tabs = [
    {
      value: "inbound-documents",
      label: "Документи надходження",
      data: inboundDocs,
      columns: inboundDocumentsTableColumns,
      innerToolbar: innerToolbarConfig, // Added standard search toolbar
    },
    {
      value: "expected-deliveries",
      label: "Розпорядження",
      data: expectedDeliveries,
      columns: expectedDeliveriesTableColumns,
      innerToolbar: receivingDocsInnerToolbarConfig,
    },
    {
      value: "quality-issues",
      label: "Акти невідповідності",
      data: qualityIssues,
      columns: columns, // TODO: might need specific columns for discrepancies
      innerToolbar: innerToolbarConfig,
    },
  ]

  return (
    <>
      <UsbScanModal
        isOpen={usbScanModalOpen}
        onClose={() => setUsbScanModalOpen(false)}
        onScanComplete={handleUsbScan}
      />

      {verificationData && (
        <VerificationModal
          isOpen={verificationModalOpen}
          onClose={() => {
            setVerificationModalOpen(false)
            setVerificationData(null)
            clearScannedData()
          }}
          data={verificationData}
          onSave={() => handleVerificationSave(verificationData)}
        />
      )}

      <div className="h-[calc(100vh-65px)] flex flex-col">
        <ConfigurablePage
          data={expectedDeliveries}
          columns={columns}
          tabs={tabs}
          topToolbar={topToolbarConfig}
          innerToolbar={innerToolbarConfig}
          globalFilter={globalFilter}
          setGlobalFilter={setGlobalFilter}
          // We pass empty array as default data, because data is controlled by tabs
          onRowSelect={(row) => onSelectDocument(row)}
          isLoading={isLoading}
          selectedRowProvider={setSelectedRow}
          defaultTab="expected-deliveries"
          customActions={{
            delete: (data: DocumentType) => deleteExpectedDeliveries.mutate(data.id),
          }}
          hideActions={["create", "copy", "edit", "mark_delete"]}
        />
      </div>
    </>
  )
}

export default ReceivingDocsPage

/*
        <ConfigurablePage
           data={tableData}
          columns={columns}
          tabs={tabs}
          topToolbar={topToolbarConfig}
          innerToolbar={innerToolbarConfig}
          globalFilter={globalFilter}
          setGlobalFilter={setGlobalFilter}
          isLoading={isLoading}
          defaultTab="expected-deliveries"
        />
*/
