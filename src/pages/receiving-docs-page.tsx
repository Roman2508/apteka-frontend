import { useSearchParams } from "react-router"
import { useState, useEffect, useCallback } from "react"

import editIcon from "../assets/icons/pencil.svg"
import { useScanStore } from "../stores/scan.store"
import refreshIcon from "../assets/icons/rotate.svg"
import createIcon from "../assets/icons/file-copy.svg"
import { UsbScanModal } from "../components/custom/scan/usb-scan-modal"
import { ConfigurablePage } from "../components/custom/configurable-page.tsx"
import { VerificationModal } from "../components/custom/scan/verification-modal"
import type { DynamicToolbarProps } from "../components/custom/dynamic-toolbar.tsx"
import { data as initialData, columns } from "../components/custom/table-config.tsx"
import {
  inboundDocumentsTableColumns,
  data as inboundDocumentsTableData,
} from "../components/common/receiving-docs-page/inbound-documents-table-config.tsx"
import {
  expectedDeliveriesTableColumns,
  data as expectedDeliveriesTableData,
} from "@/components/common/receiving-docs-page/expected-deliveries-table-config.tsx"

const ReceivingDocsPage = () => {
  const [globalFilter, setGlobalFilter] = useState("")
  const [tableData, setTableData] = useState(initialData)
  const [isLoading, setIsLoading] = useState(false)
  const [filters, setFilters] = useState({ status: "", date: "" })
  const [usbScanModalOpen, setUsbScanModalOpen] = useState(false)
  const [verificationModalOpen, setVerificationModalOpen] = useState(false)
  const [verificationData, setVerificationData] = useState<any>(null)
  const [searchParams] = useSearchParams()

  const { connect, disconnect, updateStatus, scannedData, clearScannedData } = useScanStore()

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

  // Mock backend request
  const mockFetchData = useCallback(async (currentFilters: typeof filters) => {
    setIsLoading(true)
    console.log("Fetching data with filters:", currentFilters)

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Simulate filtering
    let filtered = [...initialData]
    if (currentFilters.status) {
      filtered = filtered.filter((item) => (item as any).status?.toLowerCase().includes(currentFilters.status.toLowerCase()))
    }

    setTableData(filtered)
    setIsLoading(false)
  }, [])

  // Initial load and filter change
  useEffect(() => {
    const timer = setTimeout(() => {
      mockFetchData(filters)
    }, 300) // Debounce 300ms

    return () => clearTimeout(timer)
  }, [filters, mockFetchData])

  const handleFilterChange = (key: keyof typeof filters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  const handleVerificationSave = () => {
    // TODO: Save to backend
    console.log("Saving invoice:", verificationData)

    // Add to table (mock)
    // setExpectedDeliveriesTableData([...expectedDeliveriesTableData, verificationData])

    // Close modal and clear data
    setVerificationModalOpen(false)
    setVerificationData(null)
    clearScannedData()

    alert("Накладну збережено!")
  }

  const handleUsbScan = (data: any) => {
    setVerificationData(data)
    setVerificationModalOpen(true)
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
          onClick: () => alert("Записати clicked"),
          variant: "default",
        },
      ],
    ],
  }

  const tabs = [
    {
      value: "inbound-documents",
      label: "Документи надходження",
      data: inboundDocumentsTableData,
      columns: inboundDocumentsTableColumns,
    },
    {
      value: "expected-deliveries",
      label: "Розпорядження",
      data: expectedDeliveriesTableData,
      columns: expectedDeliveriesTableColumns,
      innerToolbar: receivingDocsInnerToolbarConfig,
    },
    { value: "quality-issues", label: "Акти невідповідності", data: tableData, columns: columns },
  ]

  return (
    <>
      <UsbScanModal isOpen={usbScanModalOpen} onClose={() => setUsbScanModalOpen(false)} onScanComplete={handleUsbScan} />

      {verificationData && (
        <VerificationModal
          isOpen={verificationModalOpen}
          onClose={() => {
            setVerificationModalOpen(false)
            setVerificationData(null)
            clearScannedData()
          }}
          data={verificationData}
          onSave={handleVerificationSave}
        />
      )}

      <div className="h-[calc(100vh-65px)] flex flex-col">
        <ConfigurablePage
          data={tableData}
          columns={columns}
          tabs={tabs}
          topToolbar={topToolbarConfig}
          innerToolbar={innerToolbarConfig}
          globalFilter={globalFilter}
          setGlobalFilter={setGlobalFilter}
          isLoading={isLoading}
        />
      </div>
    </>
  )
}

export default ReceivingDocsPage
