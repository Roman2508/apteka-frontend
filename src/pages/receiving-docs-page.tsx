import { useState, useEffect, useCallback } from "react"

import editIcon from "../assets/icons/pencil.svg"
import refreshIcon from "../assets/icons/rotate.svg"
import createIcon from "../assets/icons/file-copy.svg"
import { ConfigurableTable } from "../components/custom/configurable-table.tsx"
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
  const [filters, setFilters] = useState({
    status: "",
    date: "",
  })

  // Mock backend request
  const mockFetchData = useCallback(async (currentFilters: typeof filters) => {
    setIsLoading(true)
    console.log("Fetching data with filters:", currentFilters)

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Simulate filtering
    let filtered = [...initialData]
    if (currentFilters.status) {
      filtered = filtered.filter((item) =>
        (item as any).status?.toLowerCase().includes(currentFilters.status.toLowerCase())
      )
    }
    // Add more mock filtering logic here if needed

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
          //   icon: null,
          onClick: () => alert("Записати clicked"),
          variant: "default",
        },
        {
          label: "Розміщення",
          //   icon: null,
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
    //   innerToolbar: { items: [], hideActionsMenu: true },
    },
    {
      value: "expected-deliveries",
      label: "Розпорядження",
      data: expectedDeliveriesTableData,
      columns: expectedDeliveriesTableColumns,
    },
    { value: "quality-issues", label: "Акти невідповідності", data: tableData, columns: columns },
  ]

  return (
    <div className="h-[calc(100vh-65px)] flex flex-col">
      <ConfigurableTable
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
  )
}

export default ReceivingDocsPage
