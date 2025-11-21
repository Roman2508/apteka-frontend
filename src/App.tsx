import { useState, useEffect, useCallback } from "react"
import { Plus } from "lucide-react"

import { Label } from "./components/ui/label"
import { Checkbox } from "./components/ui/checkbox"
import { Input } from "./components/ui/input"
import { data as initialData, columns } from "./components/custom/table-config.tsx"
import { ConfigurableTable } from "./components/custom/configurable-table.tsx"
import type { DynamicToolbarProps } from "./components/custom/dynamic-toolbar.tsx"

function App() {
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

  const tabs = [
    { value: "tab1", label: "Документи відвантаження" },
    { value: "tab2", label: "Переміщення товарів" },
    { value: "tab3", label: "Реалізація товарів" },
    { value: "tab4", label: "Повернення товарів" },
  ]

  const topToolbarConfig: DynamicToolbarProps = {
    title: "Документи прийому",
    search: {
      value: globalFilter,
      onChange: setGlobalFilter,
      placeholder: "Пошук (Shift+F)",
    },
    items: [
      [
        {
          label: "Створити",
          icon: <Plus className="w-3 h-3" />,
          onClick: () => alert("Створити clicked"),
          variant: "default" as const,
        },
        {
          label: "Записати в документ",
          icon: <Plus className="w-3 h-3" />,
          onClick: () => alert("Записати clicked"),
          variant: "default" as const,
        },
      ],
      [
        {
          type: "custom",
          content: (
            <div className="flex items-center gap-2">
              <Input
                placeholder="Статус..."
                className="h-8 w-[150px]"
                value={filters.status}
                onChange={(e) => handleFilterChange("status", e.target.value)}
              />
            </div>
          ),
        },
        {
          type: "custom",
          content: (
            <div className="flex items-center gap-2">
              <Input
                type="date"
                className="h-8 w-[150px]"
                value={filters.date}
                onChange={(e) => handleFilterChange("date", e.target.value)}
              />
            </div>
          ),
        },
        {
          type: "custom",
          content: (
            <div className="flex items-center gap-2 border border-dashed border-neutral-300 px-2 py-1 rounded-sm ml-4">
              <Checkbox id="test-checkbox" />
              <Label htmlFor="test-checkbox" className="text-xs cursor-pointer">
                Перевірити наявність
              </Label>
            </div>
          ),
        },
      ],
    ],
  }

  return (
    <div className="h-[calc(100vh-65px)] flex flex-col overflow-hidden">
      <ConfigurableTable
        data={tableData}
        columns={columns}
        tabs={tabs}
        topToolbar={topToolbarConfig}
        innerToolbar={{ items: topToolbarConfig.items }}
        globalFilter={globalFilter}
        setGlobalFilter={setGlobalFilter}
        isLoading={isLoading}
      />
    </div>
  )
}

export default App
